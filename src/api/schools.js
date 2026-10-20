import { supabase } from '../lib/supabaseClient';

function requireSupabase() {
  if (!supabase) throw new Error('School selection requires a configured Learn Hub connection.');
  return supabase;
}

export async function listVerifiedSchools() {
  const { data, error } = await requireSupabase()
    .from('schools')
    .select('id,name,district')
    .order('name', { ascending: true });
  if (error) throw new Error('Unable to load verified schools. Please try again.');
  return data || [];
}

export async function requestSchoolMembership({ userId, schoolId, membershipRole = 'student' }) {
  if (!userId || !schoolId) throw new Error('Choose a verified school before continuing.');
  const { error } = await requireSupabase()
    .from('school_memberships')
    .insert({
      user_id: userId,
      school_id: schoolId,
      membership_role: membershipRole,
      status: 'pending',
    });
  if (error) {
    if (error.code === '23505') {
      throw new Error('You already have a membership request for this school.');
    }
    throw new Error('Unable to submit your school membership request. Please try again.');
  }
}
