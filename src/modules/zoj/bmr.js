/**
 * МОДУЛЬ ЗОЖ: БАЗОВЫЙ МЕТАБОЛИЗМ (BMR / TDEE)
 * Файл: src/modules/zoj/bmr.js
 */

(function () {
  'use strict';

  let currentBmrGender = 'male';
  let lastBmrPayload = null;

  function mountBmrScreen(container) {
    let screen = document.getElementById('screen-bmr');
    if (screen && screen.querySelector('#btn-run-bmr')) return;

    if (!screen) {
      const parent = container 
        || document.querySelector('.main-content') 
        || document.querySelector('.container') 
        || document.getElementById('app-screen-container') 
        || document.getElementById('app') 
        || document.body;

      if (!parent) return;

      screen = document.createElement('section');
      screen.id = 'screen-bmr';
      screen.className = 'screen view-section';
      screen.style.display = 'none';
      parent.appendChild(screen);
    }

    screen.innerHTML = `
      <div class="header-nav" style="margin-bottom: 14px;">
        <button type="button" class="back-btn" data-back-to-main>← Назад к тестам</button>
      </div>

      <h2>Базовый метаболизм (BMR / TDEE)</h2>
      <p class="subtitle" style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 16px;">
        Расход энергии в покое и суточная норма по формуле Харриса — Бенедикта
      </p>

      <div class="card">
        <div class="gender-toggle" style="display: flex; gap: 8px; margin-bottom: 14px;">
          <button type="button" class="gender-btn active" id="bmr-btn-male" style="flex:1;">Мужчина</button>
          <button type="button" class="gender-btn" id="bmr-btn-female" style="flex:1;">Женщина</button>
        </div>

        <label for="bmr-weight">Масса тела (кг):</label>
        <input type="number" id="bmr-weight" placeholder="Например: 72" step="0.1" inputmode="decimal">

        <label for="bmr-height">Рост (см):</label>
        <input type="number" id="bmr-height" placeholder="Например: 178" step="0.5" inputmode="decimal">

        <label for="bmr-age">Возраст (лет):</label>
        <input type="number" id="bmr-age" placeholder="Например: 28" inputmode="numeric">

        <label for="bmr-activity">Уровень физической активности (AMR):</label>
        <select id="bmr-activity" style="width: 100%; padding: 10px; border-radius: 8px; margin-bottom: 14px; background: var(--bg-input, #0f172a); color: var(--text-main, #f8fafc); border: 1px solid var(--border-input, #1e293b);">
          <option value="1.2">Сидячий образ жизни (минимум движения) — ×1.2</option>
          <option value="1.375">Легкая активность (тренировки 1–3 раза в неделю) — ×1.375</option>
          <option value="1.55" selected>Умеренная активность (тренировки 3–5 раз в неделю) — ×1.55</option>
          <option value="1.725">Высокая нагрузка (тяжелые тренировки 6–7 раз) — ×1.725</option>
          <option value="1.9">Экстремальный спорт / тяжелый физ. труд — ×1.9</option>
        </select>

        <button type="button" class="calc-btn" id="btn-run-bmr">Рассчитать расход калорий</button>

        <div class="results" id="bmr-results" style="display: none; margin-top: 16px;">
          <div class="result-hero-box">
            <div class="result-hero-num" id="bmr-tdee-val">0 ккал</div>
            <div class="result-hero-label">СУТОЧНАЯ НОРМА ЭНЕРГОЗАТРАТ (TDEE)</div>
          </div>

          <div class="res-row">
            <span>Базовый обмен в покое (BMR):</span>
            <span class="res-val" id="bmr-base-val">0 ккал</span>
          </div>

          <div class="res-row">
            <span>Для снижения жировой массы (-15%):</span>
            <span class="res-val" id="bmr-deficit-val">0 ккал</span>
          </div>

          <div class="res-row">
            <span>Для набора мышечной массы (+10%):</span>
            <span class="res-val" id="bmr-surplus-val">0 ккал</span>
          </div>

          <!-- Сетка макронутриентов БЖУ -->
          <div class="bju-box" style="display: flex; gap: 8px; margin: 16px 0;">
            <div style="flex: 1; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 12px; padding: 10px; text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted, #94a3b8); font-weight: 600;">Белки (2г/кг)</div>
              <strong id="bmr-prot-val" style="font-size: 18px; color: #38bdf8;">0 г</strong>
            </div>
            <div style="flex: 1; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 12px; padding: 10px; text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted, #94a3b8); font-weight: 600;">Жиры (1г/кг)</div>
              <strong id="bmr-fat-val" style="font-size: 18px; color: #f59e0b;">0 г</strong>
            </div>
            <div style="flex: 1; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 12px; padding: 10px; text-align: center;">
              <div style="font-size: 11px; color: var(--text-muted, #94a3b8); font-weight: 600;">Углеводы</div>
              <strong id="bmr-carb-val" style="font-size: 18px; color: #10b981;">0 г</strong>
            </div>
          </div>

          <div class="comment-box" id="bmr-comment"></div>

          <button type="button" class="share-story-btn" id="btn-share-bmr-story">
            <svg class="neon-icon-spin" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:8px;">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            <span>Сохранить фото / Stories</span>
          </button>
        </div>
      </div>

      <!-- Научно-методический блок: уравнения Харриса — Бенедикта -->
      <details class="formula-info">
        <summary>
          <span>Уравнения Харриса — Бенедикта, эндокринология и адаптация</span>
          <span style="font-size: 11px;">▾</span>
        </summary>

        <div class="formula-window">
          <span class="formula-window-title">Мужчины (Харрис — Бенедикт, пересмотренная):</span>
          <div class="formula-window-code">BMR = 88.36 + (13.4 × вес, кг) + (4.8 × рост, см) - (5.7 × возраст, лет)</div>
        </div>

        <div class="formula-window">
          <span class="formula-window-title">Женщины (Харрис — Бенедикт, пересмотренная):</span>
          <div class="formula-window-code">BMR = 447.6 + (9.2 × вес, кг) + (3.1 × рост, см) - (4.3 × возраст, лет)</div>
        </div>

        <div class="formula-desc-text">
          <p>💡 <b>Физиологический смысл:</b> Базовый метаболизм (BMR) отражает минимальное количество энергии, необходимое организму для поддержания жизнедеятельности в состоянии полного покоя (дыхание, кровообращение, клеточный синтез, работы ЦНС).</p>
          <p>⚠️ <b>Метаболическая адаптация:</b> Длительное снижение калорийности ниже уровня BMR провоцирует замедление функций щитовидной железы (снижение конверсии T4 в T3) и разрушение мышечной ткани. Держите дефицит в пределах 15–20% от TDEE.</p>
        </div>
      </details>
    `;

    bindBmrEvents(screen);
  }

  function bindBmrEvents(root) {
    const maleBtn = root.querySelector('#bmr-btn-male');
    const femaleBtn = root.querySelector('#bmr-btn-female');

    maleBtn?.addEventListener('click', () => setBmrGender('male', root));
    femaleBtn?.addEventListener('click', () => setBmrGender('female', root));

    root.querySelector('#btn-run-bmr')?.addEventListener('click', calculateBMR);
    root.querySelector('#btn-share-bmr-story')?.addEventListener('click', shareBmrStory);

    // Автозаполнение из сохраненного профиля
    const profile = window.storageService?.getUserProfile?.() || window.userProfile;
    if (profile) {
      if (profile.gender) setBmrGender(profile.gender, root);
      if (profile.weight) {
        const w = root.querySelector('#bmr-weight');
        if (w && !w.value) w.value = profile.weight;
      }
      if (profile.height) {
        const h = root.querySelector('#bmr-height');
        if (h && !h.value) h.value = profile.height;
      }
      if (profile.age) {
        const a = root.querySelector('#bmr-age');
        if (a && !a.value) a.value = profile.age;
      }
    }
  }

  function setBmrGender(gender, root) {
    if (typeof window.haptic === 'function') window.haptic('light');
    currentBmrGender = gender;

    const mBtn = root.querySelector('#bmr-btn-male');
    const fBtn = root.querySelector('#bmr-btn-female');

    if (mBtn) mBtn.classList.toggle('active', gender === 'male');
    if (fBtn) fBtn.classList.toggle('active', gender === 'female');
  }

  function calculateBMR() {
    if (typeof window.haptic === 'function') window.haptic('light');

    const weightInput = document.getElementById('bmr-weight');
    const heightInput = document.getElementById('bmr-height');
    const ageInput = document.getElementById('bmr-age');
    const actInput = document.getElementById('bmr-activity');

    if (!weightInput || !heightInput || !ageInput || !actInput) return;

    weightInput.classList.remove('field-error');
    heightInput.classList.remove('field-error');
    ageInput.classList.remove('field-error');

    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);
    const age = parseFloat(ageInput.value);
    const amr = parseFloat(actInput.value);

    if (!weight || isNaN(weight) || weight < 20 || weight > 300) {
      weightInput.classList.add('field-error');
      alert('Пожалуйста, укажите реальный вес от 20 до 300 кг.');
      return;
    }

    if (!height || isNaN(height) || height < 50 || height > 250) {
      heightInput.classList.add('field-error');
      alert('Пожалуйста, укажите реальный рост от 50 до 250 см.');
      return;
    }

    if (!age || isNaN(age) || age < 5 || age > 110) {
      ageInput.classList.add('field-error');
      alert('Пожалуйста, укажите возраст от 5 до 110 лет.');
      return;
    }

    // Сохранение в профиль
    if (window.storageService?.saveProfile) {
      window.storageService.saveProfile({ weight, height, age, gender: currentBmrGender });
    }

    let bmr = 0;
    if (currentBmrGender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    const tdee = bmr * amr;
    const deficit = tdee * 0.85; // -15%
    const surplus = tdee * 1.10; // +10%

    // БЖУ: Белки 2г/кг, Жиры 1г/кг, Остаток - Углеводы (4 ккал/г)
    const proteinGrams = Math.round(weight * 2.0);
    const fatGrams = Math.round(weight * 1.0);
    const proteinKcal = proteinGrams * 4;
    const fatKcal = fatGrams * 9;
    const carbKcal = Math.max(0, tdee - (proteinKcal + fatKcal));
    const carbGrams = Math.round(carbKcal / 4);

    document.getElementById('bmr-base-val').textContent = `${Math.round(bmr)} ккал`;
    document.getElementById('bmr-tdee-val').textContent = `${Math.round(tdee)} ккал`;
    document.getElementById('bmr-deficit-val').textContent = `${Math.round(deficit)} ккал`;
    document.getElementById('bmr-surplus-val').textContent = `${Math.round(surplus)} ккал`;

    document.getElementById('bmr-prot-val').textContent = `${proteinGrams} г`;
    document.getElementById('bmr-fat-val').textContent = `${fatGrams} г`;
    document.getElementById('bmr-carb-val').textContent = `${carbGrams} г`;

    const commentEl = document.getElementById('bmr-comment');
    if (commentEl) {
      commentEl.innerHTML = `💡 <b>Стратегия питания:</b> Для безопасного снижения массы держите целевой рацион <b>${Math.round(deficit)} ккал/сутки</b>.`;
    }

    document.getElementById('bmr-results').style.display = 'block';

    if (window.storageService?.addHistoryItem) {
      window.storageService.addHistoryItem({
        type: 'bmr',
        title: 'Базовый метаболизм (BMR / TDEE)',
        value: `${Math.round(tdee)}`,
        unit: 'ккал',
        status: `BMR: ${Math.round(bmr)} ккал`
      });
    }

    lastBmrPayload = {
      tdee: Math.round(tdee),
      bmr: Math.round(bmr),
      deficit: Math.round(deficit),
      surplus: Math.round(surplus)
    };
  }

function shareBmrStory() {
    window.storyGenerator.openStoryModal({
      title: 'СУТОЧНАЯ НОРМА КАЛОРИЙ (TDEE)',
      value: `${lastBmrPayload?.tdee || 0}`,
      unit: 'ккал',
      status: 'ФОРМУЛА ХАРРИСА — БЕНЕДИКТА',
      subtitle: `BMR: ${lastBmrPayload?.bmr || 0} ккал | Дефицит (-15%): ${lastBmrPayload?.deficit || 0} ккал`,
      type: 'bmr',
      extra: {
        bju: {
          prot: document.getElementById('bmr-prot-val')?.textContent?.replace(' г', '') || '0',
          fat: document.getElementById('bmr-fat-val')?.textContent?.replace(' г', '') || '0',
          carb: document.getElementById('bmr-carb-val')?.textContent?.replace(' г', '') || '0'
        }
      },
      params: {
        'Базовый обмен (BMR)': `${lastBmrPayload?.bmr || 0} ккал`,
        'Для снижения жира': `${lastBmrPayload?.deficit || 0} ккал`,
        'Для набора массы': `${lastBmrPayload?.surplus || 0} ккал`,
        'Белки / Жиры / Углеводы': `${document.getElementById('bmr-prot-val')?.textContent} / ${document.getElementById('bmr-fat-val')?.textContent} / ${document.getElementById('bmr-carb-val')?.textContent}`
      }
    });
  }

  window.mountBmrScreen = mountBmrScreen;
  window.calculateBMR = calculateBMR;
  window.setBmrGender = setBmrGender;
})();