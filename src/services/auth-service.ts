
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserType, UserData, UserCredentials } from '@/types/auth-types';
import { updateUserProfile, addUserAllergies } from '@/utils/auth-utils';

/**
 * Login with various authentication methods
 */
export const loginUser = async (
  type: 'email' | 'aadhaar' | 'biometric' | 'organization', 
  credentials: UserCredentials
): Promise<{ success: boolean; userType?: UserType; userEmail?: string | null; userAadhaar?: string | null }> => {
  console.log('Login attempt:', { type, credentials });
  
  try {
    if (type === 'email') {
      return await handleEmailLogin(credentials);
    } else if (type === 'aadhaar') {
      return await handleAadhaarLogin(credentials);
    } else if (type === 'biometric') {
      return await handleBiometricLogin();
    } else if (type === 'organization') {
      return await handleOrganizationLogin(credentials);
    } else {
      toast.error('Invalid login method');
      return { success: false };
    }
  } catch (error: any) {
    console.error('Login error:', error);
    toast.error(error.message || 'An error occurred during login');
    return { success: false };
  }
};

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

/**
 * Handle email-based login
 */
const handleEmailLogin = async (credentials: UserCredentials): Promise<{ 
  success: boolean; 
  userType?: UserType; 
  userEmail?: string | null;
  userAadhaar?: string | null;
}> => {
  if (!credentials.email || !credentials.password) {
    toast.error('Please enter both email and password');
    return { success: false };
  }
  
  console.log('Attempting email login with:', { email: credentials.email });
  
  // Clear any existing session first to ensure a fresh login attempt
  await supabase.auth.signOut();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password
  });
  
  if (error) {
    console.error('Email login error:', error);
    toast.error('Invalid email or password');
    return { success: false };
  }
  
  if (data.user) {
    console.log('Email login success:', data.user);
    // Check if this is an individual user (not an organization)
    if (!data.user.user_metadata?.isOrganization) {
      toast.success('Login successful');
      return { 
        success: true,
        userType: 'individual',
        userEmail: data.user.email
      };
    } else {
      toast.error('This account is registered as an organization. Please use organization login.');
      await supabase.auth.signOut();
      return { success: false };
    }
  }
  
  toast.error('Login failed. User not found.');
  return { success: false };
};

/**
 * Handle Aadhaar-based login
 */
const handleAadhaarLogin = async (credentials: UserCredentials): Promise<{ 
  success: boolean; 
  userType?: UserType; 
  userEmail?: string | null;
  userAadhaar?: string | null;
}> => {
  console.log('Attempting Aadhaar login with:', { aadhaar: credentials.aadhaar });
  
  // In this demo version, we'll approve login if:
  // 1. An OTP was provided (credentials.otp exists and is 6 digits)
  // 2. OR we're just checking if the Aadhaar exists in the system
  
  const { data } = await supabase
    .from('profiles')
    .select('id, email, aadhaar')
    .eq('aadhaar', credentials.aadhaar)
    .maybeSingle();
    
  if (data && data.email) {
    // For demo purposes, simulate OTP verification
    if (credentials.otp && credentials.otp.length === 6) {
      console.log('Aadhaar OTP verification successful');
      // For this demo, we'll let them in with the OTP
      toast.success('Successfully logged in with Aadhaar');
      return { 
        success: true,
        userType: 'individual',
        userEmail: data.email,
        userAadhaar: credentials.aadhaar
      };
    } else if (!credentials.otp) {
      // Just checking if Aadhaar exists
      return { success: true };
    } else {
      toast.error('Invalid OTP');
      return { success: false };
    }
  } else {
    console.log('No profile found with Aadhaar:', credentials.aadhaar);
    toast.error('Invalid Aadhaar number');
    return { success: false };
  }
};

/**
 * Handle biometric login
 */
const handleBiometricLogin = async (): Promise<{ 
  success: boolean; 
  userType?: UserType; 
  userEmail?: string | null;
  userAadhaar?: string | null;
}> => {
  // Simulate successful biometric login for demo
  console.log('Simulating successful biometric login');
  
  // Try to find a user in the profiles table to set the email and aadhaar
  const { data } = await supabase
    .from('profiles')
    .select('email, aadhaar')
    .limit(1)
    .maybeSingle();
    
  if (data) {
    return {
      success: true,
      userType: 'individual',
      userEmail: data.email,
      userAadhaar: data.aadhaar
    };
  }
  
  return { success: true, userType: 'individual' };
};

/**
 * Handle organization login
 */
const handleOrganizationLogin = async (credentials: UserCredentials): Promise<{ 
  success: boolean; 
  userType?: UserType; 
  userEmail?: string | null;
  userAadhaar?: string | null;
}> => {
  if (!credentials.orgId || !credentials.password) {
    toast.error('Please enter both organization ID and password');
    return { success: false };
  }
  
  console.log('Attempting organization login with:', { orgId: credentials.orgId });
  
  // In a real app, you might have a separate table for organizations
  // For this demo, we'll use email login but check if it's an organization account
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.orgId,
    password: credentials.password
  });
  
  if (error) {
    console.error('Organization login error:', error);
    toast.error('Invalid organization ID or password');
    return { success: false };
  }
  
  if (data.user) {
    console.log('Organization login success:', data.user);
    // Check if this is indeed an organization account
    if (data.user.user_metadata?.isOrganization) {
      toast.success('Organization login successful');
      return { 
        success: true,
        userType: 'organization',
        userEmail: data.user.email
      };
    } else {
      toast.error('This account is not registered as an organization');
      await supabase.auth.signOut();
      return { success: false };
    }
  }
  
  toast.error('Organization not found');
  return { success: false };
};

/**
 * Reset password functionality
 */
export const resetUserPassword = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    if (error) {
      console.error('Reset password error:', error);
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error('Reset password error:', error);
    throw error;
  }
};

/**
 * Update password functionality
 */
export const updateUserPassword = async (newPassword: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error('Update password error:', error);
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error('Update password error:', error);
    throw error;
  }
};

/**
 * Logout functionality
 */
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error('Logout error:', error);
    toast.error(error.message || 'An error occurred during logout');
    return false;
  }
};
