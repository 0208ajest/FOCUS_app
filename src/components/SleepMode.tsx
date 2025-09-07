import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Volume2, Timer, Star, Cloud, Play, Pause } from 'lucide-react';
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

type SleepScene = 'fire' | 'rain';

export function SleepMode({ onBack, language }: SleepModeProps) {
  const t = useTranslation(language);
  const [selectedScene, setSelectedScene] = useState<SleepScene>('rain');
  const [volume, setVolume] = useState([50]);
  const [fadeTimer, setFadeTimer] = useState(30); // 30分でフェードアウト
  const [isFadeActive, setIsFadeActive] = useState(false);
  
  // 選択されたシーンに応じたサウンド管理
  const getSoundPath = (scene: SleepScene) => {
    switch (scene) {
      case 'rain':
        return SOUND_PATHS.sleep.rain;
      case 'fire':
        return SOUND_PATHS.sleep.fireplace; // Fireplace名称で星空エフェクト
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
    if (isFadeActive && fadeTimer > 0 && isMusicPlaying) {
      interval = setInterval(() => {
        setVolume((prev) => {
          const newVolume = Math.max(0, prev[0] - (50 / (fadeTimer * 60))); // 50から0に徐々に減少
          setMusicVolume(newVolume / 100);
          if (newVolume <= 0) {
            setIsFadeActive(false);
            pauseMusic();
          }
          return [newVolume];
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFadeActive, fadeTimer, setMusicVolume, isMusicPlaying, pauseMusic]);

  const scenes = [
    {
      id: 'fire' as const,
      name: t.fireplace,
      icon: Star, // 星空エフェクトを採用
      description: t.gentleNight, // 星空の説明を使用
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
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between">
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

      </div>

      {/* Footer - BGM Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <div className="glass-card p-4 flex items-center justify-center space-x-6 max-w-lg mx-auto">
          <div className="flex items-center space-x-3 text-white">
            <span className="text-sm font-medium">{scenes.find(s => s.id === selectedScene)?.name}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => isMusicPlaying ? pauseMusic() : playMusic()}
              size="sm"
              className="glass-button rounded-full w-8 h-8 p-0"
            >
              {isMusicPlaying ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>
            <div className="flex items-center space-x-2">
              <Volume2 className="h-3 w-3 text-white/70" />
              <Slider
                value={volume}
                onValueChange={(value: number[]) => {
                  setVolume(value);
                  setMusicVolume(value[0] / 100);
                }}
                max={100}
                step={1}
                className="w-20"
                disabled={!isMusicPlaying}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => {
                  if (isFadeActive) {
                    setIsFadeActive(false);
                    pauseMusic();
                  } else {
                    setIsFadeActive(true);
                    if (!isMusicPlaying) {
                      playMusic();
                    }
                  }
                }}
                size="sm"
                className={`glass-button rounded-full px-3 ${
                  isFadeActive ? 'bg-blue-500/20 text-blue-300' : ''
                }`}
              >
                <Timer className="h-3 w-3 mr-1" />
                {fadeTimer}min
              </Button>
              <Slider
                value={[fadeTimer]}
                onValueChange={(value: number[]) => setFadeTimer(value[0])}
                min={5}
                max={60}
                step={5}
                className="w-16"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
