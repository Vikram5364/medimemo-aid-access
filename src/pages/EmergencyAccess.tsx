
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Fingerprint, ArrowLeft, Heart, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Footer from '@/components/layout/Footer';

const EmergencyAccess = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isPatientFound, setIsPatientFound] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);

  const handleScanFingerprint = () => {
    setIsScanning(true);
    
    // Simulate fingerprint scanning and patient lookup
    setTimeout(() => {
      setIsScanning(false);
      setIsPatientFound(true);
      toast.success('Patient identified successfully through biometric verification');
    }, 3000);
  };

  const handleVerifyAadhaar = () => {
    if (aadhaarNumber.replace(/\s/g, '').length !== 12) {
      toast.error('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    
    setIsVerifyingAadhaar(true);
    
    // Simulate Aadhaar verification
    setTimeout(() => {
      setIsVerifyingAadhaar(false);
      setIsPatientFound(true);
      toast.success('Patient identified successfully through Aadhaar');
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-red-600 text-white py-3">
        <div className="medimemo-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Heart size={28} className="text-white" />
                <span className="font-bold text-xl">MediMemo Emergency Access</span>
              </Link>
            </div>
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-red-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Exit Emergency Mode
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="medimemo-container">
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-8 flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-red-600">Emergency Access Portal</h2>
              <p className="text-gray-700 mt-1">
                This portal is designed for healthcare providers to access critical medical information in emergency situations. 
                Patient consent is automatically recorded. All access is strictly logged and monitored.
              </p>
            </div>
          </div>
          
          {isPatientFound ? (
            <div className="max-w-4xl mx-auto">
              <Card className="border-red-200 shadow-md">
                <CardHeader className="bg-red-50 border-b border-red-100">
                  <CardTitle className="text-xl text-red-800">Patient Critical Information</CardTitle>
                  <CardDescription>
                    Emergency access granted to this patient's critical medical information
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                      <div>
                        <h3 className="text-xl font-semibold">Rahul Sharma</h3>
                        <p className="text-gray-500">43 years old, Male</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <span className="text-xs text-gray-500 block">Blood Group</span>
                          <span className="text-lg font-bold text-red-600">O+</span>
                        </div>
                        <div className="text-center border-l border-gray-200 pl-4">
                          <span className="text-xs text-gray-500 block">MediMemo ID</span>
                          <span className="text-sm font-medium">MM-2023-0584</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Emergency Contacts</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-gray-200 rounded-md p-3">
                          <p className="font-medium">Priya Sharma (Wife)</p>
                          <p className="text-gray-600">+91 98765 43210</p>
                        </div>
                        <div className="border border-gray-200 rounded-md p-3">
                          <p className="font-medium">Anil Sharma (Brother)</p>
                          <p className="text-gray-600">+91 98765 12345</p>
                        </div>
                      </div>
                    </div>
                    
                    <Tabs defaultValue="allergies">
                      <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="allergies">Allergies</TabsTrigger>
                        <TabsTrigger value="medications">Medications</TabsTrigger>
                        <TabsTrigger value="conditions">Medical Conditions</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="allergies">
                        <div className="bg-red-50 p-4 rounded-md">
                          <h4 className="font-semibold mb-2 text-red-700">Known Allergies</h4>
                          <ul className="space-y-2">
                            <li className="flex items-center">
                              <span className="h-2 w-2 bg-red-600 rounded-full mr-2"></span>
                              <span className="font-medium">Penicillin</span>
                              <span className="ml-2 text-sm text-gray-600">(Severe - Anaphylaxis)</span>
                            </li>
                            <li className="flex items-center">
                              <span className="h-2 w-2 bg-red-600 rounded-full mr-2"></span>
                              <span className="font-medium">Shellfish</span>
                              <span className="ml-2 text-sm text-gray-600">(Moderate - Rash and hives)</span>
                            </li>
                            <li className="flex items-center">
                              <span className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></span>
                              <span className="font-medium">Latex</span>
                              <span className="ml-2 text-sm text-gray-600">(Mild - Skin irritation)</span>
                            </li>
                          </ul>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="medications">
                        <div className="p-4 border border-gray-200 rounded-md">
                          <h4 className="font-semibold mb-2">Current Medications</h4>
                          <ul className="space-y-3">
                            <li className="pb-2 border-b border-gray-100">
                              <div className="flex justify-between">
                                <span className="font-medium">Metformin</span>
                                <span className="text-sm">500mg</span>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">Twice daily with meals</div>
                            </li>
                            <li className="pb-2 border-b border-gray-100">
                              <div className="flex justify-between">
                                <span className="font-medium">Amlodipine</span>
                                <span className="text-sm">5mg</span>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">Once daily in the morning</div>
                            </li>
                            <li>
                              <div className="flex justify-between">
                                <span className="font-medium">Aspirin</span>
                                <span className="text-sm">81mg</span>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">Once daily with breakfast</div>
                            </li>
                          </ul>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="conditions">
                        <div className="p-4 border border-gray-200 rounded-md">
                          <h4 className="font-semibold mb-2">Medical Conditions</h4>
                          <ul className="space-y-3">
                            <li className="pb-2 border-b border-gray-100">
                              <span className="font-medium">Type 2 Diabetes</span>
                              <div className="text-sm text-gray-600 mt-1">Diagnosed in 2018, well controlled with medication</div>
                            </li>
                            <li className="pb-2 border-b border-gray-100">
                              <span className="font-medium">Hypertension</span>
                              <div className="text-sm text-gray-600 mt-1">Diagnosed in 2019, treated with Amlodipine</div>
                            </li>
                            <li>
                              <span className="font-medium">Appendectomy</span>
                              <div className="text-sm text-gray-600 mt-1">Surgical procedure in 2010</div>
                            </li>
                          </ul>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Recent Medical Documents</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Card className="shadow-none">
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm">Latest Blood Work</CardTitle>
                            <CardDescription className="text-xs">Added May 10, 2023</CardDescription>
                          </CardHeader>
                          <CardFooter className="py-2 px-4 bg-gray-50 flex justify-end">
                            <Button variant="ghost" size="sm" className="h-8">View</Button>
                          </CardFooter>
                        </Card>
                        <Card className="shadow-none">
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm">Cardiology Report</CardTitle>
                            <CardDescription className="text-xs">Added April 22, 2023</CardDescription>
                          </CardHeader>
                          <CardFooter className="py-2 px-4 bg-gray-50 flex justify-end">
                            <Button variant="ghost" size="sm" className="h-8">View</Button>
                          </CardFooter>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Emergency access granted at {new Date().toLocaleTimeString()}
                  </p>
                  <Button variant="outline">
                    Download Summary
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="text-center mt-8">
                <p className="text-sm text-gray-500 mb-2">
                  This emergency access will be logged and the patient will be notified
                </p>
                <Link to="/">
                  <Button variant="ghost" className="text-gray-600">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Home
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <Card className="border-red-200 shadow-md">
                <CardHeader className="bg-red-50 border-b border-red-100">
                  <div className="flex items-center">
                    <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                    <div>
                      <CardTitle>Emergency Patient Identification</CardTitle>
                      <CardDescription>
                        Identify the patient to access their critical medical information
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs defaultValue="biometric">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="biometric">Biometric Identification</TabsTrigger>
                      <TabsTrigger value="aadhaar">Aadhaar Number</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="biometric" className="mt-6">
                      <div className="text-center">
                        <div className="w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                          {isScanning ? (
                            <div className="flex flex-col items-center">
                              <Fingerprint className="h-12 w-12 text-red-500 animate-pulse" />
                              <p className="text-sm text-gray-600 mt-2">Scanning...</p>
                            </div>
                          ) : (
                            <Fingerprint className="h-12 w-12 text-gray-400" />
                          )}
                        </div>
                        <p className="text-gray-700 mb-6">
                          Place the patient's finger on the scanner to identify them and access their critical medical information
                        </p>
                        <Button 
                          onClick={handleScanFingerprint}
                          disabled={isScanning}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Fingerprint className="mr-2 h-4 w-4" />
                          {isScanning ? "Scanning Fingerprint..." : "Scan Fingerprint"}
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="aadhaar" className="mt-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Enter Patient's Aadhaar Number</label>
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="XXXX XXXX XXXX"
                              value={aadhaarNumber}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                let formattedValue = '';
                                
                                for (let i = 0; i < value.length && i < 12; i++) {
                                  if (i > 0 && i % 4 === 0) {
                                    formattedValue += ' ';
                                  }
                                  formattedValue += value[i];
                                }
                                
                                setAadhaarNumber(formattedValue);
                              }}
                              maxLength={14}
                              className="border-gray-300"
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            Enter the patient's 12-digit Aadhaar number to access their emergency information
                          </p>
                        </div>
                        
                        <div className="flex justify-center">
                          <Button 
                            onClick={handleVerifyAadhaar}
                            disabled={isVerifyingAadhaar || aadhaarNumber.replace(/\s/g, '').length !== 12}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Search className="mr-2 h-4 w-4" />
                            {isVerifyingAadhaar ? "Verifying..." : "Find Patient"}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t border-gray-200">
                  <p className="text-xs text-gray-500 w-full text-center">
                    This is for emergency use only. All access is logged and monitored.
                  </p>
                </CardFooter>
              </Card>
              
              <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Healthcare Provider Information</h3>
                <p className="text-gray-600 text-sm mb-4">
                  If you're a healthcare provider and need regular access to patient records, please register for a healthcare provider account.
                </p>
                <div className="flex justify-center">
                  <Link to="/register">
                    <Button variant="outline">
                      Register as Healthcare Provider
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EmergencyAccess;
