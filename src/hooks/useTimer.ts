import React from 'react';

interface UseTimerProps {
  initialTime: number;
  countDown?: boolean;
  autoStart?: boolean;
  onComplete?: () => void;
  onHalfway?: () => void;
  onTenSecondsLeft?: () => void;
}

interface UseTimerReturn {
  time: number;
  isRunning: boolean;
  isPaused: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  formatTime: (includeHours?: boolean) => string;
}

const useTimer = ({
  initialTime,
  countDown = false,
  autoStart = false,
  onComplete,
  onHalfway,
  onTenSecondsLeft
}: UseTimerProps): UseTimerReturn => {
  const [time, setTime] = React.useState<number>(initialTime);
  const [isRunning, setIsRunning] = React.useState<boolean>(autoStart);
  const [isPaused, setIsPaused] = React.useState<boolean>(false);
  
  const intervalRef = React.useRef<number | null>(null);
  const halfwayFiredRef = React.useRef<boolean>(false);
  const tenSecondsFiredRef = React.useRef<boolean>(false);
  
  // Format time as MM:SS or HH:MM:SS
  const formatTime = React.useCallback((includeHours: boolean = false): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    
    if (includeHours || hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [time]);
  
  // Start the timer
  const start = React.useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    }
  }, [isRunning]);
  
  // Pause the timer
  const pause = React.useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      setIsPaused(true);
    }
  }, [isRunning]);
  
  // Reset the timer
  const reset = React.useCallback(() => {
    setTime(initialTime);
    setIsRunning(false);
    setIsPaused(false);
    halfwayFiredRef.current = false;
    tenSecondsFiredRef.current = false;
  }, [initialTime]);
  
  // Timer effect
  React.useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => {
          // For countdown timer
          if (countDown) {
            // Check if halfway point is reached
            if (onHalfway && !halfwayFiredRef.current && prevTime <= initialTime / 2) {
              onHalfway();
              halfwayFiredRef.current = true;
            }
            
            // Check if 10 seconds left
            if (onTenSecondsLeft && !tenSecondsFiredRef.current && prevTime <= 10) {
              onTenSecondsLeft();
              tenSecondsFiredRef.current = true;
            }
            
            // Check if timer is complete
            if (prevTime <= 1) {
              if (onComplete) {
                onComplete();
              }
              clearInterval(intervalRef.current!);
              setIsRunning(false);
              return 0;
            }
            
            return prevTime - 1;
          } 
          // For count-up timer
          else {
            return prevTime + 1;
          }
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, countDown, initialTime, onComplete, onHalfway, onTenSecondsLeft]);
  
  return {
    time,
    isRunning,
    isPaused,
    start,
    pause,
    reset,
    formatTime
  };
};

export default useTimer; 