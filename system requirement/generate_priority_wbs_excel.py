# -*- coding: utf-8 -*-
"""Generate Lean3 Phase-1 priority WBS Excel from Effort Estimation."""
import json
import os
import re
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter
from datetime import date

SOURCE_COPY = os.path.join(os.environ.get("TEMP", "."), "capp-wbs.json")
OUTPUT = r"system requirement\C-APP_Lean3_要件優先度一覧.xlsx"

# priority key -> (ja, en, fill color)
PRIORITIES = {
    "must": ("マスト", "Must", "C6EFCE"),
    "nice": ("できたら必要", "Nice to have", "FFF2CC"),
    "no": ("不要", "Not required", "F4CCCC"),
    "infra": ("基盤（マスト支援）", "Infrastructure", "D9E2F3"),
    "later": ("Phase 2以降", "Phase 2+", "E8E8E8"),
    "section": ("—", "—", "BDD7EE"),
}

THEMES = {
    "interim_auth": ("仮ログイン認証", "Interim login auth"),
    "onboarding": ("初回オンボーディング", "First-time onboarding"),
    "notify_rules": ("お知らせ（ルールベース）", "Notifications (rule-based)"),
    "faq_dynamic": ("FAQ動的表示", "Dynamic FAQ"),
    "chat": ("チャット（履歴・評価）", "Chat (history & ratings)"),
    "manual": ("マニュアル（PDF・オフライン）", "Manual (PDF & offline)"),
    "wl_dealer": ("警告灯→販売店誘導", "Warning lamp → dealership"),
    "ota": ("ソフト更新お知らせ", "Software update notice"),
    "status": ("ステータス", "Status / gamification"),
    "pwa": ("PWA配信", "PWA delivery"),
    "vehicle": ("車両選択", "Vehicle selection"),
    "settings": ("設定", "Settings"),
    "admin": ("管理画面", "Admin panel"),
    "ai_infra": ("AI・API基盤", "AI & API infra"),
    "other": ("—", "—"),
}

