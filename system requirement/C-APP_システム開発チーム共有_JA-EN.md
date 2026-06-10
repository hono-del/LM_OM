# C-APP Requirements Brief for System Development Team  
# C-APP システム開発チーム向け要件共有（日英併記）

| | |
|---|---|
| **Created / 作成日** | 2026-06-08 |
| **Last updated / 最終更新** | 2026-06-08 |
| **Audience / 対象** | System development team (frontend, backend, PM, QA) |
| **Product / 対象製品** | C-APP — Lean3 Owner Information Service |
| **Reference mock / 参照モック** | `owners-assistant/`, `manual.html` |
| **Scale / 規模** | ~3,000 users in Year 1 |

---

## 0. Purpose / 文書目的

| JA | EN |
|----|-----|
| 本ドキュメントは、UIモックを参照しながら **9月末 PWA 配信** に向けてシステム開発チームと合意すべき事項を整理する。モックの実装手段（localStorage 等）は本番仕様ではない。 | This document aligns the **system development team** on requirements for **end-of-September PWA delivery**, using the UI mock as a **UX reference only**. Mock implementation details (e.g. localStorage) are **not** production specs. |

**Related documents / 関連資料**

| Document | Path |
|----------|------|
| Gap analysis | `C-APP_モック_vs_EffortEstimation_ギャップ分析.md` |
| Over-implementation list | `C-APP_過剰独自実装_開発者共有要件.xlsx` |
| MVP requirements | `C-APP_MVP要件_Lean3対応_8月末納品.md` |
| WBS / effort | `CMC NDG Next - C-App Effort Estimation (R-Edge).xlsx` |

**Mock launch / モック起動:** `owners-assistant/start-server.bat` → `http://localhost:8765/owners-assistant/index.html`

---

## 1. Schedule / スケジュール

### 1.1 Business milestones / ビジネスマイルストーン

| # | Timing / 時期 | Event (JA) | Event (EN) |
|---|---------------|------------|------------|
| A | **By end of Aug 2026** / **2026年8月末** | MVP 機能開発完了（要件ドキュメント目標） | MVP feature development complete (per requirements doc) |
| 1 | **Week 2 of Sep** / **9月2週目** | マニュアルデータ完成（XML/HTML） | Manual data ready (XML/HTML) |
| 2 | **Week 5 of Sep** / **9月5週目** | デジタル情報配信開始 | Digital information distribution starts |
| 3 | **End of Sep** / **9月末** | **Lean3 納車開始・C-APP PWA 本番配信** | **Lean3 delivery starts · C-APP PWA production launch** |
| — | **Year 1** / **1年目** | ユーザー約 3,000 人 | ~3,000 users |

> Content (manual, digital distribution) is scheduled **before** vehicle delivery.  
> コンテンツ（マニュアル・デジタル配信）は**納車より先**に整う計画。

### 1.2 Development milestones / 開発マイルストーン

| Timing / 時期 | Deliverable (JA) | Deliverable (EN) |
|---------------|------------------|------------------|
| **Mid-Jul** / **7月中旬** | ステージングドメイン・IDP dev コールバック URL 確定 | Staging domain & IDP dev callback URLs fixed |
| **End of Jul** / **7月末** | 本番ドメイン案確定・IDP 本番登録申請・SSL/DNS | Production domain fixed; IDP prod registration; SSL/DNS |
| **~Aug 15** / **8月15日頃** | URL 凍結（UAT・メールテンプレ・プライバシーポリシー） | URL freeze for UAT, email templates, privacy policy |
| **Aug** / **8月** | ステージングで IDP・マニュアル API・PWA（SW/manifest）結合 | Staging integration: IDP, manual API, PWA (SW/manifest) |
| **Week 2 Sep** / **9月2週** | マニュアル XML/HTML 本番取り込み・受け入れテスト | Production manual ingest & acceptance test |
| **Week 5 Sep** / **9月5週** | CMS/通知 API 稼働テスト・Web Push テスト | CMS/notification API & Web Push testing |
| **End of Sep** / **9月末** | PWA 本番公開・販売店オンボーディング運用開始 | PWA go-live; dealership onboarding ops start |
| **Phase 2 (Oct+)** / **Phase 2（10月〜）** | Capacitor ラップ → App Store / Google Play（検討） | Capacitor wrap → store submission (under consideration) |

### 1.3 Phase strategy / フェーズ戦略

