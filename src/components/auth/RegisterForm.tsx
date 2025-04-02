
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fingerprint, Lock, Mail, User, Calendar, Droplet, HeartPulse, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadhaar: '',
    dob: '',
    gender: 'male',
    bloodGroup: '',
    height: '',
    weight: '',
    contact: '',
    address: '',
    agreeTerms: false
  });
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedFingerprints, setCapturedFingerprints] = useState<Record<string, boolean>>({
    rightThumb: false,
    rightIndex: false,
    rightMiddle: false,
    rightRing: false,
    rightLittle: false,
    leftThumb: false,
    leftIndex: false,
    leftMiddle: false,
    leftRing: false,
    leftLittle: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'aadhaar') {
      const numericValue = value.replace(/\D/g, '');
      let formattedValue = '';
      
      for (let i = 0; i < numericValue.length && i < 12; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedValue += ' ';
        }
        formattedValue += numericValue[i];
      }
      
      setFormData({ ...formData, [name]: formattedValue });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleVerifyAadhaar = () => {
    if (formData.aadhaar.replace(/\s/g, '').length !== 12) {
      toast.error('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      toast.success('Aadhaar verification successful');
      setStep(2);
    }, 2000);
  };

  const handleCaptureFingerprint = (finger: string) => {
    // Simulate fingerprint capture
    toast.info(`Capturing ${finger.replace(/([A-Z])/g, ' $1').toLowerCase()} fingerprint...`);
    
    setTimeout(() => {
      setCapturedFingerprints(prev => ({
        ...prev,
        [finger]: true
      }));
      toast.success(`${finger.replace(/([A-Z])/g, ' $1').toLowerCase()} fingerprint captured successfully`);
      
      // Check if all fingerprints are captured
      const allCaptured = Object.values(capturedFingerprints).every(value => value === true);
      if (allCaptured) {
        toast.success('All fingerprints captured successfully!');
      }
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!formData.agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    
    // Check if all required fields are filled
    const requiredFields = ['name', 'email', 'password', 'confirmPassword', 'dob', 'gender', 'bloodGroup', 'contact'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Check if all fingerprints are captured
    const missingFingerprints = Object.entries(capturedFingerprints)
      .filter(([_, captured]) => !captured)
      .map(([finger, _]) => finger.replace(/([A-Z])/g, ' $1').toLowerCase());
    
    if (missingFingerprints.length > 0) {
      toast.error(`Please capture all fingerprints: ${missingFingerprints.join(', ')}`);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Registration successful! Please log in to access your account.');
      navigate('/login');
    }, 2000);
  };

  const allFingerprintsCaptured = Object.values(capturedFingerprints).every(value => value === true);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">
          Register to manage your medical records securely
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aadhaar">Aadhaar Number</Label>
              <div className="relative">
                <Fingerprint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="aadhaar"
                  name="aadhaar"
                  type="text"
                  placeholder="XXXX XXXX XXXX"
                  className="pl-10"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  maxLength={14}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your Aadhaar number is required for identity verification
              </p>
            </div>
            
            <Button 
              type="button" 
              className="w-full"
              onClick={handleVerifyAadhaar}
              disabled={isVerifying || formData.aadhaar.replace(/\s/g, '').length !== 12}
            >
              {isVerifying ? "Verifying..." : "Verify Aadhaar"}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    className="pl-10"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup 
                  value={formData.gender} 
                  onValueChange={(value) => handleSelectChange('gender', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Select 
                    value={formData.bloodGroup} 
                    onValueChange={(value) => handleSelectChange('bloodGroup', value)}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="contact"
                    name="contact"
                    type="tel"
                    placeholder="9876543210"
                    className="pl-10"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <div className="relative">
                  <HeartPulse className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    placeholder="175"
                    className="pl-10"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <div className="relative">
                  <HeartPulse className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    placeholder="70"
                    className="pl-10"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Your complete address"
                  className="pl-10 min-h-[80px]"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="p-4 border rounded-md space-y-3">
              <h3 className="font-semibold flex items-center">
                <Fingerprint className="mr-2" size={18} />
                Biometric Enrollment
              </h3>
              <p className="text-sm text-gray-500">Please capture all 10 fingerprints for biometric registration</p>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <h4 className="font-medium col-span-2">Right Hand</h4>
                  {['rightThumb', 'rightIndex', 'rightMiddle', 'rightRing', 'rightLittle'].map((finger) => (
                    <Button
                      key={finger}
                      type="button"
                      variant={capturedFingerprints[finger] ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => handleCaptureFingerprint(finger)}
                      disabled={capturedFingerprints[finger]}
                    >
                      <Fingerprint size={16} />
                      {finger.replace('right', '').replace(/([A-Z])/g, ' $1').trim()}
                      {capturedFingerprints[finger] && " ✓"}
                    </Button>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <h4 className="font-medium col-span-2">Left Hand</h4>
                  {['leftThumb', 'leftIndex', 'leftMiddle', 'leftRing', 'leftLittle'].map((finger) => (
                    <Button
                      key={finger}
                      type="button"
                      variant={capturedFingerprints[finger] ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => handleCaptureFingerprint(finger)}
                      disabled={capturedFingerprints[finger]}
                    >
                      <Fingerprint size={16} />
                      {finger.replace('left', '').replace(/([A-Z])/g, ' $1').trim()}
                      {capturedFingerprints[finger] && " ✓"}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="agreeTerms" 
                name="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, agreeTerms: checked as boolean })
                }
              />
              <label
                htmlFor="agreeTerms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-medimemo-primary hover:underline">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-medimemo-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !allFingerprintsCaptured}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-gray-600 w-full">
          Already have an account?{" "}
          <Link to="/login" className="text-medimemo-primary hover:underline font-medium">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
