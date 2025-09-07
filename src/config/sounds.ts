// サウンドファイルのパス設定
export const SOUND_PATHS = {
  focus: {
    ambient: '/assets/sounds/focus/ambient.mp3',
    rain: '/assets/sounds/focus/rain.mp3',
    forest: '/assets/sounds/focus/forest.mp3',
  },
  sleep: {
    fireplace: '/assets/sounds/sleep/fireplace.mp3',
    stars: '/assets/sounds/sleep/stars.mp3',
    rain: '/assets/sounds/sleep/rain.mp3',
  },
  relax: {
    wind: '/assets/sounds/relax/wind.mp3',
    birds: '/assets/sounds/relax/birds.mp3',
    water: '/assets/sounds/relax/water.mp3',
    forest: '/assets/sounds/relax/forest.mp3',
    ambient: '/assets/sounds/relax/ambient.mp3',
  },
} as const;

// プリセット設定
export const SOUND_PRESETS = {
  forestWalk: {
    wind: 0.3,
    birds: 0.7,
    water: 0.2,
    forest: 0.8,
    ambient: 0.4,
  },
  riverside: {
    wind: 0.2,
    birds: 0.4,
    water: 0.9,
    forest: 0.3,
    ambient: 0.5,
  },
  mountainBreeze: {
    wind: 0.8,
    birds: 0.6,
    water: 0.1,
    forest: 0.4,
    ambient: 0.3,
  },
} as const;

// サウンドの種類定義
export type SoundType = keyof typeof SOUND_PATHS.focus | 
                       keyof typeof SOUND_PATHS.sleep | 
                       keyof typeof SOUND_PATHS.relax;

export type PresetType = keyof typeof SOUND_PRESETS;