| Phase | JA | EN |
|-------|-----|-----|
| **Phase 1** | **PWA**（9月末納車に合わせて配信）。WBS 16.5 ストア提出は Phase 1 スコープ外として再定義。 | **PWA** delivery aligned with end-of-Sep delivery. WBS 16.5 store submission **re-scoped** to Phase 2. |
| **Phase 2** | **Capacitor**（等）で同一 Web アセットをラップしストア化。FCM/APNs へ移行。 | Wrap same web assets with **Capacitor** for store release. Migrate to FCM/APNs. |

---

## 2. Risks / リスク

### 2.1 Schedule & integration / スケジュール・連携

| ID | Risk (JA) | Risk (EN) | Mitigation (JA) | Mitigation (EN) |
|----|-----------|-----------|-----------------|-----------------|
| R1 | 9月2週マニュアル完成後、PWA 取り込み・結合テスト期間が不足 | Insufficient time for manual ingest & integration after Week 2 Sep | 8月からステージングでスキーマ合意・スタブ API | Agree schema on staging in Aug; stub APIs early |
| R2 | IDP・本番ドメインの確定遅延が全体をブロック | Late IDP/domain decision blocks all work | **7月末**までに本番 URL 確定 | Fix production URLs by **end of Jul** |
| R3 | 9月5週デジタル配信と9月末納車の間が短い | Short window between Week 5 distribution and end-of-Sep delivery | 5週目をソフトローンチ期間と定義 | Define Week 5 as soft-launch / UAT period |
| R4 | 8月末 MVP 完了と9月前半結合テストのバッファ不足 | Thin buffer between Aug MVP and Sep integration | 優先機能を絞った MVP スコープを文書化 | Document reduced MVP scope explicitly |

### 2.2 PWA & operations / PWA・運用

| ID | Risk (JA) | Risk (EN) | Mitigation (JA) | Mitigation (EN) |
|----|-----------|-----------|-----------------|-----------------|
| R5 | iOS で Web Push はホーム画面追加＋許可が必要で到達率が低い | iOS Web Push needs Add to Home Screen + permission; low reach | **納車時に販売店で PWA セットアップ**を必須プロセス化 | **Mandatory dealership PWA setup** at delivery |
| R6 | ユーザーが PWA を見つけられない | Users cannot discover the PWA | 納車書類 QR・メール・店舗手順書 | QR on delivery docs, email, dealership checklist |
| R7 | 未登録・未許可ユーザーに通知が届かない | Notifications miss unregistered/unpermitted users | **メールをセーフティネット**として維持 | Keep **email as safety net** |
| R8 | Service Worker キャッシュとマニュアル更新の不整合 | SW cache vs manual content version mismatch | バージョン管理 API・起動時サイレント更新 | Version API; silent update on launch |

### 2.3 Scope & expectations / スコープ・期待値

| ID | Risk (JA) | Risk (EN) | Mitigation (JA) | Mitigation (EN) |
|----|-----------|-----------|-----------------|-----------------|
| R9 | モックの localStorage・固定 JSON を本番仕様と誤認 | Mock localStorage/static JSON mistaken for prod spec | 本ドキュメント・Excel【本番】列で明示 | This doc + Excel 【Production】 column |
| R10 | Effort Estimation（ストア・ハイブリッド）とのギャップ | Gap vs Effort Estimation (store/hybrid) | Phase 1=PWA として WBS 変更を合意 | Agree WBS change: Phase 1 = PWA |
| R11 | 警告灯テレマティクス API 未就绪時に納車 | Delivery before telematics API ready | Phase 1 は静的マスタ＋手動状態；API 接続は段階移行 | Phase 1: static master + manual state; phased API |
| R12 | 納車直後のサポート集中（9月末〜10月） | Support spike after end-of-Sep delivery | FAQ・マニュアルオフライン・店舗手順を優先 | Prioritize offline manual/FAQ; dealership scripts |

---

## 3. Requirements / 要件

> **Important:** Mock = UX reference. Production = API/CMS/IDP/server persistence.  
> **重要:** モック＝UX参照。本番＝API/CMS/IDP/サーバー永続化。

### 3.1 Delivery platform — PWA (Phase 1) / 配信形態 — PWA（Phase 1）

