/**
 * МОДУЛЬ ЗОЖ: КАЛЬКУЛЯТОР СНА И БИОРИТМОВ
 * Путь: src/modules/zoj/sleep.js
 */

(function () {
  'use strict';

  let currentSleepMode = 'wake';
  let lastSleepData = {
    val: '07:00',
    title: 'КАЛЬКУЛЯТОР СНА',
    status: 'Биоритмы сна',
    subtitle: '',
    cycles: [],
    params: {}
  };

  function mountSleepScreen(container) {
    let screen = container || document.getElementById('screen-sleep');
    if (!screen) return;

    if (screen.querySelector('#btn-run-sleep')) {
      bindSleepEvents(screen);
      return;
    }

    screen.innerHTML = `
      <div class="header-nav" style="margin-bottom: 12px;">
        <button type="button" class="back-btn back-circle-btn" data-back-to-main>← Назад к тестам</button>
      </div>

      <h2>Калькулятор сна и биоритмов</h2>
      <p class="subtitle" style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 16px;">
        Управление ультрадианными 90-минутными циклами для бодрого подъема без инерции сна
      </p>

      <div class="card">
        <div class="gender-toggle" style="display: flex; gap: 8px; margin-bottom: 14px;">
          <button type="button" class="gender-btn active" id="sleep-mode-wake" style="flex:1;">Хочу проснуться в...</button>
          <button type="button" class="gender-btn" id="sleep-mode-bed" style="flex:1;">Ложусь спать в...</button>
        </div>

        <label for="sleep-time-input" id="sleep-label-text">Укажите целевое время подъема:</label>
        <input type="time" id="sleep-time-input" value="07:00">

        <button type="button" class="calc-btn" id="btn-run-sleep">Рассчитать фазы сна</button>

        <div class="results" id="sleep-results" style="display: none; margin-top: 16px;">
          <div class="result-hero-box">
            <div class="result-hero-num" id="sleep-best-time">--:--</div>
            <div class="result-hero-label" id="sleep-hero-label">Оптимальное время (5 циклов)</div>
          </div>

          <div id="sleep-cycles-list" style="margin: 14px 0;"></div>

          <div class="comment-box" id="sleep-comment"></div>

          <button type="button" class="share-story-btn" id="btn-share-sleep-story">
            <svg class="neon-icon-spin" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:8px;">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            <span>Сохранить фото / Stories</span>
          </button>
        </div>
      </div>

      <details class="formula-info">
        <summary>
          <span>Архитектура сна: фазы NREM, REM и инерция сна</span>
          <span style="font-size: 11px;">▾</span>
        </summary>
        
        <div class="formula-window">
          <span class="formula-window-title">Расчет ультрадианного цикла:</span>
          <div class="formula-window-code">Время = Целевое время ± (Количество циклов × 90 мин + 15 мин засыпания)</div>
        </div>

        <div class="formula-desc-text">
          <p>• <b>Фазы N1–N2 (Легкий сон):</b> Замедление ритма сердца, консолидация навыков.</p>
          <p>• <b>Фаза N3 / SWS (Глубокий сон):</b> Пик гормона роста и очищение мозга глимфатической системой.</p>
          <p>• <b>Фаза REM (Быстрый сон):</b> Эмоциональная разгрузка и сновидения.</p>
          <p>💡 <b>Почему важен расчет:</b> Пробуждение на границе 90-минутного цикла гарантирует отсутствие сонной инерции (тяжести в голове).</p>
        </div>
      </details>
    `;

    bindSleepEvents(screen);
  }

  function bindSleepEvents(root) {
    const wakeBtn = root.querySelector('#sleep-mode-wake');
    const bedBtn = root.querySelector('#sleep-mode-bed');

    wakeBtn?.addEventListener('click', () => setSleepMode('wake', root));
    bedBtn?.addEventListener('click', () => setSleepMode('bed', root));

    root.querySelector('#btn-run-sleep')?.addEventListener('click', calculateSleep);
    root.querySelector('#btn-share-sleep-story')?.addEventListener('click', shareSleepStory);
  }

  function setSleepMode(mode, root) {
    if (typeof window.haptic === 'function') window.haptic('light');
    currentSleepMode = mode;

    const wakeBtn = root.querySelector('#sleep-mode-wake');
    const bedBtn = root.querySelector('#sleep-mode-bed');
    if (wakeBtn) wakeBtn.classList.toggle('active', mode === 'wake');
    if (bedBtn) bedBtn.classList.toggle('active', mode === 'bed');

    const labelText = root.querySelector('#sleep-label-text');
    if (labelText) {
      labelText.textContent = (mode === 'wake')
        ? 'Укажите целевое время подъема:'
        : 'Укажите время отхода ко сну:';
    }
  }

  function calculateSleep() {
    if (typeof window.haptic === 'function') window.haptic('light');

    const timeInput = document.getElementById('sleep-time-input')?.value;
    if (!timeInput) {
      alert('Пожалуйста, укажите время.');
      return;
    }

    const isWake = currentSleepMode === 'wake';
    const [hours, minutes] = timeInput.split(':').map(Number);
    const baseDate = new Date();
    baseDate.setHours(hours, minutes, 0, 0);

    const listEl = document.getElementById('sleep-cycles-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    const cyclesConfig = [
      { count: 6, hours: '9 ч', desc: 'Максимальное восстановление (6 циклов)', isOptimal: false },
      { count: 5, hours: '7.5 ч', desc: 'Золотой стандарт физиологического восстановления', isOptimal: true },
      { count: 4, hours: '6 ч', desc: 'Минимально допустимая граница нормы', isOptimal: false },
      { count: 3, hours: '4.5 ч', desc: 'Экстренный режим (3 цикла)', isOptimal: false }
    ];

    let bestDisplayTime = '--:--';
    const storyCycles = [];

    cyclesConfig.forEach(cycle => {
      const targetDate = new Date(baseDate);
      const totalMinutes = cycle.count * 90 + 15;

      if (isWake) {
        targetDate.setMinutes(targetDate.getMinutes() - totalMinutes);
      } else {
        targetDate.setMinutes(targetDate.getMinutes() + totalMinutes);
      }

      const timeString = targetDate.toTimeString().substring(0, 5);
      if (cycle.isOptimal) bestDisplayTime = timeString;

      storyCycles.push({
        count: cycle.count,
        time: timeString,
        isOpt: cycle.isOptimal
      });

      const row = document.createElement('div');
      row.className = 'res-row';
      row.style.cssText = 'background: var(--bg-card, #1e293b); padding: 12px 14px; border-radius: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;';
      row.style.border = cycle.isOptimal ? '1.5px solid var(--accent, #38bdf8)' : '1px solid var(--border-card, rgba(255,255,255,0.08))';

      row.innerHTML = `
        <div>
          <div style="font-weight: 700; color: var(--text-main, #f8fafc); font-size: 14.5px;">
            ${cycle.count} циклов (${cycle.hours} сна)
            ${cycle.isOptimal ? '<span style="margin-left: 6px; font-size: 11px; padding: 2px 6px; border-radius: 4px; background: var(--accent, #38bdf8); color: #000; font-weight: 800;">Оптимум</span>' : ''}
          </div>
          <div style="font-size: 12px; color: var(--text-muted, #94a3b8); margin-top: 3px;">${cycle.desc}</div>
        </div>
        <div class="res-val" style="font-size: 18px; font-weight: 800; margin-left: 10px; color: var(--accent, #38bdf8);">${timeString}</div>
      `;

      listEl.appendChild(row);
    });

    storyCycles.sort((a, b) => a.count - b.count);

    const heroLabel = document.getElementById('sleep-hero-label');
    if (heroLabel) {
      heroLabel.textContent = isWake
        ? `Оптимально уснуть к подъему в ${timeInput} (5 циклов):`
        : `Оптимально проснуться при отбое в ${timeInput} (5 циклов):`;
    }

    const heroNum = document.getElementById('sleep-best-time');
    if (heroNum) heroNum.textContent = bestDisplayTime;

    const commentEl = document.getElementById('sleep-comment');
    if (commentEl) {
      commentEl.innerHTML = isWake
        ? `💡 <b>Паттерн:</b> Чтобы легко встать в <b>${timeInput}</b>, ложитесь в <b>${bestDisplayTime}</b> (7.5 ч чистого сна + 15 мин засыпания).`
        : `💡 <b>Паттерн:</b> Если вы ложитесь в <b>${timeInput}</b>, ставьте будильник на <b>${bestDisplayTime}</b> (7.5 ч чистого сна + 15 мин засыпания).`;
    }

    const storyTitle = isWake ? `ПОДЪЕМ В ${timeInput}` : `ОТБОЙ В ${timeInput}`;
    const storyStatus = isWake ? 'ВРЕМЯ ОТБОЯ (5 ЦИКЛОВ)' : 'ВРЕМЯ ПОДЪЕМА (5 ЦИКЛОВ)';
    const storySubtitle = isWake
      ? `Чтобы легко встать в ${timeInput}, усните в ${bestDisplayTime}. Это обеспечит 7.5 ч сна и 15 мин на засыпание.`
      : `При отбое в ${timeInput} проснитесь в ${bestDisplayTime}. Это обеспечит 7.5 ч сна и 15 мин на засыпание.`;

    lastSleepData = {
      val: bestDisplayTime,
      title: storyTitle,
      status: storyStatus,
      subtitle: storySubtitle,
      cycles: storyCycles,
      params: isWake ? {
        'Целевой подъем': timeInput,
        'Идеальный отбой': bestDisplayTime,
        'Чистый сон': '7.5 ч (5 циклов)',
        'На засыпание': '15 минут'
      } : {
        'Время отбоя': timeInput,
        'Идеальный подъем': bestDisplayTime,
        'Чистый сон': '7.5 ч (5 циклов)',
        'На засыпание': '15 минут'
      }
    };

    if (window.storageService?.addHistoryItem) {
      window.storageService.addHistoryItem({
        type: 'sleep',
        title: 'Циклы сна',
        value: bestDisplayTime,
        unit: '',
        status: isWake ? `Подъем в ${timeInput}` : `Отбой в ${timeInput}`
      });
    }

    const resultsBlock = document.getElementById('sleep-results');
    if (resultsBlock) resultsBlock.style.display = 'block';
  }

  function shareSleepStory() {
    if (window.storyGenerator && typeof window.storyGenerator.openStoryModal === 'function') {
      window.storyGenerator.openStoryModal({
        title: lastSleepData.title,
        value: lastSleepData.val,
        unit: '',
        status: lastSleepData.status,
        subtitle: lastSleepData.subtitle,
        type: 'sleep',
        extra: { cycles: lastSleepData.cycles },
        params: lastSleepData.params
      });
    }
  }

  window.mountSleepScreen = mountSleepScreen;
  window.calculateSleep = calculateSleep;
  window.setSleepMode = setSleepMode;
})();