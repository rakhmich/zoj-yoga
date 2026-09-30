/**
 * ЕДИНЫЙ КЛИЕНТСКИЙ МОДУЛЬ STORIES С АНИМАЦИЕЙ (8 СЕКУНД)
 * Файл: src/modules/story-generator.js
 */

const BOT_USERNAME = 'zoj_tl_bot';
const BOT_START_LINK = `https://t.me/${BOT_USERNAME}?start=start`;

let storyState = {
  title: 'РЕЗУЛЬТАТ ТЕСТА',
  value: '0',
  unit: '',
  status: 'Норма',
  subtitle: '',
  type: 'generic',
  extra: {},
  params: {},
  neonColor: '#38bdf8',
  showParams: false,
  format: 'animated', // 'static' | 'animated'
  isBusy: false
};

// Тайминги: 2.6 сек на раскрытие + 5.4 сек на фиксацию (итого 8 секунд)
const REVEAL_DURATION = 2600;
const TOTAL_VIDEO_DURATION = 8000;

let animStartTime = 0;
let animFrameId = null;

/**
 * Главная точка входа
 */
function openStoryModal(arg1, arg2, arg3, arg4, arg5) {
  if (typeof arg1 === 'object' && arg1 !== null) {
    storyState.title = arg1.title || 'РЕЗУЛЬТАТ ТЕСТА';
    storyState.value = String(arg1.value || arg1.val || '0');
    storyState.unit = arg1.unit || '';
    storyState.status = arg1.status || 'Норма';
    storyState.subtitle = arg1.subtitle || '';
    storyState.type = arg1.type || detectTestType(storyState.title);
    storyState.extra = arg1.extra || arg1;
    storyState.params = arg1.params || {};
    if (arg1.color) storyState.neonColor = arg1.color;
  } else {
    storyState.title = arg1 || 'РЕЗУЛЬТАТ ТЕСТА';
    storyState.value = String(arg2 || '0');
    storyState.status = arg3 || 'Норма';
    storyState.params = arg4 || {};
    storyState.unit = '';
    if (typeof arg5 === 'object' && arg5 !== null) {
      storyState.subtitle = arg5.subtitle || '';
      storyState.type = arg5.type || detectTestType(storyState.title);
      storyState.extra = arg5;
    } else if (typeof arg5 === 'string') {
      storyState.subtitle = arg5;
      storyState.type = detectTestType(storyState.title);
      storyState.extra = {};
    }
  }

  storyState.showParams = storyState.params && Object.keys(storyState.params).length > 0;
  storyState.isBusy = false;

  ensureStoryModalExists();
  setupStoryControls();
  applyStoryFormat(storyState.format);

  const modal = document.getElementById('story-modal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
}

function detectTestType(title) {
  const t = String(title).toLowerCase();
  if (t.includes('массы') || t.includes('имт') || t.includes('кетле')) return 'bmi';
  if (t.includes('метаболизм') || t.includes('bmr') || t.includes('tdee') || t.includes('калорий')) return 'bmr';
  if (t.includes('пульс') || t.includes('карвонен')) return 'pulse';
  if (t.includes('кердо')) return 'kerdo';
  if (t.includes('вод')) return 'water';
  if (t.includes('штанге') || t.includes('генч')) return 'stange';
  if (t.includes('руфье')) return 'rufier';
  if (t.includes('ромберг')) return 'romberg';
  if (t.includes('квас')) return 'kvas';
  if (t.includes('сон') || t.includes('сна')) return 'sleep';
  return 'generic';
}

function ensureStoryModalExists() {
  let modal = document.getElementById('story-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'story-modal';
    modal.className = 'story-modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="story-modal-overlay" onclick="closeStoryModal()" style="position:fixed; inset:0; background:rgba(2,6,23,0.85); backdrop-filter:blur(10px); z-index:99990;"></div>
    
    <div class="story-modal-box" id="story-box" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:94vw; max-width:420px; height:94vh; max-height:860px; background:#0b1120; border:1px solid rgba(255,255,255,0.12); border-radius:24px; box-shadow:0 24px 50px rgba(0,0,0,0.85); display:flex; flex-direction:column; padding:12px 14px; box-sizing:border-box; z-index:99999; overflow:hidden;">
      
      <!-- 1. Компактный заголовок -->
      <div style="display:flex; justify-content:space-between; align-items:center; height:28px; margin-bottom:8px;">
        <span style="font-weight:800; font-size:14.5px; color:#f8fafc; letter-spacing:0.3px;">Публикация в Stories</span>
        <button type="button" onclick="closeStoryModal()" style="background:none; border:none; font-size:20px; color:#94a3b8; cursor:pointer; padding:0 4px; line-height:1;">✕</button>
      </div>

      <!-- 2. Компактный бар настроек (высота всего ~64px) -->
      <div class="story-controls" style="display:flex; flex-direction:column; gap:6px; margin-bottom:6px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); padding:8px 10px; border-radius:14px;"></div>

      <!-- 3. Область превью: занимает 100% оставшейся высоты без скролла -->
      <div class="story-preview-container" style="flex:1; min-height:0; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;">
        <canvas id="story-canvas" width="1080" height="1920" style="max-height:100%; max-width:100%; aspect-ratio:9/16; object-fit:contain; border-radius:14px; box-shadow:0 8px 30px rgba(0,0,0,0.65); display:block;"></canvas>
        <img id="story-preview-img" alt="Предпросмотр" style="max-height:100%; max-width:100%; aspect-ratio:9/16; object-fit:contain; border-radius:14px; box-shadow:0 8px 30px rgba(0,0,0,0.65); display:none;">
        
        <button type="button" id="story-replay-btn" onclick="restartAnimation()" style="display:none; position:absolute; bottom:10px; right:12px; background:rgba(15,23,42,0.85); border:1px solid rgba(255,255,255,0.25); color:#fff; border-radius:999px; padding:5px 12px; font-size:11.5px; font-weight:700; cursor:pointer; backdrop-filter:blur(8px);">
          ↺ Повтор
        </button>
      </div>

      <!-- 4. Нижний блок действий в одну строчку -->
      <div style="display:flex; flex-direction:column; gap:6px; margin-top:8px;">
        <div style="display:flex; gap:8px;">
          <button type="button" id="story-btn-bot" onclick="sendStoryToBotChat()" style="flex:1.2; height:42px; background:#0284c7; color:#fff; border:none; border-radius:12px; font-weight:800; font-size:13.5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 4px 14px rgba(2,132,199,0.35);">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span id="story-btn-bot-text">В Telegram</span>
          </button>

          <button type="button" id="story-btn-download" onclick="downloadStoryMedia()" style="flex:1; height:42px; background:rgba(255,255,255,0.08); color:#f8fafc; border:1px solid rgba(255,255,255,0.18); border-radius:12px; font-weight:700; font-size:12.5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:5px;">
            <span id="story-btn-download-text">💾 Скачать</span>
          </button>
        </div>

        <div style="font-size:10.5px; color:#64748b; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
          *Для отправки в чат запустите бота <a href="${BOT_START_LINK}" target="_blank" style="color:#38bdf8; text-decoration:underline;">@${BOT_USERNAME}</a>
        </div>
      </div>
    </div>
  `;
}

function setupStoryControls() {
  const box = document.querySelector('.story-controls');
  if (!box) return;

  const hasParams = storyState.params && Object.keys(storyState.params).length > 0;

  box.innerHTML = `
    <!-- Строка 1: Формат и тумблер телеметрии -->
    <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
      <div style="display:flex; background:rgba(15,23,42,0.8); padding:2px; border-radius:999px; border:1px solid rgba(255,255,255,0.1);">
        <button type="button" onclick="setStoryFormat('static')" style="padding:4px 12px; border-radius:999px; font-size:12px; font-weight:700; cursor:pointer; border:none; background:${storyState.format === 'static' ? storyState.neonColor : 'transparent'}; color:${storyState.format === 'static' ? '#040711' : '#94a3b8'};">
          📷 Фото
        </button>
        <button type="button" onclick="setStoryFormat('animated')" style="padding:4px 12px; border-radius:999px; font-size:12px; font-weight:700; cursor:pointer; border:none; background:${storyState.format === 'animated' ? storyState.neonColor : 'transparent'}; color:${storyState.format === 'animated' ? '#040711' : '#94a3b8'};">
          🎬 Видео 8с
        </button>
      </div>

      ${hasParams ? `
        <button type="button" onclick="toggleStoryParams(!storyState.showParams)" style="display:flex; align-items:center; gap:5px; background:${storyState.showParams ? hexToRgba(storyState.neonColor, 0.16) : 'rgba(255,255,255,0.06)'}; border:1px solid ${storyState.showParams ? storyState.neonColor : 'rgba(255,255,255,0.15)'}; color:${storyState.showParams ? '#fff' : '#94a3b8'}; padding:4px 10px; border-radius:999px; font-size:11.5px; font-weight:700; cursor:pointer;">
          <span>📊 Данные</span>
          <span style="font-size:10px; opacity:0.8;">${storyState.showParams ? '✓' : ''}</span>
        </button>
      ` : '<div></div>'}
    </div>

    <!-- Строка 2: Цветовые акценты -->
    <div style="display:flex; justify-content:space-between; align-items:center; padding-top:2px;">
      <span style="font-size:11.5px; color:#94a3b8; font-weight:600;">Неон:</span>
      <div style="display:flex; gap:10px;">
        ${['#38bdf8', '#c084fc', '#10b981', '#f59e0b', '#f43f5e'].map(col => `
          <button type="button" onclick="setStoryNeon('${col}')" style="width:20px; height:20px; border-radius:50%; background:${col}; border:${storyState.neonColor === col ? '2px solid #fff' : '2px solid transparent'}; box-shadow:${storyState.neonColor === col ? '0 0 10px ' + col : 'none'}; cursor:pointer; padding:0;"></button>
        `).join('')}
      </div>
    </div>
  `;
}

function setStoryFormat(fmt) {
  storyState.format = fmt;
  setupStoryControls();
  applyStoryFormat(fmt);
}

function applyStoryFormat(fmt) {
  const canvas = document.getElementById('story-canvas');
  const previewImg = document.getElementById('story-preview-img');
  const replayBtn = document.getElementById('story-replay-btn');
  const btnDownloadText = document.getElementById('story-btn-download-text');
  const btnBotText = document.getElementById('story-btn-bot-text');

  stopAnimation();

  if (fmt === 'animated') {
    if (canvas) canvas.style.display = 'block';
    if (previewImg) previewImg.style.display = 'none';
    if (replayBtn) replayBtn.style.display = 'block';
    if (btnDownloadText) btnDownloadText.textContent = '💾 Скачать MP4';
    if (btnBotText) btnBotText.textContent = 'Видео в Telegram';
    startAnimation();
  } else {
    if (canvas) canvas.style.display = 'none';
    if (previewImg) previewImg.style.display = 'block';
    if (replayBtn) replayBtn.style.display = 'none';
    if (btnDownloadText) btnDownloadText.textContent = '💾 Скачать PNG';
    if (btnBotText) btnBotText.textContent = 'Фото в Telegram';
    renderSingleStaticFrame();
  }
}

function setStoryNeon(color) {
  storyState.neonColor = color;
  setupStoryControls();
  if (storyState.format === 'animated') {
    restartAnimation();
  } else {
    renderSingleStaticFrame();
  }
}

function toggleStoryParams(checked) {
  storyState.showParams = checked;
  setupStoryControls();
  if (storyState.format === 'animated') {
    restartAnimation();
  } else {
    renderSingleStaticFrame();
  }
}

function closeStoryModal() {
  stopAnimation();
  const modal = document.getElementById('story-modal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }
}

// -------------------------------------------------------
// АНИМАЦИОННЫЙ ЦИКЛ (8 СЕКУНД)
// -------------------------------------------------------
function startAnimation() {
  animStartTime = performance.now();
  function tick(now) {
    const elapsed = now - animStartTime;
    // Нарастание длится 2.6 сек, затем значение фиксируется на 100%
    const revealProgress = Math.min(1.0, elapsed / REVEAL_DURATION);

    drawStoryFrame(revealProgress, elapsed);

    // Продолжаем бесконечный живой пульс ЭКГ и неона для предпросмотра
    animFrameId = requestAnimationFrame(tick);
  }
  animFrameId = requestAnimationFrame(tick);
}

function stopAnimation() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
}

function restartAnimation() {
  stopAnimation();
  startAnimation();
}

function renderSingleStaticFrame() {
  drawStoryFrame(1.0, 0);
  const canvas = document.getElementById('story-canvas');
  const previewImg = document.getElementById('story-preview-img');
  if (canvas && previewImg) {
    previewImg.src = canvas.toDataURL('image/png');
  }
}

// -------------------------------------------------------
// ГРАФИЧЕСКИЙ РЕНДЕР КАДРА
// -------------------------------------------------------
function drawStoryFrame(progress, elapsedMs) {
  const canvas = document.getElementById('story-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const w = 1080, h = 1920;
  const neon = storyState.neonColor;
  const isAnimated = (storyState.format === 'animated');

  // Кривые плавности появления
  const pCard = easeOutCubic(clamp((progress - 0.0) / 0.22, 0, 1));
  const pHeader = easeOutCubic(clamp((progress - 0.12) / 0.25, 0, 1));
  const pValue = easeOutCubic(clamp((progress - 0.22) / 0.45, 0, 1));
  const pBadge = easeOutBack(clamp((progress - 0.45) / 0.3, 0, 1));
  const pWidget = easeOutCubic(clamp((progress - 0.55) / 0.35, 0, 1));
  const pSub = easeOutCubic(clamp((progress - 0.65) / 0.25, 0, 1));
  const pHud = easeOutCubic(clamp((progress - 0.72) / 0.28, 0, 1));

  // 1. Фон
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#060913');
  bgGrad.addColorStop(0.5, '#0b1329');
  bgGrad.addColorStop(1, '#04060d');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Дыхание неоновой ауры
  const pulseFactor = isAnimated ? (1 + 0.14 * Math.sin(elapsedMs * 0.0035)) : 1;
  const radialGlow = ctx.createRadialGradient(w / 2, 850, 70, w / 2, 850, 700 * pulseFactor);
  radialGlow.addColorStop(0, hexToRgba(neon, 0.26));
  radialGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, w, h);

  // 3. Главная стеклянная карточка
  const cardX = 70, cardY = 105, cardW = 940, cardH = 1710, cardR = 52;
  ctx.save();
  if (isAnimated) ctx.globalAlpha = pCard;
  
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.fillStyle = 'rgba(11, 17, 32, 0.94)';
  ctx.fill();

  ctx.lineWidth = 5;
  ctx.strokeStyle = neon;
  ctx.shadowColor = neon;
  ctx.shadowBlur = 28 * pulseFactor;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();

  // 4. Шапка и анимированный логотип
  ctx.save();
  if (isAnimated) ctx.globalAlpha = pHeader;

  ctx.textAlign = 'left';
  ctx.font = '800 34px Manrope, sans-serif';
  ctx.fillStyle = neon;
  ctx.fillText('ФИЗКУЛЬТУРА, ЗОЖ И СПОРТ', cardX + 55, cardY + 90);

  ctx.textAlign = 'right';
  ctx.font = '700 32px Manrope, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Татьяна Львова', cardX + cardW - 55, cardY + 90);

  // Живая кардиограмма
  drawEcgPulse(ctx, w / 2, cardY + 155, 480, neon, elapsedMs, isAnimated);

  // Футер
  ctx.textAlign = 'center';
  ctx.font = '700 32px Manrope, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Мини-приложение для здоровья и фитнеса', w / 2, cardY + cardH - 95);

  ctx.font = '800 36px Manrope, sans-serif';
  ctx.fillStyle = neon;
  ctx.fillText(`Проверь свои показатели ↗ @${BOT_USERNAME}`, w / 2, cardY + cardH - 50);
  ctx.restore();

  // 5. Расчет вертикального размещения
  const topBoundary = cardY + 180;
  const bottomBoundary = cardY + cardH - 140;
  const availableH = bottomBoundary - topBoundary;

  ctx.font = '800 52px Manrope, sans-serif';
  const titleLines = wrapCanvasText(ctx, storyState.title.toUpperCase(), 800);
  const titleH = titleLines.length * 62;
  const valueH = storyState.unit ? 160 : 135;
  const badgeH = 76;

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

  let subH = 0;
  let subLines = [];
  if (storyState.subtitle) {
    ctx.font = '600 42px Manrope, sans-serif';
    subLines = wrapCanvasText(ctx, storyState.subtitle, 820);
    subH = subLines.length * 52;
  }

  let paramsBoxH = 0;
  let computedParamRows = [];
  const showParamsActive = storyState.showParams && storyState.params && Object.keys(storyState.params).length > 0;

  if (showParamsActive) {
    Object.entries(storyState.params).forEach(([k, v]) => {
      ctx.font = '600 34px Manrope, sans-serif';
      const kLines = wrapCanvasText(ctx, k, 430);
      ctx.font = '800 36px Manrope, sans-serif';
      const vLines = wrapCanvasText(ctx, String(v), 370);
      const maxLines = Math.max(kLines.length, vLines.length);
      const rowH = maxLines * 42 + 24;
      computedParamRows.push({ kLines, vLines, rowH });
      paramsBoxH += rowH;
    });
    paramsBoxH += 24;
  }

  const activeBlockHeights = [titleH, valueH, badgeH];
  if (widgetH > 0) activeBlockHeights.push(widgetH);
  if (subH > 0) activeBlockHeights.push(subH);
  if (showParamsActive && paramsBoxH > 0) activeBlockHeights.push(paramsBoxH);

  const totalBlocksHeight = activeBlockHeights.reduce((sum, bh) => sum + bh, 0);
  const numGaps = activeBlockHeights.length - 1;
  const freeSpace = availableH - totalBlocksHeight;

  let gap = Math.min(38, Math.max(12, Math.floor(freeSpace / (numGaps + 2))));
  if (totalBlocksHeight + numGaps * gap > availableH) {
    gap = Math.max(6, Math.floor((availableH - totalBlocksHeight) / numGaps));
  }

  const totalContentH = totalBlocksHeight + numGaps * gap;
  let curY = topBoundary + Math.max(0, (availableH - totalContentH) / 2);

  // Заголовок
  ctx.save();
  if (isAnimated) ctx.globalAlpha = pHeader;
  ctx.textAlign = 'center';
  ctx.font = '800 52px Manrope, sans-serif';
  ctx.fillStyle = '#ffffff';
  titleLines.forEach(line => {
    ctx.fillText(line, w / 2, curY + 46);
    curY += 62;
  });
  ctx.restore();
  curY += gap;

  // Анимированное значение
  ctx.save();
  if (isAnimated) ctx.globalAlpha = pValue;
  const displayVal = isAnimated ? getCountUpValue(storyState.value, pValue) : storyState.value;
  ctx.textAlign = 'center';
  ctx.font = '900 135px Manrope, sans-serif';
  ctx.fillStyle = neon;
  ctx.shadowColor = neon;
  ctx.shadowBlur = 36 * pulseFactor;
  ctx.fillText(displayVal, w / 2, curY + 115);
  ctx.shadowBlur = 0;

  if (storyState.unit) {
    ctx.font = '700 32px Manrope, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(storyState.unit, w / 2, curY + 155);
  }
  ctx.restore();
  curY += valueH + gap;

  // Статус-бейдж
  ctx.save();
  if (isAnimated) ctx.globalAlpha = clamp(pBadge, 0, 1);
  const statusText = storyState.status.toUpperCase();
  ctx.font = '800 34px Manrope, sans-serif';
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
  ctx.fillText(statusText, w / 2, curY + 49);
  ctx.restore();
  curY += badgeH + (widgetH > 0 ? gap : 0);

  // Виджет
  if (widgetH > 0) {
    ctx.save();
    if (isAnimated) ctx.globalAlpha = pWidget;

    if (storyState.type === 'bmi' || storyState.type === 'fat') {
      const bVal = parseFloat(storyState.extra.bmiVal || storyState.value) || 21;
      drawCanvasScale(ctx, w / 2, curY, 820, bVal, pWidget);
    } else if (storyState.type === 'bmr' && storyState.extra.bju) {
      drawCanvasBju(ctx, w / 2, curY, 820, storyState.extra.bju, pWidget);
    } else if (storyState.type === 'water') {
      drawCanvasWater(ctx, w / 2, curY, 820, storyState.extra, pWidget);
    } else if (storyState.type === 'pulse' && storyState.extra.zones) {
      drawCanvasPulseZones(ctx, w / 2, curY, 820, storyState.extra.zones, neon, pWidget);
    } else if (storyState.type === 'rufier') {
      const pulses = storyState.extra.pulses || { p1: 18, p2: 30, p3: 20 };
      drawCanvasRufier(ctx, w / 2, curY, 820, pulses, pWidget);
    } else if (storyState.type === 'kerdo') {
      const kVal = parseFloat(storyState.value) || 0;
      drawCanvasKerdoScale(ctx, w / 2, curY, 820, kVal, pWidget);
    } else if (storyState.type === 'stange' && storyState.extra.hypoxia) {
      drawCanvasStangeBars(ctx, w / 2, curY, 820, storyState.extra.hypoxia, pWidget);
    } else if (storyState.type === 'kvas') {
      const hemo = storyState.extra.hemo || { pp: '40', economy: 'В норме' };
      drawCanvasKvas(ctx, w / 2, curY, 820, hemo, pWidget);
    } else if (storyState.type === 'romberg') {
      const rSec = parseFloat(storyState.value) || 30;
      drawCanvasRombergScale(ctx, w / 2, curY, 820, rSec, pWidget);
    } else if (storyState.type === 'sleep' && storyState.extra.cycles) {
      drawCanvasSleep(ctx, w / 2, curY, 830, storyState.extra.cycles, neon, pWidget);
    }
    ctx.restore();
    curY += widgetH + (subH > 0 || (showParamsActive && paramsBoxH > 0) ? gap : 0);
  }

  // Подзаголовок
  if (subH > 0) {
    ctx.save();
    if (isAnimated) ctx.globalAlpha = pSub;
    ctx.textAlign = 'center';
    ctx.font = '600 42px Manrope, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    subLines.forEach(line => {
      ctx.fillText(line, w / 2, curY + 38);
      curY += 52;
    });
    ctx.restore();
    if (showParamsActive && paramsBoxH > 0) curY += gap;
  }

  // Телеметрия HUD
  if (showParamsActive && paramsBoxH > 0) {
    ctx.save();
    if (isAnimated) ctx.globalAlpha = pHud;
    const boxW = 840;
    const boxLeft = (w - boxW) / 2;

    drawRoundedRect(ctx, boxLeft, curY, boxW, paramsBoxH, 24);
    ctx.fillStyle = 'rgba(8, 14, 28, 0.85)';
    ctx.fill();

    ctx.strokeStyle = hexToRgba(neon, 0.38);
    ctx.lineWidth = 2.5;
    ctx.stroke();

    let rowY = curY + 14;
    computedParamRows.forEach((row, idx) => {
      ctx.textAlign = 'left';
      ctx.font = '600 34px Manrope, sans-serif';
      ctx.fillStyle = '#94a3b8';
      row.kLines.forEach((kl, lIdx) => {
        ctx.fillText(kl, boxLeft + 36, rowY + 32 + lIdx * 38);
      });

      ctx.textAlign = 'right';
      ctx.font = '800 36px Manrope, sans-serif';
      ctx.fillStyle = neon;
      row.vLines.forEach((vl, lIdx) => {
        ctx.fillText(vl, boxLeft + boxW - 36, rowY + 32 + lIdx * 38);
      });

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
    ctx.restore();
  }
}

// -------------------------------------------------------
// АНИМАЦИЯ ЭКГ
// -------------------------------------------------------
function drawEcgPulse(ctx, centerX, y, width, neon, elapsedMs = 0, isAnimated = false) {
  ctx.save();
  const left = centerX - width / 2;

  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.moveTo(left, y);
  ctx.lineTo(left + width * 0.36, y);
  ctx.lineTo(left + width * 0.43, y - 4);
  ctx.lineTo(left + width * 0.49, y - 36);
  ctx.lineTo(left + width * 0.55, y + 32);
  ctx.lineTo(left + width * 0.61, y - 16);
  ctx.lineTo(left + width * 0.67, y);
  ctx.lineTo(left + width, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = neon;
  ctx.shadowColor = neon;
  ctx.shadowBlur = isAnimated ? 20 : 12;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.moveTo(left, y);
  ctx.lineTo(left + width * 0.36, y);
  ctx.lineTo(left + width * 0.43, y - 4);
  ctx.lineTo(left + width * 0.49, y - 36);
  ctx.lineTo(left + width * 0.55, y + 32);
  ctx.lineTo(left + width * 0.61, y - 16);
  ctx.lineTo(left + width * 0.67, y);
  ctx.lineTo(left + width, y);
  ctx.stroke();

  if (isAnimated) {
    const sweepProgress = (elapsedMs % 1500) / 1500;
    const dotX = left + sweepProgress * width;

    let dotY = y;
    const rel = sweepProgress;
    if (rel >= 0.36 && rel < 0.43) dotY = y + ((rel - 0.36) / 0.07) * (-4);
    else if (rel >= 0.43 && rel < 0.49) dotY = y - 4 + ((rel - 0.43) / 0.06) * (-32);
    else if (rel >= 0.49 && rel < 0.55) dotY = y - 36 + ((rel - 0.49) / 0.06) * (68);
    else if (rel >= 0.55 && rel < 0.61) dotY = y + 32 + ((rel - 0.55) / 0.06) * (-48);
    else if (rel >= 0.61 && rel < 0.67) dotY = y - 16 + ((rel - 0.61) / 0.06) * (16);

    ctx.beginPath();
    ctx.arc(dotX, dotY, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 18;
    ctx.fill();
  }
  ctx.restore();
}

function getCountUpValue(targetStr, progress) {
  if (progress >= 1.0) return targetStr;

  if (targetStr.includes('–')) {
    const parts = targetStr.split('–').map(s => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const v1 = Math.round(parts[0] * progress);
      const v2 = Math.round(parts[1] * progress);
      return `${v1} – ${v2}`;
    }
  }

  const prefix = targetStr.startsWith('+') ? '+' : (targetStr.startsWith('-') ? '-' : '');
  const cleanNum = parseFloat(targetStr.replace(/[^\d.]/g, ''));
  if (isNaN(cleanNum)) return targetStr;

  const isDecimal = targetStr.includes('.');
  const currentVal = cleanNum * progress;
  const formatted = isDecimal ? currentVal.toFixed(1) : Math.round(currentVal);
  const suffix = targetStr.endsWith('%') ? '%' : '';

  return `${prefix}${formatted}${suffix}`;
}

// -------------------------------------------------------
// ВИДЖЕТЫ
// -------------------------------------------------------
function drawCanvasScale(ctx, centerX, topY, width, bmiVal, progress = 1.0) {
  const left = centerX - width / 2;
  const barH = 22;
  const pinY = topY + 4;
  const barY = topY + 30;

  const segW = (width - 12) / 4;
  const colors = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444'];

  let targetPct = 0.5;
  if (bmiVal < 18.5) targetPct = 0.04 + Math.max(0, Math.min((bmiVal - 14) / 4.5, 1)) * 0.20;
  else if (bmiVal <= 24.9) targetPct = 0.27 + Math.max(0, Math.min((bmiVal - 18.5) / 6.4, 1)) * 0.22;
  else if (bmiVal <= 29.9) targetPct = 0.52 + Math.max(0, Math.min((bmiVal - 25.0) / 4.9, 1)) * 0.22;
  else targetPct = 0.77 + Math.max(0, Math.min((bmiVal - 30.0) / 10.0, 1)) * 0.19;

  const pinX = left + targetPct * progress * width;

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

  ctx.font = '700 28px Manrope, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.fillText('< 18.5', left + segW / 2, barY + 54);
  ctx.fillText('18.5 – 24.9', left + segW + 4 + segW / 2, barY + 54);
  ctx.fillText('25.0 – 29.9', left + 2 * (segW + 4) + segW / 2, barY + 54);
  ctx.fillText('≥ 30.0', left + 3 * (segW + 4) + segW / 2, barY + 54);
}

function drawCanvasBju(ctx, centerX, topY, width, bju, progress = 1.0) {
  const left = centerX - width / 2;
  const itemW = (width - 24) / 3;
  const itemH = 120;

  const items = [
    { title: 'БЕЛКИ (2 г/кг)', val: `${Math.round((parseFloat(bju.prot) || 0) * progress)} г`, color: '#38bdf8' },
    { title: 'ЖИРЫ (1 г/кг)', val: `${Math.round((parseFloat(bju.fat) || 0) * progress)} г`, color: '#f59e0b' },
    { title: 'УГЛЕВОДЫ', val: `${Math.round((parseFloat(bju.carb) || 0) * progress)} г`, color: '#10b981' }
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

function drawCanvasPulseZones(ctx, centerX, topY, width, zones, neon, progress = 1.0) {
  const left = centerX - width / 2;
  let curY = topY;

  zones.slice(0, 3).forEach((z, idx) => {
    const rowProgress = clamp((progress - idx * 0.15) / 0.7, 0, 1);
    const h = 86;
    const wAnim = width * easeOutCubic(rowProgress);

    drawRoundedRect(ctx, left, curY, wAnim, h, 18);
    ctx.fillStyle = z.isTarget ? hexToRgba(neon, 0.16) : 'rgba(15, 23, 42, 0.6)';
    ctx.fill();
    ctx.strokeStyle = z.isTarget ? neon : 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = z.isTarget ? 3 : 1.5;
    ctx.stroke();

    if (rowProgress > 0.4) {
      ctx.textAlign = 'left';
      ctx.font = z.isTarget ? '800 28px Manrope, sans-serif' : '600 26px Manrope, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(z.name, left + 26, curY + 54);

      ctx.textAlign = 'right';
      ctx.font = '800 32px Manrope, sans-serif';
      ctx.fillStyle = z.isTarget ? neon : '#94a3b8';
      ctx.fillText(z.range, left + width - 26, curY + 54);
    }
    curY += h + 10;
  });
}

function drawCanvasKerdoScale(ctx, centerX, topY, width, val, progress = 1.0) {
  const left = centerX - width / 2;
  const barH = 22;
  const barY = topY + 30;

  const clampVal = Math.max(-50, Math.min(val, 50));
  const targetPct = (clampVal + 50) / 100;
  const currentPct = 0.5 + (targetPct - 0.5) * progress;
  const pinX = left + currentPct * width;

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
  ctx.fillStyle = '#38bdf8';
  ctx.fill();

  drawRoundedRect(ctx, left + wSide + 4, barY, wCenter, barH, 8);
  ctx.fillStyle = '#10b981';
  ctx.fill();

  drawRoundedRect(ctx, left + wSide + 4 + wCenter + 4, barY, wSide, barH, 8);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();

  ctx.font = '700 28px Manrope, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'left';
  ctx.fillText('← Ваготония', left, barY + 52);
  ctx.textAlign = 'right';
  ctx.fillText('Симпатикотония →', left + width, barY + 52);
}

function drawCanvasWater(ctx, centerX, topY, width, data, progress = 1.0) {
  const left = centerX - width / 2;
  const itemW = (width - 16) / 2;
  const itemH = 115;
  const litNum = (parseFloat(data.liters) || 2.0) * progress;

  const items = [
    { title: 'ОБЪЕМ В ЛИТРАХ', val: `${litNum.toFixed(1)} л` },
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

function drawCanvasRufier(ctx, centerX, topY, width, p, progress = 1.0) {
  const left = centerX - width / 2;
  const itemW = (width - 24) / 3;
  const itemH = 115;
  const steps = [
    { label: 'P1: ПОКОЙ', val: `${Math.round((p.p1 || 0) * progress)} уд`, color: '#38bdf8' },
    { label: 'P2: НАГРУЗКА', val: `${Math.round((p.p2 || 0) * progress)} уд`, color: '#f43f5e' },
    { label: 'P3: 1 МИН', val: `${Math.round((p.p3 || 0) * progress)} уд`, color: '#10b981' }
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

function drawCanvasRombergScale(ctx, centerX, topY, width, timeSec, progress = 1.0) {
  const left = centerX - width / 2;
  const barH = 22;
  const pinY = topY + 4;
  const barY = topY + 30;

  const targetPct = Math.max(0, Math.min(timeSec / 60, 1));
  const pinX = left + targetPct * progress * width;

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

  ctx.font = '700 30px Manrope, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'center';
  ctx.fillText('< 15 с', left + segW / 2, barY + 54);
  ctx.fillText('15–30 с', left + segW + segW / 2, barY + 54);
  ctx.fillText('30–45 с', left + 2 * segW + segW / 2, barY + 54);
  ctx.fillText('> 45 с', left + 3 * segW + segW / 2, barY + 54);
}

function drawCanvasSleep(ctx, centerX, topY, width, cycles, neon, progress = 1.0) {
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

function drawCanvasStangeBars(ctx, centerX, topY, width, h, progress = 1.0) {
  const left = centerX - width / 2;
  const barH = 22;
  const rows = [
    { title: 'ВДОХ (ШТАНГЕ)', val: `${Math.round((h.stange || 0) * progress)} с`, max: 80, cur: (h.stange || 0) * progress, color: '#38bdf8' },
    { title: 'ВЫДОХ (ГЕНЧ)', val: `${Math.round((h.gench || 0) * progress)} с`, max: 50, cur: (h.gench || 0) * progress, color: '#10b981' }
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

function drawCanvasKvas(ctx, centerX, topY, width, hemo, progress = 1.0) {
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

// -------------------------------------------------------
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// -------------------------------------------------------
function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
function clamp(val, min, max) { return Math.min(max, Math.max(min, val)); }

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
  const c = String(hex || '#38bdf8').replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// -------------------------------------------------------
// ЗАПИСЬ ВИДЕО (8 СЕКУНД) И СКАЧИВАНИЕ
// -------------------------------------------------------
async function downloadStoryMedia() {
  if (storyState.format === 'animated') {
    await recordAndSaveVideo();
  } else {
    downloadStaticPng();
  }
}

function downloadStaticPng() {
  const canvas = document.getElementById('story-canvas');
  if (!canvas) return;

  const link = document.createElement('a');
  link.download = `fizra-${storyState.type || 'result'}-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function recordAndSaveVideo() {
  const canvas = document.getElementById('story-canvas');
  const btn = document.getElementById('story-btn-download-text');
  if (!canvas || !window.MediaRecorder) {
    downloadStaticPng();
    return;
  }

  const origText = btn ? btn.textContent : '';
  if (btn) btn.textContent = '⏳ Рендеринг 8с...';

  try {
    const videoBlob = await captureCanvasVideo(canvas, TOTAL_VIDEO_DURATION);
    const url = URL.createObjectURL(videoBlob);
    const link = document.createElement('a');
    link.download = `fizra-${storyState.type || 'story'}-${Date.now()}.mp4`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (e) {
    console.warn('[StoryVideo] Ошибка захвата, скачиваем PNG:', e);
    downloadStaticPng();
  } finally {
    if (btn) btn.textContent = origText;
  }
}

function captureCanvasVideo(canvas, durationMs) {
  return new Promise((resolve) => {
    const stream = canvas.captureStream(30);
    let mimeType = 'video/mp4';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
    }

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4500000 });
    const chunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: mimeType }));
    };

    restartAnimation();
    recorder.start();

    setTimeout(() => {
      if (recorder.state === 'recording') {
        recorder.stop();
      }
    }, durationMs);
  });
}

