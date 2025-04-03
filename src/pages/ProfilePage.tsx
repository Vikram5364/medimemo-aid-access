
import React, { useState } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { AllergyAdd, Fingerprint, User, Phone, CalendarDays, Activity, Scale, Ruler, MapPin, Heart, HeartPulse, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Allergy, MedicalCondition, Medication } from '@/types';

// Create schema for the personal details form
const personalDetailsSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  gender: z.string().min(1, { message: 'Please select a gender' }),
  bloodGroup: z.string().min(1, { message: 'Please select a blood group' }),
  dob: z.string().min(1, { message: 'Date of birth is required' }),
  height: z.string().min(1, { message: 'Height is required' }),
  weight: z.string().min(1, { message: 'Weight is required' }),
  contact: z.string().min(10, { message: 'Valid contact number is required' }),
  address: z.string().min(5, { message: 'Address is required' }),
});

// Create schema for emergency contact form
const emergencyContactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  relationship: z.string().min(1, { message: 'Relationship is required' }),
  contact: z.string().min(10, { message: 'Valid contact number is required' }),
});

// Create schema for medical conditions
const medicalConditionSchema = z.object({
  name: z.string().min(2, { message: 'Condition name is required' }),
  diagnosedDate: z.string().optional(),
  severity: z.string().optional(),
  notes: z.string().optional(),
});

