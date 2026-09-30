/**
 * ГЛАВНАЯ ТОЧКА ВХОДА ПРИЛОЖЕНИЯ (Vanilla JS)
 * Файл: src/main.js
 */

(function () {
  'use strict';

  var tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

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
        console.warn('[Haptic] Ошибка вызова вибрации:', e);
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
    var btn = document.getElementById('scroll-to-top');
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

  /**
   * Менеджер монтирования калькуляторов и йоги
   */
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
    }
  };

  window.App = AppManager;

  function initApp() {
    console.log('[Fizra & Yoga] Инициализация ядра...');

    initHapticEngine();
    initThemeEngine();
    initScrollToTop();

    if (tg) {
      tg.ready();
      tg.expand();
    }
    if (window.telegramService && typeof window.telegramService.init === 'function') {
      window.telegramService.init();
    }

    // Регистрация всех связей в Router
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