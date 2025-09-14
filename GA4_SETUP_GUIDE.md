# GA4設定ガイド

## 概要

SerenifocusアプリにGoogle Analytics 4（GA4）を導入してアクセスログを取得するための完全なガイドです。

## 設定手順

### 1. Google Analytics 4プロパティの作成

1. **Google Analytics**にアクセス: https://analytics.google.com/
2. **「測定を開始」**をクリック
3. **アカウント名**を入力（例：「Serenifocus Analytics」）
4. **プロパティ名**を入力（例：「Serenifocus App」）
5. **レポートのタイムゾーン**を「日本」に設定
6. **通貨**を「日本円」に設定
7. **ビジネス情報**を入力
8. **データ共有設定**を選択
9. **データストリーム**で「ウェブ」を選択
10. **ウェブサイトURL**を入力: `https://0208ajest.github.io/FOCUS_app/`
11. **ストリーム名**を入力（例：「Serenifocus Web App」）
12. **測定ID**をコピー（例：`G-XXXXXXXXXX`）

### 2. トラッキングIDの設定

`index.html`ファイルの以下の部分を更新：

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JM0VDEXHP6"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-JM0VDEXHP6', {
    page_title: 'Serenifocus',
    page_location: window.location.href,
    custom_map: {
      'custom_parameter_1': 'app_mode',
      'custom_parameter_2': 'bgm_track'
    }
  });
</script>
```

**設定完了**: 測定ID `G-JM0VDEXHP6` が設定されています。

### 3. 実装済みのトラッキング機能

以下のイベントが自動的にトラッキングされます：

#### ページビュー
- アプリの初期読み込み時
- 各モードへの切り替え時

#### ユーザーアクション
- **モード切り替え**: Home ↔ Focus ↔ Sleep ↔ Dashboard
- **エフェクトボタンクリック**: 波、雨、泡、焚き火、ホーム雨
- **BGM再生/停止**: 各トラックの再生状況
- **背景色変更**: 紫、黒、青、緑
- **言語切り替え**: 英語 ↔ 日本語

#### セッション情報
- **セッション開始**: アプリの初回読み込み時
- **セッション終了**: ページ離脱時（セッション時間も記録）

#### ポモドーロタイマー（Focus Mode）
- **タイマー開始**: 作業/休憩セッション開始
- **タイマー完了**: セッション完了（持続時間も記録）

#### エラートラッキング
- 音声再生エラー
- その他のアプリケーションエラー

### 4. カスタムパラメータ

以下のカスタムパラメータが設定されています：

- **custom_parameter_1**: アプリモード（home, focus, sleep, dashboard）
- **custom_parameter_2**: BGMトラック名

### 5. デプロイ

1. **ビルド実行**:
   ```bash
   npm run build
   ```

2. **GitHub Pagesにデプロイ**:
   ```bash
   git add .
   git commit -m "feat: add GA4 tracking"
   git push origin main
   ```

3. **GitHub Actions**が自動的にデプロイを実行

### 6. 動作確認

#### リアルタイムレポート
1. Google Analyticsダッシュボードにアクセス
2. **「レポート」** → **「リアルタイム」**を選択
3. アプリを使用してイベントが記録されることを確認

#### イベント確認
1. **「レポート」** → **「エンゲージメント」** → **「イベント」**を選択
2. 以下のイベントが記録されることを確認：
   - `page_view`
   - `mode_change`
   - `effect_button_click`
   - `bgm_play`
   - `bgm_stop`
   - `pomodoro_start`
   - `pomodoro_complete`
   - `background_color_change`
   - `language_change`
   - `session_start`
   - `session_end`

### 7. プライバシー対応

- **プライバシーポリシー**: `PRIVACY_POLICY.md`を参照
- **ユーザーオプトアウト**: ブラウザ設定でGoogle Analyticsを無効化可能
- **データ保持期間**: 26ヶ月（Googleのデフォルト設定）

## トラブルシューティング

### イベントが記録されない場合

1. **測定IDの確認**: `index.html`のIDが正しいか確認
2. **ブラウザの開発者ツール**: コンソールでエラーがないか確認
3. **リアルタイムレポート**: 即座に反映されるか確認
4. **AdBlock**: 広告ブロッカーがGA4をブロックしていないか確認

### よくある問題

1. **測定IDが間違っている**
   - 解決策: Google Analyticsで正しいIDを確認

2. **ローカル環境でテストできない**
   - 解決策: 本番環境（GitHub Pages）でテスト

3. **イベントが遅れて表示される**
   - 解決策: リアルタイムレポートは即座、標準レポートは24時間以内

## 分析の活用

### 重要な指標

1. **ユーザーエンゲージメント**
   - セッション時間
   - ページビュー数
   - イベント数

2. **機能使用状況**
   - 各モードの使用頻度
   - エフェクトボタンの人気度
   - BGMトラックの再生回数

3. **ユーザー行動**
   - モード切り替えパターン
   - セッションの流れ
   - 離脱ポイント

### カスタムレポートの作成

1. **「探索」**機能を使用
2. **ディメンション**: イベント名、カスタムパラメータ
3. **指標**: イベント数、ユーザー数、セッション数
4. **フィルター**: 特定のモードや期間に絞り込み

## 今後の拡張

### 追加可能なトラッキング

1. **ユーザー属性**: デバイス、ブラウザ、地域
2. **パフォーマンス**: ページ読み込み時間、エラー率
3. **A/Bテスト**: 異なるUI要素の効果測定
4. **コンバージョン**: 特定の行動の完了率

### 高度な分析

1. **カスタムディメンション**: より詳細なユーザー分類
2. **目標設定**: 重要なアクションの完了率測定
3. **オーディエンス**: ユーザーセグメントの作成
4. **データエクスポート**: BigQueryとの連携

---

**注意**: このガイドに従って設定することで、Serenifocusアプリの使用状況を詳細に分析できるようになります。プライバシーに配慮しながら、ユーザー体験の向上に活用してください。