| Item (JA) | Item (EN) | Requirement (JA) | Requirement (EN) |
|-----------|-----------|------------------|------------------|
| 配信形態 | Delivery format | ネイティブアプリではなく **PWA** で9月末配信 | **PWA** for end-of-Sep launch, not native app |
| HTTPS | HTTPS | 本番ドメインで HTTPS 必須 | HTTPS on production domain required |
| manifest.json | manifest.json | アイコン・名称・`display: standalone`・`start_url` | Icons, name, `display: standalone`, `start_url` |
| Service Worker | Service Worker | マニュアル・警告灯マスタ・FAQ のオフラインキャッシュ | Offline cache for manual, warning lamp master, FAQ |
| ホーム画面追加 | Add to Home Screen | オンボーディング・店舗手順で誘導 | Guide in onboarding & dealership process |
| Phase 2 | Phase 2 | **Capacitor** で同一コードをラップしストア提出（設計前提） | Design for **Capacitor** wrap → store (Phase 2) |

**Do NOT copy from mock / モックから持ち込まないもの**

| Mock | Production |
|------|------------|
| localStorage / sessionStorage | User profile API + device cache |
| 固定 JSON (`demo-data.js`) | CMS / notification API / manual API |
| 独立 `onboarding.html` / `manual.html` | Integrated PWA routes/screens |
| キーワードマッチ疑似 AI | AI engine + cited answers + offline FAQ fallback |

### 3.2 Authentication — interim design (Phase 1) / 認証 — 暫定設計（Phase 1）

正式 IDP（WBS 1.2）が間に合わない場合の **暫定案**。本番 IDP 確定後に置き換える。

| Item (JA) | Item (EN) | Interim design (JA) | Interim design (EN) |
|-----------|-----------|---------------------|---------------------|
| ログイン | Login | メール＋ワンタイムコード、または販売店発行の初回トークン（要選定） | Email + OTP, or dealership-issued first-time token (TBD) |
| セッション | Session | HTTP-only cookie または JWT（refresh トークン） | HTTP-only cookie or JWT with refresh token |
| ユーザー識別 | User ID | サーバー側 UUID。車両・進捗・通知と紐づけ | Server-side UUID linked to vehicle, progress, notifications |
| IDP 移行 | IDP migration | OIDC コールバック URL を本番ドメインで先行確保。暫定認証から IDP へユーザーマッピング | Reserve OIDC callback URLs on prod domain; map interim users to IDP |
| 納車時 | At delivery | 販売店オンボーディングでログイン完了まで実施 | Dealership onboarding completes login |
| セキュリティ | Security | 暫定でも HTTPS・CSRF 対策・レート制限・監査ログ必須 | HTTPS, CSRF protection, rate limits, audit logs even for interim |

**URLs to fix early / 早期確定が必要な URL（例）**

```
https://{prod-domain}/login
https://{prod-domain}/auth/callback      ← OIDC (when ready)
https://{prod-domain}/auth/logout
https://{staging-domain}/auth/callback
```

| Deadline (JA) | Deadline (EN) |
|---------------|---------------|
| ステージング: **7月中旬** / 本番: **7月末** / 凍結: **8月15日頃** | Staging: **mid-Jul** / Prod: **end-Jul** / Freeze: **~Aug 15** |

### 3.3 Notifications (Phase 1) / 通知（Phase 1）

WBS 7.4 を Phase 1 で **部分充足** と定義する。

| Channel (JA) | Channel (EN) | Role (JA) | Role (EN) |
|--------------|--------------|-----------|-----------|
| **アプリ内通知**（7.1） | **In-app notifications** | 必須。PWA 起動時に確実に表示 | Required. Always visible when PWA is opened |
| **Web Push** | **Web Push** | 許可済みユーザーへの補助（OTA・Tips 等） | Supplementary for permitted users |
| **メール** | **Email** | **必須**。納車前・未登録・重要案内のフォールバック | **Required**. Pre-delivery, unregistered, critical fallback |
| SMS | SMS | 任意（重要通知のみ・同意管理必要） | Optional (critical only; consent required) |

**Dealership onboarding at delivery / 納車時の販売店オンボーディング（必須プロセス）**

| Step (JA) | Step (EN) |
|-----------|-----------|
| ① PWA URL を開く（iOS は **Safari** 推奨） | Open PWA URL (iOS: **Safari** recommended) |
| ② ログイン・車両登録 | Login & vehicle registration |
| ③ ホーム画面に追加 | Add to Home Screen |
| ④ 通知を許可 | Allow notifications |
| ⑤ はじめてガイド（スキップ可） | Getting-started guide (skippable) |

**KPI examples / KPI 例:** ホーム画面追加率 ≥80% / 通知許可率 ≥60%（店舗誘導時）

### 3.4 Core functional requirements (MVP / Phase 1) / コア機能要件

