import { supabase } from '../lib/supabaseClient';
import { formatRelativeDate } from '../utils/date';

const IMAGE_BUCKET = 'learnhub-feed-images';

function requireSupabase() {
  if (!supabase) throw new Error('Learn Hub social features require authentication.');
  return supabase;
}

function ensureSuccess(error, message) {
  if (error) throw new Error(message);
}

function publicImageUrl(path) {
  if (!path) return '';
  return requireSupabase().storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

function mapComment(row, reactions, replies) {
  const commentReactions = reactions.filter((reaction) => reaction.comment_id === row.id);
  return {
    id: row.id,
    authorId: row.author_id,
    author: row.author_name,
    authorAvatar: row.author_avatar,
    content: row.content,
    likes: commentReactions.length,
    liked: commentReactions.some((reaction) => reaction.user_id === row.current_user_id),
    edited: row.updated_at !== row.created_at,
    createdDate: row.created_at,
    replies,
  };
}

export async function loadSocialFeed(userId) {
  const client = requireSupabase();
  const [postsResult, hiddenResult, reportsResult, followsResult] = await Promise.all([
    client.from('feed_posts').select('*').order('created_at', { ascending: false }).limit(100),
    client.from('feed_hidden_posts').select('post_id').eq('user_id', userId),
    client.from('feed_reports').select('post_id').eq('reporter_id', userId),
    client.from('feed_follows').select('*').eq('follower_id', userId),
  ]);
  ensureSuccess(postsResult.error, 'Unable to load the Discover feed.');
  ensureSuccess(hiddenResult.error, 'Unable to load hidden posts.');
  ensureSuccess(reportsResult.error, 'Unable to load submitted reports.');
  ensureSuccess(followsResult.error, 'Unable to load followed accounts.');

  const postsData = postsResult.data || [];
  const postIds = postsData.map((post) => post.id);
  const [commentsResult, reactionsResult] = postIds.length
    ? await Promise.all([
      client.from('feed_comments').select('*').in('post_id', postIds).order('created_at', { ascending: true }).limit(1000),
      client.from('feed_reactions').select('post_id,user_id,reaction').in('post_id', postIds).limit(5000),
    ])
    : [{ data: [], error: null }, { data: [], error: null }];
  ensureSuccess(commentsResult.error, 'Unable to load Discover comments.');
  ensureSuccess(reactionsResult.error, 'Unable to load Discover reactions.');

  const commentIds = (commentsResult.data || []).map((comment) => comment.id);
  const commentReactionsResult = commentIds.length
    ? await client.from('feed_comment_reactions').select('comment_id,user_id').in('comment_id', commentIds).limit(5000)
    : { data: [], error: null };
  ensureSuccess(commentReactionsResult.error, 'Unable to load comment reactions.');

  const reactions = reactionsResult.data || [];
  const commentReactions = commentReactionsResult.data || [];
  const comments = (commentsResult.data || []).map((comment) => ({ ...comment, current_user_id: userId }));
  const topLevelComments = comments.filter((comment) => !comment.parent_comment_id);
  const commentsByPost = {};

  for (const comment of topLevelComments) {
    const replies = comments
      .filter((reply) => reply.parent_comment_id === comment.id)
      .map((reply) => mapComment(reply, commentReactions, []));
    const mapped = mapComment(comment, commentReactions, replies);
    (commentsByPost[comment.post_id] ||= []).push(mapped);
  }

  const interactions = {};
  const posts = postsData.map((row) => {
    const postReactions = reactions.filter((reaction) => reaction.post_id === row.id);
    const liked = postReactions.some((reaction) => reaction.user_id === userId && reaction.reaction === 'like');
    const reposted = postReactions.some((reaction) => reaction.user_id === userId && reaction.reaction === 'repost');
    interactions[row.id] = { liked, reposted };
    return {
      id: row.id,
      type: row.post_type,
      authorId: row.author_id,
      author: row.author_name,
      authorRole: row.author_role,
      authorAvatar: row.author_avatar,
      school: row.author_school,
      time: formatRelativeDate(row.created_at),
      createdDate: row.created_at,
      content: row.content,
      subject: row.subject,
      department: row.department,
      classForm: row.class_form,
      topic: row.topic,
      relatedResource: row.related_resource_id,
      image: publicImageUrl(row.image_path),
      imagePath: row.image_path,
      imageAlt: row.image_alt,
      imageCaption: row.image_caption,
      likes: postReactions.filter((reaction) => reaction.reaction === 'like').length - Number(liked),
      comments: 0,
      shares: postReactions.filter((reaction) => reaction.reaction === 'repost').length - Number(reposted),
    };
  });

  return {
    posts,
    commentsByPost,
    interactions,
    hiddenPostIds: (hiddenResult.data || []).map((row) => row.post_id),
    reportedPostIds: (reportsResult.data || []).map((row) => row.post_id),
    follows: followsResult.data || [],
  };
}

export async function createSocialPost(post, imageDataUrl) {
  const client = requireSupabase();
  let imagePath = null;

  if (imageDataUrl) {
    const image = await fetch(imageDataUrl).then((response) => response.blob());
    const extension = image.type.split('/')[1] || 'jpg';
    imagePath = `${post.author_id}/${crypto.randomUUID()}.${extension}`;
    const { error } = await client.storage.from(IMAGE_BUCKET).upload(imagePath, image, {
      contentType: image.type,
      upsert: false,
    });
    ensureSuccess(error, 'Unable to upload the post image.');
  }

  const { data, error } = await client.from('feed_posts').insert({
    ...post,
    image_path: imagePath,
  }).select('*').single();

  if (error) {
    if (imagePath) {
      const cleanup = await client.storage.from(IMAGE_BUCKET).remove([imagePath]);
      if (cleanup.error) throw new Error('The post could not be saved and its uploaded image could not be removed.');
    }
    throw new Error('Unable to publish your post. Please try again.');
  }

  return {
    id: data.id,
    type: data.post_type,
    authorId: data.author_id,
    author: data.author_name,
    authorRole: data.author_role,
    authorAvatar: data.author_avatar,
    school: data.author_school,
    time: 'Just now',
    createdDate: data.created_at,
    content: data.content,
    subject: data.subject,
    department: data.department,
    classForm: data.class_form,
    topic: data.topic,
    relatedResource: data.related_resource_id,
    image: publicImageUrl(data.image_path),
    imagePath: data.image_path,
    imageAlt: data.image_alt,
    imageCaption: data.image_caption,
    likes: 0,
    comments: 0,
    shares: 0,
  };
}

export async function updateSocialPost(postId, content) {
  const { data, error } = await requireSupabase()
    .from('feed_posts')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', postId)
    .select('id')
    .single();
  ensureSuccess(error || !data, 'Unable to update your post. Please try again.');
}

export async function deleteSocialPost(postId, imagePath) {
  const client = requireSupabase();
  const { data, error } = await client.from('feed_posts')
    .delete()
    .eq('id', postId)
    .select('id')
    .single();
  ensureSuccess(error || !data, 'Unable to delete your post. Please try again.');
  if (imagePath) {
    const { error: storageError } = await client.storage.from(IMAGE_BUCKET).remove([imagePath]);
    if (storageError) return { imageCleanupFailed: true };
  }
  return { imageCleanupFailed: false };
}

export async function setSocialReaction(postId, userId, reaction, active) {
  const client = requireSupabase();
  if (active) {
    const { error } = await client.from('feed_reactions').insert({
      post_id: postId,
      user_id: userId,
      reaction,
    });
    ensureSuccess(error, 'Unable to save your reaction. Please try again.');
    return;
  }
  const { error } = await client.from('feed_reactions')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId)
    .eq('reaction', reaction);
  ensureSuccess(error, 'Unable to remove your reaction. Please try again.');
}

