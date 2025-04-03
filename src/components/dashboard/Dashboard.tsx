
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import AddMedicalRecordForm from '@/components/medical/AddMedicalRecordForm';
import { useMedicalRecords } from '@/hooks/use-medical-records';
import { UserProfile } from '@/types';
import DashboardHeader from './DashboardHeader';
import StatCards from './StatCards';
import DocumentSection from './DocumentSection';
import SidebarTabs from './SidebarTabs';

const Dashboard: React.FC = () => {
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);
  const { records, isLoading, addRecord, deleteRecord, refreshRecords } = useMedicalRecords();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userType, setUserType] = useState<'individual' | 'organization'>('individual');

  useEffect(() => {
    // Check user type from localStorage
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType === 'organization') {
      setUserType('organization');
    } else {
      setUserType('individual');
    }

    // Load user profile from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        // Extract relevant user data to construct a profile
        const profile: UserProfile = {
          id: parsedData.aadhaar || 'user-id',
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
          medicalConditions: [],
          currentMedications: []
        };
        setUserProfile(profile);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleAddRecord = () => {
    setIsAddRecordModalOpen(true);
  };

  const handleRecordAdded = (newRecord) => {
    addRecord(newRecord);
    refreshRecords();
  };

  // Calculate recent uploads (within last 7 days)
  const recentUploadsCount = records.filter(
    r => new Date(r.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  // Get the date of the last record added
  const lastRecordDate = records.length > 0 ? records[records.length - 1]?.date : undefined;

  return (
    <div className="space-y-6">
      <DashboardHeader 
        userType={userType}
        onAddRecord={handleAddRecord}
      />
      
      <StatCards 
        recordsCount={records.length}
        lastRecordDate={lastRecordDate}
        recentUploadsCount={recentUploadsCount}
        userProfile={userProfile}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DocumentSection 
            records={records}
            isLoading={isLoading}
            onDelete={deleteRecord}
          />
        </div>
        
        <div>
          <SidebarTabs userProfile={userProfile} />
        </div>
      </div>
      
      {/* Add Medical Record Modal */}
      <AddMedicalRecordForm 
        isOpen={isAddRecordModalOpen} 
        onClose={() => setIsAddRecordModalOpen(false)}
        onAddRecord={handleRecordAdded}
      />
    </div>
  );
};

export default Dashboard;
