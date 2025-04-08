
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserType, UserData } from '@/types/auth-types';

/**
 * Fetches user profile data from Supabase
 */
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('aadhaar, has_fingerprints')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return profileData;
  } catch (err) {
    console.error('Profile fetch error:', err);
    return null;
  }
};

/**
 * Updates a user's profile in Supabase
 */
export const updateUserProfile = async (userId: string, userData: UserData) => {
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        name: userData.name,
        aadhaar: userData.aadhaar,
        dob: userData.dob,
        gender: userData.gender,
        blood_group: userData.bloodGroup,
        height: userData.height ? Number(userData.height) : null,
        weight: userData.weight ? Number(userData.weight) : null,
        contact: userData.contact,
        address: userData.address,
        emergency_contact_name: userData.emergencyContactName,
        emergency_contact_relation: userData.emergencyContactRelation,
        emergency_contact_number: userData.emergencyContactNumber,
        has_fingerprints: userData.hasFingerprints || false
      })
      .eq('id', userId);
      
    if (profileError) {
      console.error('Error updating profile:', profileError);
      toast.error('Profile update failed');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Profile update error:', error);
    return false;
  }
};

/**
 * Adds user allergies to Supabase
 */
export const addUserAllergies = async (userId: string, allergies: string[]) => {
  if (!allergies || allergies.length === 0) return true;
  
  try {
    const allergiesPromises = allergies.map((name: string) => {
      return supabase.from('allergies').insert({
        user_id: userId,
        name: name,
        severity: 'medium' // Default severity
      });
    });
    
    await Promise.all(allergiesPromises);
    return true;
  } catch (allergyError) {
    console.error('Error saving allergies:', allergyError);
    return false;
  }
};

/**
 * Store user information in localStorage
 */
export const storeUserData = (userType: UserType, userEmail: string | null, userAadhaar: string | null, userData?: any) => {
  if (userEmail) {
    localStorage.setItem('userEmail', userEmail);
  }
  
  if (userAadhaar) {
    localStorage.setItem('userAadhaar', userAadhaar);
  }
  
  if (userType) {
    localStorage.setItem('userType', userType);
  }
  
  if (userData) {
    localStorage.setItem('userData', JSON.stringify(userData || {}));
  }
};

/**
 * Clear user information from localStorage
 */
export const clearUserData = () => {
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userAadhaar');
  localStorage.removeItem('userData');
  localStorage.removeItem('userType');
};
