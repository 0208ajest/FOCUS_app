# Serenifocus 技術アーキテクチャ詳細

## アーキテクチャ概要

Serenifocusは、React 18 + TypeScript + Viteを基盤としたSPA（Single Page Application）です。音声管理とビジュアルエフェクトを中心とした、ユーザー体験重視のアーキテクチャを採用しています。

## 状態管理アーキテクチャ

### 1. グローバル状態（AudioContext）
```typescript
interface AudioContextType {
  currentTrack: string | null;        // 現在のトラック
  isPlaying: boolean;                 // 再生状態
  volume: number;                     // 音量（0-100）
  playTrack: (trackKey: string) => void;
  pauseTrack: () => void;
  setVolume: (volume: number) => void;
  getCurrentTrackInfo: () => TrackInfo | null;
}
```

### 2. ローカル状態（各コンポーネント）
- **App.tsx**: モード管理、言語設定、エフェクト状態
- **FocusMode.tsx**: ポモドーロタイマー状態
- **SleepMode.tsx**: シーン選択状態
- **各エフェクト**: アニメーション状態

## 音声管理システム

### 1. 音声ファイル管理
```typescript
// src/assets/audio.ts
export const SOUND_PATHS = {
  focus: { ambient: focusAmbient },
  sleep: { fireplace: fireplaceSleep, rain: rainSleep },
  relax: { forest: forestRelax },
  home: { oceanZenBell: oceanZenBell, rainZenBell: rainZenBell }
};
```

### 2. トラックキーシステム
```typescript
const TRACK_PATHS = {
  'focus-ambient': SOUND_PATHS.focus.ambient,
  'sleep-fireplace': SOUND_PATHS.sleep.fireplace,
  'sleep-rain': SOUND_PATHS.sleep.rain,
  'relax-forest': SOUND_PATHS.relax.forest,
  'home-ocean-zen': SOUND_PATHS.home.oceanZenBell,
  'home-rain-zen': SOUND_PATHS.home.rainZenBell,
};
```

### 3. useAudioフック詳細
```typescript
interface UseAudioOptions {
  src: string;      // 音声ファイルパス
  loop?: boolean;   // ループ再生
  volume?: number;  // 音量（0-1）
}

// 重要な実装ポイント
useEffect(() => {
  // オーディオ作成（src, loop変更時のみ）
}, [src, loop]);

useEffect(() => {
  // 音量変更（オーディオ再作成なし）
  if (audioRef.current) {
    audioRef.current.volume = volume;
  }
}, [volume]);
```

## ビジュアルエフェクトシステム

### 1. Framer Motion活用
```typescript
// 泡エフェクト例
{Array.from({ length: 60 }).map((_, i) => {
  const leftPosition = (i * 7.3) % 100;
  const size = 8 + (i % 8) * 2.5;
  const duration = 30 + (i % 10) * 3;
  
  return (
    <motion.div
      key={i}
      className="absolute bg-white/20 rounded-full"
      style={{
        left: `${leftPosition}%`,
        width: `${size}px`,
        height: `${size}px`,
        bottom: '0px'
      }}
      animate={{
        y: [0, -window.innerHeight - 50],
        opacity: [opacity, opacity], // 消えない泡
        scale: [1, 1.1]
      }}
      transition={{
        duration,
        delay: (i * 0.5) % 10,
        ease: "linear",
        repeat: Infinity
      }}
    />
  );
})}
```

### 2. エフェクトの種類
- **泡エフェクト**: 下から上への上昇、消えない、ゆっくり
- **蛍エフェクト**: 複雑な飛行パス、神秘的な光
- **雨エフェクト**: まばらな降り方、自然な分布
- **波エフェクト**: 同心円状の波紋

## コンポーネント設計パターン

### 1. コンテナ・プレゼンテーション分離
```typescript
// コンテナ（ロジック）
function AppContent() {
  const [currentMode, setCurrentMode] = useState<Mode>("home");
  const { playTrack } = useAudioContext();
  
  return <AppUI mode={currentMode} onModeChange={setCurrentMode} />;
}

// プレゼンテーション（UI）
function AppUI({ mode, onModeChange }: AppUIProps) {
  return <div>{/* UI実装 */}</div>;
}
```

