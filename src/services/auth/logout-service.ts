
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Logout functionality
 */
export const logoutUser = async (): Promise<boolean> => {
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
