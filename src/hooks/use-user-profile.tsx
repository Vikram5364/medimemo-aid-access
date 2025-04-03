
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { toast } from 'sonner';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user profile from localStorage
  const fetchProfile = () => {
    setIsLoading(true);
    
    try {
      // Get user-specific identifier
      const userEmail = localStorage.getItem('userEmail');
      const userAadhaar = localStorage.getItem('userAadhaar');
      const userIdentifier = userEmail || userAadhaar || null;
      
      if (!userIdentifier) {
        setProfile(null);
        setIsLoading(false);
        return;
      }
      
      setTimeout(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
          try {
            const parsedData = JSON.parse(userData);
            // Extract relevant user data to construct a profile
            const userProfile: UserProfile = {
              id: parsedData.aadhaar || userIdentifier,
              name: parsedData.name || 'Unknown User',
              dob: parsedData.dob || '',
              gender: parsedData.gender || '',
              bloodGroup: parsedData.bloodGroup || '',
              height: parsedData.height ? Number(parsedData.height) : undefined,
              weight: parsedData.weight ? Number(parsedData.weight) : undefined,
              contact: parsedData.contact || '',
              address: parsedData.address || '',
              emergencyContacts: [{
                name: parsedData.emergencyContactName || '',
                relationship: parsedData.emergencyContactRelation || '',
                contact: parsedData.emergencyContactNumber || ''
              }],
              allergies: parsedData.allergies || [],
              medicalConditions: parsedData.medicalConditions || [],
              currentMedications: parsedData.medications || []
            };
            setProfile(userProfile);
          } catch (error) {
            console.error('Error parsing user data:', error);
            setError('Failed to parse user profile data');
          }
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    try {
      const userData = localStorage.getItem('userData');
      const parsedData = userData ? JSON.parse(userData) : {};
      
      // Update the user data with new profile information
      const updatedData = {
        ...parsedData,
        ...updatedProfile,
        // Handle nested objects
        emergencyContactName: updatedProfile.emergencyContacts?.[0]?.name || parsedData.emergencyContactName,
        emergencyContactRelation: updatedProfile.emergencyContacts?.[0]?.relationship || parsedData.emergencyContactRelation,
        emergencyContactNumber: updatedProfile.emergencyContacts?.[0]?.contact || parsedData.emergencyContactNumber
      };
      
      localStorage.setItem('userData', JSON.stringify(updatedData));
      
      // Update the current profile state
      setProfile(prevProfile => {
        if (!prevProfile) return updatedProfile as UserProfile;
        return { ...prevProfile, ...updatedProfile };
      });
      
      toast.success('Profile updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
      return false;
    }
  };

  // Load profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Listen for authentication changes
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (!isAuthenticated) {
        setProfile(null);
      } else {
        fetchProfile();
      }
    };

    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
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
