
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const CurrentMedications: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Current Medications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-l-4 border-medimemo-primary pl-3 py-1">
            <h4 className="text-sm font-medium">Metformin 500mg</h4>
            <p className="text-xs text-gray-500">Twice daily, with meals</p>
            <p className="text-xs text-gray-400 mt-1">Dr. Patel - Last updated: May 10, 2023</p>
          </div>
          <div className="border-l-4 border-medimemo-primary pl-3 py-1">
            <h4 className="text-sm font-medium">Atorvastatin 20mg</h4>
            <p className="text-xs text-gray-500">Once daily, at bedtime</p>
            <p className="text-xs text-gray-400 mt-1">Dr. Shah - Last updated: April 5, 2023</p>
          </div>
          <div className="border-l-4 border-medimemo-primary pl-3 py-1">
            <h4 className="text-sm font-medium">Aspirin 81mg</h4>
            <p className="text-xs text-gray-500">Once daily, with breakfast</p>
            <p className="text-xs text-gray-400 mt-1">Dr. Shah - Last updated: April 5, 2023</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          Manage Medications
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CurrentMedications;
