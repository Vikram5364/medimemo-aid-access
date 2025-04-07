
import { Database } from '@/integrations/supabase/types';

export interface AuthContextType {
  isAuthenticated: boolean;
  userType: 'individual' | 'organization' | null;
  userEmail: string | null;
  userAadhaar: string | null;
  login: (type: 'email' | 'aadhaar' | 'biometric' | 'organization', credentials: any) => Promise<boolean>;
  register: (email: string, password: string, userData?: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
}

export type UserType = 'individual' | 'organization' | null;

export interface UserCredentials {
  email?: string;
  password?: string;
  aadhaar?: string;
  otp?: string;
  orgId?: string;
}

export interface UserData {
  name?: string;
  aadhaar?: string;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  height?: number | string;
  weight?: number | string;
  contact?: string;
  address?: string;
  allergies?: string[];
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactNumber?: string;
  isOrganization?: boolean;
  hasFingerprints?: boolean;
}
