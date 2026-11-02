# EDEN LENS 100項目 静的ソース監査（2026-11-02）

**この監査は静的なコード・設定の存在検査です。端末実機や本番デプロイの成功を保証しません。**

- チェック項目: 120
- 合格: 120
- 要確認: 0

| No | 分野 | 項目 | 判定 |
|---:|---|---|---|
| 1 | DOM | video | PASS |
| 2 | DOM | overlay | PASS |
| 3 | DOM | status | PASS |
| 4 | DOM | flip | PASS |
| 5 | DOM | pause | PASS |
| 6 | DOM | result | PASS |
| 7 | DOM | resultTitle | PASS |
| 8 | DOM | resultText | PASS |
| 9 | DOM | noteSearchWrap | PASS |
| 10 | DOM | noteSearch | PASS |
| 11 | DOM | noteFilter | PASS |
| 12 | DOM | details | PASS |
| 13 | DOM | noteTools | PASS |
| 14 | DOM | exportNotes | PASS |
| 15 | DOM | clearNotes | PASS |
| 16 | DOM | backupNotes | PASS |
| 17 | DOM | importEntry | PASS |
| 18 | DOM | restoreNotes | PASS |
| 19 | DOM | infoText | PASS |
| 20 | DOM | scanView | PASS |
| 21 | DOM | scanPhoto | PASS |
| 22 | DOM | scanBoxes | PASS |
| 23 | DOM | scanHint | PASS |
| 24 | DOM | note | PASS |
| 25 | DOM | entryDescription | PASS |
| 26 | DOM | entryUrl | PASS |
| 27 | DOM | save | PASS |
| 28 | DOM | shareCurrent | PASS |
| 29 | DOM | entryType | PASS |
| 30 | DOM | findSimilar | PASS |
| 31 | DOM | clearSelection | PASS |
| 32 | DOM | similarInfo | PASS |
| 33 | DOM | lookup | PASS |
| 34 | DOM | webSearch | PASS |
| 35 | DOM | imageSearch | PASS |
| 36 | DOM | saveObject | PASS |
| 37 | DOM | saveScan | PASS |
| 38 | DOM | closeResult | PASS |
| 39 | DOM | confidenceControl | PASS |
| 40 | DOM | confidence | PASS |
| 41 | UIイベント | start | PASS |
| 42 | UIイベント | restart | PASS |
| 43 | UIイベント | flip | PASS |
| 44 | UIイベント | capture | PASS |
| 45 | UIイベント | save | PASS |
| 46 | UIイベント | findSimilar | PASS |
| 47 | UIイベント | exportNotes | PASS |
| 48 | UIイベント | clearNotes | PASS |
| 49 | UIイベント | closeResult | PASS |
| 50 | UIイベント | pause | PASS |
| 51 | UIイベント | shareCurrent | PASS |
| 52 | UIイベント | lookup | PASS |
| 53 | UIイベント | webSearch | PASS |
| 54 | UIイベント | importEntry | PASS |
| 55 | UIイベント | restoreNotes | PASS |
| 56 | UIイベント | saveObject | PASS |
| 57 | UIイベント | saveScan | PASS |
| 58 | UIイベント | noteSearch | PASS |
| 59 | UIイベント | noteFilter | PASS |
| 60 | UIイベント | demo | PASS |
| 61 | 安全性 | 人物除外 | PASS |
| 62 | 安全性 | カメラ音声OFF | PASS |
| 63 | 安全性 | カメラ停止 | PASS |
| 64 | 安全性 | URLプロトコル制限 | PASS |
| 65 | 安全性 | 外部リンクnoopener | PASS |
| 66 | 安全性 | ローカル保存 | PASS |
| 67 | 安全性 | ローカル読み出し | PASS |
| 68 | 安全性 | CSVインジェクション対策 | PASS |
| 69 | 安全性 | 共有データ形式検証 | PASS |
| 70 | 安全性 | バックアップ形式検証 | PASS |
| 71 | 安全性 | 画像容量制限 | PASS |
| 72 | 安全性 | 検索語エンコード | PASS |
| 73 | 安全性 | Wikipediaタイムアウト | PASS |
| 74 | 安全性 | DOM textContent | PASS |
| 75 | 安全性 | AI遅延読込 | PASS |
| 76 | 安全性 | カメラAPI確認 | PASS |
| 77 | 安全性 | 非同期競合防止 | PASS |
| 78 | 安全性 | 保存件数制限 | PASS |
| 79 | 安全性 | 保存エラー処理 | PASS |
| 80 | 安全性 | 人物フィルタ適用 | PASS |
| 81 | 公開基盤 | manifest name | PASS |
| 82 | 公開基盤 | manifest start | PASS |
| 83 | 公開基盤 | manifest scope | PASS |
| 84 | 公開基盤 | manifest display | PASS |
| 85 | 公開基盤 | manifest icon | PASS |
| 86 | 公開基盤 | SVG icon | PASS |
| 87 | 公開基盤 | SW install | PASS |
| 88 | 公開基盤 | SW activate | PASS |
| 89 | 公開基盤 | SW fetch | PASS |
| 90 | 公開基盤 | SW GET only | PASS |
| 91 | 公開基盤 | SW same origin | PASS |
| 92 | 公開基盤 | root publish site | PASS |
| 93 | 公開基盤 | security nosniff | PASS |
| 94 | 公開基盤 | security referrer | PASS |
| 95 | 公開基盤 | security camera | PASS |
| 96 | 公開基盤 | validation script | PASS |
| 97 | 公開基盤 | validation manifest | PASS |
| 98 | 公開基盤 | deployment branch | PASS |
| 99 | 公開基盤 | deployment secret | PASS |
| 100 | 公開基盤 | deployment site id | PASS |
| 101 | 機能・運用 | Validate workflow | PASS |
| 102 | 機能・運用 | Ignore env | PASS |
| 103 | 機能・運用 | Ignore Netlify state | PASS |
| 104 | 機能・運用 | README site | PASS |
| 105 | 機能・運用 | Scan confidence | PASS |
| 106 | 機能・運用 | Scan crop | PASS |
| 107 | 機能・運用 | Scan screenshot | PASS |
| 108 | 機能・運用 | Search notes | PASS |
| 109 | 機能・運用 | Filter notes | PASS |
| 110 | 機能・運用 | Photo input | PASS |
| 111 | 機能・運用 | Image fingerprint | PASS |
| 112 | 機能・運用 | Hash distance | PASS |
| 113 | 機能・運用 | Offline caching | PASS |
| 114 | 機能・運用 | Deploy verify | PASS |
| 115 | 機能・運用 | Workflow manual | PASS |
| 116 | 機能・運用 | Node version | PASS |
| 117 | 機能・運用 | No JS token | PASS |
| 118 | 機能・運用 | Japanese lang | PASS |
| 119 | 機能・運用 | Responsive viewport | PASS |
| 120 | 機能・運用 | Live camera status | PASS |

## 未解決
- GitHub ActionsのNetlify認証トークン不足は別途解決が必要。
- 公開URL・実機カメラ・外部API・アクセシビリティ実測は未検証。
