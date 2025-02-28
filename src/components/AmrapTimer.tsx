import React from 'react';
import useTimer from '../hooks/useTimer';
import useSoundEffects from '../hooks/useSoundEffects';
import useLocalStorage from '../hooks/useLocalStorage';

interface AmrapTimerProps {
  onBack: () => void;
}

const AmrapTimer: React.FC<AmrapTimerProps> = ({ onBack }) => {
  // Configuration state
  const [configuring, setConfiguring] = React.useState(true);
  const [duration, setDuration] = React.useState(() => {
    return parseInt(localStorage.getItem('amrapDuration') || '1200', 10);
  });
  const [countdownTime, setCountdownTime] = React.useState(() => {
    return parseInt(localStorage.getItem('amrapCountdown') || '10', 10);
  });
  
  // Round counter state
  const [rounds, setRounds] = React.useState(0);
  
  // Save settings to local storage
  React.useEffect(() => {
    localStorage.setItem('amrapDuration', duration.toString());
    localStorage.setItem('amrapCountdown', countdownTime.toString());
  }, [duration, countdownTime]);
  
  // Initialize sound effects
  const { playSound } = useSoundEffects();
  
  // Initialize timers
  const countdownTimer = useTimer({
    initialTime: countdownTime,
    countDown: true,
    onComplete: () => {
      playSound('start');
      mainTimer.start();
    },
  });
  
  const mainTimer = useTimer({
    initialTime: duration,
    countDown: true,
    onComplete: () => {
      playSound('complete');
      setConfiguring(true);
    },
    onHalfway: () => playSound('halfway'),
    onTenSecondsLeft: () => playSound('tenSeconds'),
  });
  
  // Handle duration change
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value, 10);
    if (!isNaN(minutes) && minutes > 0) {
      setDuration(minutes * 60);
    }
  };
  
  // Handle countdown change
  const handleCountdownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seconds = parseInt(e.target.value, 10);
    if (!isNaN(seconds) && seconds >= 0) {
      setCountdownTime(seconds);
    }
  };
  
  // Handle start button
  const handleStart = () => {
    if (configuring) {
      setConfiguring(false);
      setRounds(0);
      countdownTimer.reset();
      mainTimer.reset();
      countdownTimer.start();
    } else if (mainTimer.isPaused) {
      mainTimer.start();
    } else {
      mainTimer.start();
    }
  };
  
  // Handle pause button
  const handlePause = () => {
    mainTimer.pause();
  };
  
  // Handle reset button
  const handleReset = () => {
    mainTimer.reset();
    setRounds(0);
  };
  
  // Handle increment round
  const handleIncrementRound = () => {
    setRounds(rounds + 1);
    playSound('start');
  };
  
  // Handle decrement round
  const handleDecrementRound = () => {
    if (rounds > 0) {
      setRounds(rounds - 1);
    }
  };
  
  return (
    <div className="amrap-timer">
      {configuring ? (
        <div className="timer-config">
          <h2>AMRAP Timer Setup</h2>
          
          <div className="config-group">
            <label htmlFor="duration">Duration (minutes):</label>
            <input
              id="duration"
              type="number"
              min="1"
              value={duration / 60}
              onChange={handleDurationChange}
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
            Start AMRAP
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
              <div className="timer-display">{mainTimer.formatTime()}</div>
              
              <div className="round-counter">
                <h2>Rounds: {rounds}</h2>
                <div className="round-controls">
                  <button 
                    className="decrement-button" 
                    onClick={handleDecrementRound}
                    disabled={!mainTimer.isRunning || rounds === 0}
                  >
                    -
                  </button>
                  <button 
                    className="increment-button" 
                    onClick={handleIncrementRound}
                    disabled={!mainTimer.isRunning}
                  >
                    +
                  </button>
                </div>
              </div>
              
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
                  <button className="pause-button" onClick={handlePause}>
                    Pause
                  </button>
                )}
                
                <button 
                  className="reset-button" 
                  onClick={handleReset}
                  disabled={!mainTimer.isRunning && !mainTimer.isPaused && rounds === 0}
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

export default AmrapTimer; 