# Manual mapping for WBS IDs (sections use header row wbs as key prefix)
MAPPING = {
    # --- Must themes ---
    "1.1": ("must", "interim_auth", "PWAログイン画面。正式IDP(1.2)の代替として仮認証と併用"),
    "1.5": ("later", "interim_auth", "仮認証期間は簡易リセットのみ。本番IDP後に実装"),
    "1.2": ("later", "interim_auth", "Phase 1は仮ログイン。正式IDPはPhase 2"),
    "1.3": ("must", "interim_auth", "言語・車両・設定の最小プロファイル"),
    "1.4": ("later", "interim_auth", "GDPRはPhase 2"),
    "2.1": ("must", "vehicle", "Lean3選択"),
    "2.2": ("must", "vehicle", "年式選択"),
    "2.3": ("later", "vehicle", "複数車両はPhase 2"),
    "2.4": ("must", "vehicle", "ホーム・5タブ（Statusタブ除く）"),
    "3.1": ("must", "manual", "マニュアル入口・PDF"),
    "3.2": ("must", "manual", "HTMLビューア"),
    "3.3": ("must", "manual", "車両別マニュアル"),
    "3.4": ("must", "manual", "ディープリンク"),
    "3.5": ("nice", "manual", "外部リンク"),
    "4.1": ("must", "chat", "チャットUI"),
    "4.2": ("must", "chat", "履歴保存"),
    "4.3": ("nice", "chat", "ホーム検索→チャット"),
    "4.4": ("must", "faq_dynamic", "FAQローテーション・動的表示"),
    "4.5": ("must", "faq_dynamic", "クイック質問チップ"),
    "4.6": ("must", "chat", "AI/FAQ回答（限定トピック+出典）"),
    "4.7": ("must", "chat", "ウェルカムメッセージ"),
    "4.8": ("must", "chat", "👍/👎評価"),
    "4.9": ("later", "chat", "CS Handoff Phase 2"),
    "5.3": ("must", "onboarding", "オンボーディング（5.3/独自7ステップを3-5に縮小）"),
    "5.1": ("nice", "chat", "診断フローT1-T6の一部"),
    "5.2": ("nice", "wl_dealer", "チャット内警告灯グリッド"),
    "6.1": ("nice", "wl_dealer", "警告灯グリッド"),
    "6.2": ("nice", "wl_dealer", "警告灯詳細・販売店(オートバックス)誘導"),
    "7.1": ("must", "notify_rules", "通知センター"),
    "7.2": ("later", "notify_rules", "通知評価はPhase 2"),
    "7.3": ("must", "notify_rules", "未読バッジ"),
    "7.4": ("must", "notify_rules", "Web Push+メール（店舗PWA登録運用）"),
    "7.5": ("must", "notify_rules", "ホームカード（OTAカード除く）"),
    "7.6": ("must", "notify_rules", "お知らせ詳細"),
    "7.7": ("must", "notify_rules", "ルールエンジン（簡易・ルールベースのみ）"),
    "7.8": ("no", "notify_rules", "天候連携は不要（ルールベースのみ）"),
    "7.9": ("must", "onboarding", "マイルストーン通知（納車直後ガイド）"),
    "7.10": ("no", "notify_rules", "機能ギャップ推薦は不要"),
    "7.11": ("later", "notify_rules", "通知頻度制限はPhase 2"),
    "8.1": ("later", "other", "車両機能発見 Phase 1"),
    "8.2": ("no", "other", "天候AI Tips不要"),
    "9.1": ("no", "status", "ステータス不要"),
    "9.2": ("no", "status", "バッジ不要"),
    "9.3": ("no", "status", "メンテリマインダー不要"),
    "9.4": ("no", "status", "走行データ表示不要"),
    "9.5": ("no", "status", "機能カバレッジ不要"),
    "9.6": ("no", "status", "メンテ手入力不要"),
    "10.1": ("must", "settings", "設定（最小）"),
    "10.2": ("must", "settings", "日本語必須"),
    "10.3": ("no", "settings", "ダークモード不要"),
    "10.4": ("later", "settings", "アクセシビリティ Phase 2"),
    "10.5": ("later", "settings", "スクリーンリーダー Phase 1後"),
    "11.1": ("infra", "admin", "管理画面ログイン"),
    "11.2": ("infra", "admin", "FAQ・マニュアル・コンテンツ管理"),
    "11.3": ("later", "admin", "ユーザー管理 Phase 1"),
    "11.4": ("infra", "notify_rules", "通知ルール設定"),
    "11.5": ("later", "admin", "分析 Phase 2"),
    "11.6": ("later", "admin", "ブランド設定 Phase 1"),
    "11.7": ("infra", "admin", "i18n・マニュアルアップロード"),
    "11.8": ("later", "admin", "走行データ設定"),
    "11.9": ("later", "admin", "CS設定 Phase 2"),
    "12.1": ("later", "ai_infra", "API Hub Phase 1"),
    "12.2": ("later", "ai_infra", ""),
    "12.3": ("later", "ai_infra", ""),
    "12.4": ("infra", "faq_dynamic", "CMS連携"),
    "12.5": ("nice", "chat", "公式サイト連携"),
    "12.6": ("infra", "ai_infra", "ログ連携"),
    "12.7": ("infra", "notify_rules", "通知配信サービス"),
    "12.8": ("later", "ai_infra", ""),
    "12.9": ("nice", "wl_dealer", "販売店ロケーター Phase 3→できたら簡易リンク"),
    "12.10": ("later", "chat", ""),
    "13.1": ("must", "chat", "AIエンジン（FAQ+限定回答）"),
    "13.2": ("later", "ai_infra", ""),
    "14.1": ("nice", "chat", "AI品質トラッキング"),
    "14.2": ("later", "ai_infra", ""),
    "14.3": ("infra", "ai_infra", "死活監視"),
    "15.1": ("later", "other", ""),
    "15.2": ("later", "other", ""),
    "16.1": ("must", "pwa", "PWA（Phase1）。ハイブリッドはPhase2 Capacitor"),
    "16.2": ("must", "manual", "オフラインキャッシュ（マニュアル・FAQ・警告灯）"),
    "16.3": ("must", "notify_rules", "Web Pushデバイス登録"),
    "16.4": ("later", "pwa", ""),
    "16.5": ("later", "pwa", "ストア提出 Phase 2"),
    "16.6": ("later", "pwa", "マルチテナント Phase 2"),
    "17.1": ("infra", "pwa", "APIサーバー"),
    "17.2": ("infra", "pwa", "AWSインフラ"),
    "17.3": ("infra", "pwa", "セキュリティ"),
    "17.4": ("infra", "pwa", "ログ・アラート"),
    "17.5": ("infra", "pwa", "システムハードニング"),
}

# Explicit OTA / software update exclusion note for 7.5
OTA_NOTE = "ソフトウェア更新(OTA)カード・通知は除外"

