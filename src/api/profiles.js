import { supabase } from '../lib/supabaseClient';

const PROFILE_COLUMNS = 'id,full_name,role,school,form,department,subjects,avatar_path,bio,phone,registration_number';

export async function loadOrCreateProfile(user) {
  if (!supabase || !user?.id) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', user.id)
    .maybeSingle();
  if (error) throw error;
  if (data) return data;

  const name = user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ')
    || user.primaryEmailAddress?.emailAddress?.split('@')[0]
    || 'LearnHub Student';
  const { data: created, error: createError } = await supabase
    .from('profiles')
    .insert({ id: user.id, full_name: name })
    .select(PROFILE_COLUMNS)
    .single();
  if (createError) throw createError;
  return created;
}

export async function updateProfile(userId, profile) {
  if (!supabase || !userId) throw new Error('A signed-in LearnHub account is required.');
  const updates = {
    full_name: profile.name,
    school: profile.school,
    form: profile.form,
    department: profile.department,
    subjects: profile.subjects,
    phone: profile.phone,
    registration_number: profile.registrationNumber,
    bio: profile.bio,
  };
  if (profile.avatarPath) updates.avatar_path = profile.avatarPath;
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select(PROFILE_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}
