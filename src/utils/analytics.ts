// Google Analytics 4 ユーティリティ
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// GA4イベント送信関数
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      timestamp: new Date().toISOString(),
    });
  }
};

// ページビューイベント
export const trackPageView = (pageName: string, pageTitle?: string) => {
  trackEvent('page_view', {
    page_title: pageTitle || pageName,
    page_location: window.location.href,
    page_path: window.location.pathname,
    custom_parameter_1: pageName,
  });
};

// モード切り替えイベント
export const trackModeChange = (fromMode: string, toMode: string) => {
  trackEvent('mode_change', {
    from_mode: fromMode,
    to_mode: toMode,
    custom_parameter_1: toMode,
  });
};

// BGM再生イベント
export const trackBGMPlay = (trackName: string, mode: string) => {
  trackEvent('bgm_play', {
    track_name: trackName,
    mode: mode,
    custom_parameter_2: trackName,
  });
};

// BGM停止イベント
export const trackBGMStop = (trackName: string, mode: string, duration?: number) => {
  trackEvent('bgm_stop', {
    track_name: trackName,
    mode: mode,
    duration: duration,
    custom_parameter_2: trackName,
  });
};

// ポモドーロタイマーイベント
export const trackPomodoroStart = (sessionType: 'work' | 'break') => {
  trackEvent('pomodoro_start', {
    session_type: sessionType,
    custom_parameter_1: 'focus',
  });
};

export const trackPomodoroComplete = (sessionType: 'work' | 'break', duration: number) => {
  trackEvent('pomodoro_complete', {
    session_type: sessionType,
    duration: duration,
    custom_parameter_1: 'focus',
  });
};

// エフェクトボタンクリックイベント
export const trackEffectButtonClick = (effectType: string, mode: string) => {
  trackEvent('effect_button_click', {
    effect_type: effectType,
    mode: mode,
    custom_parameter_1: mode,
  });
};

// 音量調整イベント
export const trackVolumeChange = (volume: number, mode: string) => {
  trackEvent('volume_change', {
    volume: volume,
    mode: mode,
    custom_parameter_1: mode,
  });
};

// 言語切り替えイベント
export const trackLanguageChange = (fromLang: string, toLang: string) => {
  trackEvent('language_change', {
    from_language: fromLang,
    to_language: toLang,
  });
};

// 背景色変更イベント
export const trackBackgroundColorChange = (color: string) => {
  trackEvent('background_color_change', {
    color: color,
    custom_parameter_1: 'home',
  });
};

// エラートラッキング
export const trackError = (errorType: string, errorMessage: string, mode?: string) => {
  trackEvent('error', {
    error_type: errorType,
    error_message: errorMessage,
    mode: mode,
  });
};

// セッション開始
export const trackSessionStart = () => {
  trackEvent('session_start', {
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    screen_resolution: `${screen.width}x${screen.height}`,
  });
};

// セッション終了
export const trackSessionEnd = (duration: number) => {
  trackEvent('session_end', {
    duration: duration,
    timestamp: new Date().toISOString(),
  });
};
