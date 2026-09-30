/**
 * ГЛАВНАЯ ТОЧКА ВХОДА ПРИЛОЖЕНИЯ (Vanilla JS)
 * Файл: src/main.js
 * С идеальным таймингом скролла и адаптивным запуском Mini App
 */

(function () {
  'use strict';

  var tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  const BOT_USERNAME = 'zoj_tl_bot';

  // -------------------------------------------------------------
  // 1. СТИЛИ КАСКАДНОЙ АНИМАЦИИ (ПОЯВЛЯЮТСЯ ТОЛЬКО ПОСЛЕ СКРОЛЛА)
  // -------------------------------------------------------------
  function injectCascadeStyles() {
    if (document.getElementById('cascade-results-style')) return;
    var styleEl = document.createElement('style');
    styleEl.id = 'cascade-results-style';
    styleEl.textContent = `
      /* Начальное состояние ожидания скролла */
      .results-waiting {
        opacity: 0 !important;
        visibility: hidden !important;
      }

      /* Активное каскадное появление */
      .cascade-reveal {
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
      }

      /* Поочередный вылет блоков */
      .cascade-reveal > * {
        opacity: 0;
        transform: translateY(22px) scale(0.97);
        filter: blur(4px);
        animation: resultCascadeItem 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      .cascade-reveal > *:nth-child(1) { animation-delay: 0.08s; } /* Главная цифра */
      .cascade-reveal > *:nth-child(2) { animation-delay: 0.22s; } /* Статус бейдж */
      .cascade-reveal > *:nth-child(3) { animation-delay: 0.36s; } /* Шкала / БЖУ / График */
      .cascade-reveal > *:nth-child(4) { animation-delay: 0.50s; } /* Строки параметров */
      .cascade-reveal > *:nth-child(5) { animation-delay: 0.64s; } /* Кнопка Stories */
      .cascade-reveal > *:nth-child(n+6) { animation-delay: 0.78s; }

      @keyframes resultCascadeItem {
        from {
          opacity: 0;
          transform: translateY(22px) scale(0.96);
          filter: blur(5px);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
      }

      /* Неоновый акцент на числе */
      .cascade-reveal .result-hero-num,
      .cascade-reveal .result-value,
      .cascade-reveal h2,
      .cascade-reveal .hero-val {
        animation: glowPopNumber 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      @keyframes glowPopNumber {
        0% { transform: scale(0.88); opacity: 0; }
        65% { transform: scale(1.05); }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(styleEl);
  }

  // -------------------------------------------------------------
  // 2. АВТОСКРОЛЛ К ШАПКЕ / КНОПКЕ «НАЗАД» ПРИ ВХОДЕ В ТЕСТ
  // -------------------------------------------------------------
  function scrollToScreenHeader(container) {
    if (!container) return;
    setTimeout(function () {
      var backBtn = container.querySelector(
        '.btn-back, .back-btn, [data-back], [data-route-back], .calc-top-bar, .section-title-wrap, .sheet-header, h2, h3'
      ) || container;

      var rect = backBtn.getBoundingClientRect();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var targetY = rect.top + scrollTop - 12;

      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth'
      });
    }, 70);
  }

  // -------------------------------------------------------------
  // 3. СНАЧАЛА СКРОЛЛ, ЗАТЕМ КАСКАД РЕЗУЛЬТАТОВ (БЕЗ СПЕШКИ)
  // -------------------------------------------------------------
  function showResultsWithCascade(resultsContainer) {
    var container = typeof resultsContainer === 'string'
      ? document.querySelector(resultsContainer)
      : resultsContainer;

    if (!container) return;

    // 1. Делаем контейнер видимым для верстки, но прозрачным для глаз
    container.style.display = 'block';
    container.classList.remove('cascade-reveal');
    container.classList.add('results-waiting');

    // 2. Запускаем мягкий спуск экрана вниз ровно к результатам
    var rect = container.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var targetScrollY = rect.top + scrollTop - 20;

    window.scrollTo({
      top: Math.max(0, targetScrollY),
      behavior: 'smooth'
    });

    // 3. Задержка 350мс: скролл успевает доехать, и перед глазами раскрывается каскад
    setTimeout(function () {
      container.classList.remove('results-waiting');
      void container.offsetWidth; // force reflow
      container.classList.add('cascade-reveal');

      if (window.haptic) {
        window.haptic('success');
      }
    }, 350);
  }

  // Перехват кликов по кнопкам «Рассчитать» / «Оценить»
  function initCalculateButtonInterceptor() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('button, .btn, .btn-primary, .calc-btn, [type="submit"]');
      if (!btn) return;

      var txt = (btn.textContent || '').trim().toLowerCase();
      var isCalcBtn = txt.indexOf('рассчитать') !== -1 ||
                      txt.indexOf('оценить') !== -1 ||
                      txt.indexOf('расчет') !== -1 ||
                      txt.indexOf('завершить') !== -1 ||
                      btn.classList.contains('calc-btn');

      if (isCalcBtn) {
        var screen = btn.closest('.screen, .card, .calc-screen, .calculator-form, form') || 
                     btn.parentElement.parentElement;

        setTimeout(function () {
          var results = screen.querySelector('.results, #results, .result-card, .test-results, [id*="result"]');
          if (results) {
            showResultsWithCascade(results);
          }
        }, 80);
      }
    });
  }

  // -------------------------------------------------------------
  // 4. ТАКТИЛЬНОСТЬ, ТЕМЫ И КНОПКА «НАВЕРХ»
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
  // 5. МОНТИРОВАНИЕ КАЛЬКУЛЯТОРОВ И ЙОГИ
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

      // Доводка до кнопки «Назад»
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

      // Доводка до кнопки «Назад»
      scrollToScreenHeader(container);
    }
  };

  window.App = AppManager;
  window.scrollToScreenHeader = scrollToScreenHeader;
  window.showResultsWithCascade = showResultsWithCascade;

  // Адаптивное открытие калькулятора через Mini App (без ввода /start)
  window.openMiniAppTest = function (testId) {
    var deepLink = `https://t.me/${BOT_USERNAME}/app?startapp=${testId || 'calc'}`;
    if (tg && typeof tg.openTelegramLink === 'function') {
      tg.openTelegramLink(deepLink);
    } else {
      window.open(deepLink, '_blank');
    }
  };

  // -------------------------------------------------------------
  // 6. ИНИЦИАЛИЗАЦИЯ ЯДРА
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
