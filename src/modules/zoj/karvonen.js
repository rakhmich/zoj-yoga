/**
 * МОДУЛЬ ФИТНЕС / ЗОЖ: ПУЛЬСОВЫЕ ЗОНЫ КАРВОНЕНА
 * Путь: src/modules/zoj/karvonen.js
 */

(function () {
  'use strict';

  let lastPulseData = { val: '0 уд/мин', status: 'Пульсовые зоны', subtitle: '', zones: [], params: {} };

  function mountKarvonenScreen(container) {
    let screen = container || document.getElementById('screen-karvonen') || document.getElementById('screen-pulse');
    if (!screen) return;

    if (screen.querySelector('#btn-run-karvonen')) {
      bindKarvonenEvents(screen);
      return;
    }

    screen.innerHTML = `
      <div class="header-nav" style="margin-bottom: 12px;">
        <button type="button" class="back-btn back-circle-btn" data-back-to-main>← Назад к тестам</button>
      </div>

      <h2>Пульсовые зоны Карвонена</h2>
      <p class="subtitle" style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 16px;">
        Индивидуальные тренировочные коридоры на основе резерва сердечного ритма (HRR)
      </p>

      <div class="card">
        <label for="pulse-age">Возраст (полных лет):</label>
        <input type="number" id="pulse-age" placeholder="Например: 32" inputmode="numeric">

        <label for="pulse-rest">Пульс в покое утром (уд/мин):</label>
        <input type="number" id="pulse-rest" placeholder="Замер сидя после сна (например: 60)" inputmode="numeric">

        <button type="button" class="calc-btn" id="btn-run-karvonen">Рассчитать тренировочные зоны</button>

        <div class="results" id="pulse-results" style="display: none; margin-top: 16px;">
          <div class="result-hero-box">
            <div class="result-hero-num" id="pulse-max">0</div>
            <div class="result-hero-label">Максимальная расчетная ЧСС (уд/мин)</div>
          </div>

          <div class="res-row">
            <span>Резерв сердечного ритма (HRR):</span>
            <span class="res-val" id="pulse-reserve">—</span>
          </div>

          <div id="pulse-zones-list" style="margin: 14px 0;"></div>

          <div class="comment-box" id="pulse-comment"></div>

          <button type="button" class="share-story-btn" id="btn-share-karvonen-story">
            <svg class="neon-icon-spin" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:8px;">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            <span>Поделиться в Stories</span>
          </button>
        </div>
      </div>

      <details class="formula-info">
        <summary>
          <span>Физиологическое обоснование метода Карвонена</span>
          <span style="font-size: 11px;">▾</span>
        </summary>
        
        <div class="formula-window">
          <span class="formula-window-title">1. Максимальная ЧСС:</span>
          <div class="formula-window-code">ЧСС_max = 220 - Возраст</div>
        </div>

        <div class="formula-window">
          <span class="formula-window-title">2. Резерв сердца (HRR):</span>
          <div class="formula-window-code">HRR = ЧСС_max - ЧСС_покоя</div>
        </div>

        <div class="formula-window">
          <span class="formula-window-title">3. Целевой пульс зоны:</span>
          <div class="formula-window-code">Целевая ЧСС = (HRR × % Интенсивности) + ЧСС_покоя</div>
        </div>

        <div class="formula-desc-text">
          <p>💡 <b>Преимущество метода:</b> Формула учитывает индивидуальную тренированность. Чем ниже пульс в покое, тем шире рабочий диапазон сердца.</p>
          <p>🎯 <b>Зона 2 (60–70%):</b> Ключевой интервал для укрепления миокарда и окисления жирных кислот без избыточного накопления лактата.</p>
        </div>
      </details>
    `;

    bindKarvonenEvents(screen);
  }

  function bindKarvonenEvents(root) {
    root.querySelector('#btn-run-karvonen')?.addEventListener('click', calculatePulseZones);
    root.querySelector('#btn-share-karvonen-story')?.addEventListener('click', shareKarvonenStory);

    const profile = window.storageService?.getUserProfile?.() || window.userProfile;
    if (profile && profile.age) {
      const ageEl = root.querySelector('#pulse-age');
      if (ageEl && !ageEl.value) ageEl.value = profile.age;
    }
  }

  function calculatePulseZones() {
    if (typeof window.haptic === 'function') window.haptic('light');

    const ageInput = document.getElementById('pulse-age');
    const restInput = document.getElementById('pulse-rest');
    if (!ageInput || !restInput) return;

    ageInput.classList.remove('field-error');
    restInput.classList.remove('field-error');

    const age = parseFloat(ageInput.value);
    const hrRest = parseFloat(restInput.value);

    if (!age || isNaN(age) || age < 10 || age > 100) {
      ageInput.classList.add('field-error');
      alert('Пожалуйста, укажите реальный возраст от 10 до 100 лет.');
      return;
    }

    if (!hrRest || isNaN(hrRest) || hrRest < 35 || hrRest > 140) {
      restInput.classList.add('field-error');
      alert('Пожалуйста, укажите реальный пульс в покое от 35 до 140 уд/мин.');
      return;
    }

    if (window.storageService?.saveProfile) {
      window.storageService.saveProfile({ age });
    }

    const hrMax = 220 - age;
    const hrReserve = hrMax - hrRest;

    if (hrReserve <= 0) {
      restInput.classList.add('field-error');
      alert('Пульс в покое не может превышать максимальную ЧСС.');
      return;
    }

    const zones = [
      { id: 1, name: 'Зона 1: Восстановительная', pct: '50–60%', min: 0.50, max: 0.60, desc: 'Разминка, заминка, восстановление', isTarget: false },
      { id: 2, name: 'Зона 2: Жиросжигание и база', pct: '60–70%', min: 0.60, max: 0.70, desc: 'Липолиз, тренировка сердца без лактата', isTarget: true },
      { id: 3, name: 'Зона 3: Аэробная выносливость', pct: '70–80%', min: 0.70, max: 0.80, desc: 'Повышение ударного объема сердца', isTarget: false },
      { id: 4, name: 'Зона 4: Анаэробный порог (ПАНО)', pct: '80–90%', min: 0.80, max: 0.90, desc: 'Толерантность к закислению мышц', isTarget: false },
      { id: 5, name: 'Зона 5: МПК и максимальная мощность', pct: '90–100%', min: 0.90, max: 1.00, desc: 'Спринты, предельные интервалы', isTarget: false }
    ];

    const z2Low = Math.round(hrRest + hrReserve * 0.60);
    const z2High = Math.round(hrRest + hrReserve * 0.70);

    const maxEl = document.getElementById('pulse-max');
    if (maxEl) maxEl.textContent = hrMax;

    const resEl = document.getElementById('pulse-reserve');
    if (resEl) resEl.textContent = `${hrReserve} уд/мин`;

    const listEl = document.getElementById('pulse-zones-list');
    if (listEl) {
      listEl.innerHTML = zones.map(z => {
        const low = Math.round(hrRest + hrReserve * z.min);
        const high = Math.round(hrRest + hrReserve * z.max);
        const targetStyle = z.isTarget ? 'border: 1.5px solid var(--accent, #38bdf8); background: rgba(56, 189, 248, 0.08);' : 'border: 1px solid var(--border-card, #1e293b); background: var(--bg-card, #1e293b);';

        return `
          <div class="res-row" style="${targetStyle} padding: 10px 12px; border-radius: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; font-size: 13.5px; color: var(--text-main, #f8fafc);">${z.name} <span style="font-size: 11px; opacity: 0.8;">(${z.pct})</span></div>
              <div style="font-size: 11px; color: var(--text-muted, #94a3b8); margin-top: 2px;">${z.desc}</div>
            </div>
            <div style="font-weight: 800; font-size: 15px; color: var(--accent, #38bdf8); white-space: nowrap; margin-left: 10px;">
              ${low}–${high}
            </div>
          </div>
        `;
      }).join('');
    }

    const commentEl = document.getElementById('pulse-comment');
    if (commentEl) {
      commentEl.innerHTML = `🎯 <b>Ориентир (Зона 2):</b> Тренируйтесь в коридоре <b>${z2Low}–${z2High} уд/мин</b>. Дыхание должно позволять свободно поддерживать разговор.`;
    }

    lastPulseData = {
      val: `${z2Low} – ${z2High}`,
      status: 'ЗОНА 2: ОКИСЛЕНИЕ ЖИРОВ',
      subtitle: 'Базовый липолиз и укрепление миокарда.',
      zones: [
        { name: 'Зона 1: Разминка (50-60%)', range: `${Math.round(hrRest + hrReserve * 0.5)} – ${z2Low} уд/мин`, isTarget: false },
        { name: 'Зона 2: Липолиз (60-70%)', range: `${z2Low} – ${z2High} уд/мин`, isTarget: true },
        { name: 'Зона 3: Аэробная (70-80%)', range: `${z2High} – ${Math.round(hrRest + hrReserve * 0.8)} уд/мин`, isTarget: false }
      ],
      params: {
        'Возраст': `${age} лет`,
        'Пульс покоя': `${hrRest} уд/мин`,
        'Максимальная ЧСС': `${hrMax} уд/мин`
      }
    };

    if (window.storageService?.addHistoryItem) {
      window.storageService.addHistoryItem({
        type: 'karvonen',
        title: 'Пульсовые зоны Карвонена',
        value: `${z2Low}–${z2High}`,
        unit: 'уд/мин',
        status: 'Зона 2 (Липолиз)'
      });
    }

    const resultsBlock = document.getElementById('pulse-results');
    if (resultsBlock) resultsBlock.style.display = 'block';
  }

function shareKarvonenStory() {
    window.storyGenerator.openStoryModal({
      title: 'ПУЛЬСОВЫЕ ЗОНЫ КАРВОНЕНА',
      value: lastPulseData.val,
      unit: 'уд/мин',
      status: lastPulseData.status,
      subtitle: lastPulseData.subtitle,
      type: 'pulse',
      extra: { zones: lastPulseData.zones },
      params: lastPulseData.params
    });
  }

  window.mountKarvonenScreen = mountKarvonenScreen;
  window.calculatePulseZones = calculatePulseZones;
})();