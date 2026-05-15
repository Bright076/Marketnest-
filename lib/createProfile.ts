// Automatic Profile Creation Helper
// This creates a profile in the profiles table when a user signs up

import { supabase } from "./supabaseClient";

export interface ProfileData {
  id: string;
  email: string;
  full_name: string;
  phone: string;
}

/**
 * Creates a user profile in the profiles table
 * Call this after successful signup
 * Default role is "user"
 */
export async function createUserProfile(profileData: ProfileData) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: profileData.id,
          email: profileData.email,
          full_name: profileData.full_name,
          phone: profileData.phone,
          role: 'user', // Default role for new users
        }
      ])
      .select()
      .single();

    if (error) {
      // If profile already exists, that's okay
      if (error.code === '23505') {
        console.log('Profile already exists');
        return { success: true, data: null };
      }
      throw error;
    }

    console.log('Profile created successfully with role "user":', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating profile:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Gets a user's profile from the profiles table
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching profile:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Updates a user's profile
 */
export async function updateUserProfile(userId: string, updates: Partial<ProfileData>) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    console.log('Profile updated successfully:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error updating profile:', error.message);
    return { success: false, error: error.message };
  }
}
