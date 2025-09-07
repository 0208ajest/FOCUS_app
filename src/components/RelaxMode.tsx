import { useState } from 'react';
import * as React from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Volume2, Wind, Bird, Waves, TreePine, Music, Play, Pause } from 'lucide-react';
import { Slider } from './ui/slider';
import { VisualEffects } from './VisualEffects';
import { DigitalClock } from './DigitalClock';
import { Language } from './translations';
import { useTranslation } from './translations';
import { useMultiAudio } from '../hooks/useMultiAudio';
import { SOUND_PATHS, SOUND_PRESETS } from '../assets/audio';

interface RelaxModeProps {
  onBack: () => void;
  language: Language;
}

interface SoundControl {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  volume: number;
}

export function RelaxMode({ onBack, language }: RelaxModeProps) {
  const t = useTranslation(language);
  
  // マルチオーディオフックを使用
  const {
    masterVolume,
    isPlaying,
    setSoundVolume,
    setMasterVolume,
    playAll,
    pauseAll,
    applyPreset,
  } = useMultiAudio({
    soundPaths: SOUND_PATHS.relax,
    masterVolume: 0.7,
  });

  const [sounds, setSounds] = useState<SoundControl[]>([
    { id: 'wind', name: 'Wind', icon: Wind, volume: 0 },
    { id: 'birds', name: 'Birds', icon: Bird, volume: 0 },
    { id: 'water', name: 'Water', icon: Waves, volume: 0 },
    { id: 'forest', name: 'Forest', icon: TreePine, volume: 0 },
    { id: 'ambient', name: 'Ambient', icon: Music, volume: 0 },
  ]);

  // Update sound names when language changes
  React.useEffect(() => {
    setSounds(prev => prev.map(sound => ({
      ...sound,
      name: sound.id === 'wind' ? t.wind :
            sound.id === 'birds' ? t.birds :
            sound.id === 'water' ? t.water :
            sound.id === 'forest' ? t.forest :
            sound.id === 'ambient' ? t.ambient :
            sound.name
    })));
  }, [language, t]);

  const updateSoundVolume = (soundId: string, volume: number) => {
    setSoundVolume(soundId, volume / 100); // 0-100を0-1に変換
    setSounds(prev => prev.map(sound => 
      sound.id === soundId ? { ...sound, volume } : sound
    ));
  };

  const resetAll = () => {
    setSounds(prev => prev.map(sound => ({ ...sound, volume: 0 })));
    Object.keys(SOUND_PATHS.relax).forEach(key => setSoundVolume(key, 0));
  };

  const presets = [
    {
      name: t.forestWalk,
      settings: SOUND_PRESETS.forestWalk
    },
    {
      name: t.riverside,
      settings: SOUND_PRESETS.oceanBreeze
    },
    {
      name: t.mountainBreeze,
      settings: SOUND_PRESETS.mountainRetreat
    }
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    applyPreset(preset.settings);
    setSounds(prev => prev.map(sound => ({
      ...sound,
      volume: preset.settings[sound.id as keyof typeof preset.settings] || 0
    })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden">
      <VisualEffects type="relax" />
      
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
        <h1 className="text-2xl font-light text-white">{t.relaxMode}</h1>
        <div className="w-20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-8 p-6">
        
        {/* Digital Clock */}
        <DigitalClock theme="relax" />
        
        {/* Sound Mixer */}
        <div className="glass-card p-8 space-y-6 w-full max-w-2xl">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-light text-white">{t.natureSoundMixer}</h2>
              <p className="text-white/70">{t.createSoundscape}</p>
            </div>
            
            <Button
              onClick={() => isPlaying ? pauseAll() : playAll()}
              size="lg"
              className="glass-button rounded-full px-6"
            >
              <Music className="h-5 w-5 mr-2" />
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span className="ml-2">
                {isPlaying ? t.pause : t.start}
              </span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sounds.map((sound) => {
              const Icon = sound.icon;
              return (
                <div key={sound.id} className="space-y-3">
                  <div className="flex items-center space-x-3 text-white">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{sound.name}</span>
                    <span className="text-sm text-white/70 ml-auto">
                      {Math.round(sound.volume)}%
                    </span>
                  </div>
                  <Slider
                    value={[sound.volume]}
                    onValueChange={(value: number[]) => updateSoundVolume(sound.id, value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={resetAll}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              {t.resetAll}
            </Button>
          </div>
        </div>

        {/* Preset Sounds */}
        <div className="glass-card p-6 space-y-4 w-full max-w-2xl">
          <h3 className="text-lg text-white font-medium text-center">{t.quickPresets}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {presets.map((preset) => (
              <Button
                key={preset.name}
                onClick={() => handleApplyPreset(preset)}
                className="glass-button rounded-xl p-4 h-auto"
              >
                <div className="text-center">
                  <div className="font-medium">{preset.name}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Master Volume */}
        <div className="glass-card p-6 space-y-4 w-80">
          <div className="flex items-center space-x-3 text-white">
            <Volume2 className="h-5 w-5" />
            <span className="font-medium">{t.masterVolume}</span>
          </div>
          <Slider
            value={[Math.round(masterVolume * 100)]}
            onValueChange={(value: number[]) => setMasterVolume(value[0] / 100)}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="text-sm text-white/70 text-center">
            {Math.round(masterVolume * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
