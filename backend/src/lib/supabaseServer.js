import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

export const isSupabaseServerConfigured = Boolean(
  env.supabaseUrl && env.supabaseServiceRoleKey,
);

export const supabaseServer = isSupabaseServerConfigured
  ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
  : null;

export function requireSupabaseServer() {
  if (!supabaseServer) {
    throw new Error('The backend Supabase environment variables are not configured.');
  }

  return supabaseServer;
}
