/**
 * СЕРВИС АУДИО И МЕТРОНОМА (Web Audio API)
 * Путь: src/services/audio.js
 * Синтезирует звуковые сигналы без внешних файлов и решает проблему автовоспроизведения (User Gesture)
 */

(function () {
  'use strict';

  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.metronomeInterval = null;
      this.isUnlocked = false;

      this.initUnlockListeners();
    }

    /**
     * Разблокировка AudioContext по первому жесту пользователя
     */
    initUnlockListeners() {
      const unlock = () => {
        this.ensureContext();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().then(() => {
            this.isUnlocked = true;
          });
        } else if (this.ctx) {
          this.isUnlocked = true;
        }

        ['click', 'touchstart', 'keydown'].forEach((e) => {
          document.removeEventListener(e, unlock);
        });
      };

      ['click', 'touchstart', 'keydown'].forEach((e) => {
        document.addEventListener(e, unlock, { once: true });
      });
    }

    ensureContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
    }

    /**
     * Воспроизведение короткого бипа (клик / пик)
     * @param {number} [freq=880] - Частота звука в Гц
     * @param {number} [duration=0.08] - Длительность в секундах
     * @param {string} [type='sine'] - Тип волны ('sine', 'square', 'triangle')
     */
    playBeep(freq = 880, duration = 0.08, type = 'sine') {
      try {
        this.ensureContext();
        if (!this.ctx) return;

        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('[AudioEngine] Ошибка воспроизведения аудиосигнала:', e);
      }
    }

    /**
     * Запуск метронома
     * @param {number} bpm - Количество ударов в минуту (например, 40 для приседаний в Руфье)
     * @param {Function} [onTick] - Колбэк при каждом ударе
     */
    startMetronome(bpm = 40, onTick = null) {
      this.stopMetronome();
      const intervalMs = (60 / bpm) * 1000;

      // Первый удар сразу
      this.playBeep(1000, 0.1, 'sine');
      if (typeof onTick === 'function') onTick();

      this.metronomeInterval = setInterval(() => {
        this.playBeep(880, 0.08, 'sine');
        if (typeof onTick === 'function') onTick();
      }, intervalMs);
    }

    /**
     * Остановка метронома
     */
    stopMetronome() {
      if (this.metronomeInterval) {
        clearInterval(this.metronomeInterval);
        this.metronomeInterval = null;
      }
    }
  }

  const audioInst = new AudioEngine();
  window.AudioEngine = AudioEngine;
  window.audioEngine = audioInst;
})();