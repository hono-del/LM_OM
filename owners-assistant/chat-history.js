/**
 * チャット履歴の永続化（車両別）
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'capp_chat_history';
  const FEEDBACK_LOG_KEY = 'capp_chat_feedback_log';
  const WELCOME_FEEDBACK_KEY = 'capp_welcome_feedback';
  const WELCOME_MSG_ID = '__welcome__';

  function getVehicleKey(vehicle) {
    const v = vehicle || (global.AppSettings ? AppSettings.getVehicle() : { model: 'lean3', year: '2026' });
    return `${v.model}-${v.year}`;
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

  function getMessages(vehicleKey) {
    const key = vehicleKey || getVehicleKey();
    const store = readStore();
    return Array.isArray(store[key]) ? store[key] : [];
  }

  function addMessage(entry, vehicleKey) {
    const key = vehicleKey || getVehicleKey();
    const store = readStore();
    if (!Array.isArray(store[key])) {
      store[key] = [];
    }
    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ts: new Date().toISOString(),
      ...entry
    };
    store[key].push(message);
    writeStore(store);
    return message;
  }

  function removeMessage(id, vehicleKey) {
    const key = vehicleKey || getVehicleKey();
    const store = readStore();
    if (!Array.isArray(store[key])) return;
    store[key] = store[key].filter(msg => msg.id !== id);
    writeStore(store);
  }

  function clearHistory(vehicleKey) {
    const key = vehicleKey || getVehicleKey();
    const store = readStore();
    delete store[key];
    writeStore(store);
  }

  function updateMessage(id, patch, vehicleKey) {
    const key = vehicleKey || getVehicleKey();
    const store = readStore();
    if (!Array.isArray(store[key])) return null;
    const index = store[key].findIndex(msg => msg.id === id);
    if (index === -1) return null;
    store[key][index] = { ...store[key][index], ...patch };
    writeStore(store);
    return store[key][index];
  }

  function readFeedbackLog() {
    try {
      return JSON.parse(localStorage.getItem(FEEDBACK_LOG_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function upsertFeedbackLog(entry) {
    const log = readFeedbackLog();
    const index = log.findIndex(item =>
      item.messageId === entry.messageId && item.vehicleKey === entry.vehicleKey
    );
    const record = {
      ...entry,
      loggedAt: new Date().toISOString()
    };
    if (index >= 0) {
      log[index] = record;
    } else {
      log.push(record);
    }
    localStorage.setItem(FEEDBACK_LOG_KEY, JSON.stringify(log));
  }

  function readWelcomeFeedbackStore() {
    try {
      return JSON.parse(localStorage.getItem(WELCOME_FEEDBACK_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function getWelcomeFeedback(vehicleKey) {
    const key = vehicleKey || getVehicleKey();
    return readWelcomeFeedbackStore()[key] || null;
  }

  function setWelcomeFeedback(rating, vehicleKey) {
    const key = vehicleKey || getVehicleKey();
    const store = readWelcomeFeedbackStore();
    store[key] = rating;
    localStorage.setItem(WELCOME_FEEDBACK_KEY, JSON.stringify(store));
    upsertFeedbackLog({
      messageId: WELCOME_MSG_ID,
      vehicleKey: key,
      responseKey: 'welcome',
      rating,
      lang: global.AppSettings ? AppSettings.getLanguage() : 'ja',
      ts: new Date().toISOString()
    });
    return rating;
  }

  function setFeedback(id, rating, vehicleKey) {
    const key = vehicleKey || getVehicleKey();

    if (id === WELCOME_MSG_ID) {
      setWelcomeFeedback(rating, key);
      return { id: WELCOME_MSG_ID, role: 'bot', responseKey: 'welcome', feedback: rating };
    }

    const entry = updateMessage(id, {
      feedback: rating,
      feedbackAt: new Date().toISOString()
    }, key);
    if (!entry || entry.role !== 'bot') return null;

    upsertFeedbackLog({
      messageId: id,
      vehicleKey: key,
      responseKey: entry.responseKey || 'unknown',
      rating,
      lang: global.AppSettings ? AppSettings.getLanguage() : 'ja',
      ts: entry.ts
    });
    return entry;
  }

  global.ChatHistory = {
    WELCOME_MSG_ID,
    getVehicleKey,
    getMessages,
    addMessage,
    removeMessage,
    clearHistory,
    getWelcomeFeedback,
    setWelcomeFeedback,
    setFeedback,
    readFeedbackLog
  };
})(window);