export async function createSocialComment(comment) {
  const { data, error } = await requireSupabase()
    .from('feed_comments')
    .insert(comment)
    .select('*')
    .single();
  ensureSuccess(error, 'Unable to post your comment. Please try again.');
  return { ...data, current_user_id: comment.author_id };
}

export async function setSocialCommentReaction(commentId, userId, active) {
  const client = requireSupabase();
  if (active) {
    const { error } = await client.from('feed_comment_reactions').insert({
      comment_id: commentId,
      user_id: userId,
    });
    ensureSuccess(error, 'Unable to save your comment reaction. Please try again.');
    return;
  }
  const { error } = await client.from('feed_comment_reactions')
    .delete()
    .eq('comment_id', commentId)
    .eq('user_id', userId);
  ensureSuccess(error, 'Unable to remove your comment reaction. Please try again.');
}

export async function updateSocialComment(commentId, content) {
  const { data, error } = await requireSupabase()
    .from('feed_comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .select('id')
    .single();
  ensureSuccess(error || !data, 'Unable to update your comment. Please try again.');
}

export async function deleteSocialComment(commentId) {
  const { data, error } = await requireSupabase().from('feed_comments')
    .delete()
    .eq('id', commentId)
    .select('id')
    .single();
  ensureSuccess(error || !data, 'Unable to delete your comment. Please try again.');
}

export async function hideSocialPost(postId, userId, hidden) {
  const client = requireSupabase();
  if (hidden) {
    const { error } = await client.from('feed_hidden_posts').insert({
      post_id: postId,
      user_id: userId,
    });
    ensureSuccess(error, 'Unable to hide this post. Please try again.');
    return;
  }
  const { error } = await client.from('feed_hidden_posts')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);
  ensureSuccess(error, 'Unable to restore this post. Please try again.');
}

export async function reportSocialPost(postId, reporterId, reason) {
  const { error } = await requireSupabase().from('feed_reports').insert({
    post_id: postId,
    reporter_id: reporterId,
    reason,
  });
  ensureSuccess(error, 'Unable to submit this report. Please try again.');
}

export async function setSocialFollow(follow, userId, following) {
  const client = requireSupabase();
  if (following) {
    const { error } = await client.from('feed_follows').insert({
      follower_id: userId,
      ...follow,
    });
    ensureSuccess(error, 'Unable to follow this account. Please try again.');
    return;
  }
  const { error } = await client.from('feed_follows')
    .delete()
    .eq('follower_id', userId)
    .eq('target_key', follow.target_key)
    .eq('target_type', follow.target_type);
  ensureSuccess(error, 'Unable to unfollow this account. Please try again.');
}

export async function submitSchoolMembershipRequest(request) {
  const { error } = await requireSupabase()
    .from('school_membership_requests')
    .insert(request);
  ensureSuccess(error, 'Unable to submit your school request. Please try again.');
}
