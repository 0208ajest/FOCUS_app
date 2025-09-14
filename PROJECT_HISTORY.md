# Serenifocus プロジェクト履歴・技術ドキュメント

## プロジェクト概要

**Serenifocus** は、集中・リラックス・睡眠をサポートするWebアプリケーションです。美しいビジュアルエフェクトとBGMを組み合わせて、ユーザーの心身の健康をサポートします。

### 主要機能
- **Focus Mode**: ポモドーロタイマー + 集中用BGM
- **Sleep Mode**: 2つのシーン（Fireplace/Rain）+ 睡眠用BGM
- **Relax Mode**: 森林音 + リラックス用BGM
- **Home Page**: 複数のエフェクトボタン + 背景色変更機能
- **Global BGM Control**: ページ間をまたぐBGM制御

## 技術スタック

### フロントエンド
- **React 18** + **TypeScript**
- **Vite** (ビルドツール)
- **Tailwind CSS v4** (スタイリング)
- **Framer Motion** (アニメーション)
- **Lucide React** (アイコン)

### デプロイ・インフラ
- **GitHub Pages** (ホスティング)
- **GitHub Actions** (CI/CD)
- **Git LFS** (大容量音声ファイル管理)

### 音声管理
- **Custom Hooks**: `useAudio`, `useMultiAudio`
- **React Context**: `AudioContext` (グローバル状態管理)
- **MP3音声ファイル**: 6種類のBGM

## 開発履歴・主要な実装

### Phase 1: 基本機能実装
- 4つのモード（Home, Focus, Sleep, Relax）の基本UI
- ポモドーロタイマー機能
- 基本的なビジュアルエフェクト
- 多言語対応（日本語/英語）

### Phase 2: 音声コンテンツ強化
- 新しいBGMファイルの追加・差し替え
- Sleep Mode: Fireplace音源の追加
- Focus Mode: 水の中の音への差し替え
- Home Page: 海の禅ベル、雨の禅ベル音源追加

### Phase 3: グローバルBGM制御システム
- `AudioContext`の実装
- `GlobalAudioControl`コンポーネントの作成
- ページ間をまたぐBGM制御
- フッター固定のBGMコントロールバー

### Phase 4: ホームページエフェクト強化
- 波紋ボタン + 海の禅ベルBGM
- 雨ボタン + 雨の禅ベルBGM + 雨エフェクト
- 泡ボタン + Focus Mode BGM + 泡エフェクト
- 焚き火ボタン + Sleep Mode Fireplace BGM + 蛍エフェクト

### Phase 5: ビジュアルエフェクトの最適化
- 泡エフェクト: 下から上への上昇、消えない泡、ゆっくりとした動き
- 蛍エフェクト: 星空のような配置、複雑な飛行パス、神秘的な光
- 雨エフェクト: まばらな降り方、自然な分布

### Phase 6: 背景色変更機能
- 4色の背景色選択（紫、黒、青、緑）
- 右下のミニアイコンによる色変更
- 動的グラデーション背景

### Phase 7: 技術的改善・バグ修正
- GitHub LFS導入（大容量音声ファイル対応）
- GitHub Actions最適化（タイムアウト設定）
- TypeScriptエラー修正
- 音量調節時のBGM停止バグ修正

### Phase 8: Google Analytics 4導入（2024年12月）
- GA4プロパティ作成（測定ID: G-JM0VDEXHP6）
- グローバルサイトタグの実装
- カスタムイベントトラッキングシステム構築
- ユーザー行動分析の基盤整備

## 重要な技術的学び・解決策

### 1. 大容量ファイル管理
**問題**: 50MB以上の音声ファイルがGitHubの制限を超える
**解決策**: Git LFS導入
```bash
brew install git-lfs
git lfs install
git lfs track "*.mp3"
```

### 2. グローバル状態管理
**問題**: ページ間でBGMを継続再生
**解決策**: React Context + Custom Hook
```typescript
// AudioContext.tsx
const AudioContext = createContext<AudioContextType | undefined>(undefined);
export function AudioProvider({ children }: { children: React.ReactNode })
```

