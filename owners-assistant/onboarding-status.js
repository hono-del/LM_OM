/**
 * オンボーディング状態管理
 * 将来的にバックエンドAPIへ差し替え可能なよう、判定・保存ロジックを集約
 */
(function (global) {
  const STORAGE_KEY = 'capp_has_completed_onboarding';
  const STORAGE_KEY_FULL = 'capp_onboarding_fully_completed';

  const ROUTES = {
    login: 'index.html',
    vehicleSelection: 'vehicle-selection.html',
    onboarding: 'onboarding.html',
    home: 'app.html'
  };

  /** @returns {boolean} */
  function getOnboardingStatus() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

  /** @returns {boolean} 全ステップ完了（スキップ以外） */
  function getOnboardingFullyCompleted() {
    return localStorage.getItem(STORAGE_KEY_FULL) === 'true';
  }

  /** スキップ含む：ホームへ進めるための通過フラグのみ */
  function setOnboardingCompleted() {
    localStorage.setItem(STORAGE_KEY, 'true');
  }

  /** 最終ステップまで完了：ガイド完了バッジ・進捗に反映 */
  function setOnboardingFullyCompleted() {
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem(STORAGE_KEY_FULL, 'true');
    if (global.UserProgress && UserProgress.trackFeature) {
      UserProgress.trackFeature('onboarding');
    }
  }

  /** デモ・テスト用：オンボーディング状態をリセット */
  function resetOnboardingStatus() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_FULL);
    if (global.UserProgress && UserProgress.untrackFeature) {
      UserProgress.untrackFeature('onboarding');
    }
  }

  /** 初回ログイン導線を最初から試す（ログイン→車両選択→オンボーディング→ホーム） */
  function resetFirstLoginFlow() {
    resetOnboardingStatus();
    if (global.UserProgress && UserProgress.resetAll) {
      UserProgress.resetAll();
    } else {
      localStorage.removeItem('capp_user_progress');
      localStorage.removeItem(STORAGE_KEY_FULL);
    }
    localStorage.removeItem('lean3User');
    localStorage.removeItem('selectedVehicle');
    localStorage.removeItem('capp_hero_completed');
    try {
      sessionStorage.removeItem('capp_notification_read');
      sessionStorage.removeItem('capp_warning_state');
    } catch (e) { /* ignore */ }
    window.location.href = ROUTES.login;
  }

  function hasLoggedInUser() {
    return !!localStorage.getItem('lean3User');
  }

  function hasSelectedVehicle() {
    return !!localStorage.getItem('selectedVehicle');
  }

  /** ログイン後の遷移先を決定して移動 */
  function navigateAfterLogin() {
    if (!hasSelectedVehicle()) {
      window.location.href = ROUTES.vehicleSelection;
      return;
    }

    if (!getOnboardingStatus()) {
      window.location.href = ROUTES.onboarding;
      return;
    }

    window.location.href = ROUTES.home;
  }

  /** 車両選択完了後の遷移先を決定して移動 */
  function navigateAfterVehicleSelection() {
    if (!getOnboardingStatus()) {
      window.location.href = ROUTES.onboarding;
      return;
    }

    window.location.href = ROUTES.home;
  }

  /**
   * オンボーディング完了・スキップ後にホームへ遷移
   * @param {{ fullyCompleted?: boolean }} [options]
   */
  function navigateToHome(options) {
    if (options && options.fullyCompleted) {
      setOnboardingFullyCompleted();
    } else {
      setOnboardingCompleted();
    }
    window.location.href = ROUTES.home;
  }

  /**
   * 画面ガード用：認証・車両・オンボーディング状態を検証
   * @param {'login'|'vehicleSelection'|'onboarding'|'home'} page
   */
  function guardPage(page) {
    const loggedIn = hasLoggedInUser();
    const hasVehicle = hasSelectedVehicle();
    const onboardingDone = getOnboardingStatus();

    if (page === 'login') {
      if (loggedIn) {
        navigateAfterLogin();
      }
      return;
    }

    if (!loggedIn) {
      window.location.href = ROUTES.login;
      return;
    }

    if (page === 'vehicleSelection') {
      return;
    }

    if (!hasVehicle) {
      window.location.href = ROUTES.vehicleSelection;
      return;
    }

    if (page === 'onboarding') {
      if (onboardingDone) {
        window.location.href = ROUTES.home;
      }
      return;
    }

    if (page === 'home' && !onboardingDone) {
      window.location.href = ROUTES.onboarding;
    }
  }

  /**
   * React Hook 相当のインターフェース（将来のフレームワーク移行用）
   * 現状は localStorage ベースの同期実装
   */
  function useOnboardingStatus() {
    return {
      hasCompletedOnboarding: getOnboardingStatus(),
      completeOnboarding: setOnboardingCompleted,
      resetOnboarding: resetOnboardingStatus
    };
  }

  global.OnboardingStatus = {
    STORAGE_KEY,
    STORAGE_KEY_FULL,
    ROUTES,
    getOnboardingStatus,
    getOnboardingFullyCompleted,
    setOnboardingCompleted,
    setOnboardingFullyCompleted,
    resetOnboardingStatus,
    resetFirstLoginFlow,
    navigateAfterLogin,
    navigateAfterVehicleSelection,
    navigateToHome,
    guardPage,
    useOnboardingStatus
  };
})(window);
