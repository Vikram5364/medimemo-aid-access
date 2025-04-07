
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  resetUserPassword, 
  updateUserPassword 
} from '@/services/auth-service';
import { 
  fetchUserProfile, 
  storeUserData, 
  clearUserData 
} from '@/utils/auth-utils';
import { AuthContextType, UserType } from '@/types/auth-types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(null);
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
            const profileData = await fetchUserProfile(session.user.id);
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
        
        if (session) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email);
          
          // Check if user is an organization by looking at metadata
          if (session.user.user_metadata?.isOrganization) {
            setUserType('organization');
            setUserAadhaar(null); // Organizations don't have Aadhaar
          } else {
            setUserType('individual');
            
            // Try to get Aadhaar from profile for individuals
            const profileData = await fetchUserProfile(session.user.id);
            if (profileData && profileData.aadhaar) {
              setUserAadhaar(profileData.aadhaar);
            }
          }
        } else {
          setIsAuthenticated(false);
          setUserType(null);
          setUserAadhaar(null);
          setUserEmail(null);
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
      const result = await registerUser(email, password, userData);
      
      if (result.success) {
        if (result.userType && result.userEmail) {
          setIsAuthenticated(true);
          setUserType(result.userType);
          setUserEmail(result.userEmail);
          
          // Store important user data in localStorage for persistence
          if (userData?.aadhaar) {
            setUserAadhaar(userData.aadhaar);
          }
          
          storeUserData(result.userType, result.userEmail, userData?.aadhaar, userData);
          
          toast.success('Registration successful! You are now logged in.');
        } else {
          toast.info('Account created! You can now log in with your credentials.');
        }
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
      const result = await loginUser(type, credentials);
      
      if (result.success) {
        // Update auth state
        if (result.userType) {
          setIsAuthenticated(true);
          setUserType(result.userType);
          
          if (result.userEmail) {
            setUserEmail(result.userEmail);
          }
          
          if (result.userAadhaar) {
            setUserAadhaar(result.userAadhaar);
          }
          
          // Store user data in localStorage
          storeUserData(result.userType, result.userEmail, result.userAadhaar);
        }
        
        return true;
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const success = await logoutUser();
      
      if (success) {
        // Update state
        setIsAuthenticated(false);
        setUserType(null);
        setUserEmail(null);
        setUserAadhaar(null);
        
        // Clear localStorage
        clearUserData();
        
        toast.success('Logged out successfully');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'An error occurred during logout');
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      return await resetUserPassword(email);
    } catch (error: any) {
      throw error;
    }
  };
  
  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      return await updateUserPassword(newPassword);
    } catch (error: any) {
      throw error;
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
        isLoading,
        resetPassword,
        updatePassword
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
