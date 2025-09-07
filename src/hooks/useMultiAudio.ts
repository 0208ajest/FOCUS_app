import { useState, useEffect, useRef } from 'react';
import { useAudio } from './useAudio';

interface MultiAudioState {
  sounds: Record<string, { isPlaying: boolean; volume: number }>;
  masterVolume: number;
  isPlaying: boolean;
}

interface UseMultiAudioOptions {
  soundPaths: Record<string, string>;
  masterVolume?: number;
}

export function useMultiAudio({ soundPaths, masterVolume = 1 }: UseMultiAudioOptions) {
  const [state, setState] = useState<MultiAudioState>({
    sounds: Object.keys(soundPaths).reduce((acc, key) => ({
      ...acc,
      [key]: { isPlaying: false, volume: 0 }
    }), {}),
    masterVolume,
    isPlaying: false,
  });

  const audioInstances = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    // オーディオインスタンスを初期化
    Object.entries(soundPaths).forEach(([key, src]) => {
      if (!audioInstances.current[key]) {
        const audio = new Audio(src);
        audio.loop = true;
        audio.volume = 0;
        audioInstances.current[key] = audio;
      }
    });

    return () => {
      // クリーンアップ
      Object.values(audioInstances.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, [soundPaths]);

  const playSound = async (soundKey: string) => {
    const audio = audioInstances.current[soundKey];
    if (audio) {
      try {
        await audio.play();
        setState(prev => ({
          ...prev,
          sounds: {
            ...prev.sounds,
            [soundKey]: { ...prev.sounds[soundKey], isPlaying: true }
          }
        }));
      } catch (error) {
        console.error(`Failed to play sound ${soundKey}:`, error);
      }
    }
  };

  const pauseSound = (soundKey: string) => {
    const audio = audioInstances.current[soundKey];
    if (audio) {
      audio.pause();
      setState(prev => ({
        ...prev,
        sounds: {
          ...prev.sounds,
          [soundKey]: { ...prev.sounds[soundKey], isPlaying: false }
        }
      }));
    }
  };

  const setSoundVolume = (soundKey: string, volume: number) => {
    const audio = audioInstances.current[soundKey];
    if (audio) {
      const finalVolume = volume * state.masterVolume;
      audio.volume = Math.max(0, Math.min(1, finalVolume));
      setState(prev => ({
        ...prev,
        sounds: {
          ...prev.sounds,
          [soundKey]: { ...prev.sounds[soundKey], volume }
        }
      }));
    }
  };

  const setMasterVolume = (volume: number) => {
    setState(prev => ({ ...prev, masterVolume: volume }));
    
    // すべてのサウンドの音量を更新
    Object.entries(state.sounds).forEach(([key, soundState]) => {
      const audio = audioInstances.current[key];
      if (audio) {
        const finalVolume = soundState.volume * volume;
        audio.volume = Math.max(0, Math.min(1, finalVolume));
      }
    });
  };

  const playAll = async () => {
    const playPromises = Object.keys(soundPaths).map(key => playSound(key));
    await Promise.all(playPromises);
    setState(prev => ({ ...prev, isPlaying: true }));
  };

  const pauseAll = () => {
    Object.keys(soundPaths).forEach(key => pauseSound(key));
    setState(prev => ({ ...prev, isPlaying: false }));
  };

  const stopAll = () => {
    Object.values(audioInstances.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    setState(prev => ({
      ...prev,
      isPlaying: false,
      sounds: Object.keys(soundPaths).reduce((acc, key) => ({
        ...acc,
        [key]: { isPlaying: false, volume: 0 }
      }), {})
    }));
  };

  const applyPreset = (preset: Record<string, number>) => {
    Object.entries(preset).forEach(([key, volume]) => {
      if (soundPaths[key]) {
        setSoundVolume(key, volume / 100); // 0-100を0-1に変換
      }
    });
  };

  return {
    ...state,
    playSound,
    pauseSound,
    setSoundVolume,
    setMasterVolume,
    playAll,
    pauseAll,
    stopAll,
    applyPreset,
  };
}
