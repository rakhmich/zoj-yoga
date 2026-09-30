/**
 * МОДУЛЬ ЗОЖ: КОЭФФИЦИЕНТ ВЫНОСЛИВОСТИ (КВАС)
 * Путь: src/modules/zoj/kvas.js
 */

(function () {
  'use strict';

  let lastKvasData = {
    val: '0',
    status: 'Норма',
    subtitle: '',
    hemo: { pp: '—', economy: '—' },
    params: {}
  };

  function mountKvasScreen(container) {
    let screen = container || document.getElementById('screen-kvas');
    if (!screen) return;

    if (screen.querySelector('#btn-run-kvas')) {
      bindKvasEvents(screen);
      return;
    }

    screen.innerHTML = `
      <div class="header-nav" style="margin-bottom: 12px;">
        <button type="button" class="back-btn back-circle-btn" data-back-to-main>← Назад к тестам</button>
      </div>

      <h2>Коэффициент выносливости (Квас)</h2>
      <p class="subtitle" style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 16px;">
        Интегральная оценка утомления сердечно-сосудистой системы и ударного объема
      </p>

      <div class="card">
        <label for="kvas-pulse">ЧСС в покое (уд/мин):</label>
        <input type="number" id="kvas-pulse" placeholder="Например: 72" inputmode="numeric">

        <label for="kvas-sbp">Систолическое АД (верхнее, мм рт. ст.):</label>
        <input type="number" id="kvas-sbp" placeholder="Например: 120" inputmode="numeric">

        <label for="kvas-dbp">Диастолическое АД (нижнее, мм рт. ст.):</label>
        <input type="number" id="kvas-dbp" placeholder="Например: 80" inputmode="numeric">

        <button type="button" class="calc-btn" id="btn-run-kvas">Рассчитать коэффициент</button>

        <div class="results" id="kvas-results" style="display: none; margin-top: 16px;">
          <div class="result-hero-box">
            <div class="result-hero-num" id="kvas-value">0.0</div>
            <div class="result-hero-label">Коэффициент Кваса (усл. ед.)</div>
          </div>

          <div class="badge-status-wrap" style="text-align: center; margin: 12px 0;">
            <span class="badge-status" id="kvas-badge">Норма</span>
          </div>

          <div class="res-row">
            <span>Пульсовое давление (ПД):</span>
            <span class="res-val" id="kvas-pp">—</span>
          </div>

          <div class="res-row">
            <span>Функциональное состояние:</span>
            <span class="res-val" id="kvas-state">—</span>
          </div>

          <div class="res-row">
            <span>Экономичность миокарда:</span>
            <span class="res-val" id="kvas-economy">—</span>
          </div>

          <div class="comment-box" id="kvas-comment"></div>

          <button type="button" class="share-story-btn" id="btn-share-kvas-story">
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
          <span>Физиологическое обоснование и гемодинамика</span>
          <span style="font-size: 11px;">▾</span>
        </summary>
        
        <div class="formula-window">
          <span class="formula-window-title">Математическая формула расчета:</span>
          <div class="formula-window-code">KV = (ЧСС × 10) / (САД - ДАД)</div>
        </div>

        <div class="formula-desc-text">
          <p>💡 <b>Гемодинамический смысл:</b> Формула сопоставляет хронотропную реакцию (частоту пульса) с ударным объемом крови, косвенным маркером которого выступает пульсовое давление (ПД = САД - ДАД).</p>
          <p>• <b>Норма:</b> около 16.0 усл. ед. для взрослого человека.</p>
          <p>• <b>Меньше 16.0:</b> Сердце работает высокоэкономично, выбрасывая достаточный объем крови за одно сокращение.</p>
          <p>• <b>Больше 16.0:</b> Падение ударного объема, компенсируемое частым пульсом (признак утомления или перегрузки).</p>
        </div>
      </details>
    `;

    bindKvasEvents(screen);
  }

  function bindKvasEvents(root) {
    root.querySelector('#btn-run-kvas')?.addEventListener('click', calculateKvas);
    root.querySelector('#btn-share-kvas-story')?.addEventListener('click', shareKvasStory);
  }

  function calculateKvas() {
    if (typeof window.haptic === 'function') window.haptic('light');

    const hrInput = document.getElementById('kvas-pulse');
    const sbpInput = document.getElementById('kvas-sbp');
    const dbpInput = document.getElementById('kvas-dbp');

    if (!hrInput || !sbpInput || !dbpInput) return;

    hrInput.classList.remove('field-error');
    sbpInput.classList.remove('field-error');
    dbpInput.classList.remove('field-error');

    const hr = parseFloat(hrInput.value);
    const sbp = parseFloat(sbpInput.value);
    const dbp = parseFloat(dbpInput.value);

    if (!hr || isNaN(hr) || hr < 35 || hr > 180) {
      hrInput.classList.add('field-error');
      alert('Пожалуйста, укажите реальный пульс в покое от 35 до 180 уд/мин.');
      return;
    }

    if (!sbp || isNaN(sbp) || sbp < 70 || sbp > 240) {
      sbpInput.classList.add('field-error');
      alert('Пожалуйста, укажите реальное систолическое АД от 70 до 240 мм рт. ст.');
      return;
    }

    if (!dbp || isNaN(dbp) || dbp < 40 || dbp > 140) {
      dbpInput.classList.add('field-error');
      alert('Пожалуйста, укажите реальное диастолическое АД от 40 до 140 мм рт. ст.');
      return;
    }

    const pp = sbp - dbp;
    if (pp <= 10) {
      sbpInput.classList.add('field-error');
      dbpInput.classList.add('field-error');
      alert('Систолическое давление должно превышать диастолическое как минимум на 15–20 мм рт. ст.');
      return;
    }

    const kvNum = (hr * 10) / pp;
    const kv = kvNum.toFixed(1);

    const badge = document.getElementById('kvas-badge');
    let status = '', badgeClass = '', state = '', economy = '', comment = '', subtitle = '';

    if (kvNum < 12.0) {
      status = 'Высокая выносливость';
      badgeClass = 'badge-normal';
      state = 'Отличный резерв миокарда';
      economy = 'Высокоэкономичная';
      subtitle = 'Высокая экономичность сердечной мышцы и большой ударный объем.';
      comment = 'Выраженная тренированность сердечно-сосудистой системы. Систолический выброс высокий, сердце обеспечивает кровообращение при минимальной частоте сокращений.';
    } else if (kvNum <= 16.0) {
      status = 'Нормальный уровень';
      badgeClass = 'badge-success';
      state = 'Оптимальный баланс';
      economy = 'В норме';
      subtitle = 'Оптимальный баланс регуляции сосудистого тонуса и работы сердца.';
      comment = 'Показатель соответствует здоровой норме. Сердечно-сосудистая система компенсирует нагрузки без признаков утомления.';
    } else if (kvNum <= 20.0) {
      status = 'Умеренное утомление';
      badgeClass = 'badge-warning';
      state = 'Снижение ударного объема';
      economy = 'Снижена';
      subtitle = 'Снижение ударного объема миокарда и компенсаторное учащение пульса.';
      comment = 'Коэффициент превышает оптимум. Миокард компенсирует снижение ударного объема учащением пульса. Рекомендуется оптимизировать баланс между тренировками и сном.';
    } else {
      status = 'Выраженное утомление';
      badgeClass = 'badge-danger';
      state = 'Функциональная перегрузка';
      economy = 'Неэкономичная';
      subtitle = 'Признаки функционального переутомления сердечно-сосудистой системы.';
      comment = 'Существенное снижение сократительного резерва сердечной мышцы или перенапряжение. Рекомендуется отдых и контроль АД в динамике.';
    }

    lastKvasData = {
      val: kv,
      status: status,
      subtitle: subtitle,
      hemo: {
        pp: `${pp} мм рт. ст.`,
        economy: economy
      },
      params: {
        'ЧСС в покое': `${hr} уд/мин`,
        'АД (САД / ДАД)': `${sbp} / ${dbp} мм рт. ст.`,
        'Пульсовое давление': `${pp} мм рт. ст.`,
        'Экономичность': economy
      }
    };

    const valEl = document.getElementById('kvas-value');
    if (valEl) valEl.textContent = kv;

    if (badge) {
      badge.textContent = status;
      badge.className = 'badge-status ' + badgeClass;
    }

    const ppEl = document.getElementById('kvas-pp');
    if (ppEl) ppEl.textContent = `${pp} мм рт. ст.`;

    const stateEl = document.getElementById('kvas-state');
    if (stateEl) stateEl.textContent = state;

    const ecoEl = document.getElementById('kvas-economy');
    if (ecoEl) ecoEl.textContent = economy;

    const commentEl = document.getElementById('kvas-comment');
    if (commentEl) commentEl.innerHTML = `💡 <b>Оценка адаптации:</b> ${comment}`;

    if (window.storageService?.addHistoryItem) {
      window.storageService.addHistoryItem({
        type: 'kvas',
        title: 'Коэффициент выносливости (Квас)',
        value: kv,
        unit: 'усл. ед.',
        status: status
      });
    }

    const resBlock = document.getElementById('kvas-results');
    if (resBlock) resBlock.style.display = 'block';
  }

  function shareKvasStory() {
    if (window.storyGenerator && typeof window.storyGenerator.openStoryModal === 'function') {
      window.storyGenerator.openStoryModal({
        title: 'КОЭФФИЦИЕНТ ВЫНОСЛИВОСТИ (КВАС)',
        value: lastKvasData.val,
        unit: 'усл. ед.',
        status: lastKvasData.status,
        subtitle: lastKvasData.subtitle,
        type: 'kvas',
        extra: { hemo: lastKvasData.hemo },
        params: lastKvasData.params
      });
    }
  }

  window.mountKvasScreen = mountKvasScreen;
  window.calculateKvas = calculateKvas;
})();