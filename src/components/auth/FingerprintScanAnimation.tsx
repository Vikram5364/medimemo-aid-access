
import React, { useEffect, useState, useCallback } from 'react';
import { Fingerprint, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';

interface FingerprintScanAnimationProps {
  status: ScanStatus;
  fingerPosition?: string;
  quality?: number;
  onScan?: () => void;
}

const FingerprintScanAnimation: React.FC<FingerprintScanAnimationProps> = ({
  status,
  fingerPosition,
  quality = 0,
  onScan
}) => {
  const [ripples, setRipples] = useState<number[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  // Add ripple effect during scanning
  useEffect(() => {
    if (status === 'scanning') {
      const interval = setInterval(() => {
        setRipples(prev => {
          // Add new ripple and remove old ones
          const newRipples = [...prev, Date.now()];
          return newRipples.filter(id => Date.now() - id < 2000);
        });
      }, 600);
      
      // Simulate scan progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) return prev;
          const increment = Math.random() * 10;
          return Math.min(prev + increment, 100);
        });
      }, 300);
      
      return () => {
        clearInterval(interval);
        clearInterval(progressInterval);
      };
    } else {
      setRipples([]);
      setScanProgress(0);
    }
  }, [status]);

  // Handle press simulation
  const handlePress = useCallback(() => {
    if (status === 'idle' && onScan) {
      setIsPressed(true);
      onScan();
    }
  }, [status, onScan]);

  const handleRelease = useCallback(() => {
    setIsPressed(false);
  }, []);

  // Add keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        handlePress();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        handleRelease();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handlePress, handleRelease]);

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Interactive instructions when idle */}
      {status === 'idle' && onScan && (
        <p className="text-sm text-blue-600 animate-pulse mb-2">
          Press and hold to scan
        </p>
      )}
      
      {/* Fingerprint container with pulsing effect */}
      <div 
        className={cn(
          "relative w-28 h-28 rounded-full flex items-center justify-center mb-4 transition-all duration-500",
          status === 'idle' && "bg-gray-100 cursor-pointer hover:bg-gray-200",
          status === 'scanning' && "bg-blue-50 border-2 border-blue-300",
          status === 'success' && "bg-green-50 border-2 border-green-300",
          status === 'error' && "bg-red-50 border-2 border-red-300",
          isPressed && "scale-95"
        )}
        role="button"
        tabIndex={0}
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
          }
        }}
      >
        {/* Ripple effects with enhanced visuals */}
        {ripples.map((id) => (
          <div 
            key={id}
            className="absolute inset-0 rounded-full bg-blue-300 opacity-30 animate-ripple"
            style={{ 
              animationDuration: '2s',
            }}
          />
        ))}
        
        {/* Scanning overlay with glow effect */}
        {status === 'scanning' && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div 
              className="absolute inset-0 bg-blue-400 opacity-10 animate-pulse" 
              style={{ animationDuration: '1.5s' }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-blue-500 h-0.5" 
              style={{ 
                transform: `translateY(${-(scanProgress)}%)`,
                transition: 'transform 0.3s ease-out'
              }} 
            />
          </div>
        )}
        
        {/* Icon based on status with improved animations */}
        {status === 'success' ? (
          <CheckCircle2 className="w-14 h-14 text-green-500 animate-scale-in" />
        ) : status === 'error' ? (
          <XCircle className="w-14 h-14 text-red-500 animate-scale-in" />
        ) : status === 'scanning' ? (
          <Loader2 className="w-14 h-14 text-blue-500 animate-spin" />
        ) : (
          <Fingerprint 
            className={cn(
              "w-14 h-14 transition-all duration-300",
              status === 'idle' && "text-gray-400",
              isPressed && "text-blue-500 scale-90"
            )}
          />
        )}
      </div>
      
      {/* Status text with enhanced styling */}
      <div className="text-center">
        <h3 className={cn(
          "text-lg font-bold transition-colors duration-300",
          status === 'idle' && "text-gray-700",
          status === 'scanning' && "text-blue-700",
          status === 'success' && "text-green-700",
          status === 'error' && "text-red-700"
        )}>
          {status === 'idle' && 'Ready to scan'}
          {status === 'scanning' && `Scanning ${fingerPosition || 'finger'}`}
          {status === 'success' && 'Scan successful!'}
          {status === 'error' && 'Scan failed'}
        </h3>
        
        {status === 'scanning' && (
          <div className="mt-2 flex flex-col items-center space-y-1">
            <p className="text-sm text-blue-600">Please keep your finger steady</p>
            <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, Math.max(5, scanProgress))}%` }}
              />
            </div>
          </div>
        )}
        
        {status === 'success' && quality !== undefined && (
          <p className="text-sm text-green-600 mt-1">
            Quality: {quality}%
          </p>
        )}
        
        {status === 'error' && (
          <button 
            onClick={() => onScan && onScan()} 
            className="mt-2 text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};

export default FingerprintScanAnimation;
