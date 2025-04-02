
import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, Calendar, FileText, Plus, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentList from '@/components/documents/DocumentList';
import { toast } from 'sonner';
import AddMedicalRecordForm from '@/components/medical/AddMedicalRecordForm';
import { useMedicalRecords } from '@/hooks/use-medical-records';
import { UserProfile, Allergy, MedicalCondition, Medication } from '@/types';

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {userType === 'organization' ? 'Hospital Dashboard' : 'Medical Dashboard'}
          </h1>
          <p className="text-gray-500 mt-1">
            {userType === 'organization' 
              ? 'Manage patient records and healthcare services' 
              : 'Manage your medical records securely'}
          </p>
        </div>
        <Button onClick={handleAddRecord}>
          <Plus className="mr-2 h-4 w-4" />
          Add Medical Record
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{records.length}</div>
            <p className="text-xs text-muted-foreground">
              {records.length > 0 ? `Last added ${new Date(records[records.length - 1]?.date || Date.now()).toLocaleDateString()}` : 'No documents yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {records.filter(r => new Date(r.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              In the last 7 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Next on June 15, 2023
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfile ? '100%' : '85%'}</div>
            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-medimemo-primary rounded-full" style={{ width: userProfile ? '100%' : '85%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Documents</CardTitle>
              <CardDescription>
                Manage and organize your medical records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentList records={records} isLoading={isLoading} onDelete={deleteRecord} />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Tabs defaultValue="alerts">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
            </TabsList>
            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Important Health Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="ml-2">
                        <h4 className="text-sm font-medium">Medication Renewal</h4>
                        <p className="text-xs text-gray-500">Your prescription for Metformin will expire in 7 days</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div className="ml-2">
                        <h4 className="text-sm font-medium">Annual Checkup Due</h4>
                        <p className="text-xs text-gray-500">Your annual health checkup is overdue by 2 months</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Alerts
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="medications">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Current Medications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-medimemo-primary pl-3 py-1">
                      <h4 className="text-sm font-medium">Metformin 500mg</h4>
                      <p className="text-xs text-gray-500">Twice daily, with meals</p>
                      <p className="text-xs text-gray-400 mt-1">Dr. Patel - Last updated: May 10, 2023</p>
                    </div>
                    <div className="border-l-4 border-medimemo-primary pl-3 py-1">
                      <h4 className="text-sm font-medium">Atorvastatin 20mg</h4>
                      <p className="text-xs text-gray-500">Once daily, at bedtime</p>
                      <p className="text-xs text-gray-400 mt-1">Dr. Shah - Last updated: April 5, 2023</p>
                    </div>
                    <div className="border-l-4 border-medimemo-primary pl-3 py-1">
                      <h4 className="text-sm font-medium">Aspirin 81mg</h4>
                      <p className="text-xs text-gray-500">Once daily, with breakfast</p>
                      <p className="text-xs text-gray-400 mt-1">Dr. Shah - Last updated: April 5, 2023</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Medications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Medical Profile Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userProfile && (
                  <>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">Blood Group</h4>
                      <p className="text-sm font-medium">{userProfile.bloodGroup || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">Allergies</h4>
                      {userProfile.allergies && userProfile.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {userProfile.allergies.map((allergy, index) => (
                            <span 
                              key={index} 
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                ${allergy.severity === 'severe' ? 'bg-red-100 text-red-800' : 
                                  allergy.severity === 'moderate' ? 'bg-orange-100 text-orange-800' : 
                                    'bg-yellow-100 text-yellow-800'}`}
                            >
                              {allergy.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No known allergies</p>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">Chronic Conditions</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {userProfile.medicalConditions && userProfile.medicalConditions.length > 0 ? (
                          userProfile.medicalConditions.map((condition, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {condition.name}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No chronic conditions</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {!userProfile && (
                  <p className="text-sm text-gray-500 italic">Profile data not available</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full">
                View Full Profile
              </Button>
            </CardFooter>
          </Card>
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
