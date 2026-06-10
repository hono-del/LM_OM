/**
 * シーン別体験の実行ロジック
 * UI上にデモ選択を置かず、通知・警告灯タブ・チャットから自然に起動
 */
(function (global) {
  const STORAGE_KEY_WARNING = 'capp_warning_state';
  const STORAGE_KEY_READ = 'capp_notification_read';
  const STORAGE_KEY_HERO = 'capp_hero_completed';

  function getWarningCase(id) {
    return WARNING_CASES.find(c => c.id === id);
  }

  function saveWarningState(state) {
    sessionStorage.setItem(STORAGE_KEY_WARNING, JSON.stringify(state));
  }

  function getWarningState() {
    const raw = sessionStorage.getItem(STORAGE_KEY_WARNING);
    return raw ? JSON.parse(raw) : null;
  }

  function getReadIds() {
    const raw = sessionStorage.getItem(STORAGE_KEY_READ);
    return raw ? JSON.parse(raw) : [];
  }

  function markNotificationRead(id) {
    const read = getReadIds();
    if (!read.includes(id)) {
      read.push(id);
      sessionStorage.setItem(STORAGE_KEY_READ, JSON.stringify(read));
    }
    updateNavBadge();
    renderHomeNotifications();
  }

  function getHeroCompleted() {
    const raw = localStorage.getItem(STORAGE_KEY_HERO);
    return raw ? JSON.parse(raw) : [];
  }

  function isHomeCardRead(card) {
    if (getHeroCompleted().includes(card.id)) return true;
    if (card.notificationId) {
      const n = CONTEXT_NOTIFICATIONS.find(item => item.id === card.notificationId);
      return n ? isNotificationRead(n) : false;
    }
    return false;
  }

  function completeHomeCard(id) {
    const completed = getHeroCompleted();
    if (!completed.includes(id)) {
      completed.push(id);
      localStorage.setItem(STORAGE_KEY_HERO, JSON.stringify(completed));
    }
    const card = HOME_NOTIFICATION_CARDS.find(c => c.id === id);
    if (card?.notificationId) markNotificationRead(card.notificationId);
    renderHomeNotifications();
    renderNotifications();
  }

  function resetHeroProgress() {
    localStorage.removeItem(STORAGE_KEY_HERO);
    sessionStorage.removeItem(STORAGE_KEY_READ);
    clearActiveCards();
    renderHomeNotifications();
    renderNotifications();
  }

  function translate(key, vars) {
    return global.AppSettings ? AppSettings.t(key, vars) : key;
  }

  function getNotificationText(n, field) {
    const keys = global.AppSettings && AppSettings.NOTIFICATION_I18N_KEYS[n.id];
    if (keys && keys[field]) return translate(keys[field]);
    return n[field === 'title' ? 'title' : 'content'];
  }

  function renderHomeNotifications() {
    const container = document.getElementById('homeNotificationSection');
    if (!container) return;

    const cardsHtml = HOME_NOTIFICATION_CARDS.map(card => {
      const read = isHomeCardRead(card);
      return `
        <div class="home-notification-card home-card-${card.theme} ${read ? 'read' : ''}"
             onclick="ContextExperience.handleHomeCardTap('${card.id}')">
          ${!read ? '<span class="home-card-badge"></span>' : ''}
          <span class="home-card-icon">${card.icon}</span>
          <h4>${translate(card.titleKey)}</h4>
          <p>${translate(card.shortBodyKey)}</p>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="home-notifications-header">
        <h3>${translate('home.notifications')}</h3>
      </div>
      <div class="home-notifications-grid">${cardsHtml}</div>
      <button class="home-notifications-more" onclick="switchTab('notifications')">${translate('home.moreNotifications')}</button>
    `;
  }

  function handleHomeCardTap(cardId) {
    const card = HOME_NOTIFICATION_CARDS.find(c => c.id === cardId);
    if (!card) return;

    if (card.action === 'onboarding') {
      completeHomeCard(cardId);
      runOnboardingExperience();
      return;
    }
    if (card.action === 'daily') {
      runDailyExperience(cardId);
      return;
    }
    if (card.action === 'ota') {
      runOtaExperience(cardId);
      return;
    }
    if (card.action === 'warnings') {
      completeHomeCard(cardId);
      openWarningsTab();
    }
  }

  function completeMomentAndClear(momentId) {
    completeHomeCard(momentId);
    clearActiveCards();
  }

  function isNotificationRead(n) {
    return getReadIds().includes(n.id) || !n.unread;
  }

  function clearActiveCards() {
    const el = document.getElementById('homeContextCards');
    if (el) el.innerHTML = '';
  }

  function showActiveCards(html) {
    const el = document.getElementById('homeContextCards');
    if (el) {
      el.innerHTML = html;
      if (typeof switchTab === 'function') switchTab('home');
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function updateNavBadge() {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    const unreadCount = CONTEXT_NOTIFICATIONS.filter(n => n.action && !isNotificationRead(n)).length;
    badge.hidden = unreadCount === 0;
    badge.textContent = unreadCount > 9 ? '9+' : String(unreadCount);
  }

  function renderNotifications() {
    const container = document.getElementById('notificationList');
    if (!container) return;

    container.innerHTML = CONTEXT_NOTIFICATIONS.map(n => {
      const read = isNotificationRead(n);
      const clickable = !!n.action;
      return `
        <div class="notification-item ${read ? 'read' : 'unread'} ${clickable ? 'actionable' : ''}"
             style="border-left-color: ${n.borderColor}"
             ${clickable ? `onclick="ContextExperience.handleNotification('${n.id}')"` : ''}>
          <div class="notification-header">
            <div class="notification-title">${getNotificationText(n, 'title')}</div>
            <div class="notification-time">${n.time}</div>
          </div>
          <div class="notification-content">${getNotificationText(n, 'content')}</div>
          ${clickable && !read ? `<div class="notification-action-hint">${translate('notification.tapHint')}</div>` : ''}
        </div>
      `;
    }).join('');

    updateNavBadge();
  }

  function localizedWarning(c) {
    if (global.AppSettings && AppSettings.getLocalizedWarning) {
      const loc = AppSettings.getLocalizedWarning(c.id);
      return { ...c, ...loc };
    }
    return c;
  }

  function renderWarningTab() {
    if (global.WarningLamps && WarningLamps.renderTab) {
      WarningLamps.renderTab();
      return;
    }
    const container = document.getElementById('warningCaseList');
    if (!container) return;
    container.innerHTML = WARNING_CASES.map(c => {
      const lc = localizedWarning(c);
      return `
      <div class="warning-case-card ${c.badgeClass}" onclick="ContextExperience.startWarningCase('${c.id}')">
        <div class="warning-case-header">
          <span class="warning-case-icon">${c.icon}</span>
          <div>
            <div class="warning-case-urgency overlay-warning-badge ${c.badgeClass}">${lc.urgency}</div>
            <h3>${lc.name}</h3>
          </div>
        </div>
        <p class="warning-case-meaning"><strong>${translate('warnings.meaning')}</strong>${lc.meaning}</p>
        <p class="warning-case-action"><strong>${translate('warnings.action')}</strong>${lc.action}</p>
        <div class="warning-case-cta">${translate('warnings.cta')}</div>
      </div>
    `;
    }).join('');
  }

  function refreshOpenOverlay() {
    const overlay = document.getElementById('demoOverlay');
    if (!overlay || overlay.hidden) return;
    const caseId = overlay.dataset.caseId;
    const step = parseInt(overlay.dataset.step, 10);
    if (caseId && !isNaN(step)) {
      document.getElementById('demoOverlayContent').innerHTML = renderOverlayStep(caseId, step);
    }
  }

  function handleNotification(id) {
    const notification = CONTEXT_NOTIFICATIONS.find(n => n.id === id);
    if (!notification || !notification.action) return;

    markNotificationRead(id);
    renderNotifications();
    if (global.UserProgress) UserProgress.trackFeature('notifications');

    const actions = {
      ota: runOtaExperience,
      daily: runDailyExperience,
      warnings: openWarningsTab,
      charging: runChargingExperience
    };
    if (actions[notification.action]) {
      if (notification.action === 'ota' && global.UserProgress) UserProgress.trackFeature('ota');
      if (notification.action === 'daily' && global.UserProgress) UserProgress.trackFeature('daily_tips');
      actions[notification.action]();
    }
  }

  function openWarningsTab() {
    if (global.UserProgress) UserProgress.trackFeature('warnings');
    if (typeof switchTab === 'function') switchTab('warnings');
  }

  function runOnboardingExperience() {
    if (global.OnboardingStatus) {
      global.OnboardingStatus.resetOnboardingStatus();
      window.location.href = 'onboarding.html';
    }
  }

  function runChargingExperience() {
    if (typeof sendDemoChargingQuestion === 'function') {
      sendDemoChargingQuestion();
    }
  }

  function runOtaExperience(momentId) {
    if (typeof switchTab === 'function') switchTab('home');
    clearActiveCards();
    const ota = DEMO_OTA;
    const completeId = momentId || 'ota-update';
    const changesHtml = ota.changes.map(c => `
      <div class="demo-ota-change">
        <h4>${c.title}</h4>
        <p><strong>あなたへの影響：</strong>${c.impact}</p>
        <p class="demo-ota-op">${c.operationChange}</p>
      </div>
    `).join('');

    showActiveCards(`
      <div class="demo-active-card demo-ota-card">
        <div class="demo-active-header">
          <span>📡</span>
          <div>
            <h3>${ota.title}</h3>
            <p>${ota.version} · ${ota.date}</p>
          </div>
        </div>
        <p class="demo-active-lead">あなたに関係ある変更点</p>
        ${changesHtml}
        <button class="demo-active-btn" onclick="ContextExperience.completeMomentAndClear('${completeId}')">確認しました</button>
      </div>
    `);
  }

  function runDailyExperience(momentId) {
    if (typeof switchTab === 'function') switchTab('home');
    clearActiveCards();
    const completeId = momentId || 'daily-tips';
    const cardsHtml = DEMO_DAILY.cards.map(c => `
      <div class="demo-daily-card">
        <div class="demo-daily-icon">${c.icon}</div>
        <h4>${c.title}</h4>
        <p>${c.body}</p>
        <div class="demo-daily-actions">
          <button class="demo-active-btn" onclick="alert('「${c.title}」の詳細を表示します（モック）')">${c.primaryAction}</button>
          <button class="demo-active-btn-secondary" onclick="this.closest('.demo-daily-card').style.display='none'">${c.secondaryAction}</button>
        </div>
      </div>
    `).join('');

    const el = document.getElementById('homeContextCards');
    if (el) {
      el.innerHTML = `
        <div class="demo-active-section">
          <h3 class="demo-active-section-title">☀️ 今日のおすすめ</h3>
          ${cardsHtml}
          <button class="demo-active-btn" onclick="ContextExperience.completeMomentAndClear('${completeId}')">確認しました</button>
        </div>
      `;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function startWarningCase(caseId) {
    if (global.UserProgress) UserProgress.trackFeature('warning_flow');
    saveWarningState({ caseId, startedAt: new Date().toISOString() });
    openDemoOverlay(caseId, 0);
  }

  function openDemoOverlay(caseId, step) {
    const overlay = document.getElementById('demoOverlay');
    const content = document.getElementById('demoOverlayContent');
    if (!overlay || !content) return;

    overlay.dataset.caseId = caseId;
    overlay.dataset.step = String(step);
    content.innerHTML = renderOverlayStep(caseId, step);
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeDemoOverlay() {
    const overlay = document.getElementById('demoOverlay');
    if (overlay) {
      overlay.hidden = true;
      document.body.style.overflow = '';
    }
  }

  function getMaxSteps(caseId) {
    return caseId === 'ev-system' ? 4 : 4;
  }

  function nextOverlayStep() {
    const overlay = document.getElementById('demoOverlay');
    if (!overlay) return;

    const caseId = overlay.dataset.caseId;
    const currentStep = parseInt(overlay.dataset.step, 10);
    const step = currentStep + 1;

    if (caseId === 'brake' && currentStep === 2) {
      const selected = document.querySelector('input[name="nearbyDealer"]:checked');
      if (selected) overlay.dataset.dealerId = selected.value;
    }

    if (step >= getMaxSteps(caseId)) return;

    overlay.dataset.step = String(step);
    document.getElementById('demoOverlayContent').innerHTML = renderOverlayStep(caseId, step);
  }

  function renderOverlayStep(caseId, step) {
    if (caseId === 'ev-system') return renderEvSystemStep(step);
    if (caseId === 'brake') return renderBrakeStep(step);
    return '';
  }

  // ケース①：EVシステム異常警告灯
  function renderEvSystemStep(step) {
    const c = localizedWarning(getWarningCase('ev-system'));

    if (step === 0) {
      return `
        <div class="overlay-step">
          <div class="overlay-warning-badge red">${c.urgency}</div>
          <h2>${translate('overlay.lit', { icon: c.icon, name: c.name })}</h2>
          <p class="overlay-body">${translate('overlay.calmCheck')}</p>
          <button class="demo-active-btn" onclick="ContextExperience.nextOverlayStep()">${translate('overlay.viewContent')}</button>
        </div>`;
    }

    if (step === 1) {
      return `
        <div class="overlay-step">
          <h2>${translate('overlay.warningContent')} / ${translate('overlay.actionLabel')}</h2>
          <div class="overlay-info-card">
            <h3>${translate('overlay.warningContent')}</h3>
            <p>${c.meaning}</p>
          </div>
          <div class="overlay-judgment ng">
            <div class="overlay-judgment-label">${translate('overlay.actionLabel')}</div>
            <p>${c.action}</p>
          </div>
          <button class="demo-active-btn" onclick="ContextExperience.nextOverlayStep()">${translate('overlay.parkedNext')}</button>
        </div>`;
    }

    if (step === 2) {
      const summaryHtml = [0, 1, 2, 3, 4].map(i => `
        <div class="overlay-summary-row">
          <span class="overlay-summary-label">${translate(`overlay.ev.summary.${i}.label`)}</span>
          <span class="overlay-summary-value">${translate(`overlay.ev.summary.${i}.value`)}</span>
        </div>
      `).join('');
      const shareHtml = [0, 1, 2, 3].map(i => `
        <div class="overlay-share-item">✓ ${translate(`overlay.ev.share.${i}`)}</div>
      `).join('');

      return `
        <div class="overlay-step">
          <h2>${translate('overlay.dealerShare')}</h2>
          <p class="overlay-body">${translate('overlay.dealerShareBody')}</p>
          <div class="overlay-summary-card">${summaryHtml}</div>
          <div class="overlay-share-list">${shareHtml}</div>
          <button class="demo-active-btn" onclick="ContextExperience.nextOverlayStep()">${translate('overlay.sharedNext')}</button>
        </div>`;
    }

    if (step === 3) {
      const ra = getWarningCase('ev-system').roadAssistance;
      return `
        <div class="overlay-step overlay-complete">
          <h2>${translate('overlay.roadAssist')}</h2>
          <p class="overlay-body">${translate('overlay.roadAssistBody')}</p>
          <div class="overlay-info-card">
            <h3>${translate('overlay.roadAssistName')}</h3>
            <p><strong>${translate('overlay.phone')}</strong>${ra.phone}</p>
            <p><strong>${translate('overlay.hours')}</strong>${translate('overlay.roadAssistHours')}</p>
          </div>
          <p class="overlay-note">${translate('overlay.roadAssistNote')}</p>
          <button class="demo-active-btn" onclick="alert('${ra.phone}')">${translate('overlay.callRoadAssist')}</button>
          <button class="demo-active-btn-secondary" onclick="ContextExperience.closeOverlay()">${translate('overlay.backHome')}</button>
        </div>`;
    }

    return '';
  }

  // ケース②：ブレーキ警告灯（黄色）
  function renderBrakeStep(step) {
    const c = localizedWarning(getWarningCase('brake'));
    const raw = getWarningCase('brake');

    if (step === 0) {
      return `
        <div class="overlay-step">
          <div class="overlay-warning-badge amber">${c.urgency}</div>
          <h2>${translate('overlay.lit', { icon: c.icon, name: c.name })}</h2>
          <p class="overlay-body">${translate('overlay.checkContent')}</p>
          <button class="demo-active-btn" onclick="ContextExperience.nextOverlayStep()">${translate('overlay.viewContent')}</button>
        </div>`;
    }

    if (step === 1) {
      return `
        <div class="overlay-step">
          <h2>${translate('overlay.warningContent')} / ${translate('overlay.actionLabel')}</h2>
          <div class="overlay-info-card">
            <h3>${translate('overlay.warningContent')}</h3>
            <p>${c.meaning}</p>
          </div>
          <div class="overlay-judgment ng">
            <div class="overlay-judgment-label">${translate('overlay.actionLabel')}</div>
            <p>${c.action}</p>
          </div>
          <button class="demo-active-btn" onclick="ContextExperience.nextOverlayStep()">${translate('overlay.findDealer')}</button>
        </div>`;
    }

    if (step === 2) {
      const dealersHtml = raw.nearbyDealers.map((d, i) => `
        <label class="overlay-slot-item">
          <input type="radio" name="nearbyDealer" value="${d.id}" ${i === 0 ? 'checked' : ''}>
          <span>
            <strong>${translate(`overlay.brake.dealer.${i}.name`)}</strong><br>
            <small>${d.distance} · ${translate(`overlay.brake.dealer.${i}.addr`)}</small>
          </span>
        </label>
      `).join('');

      return `
        <div class="overlay-step">
          <h2>${translate('overlay.findDealer')}</h2>
          <p class="overlay-body">${translate('overlay.findDealerBody')}</p>
          <div class="overlay-slots">${dealersHtml}</div>
          <button class="demo-active-btn" onclick="ContextExperience.nextOverlayStep()">${translate('overlay.bookService')}</button>
        </div>`;
    }

    if (step === 3) {
      const slotsHtml = raw.timeSlots.map((s, i) => `
        <label class="overlay-slot-item">
          <input type="radio" name="brakeSlot" value="${s.id}" ${i === 0 ? 'checked' : ''}>
          <span>${translate(`overlay.brake.slot.${i}`)}</span>
        </label>
      `).join('');

      return `
        <div class="overlay-step">
          <h2>${translate('overlay.bookTitle')}</h2>
          <p class="overlay-body">${translate('overlay.bookBody')}</p>
          <div class="overlay-slots">${slotsHtml}</div>
          <button class="demo-active-btn" onclick="ContextExperience.completeBrakeBooking()">${translate('overlay.confirmBook')}</button>
        </div>`;
    }

    return '';
  }

  function completeBrakeBooking() {
    const c = localizedWarning(getWarningCase('brake'));
    const raw = getWarningCase('brake');
    const overlay = document.getElementById('demoOverlay');
    const selectedSlot = document.querySelector('input[name="brakeSlot"]:checked');
    const dealerIdx = raw.nearbyDealers.findIndex(d => d.id === overlay?.dataset.dealerId);
    const idx = dealerIdx >= 0 ? dealerIdx : 0;
    const slotIdx = selectedSlot
      ? raw.timeSlots.findIndex(s => s.id === selectedSlot.value)
      : 0;
    const slotLabel = translate(`overlay.brake.slot.${slotIdx >= 0 ? slotIdx : 0}`);

    document.getElementById('demoOverlayContent').innerHTML = `
      <div class="overlay-step overlay-complete">
        <div class="overlay-complete-icon">✅</div>
        <h2>${translate('overlay.bookDone')}</h2>
        <p class="overlay-body">${translate(`overlay.brake.dealer.${idx}.name`)}</p>
        <div class="overlay-info-card">
          <p><strong>${translate('overlay.bookDate')}</strong>${slotLabel}</p>
          <p><strong>${translate('overlay.warningLight')}</strong>${c.name}</p>
          <p><strong>${translate('overlay.warningContent')}: </strong>${c.meaning}</p>
        </div>
        <p class="overlay-note">${translate('overlay.bookNote')}</p>
        <button class="demo-active-btn" onclick="ContextExperience.closeOverlay()">${translate('overlay.backHome')}</button>
      </div>`;
  }

  function init() {
    renderHomeNotifications();
    renderNotifications();
    renderWarningTab();
  }

  global.ContextExperience = {
    init,
    renderHomeNotifications,
    renderNotifications,
    renderWarningTab,
    refreshOpenOverlay,
    renderOverlayStep,
    handleNotification,
    handleHomeCardTap,
    completeMomentAndClear,
    resetHeroProgress,
    openWarningsTab,
    startWarningCase,
    runOnboarding: runOnboardingExperience,
    runCharging: runChargingExperience,
    runOta: runOtaExperience,
    runDaily: runDailyExperience,
    runTrouble: openWarningsTab,
    clearCards: clearActiveCards,
    nextOverlayStep,
    closeOverlay: closeDemoOverlay,
    completeBrakeBooking
  };

  global.DemoRunner = {
    run: function (id) {
      const map = {
        demo1: runOnboardingExperience,
        demo2: runChargingExperience,
        demo3: runOtaExperience,
        demo4: runDailyExperience,
        demo5: openWarningsTab,
        demo6: function () { startWarningCase('ev-system'); }
      };
      if (map[id]) map[id]();
    },
    closeOverlay: closeDemoOverlay
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
