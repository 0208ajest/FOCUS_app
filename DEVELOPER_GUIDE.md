# Serenifocus 開発者ガイド

## クイックスタート

### 1. 環境セットアップ
```bash
# リポジトリクローン
git clone https://github.com/0208ajest/FOCUS_app.git
cd FOCUS_app

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

### 2. 主要コマンド
```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド
npm run preview      # ビルド結果プレビュー
npm run lint         # リント実行
```

## 開発ワークフロー

### 1. 新機能開発
```bash
# 新しいブランチ作成
git checkout -b feature/new-feature

# 開発・テスト
npm run dev

# コミット
git add .
git commit -m "feat: add new feature"

# プッシュ
git push origin feature/new-feature
```

### 2. バグ修正
```bash
# バグ修正ブランチ作成
git checkout -b fix/bug-description

# 修正・テスト
npm run build  # ビルドエラー確認

# コミット
git commit -m "fix: resolve bug description"

# プッシュ
git push origin fix/bug-description
```

## 主要コンポーネント開発

### 1. 新しいモード追加
```typescript
// 1. Mode型に追加
type Mode = "home" | "focus" | "sleep" | "relax" | "newmode";

// 2. コンポーネント作成
// src/components/NewMode.tsx
export function NewMode({ onBack, language }: NewModeProps) {
  const t = useTranslation(language);
  const { playTrack } = useAudioContext();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* UI実装 */}
    </div>
  );
}

// 3. App.tsxに追加
case "newmode":
  return <NewMode onBack={() => setCurrentMode("home")} language={language} />;
```

### 2. 新しいBGM追加
```typescript
// 1. 音声ファイル配置
// src/assets/sounds/newmode/bgm.mp3

// 2. audio.tsに追加
export const SOUND_PATHS = {
  // ... 既存
  newmode: { bgm: newModeBgm }
};

// 3. AudioContextに追加
const TRACK_PATHS = {
  // ... 既存
  'newmode-bgm': SOUND_PATHS.newmode.bgm,
};

const TRACK_INFO = {
  // ... 既存
  'newmode-bgm': { name: 'New Mode BGM', icon: '🎵' },
};
```

### 3. 新しいエフェクト追加
```typescript
// src/components/VisualEffects.tsx
export function VisualEffects({ type, scene }: VisualEffectsProps) {
  // ... 既存のエフェクト
  
  if (type === 'newmode') {
    return (
      <>
        {/* 新しいエフェクト実装 */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-500/30 rounded-full"
            animate={{
              // アニメーション定義
            }}
            transition={{
              // トランジション定義
            }}
          />
        ))}
      </>
    );
  }
}
```

## デバッグガイド

### 1. 音声関連デバッグ
```typescript
// AudioContext.tsx
console.log('AudioContext:', { currentTrack, currentSrc, isPlaying });

// useAudio.ts
console.log('useAudio state:', { isPlaying, volume, duration });
```

### 2. エフェクトデバッグ
```typescript
// エフェクトの状態確認
console.log('Effect state:', { isActive, particleCount, animationSpeed });

// パフォーマンス監視
const startTime = performance.now();
// エフェクト処理
const endTime = performance.now();
console.log(`Effect render time: ${endTime - startTime}ms`);
```

### 3. ブラウザ開発者ツール
- **Console**: エラーログ、デバッグ情報
- **Network**: 音声ファイル読み込み状況
- **Performance**: レンダリングパフォーマンス
- **Application**: LocalStorage、Service Worker

## よくある問題と解決策

### 1. BGMが再生されない
```typescript
// 原因: AudioContextの初期化問題
// 解決策: デバッグログ追加
console.log('AudioContext state:', { currentTrack, isPlaying, volume });

// 原因: 音声ファイルパス問題
// 解決策: パス確認
console.log('Audio src:', currentSrc);
```

### 2. エフェクトが表示されない
```typescript
// 原因: 状態管理問題
// 解決策: 状態確認
console.log('Effect state:', { isActive, type, scene });

// 原因: CSS問題
// 解決策: スタイル確認
console.log('Element styles:', element.style);
```

### 3. ビルドエラー
```bash
# TypeScriptエラー
npm run build  # エラー詳細確認

# 未使用変数エラー
# 解決策: 未使用インポート削除
import { UsedComponent } from './components'; // 使用するもののみ

# 型エラー
// 解決策: 型定義追加
interface NewComponentProps {
  prop1: string;
  prop2: number;
}
```

## パフォーマンス最適化

### 1. 音声ファイル最適化
```bash
# ファイルサイズ確認
ls -lh src/assets/sounds/**/*.mp3

# 圧縮（必要に応じて）
ffmpeg -i input.mp3 -b:a 128k output.mp3
```

### 2. レンダリング最適化
```typescript
// React.memo使用
const OptimizedComponent = React.memo(({ prop }) => {
  return <div>{prop}</div>;
});

// useMemo使用
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// useCallback使用
const handleClick = useCallback(() => {
  doSomething();
}, [dependency]);
```

### 3. アニメーション最適化
```typescript
// will-change使用
<div style={{ willChange: 'transform' }}>
  <motion.div animate={{ x: 100 }} />
</div>

// transform使用（GPU加速）
animate={{
  x: 100,  // transform: translateX
  y: 100,  // transform: translateY
  scale: 1.2  // transform: scale
}}
```

## テスト戦略

### 1. 単体テスト
```typescript
// __tests__/useAudio.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAudio } from '../hooks/useAudio';

describe('useAudio', () => {
  it('should play audio', async () => {
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
// __tests__/AudioContext.test.tsx
import { render, screen } from '@testing-library/react';
import { AudioProvider } from '../contexts/AudioContext';

describe('AudioContext', () => {
  it('should provide audio context', () => {
    render(
      <AudioProvider>
        <TestComponent />
      </AudioProvider>
    );
    
    expect(screen.getByText('Audio Context')).toBeInTheDocument();
  });
});
```

## デプロイメント

### 1. 本番ビルド
```bash
# ビルド実行
npm run build

# ビルド結果確認
ls -la dist/

# プレビュー
npm run preview
```

### 2. GitHub Pagesデプロイ
```bash
# 自動デプロイ（推奨）
git push origin main

# 手動デプロイ
npx gh-pages -d dist
```

### 3. デプロイ前チェックリスト
- [ ] ビルドエラーなし
- [ ] 音声ファイル読み込み確認
- [ ] エフェクト動作確認
- [ ] レスポンシブデザイン確認
- [ ] パフォーマンス確認

## コード規約

### 1. TypeScript
```typescript
// 型定義
interface ComponentProps {
  prop1: string;
  prop2?: number;  // オプショナル
}

// 関数型コンポーネント
export function Component({ prop1, prop2 }: ComponentProps) {
  return <div>{prop1}</div>;
}
```

### 2. スタイリング
```typescript
// Tailwind CSS使用
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
  <div className="glass-card p-4">
    {/* コンテンツ */}
  </div>
</div>
```

### 3. アニメーション
```typescript
// Framer Motion使用
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {/* コンテンツ */}
</motion.div>
```

## 貢献ガイドライン

### 1. プルリクエスト
- 明確なタイトルと説明
- 変更内容の詳細
- テスト結果
- スクリーンショット（UI変更時）

### 2. コミットメッセージ
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: code formatting
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

### 3. コードレビュー
- 機能性確認
- パフォーマンス確認
- セキュリティ確認
- コード品質確認

---

**開発チーム**: Serenifocus Team
**最終更新**: 2024年12月
**バージョン**: 1.0.0