COLUMNS = [
    ("WBS ID", 8),
    ("機能名（日本語）", 28),
    ("Feature Name (EN)", 28),
    ("Feature Ref", 10),
    ("Excel Phase", 10),
    ("優先度", 14),
    ("Priority (EN)", 14),
    ("テーマ", 22),
    ("Theme (EN)", 22),
    ("マスト要件との関係 / Notes (JA)", 38),
    ("Notes (EN)", 38),
]

HEADER_FILL = PatternFill("solid", fgColor="1F4E79")
HEADER_FONT = Font(bold=True, color="FFFFFF", size=9)
TITLE_FONT = Font(bold=True, size=14, color="1F4E79")
WRAP = Alignment(wrap_text=True, vertical="top")
CENTER = Alignment(horizontal="center", vertical="top", wrap_text=True)
THIN = Side(style="thin", color="CCCCCC")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

NAME_JA = {
    "Login Screen": "ログイン画面",
    "Log In with Automaker Authenticator (IDP)": "IDP認証",
    "User Profile and Preferences": "ユーザープロファイル",
    "Data Privacy and Consent (GDPR)": "GDPR同意",
    "Password Reset and Session Handling": "パスワードリセット",
    "Choose Your Vehicle Model": "車両モデル選択",
    "Choose Model Year": "年式選択",
    "Save and Manage Multiple Vehicles": "複数車両管理",
    "Home Screen After Vehicle Selection": "ホーム画面",
    "Manual Entry Buttons on Home Screen": "マニュアル入口",
    "Browse Manual In-App (HTML Viewer)": "マニュアルHTMLビューア",
    "Show the Right Manual for Each Vehicle": "車両別マニュアル",
    "Jump Directly to a Manual Chapter (Deep Link)": "マニュアル章ディープリンク",
    "External Link Management & Rendering": "外部リンク",
    "Chat Screen Layout": "チャット画面",
    "Save Chat History": "チャット履歴保存",
    "Home Search Goes to Chat": "ホーム検索→チャット",
    "Frequently Asked Questions (FAQ)": "FAQ",
    "Quick Question Buttons in Chat": "クイック質問チップ",
    "AI-Powered Text Answers": "AIテキスト回答",
    "Welcome Message and Quick Start": "ウェルカムメッセージ",
    "Helpful / Not Helpful Rating": "回答評価",
    "In-App Customer Support Handoff": "CSエスカレーション",
    "Guided Problem-Solving Flows (T1-T6)": "診断フロー",
    "Warning Lamp Identification in Chat": "チャット内警告灯",
    "Visual Step-by-Step Pop-up Guide": "ビジュアルステップガイド",
    "Warning Lights Icon Grid": "警告灯グリッド",
    "Warning Light Detail and Description": "警告灯詳細",
    "Notification Centre Screen": "通知センター",
    "Rate a Notification (Helpful / Not)": "通知評価",
    "Unread Notification Badge": "未読バッジ",
    "Deliver Notifications to iOS and Android (Push)": "プッシュ通知",
    "Smart Alert Cards on Home Screen": "ホームお知らせカード",
    "Alert Detail Screen": "お知らせ詳細",
    "Notification Rules Engine": "通知ルールエンジン",
    "Weather and Situation Data for Notifications": "天候連携通知",
    "Ownership Milestone Notifications": "マイルストーン通知",
    "Feature Usage Tracking for Recommendations": "機能利用推薦",
    "Notification Frequency Limits and Quiet Hours": "通知頻度制限",
    "User Knowledge Level and Progress Bar": "知識レベル",
    "Achievement Badges & Usage Tracking": "実績バッジ",
    "Maintenance Reminder Tracker": "メンテリマインダー",
    "Driving Data Display": "走行データ表示",
    "Feature Utilisation & Recommendation Tracking": "機能利用追跡",
    "Manual Maintenance Plan Entry": "メンテプラン入力",
    "Settings Screen": "設定画面",
    "Choose App Language": "言語選択",
    "Dark Mode and Display Theme": "ダークモード",
    "Mobile App Framework and Navigation": "PWA/アプリフレームワーク",
    "Offline Data Storage and Cache Sync System": "オフラインキャッシュ",
    "Push Notification Device Setup": "プッシュデバイス登録",
    "App Store Submission (iOS and Android)": "ストア提出",
    "AI Chat Engine Integration": "AIチャットエンジン",
    "Connect to Content System (CMS)": "CMS連携",
    "Dealer Locator (Phase 3)": "販売店ロケーター",
    "Admin Panel and Login": "管理画面",
    "Manage Content (Manuals, FAQ, Step Guides, Features)": "コンテンツ管理",
    "Build and Configure Notification Rules": "通知ルール設定",
    "Admin: Upload and Manage Manuals": "マニュアルアップロード",
}