| WBS | Feature (JA) | Feature (EN) | Phase 1 scope (JA) | Phase 1 scope (EN) |
|-----|--------------|--------------|--------------------|--------------------|
| 2.4 | 5タブナビ | 5-tab nav | Home / Chat / Manual / Notifications / Status | Same |
| 2.1–2.2 | 車両選択 | Vehicle selection | Lean3、2024/2025/2026 年式 | Lean3, years 2024/2025/2026 |
| 3.1–3.4 | マニュアル | Manual | 9月2週 XML/HTML 連携・オフライン・`?topic=` ディープリンク | Week 2 Sep XML/HTML; offline; `?topic=` deep links |
| 4.2 | チャット履歴 | Chat history | 車両別・サーバー永続化 | Per-vehicle; server persistence |
| 4.6 | AI 回答 | AI answers | FAQ + 限定トピック（充電・アクティブリーン・航続・警告灯）＋出典 | FAQ + limited topics with citations |
| 4.8 | 回答評価 | Answer ratings | 各回答 👍/👎・サーバー同期 | Per-answer 👍/👎; server sync |
| 6.1–6.2 | 警告灯 | Warning lamps | グリッド＋詳細（→ 追加要件参照） | Grid + detail (see Additional Requirements) |
| 7.1 | 通知センター | Notification centre | CMS/API 駆動 | CMS/API driven |
| 7.5 | ホームカード | Home cards | 2×2 カード UI、CMS 駆動 | 2×2 card UI; CMS driven |

**Out of Phase 1 / Phase 1 対象外（推奨）**

| Item (JA) | Item (EN) |
|-----------|-----------|
| App Store / Google Play 提出（→ Phase 2） | Store submission (→ Phase 2) |
| ネイティブ FCM/APNs のみ（→ Phase 2 正式化） | Native-only FCM/APNs (→ Phase 2) |
| デモ用リセット機能 | Demo reset utilities |
| 6シナリオ固定デモランナー | Hardcoded 6-scenario demo runner |
| ゲーミフィケーション（Status）— P1 検討可 | Gamification (Status) — consider P1 |

### 3.5 Chat content notes / チャットコンテンツ補足

