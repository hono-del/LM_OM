/**
 * C-APP シーン別体験データ
 * 文言・ステップ・カード内容はここを編集するだけで変更可能
 */

/**
 * ホーム画面の通知カード（2×2で4件表示）
 * action: onboarding / daily / ota / warnings
 */
const HOME_NOTIFICATION_CARDS = [
  {
    id: 'welcome',
    icon: '🌟',
    titleKey: 'homeCard.welcome.title',
    shortBodyKey: 'homeCard.welcome.body',
    action: 'onboarding',
    theme: 'welcome'
  },
  {
    id: 'daily-tips',
    icon: '☀️',
    titleKey: 'homeCard.daily.title',
    shortBodyKey: 'homeCard.daily.body',
    action: 'daily',
    notificationId: 'daily-tips',
    theme: 'warm'
  },
  {
    id: 'ota-update',
    icon: '📡',
    titleKey: 'homeCard.ota.title',
    shortBodyKey: 'homeCard.ota.body',
    action: 'ota',
    notificationId: 'ota-update',
    theme: 'blue'
  },
  {
    id: 'warning-active',
    icon: '⚠️',
    titleKey: 'homeCard.warning.title',
    shortBodyKey: 'homeCard.warning.body',
    action: 'warnings',
    notificationId: 'warning-active',
    theme: 'alert'
  }
];

/**
 * 通知タブに表示するコンテキスト通知
 * action: タップ時に起動する体験（ota / daily / trouble / charging）
 */
const CONTEXT_NOTIFICATIONS = [
  {
    id: 'ota-update',
    title: '📡 ソフトウェア更新が完了しました',
    time: 'たった今',
    content: 'v2.4.1がインストールされました。あなたに関係ある変更点をご確認ください。',
    borderColor: '#3b82f6',
    unread: true,
    action: 'ota'
  },
  {
    id: 'daily-tips',
    title: '☀️ 今日のおすすめ設定',
    time: '1時間前',
    content: '寒い日の快適設定やバッテリーのコツをチェックしましょう。',
    borderColor: '#f59e0b',
    unread: true,
    action: 'daily'
  },
  {
    id: 'warning-active',
    title: '⚠️ 警告灯が2件点灯しています',
    time: '30分前',
    content: 'EVシステム異常・ブレーキ警告灯が点灯中です。警告灯タブから対処方法を確認してください。',
    borderColor: '#ef4444',
    unread: true,
    action: 'warnings'
  },
  {
    id: 'charging-tip',
    title: '🔌 充電のヒント',
    time: '昨日',
    content: '「充電の仕方教えて」と聞くと、手順をステップでご案内します。',
    borderColor: '#6b7280',
    unread: false,
    action: 'charging'
  },
  {
    id: 'welcome',
    title: '🎉 ようこそLean3へ！',
    time: '3日前',
    content: 'Lean3のオーナーになっていただき、ありがとうございます。',
    borderColor: '#10b981',
    unread: false,
    action: null
  }
];

const DEMO_CHARGING = {
  question: '充電の仕方教えて',
  intro: 'Lean3の充電手順をステップでご案内します。',
  steps: [
    '車両を安全な場所に停める',
    '電源をOFFにする',
    '充電インレットを開ける',
    '充電ケーブルを接続する',
    '充電表示を確認する',
    '充電完了後、ケーブルを外す'
  ],
  notes: [
    '濡れた手で充電ケーブルを触らないでください',
    'AC100V：約7時間 / AC200V：約5時間'
  ],
  troubleshoot: {
    label: '充電できない場合はこちら',
    hint: '充電ランプが点灯しない、途中で止まるなどの症状を確認できます'
  }
};

const DEMO_OTA = {
  title: 'ソフトウェア更新が完了しました',
  version: 'v2.4.1',
  date: '2026年6月8日',
  changes: [
    {
      title: '充電完了通知の改善',
      impact: '充電完了時にプッシュ通知が届くようになりました',
      operationChange: '操作変更なし'
    },
    {
      title: '冬季走行モードの追加',
      impact: '寒い日の加速を穏やかにし、バッテリー消費を抑えます',
      operationChange: '設定画面からON/OFF可能'
    },
    {
      title: '警告灯ガイドの更新',
      impact: '新しい警告表示の説明が追加されました',
      operationChange: '確認方法は従来どおり'
    }
  ]
};