def is_section_header(wbs, name):
    if not wbs or not re.match(r"^\d+\.", str(wbs)):
        return bool(wbs) and not name
    return False


def is_data_row(wbs, name):
    return bool(name) and re.match(r"^\d+\.\d+", str(wbs).strip())


def get_mapping(wbs, name):
    wbs = str(wbs).strip()
    if wbs in MAPPING:
        return MAPPING[wbs]
    return ("later", "other", "")


def note_en(priority, theme, note_ja, name):
    theme_en = THEMES.get(theme, ("", ""))[1]
    if priority == "no" and theme == "status":
        return "Status tab / gamification excluded from Phase 1 scope."
    if priority == "no" and theme == "ota":
        return "Software update (OTA) notifications excluded."
    if priority == "must" and theme == "interim_auth":
        return "Interim login (OTP/dealership token); formal IDP deferred."
    if priority == "must" and theme == "notify_rules" and "7.5" in note_ja or "OTA" in note_ja:
        return "Rule-based notifications only; exclude OTA/software-update cards."
    if note_ja:
        return note_ja  # fallback keep JA in EN col if no translation - we'll add basic EN
    templates = {
        ("must", "manual"): "Manual viewer, PDF download, offline via Service Worker.",
        ("must", "chat"): "Chat with history persistence and per-answer ratings.",
        ("must", "faq_dynamic"): "Dynamic FAQ rotation on Home; CMS-driven.",
        ("must", "onboarding"): "First-time onboarding; 3-5 steps; skippable.",
        ("nice", "wl_dealer"): "Warning lamp alert → dealership (AUTOBACS) guidance.",
        ("no", "status"): "Status tab not required.",
    }
    return templates.get((priority, theme), "")


def load_rows():
    with open(SOURCE_COPY, encoding="utf-8") as f:
        return json.load(f)


def build_rows(raw):
    out = []
    current_section = ""
    for item in raw:
        wbs = item["wbs"]
        name = item["name"]
        if is_section_header(wbs, name):
            current_section = wbs
            pri = "section"
            theme = "other"
            note = ""
            out.append({
                "wbs": wbs, "name": "", "name_ja": wbs, "ref": "",
                "phase": "", "priority": pri, "theme": theme, "note": note,
                "is_section": True,
            })
            continue
        if not is_data_row(wbs, name):
            continue
        priority, theme, note = get_mapping(wbs, name)
        if wbs == "7.5":
            note = (note + "。" + OTA_NOTE) if note else OTA_NOTE
        name_ja = NAME_JA.get(name, name)
        out.append({
            "wbs": wbs, "name": name, "name_ja": name_ja, "ref": item["ref"],
            "phase": item["phase"], "priority": priority, "theme": theme,
            "note": note, "is_section": False,
        })
    return out


def style_header_row(ws, row, ncol):
    for c in range(1, ncol + 1):
        cell = ws.cell(row=row, column=c)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = CENTER
        cell.border = BORDER


def build_overview(wb):
    ws = wb.create_sheet("Overview", 0)
    ws.column_dimensions["A"].width = 24
    ws.column_dimensions["B"].width = 50
    ws.column_dimensions["C"].width = 50
    lines = [
        ("文書 / Document", "C-APP Lean3 Phase 1 Requirement Priority", "Based on Effort Estimation WBS"),
        ("Source / 参照元", "CMC NDG Next - C-App Effort Estimation (R-Edge).xlsx", "Sheet: Project_ndg v2.0"),
        ("Delivery / 配信", "PWA（9月末）", "PWA end of Sep 2026"),
        ("", "", ""),
        ("優先度定義 / Priority", "", ""),
        ("マスト / Must", "9月末納車に必須。Phase 1 PWAスコープの中核。", "Required for end-of-Sep delivery."),
        ("できたら必要 / Nice to have", "余力があれば実装。警告灯→販売店誘導など。", "Implement if capacity allows."),
        ("不要 / Not required", "Phase 1では実装しない。", "Excluded from Phase 1."),
        ("基盤 / Infrastructure", "マスト機能を支える管理・API・インフラ。", "Supports Must-have features."),
        ("Phase 2以降 / Phase 2+", "正式IDP・ストア・高度機能。", "Formal IDP, app store, advanced features."),
        ("", "", ""),
        ("マスト要件（ビジネス指定）", "", ""),
        ("1", "仮ログイン認証", "Interim login authentication"),
        ("2", "初回オンボーディング", "First-time onboarding"),
        ("3", "お知らせ（ルールベースのみ）※OTA除外", "Notifications rule-based only; no OTA"),
        ("4", "FAQの動的表示", "Dynamic FAQ display"),
        ("5", "チャット（履歴・ユーザー評価含む）", "Chat with history & ratings"),
        ("6", "マニュアル（PDF・オフライン）", "Manual PDF & offline"),
        ("", "", ""),
        ("できたら必要", "警告灯お知らせ→販売店連絡誘導（6.x, 5.2, 12.9）", "WL notice → dealership guidance"),
        ("不要", "ソフトウェア更新お知らせ、ステータス（9.x全般）", "OTA notices; Status/gamification"),
    ]
    ws.cell(1, 1, "C-APP Lean3 要件優先度一覧").font = TITLE_FONT
    ws.merge_cells("A1:C1")
    for r, (a, b, c) in enumerate(lines, 3):
        for col, val in enumerate([a, b, c], 1):
            cell = ws.cell(r, col, val)
            cell.alignment = WRAP
            cell.border = BORDER


