import { loadSocialFeed } from './social';
import { supabase } from '../lib/supabaseClient';

jest.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
    storage: {
      from: jest.fn(),
    },
  },
}));

function makeQuery(data) {
  const query = {
    select: jest.fn(() => query),
    order: jest.fn(() => query),
    limit: jest.fn(() => query),
    eq: jest.fn(() => query),
    in: jest.fn(() => query),
    then: (resolve, reject) => Promise.resolve({ data, error: null }).then(resolve, reject),
  };
  return query;
}

test('loads only the current user’s private feed settings and maps saved activity', async () => {
  const postId = '728a1d75-1c05-4fad-a9b2-dfa224aa5ad1';
  const commentId = 'a2696f53-7853-4d49-845d-91eb2c8ebc45';
  const replyId = '305217ed-4764-41f4-958a-d56a2a876f9a';
  const userId = 'student-1';
  const rows = {
    feed_posts: [{
      id: postId,
      post_type: 'image',
      author_id: userId,
      author_name: 'A. Banda',
      author_role: 'Student · Form 2',
      author_school: 'Central Secondary',
      author_avatar: 'AB',
      content: 'A study diagram',
      subject: 'Biology',
      department: 'Science',
      class_form: 'Form 2',
      topic: 'Cells',
      related_resource_id: null,
      image_path: `${userId}/diagram.jpeg`,
      image_alt: 'A labelled cell',
      image_caption: 'Cell revision',
      created_at: '2026-01-01T12:00:00.000Z',
    }],
    feed_comments: [
      { id: commentId, post_id: postId, parent_comment_id: null, author_id: userId, author_name: 'A. Banda', author_avatar: 'AB', content: 'Helpful?', created_at: '2026-01-01T12:05:00.000Z', updated_at: '2026-01-01T12:05:00.000Z' },
      { id: replyId, post_id: postId, parent_comment_id: commentId, author_id: 'student-2', author_name: 'M. Phiri', author_avatar: 'MP', content: 'Yes, thanks!', created_at: '2026-01-01T12:06:00.000Z', updated_at: '2026-01-01T12:06:00.000Z' },
    ],
    feed_reactions: [
      { post_id: postId, user_id: userId, reaction: 'like' },
      { post_id: postId, user_id: 'student-2', reaction: 'like' },
      { post_id: postId, user_id: userId, reaction: 'repost' },
    ],
    feed_comment_reactions: [
      { comment_id: commentId, user_id: userId },
      { comment_id: replyId, user_id: 'student-2' },
    ],
    feed_hidden_posts: [{ post_id: 'post-to-hide' }],
    feed_reports: [{ post_id: 'post-reported' }],
    feed_follows: [{ follower_id: userId, target_key: 'central-secondary', target_type: 'school', target_name: 'Central Secondary', target_school: 'Central Secondary' }],
  };
  const queries = Object.fromEntries(Object.entries(rows).map(([table, data]) => [table, makeQuery(data)]));
  supabase.from.mockImplementation((table) => queries[table]);
  supabase.storage.from.mockReturnValue({
    getPublicUrl: jest.fn((path) => ({ data: { publicUrl: `https://example.test/${path}` } })),
  });

  const result = await loadSocialFeed(userId);

  expect(queries.feed_hidden_posts.eq).toHaveBeenCalledWith('user_id', userId);
  expect(queries.feed_reports.eq).toHaveBeenCalledWith('reporter_id', userId);
  expect(queries.feed_follows.eq).toHaveBeenCalledWith('follower_id', userId);
  expect(result.posts[0]).toMatchObject({
    id: postId,
    image: `https://example.test/${userId}/diagram.jpeg`,
    likes: 1,
    shares: 0,
  });
  expect(result.interactions[postId]).toEqual({ liked: true, reposted: true });
  expect(result.commentsByPost[postId][0]).toMatchObject({
    id: commentId,
    liked: true,
    replies: [{ id: replyId, liked: false }],
  });
  expect(result.hiddenPostIds).toEqual(['post-to-hide']);
  expect(result.reportedPostIds).toEqual(['post-reported']);
  expect(result.follows[0].target_name).toBe('Central Secondary');
});
