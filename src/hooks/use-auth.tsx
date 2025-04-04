
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
      // Determine if this is an organization registration
      const isOrganization = userData?.isOrganization || false;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData?.name,
            aadhaar: userData?.aadhaar,
            isOrganization: isOrganization
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (data.user) {
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
          // You might want to create an 'organizations' table in Supabase for this
          // This is a simplified version that uses user_metadata for now
          toast.success('Organization registration successful!');
        }
        
        toast.success('Registration successful! Please check your email to verify your account.');
        return true;
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
    
    try {
      if (type === 'email') {
        // Email-based login for individuals
        if (credentials.email && credentials.password) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
          });
          
          if (error) {
            toast.error(error.message);
            return false;
          }
          
          if (data.user) {
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
        // For Aadhaar authentication
        const { data } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('aadhaar', credentials.aadhaar)
          .single();
          
        if (data && data.email) {
          // For this demo, we'll let them in with just the Aadhaar
          // In a real app, you would need additional verification
          toast.success('Aadhaar verification successful');
          setIsAuthenticated(true);
          setUserType('individual');
          setUserAadhaar(credentials.aadhaar);
          return true;
        } else {
          toast.error('Invalid Aadhaar number');
          return false;
        }
      } else if (type === 'biometric') {
        // Biometric login would require integration with a biometric API
        toast.error('Biometric authentication not implemented yet');
        return false;
      } else if (type === 'organization') {
        // Organization login
        if (credentials.orgId && credentials.password) {
          // In a real app, you might have a separate table for organizations
          // For this demo, we'll use email login but check if it's an organization account
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.orgId,
            password: credentials.password
          });
          
          if (error) {
            toast.error(error.message);
            return false;
          }
          
          if (data.user) {
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