### 3. 音量調節バグ修正
**問題**: 音量変更時にBGMが停止
**原因**: useAudioのuseEffect依存配列にvolumeが含まれていた
**解決策**: 音量変更を分離したuseEffect
```typescript
// 修正前
useEffect(() => { /* オーディオ作成 */ }, [src, loop, volume]);

// 修正後
useEffect(() => { /* オーディオ作成 */ }, [src, loop]);
useEffect(() => { audioRef.current.volume = volume; }, [volume]);
```

### 4. ビジュアルエフェクトの安定化
**問題**: Math.random()による不安定なアニメーション
**解決策**: 決定論的な計算式
```typescript
// 修正前
leftPosition: Math.random() * 100

// 修正後
leftPosition: (i * 7.3) % 100
```

### 5. GitHub Actions最適化
**問題**: ビルドが長時間実行される
**解決策**: タイムアウト設定とLFS対応
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
    - uses: actions/checkout@v4
      with:
        lfs: true
```

### 6. Google Analytics 4統合
**問題**: ユーザー行動の詳細分析ができない
**解決策**: GA4カスタムイベントトラッキングシステム
```typescript
// src/utils/analytics.ts
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      timestamp: new Date().toISOString(),
    });
  }
};
```

**実装内容**:
- 測定ID: G-JM0VDEXHP6
- カスタムパラメータ: app_mode, bgm_track
- トラッキングイベント: モード切り替え、エフェクト使用、BGM操作、セッション管理

## ファイル構造

```
src/
├── components/
│   ├── ui/                    # UIコンポーネント
│   ├── Dashboard.tsx          # ダッシュボード
│   ├── FocusMode.tsx          # 集中モード
│   ├── SleepMode.tsx          # 睡眠モード
│   ├── RelaxMode.tsx          # リラックスモード
│   ├── GlobalAudioControl.tsx # グローバルBGM制御
│   └── VisualEffects.tsx      # ビジュアルエフェクト
├── contexts/
│   └── AudioContext.tsx       # 音声状態管理
├── hooks/
│   ├── useAudio.ts           # 単一音声管理
│   └── useMultiAudio.ts      # 複数音声管理
├── utils/
│   └── analytics.ts          # GA4トラッキングユーティリティ
├── assets/
│   ├── audio.ts              # 音声ファイルパス管理
│   └── sounds/               # 音声ファイル
│       ├── focus/            # 集中用BGM
│       ├── sleep/            # 睡眠用BGM
│       ├── relax/            # リラックス用BGM
│       └── home/             # ホーム用BGM
└── App.tsx                   # メインアプリケーション
```

## 音声ファイル構成

### Focus Mode
- `ambient.mp3` (52MB) - 水の中の音

### Sleep Mode
- `fireplace.mp3` (7MB) - 焚き火の音
- `rain.mp3` (58MB) - 雨の音

### Relax Mode
- `forest.mp3` (4MB) - 森林音

### Home Page
- `ocean_zen_bell.mp3` (52MB) - 海の禅ベル
- `rain_zen_bell.mp3` (51MB) - 雨の禅ベル

## 主要なコンポーネント詳細

### AudioContext
グローバルな音声状態管理を提供
- 現在のトラック管理
- 再生/停止制御
- 音量制御
- トラック情報取得

### GlobalAudioControl
フッター固定のBGMコントロール
- 再生/停止ボタン
- 音量スライダー
- トラック情報表示
- 常時表示

### VisualEffects
各モード用のビジュアルエフェクト
- 泡エフェクト（Focus/Home）
- 蛍エフェクト（Sleep/Home）
- 雨エフェクト（Sleep/Home）
- 波エフェクト（Home）

## デプロイメント

### GitHub Pages設定
1. リポジトリ設定でPagesを有効化
2. GitHub Actionsで自動デプロイ
3. Git LFSで大容量ファイル管理

### ビルドコマンド
```bash
npm run build
npx gh-pages -d dist
```

## GA4トラッキング詳細

### 実装済みイベント
- **page_view**: ページビュー（各モード切り替え時）
- **mode_change**: モード切り替え（from_mode, to_mode）
- **effect_button_click**: エフェクトボタンクリック（effect_type, mode）
- **bgm_play/bgm_stop**: BGM操作（track_name, mode, duration）
- **pomodoro_start/pomodoro_complete**: ポモドーロタイマー（session_type, duration）
- **background_color_change**: 背景色変更（color）
- **language_change**: 言語切り替え（from_language, to_language）
- **session_start/session_end**: セッション管理（duration, timestamp）
- **error**: エラートラッキング（error_type, error_message, mode）

### カスタムパラメータ
- **custom_parameter_1**: アプリモード（home, focus, sleep, dashboard）
- **custom_parameter_2**: BGMトラック名

### プライバシー対応
- プライバシーポリシー作成（PRIVACY_POLICY.md）
- ユーザーオプトアウト機能
- データ保持期間: 26ヶ月
- 個人情報の収集なし

## 今後の改善点・拡張可能性

### 機能拡張
- 新しいBGMの追加
- エフェクトの種類増加
- ユーザー設定の永続化
- プレイリスト機能
- **GA4分析レポートの自動化**

### 技術改善
- 音声ファイルの最適化
- パフォーマンス向上
- アクセシビリティ改善
- PWA対応
- **GA4カスタムディメンション追加**

### UI/UX改善
- ダークモード/ライトモード
- カスタムテーマ
- アニメーション最適化
- レスポンシブデザイン強化
- **ユーザー行動に基づくUI最適化**

## トラブルシューティング

### よくある問題
1. **BGMが再生されない**: AudioContextの初期化確認
2. **音量調節で停止**: useAudioの依存配列確認
3. **ビルドエラー**: TypeScriptの未使用変数削除
4. **GitHub Actions失敗**: Git LFS設定確認
5. **GA4イベントが記録されない**: 測定ID確認、リアルタイムレポート確認
6. **GA4トラッキングエラー**: ブラウザの開発者ツールでコンソールエラー確認

### デバッグ方法
- ブラウザの開発者ツールでコンソールログ確認
- React DevToolsで状態確認
- Network タブで音声ファイル読み込み確認
- **GA4リアルタイムレポート**: イベントの即座確認
- **GA4デバッグビュー**: 詳細なイベントパラメータ確認

## 開発者向け情報

### 開発環境セットアップ
```bash
git clone [repository]
cd FOCUS_app
npm install
npm run dev
```

### 主要な依存関係
```json
{
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "vite": "^4.0.0",
  "tailwindcss": "^4.0.0",
  "framer-motion": "^10.0.0",
  "lucide-react": "^0.300.0"
}
```

### コーディング規約
- TypeScript strict mode
- ESLint + Prettier
- コンポーネントは関数型
- カスタムフックでロジック分離
- Tailwind CSSでスタイリング

## 最新の開発履歴（2024年12月）

### GA4導入プロジェクト完了
**実施日**: 2024年12月
**目的**: ユーザー行動の詳細分析とアプリ改善のためのデータ収集

**実装内容**:
1. **Google Analytics 4プロパティ作成**
   - 測定ID: G-JM0VDEXHP6
   - ウェブストリーム設定
   - カスタムパラメータ設定

2. **カスタムイベントトラッキングシステム構築**
   - `src/utils/analytics.ts`: トラッキングユーティリティ
   - 9種類のイベントタイプ実装
   - カスタムパラメータ2種類設定

3. **プライバシー対応**
   - `PRIVACY_POLICY.md`: 詳細なプライバシーポリシー
   - ユーザーオプトアウト機能
   - データ保護措置

4. **ドキュメント整備**
   - `GA4_SETUP_GUIDE.md`: 設定手順とトラブルシューティング
   - プロジェクト履歴の更新

**技術的成果**:
- リアルタイムユーザー行動分析が可能
- アプリの使用パターン把握
- 機能改善のデータドリブンな判断が可能
- プライバシーに配慮した分析基盤

**デプロイ状況**:
- GitHub Pages自動デプロイ完了
- 本番環境でGA4トラッキング稼働中
- リアルタイムレポートで動作確認済み

---

**最終更新**: 2024年12月（GA4導入完了）
**プロジェクト状態**: 本番稼働中（GA4分析基盤整備完了）
**GitHub Pages URL**: https://0208ajest.github.io/FOCUS_app/
**GA4測定ID**: G-JM0VDEXHP6
