
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HealthAlerts from './HealthAlerts';
import CurrentMedications from './CurrentMedications';
import ProfileSummary from './ProfileSummary';
import { UserProfile } from '@/types';

interface SidebarTabsProps {
  userProfile: UserProfile | null;
}

const SidebarTabs: React.FC<SidebarTabsProps> = ({ userProfile }) => {
  return (
    <div>
      <Tabs defaultValue="alerts">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
        </TabsList>
        <TabsContent value="alerts" className="space-y-4">
          <HealthAlerts />
        </TabsContent>
        <TabsContent value="medications">
          <CurrentMedications />
        </TabsContent>
      </Tabs>

      <ProfileSummary userProfile={userProfile} />
    </div>
  );
};

export default SidebarTabs;
