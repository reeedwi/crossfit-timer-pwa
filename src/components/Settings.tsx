import React from 'react';
import useSoundEffects from '../hooks/useSoundEffects';
import useLocalStorage from '../hooks/useLocalStorage';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  // Sound effects
  const { setMuted, isMuted } = useSoundEffects();
  
  // Theme settings
  const [theme, setTheme] = useLocalStorage('theme', 'system');
  
  // State for muted
  const [muted, setMutedState] = React.useState(isMuted);
  
  // Handle theme change
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    
    // Apply theme
    applyTheme(newTheme);
  };
  
  // Handle mute toggle
  const handleMuteToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMuted = e.target.checked;
    setMutedState(newMuted);
    setMuted(newMuted);
  };
  
  // Apply theme based on selection or system preference
  const applyTheme = (selectedTheme: string) => {
    if (selectedTheme === 'dark' || 
        (selectedTheme === 'system' && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  };
  
  // Apply theme on component mount
  React.useEffect(() => {
    applyTheme(theme);
    
    // Listen for system theme changes if using system theme
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        applyTheme('system');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme]);
  
  return (
    <div className="settings">
      <h2>Settings</h2>
      
      <div className="settings-group">
        <h3>Theme</h3>
        <select value={theme} onChange={handleThemeChange}>
          <option value="system">System Default</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      
      <div className="settings-group">
        <h3>Sound</h3>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={muted}
            onChange={handleMuteToggle}
          />
          Mute Sound Effects
        </label>
      </div>
      
      <div className="settings-group">
        <h3>About</h3>
        <p>CrossFit Timer PWA v1.0.0</p>
        <p>A progressive web app for CrossFit workouts</p>
      </div>
    </div>
  );
};

export default Settings; 