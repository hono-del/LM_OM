# LM_OM - Lean3マニュアルエディタシステム

eVITARA → Lean3およびCOMS → Lean3のマニュアル変更点を管理・編集するWebアプリケーションです。

## 主な機能

### 1. eVITARA → Lean3 項目別変更点分析エディタ
- `evitara-lean3-pages-editor.html`
- eVITARAマニュアルからLean3への変更点を項目別に管理
- PDF viewer統合（PDF.jsを使用）
- データ永続化機能（localStorage）

### 2. COMS → Lean3 ページ別変更点分析エディタ
- `lean3-pages-editor.html`
- COMSマニュアルからLean3への変更点をページ別に管理
- PDF viewer統合
- データ永続化機能（localStorage）

### 3. その他のエディタ
- `lean3-comparison-editor-v2.html` - 比較エディタv2
- `lean3-comparison-editor.html` - 比較エディタv1
- `manual.html` - マニュアルビューアー

## 使い方

### 基本的な使い方
1. `start-server.bat` を実行してローカルサーバーを起動
2. ブラウザで表示されたURLを開く
3. エディタで変更点を編集・保存

### データの永続化
- 編集内容はブラウザの`localStorage`に自動保存されます
- 右上の「💾 保存」ボタンをクリックして保存してください
- 次回開いた時に前回の編集内容が読み込まれます

### PDFファイルについて
以下の大きなPDFファイルはGitHubの100MB制限により含まれていません：
- `book.pdf` (139.20 MB)
- `eVITARA_OM.pdf` (111.26 MB)
- `coms_manual.pdf`

これらのファイルは別途OneDriveなどから取得し、プロジェクトルートに配置してください。

## ファイル構成

```
LM_OM/
├── evitara-lean3-pages-editor.html  # eVITARA→Lean3エディタ
├── lean3-pages-editor.html          # COMS→Lean3エディタ
├── start-server.bat                 # ローカルサーバー起動スクリプト
├── assets/                          # 画像リソース
├── contents/                        # コンテンツページ
├── data/                            # データファイル
└── image/                           # イメージファイル
```

## 技術スタック

- HTML5 / CSS3 / JavaScript
- PDF.js（PDF viewer）
- localStorage（データ永続化）
- Python http.server / Node.js serve（ローカルサーバー）

## ライセンス

内部使用のみ
