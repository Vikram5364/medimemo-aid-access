
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, Allergy } from '@/types';

export const fetchUserProfileData = async (): Promise<UserProfile | null> => {
  try {
    // Get user id from auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      console.error('No user ID found');
      return null;
    }
    
    const userId = session.user.id;
    console.log('Fetching profile for user ID:', userId);
    
    // Fetch profile data from Supabase
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw new Error('Failed to load user profile');
    }
    
    console.log('Retrieved profile data:', profileData);
    
    // Fetch allergies for the user
    const { data: allergiesData, error: allergiesError } = await supabase
      .from('allergies')
      .select('*')
      .eq('user_id', userId);
      
    if (allergiesError) {
      console.error('Error fetching allergies:', allergiesError);
    }
    
    console.log('Retrieved allergies data:', allergiesData);
    
    // Map allergies to the expected format
    const allergies: Allergy[] = (allergiesData || []).map(allergy => ({
      name: allergy.name,
      severity: allergy.severity as 'mild' | 'moderate' | 'severe' || 'moderate',
      // We know reaction is undefined since it's not in the database
      reaction: undefined
    }));
    
    // Construct user profile from the data
    if (profileData) {
      const userProfile: UserProfile = {
        id: profileData.id,
        name: profileData.name || session?.user?.email?.split('@')[0] || 'Unknown User',
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
      
      console.log('Constructed user profile:', userProfile);
      return userProfile;
    } else {
      console.log('No profile data found, using default values');
      // No profile found, but user is authenticated, create a minimal profile
      const userProfile: UserProfile = {
        id: userId,
        name: session?.user?.email?.split('@')[0] || 'Unknown User',
        dob: '',
        gender: '',
        bloodGroup: '',
        contact: '',
        address: '',
        emergencyContacts: [{
          name: '',
          relationship: '',
          contact: ''
        }],
        allergies: [],
        medicalConditions: [],
        currentMedications: []
      };
      return userProfile;
    }
  } catch (err) {
    console.error('Error fetching user profile:', err);
    throw err;
  }
};
