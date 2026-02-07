import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Client for public/frontend use (with RLS enforced)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for backend/API use (bypasses RLS)
export const getSupabaseAdmin = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseServiceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Admin API routes will fail.');
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  });
};
