
import { useState, useEffect } from 'react';
import { MedicalRecord } from '@/types';
import { toast } from 'sonner';

export const useMedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load records from localStorage (in a real app, this would be an API call)
  const fetchRecords = () => {
    setIsLoading(true);
    
    try {
      // Simulate API call with setTimeout
      setTimeout(() => {
        // Get user-specific records using the user's ID or email
        const userEmail = localStorage.getItem('userEmail');
        const userAadhaar = localStorage.getItem('userAadhaar');
        const userIdentifier = userEmail || userAadhaar || 'guest';
        
        const storedRecords = localStorage.getItem(`medicalRecords_${userIdentifier}`);
        if (storedRecords) {
          setRecords(JSON.parse(storedRecords));
        } else {
          setRecords([]);
        }
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to load medical records');
      setIsLoading(false);
    }
  };

  // Add a new medical record
  const addRecord = (newRecord: MedicalRecord) => {
    try {
      // Get user-specific identifier
      const userEmail = localStorage.getItem('userEmail');
      const userAadhaar = localStorage.getItem('userAadhaar');
      const userIdentifier = userEmail || userAadhaar || 'guest';
      
      const updatedRecords = [...records, newRecord];
      setRecords(updatedRecords);
      localStorage.setItem(`medicalRecords_${userIdentifier}`, JSON.stringify(updatedRecords));
      toast.success('Medical record added successfully');
      return true;
    } catch (err) {
      console.error('Error adding record:', err);
      toast.error('Failed to add medical record');
      return false;
    }
  };

  // Delete a medical record
  const deleteRecord = (recordId: string) => {
    try {
      // Get user-specific identifier
      const userEmail = localStorage.getItem('userEmail');
      const userAadhaar = localStorage.getItem('userAadhaar');
      const userIdentifier = userEmail || userAadhaar || 'guest';
      
      const updatedRecords = records.filter(record => record.id !== recordId);
      setRecords(updatedRecords);
      localStorage.setItem(`medicalRecords_${userIdentifier}`, JSON.stringify(updatedRecords));
      toast.success('Record deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting record:', err);
      toast.error('Failed to delete medical record');
      return false;
    }
  };

  // Update an existing medical record
  const updateRecord = (updatedRecord: MedicalRecord) => {
    try {
      // Get user-specific identifier
      const userEmail = localStorage.getItem('userEmail');
      const userAadhaar = localStorage.getItem('userAadhaar');
      const userIdentifier = userEmail || userAadhaar || 'guest';
      
      const updatedRecords = records.map(record => 
        record.id === updatedRecord.id ? updatedRecord : record
      );
      
      setRecords(updatedRecords);
      localStorage.setItem(`medicalRecords_${userIdentifier}`, JSON.stringify(updatedRecords));
      toast.success('Record updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating record:', err);
      toast.error('Failed to update medical record');
      return false;
    }
  };

  // Load records on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    records,
    isLoading,
    error,
    addRecord,
    deleteRecord,
    updateRecord,
    refreshRecords: fetchRecords
  };
};
