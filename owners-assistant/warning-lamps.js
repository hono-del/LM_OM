/**
 * 警告灯グリッド（5.2 チャット / 6.1 タブ）
 */
(function (global) {
  'use strict';

  const URGENCY_ORDER = { red: 0, amber: 1, green: 2, blue: 3 };

  function t(key, vars) {
    return global.AppSettings ? AppSettings.t(key, vars) : key;
  }

  function escapeHtml(text) {
    const el = document.createElement('div');
    el.textContent = text;
    return el.innerHTML;
  }

  function getLocalizedLamp(lamp) {
    if (global.AppSettings && AppSettings.getLocalizedWarning && lamp.hasFlow) {
      const loc = AppSettings.getLocalizedWarning(lamp.id);
      return { ...lamp, name: loc.name, meaning: loc.meaning, action: loc.action, urgency: loc.urgency };
    }
    return {
      ...lamp,
      name: t(`warning.${lamp.id}.name`),
      meaning: t(`warning.${lamp.id}.meaning`),
      action: t(`warning.${lamp.id}.action`),
      urgency: t(`warning.${lamp.id}.urgency`)
    };
  }

  function getSortedLamps(filter) {
    const query = (filter || '').trim().toLowerCase();
    return WARNING_LAMPS
      .map(getLocalizedLamp)
      .filter(lamp => {
        if (!query) return true;
        return lamp.name.toLowerCase().includes(query) ||
          lamp.meaning.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        if (a.active !== b.active) return a.active ? -1 : 1;
        return (URGENCY_ORDER[a.badgeClass] ?? 9) - (URGENCY_ORDER[b.badgeClass] ?? 9);
      });
  }

  function getActiveCount() {
    return WARNING_LAMPS.filter(lamp => lamp.active).length;
  }

  function handleTap(lampId) {
    const lamp = WARNING_LAMPS.find(item => item.id === lampId);
    if (!lamp) return;

    if (lamp.active && lamp.hasFlow && global.ContextExperience) {
      if (typeof switchTab === 'function') switchTab('warnings');
      ContextExperience.startWarningCase(lampId);
      return;
    }

    const loc = getLocalizedLamp(lamp);
    if (lamp.manualTopic) {
      window.open(`../manual.html?topic=${lamp.manualTopic}`, '_blank');
      return;
    }

    alert(`${loc.name}\n\n${loc.meaning}\n\n${loc.action}`);
  }

  function renderLampGridItem(lamp, mode) {
    const litBadge = lamp.active
      ? `<span class="warning-lamp-lit-badge">${escapeHtml(t('warnings.litBadge'))}</span>`
      : '';
    const compactClass = mode === 'chat' ? ' warning-lamp-item-chat' : '';
    return `
      <button type="button" class="warning-lamp-item ${lamp.badgeClass}${lamp.active ? ' lit' : ''}${compactClass}"
              onclick="WarningLamps.handleTap('${lamp.id}')">
        ${litBadge}
        <span class="warning-lamp-icon">${lamp.icon}</span>
        <span class="warning-lamp-name">${escapeHtml(lamp.name)}</span>
      </button>
    `;
  }

  function renderActiveCards() {
    return WARNING_LAMPS
      .filter(lamp => lamp.active)
      .map(lamp => {
        const lc = getLocalizedLamp(lamp);
        return `
          <div class="warning-case-card ${lamp.badgeClass}" onclick="WarningLamps.handleTap('${lamp.id}')">
            <div class="warning-case-header">
              <span class="warning-case-icon">${lamp.icon}</span>
              <div>
                <div class="warning-case-urgency overlay-warning-badge ${lamp.badgeClass}">${escapeHtml(lc.urgency)}</div>
                <h3>${escapeHtml(lc.name)}</h3>
              </div>
            </div>
            <p class="warning-case-meaning"><strong>${escapeHtml(t('warnings.meaning'))}</strong>${escapeHtml(lc.meaning)}</p>
            <p class="warning-case-action"><strong>${escapeHtml(t('warnings.action'))}</strong>${escapeHtml(lc.action)}</p>
            <div class="warning-case-cta">${escapeHtml(t('warnings.cta'))}</div>
          </div>
        `;
      }).join('');
  }

  function renderLampGrid(mode, filter) {
    const lamps = getSortedLamps(filter);
    if (!lamps.length) {
      return `<p class="warning-lamp-empty">${escapeHtml(t('warnings.searchEmpty'))}</p>`;
    }
    return `<div class="warning-lamp-grid${mode === 'chat' ? ' warning-lamp-grid-chat' : ''}">` +
      lamps.map(lamp => renderLampGridItem(lamp, mode)).join('') +
      '</div>';
  }

  function renderTab() {
    const container = document.getElementById('warningCaseList');
    if (!container) return;

    const activeCount = getActiveCount();
    const countEl = document.querySelector('.warnings-count');
    if (countEl) {
      countEl.textContent = t('warnings.countDynamic', { count: activeCount });
    }

    container.innerHTML = `
      <section class="warnings-active-section">
        <h3 class="warnings-section-title">${escapeHtml(t('warnings.activeSection'))}</h3>
        ${renderActiveCards()}
      </section>
      <section class="warnings-all-section">
        <h3 class="warnings-section-title">${escapeHtml(t('warnings.allSection'))}</h3>
        <input type="search" id="warningLampSearch" class="warning-lamp-search"
               placeholder="${escapeHtml(t('warnings.search'))}" />
        <div id="warningLampGrid">${renderLampGrid('tab')}</div>
      </section>
    `;

    const searchInput = document.getElementById('warningLampSearch');
    const grid = document.getElementById('warningLampGrid');
    if (searchInput && grid) {
      searchInput.addEventListener('input', function () {
        grid.innerHTML = renderLampGrid('tab', searchInput.value);
      });
    }
  }

  function renderChatAnswer() {
    const activeCount = getActiveCount();
    const intro = t('chat.ai.warning.intro', { count: activeCount });
    const openTab = t('chat.ai.warning.openTab');
    return `
      <p>${escapeHtml(intro)}</p>
      ${renderLampGrid('chat')}
      <span class="chat-link-btn" onclick="ContextExperience.openWarningsTab()">${escapeHtml(openTab)} →</span>
      ${buildSourceBox()}
    `;
  }

  function buildSourceBox() {
    return `
      <div class="chat-source-box">
        <div class="chat-source-label">${escapeHtml(t('chat.ai.source.label'))}</div>
        <a class="chat-source-link" href="../manual.html?topic=section5-2">📖 ${escapeHtml(t('chat.ai.warning.manualRef'))}</a>
      </div>
    `;
  }

  global.WarningLamps = {
    getSortedLamps,
    getActiveCount,
    handleTap,
    renderTab,
    renderChatAnswer
  };
})(window);
