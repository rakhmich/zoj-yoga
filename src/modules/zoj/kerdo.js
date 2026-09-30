/**
 * МОДУЛЬ ЗОЖ: ВЕГЕТАТИВНЫЙ ИНДЕКС КЕРДО (ВИК)
 * Путь: src/modules/zoj/kerdo.js
 */

(function () {
  'use strict';

  let lastKerdoData = { val: '0%', status: 'Эйтония', subtitle: '', params: {} };

  function mountKerdoScreen(container) {
    let screen = container || document.getElementById('screen-kerdo');
    if (!screen) return;

    if (screen.querySelector('#btn-run-kerdo')) {
      bindKerdoEvents(screen);
      return;
    }

    screen.innerHTML = `
      <div class="header-nav" style="margin-bottom: 12px;">
        <button type="button" class="back-btn back-circle-btn" data-back-to-main>← Назад к тестам</button>
      </div>

      <h2>Вегетативный индекс Кердо</h2>
      <p class="subtitle" style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 16px;">
        Оценка баланса симпатического и парасимпатического отделов вегетативной нервной системы
      </p>

      <div class="card">
        <label for="kerdo-pulse">ЧСС в покое утром (уд/мин):</label>
        <input type="number" id="kerdo-pulse" placeholder="Например: 70" inputmode="numeric">

        <label for="kerdo-dbp">Диастолическое (нижнее) АД (мм рт. ст.):</label>
        <input type="number" id="kerdo-dbp" placeholder="Например: 75" inputmode="numeric">

        <button type="button" class="calc-btn" id="btn-run-kerdo">Рассчитать индекс Кердо</button>

        <div class="results" id="kerdo-results" style="display: none; margin-top: 16px;">
          <div class="result-hero-box">
            <div class="result-hero-num" id="kerdo-value">0%</div>
            <div class="result-hero-label">Вегетативный индекс (ВИК)</div>
          </div>

          <div class="badge-status-wrap" style="text-align: center; margin: 12px 0;">
            <span class="badge-status" id="kerdo-badge">Эйтония</span>
          </div>

          <div class="res-row">
            <span>Вегетативный тонус:</span>
            <span class="res-val" id="kerdo-state">—</span>
          </div>

          <div class="res-row">
            <span>Направленность обмена:</span>
            <span class="res-val" id="kerdo-metabolism">—</span>
          </div>

          <div class="res-row">
            <span>Уровень адаптационного стресса:</span>
            <span class="res-val" id="kerdo-stress">—</span>
          </div>

          <div class="comment-box" id="kerdo-comment"></div>

          <button type="button" class="share-story-btn" id="btn-share-kerdo-story">
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
          <span>Физиологическое обоснование индекса и вегетативный баланс</span>
          <span style="font-size: 11px;">▾</span>
        </summary>
        
        <div class="formula-window">
          <span class="formula-window-title">Математическая модель:</span>
          <div class="formula-window-code">ВИК = [1 - (ДАД / ЧСС)] × 100%</div>
        </div>

        <div class="formula-desc-text">
          <p>💡 <b>Суть методики:</b> Предложен Иштваном Кердо в 1953 г. Отражает соотношение между симпатическим (мобилизация, стресс) и парасимпатическим (восстановление, отдых) отделами ВНС.</p>
          <p>⚠️ <b>Условия замера:</b> Замер проводится строго утром, в покое, сидя после 5 минут отдыха.</p>
        </div>
      </details>
    `;

    bindKerdoEvents(screen);
  }

  function bindKerdoEvents(root) {
    root.querySelector('#btn-run-kerdo')?.addEventListener('click', calculateKerdo);
    root.querySelector('#btn-share-kerdo-story')?.addEventListener('click', shareKerdoStory);
  }

  function calculateKerdo() {
    if (typeof window.haptic === 'function') window.haptic('light');

    const pulseInput = document.getElementById('kerdo-pulse');
    const dbpInput = document.getElementById('kerdo-dbp');
    if (!pulseInput || !dbpInput) return;

    pulseInput.classList.remove('field-error');
    dbpInput.classList.remove('field-error');

    const hr = parseFloat(pulseInput.value);
    const dbp = parseFloat(dbpInput.value);

    if (!hr || isNaN(hr) || hr < 35 || hr > 180) {
      pulseInput.classList.add('field-error');
      alert('Пожалуйста, укажите реальный пульс в покое от 35 до 180 уд/мин.');
      return;
    }

    if (!dbp || isNaN(dbp) || dbp < 40 || dbp > 140) {
      dbpInput.classList.add('field-error');
      alert('Пожалуйста, укажите реальное диастолическое АД от 40 до 140 мм рт. ст.');
      return;
    }

    const vik = Math.round((1 - (dbp / hr)) * 100);
    const formattedVal = `${vik > 0 ? '+' : ''}${vik}%`;

    const badge = document.getElementById('kerdo-badge');
    let status = '', badgeClass = '', state = '', metabolism = '', stress = '', comment = '';

    if (vik > 30) {
      status = 'Выраженная симпатикотония';
      badgeClass = 'badge-danger';
      state = 'Преобладание симпатики';
      metabolism = 'Эрготропный катаболизм';
      stress = 'Высокий уровень напряжения';
      comment = 'Организм в режиме мобилизации ресурсов (стресс, переутомление). Рекомендуется снизить интенсивность тренировок.';
    } else if (vik > 10) {
      status = 'Умеренная симпатикотония';
      badgeClass = 'badge-warning';
      state = 'Активация симпатики';
      metabolism = 'Расход энергии';
      stress = 'Умеренно повышен';
      comment = 'Тонус симпатической системы преобладает. Организм готов к нагрузкам, но быстрее расходует резервы.';
    } else if (vik >= -10) {
      status = 'Эйтония (равновесие)';
      badgeClass = 'badge-success';
      state = 'Гармоничный баланс ВНС';
      metabolism = 'Равновесный гомеостаз';
      stress = 'Оптимальная норма';
      comment = 'Идеальный вегетативный баланс! Отделы нервной системы находятся в равновесии.';
    } else if (vik >= -30) {
      status = 'Умеренная ваготония';
      badgeClass = 'badge-normal';
      state = 'Преобладание парасимпатики';
      metabolism = 'Трофотропный анаболизм';
      stress = 'Низкий (восстановление)';
      comment = 'Организм ориентирован на накопление энергии и восстановление. Благоприятное состояние для усвоения нагрузок.';
    } else {
      status = 'Выраженная ваготония';
      badgeClass = 'badge-normal';
      state = 'Преобладание блуждающего нерва';
      metabolism = 'Глубокий анаболический сдвиг';
      stress = 'Минимальный';
      comment = 'Выраженное превалирование парасимпатики. Может сопровождаться сонливостью.';
    }

    const subtitle = (vik >= -10 && vik <= 10)
      ? 'Оптимальный баланс отделов ВНС.'
      : (vik > 10
        ? 'Преобладание симпатического тонуса: расход энергии.'
        : 'Преобладание парасимпатического тонуса: анаболический режим.');

    lastKerdoData = {
      val: formattedVal,
      status: status.toUpperCase(),
      subtitle: subtitle,
      params: {
        'ЧСС в покое': `${hr} уд/мин`,
        'Диастолическое АД': `${dbp} мм рт. ст.`,
        'Вегетативный тонус': state
      }
    };

    const valEl = document.getElementById('kerdo-value');
    if (valEl) valEl.textContent = formattedVal;

    if (badge) {
      badge.textContent = status;
      badge.className = 'badge-status ' + badgeClass;
    }

    const stateEl = document.getElementById('kerdo-state');
    if (stateEl) stateEl.textContent = state;

    const metEl = document.getElementById('kerdo-metabolism');
    if (metEl) metEl.textContent = metabolism;

    const stressEl = document.getElementById('kerdo-stress');
    if (stressEl) stressEl.textContent = stress;

    const commentEl = document.getElementById('kerdo-comment');
    if (commentEl) {
      commentEl.innerHTML = `💡 <b>Интерпретация:</b> ${comment}`;
    }

    if (window.storageService?.addHistoryItem) {
      window.storageService.addHistoryItem({
        type: 'kerdo',
        title: 'Индекс Кердо (ВИК)',
        value: formattedVal,
        unit: '%',
        status: status
      });
    }

    const resultsBlock = document.getElementById('kerdo-results');
    if (resultsBlock) resultsBlock.style.display = 'block';
  }

function shareKerdoStory() {
    window.storyGenerator.openStoryModal({
      title: 'ИНДЕКС КЕРДО (ВНС)',
      value: lastKerdoData.val,
      unit: '',
      status: lastKerdoData.status,
      subtitle: lastKerdoData.subtitle,
      type: 'kerdo',
      params: lastKerdoData.params
    });
  }

  window.mountKerdoScreen = mountKerdoScreen;
  window.calculateKerdo = calculateKerdo;
})();