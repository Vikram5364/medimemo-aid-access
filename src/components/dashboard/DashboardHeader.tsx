
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  userType: 'individual' | 'organization';
  onAddRecord: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userType, onAddRecord }) => {
  return (
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
      <Button onClick={onAddRecord}>
        <Plus className="mr-2 h-4 w-4" />
        Add Medical Record
      </Button>
    </div>
  );
};

export default DashboardHeader;
