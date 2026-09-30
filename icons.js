/**
 * Глобальный реестр векторных анимированных иконок
 * Файл: icons.js (корень проекта)
 */
(function () {
  'use strict';

  var ICONS = {
    // ------------------------------------------------------------------------
    // ШАПКА, СЕТИ И СИСТЕМНЫЕ ИКОНКИ
    // ------------------------------------------------------------------------
    pulseHeader: function () {
      return '<span class="app-icon anim-pulse-ecg" style="width:24px; height:16px; color:var(--accent, #38bdf8);">' +
        '<svg viewBox="0 0 28 16" fill="none">' +
        '<path class="pulse-line" d="M1 8h5l2.5-5.5 3.5 11 2.5-8 2 4.5h4.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg></span>';
    },

    yogaPose: function (color) {
      color = color || 'var(--accent, #c084fc)';
      return '<span class="app-icon" style="width:22px; height:22px; color:' + color + ';">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">' +
        '<path class="anim-lotus-core" d="M12 3c0 5-4 8-4 11a4 4 0 0 0 8 0c0-3-4-6-4-11z" fill="rgba(192, 132, 252, 0.25)"/>' +
        '<path class="anim-lotus-side-1" d="M12 5c3 3 7 5 8 9a4 4 0 0 1-6 4c-2-1-3-3-2-13z" opacity="0.8"/>' +
        '<path class="anim-lotus-side-2" d="M12 5c-3 3-7 5-8 9a4 4 0 0 0 6 4c2-1 3-3 2-13z" opacity="0.8"/>' +
        '</svg></span>';
    },

    telegram: function () {
      return '<span class="app-icon" style="width:16px; height:16px; color:#38bdf8;">' +
        '<svg viewBox="0 0 24 24" fill="currentColor">' +
        '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>' +
        '</svg></span>';
    },

    youtube: function () {
      return '<span class="app-icon" style="width:16px; height:16px; color:#f87171;">' +
        '<svg viewBox="0 0 24 24" fill="currentColor">' +
        '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>' +
        '</svg></span>';
    },

    dzen: function () {
      return '<span class="app-icon" style="width:16px; height:16px; color:#ffffff;">' +
        '<svg viewBox="0 0 24 24" fill="none">' +
        '<circle cx="12" cy="12" r="10" fill="#202020"/>' +
        '<path d="M12 4C12 8.418 8.418 12 4 12C8.418 12 12 15.582 12 20C12 15.582 15.582 12 20 12C15.582 12 12 8.418 12 4Z" fill="#ffffff"/>' +
        '</svg></span>';
    },

    // ------------------------------------------------------------------------
    // ИКОНКИ ДИАГНОСТИКИ ЗОЖ (С АНИМАЦИЯМИ)
    // ------------------------------------------------------------------------
    bmi: function () {
      return '<span class="app-icon" style="width:26px; height:26px; color:#38bdf8;">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="6" r="2.5"/>' +
        '<path d="M6 20v-2a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2"/>' +
        '<path class="anim-breathe" d="M3 9V7h2 M3 15v2h2 M21 9V7h-2 M21 15v2h-2" stroke-width="2"/>' +
        '</svg></span>';
    },

    bmr: function () {
      return '<span class="app-icon" style="width:26px; height:26px;">' +
        '<svg viewBox="0 0 24 24" fill="none">' +
        '<path class="anim-fire-outer" d="M12 2c-1.8 2.6-4.5 5.2-4.5 9.5 0 3.9 3.1 7 7 7s7-3.1 7-7c0-3.6-2.4-6.8-4.5-9.5-.8 2-2 3.8-3.5 4.8-1.2-1.5-2.5-3.3-4.5-4.8z" fill="#f97316" filter="drop-shadow(0 0 6px rgba(249, 115, 22, 0.7))"/>' +
        '<path class="anim-fire-inner" d="M12 11.5c-.8 1.2-1.8 2.4-1.8 4 0 1.8 1.5 3.3 3.3 3.3s3.3-1.5 3.3-3.3c0-1.5-1-2.8-1.8-3.8-.5.8-1 1.5-1.5 1.8-.5-.3-1-1-1.5-1.8z" fill="#fde047"/>' +
        '</svg></span>';
    },

    water: function () {
      return '<span class="app-icon anim-drop-fluid" style="width:26px; height:26px; color:#06b6d4;">' +
        '<svg viewBox="0 0 24 24" fill="none">' +
        '<path d="M12 2.5 C12 2.5, 5 11, 5 15.5 A7 7 0 0 0 19 15.5 C19 11, 12 2.5, 12 2.5 Z" fill="url(#dropGrad)"/>' +
        '<path d="M9 13 C8.2 14 8 15.5 8.5 17" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity="0.75"/>' +
        '<defs><linearGradient id="dropGrad" x1="12" y1="2.5" x2="12" y2="22.5" gradientUnits="userSpaceOnUse">' +
        '<stop stop-color="#38bdf8"/><stop offset="1" stop-color="#0891b2"/>' +
        '</linearGradient></defs></svg></span>';
    },

    kerdo: function () {
      return '<span class="app-icon anim-kerdo-balance" style="width:26px; height:26px; color:#c084fc;">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">' +
        '<path d="M12 4v15M6 19h12"/>' +
        '<path d="M5 9h14"/>' +
        '<circle cx="5" cy="12" r="2.5" fill="rgba(192, 132, 252, 0.4)"/>' +
        '<circle cx="19" cy="12" r="2.5" fill="rgba(56, 189, 248, 0.4)"/>' +
        '<path d="M12 4l-2 2h4z" fill="currentColor"/>' +
        '</svg></span>';
    },

    stange: function () {
      return '<span class="app-icon anim-lungs-breath" style="width:26px; height:26px; color:#38bdf8;">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">' +
        '<path d="M12 3v7M12 7l-3 3M12 7l3 3"/>' +
        '<path d="M8.5 10c-3 0-5 2.5-5 6.5s2 4.5 4.5 4.5c2 0 2.5-2 2.5-4v-7" fill="rgba(56, 189, 248, 0.2)"/>' +
        '<path d="M15.5 10c3 0 5 2.5 5 6.5s-2 4.5-4.5 4.5c-2 0-2.5-2-2.5-4v-7" fill="rgba(56, 189, 248, 0.2)"/>' +
        '</svg></span>';
    },

    karvonen: function () {
      return '<span class="app-icon" style="width:26px; height:26px; color:#ec4899;">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">' +
        '<circle cx="12" cy="12" r="9" opacity="0.25"/>' +
        '<circle cx="12" cy="12" r="6" opacity="0.5"/>' +
        '<circle cx="12" cy="12" r="3" fill="#ec4899"/>' +
        '<circle class="anim-radar-ping" cx="12" cy="12" r="3" stroke="#ec4899" stroke-width="1.8"/>' +
        '<path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke-linecap="round" opacity="0.4"/>' +
        '</svg></span>';
    },

    rufier: function () {
      return '<span class="app-icon anim-rufier-pulse" style="width:26px; height:26px; color:#ef4444;">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M12 21 C12 21 3 14 3 8.5 A5 5 0 0 1 12 5.5 A5 5 0 0 1 21 8.5 C21 14 12 21 12 21 Z" fill="rgba(239, 68, 68, 0.22)"/>' +
        '<path d="M12 9v4l2.5 2.5" stroke="#ffffff" stroke-width="1.8"/>' +
        '</svg></span>';
    },

    romberg: function () {
      return '<span class="app-icon" style="width:26px; height:26px; color:#10b981;">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
        '<circle cx="12" cy="12" r="9" stroke-dasharray="3 3"/>' +
        '<g class="anim-romberg-gyro">' +
        '<ellipse cx="12" cy="12" rx="7" ry="3" stroke="#10b981" stroke-width="2"/>' +
        '<circle cx="12" cy="12" r="2.5" fill="#10b981"/>' +
        '<line x1="12" y1="5" x2="12" y2="19" stroke-linecap="round"/>' +
        '</g></svg></span>';
    },

    kvas: function () {
      return '<span class="app-icon" style="width:26px; height:26px; color:#f59e0b;">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
        '<path d="M4 15a8 8 0 1 1 16 0" stroke-dasharray="2 3"/>' +
        '<path class="anim-gauge-needle" d="M12 14 L17 8" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round"/>' +
        '<circle cx="12" cy="14" r="2.2" fill="#f59e0b"/>' +
        '<path d="M8 18h8" stroke-width="1.5" opacity="0.6"/>' +
        '</svg></span>';
    },

    sleep: function () {
      return '<span class="app-icon anim-moon-glow" style="width:26px; height:26px; color:#fef08a;">' +
        '<svg viewBox="0 0 24 24" fill="currentColor">' +
        '<path d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5a9 9 0 1 0 9.7 9.7z"/>' +
        '<circle cx="9.5" cy="11.5" r="1.3" fill="#ca8a04" opacity="0.45"/>' +
        '<circle cx="13" cy="15" r="1.8" fill="#ca8a04" opacity="0.45"/>' +
        '<circle cx="9" cy="16.5" r="1" fill="#ca8a04" opacity="0.45"/>' +
        '</svg></span>';
    },

    // ------------------------------------------------------------------------
    // ИКОНКИ МОДУЛЕЙ ЙОГИ
    // ------------------------------------------------------------------------
    asanas: function () {
      return '<span class="app-icon" style="width:36px; height:36px; color:#c084fc;">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">' +
        '<path class="anim-asana-pose" d="M12 5.5v7M9 8.5C8 11.5 8.5 14 11 15.5M15 8.5C16 11.5 15.5 14 13 15.5M4 18.5C5.5 15.5 8.5 14.5 12 15C15.5 14.5 18.5 15.5 20 18.5"/>' +
        '</svg></span>';
    },

    shatkarmas: function () {
      return '<span class="app-icon" style="width:36px; height:36px; color:#38bdf8;">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
        '<path class="anim-shat-wave-1" d="M2 9c3-2 6-2 10 0s6 2 10 0" filter="drop-shadow(0 0 5px rgba(56, 189, 248, 0.7))"/>' +
        '<path class="anim-shat-wave-2" d="M2 15c3-2 6-2 10 0s6 2 10 0" opacity="0.75"/>' +
        '<circle class="anim-bubble-1" cx="8" cy="6" r="1.2" fill="#38bdf8"/>' +
        '<circle class="anim-bubble-2" cx="16" cy="11" r="1.5" fill="#38bdf8"/>' +
        '</svg></span>';
    },

    pranayama: function () {
      return '<span class="app-icon" style="width:36px; height:36px; color:#67e8f9;">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">' +
        '<circle class="anim-prana-core" cx="12" cy="12" r="2" fill="currentColor"/>' +
        '<circle class="anim-prana-ring-1" cx="12" cy="12" r="6" stroke-dasharray="2 3"/>' +
        '<circle class="anim-prana-ring-2" cx="12" cy="12" r="9" stroke-dasharray="4 4"/>' +
        '</svg></span>';
    },

    philosophy: function () {
      return '<span class="app-icon" style="width:36px; height:36px; color:#fde047;">' +
        '<svg class="anim-dharma-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="12" r="9.5" opacity="0.4" stroke-dasharray="3 2"/>' +
        '<circle cx="12" cy="12" r="8"/>' +
        '<path d="M12 4v16M4 12h16M6.34 6.34l11.32 11.32M6.34 17.66L17.66 6.34"/>' +
        '<circle class="anim-dharma-core" cx="12" cy="12" r="2.5" fill="#fde047" stroke="#ffffff" stroke-width="0.8"/>' +
        '</svg></span>';
    },

    library: function () {
      return '<span class="app-icon" style="width:36px; height:36px; color:#c084fc;">' +
        '<svg class="anim-stack-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M3 18l9 3 9-3v-2L12 19 3 16v2z" fill="rgba(192, 132, 252, 0.15)"/>' +
        '<path d="M3 16l9 3 9-3"/>' +
        '<path d="M5 13l7 2.5 7-2.5v-2L12 13 5 10.5v2.5z" fill="rgba(192, 132, 252, 0.25)"/>' +
        '<path d="M5 10.5l7 2.5 7-2.5"/>' +
        '<path d="M7 8l5 2 5-2v-2L12 8 7 6v2z" fill="rgba(192, 132, 252, 0.38)"/>' +
        '<path d="M7 6l5 2 5-2"/>' +
        '</svg></span>';
    },

    meditation: function () {
      return '<span class="app-icon" style="width:36px; height:36px; color:#fb7185;">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="5" r="2" fill="currentColor"/>' +
        '<path d="M12 7.5c-2 1-4 3.5-4 6.5h8c0-3-2-5.5-4-6.5z" fill="rgba(251, 113, 133, 0.22)"/>' +
        '<path d="M5 19c2-2 4-3 7-3s5 1 7 3"/>' +
        '<circle class="anim-breathe" cx="12" cy="12" r="9" stroke-dasharray="2 3" opacity="0.6"/>' +
        '</svg></span>';
    },

    builder: function () {
      return '<span class="app-icon" style="width:32px; height:32px; color:#94a3b8;">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="12" r="3"/>' +
        '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' +
        '</svg></span>';
    }
  };

  window.ICONS = ICONS;

  window.getIcon = function (name, color) {
    if (typeof ICONS[name] === 'function') {
      return ICONS[name](color);
    }
    return '';
  };

  // Безопасный рендеринг: НЕ трогает уже существующие SVG, исключая дергание анимаций
  window.initIcons = function (container, force) {
    container = container || document;
    var elements = container.querySelectorAll('[data-icon]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-icon');
      
      // Если иконка с таким ключом уже отрендерена и не запрошен force-сброс — пропускаем!
      if (!force && el.getAttribute('data-rendered-icon') === key && el.querySelector('svg')) {
        continue;
      }
      
      if (typeof ICONS[key] === 'function') {
        el.innerHTML = ICONS[key]();
        el.setAttribute('data-rendered-icon', key);
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.initIcons();
    });
  } else {
    window.initIcons();
  }
})();