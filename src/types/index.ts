
export interface User {
  id: string;
  name: string;
  email: string;
  aadhaarReference?: string;
  enrollmentComplete: boolean;
}

export interface MedicalRecord {
  id: string;
  title: string;
  type: string;
  category: string;
  date: string;
  fileUrl: string;
  fileSize: number;
  thumbnailUrl?: string;
}

export interface Folder {
  id: string;
  name: string;
  isSystemFolder: boolean;
  parentId?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  contact: string;
}

export interface MedicalCondition {
  name: string;
  diagnosedDate?: string;
  severity?: string;
  notes?: string;
}

export interface Allergy {
  name: string;
  severity: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  height?: number;
  weight?: number;
  contact: string;
  address: string;
  emergencyContacts: EmergencyContact[];
  allergies: Allergy[];
  medicalConditions: MedicalCondition[];
  currentMedications: Medication[];
}
