/**
 * ГЛАВНАЯ ТОЧКА ВХОДА ПРИЛОЖЕНИЯ (Vanilla JS)
 * Файл: src/main.js
 * Включает автоскролл к кнопке «Назад» и каскадное появление результатов тестов
 */

(function () {
  'use strict';

  var tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

  // -------------------------------------------------------------
  // 1. СТИЛИ КАСКАДНОЙ АНИМАЦИИ ВЫДАЧИ РЕЗУЛЬТАТОВ (БЕЗ ЗВУКА)
  // -------------------------------------------------------------
  function injectCascadeStyles() {
    if (document.getElementById('cascade-results-style')) return;
    var styleEl = document.createElement('style');
    styleEl.id = 'cascade-results-style';
    styleEl.textContent = `
      /* Плавный контейнер результатов */
      .cascade-reveal {
        display: block !important;
        opacity: 1 !important;
        scroll-margin-top: 18px;
      }

      /* Поочередное каскадное проявление дочерних блоков */
      .cascade-reveal > * {
        opacity: 0;
        transform: translateY(16px) scale(0.98);
        filter: blur(3px);
        animation: resultCascadeItem 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      .cascade-reveal > *:nth-child(1) { animation-delay: 0.04s; } /* Главная цифра */
      .cascade-reveal > *:nth-child(2) { animation-delay: 0.14s; } /* Статус бейдж */
      .cascade-reveal > *:nth-child(3) { animation-delay: 0.24s; } /* Шкала / БЖУ / график */
      .cascade-reveal > *:nth-child(4) { animation-delay: 0.34s; } /* Строки параметров */
      .cascade-reveal > *:nth-child(5) { animation-delay: 0.44s; } /* Кнопка Stories */
      .cascade-reveal > *:nth-child(n+6) { animation-delay: 0.54s; }

      @keyframes resultCascadeItem {
        from {
          opacity: 0;
          transform: translateY(18px) scale(0.97);
          filter: blur(4px);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
      }

      /* Мягкий акцент для числа */
      .cascade-reveal .result-hero-num,
      .cascade-reveal .result-value,
      .cascade-reveal h2,
      .cascade-reveal .hero-val {
        animation: glowPopNumber 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      @keyframes glowPopNumber {
        0% { transform: scale(0.92); opacity: 0; }
        60% { transform: scale(1.04); }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(styleEl);
  }

  // -------------------------------------------------------------
  // 2. УНИВЕРСАЛЬНЫЙ АВТОСКРОЛЛ К ШАПКЕ / КНОПКЕ «НАЗАД»
  // -------------------------------------------------------------
  function scrollToScreenHeader(container) {
    if (!container) return;
    setTimeout(function () {
      var backBtn = container.querySelector(
        '.btn-back, .back-btn, [data-back], [data-route-back], .calc-top-bar, .section-title-wrap, .sheet-header, h2, h3'
      ) || container;

      var rect = backBtn.getBoundingClientRect();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // Оставляем комфортные 14px сверху экрана
      var targetY = rect.top + scrollTop - 14;

      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth'
      });
    }, 70);
  }

  // -------------------------------------------------------------
  // 3. ПЛАВНЫЙ СПУСК И ЗАПУСК КАСКАДА ДЛЯ РЕЗУЛЬТАТОВ
  // -------------------------------------------------------------
  function showResultsWithCascade(resultsContainer) {
    var container = typeof resultsContainer === 'string'
      ? document.querySelector(resultsContainer)
      : resultsContainer;

    if (!container) return;

    // Сброс и перезапуск каскада
    container.classList.remove('cascade-reveal');
    void container.offsetWidth; // force reflow
    container.classList.add('cascade-reveal');

    if (window.haptic) {
      window.haptic('success');
    }

    // Мягкий спуск к карточке результата
    setTimeout(function () {
      container.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 90);
  }

  // Делегирование кликов по всем кнопкам «Рассчитать» / «Оценить»
  function initCalculateButtonInterceptor() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('button, .btn, .btn-primary, [type="submit"]');
      if (!btn) return;

      var txt = (btn.textContent || '').trim().toLowerCase();
      var isCalcBtn = txt.indexOf('рассчитать') !== -1 ||
                      txt.indexOf('оценить') !== -1 ||
                      txt.indexOf('расчет') !== -1 ||
                      txt.indexOf('завершить') !== -1 ||
                      btn.classList.contains('btn-calc');

      if (isCalcBtn) {
        var screen = btn.closest('.screen, .card, .calc-screen, .calculator-form, form') || 
                     btn.parentElement.parentElement;

        setTimeout(function () {
          var results = screen.querySelector('.results, #results, .result-card, .test-results, [id*="result"]');
          if (results) {
            showResultsWithCascade(results);
          }
        }, 90);
      }
    });
  }

  // -------------------------------------------------------------
  // 4. ТАКТИЛЬНОСТЬ, ТЕМЫ И КНОПКА НАВЕРХ
  // -------------------------------------------------------------
  function initHapticEngine() {
    window.haptic = function (type) {
      type = type || 'light';
      try {
        if (tg && tg.HapticFeedback) {
          if (type === 'selection') {
            tg.HapticFeedback.selectionChanged();
          } else if (type === 'error' || type === 'success' || type === 'warning') {
            tg.HapticFeedback.notificationOccurred(type);
          } else {
            tg.HapticFeedback.impactOccurred(type);
          }
        }
      } catch (e) {
        console.warn('[Haptic] Ошибка вибрации:', e);
      }
    };
  }

  function initThemeEngine() {
    var savedTheme = localStorage.getItem('fz_app_theme') || 'dark';
    applyTheme(savedTheme);

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-theme], [data-theme-set]');
      if (!btn) return;

      var theme = btn.getAttribute('data-theme') || btn.getAttribute('data-theme-set');
      if (theme) {
        applyTheme(theme);
        window.haptic('selection');

        var dropdown = document.getElementById('theme-dropdown');
        if (dropdown) dropdown.removeAttribute('open');
      }
    });
  }

  function applyTheme(theme) {
    document.body.classList.remove('theme-dark', 'theme-light', 'theme-accessible');
    document.body.classList.add('theme-' + theme);

    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('fz_app_theme', theme);

    var iconEl = document.getElementById('theme-icon') || document.getElementById('theme-active-icon');
    if (iconEl) {
      if (theme === 'dark') iconEl.textContent = '🌙';
      else if (theme === 'light') iconEl.textContent = '☀️';
      else if (theme === 'accessible') iconEl.textContent = '👁️';
    }

    if (window.initIcons) {
      window.initIcons();
    }
  }

  function initScrollToTop() {
    var btn = document.getElementById('scroll-to-top') || document.getElementById('scroll-to-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 320) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.haptic('light');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------------
  // 5. МЕНЕДЖЕР МОНТИРОВАНИЯ КАЛЬКУЛЯТОРОВ И ЙОГИ
  // -------------------------------------------------------------
  var AppManager = {
    renderCalculator: function (testId, container) {
      if (!container) return;
      var cleanId = testId.replace(/^screen-/, '');

      var mountMap = {
        'bmi': window.mountBmiScreen,
        'bmr': window.mountBmrScreen,
        'water': window.mountWaterScreen,
        'kerdo': window.mountKerdoScreen,
        'stange': window.mountStangeScreen,
        'karvonen': window.mountKarvonenScreen,
        'rufier': window.mountRufierScreen,
        'romberg': window.mountRombergScreen,
        'kvas': window.mountKvasScreen,
        'sleep': window.mountSleepScreen || window.mountSleepCalc
      };

      var mountFn = mountMap[cleanId];
      if (typeof mountFn === 'function') {
        mountFn(container);
      } else {
        container.innerHTML = '<div class="card" style="text-align:center; padding:30px 15px;">' +
          '<p style="color:var(--text-muted, #94a3b8);">Модуль "' + cleanId + '" подключается...</p>' +
          '</div>';
      }

      if (window.initIcons) {
        window.initIcons(container);
      }

      // ПЛАВНЫЙ СПУСК: Кнопка «Назад» встает строго под верхнюю границу экрана
      scrollToScreenHeader(container);
    },

    renderYogaSubview: function (subviewId, container) {
      if (!container) return;
      var cleanId = subviewId.replace(/^subview-/, '');

      var yogaMap = {
        'asanas': function (c) {
          if (window.YogaAsanas && typeof window.YogaAsanas.renderAsanasTab === 'function') {
            window.YogaAsanas.renderAsanasTab(c);
          } else if (typeof window.renderAsanasTab === 'function') {
            window.renderAsanasTab(c);
          } else if (typeof window.initAsanasModule === 'function') {
            window.initAsanasModule(c);
          }
        },
        'shatkarmas': function (c) {
          if (typeof window.renderShatkarmasTab === 'function') {
            window.renderShatkarmasTab(c);
          } else if (typeof window.initShatkarmasModule === 'function') {
            window.initShatkarmasModule(c);
          }
        },
        'pranayama': function (c) {
          if (typeof window.renderPranayamaTab === 'function') {
            window.renderPranayamaTab(c);
          } else if (typeof window.initPranayamaModule === 'function') {
            window.initPranayamaModule(c);
          }
        },
        'philosophy': function (c) {
          if (typeof window.renderYogaPhilosophy === 'function') {
            window.renderYogaPhilosophy(c);
          } else if (typeof window.initPhilosophyModule === 'function') {
            window.initPhilosophyModule(c);
          }
        },
        'library': function (c) {
          if (typeof window.renderLibraryScreen === 'function') {
            window.renderLibraryScreen(c);
          } else if (typeof window.initLibraryModule === 'function') {
            window.initLibraryModule(c);
          }
        },
        'books': function (c) {
          if (typeof window.renderLibraryScreen === 'function') {
            window.renderLibraryScreen(c);
          }
        }
      };

      var renderFn = yogaMap[cleanId];
      if (typeof renderFn === 'function') {
        renderFn(container);
      } else {
        container.innerHTML = '<div class="card" style="text-align:center; padding:30px 15px;">' +
          '<p style="color:var(--text-muted, #94a3b8);">Раздел йоги "' + cleanId + '" загружается...</p>' +
          '</div>';
      }

      if (window.initIcons) {
        window.initIcons(container);
      }

      // ПЛАВНЫЙ СПУСК: Кнопка «Назад» встает строго под верхнюю границу экрана
      scrollToScreenHeader(container);
    }
  };

  window.App = AppManager;
  window.scrollToScreenHeader = scrollToScreenHeader;
  window.showResultsWithCascade = showResultsWithCascade;

  // -------------------------------------------------------------
  // 6. СТАРТ ПРИЛОЖЕНИЯ
  // -------------------------------------------------------------
  function initApp() {
    console.log('[Fizra & Yoga] Инициализация ядра...');

    injectCascadeStyles();
    initHapticEngine();
    initThemeEngine();
    initScrollToTop();
    initCalculateButtonInterceptor();

    if (tg) {
      tg.ready();
      tg.expand();
    }
    if (window.telegramService && typeof window.telegramService.init === 'function') {
      window.telegramService.init();
    }

    // Регистрация маршрутов в Router
    if (window.Router) {
      var zojTests = ['bmi', 'bmr', 'water', 'kerdo', 'stange', 'karvonen', 'rufier', 'romberg', 'kvas', 'sleep'];
      zojTests.forEach(function (id) {
        window.Router.registerAction(id, function (container) {
          AppManager.renderCalculator(id, container);
        });
      });

      var yogaTabs = ['asanas', 'shatkarmas', 'pranayama', 'philosophy', 'library', 'books'];
      yogaTabs.forEach(function (id) {
        window.Router.registerYogaTab(id, function (container) {
          AppManager.renderYogaSubview(id, container);
        });
      });

      window.appRouter = window.Router;
      window.Router.init();
    }

    if (typeof window.getAllAsanas === 'function') {
      window.getAllAsanas();
    }

    if (window.initIcons) {
      window.initIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
