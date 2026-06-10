/**
 * ユーザー進捗・ゲーミフィケーション（9.1 / 9.2 / 9.5 / 9.6）
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'capp_user_progress';

  const LEVELS = [
    { id: 'starter', min: 0, labelKey: 'status.level.starter' },
    { id: 'learner', min: 25, labelKey: 'status.level.learner' },
    { id: 'smart', min: 50, labelKey: 'status.level.smart' },
    { id: 'expert', min: 75, labelKey: 'status.level.expert' }
  ];

  const FEATURES = [
    { id: 'home', labelKey: 'status.feature.home', points: 5 },
    { id: 'chat', labelKey: 'status.feature.chat', points: 10 },
    { id: 'manual', labelKey: 'status.feature.manual', points: 10 },
    { id: 'notifications', labelKey: 'status.feature.notifications', points: 5 },
    { id: 'warnings', labelKey: 'status.feature.warnings', points: 10 },
    { id: 'status', labelKey: 'status.feature.status', points: 5 },
    { id: 'onboarding', labelKey: 'status.feature.onboarding', points: 15 },
    { id: 'faq', labelKey: 'status.feature.faq', points: 5 },
    { id: 'settings', labelKey: 'status.feature.settings', points: 5 },
    { id: 'feedback', labelKey: 'status.feature.feedback', points: 5 },
    { id: 'charging_guide', labelKey: 'status.feature.chargingGuide', points: 10 },
    { id: 'warning_flow', labelKey: 'status.feature.warningFlow', points: 15 },
    { id: 'ota', labelKey: 'status.feature.ota', points: 5 },
    { id: 'daily_tips', labelKey: 'status.feature.dailyTips', points: 5 }
  ];

  const BADGES = [
    { id: 'first_login', icon: '🎓', labelKey: 'status.badge.firstLogin',
      test: s => !!s.firstLoginAt },
    { id: 'first_chat', icon: '💬', labelKey: 'status.badge.firstChat',
      test: s => s.chatCount >= 1 },
    { id: 'chat_10', icon: '🗨️', labelKey: 'status.badge.chat10',
      test: s => s.chatCount >= 10 },
    { id: 'manual', icon: '📚', labelKey: 'status.badge.manual',
      test: s => s.featuresUsed.includes('manual') },
    { id: 'onboarding', icon: '🌟', labelKey: 'status.badge.onboarding',
      test: () => global.OnboardingStatus && OnboardingStatus.getOnboardingFullyCompleted() },
    { id: 'warning_pro', icon: '⚠️', labelKey: 'status.badge.warningFlow',
      test: s => s.featuresUsed.includes('warning_flow') },
    { id: 'explorer', icon: '🧭', labelKey: 'status.badge.explorer',
      test: s => s.featuresUsed.length >= 8 },
    { id: 'expert', icon: '⭐', labelKey: 'status.badge.expert',
      test: s => s.points >= 75 }
  ];

  function t(key, vars) {
    return global.AppSettings ? AppSettings.t(key, vars) : key;
  }

  function escapeHtml(text) {
    const el = document.createElement('div');
    el.textContent = text;
    return el.innerHTML;
  }

  function getVehicleKey() {
    const v = global.AppSettings ? AppSettings.getVehicle() : { model: 'lean3', year: '2026' };
    return `${v.model}-${v.year}`;
  }

  function defaultState() {
    const today = new Date().toISOString().slice(0, 10);
    return {
      points: 0,
      featuresUsed: [],
      chatCount: 0,
      firstLoginAt: null,
      maintenance: {
        intervalKm: 10000,
        intervalMonths: 12,
        currentOdometer: 4500,
        lastServiceOdometer: 0,
        lastServiceDate: today
      }
    };
  }

  function readStore() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function writeStore(store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function getState(vehicleKey) {
    const key = vehicleKey || getVehicleKey();
    const store = readStore();
    if (!store[key]) {
      store[key] = defaultState();
      if (localStorage.getItem('lean3User')) {
        store[key].firstLoginAt = new Date().toISOString();
        store[key].points = 5;
      }
      writeStore(store);
    }
    return store[key];
  }

  function saveState(state, vehicleKey) {
    const key = vehicleKey || getVehicleKey();
    const store = readStore();
    store[key] = state;
    writeStore(store);
    return state;
  }

  function getLevelInfo(points) {
    let current = LEVELS[0];
    let next = LEVELS[1] || null;
    for (let i = 0; i < LEVELS.length; i++) {
      if (points >= LEVELS[i].min) {
        current = LEVELS[i];
        next = LEVELS[i + 1] || null;
      }
    }
    const maxPoints = 100;
    const overallPct = Math.min(100, Math.round((points / maxPoints) * 100));
    let tierPct = overallPct;
    if (next) {
      const span = next.min - current.min;
      tierPct = Math.min(100, Math.round(((points - current.min) / span) * 100));
    } else {
      tierPct = Math.min(100, Math.round(((points - current.min) / (maxPoints - current.min)) * 100));
    }
    return { current, next, overallPct, tierPct, points };
  }

  function addPoints(state, amount) {
    state.points = Math.min(100, state.points + amount);
    return state;
  }

  function trackFeature(featureId) {
    const state = getState();
    const feature = FEATURES.find(f => f.id === featureId);
    if (!state.featuresUsed.includes(featureId)) {
      state.featuresUsed.push(featureId);
      addPoints(state, feature ? feature.points : 5);
      saveState(state);
      renderStatusTab();
    }
    return state;
  }

  function untrackFeature(featureId) {
    const state = getState();
    const idx = state.featuresUsed.indexOf(featureId);
    if (idx < 0) return state;
    const feature = FEATURES.find(f => f.id === featureId);
    state.featuresUsed.splice(idx, 1);
    state.points = Math.max(0, state.points - (feature ? feature.points : 5));
    saveState(state);
    renderStatusTab();
    return state;
  }

  function trackChatMessage() {
    const state = getState();
    state.chatCount += 1;
    addPoints(state, 2);
    if (!state.featuresUsed.includes('chat')) {
      state.featuresUsed.push('chat');
      addPoints(state, 8);
    }
    saveState(state);
    renderStatusTab();
    return state;
  }

  function saveMaintenance(formData) {
    const state = getState();
    state.maintenance = {
      intervalKm: Math.max(1000, parseInt(formData.intervalKm, 10) || 10000),
      intervalMonths: Math.max(1, parseInt(formData.intervalMonths, 10) || 12),
      currentOdometer: Math.max(0, parseInt(formData.currentOdometer, 10) || 0),
      lastServiceOdometer: Math.max(0, parseInt(formData.lastServiceOdometer, 10) || 0),
      lastServiceDate: formData.lastServiceDate || new Date().toISOString().slice(0, 10)
    };
    saveState(state);
    renderStatusTab();
    return state;
  }

  function calcMaintenance(state) {
    const m = state.maintenance;
    const nextServiceKm = m.lastServiceOdometer + m.intervalKm;
    const kmRemaining = Math.max(0, nextServiceKm - m.currentOdometer);
    const kmProgress = m.intervalKm > 0
      ? Math.min(100, Math.round(((m.currentOdometer - m.lastServiceOdometer) / m.intervalKm) * 100))
      : 0;

    const lastDate = new Date(m.lastServiceDate);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + m.intervalMonths);
    const today = new Date();
    const daysRemaining = Math.max(0, Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24)));

    return {
      nextServiceKm,
      kmRemaining,
      kmProgress,
      nextServiceDate: nextDate.toISOString().slice(0, 10),
      daysRemaining
    };
  }

  function renderBadges(state) {
    return BADGES.map(badge => {
      const unlocked = badge.test(state);
      return `
        <div class="badge-item ${unlocked ? 'unlocked' : ''}" title="${escapeHtml(t(badge.labelKey))}">
          <div class="badge-icon">${badge.icon}</div>
          <div class="badge-label">${escapeHtml(t(badge.labelKey))}</div>
        </div>
      `;
    }).join('');
  }

  function renderFeatureTracking(state) {
    const used = state.featuresUsed.length;
    const total = FEATURES.length;
    const pct = Math.round((used / total) * 100);
    const items = FEATURES.map(feature => {
      const isUsed = state.featuresUsed.includes(feature.id);
      return `
        <div class="feature-track-item ${isUsed ? 'used' : ''}">
          <span class="feature-track-dot">${isUsed ? '✓' : '○'}</span>
          <span>${escapeHtml(t(feature.labelKey))}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="progress-item">
        <div class="progress-label">
          <span>${escapeHtml(t('status.feature.coverage'))}</span>
          <span>${used}/${total}（${pct}%）</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${pct}%"></div>
        </div>
      </div>
      <div class="feature-track-grid">${items}</div>
    `;
  }

  function renderStatusTab() {
    const container = document.getElementById('statusTabContent');
    if (!container) return;

    const state = getState();
    const level = getLevelInfo(state.points);
    const maint = calcMaintenance(state);
    const m = state.maintenance;
    const vehicle = global.AppSettings ? AppSettings.getVehicle() : { model: 'lean3', year: '2026' };

    container.innerHTML = `
      <div class="status-card">
        <h3>📊 ${escapeHtml(t('status.knowledge.title'))}</h3>
        <div class="progress-item">
          <div class="progress-label">
            <span>${escapeHtml(t('status.knowledge.levelLabel', { level: t(level.current.labelKey) }))}</span>
            <span>${level.points}pt / ${level.overallPct}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${level.overallPct}%"></div>
          </div>
        </div>
        ${level.next ? `<p class="status-hint">${escapeHtml(t('status.knowledge.nextLevel', { pct: level.tierPct, level: t(level.next.labelKey) }))}</p>` : ''}
        <p class="status-hint">${escapeHtml(t('status.knowledge.hint'))}</p>
      </div>

      <div class="status-card">
        <h3>🏆 ${escapeHtml(t('status.badges.title'))}</h3>
        <div class="badge-grid">${renderBadges(state)}</div>
        <p class="status-points-line">${escapeHtml(t('status.points.total', { points: state.points }))}</p>
      </div>

      <div class="status-card">
        <h3>📈 ${escapeHtml(t('status.feature.title'))}</h3>
        ${renderFeatureTracking(state)}
      </div>

      <div class="status-card">
        <h3>🔧 ${escapeHtml(t('status.maintenance.title'))}</h3>
        <form class="maintenance-form" onsubmit="UserProgress.handleMaintenanceSubmit(event)">
          <label class="maint-field">
            <span>${escapeHtml(t('status.maintenance.currentOdometer'))}</span>
            <input type="number" name="currentOdometer" min="0" step="100" value="${m.currentOdometer}">
          </label>
          <label class="maint-field">
            <span>${escapeHtml(t('status.maintenance.lastServiceOdometer'))}</span>
            <input type="number" name="lastServiceOdometer" min="0" step="100" value="${m.lastServiceOdometer}">
          </label>
          <label class="maint-field">
            <span>${escapeHtml(t('status.maintenance.lastServiceDate'))}</span>
            <input type="date" name="lastServiceDate" value="${m.lastServiceDate}">
          </label>
          <label class="maint-field">
            <span>${escapeHtml(t('status.maintenance.intervalKm'))}</span>
            <input type="number" name="intervalKm" min="1000" step="500" value="${m.intervalKm}">
          </label>
          <label class="maint-field">
            <span>${escapeHtml(t('status.maintenance.intervalMonths'))}</span>
            <input type="number" name="intervalMonths" min="1" max="36" value="${m.intervalMonths}">
          </label>
          <button type="submit" class="maint-save-btn">${escapeHtml(t('status.maintenance.save'))}</button>
        </form>
        <div class="maintenance-summary">
          <div class="progress-item">
            <div class="progress-label">
              <span>${escapeHtml(t('status.maintenance.untilNext'))}</span>
              <span>${escapeHtml(t('status.maintenance.kmRemaining', { km: maint.kmRemaining.toLocaleString() }))}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${maint.kmProgress}%"></div>
            </div>
          </div>
          <p class="status-hint">
            ${escapeHtml(t('status.maintenance.nextDate', { date: maint.nextServiceDate }))}<br>
            ${escapeHtml(t('status.maintenance.daysRemaining', { days: maint.daysRemaining }))}
          </p>
        </div>
      </div>

      <div class="status-card">
        <h3>📱 ${escapeHtml(t('status.vehicle.title'))}</h3>
        <p class="status-vehicle-info">
          <strong>${escapeHtml(t('status.vehicle.model'))}</strong> ${escapeHtml(t('vehicle.lean3'))}<br>
          <strong>${escapeHtml(t('status.vehicle.year'))}</strong> ${escapeHtml(t('vehicle.yearModel', { year: vehicle.year }))}<br>
          <strong>${escapeHtml(t('status.vehicle.maxSpeed'))}</strong> 60km/h<br>
          <strong>${escapeHtml(t('status.vehicle.range'))}</strong> ${escapeHtml(t('chat.ai.range.value.range'))}<br>
          <strong>${escapeHtml(t('status.vehicle.chargeTime'))}</strong> AC200V ${escapeHtml(t('status.vehicle.chargeTimeValue'))}
        </p>
      </div>
    `;
  }

  function handleMaintenanceSubmit(event) {
    event.preventDefault();
    const form = event.target;
    saveMaintenance({
      currentOdometer: form.currentOdometer.value,
      lastServiceOdometer: form.lastServiceOdometer.value,
      lastServiceDate: form.lastServiceDate.value,
      intervalKm: form.intervalKm.value,
      intervalMonths: form.intervalMonths.value
    });
  }

  function resetAll() {
    localStorage.removeItem(STORAGE_KEY);
    renderStatusTab();
  }

  function init() {
    getState();
    if (document.getElementById('tab-home')?.classList.contains('active')) {
      trackFeature('home');
    }
    if (global.OnboardingStatus &&
        !OnboardingStatus.getOnboardingFullyCompleted()) {
      untrackFeature('onboarding');
    }
    renderStatusTab();
  }

  global.UserProgress = {
    init,
    resetAll,
    trackFeature,
    untrackFeature,
    trackChatMessage,
    saveMaintenance,
    renderStatusTab,
    handleMaintenanceSubmit,
    getState
  };
})(window);
