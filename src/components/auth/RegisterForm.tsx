
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Fingerprint, ArrowRight, CheckCircle } from 'lucide-react';

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  aadhaar: z
    .string()
    .min(12, { message: 'Aadhaar number must be 12 digits' })
    .max(12, { message: 'Aadhaar number must be 12 digits' })
    .regex(/^\d+$/, { message: 'Aadhaar number must contain only digits' }),
  dob: z.string().min(1, { message: 'Date of birth is required' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  bloodGroup: z.string().min(1, { message: 'Blood group is required' }),
  contact: z.string().min(10, { message: 'Contact number must be at least 10 digits' }),
  height: z.string().optional(),
  weight: z.string().optional(),
  address: z.string().min(1, { message: 'Address is required' }),
  emergencyContactName: z.string().min(1, { message: 'Emergency contact name is required' }),
  emergencyContactRelation: z.string().min(1, { message: 'Relationship is required' }),
  emergencyContactNumber: z.string().min(10, { message: 'Contact number must be at least 10 digits' }),
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'biodata' | 'biometric'>('biodata');
  const [isFingerScanActive, setIsFingerScanActive] = useState(false);
  const [scannedFingers, setScannedFingers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      aadhaar: '',
      dob: '',
      gender: '',
      bloodGroup: '',
      contact: '',
      height: '',
      weight: '',
      address: '',
      emergencyContactName: '',
      emergencyContactRelation: '',
      emergencyContactNumber: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (currentStep === 'biodata') {
      setCurrentStep('biometric');
      return;
    }

    if (scannedFingers.length < 10) {
      toast.error('Please complete the biometric enrollment for all fingers');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate registration process
    setTimeout(() => {
      console.log('Registration values:', values);
      console.log('Fingerprints:', scannedFingers);
      
      toast.success('Registration successful!');
      navigate('/dashboard');
      setIsSubmitting(false);
    }, 2000);
  };

  const fingerPositions = [
    'Right Thumb',
    'Right Index',
    'Right Middle',
    'Right Ring',
    'Right Little',
    'Left Thumb',
    'Left Index',
    'Left Middle',
    'Left Ring',
    'Left Little'
  ];

  const simulateFingerprintScan = (fingerPosition: string) => {
    if (scannedFingers.includes(fingerPosition)) {
      return;
    }

    setIsFingerScanActive(true);
    
    // Simulate fingerprint scanning
    setTimeout(() => {
      setScannedFingers(prev => [...prev, fingerPosition]);
      setIsFingerScanActive(false);
      toast.success(`${fingerPosition} scanned successfully`);
    }, 1500);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-medimemo-primary" />
          <CardTitle className="text-2xl font-bold">Create your MediMemo account</CardTitle>
        </div>
        <CardDescription>
          Register with Aadhaar to securely store and access your medical records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={currentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="biodata" disabled={currentStep === 'biometric'}>Personal Information</TabsTrigger>
            <TabsTrigger value="biometric" disabled={currentStep === 'biodata'}>Biometric Enrollment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="biodata">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="aadhaar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhaar Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="12-digit Aadhaar Number" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length <= 12) {
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Group</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
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
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Height in cm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Weight in kg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Your current address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="bg-blue-50 p-4 rounded-md mt-6">
                  <h3 className="text-md font-semibold mb-3">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Contact name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="emergencyContactRelation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Relationship" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="relative">Other Relative</SelectItem>
                              <SelectItem value="friend">Friend</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="emergencyContactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Contact phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                >
                  Continue to Biometric Enrollment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="biometric">
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-md font-semibold flex items-center mb-2">
                  <Fingerprint className="h-5 w-5 mr-2 text-medimemo-primary" />
                  Fingerprint Enrollment
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Please scan all 10 fingerprints for complete biometric enrollment. 
                  This will allow emergency healthcare access through fingerprint identification.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {fingerPositions.map((finger) => (
                    <div 
                      key={finger} 
                      className={`border rounded-md p-3 cursor-pointer transition-all
                        ${scannedFingers.includes(finger) 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-gray-200 hover:border-blue-300'}
                        ${isFingerScanActive ? 'pointer-events-none opacity-50' : ''}
                      `}
                      onClick={() => simulateFingerprintScan(finger)}
                    >
                      <div className="flex flex-col items-center">
                        {scannedFingers.includes(finger) ? (
                          <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
                        ) : (
                          <Fingerprint className={`h-10 w-10 ${isFingerScanActive ? 'animate-pulse text-blue-500' : 'text-gray-400'} mb-2`} />
                        )}
                        <p className="text-xs text-center font-medium">{finger}</p>
                        {scannedFingers.includes(finger) && (
                          <span className="text-xs text-green-600 mt-1">Scanned</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setCurrentStep('biodata')}
                  disabled={isFingerScanActive || isSubmitting}
                >
                  Back to Personal Information
                </Button>
                
                <Button 
                  type="button"
                  onClick={form.handleSubmit(handleSubmit)}
                  disabled={scannedFingers.length < 10 || isFingerScanActive || isSubmitting}
                  className={scannedFingers.length < 10 ? 'opacity-50' : ''}
                >
                  {isSubmitting ? 'Registering...' : 'Complete Registration'}
                </Button>
              </div>
              
              {scannedFingers.length < 10 && (
                <p className="text-sm text-amber-600 text-center mt-2">
                  Please scan all 10 fingerprints to complete registration ({scannedFingers.length}/10 completed)
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-gray-500 text-center w-full">
          By registering, you agree to MediMemo's Terms of Service and Privacy Policy
        </div>
        <div className="text-sm text-center w-full">
          Already have an account?{' '}
          <Link to="/login" className="text-medimemo-primary hover:underline">
            Login here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