const DEMO_DAILY = {
  cards: [
    {
      id: 'cold-comfort',
      icon: '❄️',
      title: '寒い日の快適設定',
      body: '暖房とバッテリー消費のバランスを整えましょう',
      primaryAction: '設定を見る',
      secondaryAction: 'あとで'
    },
    {
      id: 'battery-tips',
      icon: '🔋',
      title: 'バッテリーを長持ちさせるコツ',
      body: '急加速を避け、一定速度で走行すると効率的です',
      primaryAction: '詳しく見る',
      secondaryAction: 'あとで'
    },
    {
      id: 'active-lean',
      icon: '↔️',
      title: 'Active Leanの走行ポイント',
      body: '旋回時は車体が傾きます。ゆっくりハンドルを操作しましょう',
      primaryAction: 'ガイドを見る',
      secondaryAction: 'あとで'
    }
  ]
};

/**
 * 警告灯ケース定義
 * id: ev-system（ケース①）/ brake（ケース②）
 */
const WARNING_CASES = [
  {
    id: 'ev-system',
    icon: '🔴',
    name: 'EVシステム異常警告灯',
    badgeClass: 'red',
    urgency: '緊急',
    meaning: 'EVシステムの異常',
    action: 'ただちに安全な場所に停車してください。',
    detectedAt: '2026年6月8日 14:30',
    summary: [
      { label: '発生日時', value: '2026年6月8日 14:30' },
      { label: '警告灯', value: 'EVシステム異常警告灯' },
      { label: '警告内容', value: 'EVシステムの異常' },
      { label: '対処状況', value: '安全な場所に停車済み' },
      { label: '車両', value: 'Lean3 2026年モデル' }
    ],
    shareItems: [
      '警告灯の種類と点灯状況',
      '停車場所と周辺の安全状況',
      '走行中に気づいた症状',
      'チャットでの問い合わせ履歴（該当部分）'
    ],
    roadAssistance: {
      name: 'ロードアシスタンス',
      phone: '0120-XXX-XXX',
      hours: '24時間対応'
    }
  },
  {
    id: 'brake',
    icon: '🟡',
    name: 'ブレーキ警告灯（黄色）',
    badgeClass: 'amber',
    urgency: '注意',
    meaning: '電子制御ブレーキシステムの異常',
    action: 'ただちにオートバックスで点検を受けてください。',
    detectedAt: '2026年6月8日 13:15',
    nearbyDealers: [
      { id: 'dealer1', name: 'オートバックス 上野店', distance: '1.2km', address: '東京都台東区上野' },
      { id: 'dealer2', name: 'オートバックス 錦糸町店', distance: '2.8km', address: '東京都墨田区錦糸' },
      { id: 'dealer3', name: 'オートバックス 江東店', distance: '4.1km', address: '東京都江東区' }
    ],
    timeSlots: [
      { id: 'slot1', label: '6月10日（火）10:00〜11:00' },
      { id: 'slot2', label: '6月10日（火）14:00〜15:00' },
      { id: 'slot3', label: '6月11日（水）11:00〜12:00' },
      { id: 'slot4', label: '6月12日（木）15:00〜16:00' }
    ]
  }
];

/**
 * 警告灯マスタ（6.1 グリッド + 5.2 チャット用）
 * active: true のものが一覧上部に表示される
 */
const WARNING_LAMPS = [
  { id: 'ev-system', active: true, icon: '🔴', badgeClass: 'red', hasFlow: true },
  { id: 'brake', active: true, icon: '🟡', badgeClass: 'amber', hasFlow: true },
  { id: 'motor-overheat', active: false, icon: '🌡️', badgeClass: 'amber', manualTopic: 'section5-2' },
  { id: 'auxiliary-battery', active: false, icon: '🔋', badgeClass: 'amber', manualTopic: 'section5-2' },
  { id: 'seatbelt', active: false, icon: '🔒', badgeClass: 'amber', manualTopic: 'section5-2' },
  { id: 'turn-signal', active: false, icon: '↔️', badgeClass: 'green', manualTopic: 'section5-2' },
  { id: 'charge-indicator', active: false, icon: '🔌', badgeClass: 'green', manualTopic: 'section5-2' },
  { id: 'parking-brake', active: false, icon: '🅿️', badgeClass: 'blue', manualTopic: 'section5-2' },
  { id: 'high-beam', active: false, icon: '💡', badgeClass: 'blue', manualTopic: 'section5-2' }
];
