import React from 'react';

// Sound effect types
export type SoundEffectType = 'start' | 'halfway' | 'tenSeconds' | 'complete';

interface UseSoundEffectsReturn {
  playSound: (type: SoundEffectType) => void;
  setMuted: (muted: boolean) => void;
  isMuted: boolean;
}

// URLs for sound effects
const SOUND_URLS = {
  start: '/sounds/start.mp3',
  halfway: '/sounds/halfway.mp3',
  tenSeconds: '/sounds/ten-seconds.mp3',
  complete: '/sounds/complete.mp3'
};

const useSoundEffects = (): UseSoundEffectsReturn => {
  // Refs for audio elements
  const audioRefs = React.useRef<Record<SoundEffectType, HTMLAudioElement | null>>({
    start: null,
    halfway: null,
    tenSeconds: null,
    complete: null
  });
  
  // Ref for muted state
  const mutedRef = React.useRef<boolean>(false);
  
  // Initialize audio elements
  React.useEffect(() => {
    // Create audio elements for each sound type
    Object.entries(SOUND_URLS).forEach(([type, url]) => {
      const audio = new Audio(url) as HTMLAudioElement;
      audio.preload = 'auto';
      audioRefs.current[type as SoundEffectType] = audio;
    });
    
    // Check if user has previously set muted preference
    const savedMuted = localStorage.getItem('cfTimerMuted');
    if (savedMuted) {
      mutedRef.current = savedMuted === 'true';
    }
    
    // Cleanup function
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          (audio as HTMLAudioElement).pause();
          (audio as HTMLAudioElement).src = '';
        }
      });
    };
  }, []);
  
  // Play sound effect
  const playSound = React.useCallback((type: SoundEffectType) => {
    if (mutedRef.current) return;
    
    const audio = audioRefs.current[type];
    if (audio) {
      // Reset audio to beginning if it's already playing
      audio.pause();
      audio.currentTime = 0;
      
      // Play the sound
      audio.play().catch(error => {
        console.error(`Error playing sound: ${error}`);
      });
    }
  }, []);
  
  // Set muted state
  const setMuted = React.useCallback((muted: boolean) => {
    mutedRef.current = muted;
    localStorage.setItem('cfTimerMuted', muted.toString());
  }, []);
  
  return {
    playSound,
    setMuted,
    isMuted: mutedRef.current
  };
};

export default useSoundEffects; 