// Create schema for medications
const medicationSchema = z.object({
  name: z.string().min(2, { message: 'Medication name is required' }),
  dosage: z.string().min(1, { message: 'Dosage is required' }),
  frequency: z.string().min(1, { message: 'Frequency is required' }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  prescribedBy: z.string().optional(),
});

// Create schema for allergies
const allergySchema = z.object({
  name: z.string().min(2, { message: 'Allergy name is required' }),
  severity: z.string().min(1, { message: 'Severity is required' }),
  reaction: z.string().optional(),
});

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, isLoading, updateProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState('personal');
  
  const [isAddingCondition, setIsAddingCondition] = useState(false);
  const [isAddingMedication, setIsAddingMedication] = useState(false);
  const [isAddingAllergy, setIsAddingAllergy] = useState(false);

  // Form for personal details
  const personalForm = useForm<z.infer<typeof personalDetailsSchema>>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      name: profile?.name || '',
      gender: profile?.gender || '',
      bloodGroup: profile?.bloodGroup || '',
      dob: profile?.dob || '',
      height: profile?.height?.toString() || '',
      weight: profile?.weight?.toString() || '',
      contact: profile?.contact || '',
      address: profile?.address || '',
    }
  });

  // Form for emergency contact
  const emergencyForm = useForm<z.infer<typeof emergencyContactSchema>>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      name: profile?.emergencyContacts?.[0]?.name || '',
      relationship: profile?.emergencyContacts?.[0]?.relationship || '',
      contact: profile?.emergencyContacts?.[0]?.contact || '',
    }
  });

  // Form for medical condition
  const conditionForm = useForm<z.infer<typeof medicalConditionSchema>>({
    resolver: zodResolver(medicalConditionSchema),
    defaultValues: {
      name: '',
      diagnosedDate: '',
      severity: 'medium',
      notes: '',
    }
  });

  // Form for medication
  const medicationForm = useForm<z.infer<typeof medicationSchema>>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: '',
      dosage: '',
      frequency: '',
      startDate: '',
      prescribedBy: '',
    }
  });

  // Form for allergy
  const allergyForm = useForm<z.infer<typeof allergySchema>>({
    resolver: zodResolver(allergySchema),
    defaultValues: {
      name: '',
      severity: 'medium',
      reaction: '',
    }
  });

  // Update form defaults when profile loads
  React.useEffect(() => {
    if (profile) {
      personalForm.reset({
        name: profile.name || '',
        gender: profile.gender || '',
        bloodGroup: profile.bloodGroup || '',
        dob: profile.dob || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        contact: profile.contact || '',
        address: profile.address || '',
      });

      if (profile.emergencyContacts && profile.emergencyContacts.length > 0) {
        emergencyForm.reset({
          name: profile.emergencyContacts[0].name || '',
          relationship: profile.emergencyContacts[0].relationship || '',
          contact: profile.emergencyContacts[0].contact || '',
        });
      }
    }
  }, [profile]);

  // Handle form submissions
  const onPersonalSubmit = (data: z.infer<typeof personalDetailsSchema>) => {
    updateProfile({
      name: data.name,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      dob: data.dob,
      height: Number(data.height),
      weight: Number(data.weight),
      contact: data.contact,
      address: data.address,
    });
  };

  const onEmergencySubmit = (data: z.infer<typeof emergencyContactSchema>) => {
    updateProfile({
      emergencyContacts: [{
        name: data.name,
        relationship: data.relationship,
        contact: data.contact
      }]
    });
  };

  const onAddCondition = (data: z.infer<typeof medicalConditionSchema>) => {
    const newCondition: MedicalCondition = {
      name: data.name,
      diagnosedDate: data.diagnosedDate,
      severity: data.severity as 'mild' | 'moderate' | 'severe',
      notes: data.notes
    };
    
    const updatedConditions = profile?.medicalConditions ? 
      [...profile.medicalConditions, newCondition] : 
      [newCondition];
    
    updateProfile({ medicalConditions: updatedConditions });
    setIsAddingCondition(false);
    conditionForm.reset();
  };

  const onAddMedication = (data: z.infer<typeof medicationSchema>) => {
    const newMedication: Medication = {
      name: data.name,
      dosage: data.dosage,
      frequency: data.frequency,
      startDate: data.startDate,
      endDate: data.endDate,
      prescribedBy: data.prescribedBy
    };
    
    const updatedMedications = profile?.currentMedications ? 
      [...profile.currentMedications, newMedication] : 
      [newMedication];
    
    updateProfile({ currentMedications: updatedMedications });
    setIsAddingMedication(false);
    medicationForm.reset();
  };

  const onAddAllergy = (data: z.infer<typeof allergySchema>) => {
    const newAllergy: Allergy = {
      name: data.name,
      severity: data.severity as 'mild' | 'moderate' | 'severe',
      reaction: data.reaction
    };
    
    const updatedAllergies = profile?.allergies ? 
      [...profile.allergies, newAllergy] : 
      [newAllergy];
    
    updateProfile({ allergies: updatedAllergies });
    setIsAddingAllergy(false);
    allergyForm.reset();
  };

  const removeCondition = (index: number) => {
    if (!profile?.medicalConditions) return;
    
    const updatedConditions = [...profile.medicalConditions];
    updatedConditions.splice(index, 1);
    updateProfile({ medicalConditions: updatedConditions });
  };

  const removeMedication = (index: number) => {
    if (!profile?.currentMedications) return;
    
    const updatedMedications = [...profile.currentMedications];
    updatedMedications.splice(index, 1);
    updateProfile({ currentMedications: updatedMedications });
  };

  const removeAllergy = (index: number) => {
    if (!profile?.allergies) return;
    
    const updatedAllergies = [...profile.allergies];
    updatedAllergies.splice(index, 1);
    updateProfile({ allergies: updatedAllergies });
  };

  if (isLoading) {
    return (
      <div className="medimemo-container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medimemo-primary mb-4"></div>
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="medimemo-container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>Your profile information could not be loaded</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <User size={64} className="text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No profile information found. Please complete your registration.</p>
            <Button onClick={() => navigate('/register')}>
              Complete Registration
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="medimemo-container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">My Medical Profile</h1>
        <p className="text-gray-500">
          Manage your personal health information and medical details
        </p>
      </div>

      <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
          <TabsTrigger value="medical">Medical Details</TabsTrigger>
          <TabsTrigger value="biometrics">Biometrics</TabsTrigger>
        </TabsList>
        
        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your basic personal and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...personalForm}>
                <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={personalForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <Input className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalForm.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <Input type="date" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalForm.control}
                      name="bloodGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Group</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood group" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                              <SelectItem value="unknown">Unknown</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalForm.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <Input type="number" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalForm.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <Input type="number" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalForm.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <Input className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={personalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                            <Textarea 
                              className="pl-10 min-h-[100px]" 
                              {...field} 
                              placeholder="Enter your full address"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      Save Personal Information
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Emergency Contact Tab */}
        <TabsContent value="emergency">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>
                Add emergency contact details for medical emergencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emergencyForm}>
                <form onSubmit={emergencyForm.handleSubmit(onEmergencySubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emergencyForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emergencyForm.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="friend">Friend</SelectItem>
                              <SelectItem value="relative">Other Relative</SelectItem>
                              <SelectItem value="guardian">Guardian</SelectItem>
                              <SelectItem value="caregiver">Caregiver</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emergencyForm.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <Input className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      Save Emergency Contact
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Medical Details Tab */}
        <TabsContent value="medical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Medical Conditions Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Medical Conditions</CardTitle>
                  <CardDescription>
                    Add your diagnosed medical conditions
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAddingCondition(!isAddingCondition)}
                >
                  {isAddingCondition ? 'Cancel' : 'Add Condition'}
                </Button>
              </CardHeader>
              <CardContent>
                {isAddingCondition ? (
                  <Form {...conditionForm}>
                    <form onSubmit={conditionForm.handleSubmit(onAddCondition)} className="space-y-4">
                      <FormField
                        control={conditionForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Condition Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Diabetes, Hypertension" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={conditionForm.control}
                          name="diagnosedDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Diagnosed Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={conditionForm.control}
                          name="severity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Severity</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select severity" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="mild">Mild</SelectItem>
                                  <SelectItem value="moderate">Moderate</SelectItem>
                                  <SelectItem value="severe">Severe</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={conditionForm.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Additional notes about the condition"
                                className="min-h-[80px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button type="submit">Add Condition</Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-4">
                    {profile.medicalConditions && profile.medicalConditions.length > 0 ? (
                      profile.medicalConditions.map((condition, index) => (
                        <div 
                          key={index} 
                          className="flex items-start justify-between border-l-4 border-blue-500 pl-3 py-2 bg-blue-50 rounded-r-md"
                        >
                          <div>
                            <div className="flex items-center">
                              <HeartPulse className="mr-2 h-4 w-4 text-blue-600" />
                              <h4 className="text-sm font-medium">{condition.name}</h4>
                              {condition.severity && (
                                <Badge 
                                  variant="outline" 
                                  className={`ml-2 ${
                                    condition.severity === 'severe' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                                    condition.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 
                                    'bg-green-100 text-green-800 hover:bg-green-100'
                                  }`}
                                >
                                  {condition.severity}
                                </Badge>
                              )}
                            </div>
                            {condition.diagnosedDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                Diagnosed: {condition.diagnosedDate}
                              </p>
                            )}
                            {condition.notes && (
                              <p className="text-xs text-gray-600 mt-1">
                                Notes: {condition.notes}
                              </p>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeCondition(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                        <HeartPulse className="h-12 w-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-600">No conditions added</h3>
                        <p className="text-sm max-w-md mx-auto mt-1 mb-3">
                          Add your diagnosed medical conditions to keep healthcare providers informed.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsAddingCondition(true)}
                        >
                          Add Your First Condition
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Allergies Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Allergies</CardTitle>
                  <CardDescription>
                    Add known allergies and their severity
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAddingAllergy(!isAddingAllergy)}
                >
                  {isAddingAllergy ? 'Cancel' : 'Add Allergy'}
                </Button>
              </CardHeader>
              <CardContent>
                {isAddingAllergy ? (
                  <Form {...allergyForm}>
                    <form onSubmit={allergyForm.handleSubmit(onAddAllergy)} className="space-y-4">
                      <FormField
                        control={allergyForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Allergy Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Peanuts, Penicillin" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={allergyForm.control}
                        name="severity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Severity</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mild">Mild</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="severe">Severe</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={allergyForm.control}
                        name="reaction"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reaction</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Description of allergic reaction"
                                className="min-h-[80px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button type="submit">Add Allergy</Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-4">
                    {profile.allergies && profile.allergies.length > 0 ? (
                      profile.allergies.map((allergy, index) => (
                        <div 
                          key={index} 
                          className="flex items-start justify-between border-l-4 border-red-500 pl-3 py-2 bg-red-50 rounded-r-md"
                        >
                          <div>
                            <div className="flex items-center">
                              <AllergyAdd className="mr-2 h-4 w-4 text-red-600" />
                              <h4 className="text-sm font-medium">{allergy.name}</h4>
                              <Badge 
                                variant="outline" 
                                className={`ml-2 ${
                                  allergy.severity === 'severe' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                                  allergy.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 
                                  'bg-green-100 text-green-800 hover:bg-green-100'
                                }`}
                              >
                                {allergy.severity}
                              </Badge>
                            </div>
                            {allergy.reaction && (
                              <p className="text-xs text-gray-600 mt-1">
                                Reaction: {allergy.reaction}
                              </p>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeAllergy(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                        <AllergyAdd className="h-12 w-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-600">No allergies added</h3>
                        <p className="text-sm max-w-md mx-auto mt-1 mb-3">
                          Record your allergies to ensure proper medical care in emergencies.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsAddingAllergy(true)}
                        >
                          Add Your First Allergy
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Current Medications Section */}
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Current Medications</CardTitle>
                <CardDescription>
                  Track your prescribed and over-the-counter medications
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAddingMedication(!isAddingMedication)}
              >
                {isAddingMedication ? 'Cancel' : 'Add Medication'}
              </Button>
            </CardHeader>
            <CardContent>
              {isAddingMedication ? (
                <Form {...medicationForm}>
                  <form onSubmit={medicationForm.handleSubmit(onAddMedication)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={medicationForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medication Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Metformin, Lisinopril" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={medicationForm.control}
                        name="dosage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dosage</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 500mg, 10mg" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={medicationForm.control}
                        name="frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequency</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Twice daily, Once at bedtime" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={medicationForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={medicationForm.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date (if applicable)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={medicationForm.control}
                        name="prescribedBy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prescribed By</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Dr. Smith" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">Add Medication</Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div>
                  {profile.currentMedications && profile.currentMedications.length > 0 ? (
                    <div className="space-y-4">
                      {profile.currentMedications.map((medication, index) => (
                        <div 
                          key={index} 
                          className="flex items-start justify-between border-l-4 border-purple-500 pl-3 py-2 bg-purple-50 rounded-r-md"
                        >
                          <div>
                            <div className="flex items-center">
                              <Pill className="mr-2 h-4 w-4 text-purple-600" />
                              <h4 className="text-sm font-medium">
                                {medication.name} {medication.dosage && `(${medication.dosage})`}
                              </h4>
                            </div>
                            {medication.frequency && (
                              <p className="text-xs text-gray-600 mt-1">
                                Frequency: {medication.frequency}
                              </p>
                            )}
                            {medication.startDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                Started: {medication.startDate}
                                {medication.endDate && ` • Ends: ${medication.endDate}`}
                              </p>
                            )}
                            {medication.prescribedBy && (
                              <p className="text-xs text-gray-500 mt-1">
                                Prescribed by: {medication.prescribedBy}
                              </p>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeMedication(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                      <Pill className="h-12 w-12 text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium text-gray-600">No medications added</h3>
                      <p className="text-sm max-w-md mx-auto mt-1 mb-3">
                        Add your current medications to track prescriptions and ensure proper dosage.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsAddingMedication(true)}
                      >
                        Add Your First Medication
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Biometrics Tab */}
        <TabsContent value="biometrics">
          <Card>
            <CardHeader>
              <CardTitle>Biometric Authentication</CardTitle>
              <CardDescription>
                Manage your fingerprint data for secure access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                  <div className="flex gap-3">
                    <Fingerprint className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium text-blue-700">Fingerprint Authentication</h3>
                      <p className="text-sm text-blue-600 mt-1">
                        Use your fingerprints for secure and quick access to your medical records.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fingerprint Enrollment Status */}
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Enrollment Status</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Fingerprint className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Fingerprints Enrolled</p>
                        <p className="text-sm text-gray-500">
                          All 10 fingerprints are ready for authentication
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                  </div>
                </div>

                <Separator />

                {/* Fingerprint Management Options */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Fingerprint Management</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Fingerprint className="mr-2 h-5 w-5" />
                      <span>Re-enroll Fingerprints</span>
                    </Button>
                    
                    <Link to="/fingerprint-enrollment">
                      <Button variant="outline" className="w-full justify-start">
                        <Activity className="mr-2 h-5 w-5" />
                        <span>Test Fingerprint Login</span>
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-6">
                  <h3 className="font-medium text-amber-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    Security Notice
                  </h3>
                  <p className="text-sm text-amber-700 mt-2">
                    Your fingerprint data is securely stored on your device and is never shared with third parties.
                    For the highest level of security, we recommend using fingerprint authentication along with your password.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-gray-50">
              <div className="flex justify-between items-center w-full">
                <p className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
                <Link to="/fingerprint-enrollment">
                  <Button>
                    Manage Fingerprints
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
