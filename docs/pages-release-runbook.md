# EDEN LENS 公開・復旧手順（GitHub Pages）

## 対象
- リポジトリ: https://github.com/KAZIKIMIX/eden-lens
- 公開予定: https://kazikimix.github.io/eden-lens/
- Pages用ワークフロー: `.github/workflows/pages.yml`
- Pages用ビルド: `scripts/build-pages.mjs`
- Netlifyは別環境として保持。既存のにっぽんマップには触れない。

## 初回公開
1. GitHubの Settings → Pages → Build and deployment → Source を **GitHub Actions** に設定する。
2. Actions → **Deploy EDEN LENS to GitHub Pages** → Run workflow（main）を実行する。mainへのpushでも起動する。
3. Actionsの build と deploy の両ジョブが成功していることを確認し、実行URLとコミットSHAを記録する。
4. Pages設定に表示される公開URLを開き、HTTP 200、EDEN LENSの表示、manifest.webmanifest・sw.js・icon.svgの配信を確認する。
5. iPhone SafariとAndroid Chromeでカメラ許可、撮影、写真読み込み、解析、情報検索、ホーム画面追加を確認する。

## 失敗時の切り分け
- **Pagesが無効**: Settings → PagesでSourceをGitHub Actionsへ変更。
- **buildが失敗**: Actionsのログを確認。ローカルで `node scripts/validate.mjs`、`node --test scripts/sw.test.mjs`、`node scripts/build-pages.mjs` を実行。
- **deployが失敗**: Actions権限、Pages設定、github-pages環境の保護ルールを確認。
- **404**: Pagesの公開URL、Actionsのdeploy成功、リポジトリ公開設定を確認。推測で成功扱いにしない。
- **PWAが古い**: ブラウザのサイトデータとService Worker更新状況を確認。キャッシュ名変更が必要か判断。
- **カメラが動かない**: HTTPS、ブラウザの権限、端末の対応状況を確認。

## 検証記録テンプレート
| No. | 項目 | 判定 | 証拠（URL・日時・ログ・端末） |
|---|---|---|---|
| 1 | Pages Source | 未確認 | |
| 2 | Actions起動 | 未確認 | |
| 3 | build成功 | 未確認 | |
| 4 | deploy成功 | 未確認 | |
| 5 | トップページ | 未確認 | |
| 6 | iPhone Safari | 未確認 | |
| 7 | Android Chrome | 未確認 | |
| 8 | HTTPS・カメラ権限 | 未確認 | |
| 9 | サブパス | 未確認 | |
| 10 | PWA manifest | 未確認 | |
| 11 | Service Worker | 未確認 | |
| 12 | ホーム画面追加 | 未確認 | |
| 13 | 更新反映 | 未確認 | |
| 14 | Netlify整理 | 未着手 | |
| 15 | 公開・復旧手順書 | 完了 | この文書 |

**運用原則:** 設定ファイルの存在と本番動作の成功を混同しない。未検証を完了として数えない。

## 2026-11-06 公開障害の確定根拠
- GitHub Actions run 42125800392: アプリ検証・Pages bundle生成は成功。`actions/configure-pages@v5` は `Get Pages site failed: Not Found` で失敗。
- GitHub Actions run 42126093476: `enablement: true` に変更して再試行。Pagesサイト作成で `Resource not accessible by integration` が発生。自動有効化には権限が足りない。
- GitHub Actions run 42126118515: 同じPages設定権限で失敗。`deploy` は未実行。
- Netlify run 42125800295: `NETLIFY_AUTH_TOKEN` が空で認証チェックに失敗。Netlifyの自動pushデプロイはコミット `03ef0e88d9ddf1bbeee504c4d5af8ad0259256d0` で停止し、手動実行のみ維持。
- 次の解除操作: リポジトリの管理者が **Settings → Pages → Build and deployment → Source → GitHub Actions** を設定して保存する。これができれば `Actions → Deploy EDEN LENS to GitHub Pages → Run workflow (main)` を実行して確認する。
- 誤認防止: PagesのURLは deploy成功とHTTP確認までは未公開扱い。No.1～13は公開・実機検証まで未完了、No.14は自動失敗停止として完了、No.15は完了。
