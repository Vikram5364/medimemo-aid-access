
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
        const storedRecords = localStorage.getItem('medicalRecords');
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
      const updatedRecords = [...records, newRecord];
      setRecords(updatedRecords);
      localStorage.setItem('medicalRecords', JSON.stringify(updatedRecords));
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
      const updatedRecords = records.filter(record => record.id !== recordId);
      setRecords(updatedRecords);
      localStorage.setItem('medicalRecords', JSON.stringify(updatedRecords));
      toast.success('Record deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting record:', err);
      toast.error('Failed to delete medical record');
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
    refreshRecords: fetchRecords
  };
};
