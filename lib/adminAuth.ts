// Admin authentication helper
import { supabase } from "./supabaseClient";

export async function checkAdminAccess() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { isAdmin: false, user: null };
    }

    // Get user profile with role
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return { isAdmin: false, user };
    }

    return { 
      isAdmin: profile.role === 'admin', 
      user,
      role: profile.role 
    };
  } catch (error) {
    console.error('Error checking admin access:', error);
    return { isAdmin: false, user: null };
  }
}

export async function requireAdmin() {
  const { isAdmin, user } = await checkAdminAccess();
  
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  return user;
}
