
import { UserType, UserCredentials, UserData } from '@/types/auth-types';
import { 
  handleEmailLogin, 
  handleAadhaarLogin, 
  handleBiometricLogin, 
  handleOrganizationLogin 
} from './auth/login-service';
import { registerUser } from './auth/register-service';
import { resetUserPassword, updateUserPassword } from './auth/password-service';
import { logoutUser } from './auth/logout-service';
import { toast } from 'sonner';

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

// Export functions from other modules to maintain the same API
export { 
  registerUser,
  resetUserPassword, 
  updateUserPassword,
  logoutUser
};
