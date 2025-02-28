import React from 'react';

// Define TimerType locally
type TimerType = 'amrap' | 'emom' | 'forTime' | null;

interface TimerSelectionProps {
  onSelect: (timerType: TimerType) => void;
  onSettingsClick: () => void;
}

const TimerSelection: React.FC<TimerSelectionProps> = ({ onSelect, onSettingsClick }) => {
  return (
    <div className="timer-selection">
      <h2>Choose Your Workout Timer</h2>
      <div className="timer-buttons">
        <button 
          className="timer-button amrap" 
          onClick={() => onSelect('amrap')}
        >
          <span className="timer-title">AMRAP</span>
          <span className="description">As Many Rounds As Possible</span>
        </button>
        
        <button 
          className="timer-button emom" 
          onClick={() => onSelect('emom')}
        >
          <span className="timer-title">EMOM</span>
          <span className="description">Every Minute On the Minute</span>
        </button>
        
        <button 
          className="timer-button for-time" 
          onClick={() => onSelect('forTime')}
        >
          <span className="timer-title">FOR TIME</span>
          <span className="description">Complete Workout As Fast As Possible</span>
        </button>
      </div>
    </div>
  );
};

export default TimerSelection; 