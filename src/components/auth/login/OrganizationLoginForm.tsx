
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface OrganizationLoginFormProps {
  isLoading: boolean;
}

const OrganizationLoginForm: React.FC<OrganizationLoginFormProps> = ({ isLoading }) => {
  const { login } = useAuth();
  const [orgId, setOrgId] = useState('');
  const [orgPassword, setOrgPassword] = useState('');

  const handleOrganizationLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Attempting organization login with:', { orgId, password: '******' });
      
      const success = await login('organization', {
        orgId,
        password: orgPassword
      });
      
      if (success) {
        toast.success('Organization login successful');
      } else {
        toast.error('Invalid credentials. Please check your Organization ID and password.');
      }
    } catch (error: any) {
      console.error('Organization login error:', error);
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <form onSubmit={handleOrganizationLogin}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="orgId">Organization ID</Label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              id="orgId"
              type="text"
              placeholder="Organization ID"
              className="pl-10"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="orgPassword">Password</Label>
            <Link to="/forgot-password" className="text-xs text-medimemo-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              id="orgPassword"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={orgPassword}
              onChange={(e) => setOrgPassword(e.target.value)}
              required
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Organization Log in"}
        </Button>
      </div>
    </form>
  );
};

export default OrganizationLoginForm;
