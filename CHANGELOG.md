# Changelog

すべての注目すべき変更はこのファイルに記載されます。
バージョン管理は [Semantic Versioning](https://semver.org/lang/ja/) に従い、
CHANGELOG は [release-please](https://github.com/googleapis/release-please) により自動生成されます。

## 1.0.0 (2026-05-16)


### Features

* initial Tesla delivery checklist PWA for Model Y L ([01356cc](https://github.com/akhayash/tesla-delivery-checklist/commit/01356cc2509d9acb4c9c21074578aee1047acb12))
* v0.2 inspection-flow checklist with severity filter and bulk actions ([#6](https://github.com/akhayash/tesla-delivery-checklist/issues/6)) ([85a86e2](https://github.com/akhayash/tesla-delivery-checklist/commit/85a86e2fe494de53e4f888835bc67e1769f173ea))
* v0.3.0 — resolve PR[#8](https://github.com/akhayash/tesla-delivery-checklist/issues/8) + PR[#9](https://github.com/akhayash/tesla-delivery-checklist/issues/9) conflicts, add 10 checklist items, crash-resume UX ([#11](https://github.com/akhayash/tesla-delivery-checklist/issues/11)) ([8d4dfe6](https://github.com/akhayash/tesla-delivery-checklist/commit/8d4dfe6e0ed1b6cd21d98312e618b16f5aa936c9))


### Bug Fixes

* **data:** correct ambiguous floormat count + add copilot setup steps ([9298fcc](https://github.com/akhayash/tesla-delivery-checklist/commit/9298fccffd8fa2d015c2506a8e98f93bddd6d117))

## [0.1.0] - 2026-05-16

### Added
- Tesla Model Y L 専用納車チェックリスト（7 カテゴリ・61 項目）
- PWA インストール対応（オフライン動作、ホーム画面追加可）
- OS 純正カメラ呼び出しでの写真・動画キャプチャ + 自動圧縮 + IndexedDB ローカル保存
- 自己完結 HTML / 印刷 PDF / Markdown / JSON / mailto / Web Share の各レポート出力
- QR コード共有（アプリ URL + チェック結果のスナップショット URL）
- 別デバイス用の読み取り専用ビュー (`#/view?d=...`)
- shadcn/ui + lucide-react + Tesla 風配色 + Montserrat
- Playwright E2E + axe-core アクセシビリティチェック
- GitHub Pages 自動デプロイ
