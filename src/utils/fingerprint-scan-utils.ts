
import { toast } from 'sonner';
import { 
  FingerPosition, 
  FingerprintData, 
  scanFingerprint,
  fingerPositionNames,
  fingerPositionOrder
} from './fingerprint-utils';

/**
 * Interface for fingerprint scan states and handlers
 */
export interface FingerprintScanState {
  fingerprints: FingerprintData[];
  currentFingerIndex: number;
  isScanning: boolean;
  scanningFinger: FingerPosition | null;
  progress: number;
}

/**
 * Interface for scan result
 */
export interface ScanResult {
  success: boolean;
  fingerprint?: FingerprintData;
  error?: string;
}

/**
 * Calculates the progress percentage based on collected fingerprints
 */
export const calculateFingerprintProgress = (fingerprints: FingerprintData[]): number => {
  const totalFingers = fingerPositionOrder.length;
  return (fingerprints.length / totalFingers) * 100;
};

/**
 * Performs a single fingerprint scan for the specified position
 */
export const performFingerScan = async (position: FingerPosition): Promise<ScanResult> => {
  try {
    toast.info(`Scanning ${fingerPositionNames[position]}`);
    
    // Perform the scan
    const fingerprintData = await scanFingerprint(position);
    
    // Show success message
    toast.success(`${fingerPositionNames[position]} scanned successfully`);
    
    return {
      success: true,
      fingerprint: fingerprintData
    };
  } catch (error) {
    const errorMessage = `Failed to scan ${fingerPositionNames[position]}`;
    toast.error(errorMessage);
    console.error('Fingerprint scan error:', error);
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Gets the next finger position to scan
 */
export const getNextFingerPosition = (currentIndex: number): FingerPosition | null => {
  if (currentIndex < 0 || currentIndex >= fingerPositionOrder.length) {
    return null;
  }
  return fingerPositionOrder[currentIndex];
};

/**
 * Updates the scan state with a new fingerprint
 */
export const updateScanState = (
  state: FingerprintScanState, 
  newFingerprint: FingerprintData
): FingerprintScanState => {
  const updatedFingerprints = [...state.fingerprints, newFingerprint];
  const nextIndex = state.currentFingerIndex + 1;
  
  return {
    fingerprints: updatedFingerprints,
    currentFingerIndex: nextIndex,
    isScanning: false,
    scanningFinger: null,
    progress: calculateFingerprintProgress(updatedFingerprints)
  };
};

/**
 * Determines if the fingerprint collection is complete
 */
export const isFingerprintCollectionComplete = (fingerprints: FingerprintData[]): boolean => {
  return fingerprints.length >= fingerPositionOrder.length;
};

/**
 * Initializes an empty fingerprint scan state
 */
export const initializeScanState = (): FingerprintScanState => {
  return {
    fingerprints: [],
    currentFingerIndex: 0,
    isScanning: false,
    scanningFinger: null,
    progress: 0
  };
};

/**
 * Auto-scans multiple fingerprints in sequence
 * Returns the updated scan state with all collected fingerprints
 */
export const autoScanFingerprints = async (
  onStateUpdate: (state: FingerprintScanState) => void,
  maxFingers = fingerPositionOrder.length
): Promise<FingerprintScanState> => {
  let state = initializeScanState();
  onStateUpdate(state);
  
  for (let i = 0; i < maxFingers; i++) {
    // Update state to indicate scanning is in progress
    const currentPosition = fingerPositionOrder[i];
    state = {
      ...state,
      isScanning: true,
      scanningFinger: currentPosition
    };
    onStateUpdate(state);
    
    // Perform the scan
    const result = await performFingerScan(currentPosition);
    
    if (result.success && result.fingerprint) {
      // Update state with the new fingerprint
      state = updateScanState(state, result.fingerprint);
      onStateUpdate(state);
    } else {
      // If scan failed, stop the auto-scan process
      state = {
        ...state,
        isScanning: false,
        scanningFinger: null
      };
      onStateUpdate(state);
      break;
    }
    
    // Small delay between scans for UX
    if (i < maxFingers - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return state;
};

/**
 * Helper to check if a specific finger position has been enrolled
 */
export const isFingerEnrolled = (
  fingerprints: FingerprintData[], 
  position: FingerPosition
): boolean => {
  return fingerprints.some(f => f.position === position);
};

/**
 * Format fingerprint data for display
 */
export const formatFingerprintList = (fingerprints: FingerprintData[]): string => {
  if (fingerprints.length === 0) {
    return "No fingerprints enrolled";
  }
  
  return fingerprints
    .map(f => fingerPositionNames[f.position])
    .join(', ');
};
