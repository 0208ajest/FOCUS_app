import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAudio } from '../hooks/useAudio';
import { SOUND_PATHS } from '../assets/audio';

interface AudioContextType {
  currentTrack: string | null;
  isPlaying: boolean;
  volume: number;
  playTrack: (trackKey: string) => void;
  pauseTrack: () => void;
  setVolume: (volume: number) => void;
  getCurrentTrackInfo: () => { name: string; icon: string } | null;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// トラック情報の定義
const TRACK_INFO = {
  'focus-ambient': { name: 'Focus Ambient', icon: '🎵' },
  'sleep-fireplace': { name: 'Fireplace', icon: '🔥' },
  'sleep-rain': { name: 'Rain', icon: '🌧️' },
  'relax-forest': { name: 'Forest', icon: '🌲' },
  'home-ocean-zen': { name: 'Ocean Zen Bell', icon: '🌊' },
  'home-rain-zen': { name: 'Rain Zen Bell', icon: '☔' },
} as const;

// トラックパスの定義
const TRACK_PATHS = {
  'focus-ambient': SOUND_PATHS.focus.ambient,
  'sleep-fireplace': SOUND_PATHS.sleep.fireplace,
  'sleep-rain': SOUND_PATHS.sleep.rain,
  'relax-forest': SOUND_PATHS.relax.forest,
  'home-ocean-zen': SOUND_PATHS.home.oceanZenBell,
  'home-rain-zen': SOUND_PATHS.home.rainZenBell,
} as const;

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(70);

  // 現在のトラックに応じた音声管理
  const currentSrc = currentTrack ? TRACK_PATHS[currentTrack as keyof typeof TRACK_PATHS] : '';
  
  const {
    isPlaying,
    play: playAudio,
    pause: pauseAudio,
    setVolume: setAudioVolume,
  } = useAudio({
    src: currentSrc,
    loop: currentTrack?.startsWith('home-') ? false : true, // home系はループなし、その他はループあり
    volume: volume / 100,
  });

  // デバッグ用ログ
  console.log('AudioContext:', { currentTrack, currentSrc, isPlaying });

  // 音量変更時にオーディオの音量も更新
  useEffect(() => {
    setAudioVolume(volume / 100);
  }, [volume, setAudioVolume]);

  const playTrack = async (trackKey: string) => {
    console.log('playTrack called:', trackKey);
    
    if (currentTrack === trackKey && isPlaying) {
      // 同じトラックが再生中の場合は一時停止
      pauseAudio();
    } else {
      // 新しいトラックを再生
      setCurrentTrack(trackKey);
      
      // オーディオの準備を待ってから再生
      setTimeout(async () => {
        try {
          await playAudio();
          console.log('Audio playback started successfully');
        } catch (error) {
          console.error('Failed to play audio:', error);
        }
      }, 200);
    }
  };

  const pauseTrack = () => {
    pauseAudio();
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  const getCurrentTrackInfo = () => {
    if (!currentTrack) return null;
    return TRACK_INFO[currentTrack as keyof typeof TRACK_INFO] || null;
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        playTrack,
        pauseTrack,
        setVolume,
        getCurrentTrackInfo,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
}