async function sendStoryToBotChat() {
  if (storyState.isBusy) return;
  const canvas = document.getElementById('story-canvas');
  const btnText = document.getElementById('story-btn-bot-text');
  if (!canvas) return;

  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  if (!userId) {
    downloadStoryMedia();
    alert('Файл сохранен на ваше устройство!');
    return;
  }

  storyState.isBusy = true;
  const origText = btnText ? btnText.textContent : '';
  if (btnText) btnText.textContent = '⏳ Отправка...';

  try {
    const dataUrl = canvas.toDataURL('image/png');
    const res = await fetch('/api/send-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: dataUrl,
        photo: dataUrl,
        userId: userId,
        chatId: userId,
        caption: `📊 Результат теста: *${storyState.title}*\nЗначение: *${storyState.value}* ${storyState.unit}\nСтатус: *${storyState.status}*`
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка отправки');
    alert(`✅ Карточка отправлена в чат бота @${BOT_USERNAME}!`);
  } catch (err) {
    console.warn('Bot send error, fallback download:', err);
    downloadStoryMedia();
    alert('Файл сохранен на ваше устройство.');
  } finally {
    storyState.isBusy = false;
    if (btnText) btnText.textContent = origText;
  }
}

// Экспорт
window.storyGenerator = {
  openStoryModal,
  closeStoryModal,
  downloadStoryMedia,
  sendStoryToBotChat,
  setStoryFormat,
  setStoryNeon,
  toggleStoryParams,
  restartAnimation
};

window.openStoryModal = openStoryModal;
window.shareResultAsStory = openStoryModal;
window.closeStoryModal = closeStoryModal;
window.setStoryNeon = setStoryNeon;
window.toggleStoryParams = toggleStoryParams;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ensureStoryModalExists);
} else {
  ensureStoryModalExists();
}