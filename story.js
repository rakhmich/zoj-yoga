// =======================================================
// КЛИЕНТСКИЙ МОДУЛЬ STORIES (story.js)
// Адаптивный динамический спейсинг и безопасное масштабирование
// =======================================================

const BOT_USERNAME = 'zoj_tl_bot';
const BOT_START_LINK = `https://t.me/${BOT_USERNAME}?start=start`;

let storyState = {
  title: 'РЕЗУЛЬТАТ ТЕСТА',
  value: '0',
  status: 'Норма',
  subtitle: '',
  type: 'generic',
  extra: {},
  params: {},
  neonColor: '#38bdf8',
  showParams: false,
  isBusy: false
};

window.shareResultAsStory = function(arg1, arg2, arg3, arg4, arg5) {
  if (typeof arg1 === 'object' && arg1 !== null) {
    storyState.title = arg1.title || 'РЕЗУЛЬТАТ ТЕСТА';
    storyState.value = String(arg1.value || '0');
    storyState.status = arg1.status || 'Норма';
    storyState.subtitle = arg1.subtitle || '';
    storyState.type = arg1.type || 'generic';
    storyState.extra = arg1.extra || arg1;
    storyState.params = arg1.params || {};
  } else {
    storyState.title = arg1 || 'РЕЗУЛЬТАТ ТЕСТА';
    storyState.value = String(arg2 || '0');
    storyState.status = arg3 || 'Норма';
    storyState.params = arg4 || {};
    if (typeof arg5 === 'object' && arg5 !== null) {
      storyState.subtitle = arg5.subtitle || '';
      storyState.type = arg5.type || 'generic';
      storyState.extra = arg5;
    } else if (typeof arg5 === 'string') {
      storyState.subtitle = arg5;
      storyState.type = 'generic';
      storyState.extra = {};
    }
  }

  storyState.showParams = false;
  storyState.isBusy = false;

  ensureStoryModalExists();
  setupStoryControls();
  drawStoryToCanvas();

  const modal = document.getElementById('story-modal');
  if (modal) modal.classList.add('active');
};

