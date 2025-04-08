
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserType, UserData } from '@/types/auth-types';
import { updateUserProfile, addUserAllergies } from '@/utils/auth-utils';

/**
 * Register a new user
 */
export const registerUser = async (email: string, password: string, userData?: UserData): Promise<{
  success: boolean;
  userType?: UserType;
  userEmail?: string | null;
  session?: any;
}> => {
  try {
    console.log('Registering with:', { email, userData });
    // Determine if this is an organization registration
    const isOrganization = userData?.isOrganization || false;
    
    // Sign up without requiring email verification 
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData?.name,
          aadhaar: userData?.aadhaar,
          isOrganization: isOrganization
        },
        // Do not use email redirect for quicker registration
        emailRedirectTo: undefined
      }
    });
    
    if (error) {
      console.error('Registration error:', error);
      toast.error(error.message);
      return { success: false };
    }
    
    if (data.user) {
      console.log('User registered successfully:', data.user);
      
      // For individual users, update profile with additional user data
      if (!isOrganization && userData) {
        await updateUserProfile(data.user.id, userData);
        
        // If the user provided allergies, store them
        if (userData.allergies && userData.allergies.length > 0) {
          await addUserAllergies(data.user.id, userData.allergies);
        }
      } 
      
      // Auto-login the user after successful registration
      if (data.session) {
        console.log('Auto-login with session:', data.session);
        
        return { 
          success: true,
          userType: isOrganization ? 'organization' : 'individual',
          userEmail: data.user.email,
          session: data.session
        };
      } else {
        // If no session was created, try to sign in manually
        console.log('No session created, attempting manual signin');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error('Auto-login error:', signInError);
          toast.info('Account created! You can now log in with your credentials.');
          return { success: true };
        }
        
        if (signInData.session) {
          return {
            success: true,
            userType: isOrganization ? 'organization' : 'individual',
            userEmail: data.user.email,
            session: signInData.session
          };
        }
        
        toast.info('Account created! Please log in.');
        return { success: true };
      }
    }
    
    return { success: false };
  } catch (error: any) {
    console.error('Registration error:', error);
    toast.error(error.message || 'An error occurred during registration');
    return { success: false };
  }
};
