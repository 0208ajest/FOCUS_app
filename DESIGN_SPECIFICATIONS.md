# Serenifocus - 設計仕様書

## 概要
集中・安眠・リラックスをテーマにしたサウンド&エフェクトUIアプリケーション「Serenifocus」の詳細設計仕様書

## アプリケーション構成

### 技術スタック
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

### ファイル構成
```
├── App.tsx                    # メインアプリケーションコンポーネント
├── src/main.tsx              # エントリーポイント
├── index.html                # HTMLテンプレート
├── components/
│   ├── DigitalClock.tsx      # デジタル時計コンポーネント
│   ├── Navigation.tsx        # ナビゲーション（ホーム画面）
│   ├── FocusMode.tsx         # 集中モード
│   ├── SleepMode.tsx         # 安眠モード
│   ├── RelaxMode.tsx         # リラックスモード
│   ├── Dashboard.tsx         # ダッシュボード
│   ├── VisualEffects.tsx     # 背景エフェクト
│   ├── LanguageSelector.tsx  # 言語選択
│   ├── translations.ts       # 多言語対応
│   └── ui/                   # shadcn/ui コンポーネント
└── styles/globals.css        # グローバルCSS
```

## デザインシステム

### カラーパレット
- **メイン背景**: `from-slate-900 via-purple-900 to-slate-900`
- **フォーカスモード**: `from-blue-900 via-blue-800 to-cyan-900` (青系)
- **安眠モード**: `from-gray-900 via-slate-900 to-black` (黒系)
- **リラックスモード**: `from-emerald-900 via-green-800 to-teal-900` (緑系)
- **ダッシュボード**: 紫系グラデーション

### タイポグラフィ
- **メインタイトル**: `text-6xl font-light text-white tracking-wider`
- **サブタイトル**: `text-xl text-slate-300 font-light`
- **セクションタイトル**: `text-2xl font-light text-white`
- **デジタル時計**: `font-mono tracking-wider` (各テーマに応じた色)

### レイアウト原則
- **レスポンシブデザイン**: モバイルファースト
- **グラスモーフィズム**: `backdrop-blur-lg` + `bg-white/10`
- **角丸**: `rounded-2xl` (大), `rounded-xl` (中), `rounded-lg` (小)
- **余白**: `space-y-8` (大), `space-y-4` (中), `space-y-2` (小)

## 画面仕様

### 1. ホーム画面
**レイアウト**:
- 中央配置のメインコンテンツ
- アプリタイトル + サブタイトル
- デジタル時計（紫テーマ）
- 4つのモードボタン（2x2グリッド、モバイルでは2x2）
- 砂時計エフェクト
- 右下に言語選択ボタン

**ナビゲーションボタン**:
- **サイズ**: `h-20 w-full`
- **配置**: `grid-cols-2 md:grid-cols-4 gap-4`
- **スタイル**: グラデーション背景 + ホバー効果
- **アイコン**: Lucide React (`h-5 w-5`)

**砂時計エフェクト**:
- 幅16px、高さ20px
- 白い枠線 + 琥珀色の砂
- アニメーション: 砂の落下 + 上下の砂量変化

### 2. フォーカスモード
**背景**: 青系グラデーション + 泡エフェクト
**主要機能**:
- デジタル時計（青テーマ）
- ポモドーロタイマー（25分作業/5分休憩）
- 音楽再生コントロール
- 音量調整

**ポモドーロタイマー**:
- 大きな時間表示 (`text-6xl font-mono`)
- 再生/一時停止ボタン
- リセットボタン
- セッション切り替え表示

### 3. 安眠モード
**背景**: 黒系グラデーション + シーン選択エフェクト
**主要機能**:
- デジタル時計（オレンジテーマ）
- 3つのシーン選択（焚き火/星空/雨）
- 音楽再生コントロール
- 音量調整 + フェードアウトタイマー

**シーン選択**:
- 3つのボタン (`h-24 w-24`)
- アイコン: Flame, Star, Cloud
- 選択状態: `ring-2 ring-white/50`

### 4. リラックスモード
**背景**: 緑系グラデーション + 葉っぱエフェクト
**主要機能**:
- デジタル時計（緑テーマ）
- サウンドミキサー（5種類の自然音）
- プリセット設定
- マスター音量

**サウンドミキサー**:
- 5つの音源（風、鳥、水、森、アンビエント）
- 各音源に個別ボリュームスライダー
- 3つのプリセット設定

