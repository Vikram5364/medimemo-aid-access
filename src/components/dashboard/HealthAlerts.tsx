
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const HealthAlerts: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Important Health Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="ml-2">
              <h4 className="text-sm font-medium">Medication Renewal</h4>
              <p className="text-xs text-gray-500">Your prescription for Metformin will expire in 7 days</p>
            </div>
          </div>
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="ml-2">
              <h4 className="text-sm font-medium">Annual Checkup Due</h4>
              <p className="text-xs text-gray-500">Your annual health checkup is overdue by 2 months</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          View All Alerts
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HealthAlerts;
