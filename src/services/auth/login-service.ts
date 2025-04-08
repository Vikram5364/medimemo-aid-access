
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserType, UserCredentials } from '@/types/auth-types';

/**
 * Handle email-based login
 */
export const handleEmailLogin = async (credentials: UserCredentials): Promise<{ 
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
  
  try {
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
      console.log('User metadata:', data.user.user_metadata);
      
      // Check if this is an individual user (not an organization)
      const isOrganization = data.user.user_metadata?.isOrganization === true;
      
      if (!isOrganization) {
        toast.success('Login successful');
        return { 
          success: true,
          userType: 'individual' as UserType,
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
  } catch (error: any) {
    console.error('Login error in handleEmailLogin:', error);
    throw error;
  }
};

/**
 * Handle Aadhaar-based login
 */
export const handleAadhaarLogin = async (credentials: UserCredentials): Promise<{ 
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
export const handleBiometricLogin = async (): Promise<{ 
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
export const handleOrganizationLogin = async (credentials: UserCredentials): Promise<{ 
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
    console.log('User metadata:', data.user.user_metadata);
    // Check if this is indeed an organization account
    const isOrganization = data.user.user_metadata?.isOrganization === true;
    
    if (isOrganization) {
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
