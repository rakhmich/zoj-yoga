/**
 * МОДУЛЬ ИНТЕРАКТИВНОГО КАТАЛОГА АСАН (АККОРДЕОН-СПИСОК 116 ПОЗ)
 * Файл: src/modules/yoga/asanas.js
 */

(function () {
  'use strict';

  window.YogaAsanas = window.YogaAsanas || {};

  const CATEGORIES = [
    { id: 'all', label: 'Все позы' },
    { id: 'standing', label: 'Стоячие' },
    { id: 'sitting', label: 'Сидячие' },
    { id: 'lying', label: 'Лежачие' },
    { id: 'inverted', label: 'Перевернутые' },
    { id: 'arm-balances', label: 'Балансы' }
  ];

  const LEVEL_CONFIG = {
    'базовый': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.35)' },
    'средний': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.35)' },
    'продвинутый': { color: '#c084fc', bg: 'rgba(192, 132, 252, 0.18)', border: 'rgba(192, 132, 252, 0.4)' }
  };

  let allAsanasList = [];
  let activeCategory = 'all';
  let searchQuery = '';

  function injectAsanasStyles() {
    if (document.getElementById('asanas-accordion-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'asanas-accordion-styles';
    styleEl.textContent = `
      .asanas-view-wrapper {
        width: 100%;
        box-sizing: border-box;
      }
      .asanas-search-box {
        position: relative;
        margin-bottom: 12px;
      }
      .asanas-search-input {
        width: 100%;
        padding: 12px 38px 12px 38px;
        font-size: 14px;
        border-radius: 14px;
        border: 1px solid var(--border-card, rgba(192, 132, 252, 0.25));
        background: var(--bg-card, rgba(15, 23, 42, 0.75));
        color: var(--text-main, #f8fafc);
        outline: none;
        box-sizing: border-box;
        font-family: inherit;
        transition: border-color 0.2s ease;
      }
      .asanas-search-input:focus {
        border-color: #c084fc;
      }
      .asanas-search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 14px;
        pointer-events: none;
        opacity: 0.7;
      }
      .asanas-search-clear {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.12);
        border: none;
        color: var(--text-muted, #94a3b8);
        border-radius: 50%;
        width: 22px;
        height: 22px;
        font-size: 12px;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
      }
      .asanas-search-clear.visible { display: flex; }

      /* Горизонтальный скролл чипов категорий */
      .asanas-chips-bar {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding: 2px 2px 12px 2px;
        margin-bottom: 12px;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
        touch-action: pan-x;
        cursor: grab;
      }
      .asanas-chips-bar:active { cursor: grabbing; }
      .asanas-chips-bar::-webkit-scrollbar { display: none; }

      .asana-chip-btn {
        flex-shrink: 0;
        padding: 7px 14px;
        font-size: 12.5px;
        font-weight: 700;
        border-radius: 20px;
        border: 1px solid var(--border-card, rgba(192, 132, 252, 0.25));
        background: var(--bg-card, rgba(15, 23, 42, 0.75));
        color: var(--text-muted, #94a3b8);
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
      }
      .asana-chip-btn.active {
        background: rgba(192, 132, 252, 0.22);
        border-color: #c084fc;
        color: #ffffff;
        box-shadow: 0 0 12px rgba(192, 132, 252, 0.3);
      }
      .asana-chip-badge {
        font-size: 11px;
        opacity: 0.8;
        margin-left: 4px;
      }

      /* Карточка-аккордеон асаны */
      .asana-card-acc {
        background: var(--bg-card, rgba(15, 23, 42, 0.75));
        border: 1px solid var(--border-card, rgba(192, 132, 252, 0.2));
        border-radius: 16px;
        padding: 14px 16px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        box-sizing: border-box;
        width: 100%;
        backdrop-filter: blur(8px);
      }
      .asana-card-acc:hover {
        border-color: rgba(192, 132, 252, 0.45);
      }
      .asana-card-acc.expanded {
        border-color: rgba(192, 132, 252, 0.7);
        box-shadow: 0 4px 20px rgba(192, 132, 252, 0.15);
      }

      .asana-acc-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .asana-acc-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: rgba(192, 132, 252, 0.12);
        border: 1px solid rgba(192, 132, 252, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        flex-shrink: 0;
      }
      .asana-acc-title-group {
        flex: 1;
        min-width: 0;
      }
      .asana-acc-title {
        font-size: 15.5px;
        font-weight: 800;
        color: var(--text-main, #f8fafc);
        margin: 0 0 2px 0;
        line-height: 1.3;
      }
      .asana-acc-sanskrit {
        font-size: 12px;
        font-style: italic;
        color: #c084fc;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .asana-acc-tags {
        display: flex;
        gap: 6px;
        align-items: center;
        flex-wrap: wrap;
      }
      .asana-level-tag {
        font-size: 10.5px;
        font-weight: 800;
        padding: 2px 7px;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        border: 1px solid transparent;
      }
      .asana-duration-tag {
        font-size: 11px;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 6px;
        background: rgba(56, 189, 248, 0.14);
        border: 1px solid rgba(56, 189, 248, 0.3);
        color: #38bdf8;
      }
      .asana-acc-chevron {
        font-size: 14px;
        color: var(--text-muted, #94a3b8);
        transition: transform 0.25s ease;
        margin-left: 6px;
        flex-shrink: 0;
      }
      .asana-card-acc.expanded .asana-acc-chevron {
        transform: rotate(180deg);
        color: #c084fc;
      }

      .asana-acc-short {
        font-size: 13px;
        color: var(--text-secondary, #cbd5e1);
        line-height: 1.45;
        margin: 8px 0 0 0;
      }
      .asana-card-acc.expanded .asana-acc-short { display: none; }

      /* Раскрывающийся контент */
      .asana-acc-details {
        display: none;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px dashed rgba(255, 255, 255, 0.12);
        display: none;
        flex-direction: column;
        gap: 10px;
      }
      .asana-card-acc.expanded .asana-acc-details { display: flex; }

      .asana-detail-box {
        background: rgba(0, 0, 0, 0.25);
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.06);
      }
      .asana-detail-label {
        font-size: 11.5px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        margin-bottom: 4px;
      }
      .asana-detail-text {
        font-size: 13px;
        line-height: 1.5;
        color: var(--text-secondary, #cbd5e1);
      }
      .asana-contra-box {
        background: rgba(239, 68, 68, 0.08);
        border-left: 3px solid #ef4444;
        border-radius: 8px;
        padding: 10px 12px;
      }
    `;
    document.head.appendChild(styleEl);
  }

  function normalizeCategory(cat) {
    const c = String(cat || '').toLowerCase().trim();
    if (c.includes('стоя') || c.includes('stand')) return 'standing';
    if (c.includes('сидя') || c.includes('sit')) return 'sitting';
    if (c.includes('лежа') || c.includes('ly')) return 'lying';
    if (c.includes('перевер') || c.includes('invert')) return 'inverted';
    if (c.includes('рук') || c.includes('arm') || c.includes('баланс') || c.includes('balance')) return 'arm-balances';
    return 'standing';
  }

  function normalizeLevel(lvl) {
    if (!lvl) return 'Базовый';
    const key = String(lvl).toLowerCase().trim();
    if (key.includes('баз') || key === 'beginner') return 'Базовый';
    if (key.includes('сред') || key === 'intermediate') return 'Средний';
    if (key.includes('продв') || key.includes('слож') || key === 'advanced') return 'Продвинутый';
    return lvl;
  }

  function loadAsanasData() {
    let rawList = [];

    // Прямой опрос 5 массивов
    const directArrays = [
      window.standingAsanas,
      window.sittingAsanas,
      window.lyingAsanas,
      window.invertedAsanas,
      window.armBalancesAsanas || window.armBalances
    ];
    const directMerged = directArrays.filter(Array.isArray).flat();
    if (directMerged.length > 0) {
      rawList = directMerged;
    }

    if (!rawList.length && typeof window.getAllAsanas === 'function') {
      try {
        const fromAgg = window.getAllAsanas();
        if (Array.isArray(fromAgg) && fromAgg.length > 0) rawList = fromAgg;
      } catch (e) {}
    }

    if (!rawList.length && Array.isArray(window.allAsanas) && window.allAsanas.length > 0) {
      rawList = window.allAsanas;
    }

    allAsanasList = rawList.map((item, idx) => ({
      id: item.id || `asana-${idx}`,
      nameRu: item.name || item.nameRu || item.title || 'Асана',
      nameSanskrit: item.sanskrit || item.nameSanskrit || item.sanskritTranslit || '',
      category: normalizeCategory(item.bodyPosition || item.category || item.type || ''),
      level: normalizeLevel(item.difficulty || item.level),
      icon: item.icon || '🧘',
      duration: item.duration || '',
      breath: item.breath || '',
      rawTechnique: Array.isArray(item.technique) ? item.technique : null,
      techniqueText: Array.isArray(item.technique) ? item.technique.join(' ') : (item.technique || 'Выполняйте отстройку плавно, сохраняя ровное дыхание.'),
      rawBenefits: Array.isArray(item.benefits) ? item.benefits : null,
      benefitsText: Array.isArray(item.benefits) ? item.benefits.join('. ') : (item.benefits || 'Укрепление мышечного корсета.'),
      rawContra: Array.isArray(item.contraindications) ? item.contraindications : null,
      contraText: Array.isArray(item.contraindications) ? item.contraindications.join('. ') : (item.contraindications || 'Индивидуальные ограничения.'),
      anatomy: Array.isArray(item.targetMuscles) ? item.targetMuscles.join(', ') : (item.anatomy || item.muscles || 'Мышцы кора и позвоночника.'),
      counterpose: item.counterpose || item.counterPose || ''
    }));

    return allAsanasList;
  }

  function getCategoryCount(catId) {
    if (catId === 'all') return allAsanasList.length;
    return allAsanasList.filter(a => a.category === catId).length;
  }

  function filterAndRenderList(container) {
    const listTarget = container.querySelector('#asanas-list-target');
    const counterTarget = container.querySelector('#asanas-counter');
    if (!listTarget) return;

    loadAsanasData();

    // Обновляем бейджи количества в чипах
    CATEGORIES.forEach(cat => {
      const bEl = container.querySelector(`#cat-count-${cat.id}`);
      if (bEl) bEl.textContent = `(${getCategoryCount(cat.id)})`;
    });

    const filtered = allAsanasList.filter(item => {
      const matchCat = (activeCategory === 'all') || (item.category === activeCategory);
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = !query || 
        item.nameRu.toLowerCase().includes(query) || 
        item.nameSanskrit.toLowerCase().includes(query) ||
        item.benefitsText.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    if (counterTarget) {
      counterTarget.textContent = `Показано асан: ${filtered.length} из ${allAsanasList.length}`;
    }

    if (filtered.length === 0) {
      listTarget.innerHTML = `
        <div style="text-align: center; padding: 36px 16px; color: var(--text-muted, #94a3b8);">
          <div style="font-size: 38px; margin-bottom: 8px;">🔍</div>
          <div style="font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 4px;">Ничего не найдено</div>
          <div style="font-size: 13px;">Попробуйте скорректировать запрос или выбрать другую категорию</div>
        </div>
      `;
      return;
    }

    listTarget.innerHTML = filtered.map(item => {
      const lvlKey = item.level.toLowerCase();
      const lvlCfg = LEVEL_CONFIG[lvlKey] || LEVEL_CONFIG['базовый'];

      const techHtml = item.rawTechnique
        ? item.rawTechnique.map(step => `<p style="margin: 0 0 5px 0;">${step}</p>`).join('')
        : `<p style="margin: 0;">${item.techniqueText}</p>`;

      const benefitsHtml = item.rawBenefits
        ? `<ul style="margin: 0; padding-left: 18px;">${item.rawBenefits.map(b => `<li style="margin-bottom: 3px;">${b}</li>`).join('')}</ul>`
        : `<p style="margin: 0;">${item.benefitsText}</p>`;

      const contraHtml = item.rawContra
        ? `<ul style="margin: 0; padding-left: 18px;">${item.rawContra.map(c => `<li style="margin-bottom: 3px;">${c}</li>`).join('')}</ul>`
        : `<p style="margin: 0;">${item.contraText}</p>`;

      return `
        <div class="asana-card-acc" data-asana-id="${item.id}">
          <div class="asana-acc-header">
            <div class="asana-acc-icon">${item.icon}</div>
            <div class="asana-acc-title-group">
              <h4 class="asana-acc-title">${item.nameRu}</h4>
              ${item.nameSanskrit ? `<div class="asana-acc-sanskrit">${item.nameSanskrit}</div>` : ''}
              <div class="asana-acc-tags">
                <span class="asana-level-tag" style="color: ${lvlCfg.color}; background: ${lvlCfg.bg}; border-color: ${lvlCfg.border};">
                  ${item.level}
                </span>
                ${item.duration ? `<span class="asana-duration-tag">⏱ ${item.duration}</span>` : ''}
              </div>
            </div>
            <span class="asana-acc-chevron">▾</span>
          </div>

          <p class="asana-acc-short">${item.benefitsText}</p>

          <div class="asana-acc-details">
            <div class="asana-detail-box">
              <div class="asana-detail-label" style="color: #38bdf8;">🧘 Пошаговая техника отстройки:</div>
              <div class="asana-detail-text" style="color: var(--text-main, #f8fafc);">${techHtml}</div>
            </div>

            ${item.breath ? `
              <div class="asana-detail-box">
                <span class="asana-detail-label" style="color: #67e8f9; margin-right: 4px;">🌬 Дыхание:</span>
                <span class="asana-detail-text">${item.breath}</span>
              </div>
            ` : ''}

            <div class="asana-detail-box">
              <div class="asana-detail-label" style="color: #10b981;">✨ Польза и терапевтический эффект:</div>
              <div class="asana-detail-text">${benefitsHtml}</div>
            </div>

            <div class="asana-detail-box">
              <div class="asana-detail-label" style="color: #f59e0b;">💪 Задействованная анатомия:</div>
              <div class="asana-detail-text">${item.anatomy}</div>
            </div>

            <div class="asana-contra-box">
              <div class="asana-detail-label" style="color: #f87171;">⚠️ Противопоказания и ограничения:</div>
              <div class="asana-detail-text" style="color: #fca5a5;">${contraHtml}</div>
            </div>

            ${item.counterpose ? `
              <div class="asana-detail-box">
                <span class="asana-detail-label" style="color: #c084fc; margin-right: 4px;">🔄 Рекомендуемая контрпоза:</span>
                <span class="asana-detail-text" style="color: #ffffff; font-weight: 700;">${item.counterpose}</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Делегирование клика раскрытия аккордеона
    listTarget.querySelectorAll('.asana-card-acc').forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof window.haptic === 'function') window.haptic('light');
        card.classList.toggle('expanded');
      });
    });
  }

  function renderAsanasTab(container) {
    let root = container;
    if (!root || !(root instanceof HTMLElement)) {
      root = document.getElementById('yoga-tab-content') || 
             document.getElementById('yoga-subview-container') ||
             document.getElementById('subview-asanas');
    }
    if (!root) return;

    injectAsanasStyles();
    root.style.display = 'block';

    root.innerHTML = `
      <div class="asanas-view-wrapper">
        <!-- Поисковая строка с кнопкой сброса -->
        <div class="asanas-search-box">
          <span class="asanas-search-icon">🔍</span>
          <input 
            type="text" 
            id="asanas-search-input" 
            class="asanas-search-input"
            placeholder="Поиск по названию или санскриту..." 
            value="${searchQuery}"
          />
          <button type="button" id="asanas-search-clear" class="asanas-search-clear ${searchQuery ? 'visible' : ''}">✕</button>
        </div>

        <!-- Горизонтальная полоса чипов категорий с плавной прокруткой -->
        <div class="asanas-chips-bar" id="asanas-chips-bar">
          ${CATEGORIES.map(cat => `
            <button 
              type="button"
              class="asana-chip-btn ${cat.id === activeCategory ? 'active' : ''}" 
              data-category="${cat.id}">
              <span>${cat.label}</span>
              <span class="asana-chip-badge" id="cat-count-${cat.id}"></span>
            </button>
          `).join('')}
        </div>

        <!-- Инфо-строка -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 12px; color: var(--text-muted, #94a3b8); padding: 0 4px;">
          <span id="asanas-counter">Загрузка каталога...</span>
          <span style="color: #c084fc; font-weight: 600;">Нажмите для подробностей</span>
        </div>

        <!-- Вертикальный список раскрывающихся карточек -->
        <div id="asanas-list-target" style="display: flex; flex-direction: column; width: 100%;"></div>
      </div>
    `;

    setupEvents(root);
    filterAndRenderList(root);
  }

  function setupEvents(container) {
    const searchInput = container.querySelector('#asanas-search-input');
    const clearBtn = container.querySelector('#asanas-search-clear');
    const chipsBar = container.querySelector('#asanas-chips-bar');

    // 1. Живой поиск
    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearBtn) clearBtn.classList.toggle('visible', !!searchQuery);
      filterAndRenderList(container);
    });

    clearBtn?.addEventListener('click', () => {
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      clearBtn.classList.remove('visible');
      filterAndRenderList(container);
      searchInput?.focus();
    });

    // 2. Горизонтальная прокрутка колесом мыши на ПК
    chipsBar?.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        chipsBar.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    // 3. Перетаскивание полосы чипов мышкой (Drag-to-scroll)
    let isDown = false;
    let startX = 0;
    let scrollLeftPos = 0;
    let dragDistance = 0;

    chipsBar?.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - chipsBar.offsetLeft;
      scrollLeftPos = chipsBar.scrollLeft;
      dragDistance = 0;
    });

    window.addEventListener('mouseup', () => { isDown = false; });

    chipsBar?.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - chipsBar.offsetLeft;
      const walk = (x - startX) * 1.5;
      dragDistance = Math.abs(walk);
      chipsBar.scrollLeft = scrollLeftPos - walk;
    });

    // 4. Переключение категорий
    chipsBar?.addEventListener('click', (e) => {
      if (dragDistance > 6) return;
      const btn = e.target.closest('[data-category]');
      if (!btn) return;

      if (typeof window.haptic === 'function') window.haptic('light');

      chipsBar.querySelectorAll('.asana-chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeCategory = btn.getAttribute('data-category') || 'all';
      filterAndRenderList(container);
    });
  }

  window.YogaAsanas.renderAsanasTab = renderAsanasTab;
  window.renderAsanasTab = renderAsanasTab;
})();