/**
 * МОДУЛЬ ЗОЖ: СУТОЧНАЯ НОРМА ВОДЫ
 * Путь: src/modules/zoj/water.js
 */

(function () {
  'use strict';

  let currentWaterGender = 'male';
  let lastWaterData = { liters: '0.0 л', ml: '0 мл', glasses: '~0 ст.', params: {} };

  function mountWaterScreen(container) {
    let screen = container || document.getElementById('screen-water');
    if (!screen) return;

    if (screen.querySelector('#btn-run-water')) {
      bindWaterEvents(screen);
      return;
    }

    screen.innerHTML = `
      <div class="header-nav" style="margin-bottom: 12px;">
        <button type="button" class="back-btn back-circle-btn" data-back-to-main>← Назад к тестам</button>
      </div>

      <h2>Суточная норма воды</h2>
      <p class="subtitle" style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 16px;">
        Индивидуальный расчет гидратации с учетом пола, массы тела и двигательной активности
      </p>

      <div class="card">
        <div class="gender-toggle" style="display: flex; gap: 8px; margin-bottom: 14px;">
          <button type="button" class="gender-btn active" id="water-btn-male" style="flex:1;">Мужчина</button>
          <button type="button" class="gender-btn" id="water-btn-female" style="flex:1;">Женщина</button>
        </div>

        <label for="water-weight">Масса тела (кг):</label>
        <input type="number" id="water-weight" placeholder="Например: 70" step="0.1" inputmode="decimal">

        <label for="water-activity">Физическая активность в день (минут):</label>
        <input type="number" id="water-activity" placeholder="0" value="0" inputmode="numeric">

        <button type="button" class="calc-btn" id="btn-run-water">Рассчитать объем воды</button>

        <div class="results" id="water-results" style="display: none; margin-top: 16px;">
          <div class="result-hero-box">
            <div class="result-hero-num" id="water-val-liters">0.0 л</div>
            <div class="result-hero-label" id="water-val-ml">0 мл чистой жидкости в сутки</div>
          </div>

          <div class="res-row">
            <span>Эквивалент в стаканах (по 250 мл):</span>
            <span class="res-val" id="water-val-glasses">—</span>
          </div>

          <div class="res-row">
            <span>Компенсация тренировок:</span>
            <span class="res-val" id="water-val-workout">—</span>
          </div>

          <div class="comment-box" id="water-comment"></div>

          <button type="button" class="share-story-btn" id="btn-share-water-story">
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
          <span>Физиология гидратации, формулы и осморегуляция</span>
          <span style="font-size: 11px;">▾</span>
        </summary>
        
        <div class="formula-window">
          <span class="formula-window-title">Мужчины:</span>
          <div class="formula-window-code">Норма = (Масса × 35 мл) + (Время активности в часах × 500 мл)</div>
        </div>

        <div class="formula-window">
          <span class="formula-window-title">Женщины:</span>
          <div class="formula-window-code">Норма = (Масса × 31 мл) + (Время активности в часах × 500 мл)</div>
        </div>

        <div class="formula-desc-text">
          <p>💡 <b>Осморегуляция:</b> Вода обеспечивает нормальную вязкость плазмы крови, транспорт нутриентов и теплоотдачу. Потеря 1.5–2% жидкости снижает аэробную выносливость на 15–20%.</p>
          <p>⚠️️ <b>Режим питья:</b> Распределяйте воду равномерно порциями по 150–200 мл в течение дня, не выпивая суточный объем за 1–2 приема.</p>
        </div>
      </details>
    `;

    bindWaterEvents(screen);
  }

  function bindWaterEvents(root) {
    const maleBtn = root.querySelector('#water-btn-male');
    const femaleBtn = root.querySelector('#water-btn-female');

    maleBtn?.addEventListener('click', () => setWaterGender('male', root));
    femaleBtn?.addEventListener('click', () => setWaterGender('female', root));

    root.querySelector('#btn-run-water')?.addEventListener('click', calculateWater);
    root.querySelector('#btn-share-water-story')?.addEventListener('click', shareWaterStory);

    const profile = window.storageService?.getUserProfile?.() || window.userProfile;
    if (profile) {
      if (profile.gender) setWaterGender(profile.gender, root);
      if (profile.weight) {
        const w = root.querySelector('#water-weight');
        if (w && !w.value) w.value = profile.weight;
      }
    }
  }

  function setWaterGender(gender, root) {
    if (typeof window.haptic === 'function') window.haptic('light');
    currentWaterGender = gender;

    const mBtn = root.querySelector('#water-btn-male');
    const fBtn = root.querySelector('#water-btn-female');
    if (mBtn) mBtn.classList.toggle('active', gender === 'male');
    if (fBtn) fBtn.classList.toggle('active', gender === 'female');
  }

  function calculateWater() {
    if (typeof window.haptic === 'function') window.haptic('light');

    const weightInput = document.getElementById('water-weight');
    const actInput = document.getElementById('water-activity');

    if (!weightInput || !actInput) return;

    weightInput.classList.remove('field-error');
    actInput.classList.remove('field-error');

    const weight = parseFloat(weightInput.value);
    const rawActivity = actInput.value.trim();
    const activityMins = rawActivity === '' ? 0 : parseFloat(rawActivity);

    if (!weight || isNaN(weight) || weight < 25 || weight > 300) {
      weightInput.classList.add('field-error');
      alert('Пожалуйста, укажите реальный вес от 25 до 300 кг.');
      return;
    }

    if (isNaN(activityMins) || activityMins < 0 || activityMins > 600) {
      actInput.classList.add('field-error');
      alert('Пожалуйста, укажите время активности от 0 до 600 минут.');
      return;
    }

    if (window.storageService?.saveProfile) {
      window.storageService.saveProfile({ weight, gender: currentWaterGender });
    }

    const mlPerKg = currentWaterGender === 'male' ? 35 : 31;
    const baseWaterMl = weight * mlPerKg;
    const workoutAddMl = (activityMins / 60) * 500;
    const totalMl = Math.round(baseWaterMl + workoutAddMl);
    const liters = (totalMl / 1000).toFixed(1);
    const glasses = Math.round(totalMl / 250);

    const litEl = document.getElementById('water-val-liters');
    if (litEl) litEl.textContent = `${liters} л`;

    const mlEl = document.getElementById('water-val-ml');
    if (mlEl) mlEl.textContent = `${totalMl} мл чистой жидкости в сутки`;

    const glEl = document.getElementById('water-val-glasses');
    if (glEl) glEl.textContent = `~${glasses} ст.`;

    const workEl = document.getElementById('water-val-workout');
    if (workEl) workEl.textContent = activityMins > 0 ? `+${Math.round(workoutAddMl)} мл` : '0 мл';

    const commentEl = document.getElementById('water-comment');
    if (commentEl) {
      commentEl.innerHTML = `💡 <b>Рекомендация:</b> Выпивайте <b>~${glasses} стаканов по 250 мл</b> в течение дня. Начинайте день со стакана теплой воды натощак.`;
    }

    lastWaterData = {
      liters: `${liters} л`,
      ml: `${totalMl} мл`,
      glasses: `~${glasses} ст.`,
      params: {
        'Масса тела': `${weight} кг`,
        'Активность в день': `${activityMins} мин`,
        'Стаканы (по 250 мл)': `~${glasses} шт.`,
        'Спорт-надбавка': `+${Math.round(workoutAddMl)} мл`
      }
    };

    if (window.storageService?.addHistoryItem) {
      window.storageService.addHistoryItem({
        type: 'water',
        title: 'Суточная норма воды',
        value: `${liters}`,
        unit: 'л',
        status: `${totalMl} мл/сутки`
      });
    }

    const resultsBlock = document.getElementById('water-results');
    if (resultsBlock) resultsBlock.style.display = 'block';
  }
  
 
  function shareWaterStory() {
    if (window.storyGenerator && typeof window.storyGenerator.openStoryModal === 'function') {
      window.storyGenerator.openStoryModal({
        title: 'СУТОЧНАЯ НОРМА ВОДЫ',
        value: lastWaterData.liters,
        unit: '',
        status: `${lastWaterData.ml} В СУТКИ`,
        subtitle: 'Оптимальный уровень гидратации с учетом физической активности.',
        type: 'water',
        extra: {
          liters: lastWaterData.liters,
          glasses: lastWaterData.glasses
        },
        params: lastWaterData.params
      });
    }
  }

  window.mountWaterScreen = mountWaterScreen;
  window.calculateWater = calculateWater;
})();