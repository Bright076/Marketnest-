import { createClient } from "@supabase/supabase-js";

// Use fallback values during build time, real values at runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);

// Helper function to clear invalid session
export const clearInvalidSession = async () => {
  try {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};