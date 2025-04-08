
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logoutUser, resetUserPassword, updateUserPassword } from '@/services/auth-service';
import { storeUserData, clearUserData } from '@/utils/auth-utils';
import { UserType } from '@/types/auth-types';

export interface AuthOperations {
  login: (type: 'email' | 'aadhaar' | 'biometric' | 'organization', credentials: any) => Promise<boolean>;
  register: (email: string, password: string, userData?: any) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
}

export const useAuthOperations = (
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  setUserType: React.Dispatch<React.SetStateAction<UserType>>,
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>,
  setUserAadhaar: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): AuthOperations => {
  const navigate = useNavigate();

  const login = async (
    type: 'email' | 'aadhaar' | 'biometric' | 'organization', 
    credentials: any
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Login called with type:', type, 'and credentials:', credentials);
      const result = await loginUser(type, credentials);
      
      if (result.success) {
        console.log('Login succeeded, result:', result);
        
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
          
          // Navigate to dashboard after successful login
          toast.success('Login successful! Redirecting to dashboard...');
          navigate('/dashboard');
        }
        
        return true;
      } else {
        console.log('Login failed, result:', result);
        return false;
      }
    } catch (error) {
      console.error('Login error in use-auth:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

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

  const logout = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  return {
    login,
    register,
    logout,
    resetPassword,
    updatePassword
  };
};
