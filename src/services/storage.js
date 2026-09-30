/**
 * СЕРВИС ПОСТОЯННОГО ХРАНИЛИЩА ДАННЫХ (Storage Service)
 * Путь: src/services/storage.js
 * Поддерживает LocalStorage с фоновой синхронизацией в Telegram CloudStorage
 */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    PROFILE: 'fz_user_profile',
    HISTORY: 'fz_tests_history',
    FAVORITES: 'fz_favorites',
    SETTINGS: 'fz_app_settings'
  };

  const DEFAULT_PROFILE = {
    gender: 'male', // 'male' | 'female'
    age: 25, // лет
    height: 175, // см
    weight: 70, // кг
    activityLevel: 1.375 // коэффициент физической активности
  };

  const DEFAULT_SETTINGS = {
    currentMode: 'fizra', // 'fizra' | 'yoga'
    soundEnabled: true,
    hapticEnabled: true,
    theme: 'auto' // 'auto' | 'dark' | 'light' | 'accessible'
  };

  class StorageService {
    constructor() {
      this.cloudStorage = typeof window !== 'undefined' && window.Telegram?.WebApp?.CloudStorage 
        ? window.Telegram.WebApp.CloudStorage 
        : null;

      this.memoryCache = new Map();
      this.init();
    }

    /**
     * Инициализация хранилища и загрузка из облака при наличии
     */
    init() {
      // Прогрев кэша из LocalStorage
      this.memoryCache.set(STORAGE_KEYS.PROFILE, this._getLocal(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE));
      this.memoryCache.set(STORAGE_KEYS.HISTORY, this._getLocal(STORAGE_KEYS.HISTORY, []));
      this.memoryCache.set(STORAGE_KEYS.FAVORITES, this._getLocal(STORAGE_KEYS.FAVORITES, { asanas: [], books: [] }));
      this.memoryCache.set(STORAGE_KEYS.SETTINGS, this._getLocal(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS));

      // Миграция legacy-данных из старого app.js
      this._migrateLegacyProfile();

      // Асинхронная синхронизация с Telegram CloudStorage
      if (this.cloudStorage) {
        this._syncFromCloud();
      }
    }

    /**
     * Миграция старых ключей (fizra_weight, fizra_height и т.д.) из app.js
     */
    _migrateLegacyProfile() {
      try {
        const legacyWeight = localStorage.getItem('fizra_weight');
        const legacyHeight = localStorage.getItem('fizra_height');
        const legacyAge = localStorage.getItem('fizra_age');
        const legacyGender = localStorage.getItem('fizra_gender');

        if (legacyWeight || legacyHeight || legacyAge || legacyGender) {
          const patch = {};
          if (legacyWeight) patch.weight = legacyWeight;
          if (legacyHeight) patch.height = legacyHeight;
          if (legacyAge) patch.age = legacyAge;
          if (legacyGender) patch.gender = legacyGender;

          this.saveProfile(patch);

          ['fizra_weight', 'fizra_height', 'fizra_age', 'fizra_gender'].forEach((k) => localStorage.removeItem(k));
        }
      } catch (e) {
        console.warn('[Storage] Ошибка миграции устаревших ключей профиля:', e);
      }
    }

    // ==========================================================================
    // 1. ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
    // ==========================================================================

    /**
     * Получить профиль пользователя
     * @returns {Object}
     */
    getProfile() {
      return this.memoryCache.get(STORAGE_KEYS.PROFILE) || { ...DEFAULT_PROFILE };
    }

    /**
     * Получить профиль в формате плоского объекта для калькуляторов
     */
    getUserProfile() {
      const p = this.getProfile();
      return {
        weight: p.weight || '',
        height: p.height || '',
        age: p.age || '',
        gender: p.gender || 'male',
        activityLevel: p.activityLevel || 1.375
      };
    }

    /**
     * Сохранить / обновить параметры профиля
     * @param {Object} partialProfile
     * @returns {Object}
     */
    saveProfile(partialProfile) {
      const current = this.getProfile();
      const updated = {
        ...current,
        ...partialProfile,
        updatedAt: Date.now()
      };

      this._set(STORAGE_KEYS.PROFILE, updated);

      // Синхронизируем глобальный объект для калькуляторов
      if (window.userProfile) {
        Object.assign(window.userProfile, updated);
      }
      return updated;
    }

    updateUserProfile(key, value) {
      if (!key) return;
      const patch = {};
      patch[key] = value;
      this.saveProfile(patch);
    }

    // ==========================================================================
    // 2. ИСТОРИЯ ТЕСТОВ И ЗАМЕРОВ
    // ==========================================================================

    /**
     * Получить историю тестов с возможностью фильтрации по типу
     * @param {string} [testType] - 'rufier' | 'stange' | 'romberg' | 'bmi' | 'bmr' | 'kerdo' | 'kvas' | 'water'
     * @returns {Array<Object>}
     */
    getHistory(testType = null) {
      const history = this.memoryCache.get(STORAGE_KEYS.HISTORY) || [];
      if (!testType) {
        return [...history].sort((a, b) => b.timestamp - a.timestamp);
      }
      return history
        .filter((item) => item.type === testType)
        .sort((a, b) => b.timestamp - a.timestamp);
    }

    /**
     * Добавить запись о пройденном тесте
     * @param {Object} testRecord
     * @returns {Object} Созданная запись
     */
    addHistoryItem(testRecord) {
      const history = this.memoryCache.get(STORAGE_KEYS.HISTORY) || [];

      const record = {
        id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        timestamp: Date.now(),
        dateISO: new Date().toISOString(),
        ...testRecord
      };

      history.unshift(record);

      if (history.length > 100) {
        history.length = 100;
      }

      this._set(STORAGE_KEYS.HISTORY, history);
      return record;
    }

    /**
     * Получить последний результат конкретного теста
     * @param {string} testType
     * @returns {Object|null}
     */
    getLastTestResult(testType) {
      const items = this.getHistory(testType);
      return items.length > 0 ? items[0] : null;
    }

    /**
     * Очистить историю (всю или по конкретному тесту)
     * @param {string} [testType]
     */
    clearHistory(testType = null) {
      if (!testType) {
        this._set(STORAGE_KEYS.HISTORY, []);
        return;
      }

      const history = this.memoryCache.get(STORAGE_KEYS.HISTORY) || [];
      const filtered = history.filter((item) => item.type !== testType);
      this._set(STORAGE_KEYS.HISTORY, filtered);
    }

    // ==========================================================================
    // 3. ИЗБРАННОЕ (АСАНЫ, КНИГИ)
    // ==========================================================================

    getFavorites() {
      return this.memoryCache.get(STORAGE_KEYS.FAVORITES) || { asanas: [], books: [] };
    }

    toggleFavorite(type, id) {
      const favorites = this.getFavorites();
      const list = favorites[type] || [];
      const index = list.indexOf(id);

      if (index >= 0) {
        list.splice(index, 1);
      } else {
        list.push(id);
      }

      favorites[type] = list;
      this._set(STORAGE_KEYS.FAVORITES, favorites);
      return index < 0;
    }

    isFavorite(type, id) {
      const favorites = this.getFavorites();
      const list = favorites[type] || [];
      return list.includes(id);
    }

    // ==========================================================================
    // 4. НАСТРОЙКИ ПРИЛОЖЕНИЯ
    // ==========================================================================

    getSettings() {
      return this.memoryCache.get(STORAGE_KEYS.SETTINGS) || { ...DEFAULT_SETTINGS };
    }

    saveSettings(partialSettings) {
      const current = this.getSettings();
      const updated = { ...current, ...partialSettings };
      this._set(STORAGE_KEYS.SETTINGS, updated);
      return updated;
    }

    // ==========================================================================
    // ВНУТРЕННИЕ ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    // ==========================================================================

    _getLocal(key, fallback) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
      } catch (e) {
        return fallback;
      }
    }

    _set(key, value) {
      this.memoryCache.set(key, value);
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('[Storage] Ошибка записи в LocalStorage:', e);
      }

      if (this.cloudStorage) {
        try {
          this.cloudStorage.setItem(key, JSON.stringify(value), (err) => {
            if (err) console.warn('[Storage] Ошибка записи в CloudStorage:', err);
          });
        } catch (e) {}
      }
    }

    _syncFromCloud() {
      if (!this.cloudStorage) return;
      const keys = Object.values(STORAGE_KEYS);

      try {
        this.cloudStorage.getItems(keys, (err, result) => {
          if (err || !result) return;

          keys.forEach((key) => {
            if (result[key]) {
              try {
                const parsed = JSON.parse(result[key]);
                this.memoryCache.set(key, parsed);
                localStorage.setItem(key, JSON.stringify(parsed));
              } catch (e) {}
            }
          });
        });
      } catch (e) {}
    }
  }

  const storageInst = new StorageService();
  window.StorageService = StorageService;
  window.storageService = storageInst;

  // Глобальные объекты и функции для интеграции с тестами
  window.userProfile = storageInst.getUserProfile();
  window.updateUserProfile = function (key, val) {
    if (!key || val === undefined) return;
    storageInst.updateUserProfile(key, val);
  };
})();