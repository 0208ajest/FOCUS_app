import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Slider } from './ui/slider';
import { useAudioContext } from '../contexts/AudioContext';

export function GlobalAudioControl() {
  const { currentTrack, isPlaying, volume, playTrack, pauseTrack, setVolume, getCurrentTrackInfo } = useAudioContext();
  
  const trackInfo = getCurrentTrackInfo();

  // 常に表示する（トラックが選択されていない場合はプレースホルダーを表示）

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
    >
      <div className="glass-card p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between space-x-4">
          {/* トラック情報 */}
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <span className="text-2xl">{trackInfo?.icon || '🎵'}</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-white truncate">
                {trackInfo?.name || 'No Track Selected'}
              </div>
              <div className="text-xs text-white/70">
                {trackInfo ? (isPlaying ? 'Playing' : 'Paused') : 'Ready'}
              </div>
            </div>
          </div>

          {/* コントロールボタン */}
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={() => {
                if (currentTrack) {
                  isPlaying ? pauseTrack() : playTrack(currentTrack);
                }
              }}
              className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border ${
                currentTrack 
                  ? 'bg-white/10 text-white hover:bg-white/20 border-white/20' 
                  : 'bg-white/5 text-white/50 border-white/10 cursor-not-allowed'
              }`}
              whileHover={{ scale: currentTrack ? 1.1 : 1 }}
              whileTap={{ scale: currentTrack ? 0.95 : 1 }}
              disabled={!currentTrack}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </motion.button>

            {/* 音量コントロール */}
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-white/70" />
              <Slider
                value={[volume]}
                onValueChange={(value: number[]) => setVolume(value[0])}
                max={100}
                step={1}
                className="w-20"
              />
              <span className="text-xs text-white/70 w-8">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
