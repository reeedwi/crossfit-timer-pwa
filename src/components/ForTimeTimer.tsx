import React from 'react';
import useTimer from '../hooks/useTimer';
import useSoundEffects from '../hooks/useSoundEffects';
import useLocalStorage from '../hooks/useLocalStorage';

interface ForTimeTimerProps {
  onBack: () => void;
}

const ForTimeTimer: React.FC<ForTimeTimerProps> = ({ onBack }) => {
  // Get saved settings or use defaults
  const [savedSettings] = useLocalStorage('forTimeSettings', {
    countdownTime: 10, // 10 seconds countdown
  });
  
  // State for configuration
  const [configuring, setConfiguring] = React.useState(true);
  const [countdownTime, setCountdownTime] = React.useState(savedSettings.countdownTime);
  
  // Sound effects
  const { playSound } = useSoundEffects();
  
  // Countdown timer
  const countdownTimer = useTimer({
    initialTime: countdownTime,
    countDown: true,
    autoStart: false,
    onComplete: () => {
      // Play start sound and start the main timer
      playSound('start');
      mainTimer.start();
    }
  });
  
  // Main timer (counts up)
  const mainTimer = useTimer({
    initialTime: 0,
    countDown: false,
    autoStart: false
  });
  
  // Handle start button click
  const handleStart = () => {
    if (configuring) {
      setConfiguring(false);
      
      // If countdown is enabled, start it first
      if (countdownTime > 0) {
        countdownTimer.reset();
        countdownTimer.start();
      } else {
        // Otherwise start the main timer directly
        playSound('start');
        mainTimer.start();
      }
    } else if (mainTimer.isPaused) {
      mainTimer.start();
    } else if (!mainTimer.isRunning && !countdownTimer.isRunning) {
      // Reset and start again
      if (countdownTime > 0) {
        countdownTimer.reset();
        countdownTimer.start();
      } else {
        playSound('start');
        mainTimer.reset();
        mainTimer.start();
      }
    }
  };
  
  // Handle pause button click
  const handlePause = () => {
    if (mainTimer.isRunning) {
      mainTimer.pause();
    }
  };
  
  // Handle reset button click
  const handleReset = () => {
    mainTimer.reset();
    countdownTimer.reset();
  };
  
  // Handle complete button click
  const handleComplete = () => {
    if (mainTimer.isRunning) {
      mainTimer.pause();
      playSound('complete');
    }
  };
  
  // Handle countdown time change
  const handleCountdownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seconds = parseInt(e.target.value, 10);
    if (!isNaN(seconds) && seconds >= 0) {
      setCountdownTime(seconds);
      
      // Save to local storage
      const settings = {
        countdownTime: seconds
      };
      localStorage.setItem('forTimeSettings', JSON.stringify(settings));
    }
  };
  
  return (
    <div className="for-time-timer">
      {configuring ? (
        <div className="timer-config">
          <h2>FOR TIME Timer Setup</h2>
          
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
            Start FOR TIME
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
              <div className="timer-display">{mainTimer.formatTime(true)}</div>
              
              <div className="timer-controls">
                {!mainTimer.isRunning && !mainTimer.isPaused ? (
                  <button className="start-button" onClick={handleStart}>
                    Start
                  </button>
                ) : mainTimer.isPaused ? (
                  <button className="start-button" onClick={handleStart}>
                    Resume
                  </button>
                ) : (
                  <>
                    <button className="pause-button" onClick={handlePause}>
                      Pause
                    </button>
                    <button className="complete-button" onClick={handleComplete}>
                      Complete
                    </button>
                  </>
                )}
                
                {(mainTimer.isPaused || (!mainTimer.isRunning && mainTimer.time > 0)) && (
                  <button className="reset-button" onClick={handleReset}>
                    Reset
                  </button>
                )}
              </div>
              
              {mainTimer.isPaused && mainTimer.time > 0 && (
                <div className="completion-message">
                  <h2>Completed in: {mainTimer.formatTime(true)}</h2>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ForTimeTimer; 