/**
 * 言語・車種設定と i18n
 */
(function (global) {
  const STORAGE_KEY_LANG = 'capp_language';
  const STORAGE_KEY_VEHICLE = 'selectedVehicle';

  const LANGUAGES = [
    { id: 'ja', label: '日本語' },
    { id: 'en', label: 'English' }
  ];

  const VEHICLES = [
    { id: 'lean3', years: ['2024', '2025', '2026'] }
  ];

  const I18N = {
    ja: {
      'settings.title': '設定',
      'settings.language': '言語',
      'settings.vehicle': '車種',
      'settings.year': '年式',
      'settings.retryFirstLogin': '初回導線を最初から試す',
      'settings.retryFirstLogin.desc': 'ログイン→車両選択→はじめてガイド→ホームの流れを最初から体験します',
      'settings.onboarding': 'はじめてガイドのみ再表示',
      'settings.resetNotifications': 'お知らせをリセット',
      'settings.logout': 'ログアウト',
      'settings.saved': '設定を保存しました',
      'vehicle.lean3': 'Lean3',
      'vehicle.lean3.desc': '超小型電気自動車',
      'vehicle.yearModel': '{year}年モデル',
      'nav.home': 'ホーム',
      'nav.chat': 'チャット',
      'nav.manual': 'マニュアル',
      'nav.notifications': '通知',
      'nav.warnings': '警告灯',
      'nav.status': 'ステータス',
      'home.search': '🔍 車両について質問する...',
      'home.notifications': 'お知らせ',
      'home.moreNotifications': 'さらに通知を見る →',
      'home.faq': 'よくある質問',
      'warnings.title': '警告灯',
      'warnings.count': '警告点灯2件',
      'warnings.countDynamic': '警告点灯{count}件',
      'warnings.activeSection': '点灯中',
      'warnings.allSection': 'すべての警告灯',
      'warnings.search': '警告灯を検索...',
      'warnings.searchEmpty': '該当する警告灯が見つかりません',
      'warnings.litBadge': '点灯中',
      'warnings.meaning': '警告内容：',
      'warnings.action': '対処方法：',
      'warnings.cta': '対処を開始する →',
      'chat.placeholder': 'メッセージを入力...',
      'chat.send': '送信',
      'notification.tapHint': 'タップして確認 →',
      'homeCard.welcome.title': 'ようこそ！',
      'homeCard.welcome.body': 'もう一度はじめてガイドを見る',
      'homeCard.warningInfo.title': '警告灯',
      'homeCard.warningInfo.body': '全ての警告灯を確認',
      'homeCard.daily.title': '今日のおすすめ',
      'homeCard.daily.body': '快適設定とバッテリーのコツ',
      'homeCard.ota.title': 'ソフトウェア更新',
      'homeCard.ota.body': 'v2.4.1の変更点を確認',
      'homeCard.warning.title': '警告灯',
      'homeCard.warning.body': '警告点灯2件',
      'notif.ota.title': '📡 ソフトウェア更新が完了しました',
      'notif.ota.content': 'v2.4.1がインストールされました。あなたに関係ある変更点をご確認ください。',
      'notif.daily.title': '☀️ 今日のおすすめ設定',
      'notif.daily.content': '寒い日の快適設定やバッテリーのコツをチェックしましょう。',
      'notif.warning.title': '⚠️ 警告灯が2件点灯しています',
      'notif.warning.content': 'EVシステム異常・ブレーキ警告灯が点灯中です。お知らせから対処方法を確認してください。',
      'notif.charging.title': '🔌 充電のヒント',
      'notif.charging.content': '「充電の仕方教えて」と聞くと、手順をステップでご案内します。',
      'notif.welcome.title': '🎉 ようこそLean3へ！',
      'notif.welcome.content': 'Lean3のオーナーになっていただき、ありがとうございます。',
      'faq.activeLean': '🔄 アクティブリーンシステムって何？',
      'faq.charging': '🔌 充電の仕方教えて',
      'faq.chargeTime': '⏱️ 充電時間はどのくらいですか？',
      'faq.range': '🚗 航続距離はどのくらいですか？',
      'chat.greeting': 'こんにちは！Lean3アシスタントです。車両に関するご質問がありましたら、お気軽にお尋ねください。',
      'chat.chip.charging': '充電の仕方教えて',
      'chat.chip.range': '航続距離は？',
      'chat.question.charging': '充電の仕方教えて',
      'chat.question.range': '航続距離はどのくらいですか？',
      'chat.question.chargeTime': '充電時間はどのくらいですか？',
      'chat.question.activeLean': 'アクティブリーンシステムって何？',
      'chat.response.chargeTime': 'Lean3の充電時間は、AC200Vで約5時間、AC100Vで約7時間です。詳しい手順は「充電の仕方教えて」と聞いてください。',
      'chat.ai.activeLean.tagline': '曲がるたび、ワクワクする。',
      'chat.ai.activeLean.title': 'アクティブリーンシステム',
      'chat.ai.activeLean.spec': '最大リーン角',
      'chat.ai.activeLean.specValue': '28°',
      'chat.ai.activeLean.body': 'アクティブリーン技術は、サスペンションとステアリングをコントロールし、車両の傾きを最適に制御しながら走行する技術。小型ビークルでありながら旋回時や荒れた路面でも安定した走行と爽快なコーナリング体験を提供します。',
      'chat.ai.activeLean.sourceTitle': 'Lean3｜オートバックス公式サイト',
      'chat.response.generic': '「{message}」についてのご質問ですね。マニュアルで詳しい情報を確認するか、より具体的な質問をお願いします。',
      'chat.ai.source.label': '出典',
      'chat.ai.charging.intro': '取扱説明書「3. 充電について（5）充電の方法」に基づき、充電手順をご案内します。',
      'chat.ai.charging.step.0': 'パーキングブレーキをかけ、車両が動かないことを確認する',
      'chat.ai.charging.step.1': 'シフトレバーを「N（ニュートラル）」にする',
      'chat.ai.charging.step.2': 'キースイッチを「LOCK」にしてキーを抜く',
      'chat.ai.charging.step.3': '付属の充電コードを車両の充電差し込み口に奥までしっかり接続する',
      'chat.ai.charging.step.4': '充電コードを100Vアース付きコンセントに差し込む',
      'chat.ai.charging.step.5': '充電表示灯が赤色点灯し、充電が開始されたことを確認する',
      'chat.ai.charging.step.6': '充電表示灯が緑色点滅に変わったら満充電。コードを抜き、表示灯が消灯することを確認する',
      'chat.ai.charging.step.7': '充電コードを雨露にさらされない屋内などで保管する',
      'chat.ai.charging.note.0': '充電中はキースイッチ・ホーン・ブレーキペダル等を操作しないでください',
      'chat.ai.charging.note.1': '接続中の「ブーン」という音は冷却ファンの作動音で、異常ではありません',
      'chat.ai.charging.note.2': '充電時間は開始時のバッテリー残量によって異なります',
      'chat.ai.charging.manualRef': '取扱説明書「3. 充電について（5）充電の方法」',
      'chat.ai.range.lead': 'Lean3の航続距離は約100kmです。以下は公式製品情報の主な仕様です。',
      'chat.ai.range.note': '航続距離は走行条件・気温・エアコン使用などにより変動します。',
      'chat.ai.range.spec.category': '区分',
      'chat.ai.range.spec.range': '航続距離',
      'chat.ai.range.spec.speed': '最高速度',
      'chat.ai.range.spec.weight': '車体重量',
      'chat.ai.range.value.category': 'ミニカー',
      'chat.ai.range.value.range': '約100km',
      'chat.ai.range.value.speed': '60km/h',
      'chat.ai.range.value.weight': '約515kg',
      'chat.ai.range.sourceTitle': 'Lean3｜オートバックス公式サイト',
      'chat.charging.intro': 'Lean3の充電手順をステップでご案内します。',
      'chat.charging.step.0': 'パーキングブレーキをかけ、車両が動かないことを確認する',
      'chat.charging.step.1': 'シフトレバーを「N（ニュートラル）」にする',
      'chat.charging.step.2': 'キースイッチを「LOCK」にしてキーを抜く',
      'chat.charging.step.3': '付属の充電コードを車両の充電差し込み口に接続する',
      'chat.charging.step.4': '充電コードを100Vアース付きコンセントに差し込む',
      'chat.charging.step.5': '充電表示灯で充電開始・満充電を確認する',
      'chat.charging.step.6': '充電完了後、コードを抜いて屋内で保管する',
      'chat.charging.note.0': '充電中はキー・ホーン・ブレーキペダル等を操作しないでください',
      'chat.charging.note.1': 'AC100V：約7時間 / AC200V：約5時間',
      'chat.charging.troubleshoot.label': '充電できない場合はこちら',
      'chat.charging.troubleshoot.hint': '充電ランプが点灯しない、途中で止まるなどの症状を確認できます',
      'chat.history.label': '会話履歴',
      'chat.history.clear': '履歴を削除',
      'chat.history.clearConfirm': 'この車両のチャット履歴をすべて削除しますか？',
      'chat.history.cleared': 'チャット履歴を削除しました',
      'chat.history.deleteOne': 'このメッセージを削除',
      'chat.feedback.prompt': 'この回答は役に立ちましたか？',
      'chat.feedback.forAnswer': 'この回答について',
      'chat.feedback.helpful': '役に立った',
      'chat.feedback.notHelpful': '役に立たなかった',
      'chat.feedback.thanks': 'ご評価ありがとうございます',
      'chat.feedback.selectedHelpful': '役に立ったと評価しました',
      'chat.feedback.selectedNotHelpful': '役に立たなかったと評価しました',
      'settings.clearChatHistory': 'チャット履歴を削除',
      'status.knowledge.title': '知識レベル',
      'status.knowledge.levelLabel': 'レベル: {level}',
      'status.knowledge.hint': 'マニュアル閲覧・チャット・機能の利用でレベルアップします',
      'status.knowledge.nextLevel': '次のレベル（{level}）まで {pct}%',
      'status.level.starter': '入門者',
      'status.level.learner': '学習者',
      'status.level.smart': 'スマートドライバー',
      'status.level.expert': 'エキスパート',
      'status.badges.title': '実績バッジ',
      'status.points.total': '獲得ポイント: {points}pt',
      'status.badge.firstLogin': '初回ログイン',
      'status.badge.firstChat': '初めてのチャット',
      'status.badge.chat10': 'チャット10回',
      'status.badge.manual': 'マニュアル閲覧',
      'status.badge.onboarding': 'ガイド完了',
      'status.badge.warningFlow': '警告灯対処',
      'status.badge.explorer': '機能探索者',
      'status.badge.expert': 'エキスパート',
      'status.feature.title': '機能利用状況',
      'status.feature.coverage': '探索カバレッジ',
      'status.feature.home': 'ホーム',
      'status.feature.chat': 'チャット',
      'status.feature.manual': 'マニュアル',
      'status.feature.notifications': '通知',
      'status.feature.warnings': '警告灯',
      'status.feature.status': 'ステータス',
      'status.feature.onboarding': 'はじめてガイド',
      'status.feature.faq': 'よくある質問',
      'status.feature.settings': '設定',
      'status.feature.feedback': '回答評価',
      'status.feature.chargingGuide': '充電ガイド',
      'status.feature.warningFlow': '警告灯フロー',
      'status.feature.ota': 'ソフト更新',
      'status.feature.dailyTips': '今日のおすすめ',
      'status.maintenance.title': 'メンテナンスプラン',
      'status.maintenance.currentOdometer': '現在の走行距離（km）',
      'status.maintenance.lastServiceOdometer': '前回点検時の走行距離（km）',
      'status.maintenance.lastServiceDate': '前回点検日',
      'status.maintenance.intervalKm': '点検間隔（km）',
      'status.maintenance.intervalMonths': '点検間隔（ヶ月）',
      'status.maintenance.save': '保存して再計算',
      'status.maintenance.untilNext': '次回点検まで',
      'status.maintenance.kmRemaining': 'あと {km}km',
      'status.maintenance.nextDate': '次回点検予定日: {date}',
      'status.maintenance.daysRemaining': '期日まであと {days}日',
      'status.vehicle.title': '車両情報',
      'status.vehicle.model': 'モデル:',
      'status.vehicle.year': '年式:',
      'status.vehicle.maxSpeed': '最高速度:',
      'status.vehicle.range': '航続距離:',
      'status.vehicle.chargeTime': '充電時間:',
      'status.vehicle.chargeTimeValue': '約5時間',
      'warning.ev-system.name': 'EVシステム異常警告灯',
      'warning.ev-system.urgency': '緊急',
      'warning.ev-system.meaning': 'EVシステムの異常',
      'warning.ev-system.action': 'ただちに安全な場所に停車してください。',
      'warning.brake.name': 'ブレーキ警告灯（黄色）',
      'warning.brake.urgency': '注意',
      'warning.brake.meaning': '電子制御ブレーキシステムの異常',
      'warning.brake.action': 'ただちにオートバックスで点検を受けてください。',
      'warning.motor-overheat.name': 'モーター過熱警告灯',
      'warning.motor-overheat.urgency': '注意',
      'warning.motor-overheat.meaning': 'モーター・インバーターの温度上昇を検出',
      'warning.motor-overheat.action': '風通しの良い安全な場所で冷却し、再発時は販売店へご相談ください。',
      'warning.auxiliary-battery.name': '補機バッテリー警告灯',
      'warning.auxiliary-battery.urgency': '注意',
      'warning.auxiliary-battery.meaning': '補機バッテリー電圧が低下',
      'warning.auxiliary-battery.action': '点滅したときは速やかに充電してください。',
      'warning.seatbelt.name': 'シートベルト警告灯',
      'warning.seatbelt.urgency': '注意',
      'warning.seatbelt.meaning': 'シートベルト装着忘れ防止',
      'warning.seatbelt.action': 'シートベルトを着用してください。',
      'warning.turn-signal.name': '方向指示表示灯',
      'warning.turn-signal.urgency': '情報',
      'warning.turn-signal.meaning': '方向指示灯／非常点滅灯作動時に点滅',
      'warning.turn-signal.action': '異常に早い点滅時は電球切れの可能性があります。',
      'warning.charge-indicator.name': '充電表示灯',
      'warning.charge-indicator.urgency': '情報',
      'warning.charge-indicator.meaning': '充電状態を色で表示（赤＝開始、緑点滅＝満充電など）',
      'warning.charge-indicator.action': '詳細は取扱説明書「充電表示灯について」を参照してください。',
      'warning.parking-brake.name': 'パーキングブレーキ表示灯',
      'warning.parking-brake.urgency': 'ステータス',
      'warning.parking-brake.meaning': 'パーキングブレーキレバー操作時に点灯',
      'warning.parking-brake.action': '走行前にブレーキを解除してください。',
      'warning.high-beam.name': '前照灯ハイビーム表示灯',
      'warning.high-beam.urgency': 'ステータス',
      'warning.high-beam.meaning': 'ハイビーム時に青色点灯、ロービームで消灯',
      'warning.high-beam.action': '対向車・先行車に配慮して切り替えてください。',
      'chat.ai.warning.intro': '現在{count}件の警告灯が点灯しています。点灯中のものを上部に表示しています。タップで詳細を確認できます。',
      'chat.ai.warning.openTab': '警告灯一覧を見る',
      'chat.ai.warning.manualRef': '取扱説明書「5. 操作装置（2）表示灯・警告灯の見方」',
      'overlay.lit': '{icon} {name}が点灯しました',
      'overlay.calmCheck': '落ち着いて、警告内容と対処方法を確認しましょう。',
      'overlay.checkContent': '警告内容と対処方法を確認しましょう。',
      'overlay.viewContent': '内容を確認する',
      'overlay.warningContent': '警告内容',
      'overlay.actionLabel': '対処方法',
      'overlay.parkedNext': '停車しました。次へ進む',
      'overlay.dealerShare': '販売店へ状況共有',
      'overlay.dealerShareBody': '以下の内容を販売店へ共有します',
      'overlay.sharedNext': '共有しました。次へ進む',
      'overlay.roadAssist': 'ロードアシスタンス連絡',
      'overlay.roadAssistBody': '必要に応じてロードアシスタンスへご連絡ください',
      'overlay.phone': '電話番号：',
      'overlay.hours': '対応時間：',
      'overlay.roadAssistNote': '状況は販売店へ共有済みです。安全を最優先に行動してください。',
      'overlay.callRoadAssist': 'ロードアシスタンスに連絡',
      'overlay.backHome': 'ホームに戻る',
      'overlay.findDealer': '近くのオートバックスを探す',
      'overlay.findDealerBody': 'オートバックス店舗の一覧です。点検を受ける店舗を選択してください。',
      'overlay.bookService': '入庫予約へ進む',
      'overlay.bookTitle': '入庫予約する',
      'overlay.bookBody': '点検の希望日時を選択してください',
      'overlay.confirmBook': '予約を確定する',
      'overlay.bookDone': '入庫予約が完了しました',
      'overlay.bookDate': '予約日時：',
      'overlay.warningLight': '警告灯：',
      'overlay.bookNote': '当日はこのアプリの予約情報をご提示ください。走行中は安全にご注意ください。',
      'overlay.roadAssistName': 'ロードアシスタンス',
      'overlay.roadAssistHours': '24時間対応',
      'overlay.ev.share.0': '警告灯の種類と点灯状況',
      'overlay.ev.share.1': '停車場所と周辺の安全状況',
      'overlay.ev.share.2': '走行中に気づいた症状',
      'overlay.ev.share.3': 'チャットでの問い合わせ履歴（該当部分）',
      'overlay.ev.summary.0.label': '発生日時',
      'overlay.ev.summary.0.value': '2026年6月8日 14:30',
      'overlay.ev.summary.1.label': '警告灯',
      'overlay.ev.summary.1.value': 'EVシステム異常警告灯',
      'overlay.ev.summary.2.label': '警告内容',
      'overlay.ev.summary.2.value': 'EVシステムの異常',
      'overlay.ev.summary.3.label': '対処状況',
      'overlay.ev.summary.3.value': '安全な場所に停車済み',
      'overlay.ev.summary.4.label': '車両',
      'overlay.ev.summary.4.value': 'Lean3 2026年モデル',
      'overlay.brake.dealer.0.name': 'オートバックス 上野店',
      'overlay.brake.dealer.0.addr': '東京都台東区上野',
      'overlay.brake.dealer.1.name': 'オートバックス 錦糸町店',
      'overlay.brake.dealer.1.addr': '東京都墨田区錦糸',
      'overlay.brake.dealer.2.name': 'オートバックス 江東店',
      'overlay.brake.dealer.2.addr': '東京都江東区',
      'overlay.brake.slot.0': '6月10日（火）10:00〜11:00',
      'overlay.brake.slot.1': '6月10日（火）14:00〜15:00',
      'overlay.brake.slot.2': '6月11日（水）11:00〜12:00',
      'overlay.brake.slot.3': '6月12日（木）15:00〜16:00'
    },
    en: {
      'settings.title': 'Settings',
      'settings.language': 'Language',
      'settings.vehicle': 'Vehicle',
      'settings.year': 'Model year',
      'settings.retryFirstLogin': 'Try first-login flow from start',
      'settings.retryFirstLogin.desc': 'Experience login → vehicle selection → guide → home from the beginning',
      'settings.onboarding': 'Show getting started guide only',
      'settings.resetNotifications': 'Reset notifications',
      'settings.logout': 'Log out',
      'settings.saved': 'Settings saved',
      'vehicle.lean3': 'Lean3',
      'vehicle.lean3.desc': 'Ultra-compact EV',
      'vehicle.yearModel': '{year} Model',
      'nav.home': 'Home',
      'nav.chat': 'Chat',
      'nav.manual': 'Manual',
      'nav.notifications': 'Notifications',
      'nav.warnings': 'Warnings',
      'nav.status': 'Status',
      'home.search': '🔍 Ask about your vehicle...',
      'home.notifications': 'Notifications',
      'home.moreNotifications': 'See more notifications →',
      'home.faq': 'FAQ',
      'warnings.title': '⚠️ Warning lights',
      'warnings.count': '2 warnings active',
      'warnings.countDynamic': '{count} warnings active',
      'warnings.activeSection': 'Active warnings',
      'warnings.allSection': 'All warning lights',
      'warnings.search': 'Search warning lights...',
      'warnings.searchEmpty': 'No matching warning lights',
      'warnings.litBadge': 'On',
      'warnings.meaning': 'Warning: ',
      'warnings.action': 'Action: ',
      'warnings.cta': 'Start troubleshooting →',
      'chat.placeholder': 'Type a message...',
      'chat.send': 'Send',
      'notification.tapHint': 'Tap to view →',
      'homeCard.welcome.title': 'Welcome!',
      'homeCard.welcome.body': 'View getting started guide',
      'homeCard.warningInfo.title': 'Warning Lamps',
      'homeCard.warningInfo.body': 'View all warning lamps',
      'homeCard.daily.title': 'Today\'s picks',
      'homeCard.daily.body': 'Comfort settings & battery tips',
      'homeCard.ota.title': 'Software update',
      'homeCard.ota.body': 'See changes in v2.4.1',
      'homeCard.warning.title': 'Warning lights',
      'homeCard.warning.body': '2 warnings active',
      'notif.ota.title': '📡 Software update complete',
      'notif.ota.content': 'v2.4.1 is installed. Review changes that matter to you.',
      'notif.daily.title': '☀️ Today\'s recommended settings',
      'notif.daily.content': 'Check comfort settings and battery tips for cold days.',
      'notif.warning.title': '⚠️ 2 warning lights are on',
      'notif.warning.content': 'EV system and brake warnings are active. Check notifications for next steps.',
      'notif.charging.title': '🔌 Charging tip',
      'notif.charging.content': 'Ask "How do I charge?" for step-by-step instructions.',
      'notif.welcome.title': '🎉 Welcome to Lean3!',
      'notif.welcome.content': 'Thank you for becoming a Lean3 owner.',
      'faq.activeLean': '🔄 What is the Active Lean System?',
      'faq.charging': '🔌 How do I charge?',
      'faq.chargeTime': '⏱️ How long does charging take?',
      'faq.range': '🚗 What is the driving range?',
      'chat.greeting': 'Hello! I\'m the Lean3 assistant. Feel free to ask any questions about your vehicle.',
      'chat.chip.charging': 'How do I charge?',
      'chat.chip.range': 'Driving range?',
      'chat.question.charging': 'How do I charge?',
      'chat.question.range': 'What is the driving range?',
      'chat.question.chargeTime': 'How long does charging take?',
      'chat.question.activeLean': 'What is the Active Lean System?',
      'chat.response.chargeTime': 'Lean3 charging takes about 5 hours on AC 200V and about 7 hours on AC 100V. Ask "How do I charge?" for step-by-step instructions.',
      'chat.ai.activeLean.tagline': 'Excitement every time you turn.',
      'chat.ai.activeLean.title': 'Active Lean System',
      'chat.ai.activeLean.spec': 'Maximum lean angle',
      'chat.ai.activeLean.specValue': '28°',
      'chat.ai.activeLean.body': 'Active lean technology controls the suspension and steering to optimally manage the vehicle\'s tilt while driving. Despite its compact size, it delivers stable handling and an exhilarating cornering experience when turning or on rough roads.',
      'chat.ai.activeLean.sourceTitle': 'Lean3 | AUTOBACS Official Site',
      'chat.response.generic': 'About "{message}" — please check the manual or ask a more specific question.',
      'chat.ai.source.label': 'Source',
      'chat.ai.charging.intro': 'Based on the Owner\'s Manual "3. Charging — (5) How to Charge", here are the charging steps.',
      'chat.ai.charging.step.0': 'Apply the parking brake and confirm the vehicle cannot move',
      'chat.ai.charging.step.1': 'Set the shift lever to "N (Neutral)"',
      'chat.ai.charging.step.2': 'Turn the key switch to "LOCK" and remove the key',
      'chat.ai.charging.step.3': 'Connect the supplied charging cable firmly into the vehicle charge inlet',
      'chat.ai.charging.step.4': 'Plug the charging cable into a 100V grounded outlet',
      'chat.ai.charging.step.5': 'Confirm charging has started when the charge indicator lights red',
      'chat.ai.charging.step.6': 'When the indicator flashes green, charging is complete. Unplug the cable and confirm the light turns off',
      'chat.ai.charging.step.7': 'Store the charging cable indoors, away from rain and moisture',
      'chat.ai.charging.note.0': 'Do not operate the key switch, horn, or brake pedal while charging',
      'chat.ai.charging.note.1': 'A humming sound during connection is the cooling fan — this is normal',
      'chat.ai.charging.note.2': 'Charging time varies depending on the battery level at the start',
      'chat.ai.charging.manualRef': 'Owner\'s Manual "3. Charging — (5) How to Charge"',
      'chat.ai.range.lead': 'Lean3 has a driving range of about 100 km. Key specifications from the official product page:',
      'chat.ai.range.note': 'Range varies with driving conditions, temperature, A/C use, and other factors.',
      'chat.ai.range.spec.category': 'Category',
      'chat.ai.range.spec.range': 'Driving range',
      'chat.ai.range.spec.speed': 'Max speed',
      'chat.ai.range.spec.weight': 'Vehicle weight',
      'chat.ai.range.value.category': 'Microcar',
      'chat.ai.range.value.range': 'Approx. 100 km',
      'chat.ai.range.value.speed': '60 km/h',
      'chat.ai.range.value.weight': 'Approx. 515 kg',
      'chat.ai.range.sourceTitle': 'Lean3 | AUTOBACS Official Site',
      'chat.charging.intro': 'Here are the charging steps for Lean3.',
      'chat.charging.step.0': 'Apply the parking brake and confirm the vehicle cannot move',
      'chat.charging.step.1': 'Set the shift lever to "N (Neutral)"',
      'chat.charging.step.2': 'Turn the key switch to "LOCK" and remove the key',
      'chat.charging.step.3': 'Connect the supplied charging cable to the vehicle charge inlet',
      'chat.charging.step.4': 'Plug the charging cable into a 100V grounded outlet',
      'chat.charging.step.5': 'Check the charge indicator for start and completion',
      'chat.charging.step.6': 'After charging, unplug and store the cable indoors',
      'chat.charging.note.0': 'Do not operate the key, horn, or brake pedal while charging',
      'chat.charging.note.1': 'AC 100V: ~7 hrs / AC 200V: ~5 hrs',
      'chat.charging.troubleshoot.label': 'Charging not working?',
      'chat.charging.troubleshoot.hint': 'Check symptoms such as the charge lamp not turning on or charging stopping midway.',
      'chat.history.label': 'Chat history',
      'chat.history.clear': 'Clear history',
      'chat.history.clearConfirm': 'Delete all chat history for this vehicle?',
      'chat.history.cleared': 'Chat history cleared',
      'chat.history.deleteOne': 'Delete this message',
      'chat.feedback.prompt': 'Was this answer helpful?',
      'chat.feedback.forAnswer': 'Rate this answer',
      'chat.feedback.helpful': 'Helpful',
      'chat.feedback.notHelpful': 'Not helpful',
      'chat.feedback.thanks': 'Thanks for your feedback',
      'chat.feedback.selectedHelpful': 'Marked as helpful',
      'chat.feedback.selectedNotHelpful': 'Marked as not helpful',
      'settings.clearChatHistory': 'Clear chat history',
      'status.knowledge.title': 'Knowledge level',
      'status.knowledge.levelLabel': 'Level: {level}',
      'status.knowledge.hint': 'Explore manuals, chat, and features to level up',
      'status.knowledge.nextLevel': '{pct}% to next level ({level})',
      'status.level.starter': 'Getting Started',
      'status.level.learner': 'Learner',
      'status.level.smart': 'Smart Driver',
      'status.level.expert': 'Expert',
      'status.badges.title': 'Achievement badges',
      'status.points.total': 'Points earned: {points}pt',
      'status.badge.firstLogin': 'First login',
      'status.badge.firstChat': 'First chat',
      'status.badge.chat10': '10 chats',
      'status.badge.manual': 'Manual viewed',
      'status.badge.onboarding': 'Guide complete',
      'status.badge.warningFlow': 'Warning resolved',
      'status.badge.explorer': 'Feature explorer',
      'status.badge.expert': 'Expert',
      'status.feature.title': 'Feature utilisation',
      'status.feature.coverage': 'Exploration coverage',
      'status.feature.home': 'Home',
      'status.feature.chat': 'Chat',
      'status.feature.manual': 'Manual',
      'status.feature.notifications': 'Notifications',
      'status.feature.warnings': 'Warnings',
      'status.feature.status': 'Status',
      'status.feature.onboarding': 'Getting started guide',
      'status.feature.faq': 'FAQ',
      'status.feature.settings': 'Settings',
      'status.feature.feedback': 'Answer feedback',
      'status.feature.chargingGuide': 'Charging guide',
      'status.feature.warningFlow': 'Warning flow',
      'status.feature.ota': 'Software update',
      'status.feature.dailyTips': 'Daily tips',
      'status.maintenance.title': 'Maintenance plan',
      'status.maintenance.currentOdometer': 'Current odometer (km)',
      'status.maintenance.lastServiceOdometer': 'Odometer at last service (km)',
      'status.maintenance.lastServiceDate': 'Last service date',
      'status.maintenance.intervalKm': 'Service interval (km)',
      'status.maintenance.intervalMonths': 'Service interval (months)',
      'status.maintenance.save': 'Save & recalculate',
      'status.maintenance.untilNext': 'Until next service',
      'status.maintenance.kmRemaining': '{km} km remaining',
      'status.maintenance.nextDate': 'Next service date: {date}',
      'status.maintenance.daysRemaining': '{days} days until due',
      'status.vehicle.title': 'Vehicle info',
      'status.vehicle.model': 'Model:',
      'status.vehicle.year': 'Year:',
      'status.vehicle.maxSpeed': 'Max speed:',
      'status.vehicle.range': 'Range:',
      'status.vehicle.chargeTime': 'Charge time:',
      'status.vehicle.chargeTimeValue': '~5 hours',
      'warning.ev-system.name': 'EV System Malfunction Warning',
      'warning.ev-system.urgency': 'Urgent',
      'warning.ev-system.meaning': 'EV system malfunction',
      'warning.ev-system.action': 'Stop immediately in a safe place.',
      'warning.brake.name': 'Brake Warning Light (Yellow)',
      'warning.brake.urgency': 'Caution',
      'warning.brake.meaning': 'Electronic brake control system malfunction',
      'warning.brake.action': 'Have your vehicle inspected at AUTOBACS immediately.',
      'warning.motor-overheat.name': 'Motor Overheat Warning',
      'warning.motor-overheat.urgency': 'Caution',
      'warning.motor-overheat.meaning': 'Motor/inverter temperature rise detected',
      'warning.motor-overheat.action': 'Cool down in a safe, ventilated place. If it recurs, contact your dealer.',
      'warning.auxiliary-battery.name': 'Auxiliary Battery Warning',
      'warning.auxiliary-battery.urgency': 'Caution',
      'warning.auxiliary-battery.meaning': 'Auxiliary battery voltage is low',
      'warning.auxiliary-battery.action': 'Charge promptly when the light flashes.',
      'warning.seatbelt.name': 'Seat Belt Warning',
      'warning.seatbelt.urgency': 'Caution',
      'warning.seatbelt.meaning': 'Reminder to fasten seat belt',
      'warning.seatbelt.action': 'Please fasten your seat belt.',
      'warning.turn-signal.name': 'Turn Signal Indicator',
      'warning.turn-signal.urgency': 'Info',
      'warning.turn-signal.meaning': 'Flashes when turn signals or hazard lights are on',
      'warning.turn-signal.action': 'Rapid flashing may indicate a burned-out bulb.',
      'warning.charge-indicator.name': 'Charge Indicator',
      'warning.charge-indicator.urgency': 'Info',
      'warning.charge-indicator.meaning': 'Shows charging status by color (red=start, green flash=full, etc.)',
      'warning.charge-indicator.action': 'See the manual section on charge indicators.',
      'warning.parking-brake.name': 'Parking Brake Indicator',
      'warning.parking-brake.urgency': 'Status',
      'warning.parking-brake.meaning': 'Lights when parking brake lever is applied',
      'warning.parking-brake.action': 'Release the brake before driving.',
      'warning.high-beam.name': 'High Beam Indicator',
      'warning.high-beam.urgency': 'Status',
      'warning.high-beam.meaning': 'Blue when high beam is on; off on low beam',
      'warning.high-beam.action': 'Switch appropriately for oncoming traffic.',
      'chat.ai.warning.intro': '{count} warning light(s) are currently on. Active ones are shown at the top. Tap for details.',
      'chat.ai.warning.openTab': 'View warning lights',
      'chat.ai.warning.manualRef': 'Owner\'s Manual "5. Controls (2) Indicators & Warning Lights"',
      'overlay.lit': '{icon} {name} is on',
      'overlay.calmCheck': 'Stay calm and review the warning and what to do next.',
      'overlay.checkContent': 'Review the warning and recommended action.',
      'overlay.viewContent': 'View details',
      'overlay.warningContent': 'Warning',
      'overlay.actionLabel': 'Action',
      'overlay.parkedNext': 'I\'ve stopped. Continue',
      'overlay.dealerShare': 'Share status with dealer',
      'overlay.dealerShareBody': 'The following will be shared with your dealer',
      'overlay.sharedNext': 'Shared. Continue',
      'overlay.roadAssist': 'Contact road assistance',
      'overlay.roadAssistBody': 'Contact road assistance if needed',
      'overlay.phone': 'Phone: ',
      'overlay.hours': 'Hours: ',
      'overlay.roadAssistNote': 'Status has been shared with your dealer. Prioritize your safety.',
      'overlay.callRoadAssist': 'Call road assistance',
      'overlay.backHome': 'Back to home',
      'overlay.findDealer': 'Find nearby AUTOBACS stores',
      'overlay.findDealerBody': 'AUTOBACS stores near you. Select where to have your vehicle inspected.',
      'overlay.bookService': 'Book service appointment',
      'overlay.bookTitle': 'Book service',
      'overlay.bookBody': 'Select your preferred date and time',
      'overlay.confirmBook': 'Confirm booking',
      'overlay.bookDone': 'Booking complete',
      'overlay.bookDate': 'Appointment: ',
      'overlay.warningLight': 'Warning light: ',
      'overlay.bookNote': 'Show this booking in the app on the day of your visit. Drive safely.',
      'overlay.roadAssistName': 'Road Assistance',
      'overlay.roadAssistHours': '24/7',
      'overlay.ev.share.0': 'Warning light type and status',
      'overlay.ev.share.1': 'Parking location and surrounding safety',
      'overlay.ev.share.2': 'Symptoms noticed while driving',
      'overlay.ev.share.3': 'Relevant chat inquiry history',
      'overlay.ev.summary.0.label': 'Occurred',
      'overlay.ev.summary.0.value': 'Jun 8, 2026 14:30',
      'overlay.ev.summary.1.label': 'Warning light',
      'overlay.ev.summary.1.value': 'EV System Malfunction Warning',
      'overlay.ev.summary.2.label': 'Warning',
      'overlay.ev.summary.2.value': 'EV system malfunction',
      'overlay.ev.summary.3.label': 'Action taken',
      'overlay.ev.summary.3.value': 'Stopped in a safe place',
      'overlay.ev.summary.4.label': 'Vehicle',
      'overlay.ev.summary.4.value': 'Lean3 2026 Model',
      'overlay.brake.dealer.0.name': 'AUTOBACS Ueno',
      'overlay.brake.dealer.0.addr': 'Ueno, Taito-ku, Tokyo',
      'overlay.brake.dealer.1.name': 'AUTOBACS Kinshicho',
      'overlay.brake.dealer.1.addr': 'Kinshicho, Sumida-ku, Tokyo',
      'overlay.brake.dealer.2.name': 'AUTOBACS Koto',
      'overlay.brake.dealer.2.addr': 'Koto-ku, Tokyo',
      'overlay.brake.slot.0': 'Tue Jun 10 10:00–11:00',
      'overlay.brake.slot.1': 'Tue Jun 10 14:00–15:00',
      'overlay.brake.slot.2': 'Wed Jun 11 11:00–12:00',
      'overlay.brake.slot.3': 'Thu Jun 12 15:00–16:00'
    }
  };

  const NOTIFICATION_I18N_KEYS = {
    'ota-update': { title: 'notif.ota.title', content: 'notif.ota.content' },
    'daily-tips': { title: 'notif.daily.title', content: 'notif.daily.content' },
    'warning-active': { title: 'notif.warning.title', content: 'notif.warning.content' },
    'charging-tip': { title: 'notif.charging.title', content: 'notif.charging.content' },
    'welcome': { title: 'notif.welcome.title', content: 'notif.welcome.content' }
  };

  function getLanguage() {
    return localStorage.getItem(STORAGE_KEY_LANG) || 'ja';
  }

  function setLanguage(lang) {
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    document.documentElement.lang = lang;
    applyStaticI18n();
    refreshDynamicContent();
  }

  function getVehicle() {
    const raw = localStorage.getItem(STORAGE_KEY_VEHICLE);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* ignore */ }
    }
    return { model: 'lean3', year: '2026' };
  }

  function setVehicle(model, year) {
    const data = { model, year };
    localStorage.setItem(STORAGE_KEY_VEHICLE, JSON.stringify(data));
    updateVehicleHeader(data);
    renderSettingsPanel();
    if (global.ChatUI && ChatUI.onVehicleChanged) {
      ChatUI.onVehicleChanged();
    }
    if (global.UserProgress && UserProgress.renderStatusTab) {
      UserProgress.renderStatusTab();
    }
  }

  function t(key, vars) {
    const lang = getLanguage();
    let text = (I18N[lang] && I18N[lang][key]) || (I18N.ja[key]) || key;
    if (vars) {
      Object.keys(vars).forEach(k => {
        text = text.replace(`{${k}}`, vars[k]);
      });
    }
    return text;
  }

  function updateVehicleHeader(vehicle) {
    const el = document.getElementById('vehicleInfo');
    const title = document.querySelector('.header-left h1');
    if (el) {
      el.textContent = t('vehicle.yearModel', { year: vehicle.year });
    }
    if (title) {
      title.textContent = t('vehicle.' + vehicle.model) || 'Lean3';
    }
  }

  function applyStaticI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr');
      const text = t(key);
      if (attr) {
        el.setAttribute(attr, text);
      } else {
        el.textContent = text;
      }
    });
  }

  function getChargingContent() {
    return {
      question: t('chat.question.charging'),
      intro: t('chat.charging.intro'),
      steps: [0, 1, 2, 3, 4, 5, 6].map(i => t(`chat.charging.step.${i}`)),
      notes: [0, 1].map(i => t(`chat.charging.note.${i}`)),
      troubleshoot: {
        label: t('chat.charging.troubleshoot.label'),
        hint: t('chat.charging.troubleshoot.hint')
      }
    };
  }

  function getFaqQuestion(topic) {
    const keys = {
      activeLean: 'chat.question.activeLean',
      charge: 'chat.question.chargeTime',
      range: 'chat.question.range'
    };
    return keys[topic] ? t(keys[topic]) : '';
  }

  function getLocalizedWarning(caseId) {
    return {
      name: t(`warning.${caseId}.name`),
      urgency: t(`warning.${caseId}.urgency`),
      meaning: t(`warning.${caseId}.meaning`),
      action: t(`warning.${caseId}.action`)
    };
  }

  function renderChatUI() {
    const greeting = document.getElementById('chatGreetingText');
    const chips = document.getElementById('chatQuickChips');
    if (greeting) greeting.textContent = t('chat.greeting');
    if (global.ChatUI && ChatUI.renderWelcomeFeedback) {
      ChatUI.renderWelcomeFeedback();
    }
    if (chips) {
      chips.innerHTML = `
        <button class="chat-quick-chip" onclick="sendDemoChargingQuestion()">${t('chat.chip.charging')}</button>
        <button class="chat-quick-chip" onclick="askChat(AppSettings.t('chat.question.range'))">${t('chat.chip.range')}</button>
      `;
    }
  }

  function refreshDynamicContent() {
    renderChatUI();
    if (global.ChatUI && ChatUI.onLanguageChanged) {
      ChatUI.onLanguageChanged();
    }
    if (global.ContextExperience) {
      if (ContextExperience.renderHomeNotifications) ContextExperience.renderHomeNotifications();
      if (ContextExperience.renderNotifications) ContextExperience.renderNotifications();
      if (ContextExperience.renderWarningTab) ContextExperience.renderWarningTab();
      if (ContextExperience.refreshOpenOverlay) ContextExperience.refreshOpenOverlay();
    }
    if (global.UserProgress && UserProgress.renderStatusTab) {
      UserProgress.renderStatusTab();
    }
    renderSettingsPanel();
  }

  function renderLanguageOptions() {
    const container = document.getElementById('languageOptions');
    if (!container) return;
    const current = getLanguage();
    container.innerHTML = LANGUAGES.map(lang => `
      <button class="settings-chip ${lang.id === current ? 'selected' : ''}"
              onclick="AppSettings.setLanguage('${lang.id}')">${lang.label}</button>
    `).join('');
  }

  function renderVehicleOptions() {
    const container = document.getElementById('vehicleOptions');
    if (!container) return;
    const current = getVehicle();

    container.innerHTML = VEHICLES.map(v => {
      const yearsHtml = v.years.map(year => `
        <button class="settings-year-chip ${current.model === v.id && current.year === year ? 'selected' : ''}"
                onclick="AppSettings.setVehicle('${v.id}', '${year}')">${year}</button>
      `).join('');

      return `
        <div class="settings-vehicle-card ${current.model === v.id ? 'selected' : ''}">
          <div class="settings-vehicle-info">
            <span class="settings-vehicle-icon">🚗</span>
            <div>
              <strong>${t('vehicle.' + v.id)}</strong>
              <p>${t('vehicle.' + v.id + '.desc')}</p>
            </div>
          </div>
          <div class="settings-year-row">
            <span class="settings-year-label">${t('settings.year')}</span>
            <div class="settings-year-chips">${yearsHtml}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderSettingsPanel() {
    renderLanguageOptions();
    renderVehicleOptions();
    document.querySelectorAll('#settingsOverlay [data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr');
      const text = t(key);
      if (attr) {
        el.setAttribute(attr, text);
      } else {
        el.textContent = text;
      }
    });
  }

  function openSettings() {
    if (global.UserProgress && UserProgress.trackFeature) {
      UserProgress.trackFeature('settings');
    }
    const overlay = document.getElementById('settingsOverlay');
    if (!overlay) return;
    renderSettingsPanel();
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeSettings() {
    const overlay = document.getElementById('settingsOverlay');
    if (overlay) {
      overlay.hidden = true;
      document.body.style.overflow = '';
    }
  }

  function resetOnboarding() {
    closeSettings();
    if (global.OnboardingStatus) {
      OnboardingStatus.resetOnboardingStatus();
      window.location.href = 'onboarding.html';
    }
  }

  function resetNotifications() {
    if (global.ContextExperience && ContextExperience.resetHeroProgress) {
      ContextExperience.resetHeroProgress();
    }
    alert(t('settings.resetNotifications') + ' ✓');
  }

  function clearChatHistory() {
    if (!global.ChatHistory) return;
    if (!confirm(t('chat.history.clearConfirm'))) return;
    ChatHistory.clearHistory();
    if (global.ChatUI && ChatUI.reloadFromStorage) {
      ChatUI.reloadFromStorage();
    }
    alert(t('chat.history.cleared'));
  }

  function retryFirstLoginFlow() {
    closeSettings();
    if (global.OnboardingStatus && OnboardingStatus.resetFirstLoginFlow) {
      OnboardingStatus.resetFirstLoginFlow();
    } else {
      window.location.href = 'index.html';
    }
  }

  function logout() {
    if (confirm(t('settings.logout') + '?')) {
      if (global.OnboardingStatus) OnboardingStatus.resetOnboardingStatus();
      localStorage.removeItem('lean3User');
      localStorage.removeItem(STORAGE_KEY_VEHICLE);
      window.location.href = 'index.html';
    }
  }

  function init() {
    document.documentElement.lang = getLanguage();
    updateVehicleHeader(getVehicle());
    applyStaticI18n();
    renderChatUI();
  }

  global.AppSettings = {
    init,
    t,
    getLanguage,
    setLanguage,
    getVehicle,
    setVehicle,
    getChargingContent,
    getFaqQuestion,
    getLocalizedWarning,
    renderChatUI,
    openSettings,
    closeSettings,
    retryFirstLoginFlow,
    resetOnboarding,
    resetNotifications,
    clearChatHistory,
    logout,
    NOTIFICATION_I18N_KEYS,
    applyStaticI18n,
    refreshDynamicContent
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
