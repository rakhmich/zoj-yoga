/**
 * МОДУЛЬ ЗОЖ / ФИТНЕС: ПРОБА РУФЬЕ — ДИКСОНА С АССИСТЕНТОМ И МЕТРОНОМОМ
 * Путь: src/modules/zoj/rufier.js
 */

(function () {
  'use strict';

  let lastRufierData = {
    val: '0',
    status: 'Норма',
    subtitle: '',
    pulses: { p1: 0, p2: 0, p3: 0 },
    params: {}
  };

  let rufCurrentStep = 1;
  let rufTimerId = null;
  let rufSquatMetronomeId = null;
  let rufP1 = 0, rufP2 = 0, rufP3 = 0;

  function mountRufierScreen(container) {
    let screen = container || document.getElementById('screen-rufier');
    if (!screen) return;

    if (screen.querySelector('#btn-run-rufier')) {
      bindRufierEvents(screen);
      return;
    }

    screen.innerHTML = `
      <div class="header-nav" style="margin-bottom: 12px;">
        <button type="button" class="back-btn back-circle-btn" data-back-to-main>← Назад к тестам</button>
      </div>

      <h2>Проба Руфье — Диксона</h2>
      <p class="subtitle" style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 16px;">
        Оценка адаптации сердца и скорости восстановления после 30 приседаний
      </p>

      <div class="card">
        <div class="gender-toggle" style="display: flex; gap: 8px; margin-bottom: 14px;">
          <button type="button" class="gender-btn active" id="tab-rufier-manual" style="flex:1;">Ввести замеры</button>
          <button type="button" class="gender-btn" id="tab-rufier-assistant" style="flex:1;">Интерактивный тест ⏱️</button>
        </div>

        <!-- 1. РУЧНОЙ ВВОД -->
        <div id="view-rufier-manual">
          <label for="rufier-p1">Пульс в покое за 15 секунд (P1):</label>
          <input type="number" id="rufier-p1" placeholder="Сидя после отдыха (напр. 18)" inputmode="numeric">

          <label for="rufier-p2">Пульс сразу после 30 приседаний за 15 сек (P2):</label>
          <input type="number" id="rufier-p2" placeholder="Сразу после нагрузки (напр. 30)" inputmode="numeric">

          <label for="rufier-p3">Пульс спустя 1 мин отдыха за 15 сек (P3):</label>
          <input type="number" id="rufier-p3" placeholder="Через 1 минуту сидя (напр. 20)" inputmode="numeric">

          <button type="button" class="calc-btn" id="btn-run-rufier">Рассчитать индексы</button>
        </div>

        <!-- 2. ИНТЕРАКТИВНЫЙ АССИСТЕНТ -->
        <div id="view-rufier-assistant" style="display: none;">
          <div class="result-hero-box" style="margin-bottom: 12px;">
            <div id="ruf-step-badge" style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--accent, #38bdf8); margin-bottom: 4px;">
              Этап 1 из 4
            </div>
            <div id="ruf-step-title" style="font-size: 15px; font-weight: 700; margin-bottom: 8px;">
              Замер пульса в покое (P1)
            </div>
            <div class="result-hero-num" id="ruf-timer-digits" style="font-size: 46px;">15</div>
            <div class="result-hero-label" id="ruf-timer-status">Сидите спокойно. Считайте удары за 15 секунд</div>
          </div>

          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <button type="button" class="calc-btn" id="btn-ruf-start" style="flex: 2; margin-top: 0;">Начать этап</button>
            <button type="button" class="calc-btn secondary-btn" id="btn-ruf-reset" style="flex: 1; margin-top: 0; background: var(--bg-card, #1e293b); border: 1px solid var(--border-card, rgba(255,255,255,0.1));">Сброс</button>
          </div>
        </div>

        <!-- РЕЗУЛЬТАТЫ -->
        <div class="results" id="rufier-results" style="display: none; margin-top: 18px;">
          <div class="result-hero-box">
            <div style="display: flex; justify-content: space-around; align-items: baseline;">
              <div>
                <div class="result-hero-num" id="rufier-val-ir">0.0</div>
                <div class="result-hero-label">Индекс Руфье (IR)</div>
              </div>
              <div>
                <div class="result-hero-num" id="rufier-val-id" style="color: var(--text-main, #f8fafc);">0.0</div>
                <div class="result-hero-label">Индекс Диксона</div>
              </div>
            </div>
          </div>

          <div class="badge-status-wrap" style="text-align: center; margin: 12px 0;">
            <span class="badge-status" id="rufier-badge">Норма</span>
          </div>

          <div class="res-row">
            <span>Работоспособность сердца:</span>
            <span class="res-val" id="rufier-capacity">—</span>
          </div>

          <div class="res-row">
            <span>Гемодинамический прирост:</span>
            <span class="res-val" id="rufier-gain">—</span>
          </div>

          <div class="res-row">
            <span>Качество восстановления:</span>
            <span class="res-val" id="rufier-recovery">—</span>
          </div>

          <div class="comment-box" id="rufier-comment"></div>

          <button type="button" class="share-story-btn" id="btn-share-rufier-story">
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
          <span>Методика проведения, физиология и формула</span>
          <span style="font-size: 11px;">▾</span>
        </summary>
        
        <div class="formula-window">
          <span class="formula-window-title">Индекс Руфье:</span>
          <div class="formula-window-code">IR = [4 × (P1 + P2 + P3) - 200] / 10</div>
        </div>

        <div class="formula-window">
          <span class="formula-window-title">Индекс Диксона:</span>
          <div class="formula-window-code">ID = [(P2×4 - 70) + 2×(P3×4 - P1×4)] / 10</div>
        </div>

        <div class="formula-desc-text">
          <p><b>Протокол тестирования:</b></p>
          <p>1. <b>P1:</b> 5 мин отдыха сидя. Замер пульса за 15 секунд.</p>
          <p>2. <b>30 глубоких приседаний за 45 секунд</b> (в темпе метронома: 1 приседание в 1.5 сек).</p>
          <p>3. <b>P2:</b> Сразу сесть и посчитать пульс за первые 15 секунд.</p>
          <p>4. <b>P3:</b> За последние 15 секунд первой минуты отдыха повторить замер.</p>
          <p>💡 <b>Оценка IR:</b> &le;0 — атлетическое сердце; 0.1–5.0 — отлично; 5.1–10.0 — хорошая норма; 10.1–15.0 — утомление; &gt;15.0 — перегрузка.</p>
        </div>
      </details>
    `;

    bindRufierEvents(screen);
  }

  function bindRufierEvents(root) {
    const tabManual = root.querySelector('#tab-rufier-manual');
    const tabAssistant = root.querySelector('#tab-rufier-assistant');
    const viewManual = root.querySelector('#view-rufier-manual');
    const viewAssistant = root.querySelector('#view-rufier-assistant');

    tabManual?.addEventListener('click', () => {
      if (typeof window.haptic === 'function') window.haptic('light');
      tabManual.classList.add('active');
      tabAssistant?.classList.remove('active');
      if (viewManual) viewManual.style.display = 'block';
      if (viewAssistant) viewAssistant.style.display = 'none';
    });

    tabAssistant?.addEventListener('click', () => {
      if (typeof window.haptic === 'function') window.haptic('light');
      tabAssistant.classList.add('active');
      tabManual?.classList.remove('active');
      if (viewManual) viewManual.style.display = 'none';
      if (viewAssistant) viewAssistant.style.display = 'block';
    });

    root.querySelector('#btn-run-rufier')?.addEventListener('click', () => {
      const p1 = parseFloat(root.querySelector('#rufier-p1')?.value);
      const p2 = parseFloat(root.querySelector('#rufier-p2')?.value);
      const p3 = parseFloat(root.querySelector('#rufier-p3')?.value);

      if (isNaN(p1) || p1 < 10 || p1 > 45 || isNaN(p2) || p2 < 15 || p2 > 65 || isNaN(p3) || p3 < 10 || p3 > 55) {
        alert('Пожалуйста, введите корректные замеры за 15 секунд (P1: 10–45, P2: 15–65, P3: 10–55).');
        return;
      }
      evaluateRufier(p1, p2, p3);
    });

    setupRufierAssistant(root);
    root.querySelector('#btn-share-rufier-story')?.addEventListener('click', shareRufierStory);
  }

  function playRufierBeep(freq = 600, duration = 0.08) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  function setupRufierAssistant(root) {
    const btnStart = root.querySelector('#btn-ruf-start');
    const btnReset = root.querySelector('#btn-ruf-reset');
    const digitsEl = root.querySelector('#ruf-timer-digits');
    const statusEl = root.querySelector('#ruf-timer-status');
    const titleEl = root.querySelector('#ruf-step-title');
    const badgeEl = root.querySelector('#ruf-step-badge');

    const stepsConfig = [
      { title: 'Замер пульса в покое (P1)', seconds: 15, hint: 'Сидите неподвижно. Считайте удары за 15 секунд' },
      { title: '30 приседаний за 45 секунд', seconds: 45, hint: 'Приседайте под звуки метронома (раз в 1.5 сек)!' },
      { title: 'Пульс сразу после нагрузки (P2)', seconds: 15, hint: 'Сядьте и сразу считайте удары за 15 секунд' },
      { title: 'Пульс в конце отдыха (P3)', seconds: 15, hint: 'Отдых завершается. Считайте удары за последние 15 секунд' }
    ];

    function resetAssistant() {
      clearInterval(rufTimerId);
      clearInterval(rufSquatMetronomeId);
      rufTimerId = null;
      rufSquatMetronomeId = null;
      rufCurrentStep = 1;

      if (badgeEl) badgeEl.textContent = 'Этап 1 из 4';
      if (titleEl) titleEl.textContent = stepsConfig[0].title;
      if (digitsEl) digitsEl.textContent = '15';
      if (statusEl) statusEl.textContent = stepsConfig[0].hint;
      if (btnStart) {
        btnStart.textContent = 'Начать этап';
        btnStart.disabled = false;
      }
    }

    btnReset?.addEventListener('click', resetAssistant);

    btnStart?.addEventListener('click', () => {
      if (typeof window.haptic === 'function') window.haptic('light');
      if (rufTimerId) return;

      const conf = stepsConfig[rufCurrentStep - 1];
      let timeLeft = conf.seconds;
      if (digitsEl) digitsEl.textContent = timeLeft;
      btnStart.disabled = true;

      if (rufCurrentStep === 2) {
        let squatCount = 0;
        rufSquatMetronomeId = setInterval(() => {
          squatCount++;
          playRufierBeep(880, 0.1);
          if (statusEl) statusEl.textContent = `Приседание ${squatCount} из 30`;
        }, 1500);
      }

      rufTimerId = setInterval(() => {
        timeLeft--;
        if (digitsEl) digitsEl.textContent = timeLeft;

        if (timeLeft <= 3 && timeLeft > 0) {
          playRufierBeep(520, 0.06);
        }

        if (timeLeft <= 0) {
          clearInterval(rufTimerId);
          clearInterval(rufSquatMetronomeId);
          rufTimerId = null;
          rufSquatMetronomeId = null;
          playRufierBeep(1040, 0.3);

          handleAssistantStepEnd();
        }
      }, 1000);
    });

    function handleAssistantStepEnd() {
      if (rufCurrentStep === 1) {
        const input = prompt('Сколько ударов вы насчитали за 15 секунд в покое (P1)?', '18');
        rufP1 = parseFloat(input) || 18;
        const p1Input = document.getElementById('rufier-p1');
        if (p1Input) p1Input.value = rufP1;
        rufCurrentStep = 2;
      } else if (rufCurrentStep === 2) {
        alert('Финиш приседаний! Быстро садитесь и готовьтесь считать пульс P2.');
        rufCurrentStep = 3;
      } else if (rufCurrentStep === 3) {
        const input = prompt('Сколько ударов за 15 секунд сразу после нагрузки (P2)?', '30');
        rufP2 = parseFloat(input) || 30;
        const p2Input = document.getElementById('rufier-p2');
        if (p2Input) p2Input.value = rufP2;
        rufCurrentStep = 4;

        if (statusEl) statusEl.textContent = 'Отдыхайте сидя. Через 30 секунд начнется финальный замер P3...';
        if (titleEl) titleEl.textContent = 'Пассивный отдых (30 сек)';
        if (digitsEl) digitsEl.textContent = '30';

        let restTime = 30;
        const restInterval = setInterval(() => {
          restTime--;
          if (digitsEl) digitsEl.textContent = restTime;
          if (restTime <= 0) {
            clearInterval(restInterval);
            btnStart.disabled = false;
            btnStart.textContent = 'Начать замер P3';
            if (badgeEl) badgeEl.textContent = 'Этап 4 из 4';
            if (titleEl) titleEl.textContent = stepsConfig[3].title;
            if (digitsEl) digitsEl.textContent = '15';
            if (statusEl) statusEl.textContent = stepsConfig[3].hint;
          }
        }, 1000);
        return;
      } else if (rufCurrentStep === 4) {
        const input = prompt('Сколько ударов за 15 секунд в конце 1-й минуты отдыха (P3)?', '20');
        rufP3 = parseFloat(input) || 20;
        const p3Input = document.getElementById('rufier-p3');
        if (p3Input) p3Input.value = rufP3;

        evaluateRufier(rufP1, rufP2, rufP3);
        resetAssistant();
        return;
      }

      const nextConf = stepsConfig[rufCurrentStep - 1];
      if (badgeEl) badgeEl.textContent = `Этап ${rufCurrentStep} из 4`;
      if (titleEl) titleEl.textContent = nextConf.title;
      if (digitsEl) digitsEl.textContent = nextConf.seconds;
      if (statusEl) statusEl.textContent = nextConf.hint;
      btnStart.disabled = false;
      btnStart.textContent = 'Начать этап';
    }
  }

  function evaluateRufier(p1, p2, p3) {
    if (typeof window.haptic === 'function') window.haptic('medium');

    const p1Bpm = p1 * 4;
    const p2Bpm = p2 * 4;
    const p3Bpm = p3 * 4;

    const irNum = parseFloat(((4 * (p1 + p2 + p3) - 200) / 10).toFixed(1));
    const idNum = parseFloat((((p2Bpm - 70) + 2 * (p3Bpm - p1Bpm)) / 10).toFixed(1));

    const pulseGain = p2Bpm - p1Bpm;
    const recoveryDelta = p2Bpm - p3Bpm;
    const recoveryPct = Math.min(100, Math.round((recoveryDelta / Math.max(1, pulseGain)) * 100));

    let status = '', badgeClass = '', capacity = '', recovery = '', comment = '', subtitle = '';

    if (irNum <= 0) {
      status = 'Атлетическое сердце';
      badgeClass = 'badge-normal';
      capacity = 'Превосходная';
      recovery = 'Мгновенное';
      subtitle = 'Выдающийся уровень адаптации миокарда и моментальная реституция.';
      comment = 'Исключительная работоспособность сердечно-сосудистой системы. Высокий ударный объем крови и быстрое торможение симпатического тонуса.';
    } else if (irNum <= 5.0) {
      status = 'Отличная форма';
      badgeClass = 'badge-success';
      capacity = 'Высокая';
      recovery = 'Быстрое';
      subtitle = 'Высокая кардиореспираторная выносливость и быстрая нормализация ритма.';
      comment = 'Отличная реакция сердца на динамическую нагрузку. Сердечно-сосудистая система готова к регулярным тренировкам.';
    } else if (irNum <= 10.0) {
      status = 'Хорошая норма';
      badgeClass = 'badge-success';
      capacity = 'Средняя (норма)';
      recovery = 'Стандартное';
      subtitle = 'Оптимальная адаптация сердечно-сосудистой системы здорового человека.';
      comment = 'Показатель в пределах здоровой физиологической нормы. Сердце адекватно компенсирует нагрузку.';
    } else if (irNum <= 15.0) {
      status = 'Удовлетворительно';
      badgeClass = 'badge-warning';
      capacity = 'Сниженная';
      recovery = 'Замедленное';
      subtitle = 'Признаки утомления миокарда или недостаточного восстановления.';
      comment = 'Сердце выходит из нагрузки с задержкой. Возможные причины: переутомление, детренированность или недостаток сна.';
    } else {
      status = 'Неудовлетворительно';
      badgeClass = 'badge-danger';
      capacity = 'Крайне низкая';
      recovery = 'Крайне медленное';
      subtitle = 'Функциональная перегрузка сердца при стандартной нагрузке.';
      comment = 'Выраженная перегрузка сердечно-сосудистой системы. Рекомендуется снизить интенсивность тренировок и дать организму восстановиться.';
    }

    const irEl = document.getElementById('rufier-val-ir');
    if (irEl) irEl.textContent = irNum;

    const idEl = document.getElementById('rufier-val-id');
    if (idEl) idEl.textContent = idNum;

    const badge = document.getElementById('rufier-badge');
    if (badge) {
      badge.textContent = status;
      badge.className = 'badge-status ' + badgeClass;
    }

    const capEl = document.getElementById('rufier-capacity');
    if (capEl) capEl.textContent = capacity;

    const gainEl = document.getElementById('rufier-gain');
    if (gainEl) gainEl.textContent = `+${pulseGain} уд/мин (с ${p1Bpm} до ${p2Bpm})`;

    const recEl = document.getElementById('rufier-recovery');
    if (recEl) recEl.textContent = `${recovery} (~${recoveryPct}% за 1 мин)`;

    const commentEl = document.getElementById('rufier-comment');
    if (commentEl) commentEl.innerHTML = `💡 <b>Оценка адаптации:</b> ${comment}`;

    lastRufierData = {
      val: `${irNum} (IR)`,
      status: status.toUpperCase(),
      subtitle: subtitle,
      pulses: { p1: p1Bpm, p2: p2Bpm, p3: p3Bpm },
      params: {
        'Индекс Руфье': `${irNum}`,
        'Индекс Диксона': `${idNum}`,
        'Пульс покоя (P1)': `${p1Bpm} уд/мин`,
        'Пульс пик (P2)': `${p2Bpm} уд/мин`,
        'Пульс отдых (P3)': `${p3Bpm} уд/мин`,
        'Восстановление': `${recoveryPct}% за 1 мин`
      }
    };

    if (window.storageService?.addHistoryItem) {
      window.storageService.addHistoryItem({
        type: 'rufier',
        title: 'Проба Руфье — Диксона',
        value: `${irNum}`,
        unit: 'усл. ед.',
        status: status
      });
    }

    const results = document.getElementById('rufier-results');
    if (results) results.style.display = 'block';
  }

  function shareRufierStory() {
    if (window.storyGenerator && typeof window.storyGenerator.openStoryModal === 'function') {
      window.storyGenerator.openStoryModal({
        title: 'ПРОБА РУФЬЕ — ДИКСОНА',
        value: lastRufierData.val,
        unit: '',
        status: lastRufierData.status,
        subtitle: lastRufierData.subtitle,
        type: 'rufier',
        extra: { pulses: lastRufierData.pulses },
        params: lastRufierData.params
      });
    }
  }

  window.mountRufierScreen = mountRufierScreen;
  window.evaluateRufier = evaluateRufier;
})();