def build_summary(wb, rows):
    ws = wb.create_sheet("Summary")
    ws.column_dimensions["A"].width = 20
    ws.column_dimensions["B"].width = 12
    ws.column_dimensions["C"].width = 12
    headers = ["優先度 / Priority", "件数 / Count", "テーマ例 / Themes"]
    for i, h in enumerate(headers, 1):
        ws.cell(1, i, h)
    style_header_row(ws, 1, 3)
    data_rows = [r for r in rows if not r["is_section"]]
    counts = {}
    for r in data_rows:
        counts[r["priority"]] = counts.get(r["priority"], 0) + 1
    order = ["must", "nice", "no", "infra", "later"]
    for i, key in enumerate(order, 2):
        ja, en, fill = PRIORITIES[key]
        themes = sorted(set(THEMES[r["theme"]][0] for r in data_rows if r["priority"] == key and r["theme"] != "other"))
        ws.cell(i, 1, f"{ja} / {en}")
        ws.cell(i, 2, counts.get(key, 0))
        ws.cell(i, 3, "、".join(themes[:6]) + ("…" if len(themes) > 6 else ""))
        for c in range(1, 4):
            ws.cell(i, c).fill = PatternFill("solid", fgColor=fill)
            ws.cell(i, c).alignment = WRAP
            ws.cell(i, c).border = BORDER


