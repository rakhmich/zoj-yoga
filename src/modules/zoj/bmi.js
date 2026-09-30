/**
 * МОДУЛЬ ЗОЖ: ИНДЕКС МАССЫ ТЕЛА (ИМТ / ИНДЕКС КЕТЛЕ)
 * Файл: src/modules/zoj/bmi.js
 */

(function () {
  'use strict';

  let lastBmiData = { val: '0.0', status: 'Норма', subtitle: '', details: [] };

  function mountBmiScreen(container) {
    let screen = container || document.getElementById('screen-bmi');
    if (!screen) return;

    // Если верстка уже отрисована, повторно не пересоздаем, только обновляем поля
    if (screen.querySelector('#btn-run-bmi')) {
      bindBmiEvents(screen);
      return;
    }

    screen.innerHTML = `
      <div class="header-nav" style="margin-bottom: 12px;">
        <button type="button" class="back-btn back-circle-btn" data-back-to-main>← Назад к тестам</button>
      </div>

      <h2>Индекс массы тела (ИМТ)</h2>
      <p class="subtitle" style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 16px;">
        Международный диагностический стандарт ВОЗ (Индекс Кетле)
      </p>

      <div class="card">
        <label for="bmi-weight">Масса тела (кг):</label>
        <input type="number" id="bmi-weight" placeholder="Например: 63" step="0.1" inputmode="decimal">

        <label for="bmi-height">Рост (см):</label>
        <input type="number" id="bmi-height" placeholder="Например: 177" step="0.5" inputmode="decimal">

        <button type="button" class="calc-btn" id="btn-run-bmi">Рассчитать показатель</button>

        <div class="results" id="bmi-results" style="display: none;">
          <div class="result-hero-box">
            <div class="result-hero-num" id="bmi-val">0.0</div>
            <div class="result-hero-label">Индекс Кетле (кг/м²)</div>
          </div>

          <div class="badge-status-wrap" style="text-align: center; margin: 12px 0;">
            <span class="badge-status" id="bmi-badge">Норма</span>
          </div>

          <div class="scale-container">
            <div class="scale-pin-track">
              <div class="scale-pin" id="bmi-pin">▼</div>
            </div>
            <div class="scale-bar">
              <div class="scale-segment seg-under" title="Дефицит (< 18.5)"></div>
              <div class="scale-segment seg-normal" title="Норма (18.5–24.9)"></div>
              <div class="scale-segment seg-over" title="Избыток (25.0–29.9)"></div>
              <div class="scale-segment seg-obese" title="Ожирение (≥ 30.0)"></div>
            </div>
            <div class="scale-labels">
              <span>&lt; 18.5</span>
              <span>18.5–24.9</span>
              <span>25.0–29.9</span>
              <span>&ge; 30.0</span>
            </div>
          </div>

          <div class="res-row">
            <span>Здоровый диапазон веса:</span>
            <span class="res-val" id="bmi-ideal-weight">—</span>
          </div>

          <div class="res-row">
            <span>Целевая корректировка:</span>
            <span class="res-val" id="bmi-delta">—</span>
          </div>

          <div class="res-row">
            <span>Риск сопутствующих заболеваний:</span>
            <span class="res-val" id="bmi-risk">—</span>
          </div>

          <div class="comment-box" id="bmi-comment"></div>

          <button type="button" class="share-story-btn" id="btn-share-bmi-story">
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
          <span>Формула, история и ограничения методики</span>
          <span style="font-size: 11px;">▾</span>
        </summary>

        <div class="formula-window">
          <span class="formula-window-title">Математическая модель:</span>
          <div class="formula-window-code">ИМТ = Масса тела (кг) / [Рост (м)]²</div>
        </div>

        <div class="formula-desc-text">
          <p>💡 <b>Историческая справка:</b> Метод разработан бельгийским математиком и статистиком Адольфом Кетле в 1835 году. В клиническую практику введен физиологом Анселом Кейсом в 1972 году.</p>
          <p>⚠️ <b>Ограничения:</b> Индекс Кетле оценивает общую массу, но не состав тканей (соотношение жира, воды и мышц). Не применяется изолированно для спортсменов-силовиков, беременных и детей.</p>
        </div>
      </details>
    `;

    bindBmiEvents(screen);
  }

  function bindBmiEvents(root) {
    root.querySelector('#btn-run-bmi')?.addEventListener('click', calculateBMI);
    root.querySelector('#btn-share-bmi-story')?.addEventListener('click', shareBmiStory);

    const profile = window.storageService?.getUserProfile?.() || window.userProfile;
    if (profile) {
      if (profile.weight) {
        const w = root.querySelector('#bmi-weight');
        if (w && !w.value) w.value = profile.weight;
      }
      if (profile.height) {
        const h = root.querySelector('#bmi-height');
        if (h && !h.value) h.value = profile.height;
      }
    }
  }

  function calculateBMI() {
    if (typeof window.haptic === 'function') window.haptic('light');

    const weightInput = document.getElementById('bmi-weight');
    const heightInput = document.getElementById('bmi-height');
    if (!weightInput || !heightInput) return;

    weightInput.classList.remove('field-error');
    heightInput.classList.remove('field-error');

    const weight = parseFloat(weightInput.value);
    const heightCm = parseFloat(heightInput.value);

    if (!weight || isNaN(weight) || weight < 20 || weight > 300) {
      weightInput.classList.add('field-error');
      alert('Пожалуйста, укажите реальный вес от 20 до 300 кг.');
      return;
    }

    if (!heightCm || isNaN(heightCm) || heightCm < 50 || heightCm > 250) {
      heightInput.classList.add('field-error');
      alert('Пожалуйста, укажите реальный рост от 50 до 250 см.');
      return;
    }

    if (window.storageService?.saveProfile) {
      window.storageService.saveProfile({ weight, height: heightCm });
    }

    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    const bmiValStr = bmi.toFixed(1);

    let status = 'Норма';
    let badgeClass = 'badge-normal';
    let risk = 'Минимальный';
    let pinPercent = 50;

    if (bmi < 16.0) {
      status = 'Выраженный дефицит';
      badgeClass = 'badge-danger';
      risk = 'Высокий (риск эндокринных нарушений)';
      pinPercent = 5;
    } else if (bmi < 18.5) {
      status = 'Дефицит массы';
      badgeClass = 'badge-warning';
      risk = 'Повышенный (риск нутритивной недостаточности)';
      pinPercent = 5 + ((bmi - 16) / 2.5) * 20;
    } else if (bmi <= 24.9) {
      status = 'Нормальная масса';
      badgeClass = 'badge-success';
      risk = 'Минимальный (оптимальный метаболический баланс)';
      pinPercent = 25 + ((bmi - 18.5) / 6.4) * 25;
    } else if (bmi <= 29.9) {
      status = 'Избыточная масса';
      badgeClass = 'badge-warning';
      risk = 'Умеренно повышенный (сердечно-сосудистый профиль)';
      pinPercent = 50 + ((bmi - 25) / 4.9) * 25;
    } else if (bmi <= 34.9) {
      status = 'Ожирение I степени';
      badgeClass = 'badge-danger';
      risk = 'Высокий (инсулинорезистентность, гипертония)';
      pinPercent = 75 + ((bmi - 30) / 4.9) * 10;
    } else if (bmi <= 39.9) {
      status = 'Ожирение II степени';
      badgeClass = 'badge-danger';
      risk = 'Очень высокий (риск атеросклероза)';
      pinPercent = 85 + ((bmi - 35) / 4.9) * 8;
    } else {
      status = 'Ожирение III степени';
      badgeClass = 'badge-danger';
      risk = 'Критический (требуется медицинская коррекция)';
      pinPercent = 95;
    }

    const minIdealWeight = (18.5 * heightM * heightM).toFixed(1);
    const maxIdealWeight = (24.9 * heightM * heightM).toFixed(1);

    document.getElementById('bmi-val').textContent = bmiValStr;
    const badgeEl = document.getElementById('bmi-badge');
    if (badgeEl) {
      badgeEl.textContent = status;
      badgeEl.className = 'badge-status ' + badgeClass;
    }

    const pinEl = document.getElementById('bmi-pin');
    if (pinEl) pinEl.style.left = `${pinPercent}%`;

    document.getElementById('bmi-ideal-weight').textContent = `${minIdealWeight} – ${maxIdealWeight} кг`;
    document.getElementById('bmi-risk').textContent = risk;

    let deltaStr = 'Масса тела находится в нормальном диапазоне ВОЗ';
    if (weight < minIdealWeight) {
      deltaStr = `Рекомендуемый набор: +${(minIdealWeight - weight).toFixed(1)} кг`;
    } else if (weight > maxIdealWeight) {
      deltaStr = `Рекомендуемое снижение: -${(weight - maxIdealWeight).toFixed(1)} кг`;
    }
    document.getElementById('bmi-delta').textContent = deltaStr;

    const commentEl = document.getElementById('bmi-comment');
    if (commentEl) {
      commentEl.innerHTML = `💡 <b>Оценка:</b> ${
        bmi <= 24.9 
          ? 'Показатель в норме. Сохраняйте оптимальный уровень физической активности.' 
          : 'Рекомендуется комбинация аэробных тренировок и умеренного дефицита калорий.'
      }`;
    }

    document.getElementById('bmi-results').style.display = 'block';

    if (window.storageService?.addHistoryItem) {
      window.storageService.addHistoryItem({
        type: 'bmi',
        title: 'Индекс массы тела (ИМТ)',
        value: bmiValStr,
        unit: 'кг/м²',
        status: status
      });
    }

    lastBmiData = { val: bmiValStr, status, subtitle: deltaStr };
  }

function shareBmiStory() {
    window.storyGenerator.openStoryModal({
      title: 'ИНДЕКС МАССЫ ТЕЛА (ИМТ)',
      value: lastBmiData.val,
      unit: 'кг/м²',
      status: lastBmiData.status,
      subtitle: lastBmiData.subtitle,
      type: 'bmi',
      extra: { bmiVal: parseFloat(lastBmiData.val) },
      params: {
        'Масса тела': `${document.getElementById('bmi-weight')?.value || '—'} кг`,
        'Рост': `${document.getElementById('bmi-height')?.value || '—'} см`,
        'Здоровый вес': document.getElementById('bmi-ideal-weight')?.textContent || '—',
        'Оценка риска': document.getElementById('bmi-risk')?.textContent || '—'
      }
    });
  }

  window.mountBmiScreen = mountBmiScreen;
  window.calculateBMI = calculateBMI;
})();