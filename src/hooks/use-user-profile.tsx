
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { fetchUserProfileData } from '@/services/profile/fetch-profile-service';
import { updateUserProfileData } from '@/services/profile/update-profile-service';
import { supabase } from '@/integrations/supabase/client';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  // Load user profile
  const fetchProfile = async () => {
    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      if (!isAuthenticated) {
        setProfile(null);
        setIsLoading(false);
        return;
      }
      
      const userProfileData = await fetchUserProfileData();
      setProfile(userProfileData);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updatedProfile: Partial<UserProfile>) => {
    try {
      const success = await updateUserProfileData(updatedProfile);
      
      if (success) {
        // Update the local state
        setProfile(prev => {
          if (!prev) return updatedProfile as UserProfile;
          return { ...prev, ...updatedProfile };
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating profile:', err);
      return false;
    }
  };

  // Load profile on component mount and when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, fetching profile');
      fetchProfile();
    } else {
      console.log('User is not authenticated, clearing profile');
      setProfile(null);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Listen for authentication changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile: fetchProfile
  };
};
