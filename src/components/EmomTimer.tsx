import React from 'react';
import useTimer from '../hooks/useTimer';
import useSoundEffects from '../hooks/useSoundEffects';
import useLocalStorage from '../hooks/useLocalStorage';

interface EmomTimerProps {
  onBack: () => void;
}

const EmomTimer: React.FC<EmomTimerProps> = ({ onBack }) => {
  // Get saved settings or use defaults
  const [savedSettings] = useLocalStorage('emomSettings', {
    intervalTime: 60, // 1 minute in seconds
    totalIntervals: 10, // 10 intervals
    countdownTime: 10, // 10 seconds countdown
  });
  
  // State for configuration
  const [configuring, setConfiguring] = React.useState(true);
  const [intervalTime, setIntervalTime] = React.useState(savedSettings.intervalTime);
  const [totalIntervals, setTotalIntervals] = React.useState(savedSettings.totalIntervals);
  const [countdownTime, setCountdownTime] = React.useState(savedSettings.countdownTime);
  
  // State for current interval
  const [currentInterval, setCurrentInterval] = React.useState(0);
  
  // Sound effects
  const { playSound } = useSoundEffects();
  
  // Countdown timer
  const countdownTimer = useTimer({
    initialTime: countdownTime,
    countDown: true,
    autoStart: false,
    onComplete: () => {
      // Play start sound and start the interval timer
      playSound('start');
      setCurrentInterval(1);
      intervalTimer.reset();
      intervalTimer.start();
    }
  });
  
  // Interval timer
  const intervalTimer = useTimer({
    initialTime: intervalTime,
    countDown: true,
    autoStart: false,
    onTenSecondsLeft: () => {
      if (intervalTime >= 20) { // Only play warning if interval is at least 20 seconds
        playSound('tenSeconds');
      }
    },
    onComplete: () => {
      // Check if we've completed all intervals
      if (currentInterval >= totalIntervals) {
        playSound('complete');
        setCurrentInterval(0);
      } else {
        // Start the next interval
        playSound('start');
        setCurrentInterval(prev => prev + 1);
        intervalTimer.reset();
        intervalTimer.start();
      }
    }
  });
  
  // Handle start button click
  const handleStart = () => {
    if (configuring) {
      setConfiguring(false);
      setCurrentInterval(0);
      
      // If countdown is enabled, start it first
      if (countdownTime > 0) {
        countdownTimer.reset();
        countdownTimer.start();
      } else {
        // Otherwise start the interval timer directly
        playSound('start');
        setCurrentInterval(1);
        intervalTimer.start();
      }
    } else if (intervalTimer.isPaused) {
      intervalTimer.start();
    } else if (!intervalTimer.isRunning && !countdownTimer.isRunning) {
      // Reset and start again
      setCurrentInterval(0);
      
      if (countdownTime > 0) {
        countdownTimer.reset();
        countdownTimer.start();
      } else {
        playSound('start');
        setCurrentInterval(1);
        intervalTimer.reset();
        intervalTimer.start();
      }
    }
  };
  
  // Handle pause button click
  const handlePause = () => {
    if (intervalTimer.isRunning) {
      intervalTimer.pause();
    }
  };
  
  // Handle reset button click
  const handleReset = () => {
    intervalTimer.reset();
    countdownTimer.reset();
    setCurrentInterval(0);
  };
  
  // Handle interval time change
  const handleIntervalTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seconds = parseInt(e.target.value, 10);
    if (!isNaN(seconds) && seconds >= 10) {
      setIntervalTime(seconds);
    }
  };
  
  // Handle total intervals change
  const handleTotalIntervalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const intervals = parseInt(e.target.value, 10);
    if (!isNaN(intervals) && intervals >= 1) {
      setTotalIntervals(intervals);
    }
  };
  
  // Handle countdown time change
  const handleCountdownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seconds = parseInt(e.target.value, 10);
    if (!isNaN(seconds) && seconds >= 0) {
      setCountdownTime(seconds);
    }
  };
  
  // Save settings when they change
  React.useEffect(() => {
    const settings = {
      intervalTime,
      totalIntervals,
      countdownTime
    };
    localStorage.setItem('emomSettings', JSON.stringify(settings));
  }, [intervalTime, totalIntervals, countdownTime]);
  
  return (
    <div className="emom-timer">
      {configuring ? (
        <div className="timer-config">
          <h2>EMOM Timer Setup</h2>
          
          <div className="config-group">
            <label htmlFor="intervalTime">Interval Time (seconds):</label>
            <input
              id="intervalTime"
              type="number"
              min="10"
              value={intervalTime}
              onChange={handleIntervalTimeChange}
            />
          </div>
          
          <div className="config-group">
            <label htmlFor="totalIntervals">Total Intervals:</label>
            <input
              id="totalIntervals"
              type="number"
              min="1"
              value={totalIntervals}
              onChange={handleTotalIntervalsChange}
            />
          </div>
          
          <div className="config-group">
            <label htmlFor="countdown">Countdown (seconds):</label>
            <input
              id="countdown"
              type="number"
              min="0"
              value={countdownTime}
              onChange={handleCountdownChange}
            />
          </div>
          
          <button className="start-button" onClick={handleStart}>
            Start EMOM
          </button>
        </div>
      ) : (
        <>
          {countdownTimer.isRunning ? (
            <div className="countdown">
              <h2>Get Ready!</h2>
              <div className="timer-display">{countdownTimer.formatTime()}</div>
            </div>
          ) : (
            <>
              <div className="interval-info">
                {currentInterval > 0 ? (
                  <h2>Interval {currentInterval} of {totalIntervals}</h2>
                ) : (
                  <h2>Ready to Start</h2>
                )}
              </div>
              
              <div className="timer-display">{intervalTimer.formatTime()}</div>
              
              <div className="timer-controls">
                {!intervalTimer.isRunning && !intervalTimer.isPaused && currentInterval === 0 ? (
                  <button className="start-button" onClick={handleStart}>
                    Start
                  </button>
                ) : intervalTimer.isPaused ? (
                  <button className="start-button" onClick={handleStart}>
                    Resume
                  </button>
                ) : intervalTimer.isRunning ? (
                  <button className="pause-button" onClick={handlePause}>
                    Pause
                  </button>
                ) : (
                  <button className="start-button" onClick={handleStart}>
                    Start
                  </button>
                )}
                
                <button 
                  className="reset-button" 
                  onClick={handleReset}
                  disabled={!intervalTimer.isRunning && !intervalTimer.isPaused && currentInterval === 0}
                >
                  Reset
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default EmomTimer; 