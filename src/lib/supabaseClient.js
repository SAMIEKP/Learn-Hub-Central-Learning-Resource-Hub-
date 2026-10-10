import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
let clerkTokenGetter = null;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      accessToken: async () => clerkTokenGetter?.() || null,
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
  : null;

export function setClerkTokenGetter(getter) {
  clerkTokenGetter = getter;
}

export async function getClerkAccessToken() {
  return clerkTokenGetter?.() || null;
}

export function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add the required REACT_APP_SUPABASE environment variables.');
  }

  return supabase;
}

export async function clearSupabaseSession() {
  clerkTokenGetter = null;
}
