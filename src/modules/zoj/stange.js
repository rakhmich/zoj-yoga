/**
 * МОДУЛЬ ЗОЖ / ФИТНЕС: ДЫХАТЕЛЬНЫЕ ПРОБЫ ШТАНГЕ И ГЕНЧА С ТАЙМЕРОМ
 * Путь: src/modules/zoj/stange.js
 */

(function () {
  'use strict';

  let lastStangeData = { val: '0 с', status: 'Норма', subtitle: '', hypoxiaData: {}, params: {} };
  let stangeActiveTest = 'stange'; // 'stange' | 'gench'
  let stangeGender = 'male';
  let stangeTimerId = null;
  let stangeStartTime = 0;
  let stangeIsRunning = false;

  function mountStangeScreen(container) {
    let screen = container || document.getElementById('screen-stange');
    if (!screen) return;

    if (screen.querySelector('#btn-stange-toggle')) {
      bindStangeEvents(screen);
      return;
    }

    screen.innerHTML = `
      <div class="header-nav" style="margin-bottom: 12px;">
        <button type="button" class="back-btn back-circle-btn" data-back-to-main>← Назад к тестам</button>
      </div>

      <h2>Пробы Штанге и Генча</h2>
      <p class="subtitle" style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 16px;">
        Оценка гипоксической устойчивости, толерантности к CO₂ и резервов дыхания
      </p>

      <div class="card">
        <div class="gender-toggle" style="display: flex; gap: 8px; margin-bottom: 12px;">
          <button type="button" class="gender-btn active" id="tab-stange-inhale" style="flex:1;">Штанге (на вдохе)</button>
          <button type="button" class="gender-btn" id="tab-gench-exhale" style="flex:1;">Генч (на выдохе)</button>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-card, #1e293b); padding: 8px 14px; border-radius: 12px; border: 1px solid var(--border-card, rgba(255,255,255,0.08)); margin-bottom: 14px;">
          <span style="font-size: 12.5px; color: var(--text-muted, #94a3b8); font-weight: 600;">Нормативы пола:</span>
          <div style="display: flex; gap: 6px;">
            <button type="button" id="stange-btn-male" class="gender-btn active" style="padding: 4px 12px; font-size: 12px; border-radius: 20px;">Мужской</button>
            <button type="button" id="stange-btn-female" class="gender-btn" style="padding: 4px 12px; font-size: 12px; border-radius: 20px;">Женский</button>
          </div>
        </div>

        <div id="stange-instruction" style="background: var(--bg-card, #1e293b); padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border-card, rgba(255,255,255,0.08)); margin-bottom: 14px; font-size: 12.5px; color: var(--text-muted, #94a3b8); line-height: 1.45;">
          🫁 <strong>Проба Штанге:</strong> 2–3 спокойных дыхания, затем глубокий вдох на 80%. Зажмите нос пальцами и включите таймер.
        </div>

        <div class="result-hero-box" style="margin-bottom: 12px;">
          <div class="result-hero-num" id="stange-live-digits" style="font-size: 42px;">0.0</div>
          <div class="result-hero-label" id="stange-live-status">Задержите дыхание и нажмите «Старт»</div>
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 14px;">
          <button type="button" class="calc-btn" id="btn-stange-toggle" style="flex: 2; margin-top: 0;">
            Начать задержку
          </button>
          <button type="button" class="calc-btn secondary-btn" id="btn-stange-reset" style="flex: 1; margin-top: 0; background: var(--bg-card, #1e293b); border: 1px solid var(--border-card, rgba(255,255,255,0.1));">
            Сброс
          </button>
        </div>

        <div style="padding-top: 10px; border-top: 1px dashed var(--border-card, rgba(255,255,255,0.1));">
          <label for="stange-manual-sec">Или введите секунды вручную:</label>
          <div style="display: flex; gap: 8px;">
            <input type="number" id="stange-manual-sec" placeholder="Время в сек" step="1" inputmode="numeric" style="margin-bottom: 0;">
            <button type="button" class="calc-btn" id="btn-stange-manual" style="width: auto; margin-top: 0; padding: 10px 18px; white-space: nowrap;">
              Оценить
            </button>
          </div>
        </div>

        <div class="results" id="stange-results" style="display: none; margin-top: 18px;">
          <div class="result-hero-box">
            <div class="result-hero-num" id="stange-final-val">0 с</div>
            <div class="result-hero-label" id="stange-final-label">Время произвольного апноэ</div>
          </div>

          <div class="badge-status-wrap" style="text-align: center; margin: 12px 0;">
            <span class="badge-status" id="stange-badge">Норма</span>
          </div>

          <div class="res-row">
            <span>Устойчивость к гипоксии:</span>
            <span class="res-val" id="stange-res-hypoxia">—</span>
          </div>

          <div class="res-row">
            <span>Чувствительность к CO₂:</span>
            <span class="res-val" id="stange-res-co2">—</span>
          </div>

          <div class="res-row">
            <span>Резерв внешнего дыхания:</span>
            <span class="res-val" id="stange-res-reserve">—</span>
          </div>

          <div class="comment-box" id="stange-comment"></div>

          <button type="button" class="share-story-btn" id="btn-share-stange-story">
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
          <span>Методика проведения, физиология апноэ и нормы</span>
          <span style="font-size: 11px;">▾</span>
        </summary>
        
        <div class="formula-window">
          <span class="formula-window-title">Проба Штанге (на вдохе):</span>
          <div class="formula-window-code">T_вдох = Спокойный вдох на 80% объема легких [сек]</div>
        </div>

        <div class="formula-window">
          <span class="formula-window-title">Проба Генча (на выдохе):</span>
          <div class="formula-window-code">T_выдох = Полный спокойный выдох без натуживания [сек]</div>
        </div>

        <div class="formula-desc-text">
          <p>💡 <b>Физиологический смысл:</b> Позыв ко вдоху стимулируется хеморецепторами при накоплении CO₂ в крови. Высокие секунды говорят об экономичном потреблении кислорода тканями и тренированности дыхательного центра.</p>
          <p>• <b>Штанге (Вдох):</b> мужчины: &gt;50с — норма, &gt;65с — отлично; женщины: &gt;40с — норма, &gt;55с — отлично.</p>
          <p>• <b>Генч (Выдох):</b> мужчины: &gt;30с — норма, &gt;45с — отлично; женщины: &gt;25с — норма, &gt;38с — отлично.</p>
        </div>
      </details>
    `;

    bindStangeEvents(screen);
  }

  function bindStangeEvents(root) {
    const tabInhale = root.querySelector('#tab-stange-inhale');
    const tabExhale = root.querySelector('#tab-gench-exhale');

    tabInhale?.addEventListener('click', () => setStangeTab('stange', root));
    tabExhale?.addEventListener('click', () => setStangeTab('gench', root));

    const btnMale = root.querySelector('#stange-btn-male');
    const btnFemale = root.querySelector('#stange-btn-female');

    btnMale?.addEventListener('click', () => setStangeGender('male', root));
    btnFemale?.addEventListener('click', () => setStangeGender('female', root));

    root.querySelector('#btn-stange-toggle')?.addEventListener('click', toggleStangeTimer);
    root.querySelector('#btn-stange-reset')?.addEventListener('click', resetStangeTimer);

    root.querySelector('#btn-stange-manual')?.addEventListener('click', () => {
      const input = root.querySelector('#stange-manual-sec');
      const val = parseFloat(input?.value);
      if (!val || val <= 0 || val > 240) {
        alert('Пожалуйста, укажите время от 5 до 240 секунд.');
        return;
      }
      evaluateStange(val);
    });

    root.querySelector('#btn-share-stange-story')?.addEventListener('click', shareStangeStory);

    const profile = window.storageService?.getUserProfile?.() || window.userProfile;
    if (profile && profile.gender) setStangeGender(profile.gender, root);
  }

  function setStangeTab(tab, root) {
    if (typeof window.haptic === 'function') window.haptic('light');
    if (stangeIsRunning) resetStangeTimer();
    stangeActiveTest = tab;

    const tabInhale = root.querySelector('#tab-stange-inhale');
    const tabExhale = root.querySelector('#tab-gench-exhale');
    const instr = root.querySelector('#stange-instruction');

    tabInhale?.classList.toggle('active', tab === 'stange');
    tabExhale?.classList.toggle('active', tab === 'gench');

    if (instr) {
      instr.innerHTML = tab === 'stange'
        ? '🫁 <strong>Проба Штанге:</strong> 2–3 спокойных дыхания, затем глубокий вдох на 80%. Зажмите нос пальцами и включите таймер.'
        : '💨 <strong>Проба Генча:</strong> Спокойный вдох, затем полный выдох. Задержите дыхание на паузе после выдоха и запустите таймер.';
    }
  }

  function setStangeGender(gender, root) {
    if (typeof window.haptic === 'function') window.haptic('light');
    stangeGender = gender;
    root.querySelector('#stange-btn-male')?.classList.toggle('active', gender === 'male');
    root.querySelector('#stange-btn-female')?.classList.toggle('active', gender === 'female');
  }

  function toggleStangeTimer() {
    if (typeof window.haptic === 'function') window.haptic('light');
    const toggleBtn = document.getElementById('btn-stange-toggle');
    const digits = document.getElementById('stange-live-digits');
    const statusEl = document.getElementById('stange-live-status');

    if (!stangeIsRunning) {
      stangeIsRunning = true;
      stangeStartTime = performance.now();
      if (toggleBtn) {
        toggleBtn.textContent = 'Вдохнул! (Стоп)';
        toggleBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      }
      if (statusEl) statusEl.textContent = 'Идет задержка дыхания... Расслабьте плечи и лицо';

      stangeTimerId = setInterval(() => {
        const elapsed = (performance.now() - stangeStartTime) / 1000;
        if (digits) digits.textContent = elapsed.toFixed(1);
      }, 100);
    } else {
      const finalSec = parseFloat(digits?.textContent || '0');
      resetStangeTimer();
      evaluateStange(finalSec);
    }
  }

  function resetStangeTimer() {
    clearInterval(stangeTimerId);
    stangeTimerId = null;
    stangeIsRunning = false;

    const toggleBtn = document.getElementById('btn-stange-toggle');
    if (toggleBtn) {
      toggleBtn.textContent = 'Начать задержку';
      toggleBtn.style.background = '';
    }

    const digits = document.getElementById('stange-live-digits');
    if (digits) digits.textContent = '0.0';

    const statusEl = document.getElementById('stange-live-status');
    if (statusEl) statusEl.textContent = 'Задержите дыхание и нажмите «Старт»';
  }

  function evaluateStange(seconds) {
    if (typeof window.haptic === 'function') window.haptic('medium');

    const isStange = (stangeActiveTest === 'stange');
    const isMale = (stangeGender === 'male');

    let status = '', badgeClass = '', hypoxia = '', co2 = '', reserve = '', comment = '', subtitle = '';

    if (isStange) {
      const normGreat = isMale ? 65 : 55;
      const normGood = isMale ? 50 : 40;
      const normFair = isMale ? 35 : 30;

      if (seconds >= normGreat) {
        status = 'Отличная устойчивость';
        badgeClass = 'badge-normal';
        hypoxia = 'Высокая толерантность';
        co2 = 'Низкая сенситивность';
        reserve = 'Атлетический';
        subtitle = 'Высокая толерантность к гиперкапнии и отличный кислородный резерв.';
        comment = 'Превосходная гипоксическая устойчивость. Ткани и мозг эффективно утилизируют кислород.';
      } else if (seconds >= normGood) {
        status = 'Здоровая норма';
        badgeClass = 'badge-success';
        hypoxia = 'Удовлетворительная';
        co2 = 'Физиологическая норма';
        reserve = 'Оптимальный';
        subtitle = 'Физиологический оптимум аппарата внешнего дыхания.';
        comment = 'Показатель соответствует норме здорового тренированного человека.';
      } else if (seconds >= normFair) {
        status = 'Умеренное снижение';
        badgeClass = 'badge-warning';
        hypoxia = 'Сниженная толерантность';
        co2 = 'Повышенная возбудимость';
        reserve = 'Ограничен';
        subtitle = 'Умеренное снижение резерва дыхания или признаки переутомления.';
        comment = 'Дыхательный центр быстро реагирует на накопление CO₂. Полезны аэробные прогулки и пранаямы.';
      } else {
        status = 'Выраженный дефицит';
        badgeClass = 'badge-danger';
        hypoxia = 'Низкая толерантность';
        co2 = 'Высокая чувствительность';
        reserve = 'Низкий';
        subtitle = 'Низкая гипоксическая устойчивость, дыхательный центр перегружен.';
        comment = 'Дыхательный центр мгновенно дает позыв на вдох. Признак детренированности или накопленной усталости.';
      }
    } else {
      const normGreat = isMale ? 45 : 38;
      const normGood = isMale ? 30 : 25;
      const normFair = isMale ? 20 : 18;

      if (seconds >= normGreat) {
        status = 'Тканевая выносливость';
        badgeClass = 'badge-normal';
        hypoxia = 'Превосходная';
        co2 = 'Высокая стабильность';
        reserve = 'Максимальный';
        subtitle = 'Выдающаяся способность клеток работать без альвеолярного запаса воздуха.';
        comment = 'Отличный маркер глубокой тканевой адаптации к гипоксии, характерный для пловцов и бегунов.';
      } else if (seconds >= normGood) {
        status = 'Здоровая норма';
        badgeClass = 'badge-success';
        hypoxia = 'Нормальная';
        co2 = 'Оптимальная';
        reserve = 'В норме';
        subtitle = 'Физиологический норматив при пробе на выдохе.';
        comment = 'Аппарат дыхания и кровообращение обеспечивают устойчивый кислородный резерв.';
      } else if (seconds >= normFair) {
        status = 'Умеренное снижение';
        badgeClass = 'badge-warning';
        hypoxia = 'Сниженная';
        co2 = 'Повышенная возбудимость';
        reserve = 'Ограничен';
        subtitle = 'Быстрое падение парциального давления O₂ в тканях.';
        comment = 'Присутствует утомление или недостаток кардио-нагрузок.';
      } else {
        status = 'Неудовлетворительно';
        badgeClass = 'badge-danger';
        hypoxia = 'Низкая';
        co2 = 'Гиперсенситивность';
        reserve = 'Истощен';
        subtitle = 'Слабая переносимость дефицита кислорода.';
        comment = 'Рекомендуется щадящая дыхательная гимнастика и нормализация сна.';
      }
    }

    const valEl = document.getElementById('stange-final-val');
    if (valEl) valEl.textContent = `${seconds} с`;

    const badge = document.getElementById('stange-badge');
    if (badge) {
      badge.textContent = status;
      badge.className = 'badge-status ' + badgeClass;
    }

    const hypEl = document.getElementById('stange-res-hypoxia');
    if (hypEl) hypEl.textContent = hypoxia;

    const co2El = document.getElementById('stange-res-co2');
    if (co2El) co2El.textContent = co2;

    const resEl = document.getElementById('stange-res-reserve');
    if (resEl) resEl.textContent = reserve;

    const commentEl = document.getElementById('stange-comment');
    if (commentEl) commentEl.innerHTML = `💡 <b>Интерпретация:</b> ${comment}`;

    lastStangeData = {
      val: `${seconds} с`,
      status: status.toUpperCase(),
      subtitle: subtitle,
      hypoxiaData: isStange ? { stange: seconds, gench: Math.round(seconds * 0.6) } : { stange: Math.round(seconds * 1.6), gench: seconds },
      params: {
        'Проба': isStange ? 'Штанге (на вдохе)' : 'Генч (на выдохе)',
        'Время апноэ': `${seconds} сек`,
        'Толерантность к CO₂': co2,
        'Кислородный резерв': reserve
      }
    };

    if (window.storageService?.addHistoryItem) {
      window.storageService.addHistoryItem({
        type: 'stange',
        title: isStange ? 'Проба Штанге (вдох)' : 'Проба Генча (выдох)',
        value: `${seconds}`,
        unit: 'с',
        status: status
      });
    }

    const results = document.getElementById('stange-results');
    if (results) results.style.display = 'block';
  }

  function shareStangeStory() {
    if (window.storyGenerator && typeof window.storyGenerator.openStoryModal === 'function') {
      window.storyGenerator.openStoryModal({
        title: stangeActiveTest === 'stange' ? 'ПРОБА ШТАНГЕ (ВДОХ)' : 'ПРОБА ГЕНЧА (ВЫДОХ)',
        value: lastStangeData.val,
        unit: '',
        status: lastStangeData.status,
        subtitle: lastStangeData.subtitle,
        type: 'stange',
        extra: { hypoxia: lastStangeData.hypoxiaData },
        params: lastStangeData.params
      });
    }
  }

  window.mountStangeScreen = mountStangeScreen;
  window.evaluateStange = evaluateStange;
})();