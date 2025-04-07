import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: 'individual' | 'organization' | null;
  userEmail: string | null;
  userAadhaar: string | null;
  login: (type: 'email' | 'aadhaar' | 'biometric' | 'organization', credentials: any) => Promise<boolean>;
  register: (email: string, password: string, userData?: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<'individual' | 'organization' | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userAadhaar, setUserAadhaar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        
        if (session) {
          console.log('Existing session found:', session);
          setIsAuthenticated(true);
          setUserEmail(session.user.email);
          
          // Check if user is an organization by looking at metadata
          if (session.user.user_metadata?.isOrganization) {
            setUserType('organization');
          } else {
            setUserType('individual');
            
            // Retrieve Aadhaar if available for individuals
            const { data: profileData } = await supabase
              .from('profiles')
              .select('aadhaar')
              .eq('id', session.user.id)
              .single();
              
            if (profileData && profileData.aadhaar) {
              setUserAadhaar(profileData.aadhaar);
            }
          }
        } else {
          console.log('No session found');
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setIsAuthenticated(!!session);
        setUserEmail(session?.user?.email || null);
        
        if (session) {
          // Check if user is an organization by looking at metadata
          if (session.user.user_metadata?.isOrganization) {
            setUserType('organization');
            setUserAadhaar(null); // Organizations don't have Aadhaar
          } else {
            setUserType('individual');
            
            // Try to get Aadhaar from profile for individuals
            const { data: profileData } = await supabase
              .from('profiles')
              .select('aadhaar')
              .eq('id', session.user.id)
              .single();
              
            if (profileData && profileData.aadhaar) {
              setUserAadhaar(profileData.aadhaar);
            }
          }
        } else {
          setUserType(null);
          setUserAadhaar(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const register = async (email: string, password: string, userData?: any): Promise<boolean> => {
    setIsLoading(true);
    
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
        return false;
      }
      
      if (data.user) {
        console.log('User registered successfully:', data.user);
        
        // For individual users, update profile with additional user data
        if (!isOrganization && userData) {
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
            .eq('id', data.user.id);
            
          if (profileError) {
            console.error('Error updating profile:', profileError);
            toast.error('Registration successful but profile update failed');
          }
          
          // If the user provided allergies, store them
          if (userData.allergies && userData.allergies.length > 0) {
            // Create a batch of allergie entries
            const allergiesPromises = userData.allergies.map((name: string) => {
              return supabase.from('allergies').insert({
                user_id: data.user?.id,
                name: name,
                severity: 'medium' // Default severity
              });
            });
            
            try {
              await Promise.all(allergiesPromises);
            } catch (allergyError) {
              console.error('Error saving allergies:', allergyError);
            }
          }
        } 
        // For organization users, create an organization record
        else if (isOrganization && userData) {
          // This is a simplified version that uses user_metadata for now
          toast.success('Organization registration successful!');
        }
        
        // Auto-login the user after successful registration
        if (data.session) {
          console.log('Auto-login with session:', data.session);
          setIsAuthenticated(true);
          setUserEmail(data.user.email);
          setUserType(isOrganization ? 'organization' : 'individual');
          
          // Store important user data in localStorage for persistence
          localStorage.setItem('userEmail', data.user.email || '');
          if (userData?.aadhaar) {
            localStorage.setItem('userAadhaar', userData.aadhaar);
            setUserAadhaar(userData.aadhaar);
          }
          
          // Store user information for dashboard access
          localStorage.setItem('userData', JSON.stringify(userData || {}));
          
          toast.success('Registration successful! You are now logged in.');
          return true;
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
            return true;
          }
          
          if (signInData.session) {
            setIsAuthenticated(true);
            setUserEmail(data.user.email);
            setUserType(isOrganization ? 'organization' : 'individual');
            
            // Store user information in localStorage
            localStorage.setItem('userEmail', data.user.email || '');
            if (userData?.aadhaar) {
              localStorage.setItem('userAadhaar', userData.aadhaar);
              setUserAadhaar(userData.aadhaar);
            }
            localStorage.setItem('userData', JSON.stringify(userData || {}));
            localStorage.setItem('userType', isOrganization ? 'organization' : 'individual');
            
            toast.success('Registration and login successful!');
            return true;
          }
          
          toast.info('Account created! Please log in.');
          return true;
        }
      }
      
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'An error occurred during registration');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    type: 'email' | 'aadhaar' | 'biometric' | 'organization', 
    credentials: any
  ): Promise<boolean> => {
    setIsLoading(true);
    console.log('Login attempt:', { type, credentials });
    
    try {
      if (type === 'email') {
        // Email-based login for individuals
        if (credentials.email && credentials.password) {
          console.log('Attempting email login with:', { email: credentials.email });
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
          });
          
          if (error) {
            console.error('Email login error:', error);
            toast.error(error.message);
            return false;
          }
          
          if (data.user) {
            console.log('Email login success:', data.user);
            // Check if this is an individual user (not an organization)
            if (!data.user.user_metadata?.isOrganization) {
              setIsAuthenticated(true);
              setUserType('individual');
              setUserEmail(data.user.email);
              toast.success('Login successful');
              return true;
            } else {
              toast.error('This account is registered as an organization. Please use organization login.');
              await supabase.auth.signOut();
              return false;
            }
          }
        } else {
          toast.error('Invalid email or password');
          return false;
        }
      } else if (type === 'aadhaar') {
        // For Aadhaar authentication (simulated for demo)
        console.log('Attempting Aadhaar login with:', { aadhaar: credentials.aadhaar });
        
        // In this demo version, we'll approve login if:
        // 1. An OTP was provided (credentials.otp exists and is 6 digits)
        // 2. OR we're just checking if the Aadhaar exists in the system
        
        const { data } = await supabase
          .from('profiles')
          .select('id, email, aadhaar')
          .eq('aadhaar', credentials.aadhaar)
          .single();
          
        if (data && data.email) {
          // For demo purposes, simulate OTP verification
          if (credentials.otp && credentials.otp.length === 6) {
            console.log('Aadhaar OTP verification successful');
            // For this demo, we'll let them in with the OTP
            setIsAuthenticated(true);
            setUserType('individual');
            setUserAadhaar(credentials.aadhaar);
            
            // Try to get the user by email
            if (data.email) {
              setUserEmail(data.email);
              
              // Try to sign in as the user to get an actual session
              // This is just for the demo; in a real app, you'd use a proper token
              // This is just a simulation - not secure for production!
              const profiles = await supabase
                .from('profiles')
                .select('email')
                .eq('aadhaar', credentials.aadhaar);
                
              if (profiles.data && profiles.data.length > 0) {
                // We have the email, but we don't have the password
                // In a real app, you'd use a proper token-based approach
                console.log('Found matching profile with email:', profiles.data[0].email);
              }
            }
            
            return true;
          } else if (!credentials.otp) {
            // Just checking if Aadhaar exists
            return true;
          } else {
            toast.error('Invalid OTP');
            return false;
          }
        } else {
          console.log('No profile found with Aadhaar:', credentials.aadhaar);
          toast.error('Invalid Aadhaar number');
          return false;
        }
      } else if (type === 'biometric') {
        // Simulate successful biometric login for demo
        console.log('Simulating successful biometric login');
        
        // For the demo, we'll just authenticate the user
        // In a real app, this would verify against stored biometric templates
        setIsAuthenticated(true);
        setUserType('individual');
        
        // Try to find a user in the profiles table to set the email and aadhaar
        const { data } = await supabase
          .from('profiles')
          .select('email, aadhaar')
          .limit(1)
          .single();
          
        if (data) {
          setUserEmail(data.email);
          if (data.aadhaar) {
            setUserAadhaar(data.aadhaar);
          }
        }
        
        return true;
      } else if (type === 'organization') {
        // Organization login
        if (credentials.orgId && credentials.password) {
          console.log('Attempting organization login with:', { orgId: credentials.orgId });
          
          // In a real app, you might have a separate table for organizations
          // For this demo, we'll use email login but check if it's an organization account
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.orgId,
            password: credentials.password
          });
          
          if (error) {
            console.error('Organization login error:', error);
            toast.error(error.message);
            return false;
          }
          
          if (data.user) {
            console.log('Organization login success:', data.user);
            // Check if this is indeed an organization account
            if (data.user.user_metadata?.isOrganization) {
              setIsAuthenticated(true);
              setUserType('organization');
              setUserEmail(data.user.email);
              toast.success('Organization login successful');
              return true;
            } else {
              toast.error('This account is not registered as an organization');
              await supabase.auth.signOut();
              return false;
            }
          }
        } else {
          toast.error('Invalid organization credentials');
          return false;
        }
      } else {
        toast.error('Invalid login method');
        return false;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      setIsAuthenticated(false);
      setUserType(null);
      setUserEmail(null);
      setUserAadhaar(null);
      
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'An error occurred during logout');
    }
  };
  // Return the auth context provider
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userType,
        userEmail,
        userAadhaar,
        login,
        register,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