def build_must_matrix(wb):
    ws = wb.create_sheet("Must Matrix")
    headers = [
        "マスト要件 (JA)", "Must requirement (EN)", "関連 WBS", "Related WBS (EN names)", "備考 (JA)", "Notes (EN)",
    ]
    ws.column_dimensions["A"].width = 28
    ws.column_dimensions["B"].width = 28
    ws.column_dimensions["C"].width = 22
    ws.column_dimensions["D"].width = 32
    ws.column_dimensions["E"].width = 36
    ws.column_dimensions["F"].width = 36
    for i, h in enumerate(headers, 1):
        ws.cell(1, i, h)
    style_header_row(ws, 1, len(headers))
    matrix = [
        ("仮ログイン認証", "Interim login auth", "1.1, 1.3", "Login Screen, User Profile",
         "1.2正式IDPはPhase2。OTPまたは店舗トークン", "Formal IDP 1.2 → Phase 2. OTP or dealership token."),
        ("初回オンボーディング", "First-time onboarding", "5.3, 7.9", "Visual Step Guide, Milestone Notifications",
         "3-5ステップに縮小。スキップ可。店舗誘導", "Reduce to 3-5 steps; skippable; dealership assist."),
        ("お知らせ（ルールベースのみ）", "Rule-based notifications", "7.1, 7.3-7.7, 11.4, 12.7, 16.3",
         "Notification Centre, Rules Engine, Push setup",
         "7.8天候・7.10推薦は除外。OTA/software updateカード除外", "Exclude weather 7.8, 7.10, OTA cards."),
        ("FAQ動的表示", "Dynamic FAQ", "4.4, 4.5, 11.2, 12.4", "FAQ, Quick chips, CMS",
         "ホームでローテーション。CMS駆動", "Rotating FAQ on Home; CMS-driven."),
        ("チャット（履歴・評価）", "Chat history & ratings", "4.1, 4.2, 4.6-4.8, 13.1", "Chat layout, history, AI, ratings",
         "限定トピック+出典。サーバー永続化", "Limited topics + citations; server persistence."),
        ("マニュアル（PDF・オフライン）", "Manual PDF & offline", "3.1-3.4, 16.2, 11.7", "Manual viewer, offline cache",
         "9月2週XML/HTML連携。Service Worker", "Week 2 Sep XML/HTML; Service Worker cache."),
        ("できたら必要：警告灯→販売店", "Nice: WL → dealership", "5.2, 6.1, 6.2, 12.9", "WL grid, detail, dealer locator",
         "入庫先オートバックス。テレマティクス未接続時は静的+手動", "AUTOBACS; static/manual until telematics."),
        ("不要：ソフト更新お知らせ", "Exclude: OTA notices", "7.5 (OTA部分)", "Smart Alert Cards (OTA subset)",
         "OTA/updateカード・通知シナリオを実装しない", "Do not implement OTA/update notification scenario."),
        ("不要：ステータス", "Exclude: Status", "9.1-9.6, 2.4 Status tab", "All gamification WBS",
         "ボトムナビからStatus削除。進捗・バッジなし", "Remove Status tab; no progress/badges."),
        ("PWA基盤", "PWA platform", "16.1, 17.1-17.5", "PWA framework, cloud, API",
         "ハイブリッド・ストア(16.5)はPhase2", "Hybrid/store 16.5 → Phase 2 (Capacitor)."),
    ]
    for r, row in enumerate(matrix, 2):
        for c, val in enumerate(row, 1):
            cell = ws.cell(r, c, val)
            cell.alignment = WRAP
            cell.border = BORDER
        if "不要" in row[0]:
            fill = PatternFill("solid", fgColor="F4CCCC")
        elif "できたら" in row[0]:
            fill = PatternFill("solid", fgColor="FFF2CC")
        else:
            fill = PatternFill("solid", fgColor="C6EFCE")
        for c in range(1, 7):
            ws.cell(r, c).fill = fill


def build_main_sheet(wb, rows):
    ws = wb.create_sheet("WBS Priority List")
    ncol = len(COLUMNS)
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=ncol)
    t = ws.cell(1, 1, f"C-APP Lean3 Requirement Priority / 要件優先度一覧  ({date.today().isoformat()})")
    t.font = TITLE_FONT

    header_row = 3
    for i, (name, width) in enumerate(COLUMNS, 1):
        ws.cell(header_row, i, name)
        ws.column_dimensions[get_column_letter(i)].width = width
    style_header_row(ws, header_row, ncol)

    for r_idx, row in enumerate(rows, header_row + 1):
        pri = row["priority"]
        pri_ja, pri_en, fill = PRIORITIES.get(pri, ("", "", "FFFFFF"))
        theme_ja, theme_en = THEMES.get(row["theme"], ("", ""))
        note_ja = row["note"]
        note_en_val = note_en(pri, row["theme"], note_ja, row["name"])
        if pri == "must" and row["theme"] == "notify_rules" and row["wbs"] == "7.5":
            note_en_val = "Rule-based home cards; exclude OTA/software-update cards."
        values = [
            row["wbs"],
            row["name_ja"] if not row["is_section"] else row["wbs"],
            row["name"] if not row["is_section"] else "",
            row["ref"],
            row["phase"],
            pri_ja,
            pri_en,
            theme_ja,
            theme_en,
            note_ja,
            note_en_val,
        ]
        row_fill = PatternFill("solid", fgColor=PRIORITIES.get(pri, ("", "", "BDD7EE"))[2])
        for c_idx, val in enumerate(values, 1):
            cell = ws.cell(r_idx, c_idx, val)
            cell.alignment = WRAP
            cell.border = BORDER
            cell.fill = row_fill
        ws.row_dimensions[r_idx].height = 36 if not row["is_section"] else 22

    ws.freeze_panes = ws.cell(row=header_row + 1, column=1)
    ws.auto_filter.ref = f"A{header_row}:{get_column_letter(ncol)}{ws.max_row}"


def main():
    raw = load_rows()
    rows = build_rows(raw)
    wb = Workbook()
    wb.remove(wb.active)
    build_overview(wb)
    build_must_matrix(wb)
    build_main_sheet(wb, rows)
    build_summary(wb, rows)
    wb.save(OUTPUT)
    print(f"Created: {OUTPUT}")
    print(f"Rows: {len([r for r in rows if not r['is_section']])}")


if __name__ == "__main__":
    main()
