
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { 
  FingerprintData, 
  saveFingerprints
} from '@/utils/fingerprint-utils';
import UserRegistrationForm, { RegisterFormValues } from './UserRegistrationForm';
import OrganizationRegistrationForm from './OrganizationRegistrationForm';
import FingerprintEnrollment from './FingerprintEnrollment';
import RegistrationComplete from './RegistrationComplete';

type RegistrationStep = 'form' | 'fingerprint' | 'complete';

const RegisterForm = () => {
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('form');
  const [fingerprints, setFingerprints] = useState<FingerprintData[]>([]);
  const [formData, setFormData] = useState<RegisterFormValues | null>(null);
  const [hasFingerprints, setHasFingerprints] = useState(false);
  
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  // Handle form submission
  const onSubmit = async (data: RegisterFormValues) => {
    // Store form data and move to fingerprint collection
    setFormData(data);
    setRegistrationStep('fingerprint');
  };

  // Handle fingerprint completion
  const handleFingerprintComplete = (collectedFingerprints: FingerprintData[]) => {
    setFingerprints(collectedFingerprints);
    setRegistrationStep('complete');
  };

  // Skip fingerprint enrollment
  const skipFingerprints = () => {
    // Just move to the registration completion
    setRegistrationStep('complete');
  };

  // Handle final registration after fingerprint collection
  const completeRegistration = async () => {
    if (!formData) return;
    
    try {
      // Directly register the user, bypassing email confirmation
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
          toast.success('Fingerprints saved successfully!');
        }
        
        // Navigate to dashboard directly instead of login
        toast.success('Registration successful! You are now logged in.');
        
        // Ensure we're redirecting to dashboard with a slight delay to allow state updates
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'An error occurred during registration');
    }
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
              <UserRegistrationForm onSubmit={onSubmit} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="organization">
              <OrganizationRegistrationForm onSubmit={onSubmit} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        );
        
      case 'fingerprint':
        return (
          <FingerprintEnrollment 
            onComplete={handleFingerprintComplete} 
            onSkip={skipFingerprints} 
          />
        );
        
      case 'complete':
        return (
          <RegistrationComplete 
            fingerprints={fingerprints} 
            onComplete={completeRegistration} 
            onBack={() => setRegistrationStep('form')}
            isLoading={isLoading}
          />
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
