# -*- coding: utf-8 -*-
import json
import re

# JSONデータを読み込み
with open('evitara_data_fixed.json', 'r', encoding='utf-8') as f:
    json_data = json.load(f)

# ベースHTMLを読み込み
with open('lean3-pages-editor.html', 'r', encoding='utf-8') as f:
    html = f.read()

# タイトルとヘッダーを置換
html = html.replace('COMS → Lean3 ページ別変更点分析', 'eVITARA → Lean3 項目別変更点分析')
html = html.replace('COMSマニュアル全86ページをページ単位で分類・管理', 'eVITARAマニュアル全140項目をLean3仕様へ変換')
html = html.replace('linear-gradient(135deg, #2d2d2d, #4a4a4a)', 'linear-gradient(135deg, #1e3a8a, #3b82f6)')
html = html.replace('color: #2d2d2d;', 'color: #1e3a8a;')
html = html.replace('background: #2d2d2d;', 'background: #1e3a8a;')

# 色設定を更新
color_replacements = [
    ('.summary-card.add { border-color: #4caf50; }', '.summary-card.add { border-color: #10b981; }'),
    ('.summary-card.modify { border-color: #ffeb3b; }', '.summary-card.modify { border-color: #f59e0b; }'),
    ('.summary-card.delete { border-color: #f44336; }', '.summary-card.delete { border-color: #ef4444; }'),
    ('.summary-card.reuse { border-color: #9c27b0; }', '.summary-card.reuse { border-color: #8b5cf6; }'),
    ('.summary-card.verify { border-color: #03a9f4; }', '.summary-card.verify { border-color: #06b6d4; }'),
    ('.add { background: #c8e6c9; }', '.add { background: #d1fae5; }'),
    ('.modify { background: #fff9c4; }', '.modify { background: #fef3c7; }'),
    ('.delete { background: #ffcdd2; }', '.delete { background: #fee2e2; }'),
    ('.reuse { background: #e1bee7; }', '.reuse { background: #ede9fe; }'),
    ('.verify { background: #b3e5fc; }', '.verify { background: #cffafe; }'),
]

for old, new in color_replacements:
    html = html.replace(old, new)

# page-cardクラスの色を更新（正規表現で）
html = re.sub(r'\.page-card\.add\s*\{[^}]+\}', '.page-card.add {\\n      background: #ecfdf5;\\n      border-color: #10b981;\\n    }', html)
html = re.sub(r'\.page-card\.modify\s*\{[^}]+\}', '.page-card.modify {\\n      background: #fffbeb;\\n      border-color: #f59e0b;\\n    }', html)
html = re.sub(r'\.page-card\.delete\s*\{[^}]+\}', '.page-card.delete {\\n      background: #fef2f2;\\n      border-color: #ef4444;\\n    }', html)
html = re.sub(r'\.page-card\.reuse\s*\{[^}]+\}', '.page-card.reuse {\\n      background: #f5f3ff;\\n      border-color: #8b5cf6;\\n    }', html)
html = re.sub(r'\.page-card\.verify\s*\{[^}]+\}', '.page-card.verify {\\n      background: #f0f9ff;\\n      border-color: #06b6d4;\\n    }', html)

# type-クラスの色を更新
html = html.replace('.type-add { background: #4caf50; }', '.type-add { background: #10b981; }')
html = html.replace('.type-modify { background: #ffeb3b; color: #333; }', '.type-modify { background: #f59e0b; color: white; }')
html = html.replace('.type-delete { background: #f44336; }', '.type-delete { background: #ef4444; }')
html = html.replace('.type-reuse { background: #9c27b0; }', '.type-reuse { background: #8b5cf6; }')
html = html.replace('.type-verify { background: #03a9f4; }', '.type-verify { background: #06b6d4; }')

# データ変数を置換
json_str = json.dumps(json_data, ensure_ascii=False, indent=2)
html = re.sub(r'let pages = \[[\s\S]*?\];', f'let items = {json_str};', html)

# ローカルストレージキーを変更
html = html.replace("localStorage.getItem('lean3PagesData')", "localStorage.getItem('evitaraLean3ItemsData')")
html = html.replace("localStorage.setItem('lean3PagesData'", "localStorage.setItem('evitaraLean3ItemsData'")
html = html.replace("localStorage.removeItem('lean3PagesData')", "localStorage.removeItem('evitaraLean3ItemsData')")

# PDFパスを変更
html = html.replace("const pdfPath = 'coms_manual.pdf';", "const pdfPath = 'eVITARA_OM.pdf';")

# ファイル名を変更
html = html.replace('lean3-pages-', 'evitara-lean3-items-')

# JavaScriptのコード内のpages → items、page → itemに変更
# これは慎重に行う必要があります
html = re.sub(r'\bpages\b(?!\.html)', 'items', html)  # pages.htmlは除外
html = re.sub(r'\bpage\b(?![-\.])', 'item', html)  # page-やpage.は除外

# 新しいHTMLファイルを保存
with open('evitara-lean3-pages-editor_new.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('新しいevitara-lean3-pages-editor_new.htmlを生成しました')
