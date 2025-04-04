import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Plus, X, Fingerprint, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { Progress } from '@/components/ui/progress';
import { 
  FingerPosition, 
  FingerprintData, 
  scanFingerprint, 
  saveFingerprints,
  fingerPositionNames,
  fingerPositionOrder
} from '@/utils/fingerprint-utils';

// Form schema with zod validation
const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
  aadhaar: z
    .string()
    .regex(/^\d{12}$/, { message: 'Aadhaar must be 12 digits' })
    .optional()
    .or(z.literal('')),
  dob: z.string().optional(),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  contact: z
    .string()
    .regex(/^\d{10}$/, { message: 'Contact must be 10 digits' })
    .optional()
    .or(z.literal('')),
  address: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  allergies: z.array(z.string()).default([]),
  emergencyContactName: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  emergencyContactNumber: z
    .string()
    .regex(/^\d{10}$/, { message: 'Emergency contact must be 10 digits' })
    .optional()
    .or(z.literal(''))
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [registrationStep, setRegistrationStep] = useState<'form' | 'fingerprint' | 'complete'>('form');
  const [fingerprints, setFingerprints] = useState<FingerprintData[]>([]);
  const [currentFingerStep, setCurrentFingerStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningFinger, setScanningFinger] = useState<FingerPosition | null>(null);
  const [fingerprintProgress, setFingerprintProgress] = useState(0);
  const [formData, setFormData] = useState<RegisterFormValues | null>(null);
  const [hasFingerprints, setHasFingerprints] = useState(false);
  
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const totalFingerSteps = fingerPositionOrder.length;

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      aadhaar: '',
      dob: '',
      gender: '',
      bloodGroup: '',
      contact: '',
      address: '',
      height: '',
      weight: '',
      allergies: [],
      emergencyContactName: '',
      emergencyContactRelation: '',
      emergencyContactNumber: ''
    }
  });

  // Handle form submission
  const onSubmit = async (data: RegisterFormValues) => {
    // Store form data and move to fingerprint collection
    setFormData(data);
    setRegistrationStep('fingerprint');
  };

  // Handle final registration after fingerprint collection
  const completeRegistration = async () => {
    if (!formData) return;
    
    try {
      const success = await register(formData.email, formData.password, {
        name: formData.name,
        aadhaar: formData.aadhaar,
        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        contact: formData.contact,
        address: formData.address,
        height: formData.height,
        weight: formData.weight,
        allergies: formData.allergies,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactRelation: formData.emergencyContactRelation,
        emergencyContactNumber: formData.emergencyContactNumber,
        hasFingerprints: fingerprints.length > 0
      });
      
      if (success) {
        // Save fingerprints using the email as identifier
        if (fingerprints.length > 0) {
          saveFingerprints(formData.email, fingerprints);
          setHasFingerprints(true);
        }
        
        // Navigate to login page
        toast.success('Registration successful! Please log in to continue.');
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'An error occurred during registration');
    }
  };

  // Auto scan the next fingerprint after a successful scan
  const scanNextFingerprint = async () => {
    if (currentFingerStep >= totalFingerSteps) {
      return;
    }
    
    await handleFingerScan();
    
    // If we have more fingerprints to scan and the last scan was successful,
    // automatically start the next scan after a short delay
    if (fingerprints.length > 0 && currentFingerStep < totalFingerSteps) {
      setTimeout(() => {
        if (currentFingerStep < totalFingerSteps) {
          scanNextFingerprint();
        }
      }, 500);
    }
  };

  // Handle fingerprint scan
  const handleFingerScan = async () => {
    if (isScanning || currentFingerStep >= totalFingerSteps) return;

    const fingerPosition = fingerPositionOrder[currentFingerStep];
    setIsScanning(true);
    setScanningFinger(fingerPosition);

    try {
      // Simulate scanning process
      toast.info(`Scanning ${fingerPositionNames[fingerPosition]}`);
      
      // Call the scanning function
      const fingerprintData = await scanFingerprint(fingerPosition);
      
      // Add to collected fingerprints
      setFingerprints(prev => [...prev, fingerprintData]);
      
      // Show success message
      toast.success(`${fingerPositionNames[fingerPosition]} scanned successfully`);
      
      // Move to next step
      if (currentFingerStep < totalFingerSteps - 1) {
        setCurrentFingerStep(prev => prev + 1);
      }
      
      // Update progress
      setFingerprintProgress(((currentFingerStep + 1) / totalFingerSteps) * 100);
    } catch (error) {
      toast.error(`Failed to scan ${fingerPositionNames[fingerPosition]}`);
      console.error('Fingerprint scan error:', error);
    } finally {
      setIsScanning(false);
      setScanningFinger(null);
    }
  };

  // Skip fingerprint enrollment
  const skipFingerprints = () => {
    // Just move to the registration completion
    setRegistrationStep('complete');
  };

  // Reset fingerprints
  const resetFingerprints = () => {
    setFingerprints([]);
    setCurrentFingerStep(0);
    setFingerprintProgress(0);
  };

  // Start auto-scanning all fingerprints
  const startAutoScan = () => {
    resetFingerprints();
    scanNextFingerprint();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const addAllergy = () => {
    if (newAllergy.trim() === '') return;
    
    const currentAllergies = form.getValues('allergies') || [];
    if (!currentAllergies.includes(newAllergy.trim())) {
      form.setValue('allergies', [...currentAllergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    const currentAllergies = form.getValues('allergies') || [];
    form.setValue('allergies', currentAllergies.filter(a => a !== allergy));
  };

  // Render the appropriate step
  const renderStep = () => {
    switch (registrationStep) {
      case 'form':
        return (
          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
            </TabsList>
            
            <TabsContent value="individual">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                onClick={togglePasswordVisibility}
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="********"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                onClick={toggleConfirmPasswordVisibility}
                              >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="aadhaar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhaar Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789012" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="175" {...field} />
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
                            <Input type="number" placeholder="70" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
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
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergies</FormLabel>
                        <div className="flex space-x-2 mb-2">
                          <Input 
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            placeholder="Add allergy"
                            className="flex-1"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={addAllergy}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value?.map((allergy, index) => (
                            <div key={index} className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                              {allergy}
                              <button
                                type="button"
                                className="ml-1 text-secondary-foreground/70 hover:text-secondary-foreground"
                                onClick={() => removeAllergy(allergy)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your full address" 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4 border border-input rounded-md p-4">
                    <h3 className="text-sm font-medium">Emergency Contact</h3>
                    <FormField
                      control={form.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Contact person name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="emergencyContactRelation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Spouse, Parent" {...field} />
                            </FormControl>
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
                              <Input placeholder="9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Continue to Fingerprint Enrollment"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="organization">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Health Organization Name" {...field} />
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
                        <FormLabel>Organization Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="organization@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                onClick={togglePasswordVisibility}
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="********"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                onClick={toggleConfirmPasswordVisibility}
                              >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter organization address" 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering Organization...
                      </>
                    ) : (
                      "Register Organization"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        );
        
      case 'fingerprint':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Fingerprint Enrollment</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Register your fingerprints for faster and more secure authentication
              </p>
            </div>
            
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Progress</span>
                <span>{fingerprints.length} of {totalFingerSteps} fingerprints</span>
              </div>
              <Progress value={(fingerprints.length / totalFingerSteps) * 100} className="h-2" />
            </div>
            
            {/* Current finger to scan */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Fingerprint 
                  className={`h-12 w-12 ${isScanning ? 'text-primary animate-pulse' : 'text-gray-400'}`} 
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                {isScanning ? 
                  'Scanning in progress...' : 
                  fingerprints.length >= totalFingerSteps ? 
                    'All fingerprints collected!' : 
                    `Ready to scan your ${fingerPositionNames[fingerPositionOrder[currentFingerStep]]}`
                }
              </h3>
              <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                {isScanning 
                  ? 'Please keep your finger steady on the scanner' 
                  : fingerprints.length >= totalFingerSteps
                    ? 'You can now complete your registration'
                    : 'Click start scanning to begin the fingerprint collection process'
                }
              </p>
              
              {fingerprints.length >= totalFingerSteps ? (
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                  <Button variant="outline" onClick={resetFingerprints}>
                    Reset Fingerprints
                  </Button>
                  <Button onClick={() => setRegistrationStep('complete')}>
                    Complete Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                  <Button variant="outline" onClick={skipFingerprints}>
                    Skip for Now
                  </Button>
                  {fingerprints.length === 0 ? (
                    <Button
                      onClick={startAutoScan}
                      disabled={isScanning}
                    >
                      {isScanning ? 'Scanning...' : 'Start Scanning All Fingerprints'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFingerScan}
                      disabled={isScanning}
                    >
                      {isScanning ? 'Scanning...' : 'Scan Next Fingerprint'}
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {/* Fingerprint list */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-medium text-sm">Enrolled Fingerprints</h3>
              </div>
              <div className="p-1">
                <div className="grid grid-cols-2 gap-1">
                  {fingerPositionOrder.map((position, index) => {
                    const isEnrolled = fingerprints.some(f => f.position === position);
                    const isActive = currentFingerStep === index && fingerprints.length < totalFingerSteps;
                    
                    return (
                      <div 
                        key={position} 
                        className={`flex items-center p-2 rounded ${
                          isActive ? 'bg-blue-50 border border-blue-200' : 
                          isEnrolled ? 'bg-green-50 border border-green-200' : 
                          'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {isEnrolled ? (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <Fingerprint className={`h-4 w-4 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                          </div>
                        )}
                        <span className={`ml-2 text-sm ${
                          isActive ? 'font-medium text-blue-700' : 
                          isEnrolled ? 'font-medium text-green-700' : 
                          'text-gray-500'
                        }`}>
                          {fingerPositionNames[position]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'complete':
        return (
          <div className="space-y-6 text-center">
            <div>
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-xl font-medium">Ready to Complete Registration</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {fingerprints.length > 0 
                  ? `You've successfully enrolled ${fingerprints.length} fingerprints.` 
                  : "You've skipped fingerprint enrollment."}
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
              <p>Click "Complete Registration" to create your account.</p>
              {fingerprints.length === 0 && (
                <p className="mt-2">You can enroll your fingerprints later from your profile page.</p>
              )}
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={completeRegistration} 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setRegistrationStep('form')} 
                className="w-full"
              >
                Back to Form
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">
          Enter your information to create your MediMemo account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary underline underline-offset-4 hover:text-primary/90">
            Sign In
          </Link>
        </p>
        <p className="text-xs text-muted-foreground text-center mt-2">
          By creating an account, you agree to our{" "}
          <Link to="/terms-of-service" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy-policy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
