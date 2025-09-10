# Serenifocus 🎵

集中・安眠・リラックスをテーマにしたサウンド&エフェクトUIアプリケーション

## 📚 ドキュメント

- **[プロジェクト履歴・技術ドキュメント](./PROJECT_HISTORY.md)** - 開発履歴、実装詳細、学び
- **[技術アーキテクチャ詳細](./TECHNICAL_ARCHITECTURE.md)** - システム設計、パフォーマンス最適化
- **[開発者ガイド](./DEVELOPER_GUIDE.md)** - 開発環境セットアップ、デバッグ、貢献方法

## 🌟 特徴

- **集中モード**: 青ベースのデザインでポモドーロタイマー機能付き
- **安眠モード**: 黒ベースで3種類のシーン（星空・焚き火・雨）選択可能  
- **リラックスモード**: 緑ベースで自然音のミキサー機能
- **ダッシュボード**: 使用統計とコミュニティ機能
- **多言語対応**: 英語・日本語切り替え
- **レスポンシブデザイン**: デスクトップ・スマートフォン両対応

## 🚀 デプロイ方法

### GitHub Pagesへの自動デプロイ

1. GitHubリポジトリを作成
2. コードをプッシュ
3. GitHub Actions が自動でビルド・デプロイ

**ライブデモ**: [https://your-username.github.io/FOCUS_app](https://your-username.github.io/FOCUS_app)

### GitHub Pages設定手順

1. リポジトリの Settings → Pages
2. Source: "GitHub Actions" を選択
3. コードをmainブランチにプッシュ
4. Actions タブでデプロイ状況を確認

### ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## 📁 プロジェクト構成

```
├── App.tsx                    # メインアプリケーション
├── src/main.tsx              # エントリーポイント
├── components/
│   ├── DigitalClock.tsx      # デジタル時計
│   ├── Navigation.tsx        # ナビゲーション
│   ├── FocusMode.tsx         # 集中モード
│   ├── SleepMode.tsx         # 安眠モード
│   ├── RelaxMode.tsx         # リラックスモード
│   ├── Dashboard.tsx         # ダッシュボード
│   ├── VisualEffects.tsx     # 背景エフェクト
│   └── ui/                   # UIコンポーネント
├── styles/globals.css        # グローバルCSS
└── DESIGN_SPECIFICATIONS.md  # 詳細設計書
```

## 🎨 デザインシステム

### カラーテーマ
- **ホーム**: 紫系グラデーション
- **集中**: 青系グラデーション  
- **安眠**: 黒系グラデーション
- **リラックス**: 緑系グラデーション

### アニメーション
- 集中モード: ランダム泡エフェクト
- 安眠モード: 星空・焚き火・雨エフェクト
- リラックスモード: 葉っぱの流れるエフェクト
- ホーム: 砂時計エフェクト

## 🛠️ 技術スタック

- **React 18** + TypeScript
- **Tailwind CSS v4** 
- **Motion** (アニメーション)
- **Lucide React** (アイコン)
- **Vite** (ビルドツール)
- **GitHub Pages** (デプロイ)

## 📱 機能詳細

### 集中モード
- 25分作業 / 5分休憩のポモドーロタイマー
- 音楽再生コントロール
- 美しい泡エフェクト

### 安眠モード  
- 3つのシーン選択（星空・焚き火・雨）
- フェードアウトタイマー（5-120分）
- 音量自動調整機能

### リラックスモード
- 5種類の自然音ミキサー（風・鳥・水・森・アンビエント）
- 3つのプリセット設定
- 個別音量調整

## 🌍 多言語対応

- 英語 (English)
- 日本語 (Japanese)

言語切り替えは画面右下のボタンから可能

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

1. Fork the repository
2. Create your feature branch
3. Commit your changes  
4. Push to the branch
5. Open a Pull Request

---

**Serenifocus** - あなたの集中・睡眠・リラクゼーションをサポートします ✨
