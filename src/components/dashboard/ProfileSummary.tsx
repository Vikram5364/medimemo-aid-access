
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileSummaryProps {
  userProfile: UserProfile | null;
  isLoading?: boolean;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ userProfile, isLoading = false }) => {
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    navigate('/profile');
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Medical Profile Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-medium text-gray-500">Blood Group</h4>
              <Skeleton className="h-5 w-12 mt-1" />
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-500">Allergies</h4>
              <div className="flex gap-1 mt-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-500">Chronic Conditions</h4>
              <Skeleton className="h-5 w-full mt-1" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full" disabled>
            View Full Profile
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Medical Profile Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userProfile && (
            <>
              <div>
                <h4 className="text-xs font-medium text-gray-500">Blood Group</h4>
                <p className="text-sm font-medium">{userProfile.bloodGroup || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500">Allergies</h4>
                {userProfile.allergies && userProfile.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {userProfile.allergies.map((allergy, index) => (
                      <span 
                        key={index} 
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                          ${allergy.severity === 'severe' ? 'bg-red-100 text-red-800' : 
                            allergy.severity === 'moderate' ? 'bg-orange-100 text-orange-800' : 
                              'bg-yellow-100 text-yellow-800'}`}
                      >
                        {allergy.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No known allergies</p>
                )}
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500">Chronic Conditions</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userProfile.medicalConditions && userProfile.medicalConditions.length > 0 ? (
                    userProfile.medicalConditions.map((condition, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {condition.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No chronic conditions</p>
                  )}
                </div>
              </div>
            </>
          )}
          {!userProfile && (
            <p className="text-sm text-gray-500 italic">Profile data not available</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full" onClick={handleViewProfile}>
          View Full Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSummary;