### 5. ダッシュボード
**機能**: 使用統計とコミュニティ機能の可視化

## アニメーション仕様

### デジタル時計
- **進行エフェクト**: 削除済み（点滅なし）
- **表示アニメーション**: フェードイン + スケール
- **テーマ別色彩**: フォーカス(青)、安眠(オレンジ)、リラックス(緑)

### 背景エフェクト

#### フォーカスモード - 泡エフェクト
```typescript
// 25個のランダムサイズの泡
size: Math.random() * 20 + 8  // 8-28px
opacity: Math.random() * 0.3 + 0.1  // 0.1-0.4
duration: Math.random() * 15 + 10  // 10-25秒
```

#### 安眠モード - 星空エフェクト
```typescript
// 80個の遠い星 + 15個の明るい星 + 流れ星
stars: 80個（小さな点滅）
brightStars: 15個（十字光線付き）
shootingStars: 3個（対角線移動）
```

#### リラックスモード - 葉っぱエフェクト
```typescript
// 15個の大きな葉 + 20個の小さな葉
leafShape: 'border-radius: 0 100% 0 100%'
rotation: 45度
vein: 中央線
colors: green-300/30 to emerald-400/20
```

### ホバー・インタラクション
- **ボタンホバー**: `hover:scale-105` + `transition-all duration-300`
- **グラスモーフィズム**: `bg-white/10 backdrop-blur-lg`
- **アクティブ状態**: リング表示 + 透明度変更

## 多言語対応

### サポート言語
- 英語 (en)
- 日本語 (ja)

### 実装方式
- `translations.ts`でキー・バリュー管理
- `useTranslation`カスタムフック
- 言語選択は右下固定ボタン

## レスポンシブデザイン

### ブレークポイント
- **モバイル**: `< 768px`
- **タブレット**: `768px - 1024px`
- **デスクトップ**: `> 1024px`

### 適応ルール
- ナビゲーション: `grid-cols-2 md:grid-cols-4`
- 時計サイズ: `text-4xl md:text-6xl`
- パディング: `p-4 md:p-6`
- コンテンツ幅: `max-w-2xl md:max-w-4xl`

## アクセシビリティ

### 実装要件
- セマンティックHTML構造
- キーボードナビゲーション対応
- 適切なコントラスト比
- スクリーンリーダー対応のaria-label

### 色彩配慮
- 白文字 on ダークグラデーション
- 十分なコントラスト比確保
- 透明度調整による視認性向上

## 状態管理

### ローカル状態
- 各コンポーネントで`useState`使用
- タイマー状態、音楽再生状態、設定値

### 状態構造
```typescript
// FocusMode
isTimerActive: boolean
timeLeft: number (seconds)
session: 'work' | 'break'
isMusicPlaying: boolean
volume: number[]

// SleepMode  
selectedScene: 'fire' | 'stars' | 'rain'
isPlaying: boolean
isMusicPlaying: boolean
fadeTimer: number

// RelaxMode
sounds: SoundControl[]
isMusicPlaying: boolean
```

## パフォーマンス最適化

### 実装ポイント
- React.memo によるコンポーネント最適化
- useCallback でのイベントハンドラー最適化
- アニメーション用のwill-change CSS
- 遅延ローディング（必要に応じて）

### バンドルサイズ
- Tree shaking有効
- 不要なライブラリ除去
- CSS最適化

## デプロイメント

### GitHub Pages設定
- **Base URL**: `./` (相対パス)
- **ビルド出力**: `dist/`
- **自動デプロイ**: GitHub Actions

### 必要ファイル
- `vite.config.ts`: GitHub Pages設定
- `.github/workflows/deploy.yml`: 自動デプロイ
- `package.json`: スクリプト設定

## 拡張予定機能

### 将来の改善点
- PWA対応（オフライン機能）
- 音声ファイルの実装
- ユーザー設定の永続化
- より詳細な統計機能
- ダークモード/ライトモード切り替え

## 開発・メンテナンス

### コーディング規約
- TypeScript strict モード
- ESLint + Prettier
- コンポーネント単位のファイル分割
- 一貫したネーミング規則

### テスト要件
- コンポーネントの単体テスト
- インタラクションテスト  
- レスポンシブデザインテスト
- クロスブラウザテスト

---

この設計書に基づいて、他の生成AIでもSerenifocusアプリケーションを正確に再現できます。
