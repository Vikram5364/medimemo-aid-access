
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LoginTabsProps {
  defaultValue: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  tabsList: Array<{
    value: string;
    label: string;
  }>;
}

const LoginTabs: React.FC<LoginTabsProps> = ({ 
  defaultValue, 
  onValueChange, 
  children,
  tabsList 
}) => {
  return (
    <Tabs defaultValue={defaultValue} onValueChange={onValueChange}>
      <TabsList className="grid w-full grid-cols-2 mb-6">
        {tabsList.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default LoginTabs;
