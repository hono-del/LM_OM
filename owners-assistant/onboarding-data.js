/**
 * オンボーディングコンテンツ定義
 * 文言・ステップ順・画像はここを編集するだけで変更可能
 */
const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    icon: '🌟',
    title: 'Lean3へようこそ',
    body: 'Lean3は、1人乗りのパーソナルモビリティです。車体を傾けながらスムーズに曲がるActive Lean機構を備えています。まずは、安全に使い始めるための基本を確認しましょう。',
    image: 'wht12.webp',
    points: [
      { icon: '👤', text: '1人乗り' },
      { icon: '🪪', text: '普通免許が必要' },
      { icon: '🔌', text: '家庭用100V/200Vで充電' },
      { icon: '↔️', text: 'Active Leanで車体が傾く' },
      { icon: '📱', text: '困ったときはC-APPで確認' }
    ]
  },
  {
    id: 'vehicle-basics',
    icon: '🚗',
    title: 'まずは車両の基本を知りましょう',
    body: 'Lean3を使う前に、主要な操作部と確認ポイントを把握しておきましょう。',
    type: 'numbered-cards',
    items: [
      {
        number: 1,
        label: 'スタートスイッチ',
        hint: '電源のON/OFF。運転席左前側にPowerボタンがあります。',
        image: 'images/power-switch.jpg'
      },
      {
        number: 2,
        label: 'シフトスイッチ',
        hint: 'R / N / D の切替。右ドアにスイッチがあります。',
        image: 'images/shift-switch.jpg'
      },
      {
        number: 3,
        label: 'アクセル / ブレーキ',
        hint: '発進・減速の操作。運転席から見て右がアクセル、左がブレーキです。',
        image: 'images/accel-brake.jpg'
      },
      {
        number: 4,
        label: 'パーキングブレーキ',
        hint: '駐車時の固定'
      },
      {
        number: 5,
        label: 'メーター / 警告表示',
        hint: '残量・状態の確認。画面上部速度の下にE-Fのインジケーターで表示されます（Eが残量なし、Fがフル充電）。',
        image: 'images/meter.jpg'
      },
      {
        number: 6,
        label: '充電インレット',
        hint: '充電ケーブル接続部。車両の左後方に充電口接続部があります。',
        image: 'images/charge-inlet.jpg'
      }
    ]
  },
  {
    id: 'pre-drive-check',
    icon: '✅',
    title: '走行前チェック',
    body: '出発前に、次の項目を確認してください。',
    type: 'checklist',
    checklistItems: [
      'シートベルトを着用する',
      '充電残量を確認する',
      '警告表示が出ていないか確認する',
      'タイヤに異常がないか確認する',
      'ブレーキの効きを確認する',
      '周囲の安全を確認する'
    ],
    checklistWarning: '未確認の項目があります。出発前にもう一度確認してください。'
  },
  {
    id: 'start-driving',
    icon: '🚀',
    title: '乗り始める',
    body: '落ち着いて、次の順番で操作してください。',
    type: 'action-steps',
    steps: [
      { text: 'ブレーキを踏む', image: 'images/brake.jpg' },
      { text: 'スタートスイッチを押す', image: 'images/power-switch.jpg' },
      { text: 'ハンドルをメーター画面の指示に従って操作する　※ハンドルと車輪の角度を揃えるため', image: 'images/steering-align.jpg' },
      { text: 'シフトをDにする', image: 'images/shift-d.jpg' },
      { text: '周囲を確認する' },
      { text: 'ゆっくりアクセルを踏む' }
    ],
    note: '急発進・急ハンドルは避けてください。Lean3は旋回時に車体が傾きます。'
  },
  {
    id: 'stop-park',
    icon: '🅿️',
    title: '止まる・駐車する',
    body: '停車後は、車両が動き出さないように確実に駐車操作を行ってください。',
    type: 'action-steps',
    steps: [
      { text: 'ブレーキをゆっくり踏む', image: 'images/brake.jpg' },
      { text: '車両を完全に停止する' },
      { text: 'シフトをNまたはPにする', image: 'images/shift-n.jpg' },
      { text: 'パーキングブレーキをかける', image: 'images/parking-brake.jpg' },
      { text: 'スタートスイッチをOFFにする', image: 'images/power-switch.jpg' },
      { text: 'ドアロックを確認する' }
    ],
    footnote: '※ シフト表記や駐車手順は仮です。実車仕様に合わせて後から変更できます。'
  },
  {
    id: 'charging',
    icon: '🔌',
    title: '充電する',
    body: 'Lean3は家庭用100V/200Vコンセントで充電できます。充電前に、安全な場所で車両を停止してください。',
    type: 'action-steps',
    steps: [
      '車両を安全な場所に停める',
      '電源をOFFにする',
      '充電インレットを開ける',
      '充電ケーブルを接続する',
      '充電表示を確認する',
      '充電完了後、ケーブルを外す'
    ],
    note: '濡れた手で充電ケーブルを触らないでください。充電中に異常表示が出た場合は、C-APPの「困ったとき」から確認してください。'
  },
  {
    id: 'help',
    icon: '💡',
    title: '困ったとき',
    body: '警告灯がついた、充電できない、操作に迷った。そんなときはC-APPから確認できます。',
    type: 'help-points',
    points: [
      { icon: '⚠️', text: '警告灯から探す' },
      { icon: '🔍', text: '症状から探す' },
      { icon: '🔋', text: '充電できない' },
      { icon: '🚫', text: '動かない' },
      { icon: '📞', text: '販売店に連絡' }
    ]
  }
];
