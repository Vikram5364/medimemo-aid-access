
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types';
import { toast } from 'sonner';

export const updateUserProfileData = async (updatedProfile: Partial<UserProfile>): Promise<boolean> => {
  try {
    // Get current user ID
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      toast.error('You need to be logged in to update your profile');
      return false;
    }
    
    const userId = session.user.id;
    console.log('Updating profile for user ID:', userId, 'with data:', updatedProfile);
    
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
    
    console.log('Prepared update data:', updateData);
    
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
      
      // First delete existing allergies
      const { error: deleteError } = await supabase
        .from('allergies')
        .delete()
        .eq('user_id', userId);
        
      if (deleteError) {
        console.error('Error deleting existing allergies:', deleteError);
      }
        
      // Then add new ones
      if (updatedProfile.allergies.length > 0) {
        const allergyInserts = updatedProfile.allergies.map(allergy => ({
          user_id: userId,
          name: allergy.name,
          severity: allergy.severity || 'moderate',
          // We don't insert reaction as it's not in the database schema
        }));
        
        console.log('Inserting allergies:', allergyInserts);
        
        const { error: allergyError } = await supabase
          .from('allergies')
          .insert(allergyInserts);
          
        if (allergyError) {
          console.error('Error updating allergies:', allergyError);
          toast.error('Failed to update allergies');
        }
      }
    }
    
    toast.success('Profile updated successfully');
    return true;
  } catch (err) {
    console.error('Error updating profile:', err);
    toast.error('Failed to update profile');
    return false;
  }
};