function ensureStoryModalExists() {
  if (document.getElementById('story-modal')) return;

  const modalHtml = `
    <div class="story-modal" id="story-modal">
      <div class="story-modal-overlay" onclick="closeStoryModal()"></div>
      <div class="story-modal-box">
        <div class="story-modal-header">
          <div class="story-modal-title">Публикация в Stories</div>
          <button type="button" class="story-close-btn" onclick="closeStoryModal()">✕</button>
        </div>

        <div class="story-controls"></div>

        <div class="story-preview-container">
          <canvas id="story-canvas" width="1080" height="1920" style="display:none;"></canvas>
          <img id="story-preview-img" alt="Предпросмотр сторис" src="">
        </div>

        <div class="story-actions-group">
          <button type="button" class="share-btn-native" id="story-btn-bot" onclick="sendStoryToBotChat()">
            <svg class="neon-icon-spin" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:8px;">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span style="font-size: 16px; font-weight: 800;">Отправить ботом</span>
          </button>
          <div class="story-bot-hint">
            *Для получения карточки отправьте боту <a href="${BOT_START_LINK}" target="_blank" onclick="openExternal('${BOT_START_LINK}'); return false;">сообщение /start</a>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function setupStoryControls() {
  const box = document.querySelector('.story-controls');
  if (!box) return;

  const hasParams = storyState.params && Object.keys(storyState.params).length > 0;

  box.innerHTML = `
    <div class="story-palette-row">
      <span class="story-ctrl-label">Неоновая подсветка:</span>
      <div class="story-palette">
        <button type="button" class="color-dot ${storyState.neonColor === '#38bdf8' ? 'active' : ''}" style="background:#38bdf8;" onclick="setStoryNeon('#38bdf8', this)"></button>
        <button type="button" class="color-dot ${storyState.neonColor === '#c084fc' ? 'active' : ''}" style="background:#c084fc;" onclick="setStoryNeon('#c084fc', this)"></button>
        <button type="button" class="color-dot ${storyState.neonColor === '#10b981' ? 'active' : ''}" style="background:#10b981;" onclick="setStoryNeon('#10b981', this)"></button>
        <button type="button" class="color-dot ${storyState.neonColor === '#f59e0b' ? 'active' : ''}" style="background:#f59e0b;" onclick="setStoryNeon('#f59e0b', this)"></button>
        <button type="button" class="color-dot ${storyState.neonColor === '#f43f5e' ? 'active' : ''}" style="background:#f43f5e;" onclick="setStoryNeon('#f43f5e', this)"></button>
      </div>
    </div>

    ${hasParams ? `
      <div class="story-toggle-row">
        <label class="story-toggle-label" for="story-param-chk">Показать параметры замера</label>
        <label class="switch-control">
          <input type="checkbox" id="story-param-chk" ${storyState.showParams ? 'checked' : ''} onchange="toggleStoryParams(this.checked)">
          <span class="switch-slider"></span>
        </label>
      </div>
    ` : ''}
  `;
}

function setStoryNeon(color, btn) {
  storyState.neonColor = color;
  document.querySelectorAll('.story-palette .color-dot').forEach(d => d.classList.remove('active'));
  if (btn) btn.classList.add('active');
  drawStoryToCanvas();
}

function toggleStoryParams(checked) {
  storyState.showParams = checked;
  drawStoryToCanvas();
}

// -------------------------------------------------------
// ГЛАВНЫЙ РЕНДЕР С ДИНАМИЧЕСКИМИ АДАПТИВНЫМИ ОТСТУПАМИ
// -------------------------------------------------------
function drawStoryToCanvas() {
  let canvas = document.getElementById('story-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'story-canvas';
    canvas.width = 1080;
    canvas.height = 1920;
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  const w = 1080, h = 1920;
  const neon = storyState.neonColor;

  // 1. Фоновый градиент
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#060913');
  bgGrad.addColorStop(0.5, '#0b1329');
  bgGrad.addColorStop(1, '#04060d');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Радиальная аура неона
  const radialGlow = ctx.createRadialGradient(w / 2, 850, 90, w / 2, 850, 700);
  radialGlow.addColorStop(0, hexToRgba(neon, 0.24));
  radialGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, w, h);

  // 3. Главная карточка
  const cardX = 70, cardY = 105, cardW = 940, cardH = 1710, cardR = 52;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.fillStyle = 'rgba(11, 17, 32, 0.94)';
  ctx.fill();

  ctx.lineWidth = 5;
  ctx.strokeStyle = neon;
  ctx.shadowColor = neon;
  ctx.shadowBlur = 32;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 4. Верхний колонтитул
  ctx.textAlign = 'left';
  ctx.font = '800 34px Manrope, sans-serif';
  ctx.fillStyle = neon;
  ctx.fillText('ФИЗКУЛЬТУРА, ЗОЖ И СПОРТ', cardX + 55, cardY + 90);

  ctx.textAlign = 'right';
  ctx.font = '700 32px Manrope, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Татьяна Львова', cardX + cardW - 55, cardY + 90);

  drawEcgPulse(ctx, w / 2, cardY + 155, 480, neon);

  // 5. Нижний колонтитул
  ctx.textAlign = 'center';
  ctx.font = '700 32px Manrope, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Мини-приложение для здоровья и фитнеса', w / 2, cardY + cardH - 95);

  ctx.font = '800 36px Manrope, sans-serif';
  ctx.fillStyle = neon;
  ctx.fillText(`Проверь свои показатели ↗ @${BOT_USERNAME}`, w / 2, cardY + cardH - 50);

  // -------------------------------------------------------
  // АДАПТИВНЫЙ РАСЧЕТ ВЫСОТ И БЛОКОВ
  // -------------------------------------------------------
  const topBoundary = cardY + 180;
  const bottomBoundary = cardY + cardH - 140;
  const availableH = bottomBoundary - topBoundary;

  // 1. Заголовок теста
  ctx.font = '800 52px Manrope, sans-serif';
  const titleLines = wrapCanvasText(ctx, storyState.title, 800);
  const titleH = titleLines.length * 62;

  // 2. Главное значение
  const valueH = 145;

  // 3. Статус-бейдж
  const badgeH = 76;

  // 4. Специфический виджет теста
  let widgetH = 0;
  if (storyState.type === 'bmi' || storyState.type === 'fat' || storyState.type === 'kerdo' || storyState.type === 'romberg') {
    widgetH = 100;
  } else if (storyState.type === 'bmr' || storyState.type === 'water' || storyState.type === 'rufier' || storyState.type === 'kvas') {
    widgetH = 125;
  } else if (storyState.type === 'sleep') {
    widgetH = 135;
  } else if (storyState.type === 'pulse') {
    widgetH = 280;
  } else if (storyState.type === 'stange') {
    widgetH = 165;
  }

  // 5. Подзаголовок / описание (46px)
  let subH = 0;
  let subLines = [];
  if (storyState.subtitle) {
    ctx.font = '600 46px Manrope, sans-serif';
    subLines = wrapCanvasText(ctx, storyState.subtitle, 820);
    subH = subLines.length * 56;
  }

  // 6. Таблица параметров
  let paramsBoxH = 0;
  let computedParamRows = [];
  const showParamsActive = storyState.showParams && storyState.params && Object.keys(storyState.params).length > 0;

  if (showParamsActive) {
    Object.entries(storyState.params).forEach(([k, v]) => {
      ctx.font = '600 36px Manrope, sans-serif';
      const kLines = wrapCanvasText(ctx, k, 430);

      ctx.font = '800 38px Manrope, sans-serif';
      const vLines = wrapCanvasText(ctx, String(v), 370);

      const maxLines = Math.max(kLines.length, vLines.length);
      const rowH = maxLines * 44 + 28;
      computedParamRows.push({ kLines, vLines, rowH, maxLines });
      paramsBoxH += rowH;
    });
    paramsBoxH += 24;
  }

  // -------------------------------------------------------
  // АДАПТИВНЫЙ РАСЧЕТ МЕЖБЛОЧНЫХ ОТСТУПОВ (GAP)
  // -------------------------------------------------------
  const activeBlockHeights = [titleH, valueH, badgeH];
  if (widgetH > 0) activeBlockHeights.push(widgetH);
  if (subH > 0) activeBlockHeights.push(subH);
  if (showParamsActive && paramsBoxH > 0) activeBlockHeights.push(paramsBoxH);

  const totalBlocksHeight = activeBlockHeights.reduce((sum, bh) => sum + bh, 0);
  const numGaps = activeBlockHeights.length - 1;
  const freeSpace = availableH - totalBlocksHeight;

  // Динамический расчет:
  // Если параметров нет — щедрый комфортный отступ (до 44px)
  // Если параметры включены — отступ плавно сжимается до 14–18px
  let gap = Math.min(44, Math.max(14, Math.floor(freeSpace / (numGaps + 2))));

  // Защита от переполнения: если контента слишком много, сжимаем gap
  if (totalBlocksHeight + numGaps * gap > availableH) {
    gap = Math.max(8, Math.floor((availableH - totalBlocksHeight) / numGaps));
  }

  const totalContentH = totalBlocksHeight + numGaps * gap;
  let curY = topBoundary + Math.max(0, (availableH - totalContentH) / 2);

  // 1. Отрисовка заголовка
  ctx.textAlign = 'center';
  ctx.font = '800 52px Manrope, sans-serif';
  ctx.fillStyle = '#ffffff';
  titleLines.forEach(line => {
    ctx.fillText(line, w / 2, curY + 46);
    curY += 62;
  });
  curY += gap;

  // 2. Отрисовка значения
  ctx.font = '900 150px Manrope, sans-serif';
  ctx.fillStyle = neon;
  ctx.shadowColor = neon;
  ctx.shadowBlur = 40;
  ctx.fillText(storyState.value, w / 2, curY + 125);
  ctx.shadowBlur = 0;
  curY += valueH + gap;

  // 3. Статус-бейдж
  const statusText = storyState.status.toUpperCase();
  ctx.font = '800 36px Manrope, sans-serif';
  const badgeWidth = Math.min(ctx.measureText(statusText).width + 85, 840);
  const badgeX = (w - badgeWidth) / 2;

  drawRoundedRect(ctx, badgeX, curY, badgeWidth, badgeH, badgeH / 2);
  ctx.fillStyle = hexToRgba(neon, 0.16);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(neon, 0.65);
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(statusText, w / 2, curY + 51);
  curY += badgeH + (widgetH > 0 ? gap : 0);

  // 4. Отрисовка виджета
  if (widgetH > 0) {
    if (storyState.type === 'bmi' || storyState.type === 'fat') {
      const bVal = parseFloat(storyState.extra.bmiVal || storyState.value) || 21;
      drawCanvasScale(ctx, w / 2, curY, 820, bVal);
    } else if (storyState.type === 'bmr' && storyState.extra.bju) {
      drawCanvasBju(ctx, w / 2, curY, 820, storyState.extra.bju);
    } else if (storyState.type === 'water') {
      drawCanvasWater(ctx, w / 2, curY, 820, storyState.extra);
    } else if (storyState.type === 'pulse' && storyState.extra.zones) {
      drawCanvasPulseZones(ctx, w / 2, curY, 820, storyState.extra.zones);
    } else if (storyState.type === 'rufier') {
      const pulses = storyState.extra.pulses || { p1: 18, p2: 30, p3: 20 };
      drawCanvasRufier(ctx, w / 2, curY, 820, pulses);
    } else if (storyState.type === 'kerdo') {
      const kVal = parseFloat(storyState.value) || 0;
      drawCanvasKerdoScale(ctx, w / 2, curY, 820, kVal);
    } else if (storyState.type === 'stange' && storyState.extra.hypoxia) {
      drawCanvasStangeBars(ctx, w / 2, curY, 820, storyState.extra.hypoxia);
    } else if (storyState.type === 'kvas') {
      const hemo = storyState.extra.hemo || { pp: '40', economy: 'В норме' };
      drawCanvasKvas(ctx, w / 2, curY, 820, hemo);
    } else if (storyState.type === 'romberg') {
      const rSec = parseFloat(storyState.value) || 30;
      drawCanvasRombergScale(ctx, w / 2, curY, 820, rSec);
    } else if (storyState.type === 'sleep' && storyState.extra.cycles) {
      drawCanvasSleep(ctx, w / 2, curY, 830, storyState.extra.cycles);
    }
    curY += widgetH + (subH > 0 || (showParamsActive && paramsBoxH > 0) ? gap : 0);
  }

  // 5. Отрисовка подзаголовка
  if (subH > 0) {
    ctx.textAlign = 'center';
    ctx.font = '600 46px Manrope, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    subLines.forEach(line => {
      ctx.fillText(line, w / 2, curY + 42);
      curY += 56;
    });
    if (showParamsActive && paramsBoxH > 0) {
      curY += gap;
    }
  }

// 6. Отрисовка таблицы параметров (Фирменный стиль HUD-телеметрии)
  if (showParamsActive && paramsBoxH > 0) {
    const boxW = 840;
    const boxLeft = (w - boxW) / 2;

    // Стеклянная плашка с неоновым контуром в цвет темы
    drawRoundedRect(ctx, boxLeft, curY, boxW, paramsBoxH, 24);
    ctx.fillStyle = 'rgba(8, 14, 28, 0.82)';
    ctx.fill();
    
    ctx.save();
    ctx.strokeStyle = hexToRgba(neon, 0.38);
    ctx.lineWidth = 2.5;
    ctx.shadowColor = hexToRgba(neon, 0.25);
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();

    let rowY = curY + 16;
    computedParamRows.forEach((row, idx) => {
      // Левая колонка: аккуратный матовый серо-голубой
      ctx.textAlign = 'left';
      ctx.font = '600 36px Manrope, sans-serif';
      ctx.fillStyle = '#94a3b8';
      row.kLines.forEach((kl, lIdx) => {
        ctx.fillText(kl, boxLeft + 36, rowY + 34 + lIdx * 42);
      });

      // Правая колонка: яркий неоновый акцент в цвет темы
      ctx.textAlign = 'right';
      ctx.font = '800 38px Manrope, sans-serif';
      ctx.fillStyle = neon;
      row.vLines.forEach((vl, lIdx) => {
        ctx.fillText(vl, boxLeft + boxW - 36, rowY + 34 + lIdx * 42);
      });

      // Неоновый деликатный разделитель между строками
      if (idx < computedParamRows.length - 1) {
        ctx.save();
        const divGrad = ctx.createLinearGradient(boxLeft + 30, 0, boxLeft + boxW - 30, 0);
        divGrad.addColorStop(0, 'transparent');
        divGrad.addColorStop(0.2, hexToRgba(neon, 0.25));
        divGrad.addColorStop(0.8, hexToRgba(neon, 0.25));
        divGrad.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = divGrad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(boxLeft + 30, rowY + row.rowH);
        ctx.lineTo(boxLeft + boxW - 30, rowY + row.rowH);
        ctx.stroke();
        ctx.restore();
      }

      rowY += row.rowH;
    });
  }

  // ЭТИ СТРОКИ ОСТАЮТСЯ НА СВОЕМ МЕСТЕ В САМОМ НИЗУ ФУНКЦИИ:
  const previewImg = document.getElementById('story-preview-img');
  if (previewImg) previewImg.src = canvas.toDataURL('image/png');
}

// -------------------------------------------------------
// ВИДЖЕТЫ
// -------------------------------------------------------

function drawEcgPulse(ctx, centerX, y, width, neon) {
  ctx.save();
  ctx.strokeStyle = neon;
  ctx.shadowColor = neon;
  ctx.shadowBlur = 14;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const left = centerX - width / 2;
  ctx.beginPath();
  ctx.moveTo(left, y);
  ctx.lineTo(left + width * 0.36, y);
  ctx.lineTo(left + width * 0.43, y - 4);
  ctx.lineTo(left + width * 0.49, y - 36);
  ctx.lineTo(left + width * 0.55, y + 32);
  ctx.lineTo(left + width * 0.61, y - 16);
  ctx.lineTo(left + width * 0.67, y);
  ctx.lineTo(left + width, y);
  ctx.stroke();
  ctx.restore();
}

function drawCanvasScale(ctx, centerX, topY, width, bmiVal) {
  const left = centerX - width / 2;
  const barH = 22;
  const pinY = topY + 4;
  const barY = topY + 30;

  const segW = (width - 12) / 4;
  const colors = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444'];

  let pct = 0.5;
  if (bmiVal < 18.5) {
    pct = 0.04 + Math.max(0, Math.min((bmiVal - 14) / 4.5, 1)) * 0.20;
  } else if (bmiVal <= 24.9) {
    pct = 0.27 + Math.max(0, Math.min((bmiVal - 18.5) / 6.4, 1)) * 0.22;
  } else if (bmiVal <= 29.9) {
    pct = 0.52 + Math.max(0, Math.min((bmiVal - 25.0) / 4.9, 1)) * 0.22;
  } else {
    pct = 0.77 + Math.max(0, Math.min((bmiVal - 30.0) / 10.0, 1)) * 0.19;
  }
  const pinX = left + pct * width;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(pinX, pinY + 18);
  ctx.lineTo(pinX - 14, pinY);
  ctx.lineTo(pinX + 14, pinY);
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < 4; i++) {
    const sX = left + i * (segW + 4);
    drawRoundedRect(ctx, sX, barY, segW, barH, 8);
    ctx.fillStyle = colors[i];
    ctx.fill();
  }

  ctx.font = '700 30px Manrope, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.fillText('< 18.5', left + segW / 2, barY + 54);
  ctx.fillText('18.5 – 24.9', left + segW + 4 + segW / 2, barY + 54);
  ctx.fillText('25.0 – 29.9', left + 2 * (segW + 4) + segW / 2, barY + 54);
  ctx.fillText('≥ 30.0', left + 3 * (segW + 4) + segW / 2, barY + 54);
}

function drawCanvasRombergScale(ctx, centerX, topY, width, timeSec) {
  const left = centerX - width / 2;
  const barH = 22;
  const pinY = topY + 4;
  const barY = topY + 30;

  const pct = Math.max(0, Math.min(timeSec / 60, 1));
  const pinX = left + pct * width;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(pinX, pinY + 18);
  ctx.lineTo(pinX - 14, pinY);
  ctx.lineTo(pinX + 14, pinY);
  ctx.closePath();
  ctx.fill();

  const segW = (width - 9) / 4;
  const colors = ['#ef4444', '#f59e0b', '#10b981', '#38bdf8'];

  for (let i = 0; i < 4; i++) {
    drawRoundedRect(ctx, left + i * (segW + 3), barY, segW, barH, 8);
    ctx.fillStyle = colors[i];
    ctx.fill();
  }

  ctx.font = '700 32px Manrope, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'center';
  ctx.fillText('< 15 с', left + segW / 2, barY + 54);
  ctx.fillText('15–30 с', left + segW + segW / 2, barY + 54);
  ctx.fillText('30–45 с', left + 2 * segW + segW / 2, barY + 54);
  ctx.fillText('> 45 с', left + 3 * segW + segW / 2, barY + 54);
}

function drawCanvasSleep(ctx, centerX, topY, width, cycles, neon) {
  const left = centerX - width / 2;
  const count = Math.max(1, cycles.length);
  const gap = 12;
  const itemW = (width - (count - 1) * gap) / count;
  const itemH = 125;

  cycles.forEach((c, idx) => {
    const x = left + idx * (itemW + gap);
    drawRoundedRect(ctx, x, topY, itemW, itemH, 20);
    ctx.fillStyle = c.isOpt ? hexToRgba(neon, 0.16) : 'rgba(15, 23, 42, 0.7)';
    ctx.fill();
    ctx.strokeStyle = c.isOpt ? neon : 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = c.isOpt ? 3 : 1.5;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = '800 24px Manrope, sans-serif';
    ctx.fillStyle = c.isOpt ? neon : '#94a3b8';
    ctx.fillText(`${c.count} ц.`, x + itemW / 2, topY + 40);

    ctx.font = '900 38px Manrope, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(c.time, x + itemW / 2, topY + 92);
  });
}

function drawCanvasBju(ctx, centerX, topY, width, bju) {
  const left = centerX - width / 2;
  const itemW = (width - 24) / 3;
  const itemH = 120;

  const items = [
    { title: 'БЕЛКИ (2 г/кг)', val: `${bju.prot || 0} г`, color: '#38bdf8' },
    { title: 'ЖИРЫ (1 г/кг)', val: `${bju.fat || 0} г`, color: '#f59e0b' },
    { title: 'УГЛЕВОДЫ', val: `${bju.carb || 0} г`, color: '#10b981' }
  ];

  items.forEach((it, idx) => {
    const x = left + idx * (itemW + 12);
    drawRoundedRect(ctx, x, topY, itemW, itemH, 20);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fill();
    ctx.strokeStyle = hexToRgba(it.color, 0.4);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = '700 22px Manrope, sans-serif';
    ctx.fillStyle = it.color;
    ctx.fillText(it.title, x + itemW / 2, topY + 40);

    ctx.font = '900 40px Manrope, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(it.val, x + itemW / 2, topY + 92);
  });
}

function drawCanvasWater(ctx, centerX, topY, width, data) {
  const left = centerX - width / 2;
  const itemW = (width - 16) / 2;
  const itemH = 115;

  const items = [
    { title: 'ОБЪЕМ В ЛИТРАХ', val: data.liters || '2.0 л' },
    { title: 'СТАКАНЫ (ПО 250 МЛ)', val: data.glasses || '~8 ст.' }
  ];

  items.forEach((it, idx) => {
    const x = left + idx * (itemW + 16);
    drawRoundedRect(ctx, x, topY, itemW, itemH, 20);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = '700 22px Manrope, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(it.title, x + itemW / 2, topY + 40);

    ctx.font = '900 40px Manrope, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(it.val, x + itemW / 2, topY + 90);
  });
}

function drawCanvasPulseZones(ctx, centerX, topY, width, zones, neon) {
  const left = centerX - width / 2;
  let curY = topY;

  zones.slice(0, 3).forEach(z => {
    const h = 86;
    drawRoundedRect(ctx, left, curY, width, h, 18);
    // Подложка целевой зоны теперь берет выбранный цвет неона
    ctx.fillStyle = z.isTarget ? hexToRgba(neon, 0.16) : 'rgba(15, 23, 42, 0.6)';
    ctx.fill();
    // Рамка целевой зоны в тон неона
    ctx.strokeStyle = z.isTarget ? neon : 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = z.isTarget ? 3 : 1.5;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = z.isTarget ? '800 28px Manrope, sans-serif' : '600 26px Manrope, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(z.name, left + 26, curY + 54);

    ctx.textAlign = 'right';
    ctx.font = '800 32px Manrope, sans-serif';
    // Числовые границы целевой зоны в тон неона
    ctx.fillStyle = z.isTarget ? neon : '#94a3b8';
    ctx.fillText(z.range, left + width - 26, curY + 54);

    curY += h + 10;
  });
}

function drawCanvasRufier(ctx, centerX, topY, width, p) {
  const left = centerX - width / 2;
  const itemW = (width - 24) / 3;
  const itemH = 115;

  const steps = [
    { label: 'P1: ПОКОЙ', val: `${p.p1 || 0} уд`, color: '#38bdf8' },
    { label: 'P2: НАГРУЗКА', val: `${p.p2 || 0} уд`, color: '#f43f5e' },
    { label: 'P3: 1 МИН', val: `${p.p3 || 0} уд`, color: '#10b981' }
  ];

  steps.forEach((s, i) => {
    const x = left + i * (itemW + 12);
    drawRoundedRect(ctx, x, topY, itemW, itemH, 20);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fill();
    ctx.strokeStyle = hexToRgba(s.color, 0.4);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = '700 22px Manrope, sans-serif';
    ctx.fillStyle = s.color;
    ctx.fillText(s.label, x + itemW / 2, topY + 40);

    ctx.font = '900 40px Manrope, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(s.val, x + itemW / 2, topY + 90);
  });
}

function drawCanvasKerdoScale(ctx, centerX, topY, width, val) {
  const left = centerX - width / 2;
  const barH = 22;
  const barY = topY + 30;

  const clampVal = Math.max(-50, Math.min(val, 50));
  const pct = (clampVal + 50) / 100;
  const pinX = left + pct * width;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(pinX, topY + 18);
  ctx.lineTo(pinX - 14, topY);
  ctx.lineTo(pinX + 14, topY);
  ctx.closePath();
  ctx.fill();

  const wSide = (width - 8) * 0.4;
  const wCenter = (width - 8) * 0.2;

  drawRoundedRect(ctx, left, barY, wSide, barH, 8);
  ctx.fillStyle = '#818cf8';
  ctx.fill();

  drawRoundedRect(ctx, left + wSide + 4, barY, wCenter, barH, 8);
  ctx.fillStyle = '#10b981';
  ctx.fill();

  drawRoundedRect(ctx, left + wSide + 4 + wCenter + 4, barY, wSide, barH, 8);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();

  ctx.font = '700 30px Manrope, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'left';
  ctx.fillText('← Ваготония', left, barY + 52);
  ctx.textAlign = 'right';
  ctx.fillText('Симпатикотония →', left + width, barY + 52);
}

function drawCanvasStangeBars(ctx, centerX, topY, width, h) {
  const left = centerX - width / 2;
  const barH = 22;

  const rows = [
    { title: 'ВДОХ (ШТАНГЕ)', val: `${h.stange || 0} с`, max: 80, cur: h.stange || 0, color: '#38bdf8' },
    { title: 'ВЫДОХ (ГЕНЧ)', val: `${h.gench || 0} с`, max: 50, cur: h.gench || 0, color: '#10b981' }
  ];

  let curY = topY;
  rows.forEach(r => {
    ctx.textAlign = 'left';
    ctx.font = '700 26px Manrope, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(r.title, left, curY + 24);

    ctx.textAlign = 'right';
    ctx.font = '900 28px Manrope, sans-serif';
    ctx.fillStyle = r.color;
    ctx.fillText(r.val, left + width, curY + 24);

    drawRoundedRect(ctx, left, curY + 34, width, barH, 8);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fill();

    const fillW = Math.min(width, Math.max(20, (r.cur / r.max) * width));
    drawRoundedRect(ctx, left, curY + 34, fillW, barH, 8);
    ctx.fillStyle = r.color;
    ctx.fill();

    curY += 76;
  });
}

function drawCanvasKvas(ctx, centerX, topY, width, hemo) {
  const left = centerX - width / 2;
  const itemW = (width - 16) / 2;
  const itemH = 115;

  const items = [
    { title: 'ПУЛЬСОВОЕ ДАВЛЕНИЕ', val: `${hemo.pp || '—'}`, color: '#38bdf8' },
    { title: 'ЭКОНОМИЧНОСТЬ СЕРДЦА', val: `${hemo.economy || 'В норме'}`, color: '#10b981' }
  ];

  items.forEach((it, idx) => {
    const x = left + idx * (itemW + 16);
    drawRoundedRect(ctx, x, topY, itemW, itemH, 20);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fill();
    ctx.strokeStyle = hexToRgba(it.color, 0.35);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = '700 20px Manrope, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(it.title, x + itemW / 2, topY + 40);

    ctx.font = '800 32px Manrope, sans-serif';
    ctx.fillStyle = it.color;
    ctx.fillText(it.val, x + itemW / 2, topY + 88);
  });
}

function wrapCanvasText(ctx, text, maxWidth) {
  if (!text) return [];
  const words = String(text).split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function hexToRgba(hex, alpha) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

async function sendStoryToBotChat() {
  if (storyState.isBusy) return;
  const canvas = document.getElementById('story-canvas');
  const btn = document.getElementById('story-btn-bot');
  if (!canvas || !btn) return;

  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  if (!userId) {
    alert(`Отправка доступна при запуске приложения внутри Telegram через бота @${BOT_USERNAME}`);
    return;
  }

  storyState.isBusy = true;
  const origText = btn.innerHTML;
  btn.innerHTML = '⏳ Отправка в Telegram...';

  try {
    const dataUrl = canvas.toDataURL('image/png');
    const res = await fetch('/api/send-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: dataUrl,
        userId: userId,
        caption: `📊 Результат теста: *${storyState.title}*\nЗначение: *${storyState.value}*\nСтатус: *${storyState.status}*\n\nХотите проверить свои показатели? Откройте мини-приложение или нажмите /start`
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка отправки');

    alert(`✅ Карточка успешно отправлена вам в чат бота @${BOT_USERNAME}!`);
  } catch (err) {
    console.error('Send bot photo error:', err);
    alert(err.message);
  } finally {
    storyState.isBusy = false;
    btn.innerHTML = origText;
  }
}

function closeStoryModal() {
  const modal = document.getElementById('story-modal');
  if (modal) modal.classList.remove('active');
}
