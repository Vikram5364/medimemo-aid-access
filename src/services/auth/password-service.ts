
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
