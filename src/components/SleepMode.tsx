import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Volume2, Timer, Flame, Star, Cloud, Play, Pause, Music } from 'lucide-react';
import { Slider } from './ui/slider';
import { VisualEffects } from './VisualEffects';
import { DigitalClock } from './DigitalClock';
import { Language } from './translations';
import { useTranslation } from './translations';
import { useAudio } from '../hooks/useAudio';
import { SOUND_PATHS } from '../assets/audio';

interface SleepModeProps {
  onBack: () => void;
  language: Language;
}

type SleepScene = 'fire' | 'stars' | 'rain';

export function SleepMode({ onBack, language }: SleepModeProps) {
  const t = useTranslation(language);
  const [selectedScene, setSelectedScene] = useState<SleepScene>('rain');
  const [volume, setVolume] = useState([50]);
  const [fadeTimer, setFadeTimer] = useState(30); // 30分でフェードアウト
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 選択されたシーンに応じたサウンド管理
  const getSoundPath = (scene: SleepScene) => {
    switch (scene) {
      case 'rain':
        return SOUND_PATHS.sleep.rain;
      case 'fire':
        return SOUND_PATHS.sleep.fireplace;
      case 'stars':
        return SOUND_PATHS.sleep.stars;
      default:
        return SOUND_PATHS.sleep.rain;
    }
  };

  const {
    isPlaying: isMusicPlaying,
    play: playMusic,
    pause: pauseMusic,
    setVolume: setMusicVolume,
  } = useAudio({
    src: getSoundPath(selectedScene),
    loop: true,
    volume: 0.5,
  });

  // シーンが変更されたときにサウンドを更新
  useEffect(() => {
    if (isMusicPlaying) {
      pauseMusic();
      // 新しいサウンドで再開
      setTimeout(() => {
        playMusic();
      }, 100);
    }
  }, [selectedScene]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && fadeTimer > 0) {
      interval = setInterval(() => {
        setVolume((prev) => {
          const newVolume = Math.max(0, prev[0] - (50 / (fadeTimer * 60))); // 50から0に徐々に減少
          setMusicVolume(newVolume / 100);
          return [newVolume];
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, fadeTimer, setMusicVolume]);

  const scenes = [
    {
      id: 'fire' as const,
      name: t.fireplace,
      icon: Flame,
      description: t.cracklingFire,
    },
    {
      id: 'stars' as const,
      name: t.starryNight,
      icon: Star,
      description: t.gentleNight,
    },
    {
      id: 'rain' as const,
      name: t.rain,
      icon: Cloud,
      description: t.soothingRain,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      <VisualEffects type="sleep" scene={selectedScene} />
      
      {/* Header */}
      <div className="relative z-10 p-6 flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t.back}
        </Button>
        <h1 className="text-2xl font-light text-white">{t.sleepMode}</h1>
        <div className="w-20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-8 p-6">
        
        {/* Digital Clock */}
        <DigitalClock theme="sleep" />
        
        {/* Scene Selection */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light text-white text-center">{t.chooseScene}</h2>
          <div className="flex space-x-4">
            {scenes.map((scene) => {
              const Icon = scene.icon;
              const isSelected = selectedScene === scene.id;
              return (
                <Button
                  key={scene.id}
                  onClick={() => setSelectedScene(scene.id)}
                  className={`
                    relative h-24 w-24 rounded-2xl transition-all duration-300
                    ${isSelected 
                      ? 'bg-white/20 ring-2 ring-white/50' 
                      : 'bg-white/10 hover:bg-white/15'
                    }
                    border-0 flex flex-col items-center justify-center space-y-1
                  `}
                >
                  <Icon className="h-6 w-6 text-white" />
                  <span className="text-xs text-white">{scene.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Current Scene Info */}
        <div className="glass-card p-6 text-center space-y-4">
          <h3 className="text-lg text-white font-medium">
            {scenes.find(s => s.id === selectedScene)?.name}
          </h3>
          <p className="text-white/70">
            {scenes.find(s => s.id === selectedScene)?.description}
          </p>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              size="lg"
              className="glass-button rounded-full px-8"
            >
              {isPlaying ? t.stopSleep : t.startSleep}
            </Button>
            
            <Button
              onClick={() => isMusicPlaying ? pauseMusic() : playMusic()}
              size="lg"
              className="glass-button rounded-full"
            >
              <Music className="h-5 w-5 mr-2" />
              {isMusicPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Volume & Timer Controls */}
        <div className="space-y-6 w-full max-w-md">
          {/* Volume Control */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center space-x-3 text-white">
              <Volume2 className="h-5 w-5" />
              <span className="font-medium">{t.volume}</span>
            </div>
            <Slider
              value={volume}
              onValueChange={(value: number[]) => {
                setVolume(value);
                setMusicVolume(value[0] / 100);
              }}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="text-sm text-white/70 text-center">
              {Math.round(volume[0])}%
            </div>
          </div>

          {/* Fade Timer */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center space-x-3 text-white">
              <Timer className="h-5 w-5" />
              <span className="font-medium">{t.autoFade}</span>
            </div>
            <Slider
              value={[fadeTimer]}
              onValueChange={(value: number[]) => setFadeTimer(value[0])}
              min={5}
              max={120}
              step={5}
              className="w-full"
            />
            <div className="text-sm text-white/70 text-center">
              {fadeTimer} {t.minutes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