### 2. カスタムフック活用
```typescript
// 音声管理
const { isPlaying, play, pause, setVolume } = useAudio({ src, loop, volume });

// 多言語対応
const t = useTranslation(language);

// グローバル音声制御
const { playTrack, currentTrack } = useAudioContext();
```

## パフォーマンス最適化

### 1. 音声ファイル最適化
- **Git LFS**: 大容量ファイル管理
- **遅延読み込み**: 必要な時のみ音声ファイル読み込み
- **メモリ管理**: 不要なオーディオオブジェクトのクリーンアップ

### 2. レンダリング最適化
```typescript
// 不要な再レンダリング防止
const memoizedComponent = useMemo(() => {
  return <ExpensiveComponent />;
}, [dependency]);

// イベントハンドラーの最適化
const handleClick = useCallback(() => {
  // 処理
}, [dependency]);
```

### 3. アニメーション最適化
- **CSS Transform**: GPU加速活用
- **will-change**: アニメーション要素の最適化
- **requestAnimationFrame**: スムーズなアニメーション

## エラーハンドリング

### 1. 音声再生エラー
```typescript
const play = async () => {
  if (audioRef.current) {
    try {
      await audioRef.current.play();
    } catch (error) {
      console.error('Audio play failed:', error);
      // フォールバック処理
    }
  }
};
```

### 2. ファイル読み込みエラー
```typescript
useEffect(() => {
  if (!src) return; // 空のsrcをチェック
  
  const audio = new Audio(src);
  audio.addEventListener('error', (e) => {
    console.error('Audio load failed:', e);
  });
}, [src]);
```

## セキュリティ考慮事項

### 1. 音声ファイル
- **CORS**: 音声ファイルの適切な配信
- **Content-Type**: 正しいMIMEタイプ設定
- **ファイルサイズ**: 適切な制限

### 2. ユーザー入力
- **XSS防止**: Reactの自動エスケープ
- **型安全性**: TypeScript strict mode

## デプロイメント戦略

### 1. GitHub Pages最適化
```yaml
# .github/workflows/deploy.yml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
    - uses: actions/checkout@v4
      with:
        lfs: true  # Git LFS対応
    - name: Build
      run: npm run build
      timeout-minutes: 10
```

### 2. ビルド最適化
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          audio: ['framer-motion']
        }
      }
    }
  }
});
```

## テスト戦略

### 1. 単体テスト
```typescript
// useAudio.test.ts
describe('useAudio', () => {
  it('should play audio when play is called', async () => {
    const { result } = renderHook(() => useAudio({ src: 'test.mp3' }));
    await act(async () => {
      await result.current.play();
    });
    expect(result.current.isPlaying).toBe(true);
  });
});
```

### 2. 統合テスト
```typescript
// AudioContext.test.tsx
describe('AudioContext', () => {
  it('should play track when playTrack is called', () => {
    render(
      <AudioProvider>
        <TestComponent />
      </AudioProvider>
    );
    // テスト実装
  });
});
```

## 監視・ログ

### 1. パフォーマンス監視
```typescript
// 音声再生パフォーマンス
const startTime = performance.now();
await playAudio();
const endTime = performance.now();
console.log(`Audio play time: ${endTime - startTime}ms`);
```

### 2. エラーログ
```typescript
// グローバルエラーハンドリング
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

## 今後の技術的改善点

### 1. パフォーマンス
- **Web Workers**: 重い処理の分離
- **Service Worker**: オフライン対応
- **WebAssembly**: 音声処理の高速化

### 2. ユーザー体験
- **Progressive Web App**: ネイティブアプリ体験
- **Web Audio API**: 高度な音声処理
- **WebRTC**: リアルタイム音声共有

### 3. 開発体験
- **Storybook**: コンポーネント開発
- **Jest**: テスト自動化
- **ESLint/Prettier**: コード品質

---

**技術責任者**: 開発チーム
**最終更新**: 2024年12月
**バージョン**: 1.0.0
