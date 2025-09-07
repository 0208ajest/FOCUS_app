// 音声ファイルのimport
import ambientFocus from './sounds/focus/ambient.mp3';
import forestRelax from './sounds/relax/forest.mp3';
import rainSleep from './sounds/sleep/rain.mp3';

// 音声ファイルのパス設定
export const SOUND_PATHS = {
  focus: {
    ambient: ambientFocus,
    rain: '/assets/sounds/focus/rain.mp3', // 未実装
    forest: '/assets/sounds/focus/forest.mp3', // 未実装
  },
  sleep: {
    fireplace: '/assets/sounds/sleep/fireplace.mp3', // 未実装
    stars: '/assets/sounds/sleep/stars.mp3', // 未実装
    rain: rainSleep,
  },
  relax: {
    wind: '/assets/sounds/relax/wind.mp3', // 未実装
    birds: '/assets/sounds/relax/birds.mp3', // 未実装
    water: '/assets/sounds/relax/water.mp3', // 未実装
    forest: forestRelax,
    ambient: '/assets/sounds/relax/ambient.mp3', // 未実装
  },
} as const;

// プリセット設定
export const SOUND_PRESETS = {
  forestWalk: {
    wind: 0.3,
    birds: 0.4,
    forest: 0.5,
  },
  oceanBreeze: {
    water: 0.6,
    wind: 0.3,
  },
  mountainRetreat: {
    wind: 0.4,
    birds: 0.3,
    forest: 0.4,
  },
} as const;
