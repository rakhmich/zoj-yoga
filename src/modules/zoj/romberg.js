/**
 * МОДУЛЬ ЗОЖ: ПРОБА РОМБЕРГА (СТАТИЧЕСКИЙ БАЛАНС С СЕКУНДОМЕРОМ)
 * Путь: src/modules/zoj/romberg.js
 */

(function () {
  'use strict';

  let lastRombergData = { val: '0 с', status: 'Норма', subtitle: '', params: {} };
  let rombergSelectedPose = 1;
  let rombergIsRunning = false;
  let rombergStartTime = 0;
  let rombergTimerId = null;

  function mountRombergScreen(container) {
    let screen = container || document.getElementById('screen-romberg');
    if (!screen) return;

    if (screen.querySelector('#btn-romberg-toggle')) {
      bindRombergEvents(screen);
      return;
    }

    screen.innerHTML = `
      <div class="header-nav" style="margin-bottom: 12px;">
        <button type="button" class="back-btn back-circle-btn" data-back-to-main>← Назад к тестам</button>
      </div>

      <h2>Проба Ромберга</h2>
      <p class="subtitle" style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 16px;">
        Оценка статической координации, проприоцепции и вестибулярного контроля
      </p>

      <div class="card">
        <label style="font-size: 12px; font-weight: 700; color: var(--text-muted, #94a3b8); text-transform: uppercase; margin-bottom: 8px; display: block;">
          Выберите диагностическую позу:
        </label>
        <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px;">
          <button type="button" class="gender-btn active" id="romberg-pose-1" style="text-align: left; padding: 10px 14px; width: 100%;">
            1. Простая поза (стопы сдвинуты вместе)
          </button>
          <button type="button" class="gender-btn" id="romberg-pose-2" style="text-align: left; padding: 10px 14px; width: 100%;">
            2. Тандемная поза (стопы в одну линию)
          </button>
          <button type="button" class="gender-btn" id="romberg-pose-3" style="text-align: left; padding: 10px 14px; width: 100%;">
            3. Поза «Аист» (баланс на одной ноге)
          </button>
        </div>

        <div id="romberg-pose-hint" style="background: var(--bg-card, #1e293b); padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border-card, rgba(255,255,255,0.08)); margin-bottom: 14px; font-size: 12.5px; color: var(--text-muted, #94a3b8); line-height: 1.45;">
          🧍 <strong>Простая поза:</strong> Стопы плотно сдвинуты. Руки вытянуты вперед на уровне плеч, пальцы разведены. Закройте глаза и запустите таймер.
        </div>

        <div class="result-hero-box" style="margin-bottom: 12px;">
          <div class="result-hero-num" id="romberg-live-digits" style="font-size: 42px;">0.0</div>
          <div class="result-hero-label" id="romberg-live-status">Глаза закрыты, сохраняйте неподвижность</div>
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 14px;">
          <button type="button" class="calc-btn" id="btn-romberg-toggle" style="flex: 2; margin-top: 0;">
            Начать тест
          </button>
          <button type="button" class="calc-btn secondary-btn" id="btn-romberg-reset" style="flex: 1; margin-top: 0; background: var(--bg-card, #1e293b); border: 1px solid var(--border-card, rgba(255,255,255,0.1));">
            Сброс
          </button>
        </div>

        <div style="background: var(--bg-card, #1e293b); border: 1px solid var(--border-card, rgba(255,255,255,0.08)); border-radius: 12px; padding: 12px 14px; margin-bottom: 14px;">
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted, #94a3b8); text-transform: uppercase; margin-bottom: 8px;">
            Сопутствующие неврологические признаки:
          </div>
          <label style="display: flex; align-items: center; gap: 10px; font-size: 12.5px; color: var(--text-main, #f8fafc); cursor: pointer; margin-bottom: 8px;">
            <input type="checkbox" id="romberg-chk-tremor" style="width: 18px; height: 18px; accent-color: var(--accent, #38bdf8);" />
            <span>Тремор (дрожание) пальцев рук или век</span>
          </label>
          <label style="display: flex; align-items: center; gap: 10px; font-size: 12.5px; color: var(--text-main, #f8fafc); cursor: pointer;">
            <input type="checkbox" id="romberg-chk-swaying" style="width: 18px; height: 18px; accent-color: var(--accent, #38bdf8);" />
            <span>Выраженные покачивания туловища</span>
          </label>
        </div>

        <div style="padding-top: 10px; border-top: 1px dashed var(--border-card, rgba(255,255,255,0.1));">
          <label for="romberg-manual-input">Или введите секунды вручную:</label>
          <div style="display: flex; gap: 8px;">
            <input type="number" id="romberg-manual-input" placeholder="Время в сек" step="0.5" inputmode="decimal" style="margin-bottom: 0;">
            <button type="button" class="calc-btn" id="btn-romberg-manual" style="width: auto; margin-top: 0; padding: 10px 18px; white-space: nowrap;">
              Оценить
            </button>
          </div>
        </div>

        <div class="results" id="romberg-results" style="display: none; margin-top: 18px;">
          <div class="result-hero-box">
            <div class="result-hero-num" id="romberg-final-val">0.0 с</div>
            <div class="result-hero-label" id="romberg-final-label">Время удержания баланса</div>
          </div>

          <div class="badge-status-wrap" style="text-align: center; margin: 12px 0;">
            <span class="badge-status" id="romberg-badge">Норма</span>
          </div>

          <div class="res-row">
            <span>Выбранная диагностическая поза:</span>
            <span class="res-val" id="romberg-res-pose">—</span>
          </div>

          <div class="res-row">
            <span>Проприоцептивный контроль:</span>
            <span class="res-val" id="romberg-res-proprio">—</span>
          </div>

          <div class="res-row">
            <span>Тонус нервной системы:</span>
            <span class="res-val" id="romberg-res-cns">—</span>
          </div>

          <div class="comment-box" id="romberg-comment"></div>

          <button type="button" class="share-story-btn" id="btn-share-romberg-story">
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
          <span>Методика проведения, физиология и критерии оценки</span>
          <span style="font-size: 11px;">▾</span>
        </summary>
        
        <div class="formula-window">
          <span class="formula-window-title">Протокол выполнения (поза Ромберга):</span>
          <div class="formula-window-code">Положение: руки вытянуты вперед, глаза закрыты [сек]</div>
        </div>

        <div class="formula-desc-text">
          <p>💡 <b>Физиологический смысл:</b> Равновесие с закрытыми глазами исключает зрительный контроль, заставляя мозг опираться исключительно на проприорецепторы связок и суставов стоп и вестибулярные ядра.</p>
          <p>• <b>Простая поза:</b> более 30 сек — норма; более 45 сек — отличный атлетический баланс.</p>
          <p>• <b>Тандемная поза:</b> норма 15–25 сек; менее 8 сек — сниженная координация.</p>
          <p>• <b>Поза «Аист»:</b> норма 12–20 сек; более 20 сек — отличный баланс на одной ноге.</p>
        </div>
      </details>
    `;

    bindRombergEvents(screen);
  }

  function bindRombergEvents(root) {
    const p1Btn = root.querySelector('#romberg-pose-1');
    const p2Btn = root.querySelector('#romberg-pose-2');
    const p3Btn = root.querySelector('#romberg-pose-3');

    p1Btn?.addEventListener('click', () => setRombergPose(1, root));
    p2Btn?.addEventListener('click', () => setRombergPose(2, root));
    p3Btn?.addEventListener('click', () => setRombergPose(3, root));

    root.querySelector('#btn-romberg-toggle')?.addEventListener('click', toggleRombergTimer);
    root.querySelector('#btn-romberg-reset')?.addEventListener('click', resetRombergTimer);

    root.querySelector('#btn-romberg-manual')?.addEventListener('click', () => {
      const input = root.querySelector('#romberg-manual-input');
      const val = parseFloat(input?.value);
      if (!val || val <= 0 || val > 300) {
        alert('Пожалуйста, укажите реальное время от 1 до 300 секунд.');
        return;
      }
      evaluateRomberg(val);
    });

    root.querySelector('#btn-share-romberg-story')?.addEventListener('click', shareRombergStory);
  }

  function setRombergPose(poseId, root) {
    if (typeof window.haptic === 'function') window.haptic('light');
    if (rombergIsRunning) resetRombergTimer();
    rombergSelectedPose = poseId;

    const btn1 = root.querySelector('#romberg-pose-1');
    const btn2 = root.querySelector('#romberg-pose-2');
    const btn3 = root.querySelector('#romberg-pose-3');
    const hint = root.querySelector('#romberg-pose-hint');

    btn1?.classList.toggle('active', poseId === 1);
    btn2?.classList.toggle('active', poseId === 2);
    btn3?.classList.toggle('active', poseId === 3);

    if (hint) {
      if (poseId === 1) {
        hint.innerHTML = '🧍 <strong>Простая поза:</strong> Стопы плотно сдвинуты (пятки и носки вместе). Руки вперед на уровне плеч, пальцы слегка разведены. Закройте глаза и запустите таймер.';
      } else if (poseId === 2) {
        hint.innerHTML = '🚶 <strong>Тандемная поза:</strong> Стопы в одну линию: носок сзади стоящей ноги касается пятки впереди стоящей. Руки вперед, закройте глаза.';
      } else {
        hint.innerHTML = '🦩 <strong>Поза «Аист»:</strong> Стояние на одной ноге. Стопа второй ноги прижата к колену опорной. Руки вытянуты вперед, глаза закрыты.';
      }
    }
  }

  function toggleRombergTimer() {
    if (typeof window.haptic === 'function') window.haptic('light');
    const toggleBtn = document.getElementById('btn-romberg-toggle');
    const digits = document.getElementById('romberg-live-digits');
    const statusEl = document.getElementById('romberg-live-status');

    if (!rombergIsRunning) {
      rombergIsRunning = true;
      rombergStartTime = performance.now();
      if (toggleBtn) {
        toggleBtn.textContent = 'Потеря равновесия (Стоп)';
        toggleBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      }
      if (statusEl) statusEl.textContent = 'Тест идет... Держите глаза закрытыми';

      rombergTimerId = setInterval(() => {
        const elapsed = (performance.now() - rombergStartTime) / 1000;
        if (digits) digits.textContent = elapsed.toFixed(1);
      }, 100);
    } else {
      const finalSec = parseFloat(digits?.textContent || '0');
      resetRombergTimer();
      evaluateRomberg(finalSec);
    }
  }

  function resetRombergTimer() {
    clearInterval(rombergTimerId);
    rombergTimerId = null;
    rombergIsRunning = false;

    const toggleBtn = document.getElementById('btn-romberg-toggle');
    if (toggleBtn) {
      toggleBtn.textContent = 'Начать тест';
      toggleBtn.style.background = '';
    }

    const digits = document.getElementById('romberg-live-digits');
    if (digits) digits.textContent = '0.0';

    const statusEl = document.getElementById('romberg-live-status');
    if (statusEl) statusEl.textContent = 'Глаза закрыты, сохраняйте неподвижность';
  }

  function evaluateRomberg(seconds) {
    if (typeof window.haptic === 'function') window.haptic('medium');

    const tremor = document.getElementById('romberg-chk-tremor')?.checked || false;
    const swaying = document.getElementById('romberg-chk-swaying')?.checked || false;

    const poseNames = ['Простая поза', 'Тандемная поза', 'Поза «Аист»'];
    const poseName = poseNames[rombergSelectedPose - 1];

    let status = '', badgeClass = '', cns = '', proprio = '', comment = '', subtitle = '';

    if (rombergSelectedPose === 1) {
      if (seconds >= 30 && !tremor && !swaying) {
        status = 'Атлетический баланс';
        badgeClass = 'badge-normal';
        cns = 'Сверхстабильный тонус';
        proprio = 'Превосходная';
        subtitle = 'Выдающаяся статическая координация и стабильность вестибулярного аппарата.';
        comment = 'Отличная устойчивость. Нервная система и проприоцептивный аппарат удерживают баланс без зрительного контроля с минимальным тремором.';
      } else if (seconds >= 20) {
        status = 'Здоровая норма';
        badgeClass = 'badge-success';
        cns = 'Оптимальный баланс';
        proprio = 'Уверенная';
        subtitle = 'Физиологический оптимум статической координации и постурального контроля.';
        comment = 'Показатель в пределах здоровой нормы. Вестибулярный аппарат обеспечивает уверенное равновесие.';
      } else if (seconds >= 12) {
        status = 'Умеренное отклонение';
        badgeClass = 'badge-warning';
        cns = 'Признаки утомления ЦНС';
        proprio = 'Сниженная';
        subtitle = 'Умеренное снижение статической устойчивости или переутомление.';
        comment = 'Заметное раскачивание свидетельствует о переутомлении нервной системы или слабости стабилизаторов стопы.';
      } else {
        status = 'Сниженный баланс';
        badgeClass = 'badge-danger';
        cns = 'Перегрузка / дисфункция';
        proprio = 'Нарушена';
        subtitle = 'Выраженное снижение проприоцептивного контроля.';
        comment = 'Сложности с удержанием равновесия указывают на перегрузку нервной системы или сильную зависимость от зрения.';
      }
    } else if (rombergSelectedPose === 2) {
      if (seconds >= 25 && !tremor && !swaying) {
        status = 'Высокая координация';
        badgeClass = 'badge-normal';
        cns = 'Стабильный тонус';
        proprio = 'Высокая';
        subtitle = 'Отличная координация при резко суженной опорной площади.';
        comment = 'Тело мгновенно компенсирует микросмещения центра тяжести без зрительного контроля.';
      } else if (seconds >= 15) {
        status = 'Хорошая норма';
        badgeClass = 'badge-success';
        cns = 'Нормальный';
        proprio = 'Адекватная';
        subtitle = 'Нормативная устойчивость в тандемной стойке.';
        comment = 'Хороший показатель устойчивости во фронтальной плоскости при выключенном зрении.';
      } else {
        status = 'Сниженная устойчивость';
        badgeClass = 'badge-danger';
        cns = 'Утомление';
        proprio = 'Слабая';
        subtitle = 'Затруднен контроль равновесия при сужении опорной базы.';
        comment = 'Тренируйте стойку тандем сначала с открытыми глазами, укрепляя мышцы кора и голеностопа.';
      }
    } else {
      if (seconds >= 20 && !tremor && !swaying) {
        status = 'Выдающийся баланс';
        badgeClass = 'badge-normal';
        cns = 'Абсолютный контроль';
        proprio = 'Превосходная';
        subtitle = 'Исключительная устойчивость на одной опорной ноге.';
        comment = 'Превосходная работа глубокой мышечно-суставной чувствительности и стабилизаторов таза.';
      } else if (seconds >= 12) {
        status = 'Здоровая норма';
        badgeClass = 'badge-success';
        cns = 'Оптимальный';
        proprio = 'Хорошая';
        subtitle = 'Нормативная устойчивость на одной опорной ноге.';
        comment = 'Хороший показатель устойчивости на одной ноге без зрительного контроля.';
      } else {
        status = 'Слабый баланс';
        badgeClass = 'badge-danger';
        cns = 'Снижен';
        proprio = 'Недостаточная';
        subtitle = 'Резкая потеря равновесия на одной ноге.';
        comment = 'Мышцы-стабилизаторы бедра и голеностопа требуют регулярного укрепления балансовыми позами.';
      }
    }

    if (tremor || swaying) {
      comment += ' ⚠️ <i>Зафиксированы сопутствующие маркеры (тремор / покачивания), указывающие на напряжение вегетативной системы.</i>';
    }

    const valEl = document.getElementById('romberg-final-val');
    if (valEl) valEl.textContent = `${seconds} с`;

    const badge = document.getElementById('romberg-badge');
    if (badge) {
      badge.textContent = status;
      badge.className = 'badge-status ' + badgeClass;
    }

    const poseEl = document.getElementById('romberg-res-pose');
    if (poseEl) poseEl.textContent = poseName;

    const proprioEl = document.getElementById('romberg-res-proprio');
    if (proprioEl) proprioEl.textContent = proprio;

    const cnsEl = document.getElementById('romberg-res-cns');
    if (cnsEl) cnsEl.textContent = cns;

    const commentEl = document.getElementById('romberg-comment');
    if (commentEl) commentEl.innerHTML = `💡 <b>Оценка координации:</b> ${comment}`;

    lastRombergData = {
      val: `${seconds}`,
      status: status.toUpperCase(),
      subtitle: subtitle,
      params: {
        'Поза': poseName,
        'Время устойчивости': `${seconds} с`,
        'Проприоцепция': proprio,
        'Тонус ЦНС': cns
      }
    };

    if (window.storageService?.addHistoryItem) {
      window.storageService.addHistoryItem({
        type: 'romberg',
        title: 'Проба Ромберга',
        value: `${seconds}`,
        unit: 'с',
        status: status
      });
    }

    const results = document.getElementById('romberg-results');
    if (results) results.style.display = 'block';
  }

  function shareRombergStory() {
    if (window.storyGenerator && typeof window.storyGenerator.openStoryModal === 'function') {
      window.storyGenerator.openStoryModal({
        title: 'ПРОБА РОМБЕРГА (БАЛАНС)',
        value: lastRombergData.val,
        unit: 'с',
        status: lastRombergData.status,
        subtitle: lastRombergData.subtitle,
        type: 'romberg',
        params: lastRombergData.params
      });
    }
  }

  window.mountRombergScreen = mountRombergScreen;
  window.evaluateRomberg = evaluateRomberg;
})();