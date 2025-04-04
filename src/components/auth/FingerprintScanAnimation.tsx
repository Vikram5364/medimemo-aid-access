
import React, { useEffect, useState } from 'react';
import { Fingerprint, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';

interface FingerprintScanAnimationProps {
  status: ScanStatus;
  fingerPosition?: string;
  quality?: number;
}

const FingerprintScanAnimation: React.FC<FingerprintScanAnimationProps> = ({
  status,
  fingerPosition,
  quality = 0
}) => {
  const [ripples, setRipples] = useState<number[]>([]);
  
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
      
      return () => clearInterval(interval);
    } else {
      setRipples([]);
    }
  }, [status]);

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Fingerprint container with pulsing effect */}
      <div 
        className={cn(
          "relative w-28 h-28 rounded-full flex items-center justify-center mb-4 transition-all duration-500",
          status === 'idle' && "bg-gray-100",
          status === 'scanning' && "bg-blue-50",
          status === 'success' && "bg-green-50",
          status === 'error' && "bg-red-50"
        )}
      >
        {/* Ripple effects */}
        {ripples.map((id) => (
          <div 
            key={id}
            className="absolute inset-0 rounded-full bg-blue-300 opacity-30 animate-ripple"
            style={{ 
              animationDuration: '2s',
            }}
          />
        ))}
        
        {/* Icon based on status */}
        {status === 'success' ? (
          <CheckCircle2 className="w-14 h-14 text-green-500 animate-scale-in" />
        ) : status === 'error' ? (
          <XCircle className="w-14 h-14 text-red-500 animate-scale-in" />
        ) : (
          <Fingerprint 
            className={cn(
              "w-14 h-14 transition-all duration-300",
              status === 'idle' && "text-gray-400",
              status === 'scanning' && "text-blue-500 animate-pulse"
            )}
          />
        )}
      </div>
      
      {/* Status text */}
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
              <div className="h-full bg-blue-500 rounded-full animate-scanning-progress" style={{ width: `${Math.min(100, Math.max(5, Math.random() * 100))}%` }}></div>
            </div>
          </div>
        )}
        
        {status === 'success' && quality !== undefined && (
          <p className="text-sm text-green-600 mt-1">
            Quality: {quality}%
          </p>
        )}
      </div>
    </div>
  );
};

export default FingerprintScanAnimation;
