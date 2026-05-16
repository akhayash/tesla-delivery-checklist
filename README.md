# Tesla 納車チェックリスト

Tesla **Model Y L** をはじめとした車両の納車受け取り時に、外装・内装・機能・書類を一つずつ確認し、問題があった項目を **写真・動画・メモ付き** で記録できるモバイル前提の Web アプリ。生成されたチェック結果は **自己完結 HTML レポート / 印刷 PDF / Markdown / JSON / メール / Web Share / QR コード** で共有できます。

🔗 **公開 URL**: https://akhayash.github.io/tesla-delivery-checklist/

---

## 主な特長

- **モバイル前提 PWA**：ホーム画面に追加すればネイティブアプリのように使え、オフラインでも動作。
- **Tesla 風デザイン**：ダーク基調 (#0B0D0F) + Tesla Red アクセント (#E31937)、Montserrat フォント。
- **車種別チェックリスト**：JSON スキーマで構造化。現状は Model Y L 専用（6 人乗りキャプテンシート・3 列目アクセス・長尺パネルギャップ等の固有項目を含む 7 カテゴリ・61 項目）。
- **撮影は OS 純正カメラ**：`<input capture>` 経由なので、シャッター時のフラッシュや Night Mode がそのまま使えます。撮影画像は Canvas で長辺 1600px に圧縮、EXIF は破棄。
- **完全ローカル保存**：写真・動画・メモはすべて端末の IndexedDB / localStorage のみ。外部サーバーへは一切送信しません。
- **読みやすい HTML レポート**：単一 `.html` ファイル。画像は Base64 で埋め込み、外部依存ゼロ。Tesla 風のスタイルで Markdown より圧倒的に読みやすい。
- **QR コード共有**：
  - **Home の QR**：アプリ URL をスキャンしてスマホで開く。
  - **レポート内の QR**：チェック結果のスナップショット（ステータス・メモ・メタ情報）を URL に圧縮埋め込み。スキャンすると別デバイスでも結果を閲覧可能（写真は HTML 側に含まれているため除外）。
- **アクセシブル**：Radix UI ベース、`@axe-core/playwright` で重大違反 0 を E2E で担保。

---

## チェックリストの構成

7 カテゴリ・61 項目（v0.1.0）。各項目に重要度（**重大 / 要対応 / 軽微**）を付与。

| カテゴリ | 項目数 | 内容 |
|---|---|---|
| 書類・基本情報 | 7 | VIN 一致、登録証、保証書、モバイルコネクター、キーカード × 2、フロアマット、取説 |
| 外装 / ボディ | 15 | パネルギャップ、ドアの建付け、塗装、ガラスルーフ、ライト、充電ポート、タイヤなど |
| 内装 (共通) | 8 | ステアリング、ダッシュボード、15.4" スクリーン、フランク、ラゲッジ、前席、オーディオ |
| 内装 (Model Y L 固有) | 9 | 2 列目キャプテンシート、ウォークスルー、3 列目アクセス・シート・ベルト、各列 USB-C、後席 HVAC |
| 機能 / 電装 | 13 | ワイパー、ウィンドウ、HVAC、カメラ、Autopilot キャリブレーション、スーパーチャージャー試走、Sentry/Dog Mode 等 |
| ソフトウェア / アカウント | 6 | アカウント、スマホキー、FW バージョン、コネクティビティ、ロケール、FSD/EAP |
| アフター対応 | 3 | Due Bill、サービスアポイント、リターンポリシー |

> **注意**：このチェックリストはコミュニティで一般的に挙げられる観点と Wikipedia の Model Y L 仕様情報を参考にしたドラフトです。最終的には Tesla 公式情報も併せてご確認ください。

---

## 使い方

1. スマホで <https://akhayash.github.io/tesla-delivery-checklist/> を開く。
2. ホーム画面に追加（iOS：共有メニュー → 「ホーム画面に追加」／ Android：メニュー → 「アプリをインストール」）。
3. デリバリーセンターで車種を選んで **チェックを開始**。
4. 項目ごとに **OK / 問題あり / 対象外** を選択。問題ありの場合はメモ＋写真／動画を添付。
5. **レポート** タブに移動し、納車情報（VIN・オーナー名等）を入力。
6. 出力形式を選択：HTML（推奨）、PDF（印刷）、Markdown、JSON、メール、共有。

---

## 開発

```bash
# 依存関係
npm ci

# 開発サーバー
npm run dev

# 本番ビルド
npm run build

# プレビュー（本番ビルドの確認）
npm run preview

# Playwright E2E（Chromium / Pixel 7 / iPhone 14 エミュレーション）
npm run e2e:install   # 初回のみ
npm run e2e
```

### ディレクトリ構成（抜粋）

```
src/
├─ data/                  チェックリストスキーマとモデル別データ
│  ├─ schema.ts
│  └─ model-y-l.ts
├─ lib/                   ピュアロジック（レポート生成、画像処理など）
│  ├─ report.ts
│  ├─ reportHtml.ts       自己完結 HTML レポート生成
│  ├─ reportMarkdown.ts
│  ├─ reportJson.ts
│  ├─ reportMailto.ts
│  ├─ shareApi.ts
│  ├─ viewerUrl.ts        スナップショットを URL に圧縮埋め込み
│  ├─ imageResize.ts
│  └─ appUrl.ts
├─ components/            UI コンポーネント
│  ├─ ui/                 shadcn/ui (Radix ベース)
│  ├─ AppShell.tsx
│  ├─ BottomNav.tsx
│  ├─ ProgressHeader.tsx
│  ├─ ChecklistItemRow.tsx
│  ├─ MediaCapture.tsx
│  └─ QrCode.tsx
├─ pages/
│  ├─ HomePage.tsx
│  ├─ ChecklistPage.tsx
│  ├─ SummaryPage.tsx
│  ├─ SettingsPage.tsx
│  └─ ViewPage.tsx        QR / URL から開いた時の読み取り専用ビュー
├─ store/
│  ├─ progress.ts         Zustand + localStorage
│  └─ media.ts            IndexedDB (idb-keyval)
├─ styles/
└─ router.tsx
```

---

## プライバシー / セキュリティ

- 写真・動画・メモは **すべて端末のブラウザストレージ** にのみ保存されます。
- アプリは外部解析や追跡スクリプトを一切埋め込みません。
- ソースコードは Public ですが、ユーザーデータ（写真・チェック結果など）は **このリポジトリには一切コミットされません**。`.gitignore` でローカルディレクトリを除外。
- QR コードに埋め込むスナップショットには **写真・動画は含まれません**（容量上の理由と、プライバシー配慮の両面）。

### QR コードの仕組み

| 場所 | 内容 | スキャンしたら何が見える？ |
|---|---|---|
| Home 画面の QR | アプリの URL | 空のアプリ（あなたのアプリ） |
| HTML レポート内の QR | スナップショット圧縮 URL（写真除外） | ブラウザでチェック結果を読み取り専用表示 |

スナップショットは LZ-string で圧縮し URL ハッシュに埋め込み。QR 容量を超えた場合（写真メモが非常に長い場合など）はアプリ URL のみへ自動フォールバックします。

---

## 既知の制限

- **iOS Safari ヘッドレス**：Playwright の WebKit ヘッドレスで `<input type="file" capture>` がプログラム的に挙動しない既知の問題のため、メディア添付の E2E は WebKit でのみスキップしています。実機 iOS Safari では正常に動作します。
- **Web ライト（torch）非搭載**：撮影中に常時 LED 点灯を切り替える機能は実装していません。OS 純正カメラのフラッシュ／Night Mode をお使いください。
- **QR の容量上限**：スナップショットが約 2,200 バイトを超えると、レポート内 QR はアプリ URL のみへフォールバックします。
- **多言語**：現在は日本語 UI のみ。将来 v0.5 で i18n 対応予定。
- **多モデル対応**：現状 Model Y L のみ。Model 3 / Y 標準 / S / X の追加は v0.4 で予定。

---

## 技術スタック

Vite · React 18 · TypeScript · Tailwind CSS · shadcn/ui (Radix UI) · lucide-react · Zustand · idb-keyval · qrcode · lz-string · vite-plugin-pwa · Playwright · @axe-core/playwright

---

## ライセンス

[MIT](./LICENSE) © akhayash

このアプリは Tesla, Inc. とは無関係の個人プロジェクトです。Tesla、Model Y、Model Y L は Tesla, Inc. の商標です。

## バージョン管理

[CONTRIBUTING.md](./CONTRIBUTING.md) を参照。Semantic Versioning + Conventional Commits + release-please で自動化しています。リリース履歴は [CHANGELOG.md](./CHANGELOG.md) と [GitHub Releases](https://github.com/akhayash/tesla-delivery-checklist/releases) を参照。
