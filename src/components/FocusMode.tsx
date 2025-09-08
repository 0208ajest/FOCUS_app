import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Play, Pause, RotateCcw, Waves } from 'lucide-react';
import { Slider } from './ui/slider';
import { DigitalClock } from './DigitalClock';
import { VisualEffects } from './VisualEffects';
import { ReactionButton } from './ReactionButton';
import { Language } from './translations';
import { useTranslation } from './translations';
import { useAudioContext } from '../contexts/AudioContext';

interface FocusModeProps {
  onBack: () => void;
  language: Language;
}

export function FocusMode({ onBack, language }: FocusModeProps) {
  const t = useTranslation(language);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [workDuration, setWorkDuration] = useState(25); // 作業時間（分）
  const [breakDuration, setBreakDuration] = useState(5); // 休憩時間（分）
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25分のポモドーロタイマー
  const [session, setSession] = useState<'work' | 'break'>('work');
  
  // グローバルオーディオコントロール
  const { playTrack, currentTrack } = useAudioContext();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            // セッション切り替え
            setSession(session === 'work' ? 'break' : 'work');
            return session === 'work' ? breakDuration * 60 : workDuration * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, session, workDuration, breakDuration]); // timeLeftの依存関係を削除

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeLeft(session === 'work' ? workDuration * 60 : breakDuration * 60);
    setSession('work');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 relative overflow-hidden">
      <VisualEffects type="focus" />
      
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
          <h1 className="text-2xl font-light text-white">{t.focusMode}</h1>
          <ReactionButton pageId="focus" />
        </div>
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
          
          {/* Compact Timer Settings */}
          <div className="flex justify-center space-x-6">
            <div className="flex items-center space-x-2 text-white">
              <span className="text-sm">Work:</span>
              <Slider
                value={[workDuration]}
                onValueChange={(value: number[]) => {
                  setWorkDuration(value[0]);
                  if (session === 'work' && !isTimerActive) {
                    setTimeLeft(value[0] * 60);
                  }
                }}
                min={5}
                max={60}
                step={5}
                className="w-16"
                disabled={isTimerActive}
              />
              <span className="text-xs text-white/70 w-8">{workDuration}m</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <span className="text-sm">Break:</span>
              <Slider
                value={[breakDuration]}
                onValueChange={(value: number[]) => {
                  setBreakDuration(value[0]);
                  if (session === 'break' && !isTimerActive) {
                    setTimeLeft(value[0] * 60);
                  }
                }}
                min={1}
                max={30}
                step={1}
                className="w-16"
                disabled={isTimerActive}
              />
              <span className="text-xs text-white/70 w-8">{breakDuration}m</span>
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
          
          {/* BGM Control - Bubble Button */}
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => playTrack('focus-ambient')}
              size="sm"
              className={`glass-button rounded-full px-6 ${
                currentTrack === 'focus-ambient' ? 'bg-blue-500/20 text-blue-300' : ''
              }`}
            >
              <Waves className="h-4 w-4 mr-2" />
              bubble
            </Button>
          </div>
        </div>

      </div>


      {/* BGM Control Button */}
      <div className="absolute bottom-6 left-6 z-10">
        <Button
          onClick={() => playTrack('focus-ambient')}
          size="sm"
          className={`glass-button rounded-full px-4 ${
            currentTrack === 'focus-ambient' ? 'bg-blue-500/20 text-blue-300' : ''
          }`}
        >
          <Play className="h-4 w-4 mr-2" />
          {t.focusMusic}
        </Button>
      </div>
    </div>
  );
}
