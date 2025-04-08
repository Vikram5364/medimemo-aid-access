
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from '@/utils/auth-utils';
import { UserType } from '@/types/auth-types';

export interface SessionState {
  isAuthenticated: boolean;
  userType: UserType;
  userEmail: string | null;
  userAadhaar: string | null;
  isLoading: boolean;
}

export const useSession = (): [
  SessionState,
  React.Dispatch<React.SetStateAction<boolean>>,
  React.Dispatch<React.SetStateAction<UserType>>,
  React.Dispatch<React.SetStateAction<string | null>>,
  React.Dispatch<React.SetStateAction<string | null>>,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userAadhaar, setUserAadhaar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    // First set up auth state listener to prevent race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session) {
            setIsAuthenticated(true);
            setUserEmail(session.user.email);
            
            // Check if user is an organization by looking at metadata
            if (session.user.user_metadata?.isOrganization === true) {
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
          }
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUserType(null);
          setUserAadhaar(null);
          setUserEmail(null);
        }
      }
    );
    
    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        
        if (session) {
          console.log('Existing session found:', session);
          setIsAuthenticated(true);
          setUserEmail(session.user.email);
          
          // Check if user is an organization by looking at metadata
          if (session.user.user_metadata?.isOrganization === true) {
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
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return [
    { isAuthenticated, userType, userEmail, userAadhaar, isLoading },
    setIsAuthenticated,
    setUserType,
    setUserEmail,
    setUserAadhaar,
    setIsLoading
  ];
};