| Topic (JA) | Topic (EN) | Source |
|------------|------------|--------|
| 充電手順 | Charging steps | Owner's manual §3-(5) |
| 航続距離 | Driving range | [AUTOBACS Lean3 official](https://www.autobacs.com/product/micromobility/lean3/top.html) |
| アクティブリーンシステム | Active Lean System | Same (max lean 28°) |
| ~~Bluetooth~~ | ~~Bluetooth~~ | **Removed — not equipped on Lean3** |

### 3.6 Non-functional / 非機能

| Item (JA) | Item (EN) |
|-----------|-----------|
| 1年目約 3,000 ユーザー。過剰なマルチテナント設計は不要 | ~3,000 users Year 1; avoid over-engineered multi-tenancy |
| マニュアル・警告灯・FAQ のオフライン優先（地方利用） | Offline priority for manual, warning lamps, FAQ |
| 分析ログ：FAQ 利用・👍/👎・店舗セットアップ完了率 | Analytics: FAQ usage, ratings, dealership setup completion |
| 日本語必須（10.2）。EN はモックに i18n あり | Japanese required; EN i18n exists in mock |

---

## 4. Additional Requirements / 追加要件

モックに意図的に追加された実装。Excel `C-APP_過剰独自実装_開発者共有要件.xlsx` と連動。**開発チームの判断（採用/縮小/除外）が必要。**

### 4.1 First-time onboarding / 初回オンボーディング

| | JA | EN |
|---|-----|-----|
| **概要** | 初回ログイン後の車両オーナー向けガイド。画像付きステップ。 | Post-login owner guide with images per step. |
| **モック** | 独立 HTML（`onboarding.html`）7ステップ。完了/スキップを区別（スキップ時は「ガイド完了」バッジなし）。`localStorage` で状態管理。 | Standalone HTML, 7 steps. Skip vs full complete distinguished (no badge on skip). State in `localStorage`. |
| **本番要件** | ① PWA シェル内に統合 ② **3〜5ステップに縮小**（推奨） ③ コンテンツは CMS/API ④ 完了状態は**ユーザープロファイル API**（スキップ/全完了をサーバーで区別） ⑤ 納車時に販売店で実施可能な長さ・手順 | ① Integrate in PWA shell ② **Reduce to 3–5 steps** ③ CMS/API content ④ **User profile API** for state (skip vs full complete) ⑤ Length suitable for dealership-assisted setup |
| **フロー** | ログイン → 車両選択（年式）→ オンボーディング（スキップ可）→ ホーム | Login → vehicle/year → onboarding (skippable) → Home |
| **WBS** | 5.3 / 7.9 / 9.x に関連。Excel 上は分散。 | Related to 5.3 / 7.9 / 9.x; scattered in Excel. |
| **推奨判断** | **採用（縮小）** — UI・フローは採用、7ステップは縮小 | **Adopt (reduced)** — keep UX/flow; reduce from 7 steps |
| **優先度** | 高 | High |

**API fields (proposal) / API 項目（案）**

```json
{
  "onboarding_passed": true,
  "onboarding_fully_completed": false,
  "onboarding_completed_at": "2026-09-30T10:00:00Z",
  "onboarding_version": "2026.1"
}
```

### 4.2 Warning lamp data integration / 警告灯データ連携

| | JA | EN |
|---|-----|-----|
| **概要** | 点灯中警告灯の強調表示、全9件グリッド、検索、詳細、チャット内グリッド回答。 | Highlight active lamps; 9-lamp grid; search; detail; in-chat grid answer. |
| **モック** | `WARNING_CASES` 静的データ。点灯2件を上部表示。ブレーキ警告の入庫先は**オートバックス**。多段オーバーレイ（共有・予約・ロードアシスタンス）はクライアント側モーダルのみ。状態は `sessionStorage`。 | Static `WARNING_CASES`. Top 2 active. Brake warning → **AUTOBACS**. Multi-step overlays (share/booking/roadside) are client modals only. State in `sessionStorage`. |
| **本番要件（Phase 1）** | ① **警告灯マスタ API**（全9件：ID・名称・意味・対処・緊急度・画像） ② **車両状態 API**（点灯中 ID リスト）— テレマティクス未接続時は手動/スタブ ③ オフライン：マスタ＋最終状態を SW キャッシュ ④ 6.1 グリッド＋6.2 詳細までを MVP ⑤ チャット内警告灯回答（5.2）とのデータソース統一 | ① **Warning lamp master API** (9 items: id, name, meaning, action, urgency, image) ② **Vehicle state API** (active lamp IDs) — manual/stub until telematics ③ Offline: master + last state in SW ④ MVP: 6.1 grid + 6.2 detail ⑤ Same data source for in-chat grid (5.2) |
| **本番要件（Phase 2/P1）** | 予約・ロードアシスタンス・販売店共有オーバーレイ。テレマティクスリアルタイム連携。 | Booking, roadside, dealer-share overlays. Real-time telematics. |
| **WBS** | 6.1 / 6.2（MVP）。5.2（P1、モック先行）。オーバーレイは Phase 2–3 相当。 | 6.1/6.2 (MVP). 5.2 (P1, early in mock). Overlays = Phase 2–3 level. |
| **推奨判断** | **採用** — UI はモック準拠。データは API 駆動。オーバーレイは Phase 分割 | **Adopt** — UI per mock; API-driven data; phase-split overlays |
| **優先度** | 高 | High |

**API sketch / API 概要（案）**

```
GET /api/v1/vehicles/{vehicleId}/warning-lamps          → master + activeIds[]
GET /api/v1/vehicles/{vehicleId}/warning-lamps/{lampId} → detail
```

| Lamp ID (mock) | JA | Note |
|----------------|-----|------|
| `ev-system` | EVシステム異常 | Active in demo |
| `brake` | ブレーキ警告 | Active; service destination = **AUTOBACS** |
| (7 others) | 全9件グリッド | Inactive / searchable in mock |

### 4.3 Other additional items (summary) / その他追加要件（一覧）

| No | Item (JA) | Item (EN) | Recommendation (JA) | Recommendation (EN) |
|----|-----------|-----------|----------------------|---------------------|
| 1 | 6シナリオ体験 | 6-scenario demo | デモ専用。本番はイベント駆動 | Demo only; event-driven in prod |
| 4 | ホーム 2×2 カード＋既読管理 | Home 2×2 cards + read state | UI 採用、CMS/API | Adopt UI; CMS/API |
| 5 | デモ用リセット | Demo reset | **本番非搭載** | **Exclude from prod** |
| 6 | `manual.html` 外部配置 | External `manual.html` | **PWA 内統合（最優先）** | **Integrate into PWA (priority)** |
| 7 | ページエディタ | Page editor tools | **リポジトリから除外** | **Exclude from repo** |
| 8 | Home Search→Chat | Home Search→Chat | UX 参考、Phase 1 維持可 | UX reference; keep Phase 1 |
| 9 | 5.2/7.3 先行実装 | Early 5.2/7.3 | UI 参考、API 本番接続 | UI reference; prod APIs |

詳細は `C-APP_過剰独自実装_開発者共有要件.xlsx` の Developer Response シートに記入。

---

## 5. Actions for development team / 開発チームへのアクション

| # | Action (JA) | Action (EN) | Owner | By when (JA) | By when (EN) |
|---|-------------|-------------|-------|--------------|--------------|
| 1 | Phase 1=PWA、Phase 2=Capacitor のアーキテクチャ合意 | Agree Phase 1=PWA, Phase 2=Capacitor | Architect + PM | 共有会後1週間 | Within 1 week of briefing |
| 2 | 本番・ステージングドメインと OIDC コールバック確定 | Fix prod/staging domains & OIDC callbacks | Backend + Infra | 7月末 | End of Jul |
| 3 | 暫定認証 vs 正式 IDP の方針決定 | Decide interim auth vs formal IDP | Backend + PM | 7月末 | End of Jul |
| 4 | マニュアル XML/HTML スキーマレビュー | Review manual XML/HTML schema | Frontend + Content | 9月2週の2週前 | 2 weeks before manual Week 2 |
| 5 | 警告灯マスタ API・車両状態 API 設計 | Design warning lamp master & vehicle state APIs | Backend | 8月 | Aug |
| 6 | オンボーディング API・CMS 仕様 | Onboarding API & CMS spec | Frontend + Backend | 8月 | Aug |
| 7 | 通知チャネル設計（アプリ内＋Web Push＋メール） | Notification channel design | Backend + Ops | 8月 | Aug |
| 8 | 販売店 PWA セットアップ手順書 | Dealership PWA setup checklist | PM + Ops | 9月中旬 | Mid-Sep |
| 9 | 過剰9項目の Developer Response 記入 | Complete Developer Response sheet | All leads | 共有会後1週間 | Within 1 week |

---

## 6. Open questions / 未決事項

| # | Question (JA) | Question (EN) |
|---|---------------|---------------|
| 1 | 本番ドメイン（例: `lean3.owners.autobacs.com`）の最終決定者は？ | Who approves production domain? |
| 2 | 正式 IDP はオートバックス / メーカー / 独自のどれか？暫定認証の期間は？ | Formal IDP: AUTOBACS / OEM / custom? Interim auth duration? |
| 3 | 警告灯車両状態 API の Phase 1 ソース（テレマティクス / 手動 / スタブ） | Phase 1 source for active lamp state: telematics / manual / stub? |
| 4 | ゲーミフィケーション（Status タブ）は Phase 1 に含めるか P1 か？ | Include gamification (Status tab) in Phase 1 or P1? |
| 5 | 9月5週をソフトローンチとするか、9月末まで一般公開しないか？ | Soft launch Week 5 Sep vs public only at end of Sep? |

---

## 7. Summary / サマリー

| JA | EN |
|----|-----|
| **9月末**に Lean3 納車に合わせ **PWA** で配信する。ネイティブストアは **Phase 2（Capacitor）**。 | Launch **PWA** at **end of September** aligned with Lean3 delivery. Native store via **Phase 2 (Capacitor)**. |
| モックは UX 参照。**localStorage・固定 JSON・独立 HTML は本番に持ち込まない。** | Mock is UX reference only. **Do not carry localStorage, static JSON, or standalone HTML to production.** |
| 認証は **暫定設計可**だが、ドメイン・コールバック URL は **7月末までに確定**。 | **Interim auth** acceptable; domain & callback URLs **fixed by end of Jul**. |
| 通知は **店舗 PWA セットアップ ＋ Web Push ＋ アプリ内 ＋ メール** の多層構成。 | Notifications: **dealership PWA setup + Web Push + in-app + email**. |
| **追加要件の重点:** ① オンボーディング（縮小・API化）② 警告灯データ連携（マスタ API＋車両状態 API）。 | **Additional focus:** ① Onboarding (reduce, API-driven) ② Warning lamp data integration (master + vehicle state APIs). |

---

*Based on mock implementation and gap analysis as of 2026-06-08. Vehicle delivery start: **end of September 2026**.*  
*2026年6月8日時点のモック・ギャップ分析に基づく。納車開始: **2026年9月末**。*
