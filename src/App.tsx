import React from 'react';
import './styles/App.css';
import AmrapTimer from './components/AmrapTimer';
import EmomTimer from './components/EmomTimer';
import ForTimeTimer from './components/ForTimeTimer';
import Settings from './components/Settings';
import TimerSelection from './components/TimerSelection';

// Timer types
type TimerType = 'amrap' | 'emom' | 'forTime' | 'settings' | 'home';

// App component
function App() {
  // State for current timer
  const [currentTimer, setCurrentTimer] = React.useState<TimerType>('home');
  
  // Handle navigation
  const navigateTo = (timer: TimerType) => {
    setCurrentTimer(timer);
  };
  
  // Handle back button
  const handleBack = () => {
    setCurrentTimer('home');
  };

  // Handle settings button
  const handleSettingsClick = () => {
    setCurrentTimer('settings');
  };
  
  // Render current timer
  const renderTimer = () => {
    switch (currentTimer) {
      case 'amrap':
        return <AmrapTimer onBack={handleBack} />;
      case 'emom':
        return <EmomTimer onBack={handleBack} />;
      case 'forTime':
        return <ForTimeTimer onBack={handleBack} />;
      case 'settings':
        return <Settings onBack={handleBack} />;
      default:
        return (
          <TimerSelection 
            onSelect={navigateTo} 
            onSettingsClick={handleSettingsClick} 
          />
        );
    }
  };
  
  return (
    <div className="app">
      <header className="app-header">
        {currentTimer === 'home' ? (
          <>
            <h1>CrossFit Timer</h1>
            <button 
              className="settings-button" 
              onClick={handleSettingsClick}
              aria-label="Settings"
            >
              ⚙️
            </button>
          </>
        ) : (
          <>
            <button 
              className="back-button" 
              onClick={handleBack}
              aria-label="Back to home"
            >
              ← Back
            </button>
            <h1>
              {currentTimer === 'amrap' ? 'AMRAP' : 
               currentTimer === 'emom' ? 'EMOM' : 
               currentTimer === 'forTime' ? 'FOR TIME' : 
               'Settings'}
            </h1>
            <div style={{ width: '48px' }}></div> {/* Spacer for alignment */}
          </>
        )}
      </header>
      <main className="app-main">
        {renderTimer()}
      </main>
    </div>
  );
}

export default App; 