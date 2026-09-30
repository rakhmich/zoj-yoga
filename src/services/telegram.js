/**
 * СЕРВИС ИНТЕГРАЦИИ С TELEGRAM WEBAPP SDK
 * Путь: src/services/telegram.js
 * Обеспечивает безопасное взаимодействие с Telegram API с поддержкой браузерного фалбэка.
 */

(function () {
  'use strict';

  class TelegramService {
    constructor() {
      this.webApp = typeof window !== 'undefined' && window.Telegram?.WebApp ? window.Telegram.WebApp : null;
      this.isAvailable = Boolean(this.webApp);
      this.init();
    }

    /**
     * Первичная инициализация SDK и настройка внешнего вида
     */
    init() {
      if (!this.isAvailable) {
        console.warn('[TelegramService] Telegram WebApp SDK не обнаружен. Включен автономный режим фалбэка.');
        return;
      }

      try {
        // Уведомляем Telegram о готовности приложения
        this.webApp.ready();

        // Разворачиваем приложение на весь экран
        this.webApp.expand();

        // Синхронизируем цвета фонов с темой Telegram
        if (this.webApp.setHeaderColor) {
          this.webApp.setHeaderColor('#060913');
        }
        if (this.webApp.setBackgroundColor) {
          this.webApp.setBackgroundColor('#060913');
        }

        console.log('[TelegramService] Telegram WebApp SDK успешно инициализирован.');
      } catch (e) {
        console.error('[TelegramService] Ошибка при инициализации Telegram SDK:', e);
      }
    }

    /**
     * Тактильный отклик (Haptic Feedback)

     * @param {string} [type='light'] - 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'selection' | 'success' | 'warning' | 'error'
     */
    hapticImpact(type = 'light') {
      if (!this.isAvailable || !this.webApp.HapticFeedback) return;

      try {
        if (type === 'selection') {
          this.webApp.HapticFeedback.selectionChanged();
        } else if (['error', 'success', 'warning'].includes(type)) {
          this.webApp.HapticFeedback.notificationOccurred(type);
        } else {
          this.webApp.HapticFeedback.impactOccurred(type);
        }
      } catch (e) {
        console.warn('[TelegramService] Ошибка вызова HapticFeedback:', e);
      }
    }

    /**
     * Настройка нативной кнопки "Назад" в Telegram
     * @param {Function} onClickCallback - Функция обратного вызова при клике
     */
    showBackButton(onClickCallback) {
      if (!this.isAvailable || !this.webApp.BackButton) return;

      try {
        this.webApp.BackButton.onClick(onClickCallback);
        this.webApp.BackButton.show();
      } catch (e) {
        console.warn('[TelegramService] Ошибка управления BackButton:', e);
      }
    }

    /**
     * Скрыть нативную кнопку "Назад"
     */
    hideBackButton() {
      if (!this.isAvailable || !this.webApp.BackButton) return;

      try {
        this.webApp.BackButton.hide();
      } catch (e) {
        console.warn('[TelegramService] Ошибка скрытия BackButton:', e);
      }
    }

    /**
     * Показать главную кнопку внизу экрана (MainButton)
     */
    showMainButton(text, onClickCallback) {
      if (!this.isAvailable || !this.webApp.MainButton) return;

      try {
        this.webApp.MainButton.setText(text);
        this.webApp.MainButton.onClick(onClickCallback);
        this.webApp.MainButton.show();
      } catch (e) {
        console.warn('[TelegramService] Ошибка управления MainButton:', e);
      }
    }

    /**
     * Скрыть главную кнопку
     */
    hideMainButton() {
      if (!this.isAvailable || !this.webApp.MainButton) return;

      try {
        this.webApp.MainButton.hide();
      } catch (e) {
        console.warn('[TelegramService] Ошибка скрытия MainButton:', e);
      }
    }

    /**
     * Закрытие приложения
     */
    closeApp() {
      if (this.isAvailable) {
        this.webApp.close();
      }
    }
  }

  const tgServiceInst = new TelegramService();
  window.TelegramService = TelegramService;
  window.telegramService = tgServiceInst;

  // Глобальный алиас haptic
  if (!window.haptic) {
    window.haptic = function (type) {
      tgServiceInst.hapticImpact(type);
    };
  }
})();