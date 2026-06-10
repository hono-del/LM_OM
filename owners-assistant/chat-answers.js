/**
 * AI Text Answers（部分実装）— 出典付きテキスト回答
 */
(function (global) {
  'use strict';

  const MANUAL_CHARGING_TOPIC = 'section3-5';
  const MANUAL_CHARGING_URL = '../manual.html?topic=' + MANUAL_CHARGING_TOPIC;
  const LEAN3_SPEC_URL = 'https://www.autobacs.com/product/micromobility/lean3/top.html';

  function t(key, vars) {
    return global.AppSettings ? AppSettings.t(key, vars) : key;
  }

  function escapeHtml(text) {
    const el = document.createElement('div');
    el.textContent = text;
    return el.innerHTML;
  }

  function buildSourceBox(title, href, external) {
    const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    const icon = external ? '↗' : '📖';
    return `
      <div class="chat-source-box">
        <div class="chat-source-label">${escapeHtml(t('chat.ai.source.label'))}</div>
        <a class="chat-source-link" href="${href}"${target}>${icon} ${escapeHtml(title)}</a>
      </div>
    `;
  }

  function buildChargingAnswer() {
    const steps = [0, 1, 2, 3, 4, 5, 6, 7].map(i => t(`chat.ai.charging.step.${i}`));
    const stepsHtml = steps.map((s, i) => `<li><strong>${i + 1}.</strong> ${escapeHtml(s)}</li>`).join('');
    const notesHtml = [0, 1, 2].map(i => `・${escapeHtml(t(`chat.ai.charging.note.${i}`))}`).join('<br>');
    const hint = t('chat.charging.troubleshoot.hint').replace(/'/g, "\\'");

    return `
      <p>${escapeHtml(t('chat.ai.charging.intro'))}</p>
      <ol class="chat-steps-list">${stepsHtml}</ol>
      <div class="chat-note-box">${notesHtml}</div>
      <span class="chat-link-btn" onclick="alert('${hint}')">${escapeHtml(t('chat.charging.troubleshoot.label'))} →</span>
      ${buildSourceBox(t('chat.ai.charging.manualRef'), MANUAL_CHARGING_URL, false)}
    `;
  }

  function buildRangeAnswer() {
    const specs = [
      ['chat.ai.range.spec.category', 'chat.ai.range.value.category'],
      ['chat.ai.range.spec.range', 'chat.ai.range.value.range'],
      ['chat.ai.range.spec.speed', 'chat.ai.range.value.speed'],
      ['chat.ai.range.spec.weight', 'chat.ai.range.value.weight']
    ];
    const rows = specs.map(([labelKey, valueKey]) => `
      <tr>
        <td>${escapeHtml(t(labelKey))}</td>
        <td><strong>${escapeHtml(t(valueKey))}</strong></td>
      </tr>
    `).join('');

    return `
      <p>${escapeHtml(t('chat.ai.range.lead'))}</p>
      <table class="chat-spec-table">${rows}</table>
      <p class="chat-ai-note">${escapeHtml(t('chat.ai.range.note'))}</p>
      ${buildSourceBox(t('chat.ai.range.sourceTitle'), LEAN3_SPEC_URL, true)}
    `;
  }

  function buildWarningLampsAnswer() {
    return global.WarningLamps ? WarningLamps.renderChatAnswer() : '';
  }

  function buildActiveLeanAnswer() {
    return `
      <p class="chat-active-lean-tagline">${escapeHtml(t('chat.ai.activeLean.tagline'))}</p>
      <h4 class="chat-active-lean-title">${escapeHtml(t('chat.ai.activeLean.title'))}</h4>
      <div class="chat-active-lean-spec">${escapeHtml(t('chat.ai.activeLean.spec'))} <strong>${escapeHtml(t('chat.ai.activeLean.specValue'))}</strong></div>
      <p>${escapeHtml(t('chat.ai.activeLean.body'))}</p>
      ${buildSourceBox(t('chat.ai.activeLean.sourceTitle'), LEAN3_SPEC_URL, true)}
    `;
  }

  global.ChatAnswers = {
    buildChargingAnswer,
    buildRangeAnswer,
    buildWarningLampsAnswer,
    buildActiveLeanAnswer,
    MANUAL_CHARGING_URL,
    LEAN3_SPEC_URL
  };
})(window);
