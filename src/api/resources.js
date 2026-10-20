import { supabase } from '../lib/supabaseClient';

const RESOURCE_BUCKET = 'learnhub-resources';
const MAX_RESOURCE_SIZE_BYTES = 100 * 1024 * 1024;

function requireSupabase() {
  if (!supabase) throw new Error('Resource publishing requires a configured Learn Hub connection.');
  return supabase;
}

function safeFileName(fileName) {
  const normalized = fileName
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return normalized || 'resource';
}

function resourceTypeFor(postType) {
  if (postType === 'paper') return 'past_paper';
  return postType;
}

export async function submitResource({ userId, postType, values, file }) {
  if (!userId) throw new Error('Sign in before submitting a resource.');
  if (!file || typeof file.name !== 'string' || typeof file.size !== 'number') {
    throw new Error('Choose the resource file to upload.');
  }
  if (file.size > MAX_RESOURCE_SIZE_BYTES) {
    throw new Error('Choose a file smaller than 100 MB.');
  }

  const client = requireSupabase();
  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('school_id')
    .eq('id', userId)
    .single();
  if (profileError || !profile?.school_id) {
    throw new Error('Your school membership must be approved before you can publish resources.');
  }

  const filePath = `${userId}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { error: uploadError } = await client.storage
    .from(RESOURCE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });
  if (uploadError) throw new Error('Unable to upload the resource file. Please try again.');

  const { data, error: insertError } = await client
    .from('resources')
    .insert({
      contributor_id: userId,
      school_id: profile.school_id,
      title: values.title.trim(),
      description: values.description.trim(),
      subject: values.subject,
      resource_type: resourceTypeFor(postType),
      author: values.author || values.instructor || null,
      source: values.publisher || values.board || null,
      examination_year: values.year ? Number(values.year) : null,
      file_path: filePath,
      file_name: file.name,
      file_size_bytes: file.size,
      mime_type: file.type || 'application/octet-stream',
      verification_status: 'pending',
    })
    .select('*')
    .single();

  if (insertError) {
    await client.storage.from(RESOURCE_BUCKET).remove([filePath]);
    throw new Error('Unable to submit this resource for review. Please try again.');
  }
  return data;
}
