import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, Music } from 'lucide-react';
import { Slider } from './ui/slider';
import { DigitalClock } from './DigitalClock';
import { VisualEffects } from './VisualEffects';
import { Language } from './translations';
import { useTranslation } from './translations';
import { useAudio } from '../hooks/useAudio';
import { SOUND_PATHS } from '../assets/audio';

interface FocusModeProps {
  onBack: () => void;
  language: Language;
}

export function FocusMode({ onBack, language }: FocusModeProps) {
  const t = useTranslation(language);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25分のポモドーロタイマー
  const [volume, setVolume] = useState([70]);
  const [session, setSession] = useState<'work' | 'break'>('work');
  
  // フォーカス音楽の管理
  const {
    isPlaying: isMusicPlaying,
    play: playMusic,
    pause: pauseMusic,
    setVolume: setMusicVolume,
  } = useAudio({
    src: SOUND_PATHS.focus.ambient,
    loop: true,
    volume: 0.7,
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            // セッション切り替え
            setSession(session === 'work' ? 'break' : 'work');
            return session === 'work' ? 5 * 60 : 25 * 60; // 休憩5分、作業25分
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, session]); // timeLeftの依存関係を削除

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeLeft(session === 'work' ? 25 * 60 : 5 * 60);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 relative overflow-hidden">
      <VisualEffects type="focus" />
      
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
        <h1 className="text-2xl font-light text-white">{t.focusMode}</h1>
        <div className="w-20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-8">
        {/* Digital Clock */}
        <DigitalClock theme="focus" />

        {/* Pomodoro Timer */}
        <div className="glass-card p-8 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-light text-white">
              {session === 'work' ? t.workSession : t.breakTime}
            </h2>
            <div className="text-6xl font-light text-white font-mono tracking-wider">
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={() => setIsTimerActive(!isTimerActive)}
              size="lg"
              className="glass-button rounded-full px-8"
            >
              {isTimerActive ? (
                <Pause className="h-5 w-5 mr-2" />
              ) : (
                <Play className="h-5 w-5 mr-2" />
              )}
              {isTimerActive ? t.pause : t.start}
            </Button>
            
            <Button
              onClick={resetTimer}
              variant="ghost"
              className="text-white hover:bg-white/10 rounded-full"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Music Control */}
        <div className="glass-card p-6 space-y-4 w-80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-white">
              <Music className="h-5 w-5" />
              <span className="font-medium">{t.focusMusic}</span>
            </div>
            <Button
              onClick={() => isMusicPlaying ? pauseMusic() : playMusic()}
              size="sm"
              className="glass-button rounded-full"
            >
              {isMusicPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center space-x-3 text-white">
            <Volume2 className="h-4 w-4" />
            <Slider
              value={volume}
              onValueChange={(value: number[]) => {
                setVolume(value);
                setMusicVolume(value[0] / 100);
              }}
              max={100}
              step={1}
              className="flex-1"
              disabled={!isMusicPlaying}
            />
            <span className="text-sm text-white/70 w-12">
              {volume[0]}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
