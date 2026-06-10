/**
 * C-APP V1 MVP版 シーン別体験データ
 * OTA・今日のおすすめなど、Phase 2機能は除外
 */

/**
 * ホーム画面の通知カード（V1: OTA・今日のおすすめを除外）
 * 2×2で4件 → V1では2件表示
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
    id: 'warning-info',
    icon: '⚠️',
    titleKey: 'homeCard.warningInfo.title',
    shortBodyKey: 'homeCard.warningInfo.body',
    action: 'warnings',
    theme: 'alert'
  }
];

/**
 * 通知タブに表示するコンテキスト通知（V1: OTA・今日のおすすめを除外）
 */
const CONTEXT_NOTIFICATIONS = [
  {
    id: 'warning-info',
    title: '⚠️ 警告灯について',
    time: '1時間前',
    content: '警告灯タブから全ての警告灯を確認できます。各警告灯の詳細はマニュアルをご覧ください。',
    borderColor: '#ef4444',
    unread: true,
    action: 'warnings'
  },
  {
    id: 'charging-tip',
    title: '🔌 充電のヒント',
    time: '昨日',
    content: '「充電の仕方教えて」と聞くと、手順をステップでご案内します。',
    borderColor: '#10b981',
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

// V1: OTA機能は除外（未定義）
// const DEMO_OTA = undefined;

// V1: 今日のおすすめは除外（未定義）
// const DEMO_DAILY = undefined;

/**
 * 警告灯ケース定義（V1: リアルタイム点灯データなし）
 * V1では警告灯タブで全警告灯の静的一覧のみ表示
 */
const WARNING_CASES = [];

/**
 * 警告灯マスタ（V1: 全て非アクティブ、マニュアル参照のみ）
 */
const WARNING_LAMPS = [
  { id: 'ev-system', active: false, icon: '🔴', badgeClass: 'red', manualTopic: 'warning' },
  { id: 'brake', active: false, icon: '🛑', badgeClass: 'red', manualTopic: 'warning' },
  { id: 'motor-overheat', active: false, icon: '🌡️', badgeClass: 'red', manualTopic: 'warning' },
  { id: 'system-warning', active: false, icon: '⚡', badgeClass: 'amber', manualTopic: 'warning' },
  { id: 'maintenance', active: false, icon: '🔧', badgeClass: 'amber', manualTopic: 'warning' },
  { id: 'tire-pressure', active: false, icon: '💨', badgeClass: 'amber', manualTopic: 'warning' },
  { id: 'high-beam', active: false, icon: '💡', badgeClass: 'blue', manualTopic: 'warning' },
  { id: 'charge-indicator', active: false, icon: '🔌', badgeClass: 'green', manualTopic: 'warning' },
  { id: 'low-temp', active: false, icon: '❄️', badgeClass: 'blue', manualTopic: 'warning' }
];
