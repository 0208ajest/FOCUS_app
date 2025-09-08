import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Star, Cloud } from 'lucide-react';
import { VisualEffects } from './VisualEffects';
import { DigitalClock } from './DigitalClock';
import { ReactionButton } from './ReactionButton';
import { Language } from './translations';
import { useTranslation } from './translations';
import { useAudioContext } from '../contexts/AudioContext';

interface SleepModeProps {
  onBack: () => void;
  language: Language;
}

type SleepScene = 'fire' | 'rain';

export function SleepMode({ onBack, language }: SleepModeProps) {
  const t = useTranslation(language);
  const [selectedScene, setSelectedScene] = useState<SleepScene>('rain');
  
  // グローバルオーディオコントロール
  const { playTrack, currentTrack } = useAudioContext();

  // シーンに応じたトラックキーを取得
  const getTrackKey = (scene: SleepScene) => {
    switch (scene) {
      case 'rain':
        return 'sleep-rain';
      case 'fire':
        return 'sleep-fireplace';
      default:
        return 'sleep-rain';
    }
  };

  // フェードアウト機能はグローバルコントロールで管理するため、ここでは簡略化

  // 初期状態でデフォルトシーンのBGMを再生
  useEffect(() => {
    // コンポーネントマウント時にデフォルトシーンのBGMを再生
    playTrack(getTrackKey(selectedScene));
  }, []); // 空の依存配列で初回のみ実行

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
          <ReactionButton pageId="sleep" />
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
                  onClick={() => {
                    setSelectedScene(scene.id);
                    // シーン選択時に自動的にBGMを再生
                    playTrack(getTrackKey(scene.id));
                  }}
                  className={`
                    relative h-24 w-24 rounded-2xl transition-all duration-300
                    ${isSelected 
                      ? 'bg-white/20 ring-2 ring-white/50' 
                      : 'bg-white/10 hover:bg-white/15'
                    }
                    ${currentTrack === getTrackKey(scene.id) ? 'ring-2 ring-orange-400/50' : ''}
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

      {/* BGM Status Indicator */}
      <div className="absolute bottom-6 left-6 z-10">
        <div className="glass-card p-3 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            currentTrack === getTrackKey(selectedScene) ? 'bg-orange-400' : 'bg-white/30'
          }`} />
          <span className="text-xs text-white/70">
            {currentTrack === getTrackKey(selectedScene) ? 'Playing' : 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
}
