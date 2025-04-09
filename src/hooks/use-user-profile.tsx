
import { useState, useEffect } from 'react';
import { UserProfile, Allergy, MedicalCondition, Medication } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, userEmail, userAadhaar } = useAuth();
  
  // Load user profile from Supabase
  const fetchProfile = async () => {
    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      if (!isAuthenticated) {
        setProfile(null);
        setIsLoading(false);
        return;
      }
      
      // Get user id from auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.error('No user ID found');
        setProfile(null);
        setIsLoading(false);
        return;
      }
      
      const userId = session.user.id;
      
      // Fetch profile data from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setError('Failed to load user profile');
        setIsLoading(false);
        return;
      }
      
      // Fetch allergies for the user
      const { data: allergiesData, error: allergiesError } = await supabase
        .from('allergies')
        .select('*')
        .eq('user_id', userId);
        
      if (allergiesError) {
        console.error('Error fetching allergies:', allergiesError);
      }
      
      // Map allergies to the expected format
      // Note: We're not accessing the 'reaction' property anymore since it doesn't exist in the database
      const allergies: Allergy[] = (allergiesData || []).map(allergy => ({
        name: allergy.name,
        severity: allergy.severity as 'mild' | 'moderate' | 'severe' || 'moderate',
        // We'll set reaction as undefined since it's not in the database
        reaction: undefined
      }));
      
      // Construct user profile from the data
      if (profileData) {
        const userProfile: UserProfile = {
          id: profileData.id,
          name: profileData.name || 'Unknown User',
          dob: profileData.dob || '',
          gender: profileData.gender || '',
          bloodGroup: profileData.blood_group || '',
          height: profileData.height ? Number(profileData.height) : undefined,
          weight: profileData.weight ? Number(profileData.weight) : undefined,
          contact: profileData.contact || '',
          address: profileData.address || '',
          emergencyContacts: [{
            name: profileData.emergency_contact_name || '',
            relationship: profileData.emergency_contact_relation || '',
            contact: profileData.emergency_contact_number || ''
          }],
          allergies: allergies,
          medicalConditions: [], // We'll add support for this later
          currentMedications: []  // We'll add support for this later
        };
        
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile in Supabase
  const updateProfile = async (updatedProfile: Partial<UserProfile>) => {
    try {
      // Get current user ID
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error('You need to be logged in to update your profile');
        return false;
      }
      
      const userId = session.user.id;
      
      // Prepare data for update
      const updateData: any = {};
      
      // Map fields from UserProfile to database columns
      if (updatedProfile.name !== undefined) updateData.name = updatedProfile.name;
      if (updatedProfile.dob !== undefined) updateData.dob = updatedProfile.dob;
      if (updatedProfile.gender !== undefined) updateData.gender = updatedProfile.gender;
      if (updatedProfile.bloodGroup !== undefined) updateData.blood_group = updatedProfile.bloodGroup;
      if (updatedProfile.height !== undefined) updateData.height = updatedProfile.height;
      if (updatedProfile.weight !== undefined) updateData.weight = updatedProfile.weight;
      if (updatedProfile.contact !== undefined) updateData.contact = updatedProfile.contact;
      if (updatedProfile.address !== undefined) updateData.address = updatedProfile.address;
      
      // Emergency contacts
      if (updatedProfile.emergencyContacts && updatedProfile.emergencyContacts.length > 0) {
        const emergencyContact = updatedProfile.emergencyContacts[0];
        updateData.emergency_contact_name = emergencyContact.name;
        updateData.emergency_contact_relation = emergencyContact.relationship;
        updateData.emergency_contact_number = emergencyContact.contact;
      }
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
        return false;
      }
      
      // If there are allergies to update
      if (updatedProfile.allergies) {
        // For simplicity, we'll replace all allergies
        // In a real app, you might want to handle this more gracefully
        
        // First delete existing allergies
        await supabase
          .from('allergies')
          .delete()
          .eq('user_id', userId);
          
        // Then add new ones
        if (updatedProfile.allergies.length > 0) {
          const allergyInserts = updatedProfile.allergies.map(allergy => ({
            user_id: userId,
            name: allergy.name,
            severity: allergy.severity || 'moderate',
            // We don't insert reaction as it's not in the database schema
          }));
          
          const { error: allergyError } = await supabase
            .from('allergies')
            .insert(allergyInserts);
            
          if (allergyError) {
            console.error('Error updating allergies:', allergyError);
            toast.error('Failed to update allergies');
          }
        }
      }
      
      // Update the local state
      setProfile(prev => {
        if (!prev) return updatedProfile as UserProfile;
        return { ...prev, ...updatedProfile };
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
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  // Listen for authentication changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
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
