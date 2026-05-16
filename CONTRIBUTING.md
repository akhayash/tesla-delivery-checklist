## バージョン管理ルール

このリポジトリは **Semantic Versioning (SemVer)** と **Conventional Commits**、自動化のために **release-please** を採用しています。

### Conventional Commits

PR / コミットメッセージは次のプレフィックスを使ってください（release-please がパースします）。

| プレフィックス | 意味 | バージョン影響 |
|---|---|---|
| `feat:` | 新機能 | MINOR (+0.1.0) |
| `fix:` | バグ修正 | PATCH (+0.0.1) |
| `feat!:` / `fix!:` / `BREAKING CHANGE:` | 互換性のない変更 | MAJOR (+1.0.0) |
| `docs:` | ドキュメントのみ | なし |
| `chore:` | ビルド・依存・雑務 | なし |
| `refactor:` | 機能変更なしの内部整理 | なし |
| `test:` | テスト追加・修正 | なし |
| `perf:` | パフォーマンス改善 | PATCH |

### リリースの流れ

1. `feat:` / `fix:` などのコミットを main にマージ
2. **release-please ワークフロー**が自動で *Release PR*（バージョン bump + CHANGELOG 更新）を作成
3. Release PR をレビューしてマージ
4. マージ時に自動で `vX.Y.Z` タグ + GitHub Release + CHANGELOG.md 反映
5. `Deploy to GitHub Pages` ワークフローが本番にリリース

### 例

```
feat: add severity-based filter
fix: prevent localStorage quota error on iOS
feat!: rebuild checklist around walk-around flow

BREAKING CHANGE: Snapshots produced before v0.2.0 require migration.
```

### バージョン参照

- `package.json` の `version` フィールド（release-please が自動更新）
- ビルド時に Vite が `__APP_VERSION__` として `import.meta.env.VITE_APP_VERSION` に注入
- アプリの設定画面フッターと HTML レポートに表示
