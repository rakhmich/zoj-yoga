/**
 * Единый универсальный маршрутизатор (ЗОЖ, Йога, Калькуляторы, Табы)
 * Файл: src/core/router.js
 */
(function () {
  'use strict';

  var tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

  var Router = {
    _initialized: false,      // Защита от дублирования событий
    mode: 'zoj',              // 'zoj' | 'yoga'
    currentScreen: 'screen-zoj',
    history: ['screen-zoj'],

    actions: {},              // Реестр калькуляторов из main.js
    yogaTabs: {},             // Реестр вкладок йоги из main.js

    init: function () {
      if (this._initialized) return;
      this._initialized = true;

      this.bindEvents();
      this.setupTelegramNav();

      this.applyMode(this.mode);
      this.showScreen('screen-zoj');
    },

    // ------------------------------------------------------------------------
    // ПРИЕМ МАРШРУТОВ ИЗ main.js
    // ------------------------------------------------------------------------
    registerAction: function (actionId, handler) {
      if (typeof handler !== 'function') return;
      var clean = actionId.replace(/^screen-/, '');
      this.actions[actionId] = handler;
      this.actions[clean] = handler;
      this.actions['screen-' + clean] = handler;
    },

    registerYogaTab: function (tabId, handler) {
      if (typeof handler !== 'function') return;
      this.yogaTabs[tabId] = handler;
      if (tabId === 'books') this.yogaTabs['library'] = handler;
      if (tabId === 'library') this.yogaTabs['books'] = handler;
    },

    // ------------------------------------------------------------------------
    // ЕДИНСТВЕННЫЙ ОБРАБОТЧИК КЛИКОВ НА СТРАНИЦЕ
    // ------------------------------------------------------------------------
    bindEvents: function () {
      var self = this;

      document.addEventListener('click', function (e) {
        // 1. Кнопка смены режима ЗОЖ ⇄ Йога
        var toggleBtn = e.target.closest('#btn-mode-toggle, #btn-switch-module, .btn-mode-toggle');
        if (toggleBtn) {
          e.preventDefault();
          e.stopPropagation();
          self.haptic('light');
          self.toggleMode();
          return;
        }

        // 2. Кнопка «Назад»
        var backBtn = e.target.closest('#btn-calc-back, #btn-yoga-back, .back-btn');
        if (backBtn) {
          e.preventDefault();
          e.stopPropagation();
          self.haptic('light');
          self.back();
          return;
        }

        // 3. Карточки калькуляторов ЗОЖ
        var actionCard = e.target.closest('[data-action]');
        if (actionCard && actionCard.dataset.action && actionCard.dataset.action !== 'toggle-mode') {
          e.preventDefault();
          e.stopPropagation();
          self.haptic('medium');
          self.openCalc(actionCard.dataset.action);
          return;
        }

        // 4. Карточки подразделов Йоги
        var yogaCard = e.target.closest('[data-yoga-subview], [data-yoga-tab], [data-subview]');
        if (yogaCard) {
          var subview = yogaCard.dataset.yogaSubview || yogaCard.dataset.yogaTab || yogaCard.dataset.subview;
          if (subview) {
            e.preventDefault();
            e.stopPropagation();
            self.haptic('medium');
            self.openYoga(subview);
            return;
          }
        }
      });
    },

    setupTelegramNav: function () {
      var self = this;
      if (!tg || !tg.BackButton) return;

      tg.BackButton.onClick(function () {
        self.haptic('light');
        self.back();
      });
    },

    haptic: function (type) {
      if (window.haptic) {
        window.haptic(type);
      } else if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(type || 'light');
      }
    },

    // ------------------------------------------------------------------------
    // ПЕРЕКЛЮЧЕНИЕ РЕЖИМОВ (ЗОЖ ⇄ ЙОГА)
    // ------------------------------------------------------------------------
    toggleMode: function () {
      this.mode = (this.mode === 'zoj') ? 'yoga' : 'zoj';
      this.history = [this.mode === 'yoga' ? 'screen-yoga' : 'screen-zoj'];

      this.applyMode(this.mode);

      if (this.mode === 'yoga') {
        var hub = document.getElementById('yoga-hub-grid');
        var sub = document.getElementById('yoga-subview-container');
        if (hub) hub.style.setProperty('display', 'grid', 'important');
        if (sub) {
          sub.style.setProperty('display', 'none', 'important');
          sub.innerHTML = '';
        }
        this.showScreen('screen-yoga');
      } else {
        this.showScreen('screen-zoj');
      }

      this.updateBackButton();
    },

    applyMode: function (mode) {
      var isYoga = (mode === 'yoga');

      document.body.setAttribute('data-mode', mode);
      document.documentElement.setAttribute('data-mode', mode);
      document.body.classList.toggle('mode-yoga', isYoga);

      var title = document.getElementById('header-title');
      if (title) title.textContent = isYoga ? 'Пространство йоги' : 'Физкультура и ЗОЖ';

      var btnText = document.getElementById('mode-toggle-text') || document.getElementById('module-switch-text');
      if (btnText) btnText.textContent = isYoga ? 'В модуль ЗОЖ ➔' : 'В модуль йоги ➔';

      var avatar = document.getElementById('header-avatar');
      if (avatar && window.ICONS) {
        avatar.innerHTML = isYoga ? window.ICONS.yogaPose() : window.ICONS.pulseHeader();
        avatar.setAttribute('data-rendered-icon', isYoga ? 'yogaPose' : 'pulseHeader');
      }

      var icon = document.getElementById('mode-toggle-icon');
      if (icon && window.ICONS) {
        icon.innerHTML = isYoga ? window.ICONS.pulseHeader() : window.ICONS.yogaPose();
        icon.setAttribute('data-rendered-icon', isYoga ? 'pulseHeader' : 'yogaPose');
      }
    },

    // ------------------------------------------------------------------------
    // ОТКРЫТИЕ КАЛЬКУЛЯТОРА
    // ------------------------------------------------------------------------
    openCalc: function (actionId) {
      var clean = actionId.replace(/^screen-/, '');
      var fullId = 'screen-' + clean;

      this.currentScreen = 'screen-calculator';
      this.history.push('calc:' + fullId);

      this.showScreen('screen-calculator');

      var container = document.getElementById('calculator-content');
      if (container) {
        container.innerHTML = '<div id="' + fullId + '" class="active-screen"></div>';
        var host = container.firstElementChild;

        // 1. Поиск функции, зарегистрированной в main.js
        var handler = this.actions[fullId] || this.actions[clean];
        if (typeof handler === 'function') {
          handler(host);
        } else {
          // 2. Запасной прямой вызов функций
          var fnName = 'mount' + clean.charAt(0).toUpperCase() + clean.slice(1) + 'Screen';
          if (typeof window[fnName] === 'function') {
            window[fnName](host);
          } else if (window.App && typeof window.App.renderCalculator === 'function') {
            window.App.renderCalculator(clean, host);
          } else {
            host.innerHTML = '<div class="card" style="text-align:center; padding:30px 15px;">' +
              '<p style="color:var(--text-muted,#94a3b8);">Раздел калькулятора загружается...</p>' +
              '</div>';
          }
        }

        if (window.initIcons) window.initIcons(host);
      }

      this.updateBackButton();
    },

 // ------------------------------------------------------------------------
    // ОТКРЫТИЕ ПОДРАЗДЕЛА ЙОГИ
    // ------------------------------------------------------------------------
    openYoga: function (tabId) {
      var clean = tabId.replace(/^subview-/, '');
      this.currentScreen = 'yoga-subview';
      this.history.push('yoga:' + clean);

      if (this.mode !== 'yoga') {
        this.mode = 'yoga';
        this.applyMode('yoga');
      }

      this.showScreen('screen-yoga');

      var hub = document.getElementById('yoga-hub-grid');
      var sub = document.getElementById('yoga-subview-container');
      if (hub) hub.style.setProperty('display', 'none', 'important');

      if (sub) {
        sub.style.setProperty('display', 'block', 'important');
        sub.innerHTML = 
          '<div class="header-nav" style="margin-bottom:12px;">' +
            '<button type="button" class="back-btn" id="btn-yoga-back"><span>←</span> <span>Назад в хаб йоги</span></button>' +
          '</div>' +
          '<div id="yoga-tab-content"></div>';

        var content = sub.querySelector('#yoga-tab-content');

        // 1. Поиск зарегистрированного обработчика
        var handler = this.yogaTabs[clean];
        if (typeof handler === 'function') {
          handler(content);
        } else if (window.App && typeof window.App.renderYogaSubview === 'function') {
          // 2. Страховка через AppManager
          window.App.renderYogaSubview(clean, content);
        } else {
          // 3. Прямой вызов функций йоги
          if (clean === 'asanas' && window.YogaAsanas && window.YogaAsanas.renderAsanasTab) {
            window.YogaAsanas.renderAsanasTab(content);
          } else if (clean === 'shatkarmas' && typeof window.renderShatkarmasTab === 'function') {
            window.renderShatkarmasTab(content);
          } else if (clean === 'pranayama' && typeof window.renderPranayamaTab === 'function') {
            window.renderPranayamaTab(content);
          } else if (clean === 'philosophy' && typeof window.renderYogaPhilosophy === 'function') {
            window.renderYogaPhilosophy(content);
          } else if ((clean === 'library' || clean === 'books') && typeof window.renderLibraryScreen === 'function') {
            window.renderLibraryScreen(content);
          } else {
            content.innerHTML = '<div class="card" style="text-align:center; padding:30px 15px;">' +
              '<p style="color:var(--text-muted,#94a3b8);">Раздел йоги наполняется...</p>' +
              '</div>';
          }
        }

        if (window.initIcons) window.initIcons(sub);
      }

      this.updateBackButton();
    },

    // ------------------------------------------------------------------------
    // ПРЯМОЕ ПЕРЕКЛЮЧЕНИЕ DISPLAY У ЭКРАНОВ
    // ------------------------------------------------------------------------
    showScreen: function (screenId) {
      var screens = document.querySelectorAll('.view-screen, main.view-screen');
      for (var i = 0; i < screens.length; i++) {
        var s = screens[i];
        if (s.id === screenId) {
          s.style.setProperty('display', 'block', 'important');
          s.classList.add('active-screen');
        } else {
          s.style.setProperty('display', 'none', 'important');
          s.classList.remove('active-screen');
        }
      }

      window.scrollTo(0, 0);
      if (window.initIcons) window.initIcons();
    },

    // ------------------------------------------------------------------------
    // НАВИГАЦИЯ НАЗАД
    // ------------------------------------------------------------------------
    back: function () {
      if (this.history.length > 1) {
        this.history.pop();
        var prev = this.history[this.history.length - 1];

        if (prev === 'screen-zoj') {
          this.mode = 'zoj';
          this.applyMode('zoj');
          this.showScreen('screen-zoj');
        } else if (prev === 'screen-yoga') {
          this.mode = 'yoga';
          this.applyMode('yoga');
          var hub = document.getElementById('yoga-hub-grid');
          var sub = document.getElementById('yoga-subview-container');
          if (hub) hub.style.setProperty('display', 'grid', 'important');
          if (sub) {
            sub.style.setProperty('display', 'none', 'important');
            sub.innerHTML = '';
          }
          this.showScreen('screen-yoga');
        } else if (prev.indexOf('calc:') === 0) {
          this.openCalc(prev.replace('calc:', ''));
        } else if (prev.indexOf('yoga:') === 0) {
          this.openYoga(prev.replace('yoga:', ''));
        }
      } else {
        if (this.mode === 'yoga') {
          this.toggleMode();
        } else {
          this.showScreen('screen-zoj');
        }
      }

      this.updateBackButton();
    },

    updateBackButton: function () {
      var isRoot = (this.history.length <= 1);

      if (tg && tg.BackButton) {
        if (isRoot) {
          tg.BackButton.hide();
        } else {
          tg.BackButton.show();
        }
      }
    }
  };

  // Экспорт для main.js
  window.Router = Router;
  window.appRouter = Router;

  // Автостарт
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      Router.init();
    });
  } else {
    Router.init();
  }
})();