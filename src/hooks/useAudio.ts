import { useState, useEffect, useRef } from 'react';

interface AudioState {
  isPlaying: boolean;
  volume: number;
  duration: number;
  // currentTime: number; // 不要な再レンダリングを防ぐため削除
}

interface UseAudioOptions {
  src: string;
  loop?: boolean;
  volume?: number;
  autoPlay?: boolean;
}

export function useAudio({ src, loop = false, volume = 1, autoPlay = false }: UseAudioOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    volume: volume,
    duration: 0,
    // currentTime: 0, // 不要な再レンダリングを防ぐため削除
  });

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = loop;
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    };

    // timeupdateイベントリスナーを削除して、不要な再レンダリングを防ぐ
    // const handleTimeUpdate = () => {
    //   setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    // };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    // audio.addEventListener('timeupdate', handleTimeUpdate); // 不要な再レンダリングを防ぐため削除
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      // audio.removeEventListener('timeupdate', handleTimeUpdate); // 不要な再レンダリングを防ぐため削除
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [src, loop, volume]);

  const play = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Audio play failed:', error);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setState(prev => ({ ...prev, volume: newVolume }));
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      // currentTimeの状態更新は行わない（不要な再レンダリングを防ぐため）
    }
  };

  return {
    ...state,
    play,
    pause,
    stop,
    setVolume,
    seek,
  };
}
