
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';

// Import our new components
import LoginTabs from './login/LoginTabs';
import EmailLoginForm from './login/EmailLoginForm';
import AadhaarLoginForm from './login/AadhaarLoginForm';
import OrganizationLoginForm from './login/OrganizationLoginForm';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();
  const [userType, setUserType] = useState('individual');
  const [loginMethod, setLoginMethod] = useState('email');
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login to MediMemo</CardTitle>
        <CardDescription className="text-center">
          Access your medical records securely
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginTabs 
          defaultValue="individual" 
          onValueChange={setUserType}
          tabsList={[
            { value: 'individual', label: 'Individual' },
            { value: 'organization', label: 'Hospital/Organization' }
          ]}
        >
          <TabsContent value="individual">
            <LoginTabs 
              defaultValue="email" 
              onValueChange={setLoginMethod}
              tabsList={[
                { value: 'email', label: 'Email' },
                { value: 'aadhaar', label: 'Aadhaar' }
              ]}
            >
              <TabsContent value="email">
                <EmailLoginForm isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="aadhaar">
                <AadhaarLoginForm isLoading={isLoading} />
              </TabsContent>
            </LoginTabs>
          </TabsContent>
          
          <TabsContent value="organization">
            <OrganizationLoginForm isLoading={isLoading} />
          </TabsContent>
        </LoginTabs>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-gray-600 w-full">
          Don't have an account?{" "}
          <Link to="/register" className="text-medimemo-primary hover:underline font-medium">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
