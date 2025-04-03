
// Utility functions to handle fingerprint scanning and processing

export type FingerPosition = 
  | 'right_thumb'
  | 'right_index'
  | 'right_middle'
  | 'right_ring'
  | 'right_little'
  | 'left_thumb'
  | 'left_index'
  | 'left_middle'
  | 'left_ring'
  | 'left_little';

export interface FingerprintData {
  position: FingerPosition;
  quality: number; // 0-100
  template: string; // Base64 encoded template
  image?: string; // Base64 encoded image (optional)
}

export interface FingerprintsCollection {
  userId: string;
  fingerprints: FingerprintData[];
  createdAt: string;
  updatedAt: string;
}

// Map of finger positions to display names
export const fingerPositionNames: Record<FingerPosition, string> = {
  right_thumb: 'Right Thumb',
  right_index: 'Right Index',
  right_middle: 'Right Middle',
  right_ring: 'Right Ring',
  right_little: 'Right Little',
  left_thumb: 'Left Thumb',
  left_index: 'Left Index',
  left_middle: 'Left Middle',
  left_ring: 'Left Ring',
  left_little: 'Left Little'
};

// Get the display order for the finger positions
export const fingerPositionOrder: FingerPosition[] = [
  'left_little',
  'left_ring',
  'left_middle',
  'left_index',
  'left_thumb',
  'right_thumb',
  'right_index',
  'right_middle',
  'right_ring',
  'right_little'
];

/**
 * Simulates scanning a fingerprint
 * In a real app, this would interface with a fingerprint scanner API
 */
export const scanFingerprint = async (position: FingerPosition): Promise<FingerprintData> => {
  // Simulate scanning delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate a random template (in real app, this would be from the scanner)
  const template = btoa(`fingerprint_template_${position}_${Date.now()}`);
  
  // Return simulated fingerprint data
  return {
    position,
    quality: Math.floor(Math.random() * 30) + 70, // Random quality between 70-100
    template
  };
};

/**
 * Saves fingerprint data to localStorage
 * In a real app, this would be saved to a secure server
 */
export const saveFingerprints = (userId: string, fingerprints: FingerprintData[]): boolean => {
  try {
    const collection: FingerprintsCollection = {
      userId,
      fingerprints,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('userFingerprints', JSON.stringify(collection));
    return true;
  } catch (error) {
    console.error('Error saving fingerprints:', error);
    return false;
  }
};

/**
 * Retrieves fingerprint data from localStorage
 * In a real app, this would fetch from a secure server
 */
export const getFingerprints = (): FingerprintsCollection | null => {
  try {
    const data = localStorage.getItem('userFingerprints');
    if (!data) return null;
    
    return JSON.parse(data) as FingerprintsCollection;
  } catch (error) {
    console.error('Error retrieving fingerprints:', error);
    return null;
  }
};

/**
 * Verifies a scanned fingerprint against stored templates
 * In a real app, this would use a more sophisticated matching algorithm
 */
export const verifyFingerprint = async (scannedFingerprint: FingerprintData): Promise<boolean> => {
  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get stored fingerprints
  const storedData = getFingerprints();
  if (!storedData) return false;
  
  // In a real app, this would perform actual biometric matching
  // Here we'll just check if we have any fingerprints stored
  return storedData.fingerprints.length > 0;
};
