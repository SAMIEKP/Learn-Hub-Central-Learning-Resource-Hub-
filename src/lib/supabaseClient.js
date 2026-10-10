import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
let clerkSupabaseTokenGetter = null;
let clerkSessionTokenGetter = null;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      accessToken: async () => clerkSupabaseTokenGetter?.() || null,
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
  : null;

export function setClerkTokenGetter(getter) {
  clerkSupabaseTokenGetter = getter;
}

export function setClerkSessionTokenGetter(getter) {
  clerkSessionTokenGetter = getter;
}

export async function getClerkAccessToken() {
  return clerkSessionTokenGetter?.() || null;
}

export async function getClerkSupabaseToken() {
  return clerkSupabaseTokenGetter?.() || null;
}

export function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add the required REACT_APP_SUPABASE environment variables.');
  }

  return supabase;
}

export async function clearSupabaseSession() {
  clerkSupabaseTokenGetter = null;
  clerkSessionTokenGetter = null;
}
