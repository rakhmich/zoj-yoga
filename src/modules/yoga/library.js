/**
 * МОДУЛЬ ИНТЕРАКТИВНОЙ БИБЛИОТЕКИ ПЕРВОИСТОЧНИКОВ
 * Файл: src/modules/yoga/library.js
 * Работает с данными из src/data/books-data.js
 */

(function () {
  'use strict';

  let activeCategory = 'all';
  let searchQuery = '';

  // Резервный каталог на случай задержки загрузки books-data.js
  const FALLBACK_BOOKS = [
    {
      id: 'hatha_pradipika',
      title: 'Хатха Йога Прадипика',
      author: 'Свами Сватмарама',
      category: 'yoga',
      categoryName: 'Классическая йога',
      year: 'XV век',
      pages: '148',
      format: 'PDF',
      fileSize: '4.2 МБ',
      description: 'Фундаментальный канонический трактат хатха-йоги: асаны, очистительные крии (шаткармы), пранаяма, мудры, бандхи и самадхи.',
      topics: ['4 ступени хатха-йоги', 'Отстройки базовых асан', 'Кумбхака и пранаяма', 'Пробуждение Кундалини'],
      targetAudience: 'Для инструкторов и практикующих любого уровня'
    },
    {
      id: 'yoga_sutras',
      title: 'Йога-Сутры',
      author: 'Махариши Патанджали',
      category: 'yoga',
      categoryName: 'Классическая йога',
      year: 'II в. до н.э.',
      pages: '112',
      format: 'PDF',
      fileSize: '2.8 МБ',
      description: 'Основополагающий философский труд раджа-йоги. 196 афоризмов о контроле колебаний ума (читта-вритти-ниродха) и восьмеричном пути.',
      topics: ['Яма и Нияма', 'Природа сознания', 'Препятствия в практике (клеши)', 'Самадхи'],
      targetAudience: 'Для глубокого изучения философии и медитации'
    },
    {
      id: 'gheranda_samhita',
      title: 'Гхеранда Самхита',
      author: 'Мудрец Гхеранда',
      category: 'hygiene',
      categoryName: 'Гигиена и шаткармы',
      year: 'XVII век',
      pages: '136',
      format: 'PDF',
      fileSize: '3.6 МБ',
      description: 'Энциклопедия семичастной йоги (Сапта-садхана). Подробнейшие инструкции по выполнению 21 шаткармы и очищению внутренних органов.',
      topics: ['Полный протокол шаткарм', '32 главные асаны', 'Мудры и пратьяхара', 'Питание йогина'],
      targetAudience: 'Для освоения очистительных практик и терапевтической йоги'
    },
    {
      id: 'shiva_samhita',
      title: 'Шива Самхита',
      author: 'Неизвестный автор',
      category: 'regulation',
      categoryName: 'Саморегуляция и стресс',
      year: 'XVII век',
      pages: '124',
      format: 'PDF',
      fileSize: '3.1 МБ',
      description: 'Трактат, объединяющий философию адвайта-веданты и тонкую анатомию: каналы нади, чакры, пранические ветра (вайю) и медитацию.',
      topics: ['72 000 каналов нади', 'Анатомия 7 чакр', 'Микрокосм и макрокосм', 'Контроль праны'],
      targetAudience: 'Для практикующих пранаяму и углубленную медитацию'
    }
  ];

  function injectLibraryStyles() {
    if (document.getElementById('library-standalone-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'library-standalone-styles';
    styleEl.textContent = `
      .lib-search-wrap {
        position: relative;
        margin-bottom: 12px;
      }
      .lib-search-input {
        width: 100%;
        padding: 12px 14px 12px 38px;
        background: var(--bg-card, rgba(15, 23, 42, 0.75));
        border: 1px solid var(--border-card, rgba(192, 132, 252, 0.25));
        border-radius: 14px;
        color: var(--text-main, #f8fafc);
        font-size: 14px;
        font-family: inherit;
        outline: none;
        box-sizing: border-box;
      }
      .lib-search-input:focus {
        border-color: #c084fc;
      }
      .lib-search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 15px;
        pointer-events: none;
        opacity: 0.7;
      }

      .lib-categories-bar {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 10px;
        margin-bottom: 14px;
        scrollbar-width: none;
      }
      .lib-categories-bar::-webkit-scrollbar { display: none; }

      .lib-cat-chip {
        flex-shrink: 0;
        padding: 7px 13px;
        background: var(--bg-card, rgba(15, 23, 42, 0.75));
        border: 1px solid var(--border-card, rgba(192, 132, 252, 0.25));
        border-radius: 20px;
        color: var(--text-muted, #94a3b8);
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .lib-cat-chip.active {
        background: rgba(192, 132, 252, 0.22);
        border-color: #c084fc;
        color: #ffffff;
      }

      .lib-book-card {
        background: var(--bg-card, rgba(15, 23, 42, 0.75));
        border: 1px solid var(--border-card, rgba(192, 132, 252, 0.2));
        border-radius: 16px;
        padding: 16px;
        margin-bottom: 12px;
        box-sizing: border-box;
      }

      .lib-book-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 8px;
      }
      .lib-book-title {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
        margin: 0 0 3px 0;
      }
      .lib-book-author {
        font-size: 13px;
        font-weight: 600;
        color: #c084fc;
      }

      .lib-book-meta-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 10px;
      }
      .lib-meta-chip {
        font-size: 11px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-secondary, #cbd5e1);
      }
      .lib-meta-chip.badge-pdf {
        background: rgba(239, 68, 68, 0.15);
        border-color: rgba(239, 68, 68, 0.4);
        color: #fca5a5;
      }

      .lib-book-desc {
        font-size: 13px;
        color: var(--text-secondary, #cbd5e1);
        line-height: 1.45;
        margin: 0 0 10px 0;
      }

      .lib-topics-trigger {
        font-size: 12.5px;
        font-weight: 700;
        color: #38bdf8;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 8px;
      }
      .lib-topics-box {
        display: none;
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 10px;
        padding: 10px 12px;
        margin-bottom: 10px;
      }
      .lib-topics-box.open { display: block; }
      .lib-topics-list {
        padding-left: 18px;
        margin: 0;
        font-size: 12.5px;
        line-height: 1.5;
        color: var(--text-secondary, #cbd5e1);
      }

      .lib-audience-box {
        font-size: 12px;
        color: var(--text-muted, #94a3b8);
        line-height: 1.4;
        margin-bottom: 12px;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .lib-audience-box strong { color: var(--text-main, #f8fafc); }

      .lib-btn-download {
        width: 100%;
        padding: 11px 14px;
        border-radius: 12px;
        background: linear-gradient(135deg, rgba(192, 132, 252, 0.2) 0%, rgba(147, 51, 234, 0.25) 100%);
        border: 1.5px solid rgba(192, 132, 252, 0.45);
        color: #ffffff;
        font-size: 13.5px;
        font-weight: 800;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: transform 0.15s ease;
      }
      .lib-btn-download:active {
        transform: scale(0.98);
      }
    `;
    document.head.appendChild(styleEl);
  }

  function renderLibraryScreen(targetContainer) {
    const container = targetContainer || 
                      document.getElementById('yoga-tab-content') || 
                      document.getElementById('tab-library') || 
                      document.getElementById('yoga-subview-container');
    if (!container) return;

    injectLibraryStyles();

    const categories = window.BOOK_CATEGORIES || [
      { id: 'all', title: 'Все книги', icon: '📚 ' },
      { id: 'yoga', title: 'Классическая йога', icon: '🧘 ' },
      { id: 'hygiene', title: 'Гигиена и шаткармы', icon: '🌿 ' },
      { id: 'regulation', title: 'Саморегуляция и стресс', icon: '⚡ ' }
    ];

    container.innerHTML = `
      <div class="section-title-wrap" style="margin-bottom: 14px;">
        <h2 style="font-size: 19px; font-weight: 800; color: var(--text-main, #f8fafc); margin-bottom: 4px;">
          📚 Библиотека первоисточников
        </h2>
        <p style="font-size: 13px; color: var(--text-muted, #94a3b8); line-height: 1.45;">
          Канонические трактаты с моментальной отправкой полных PDF-файлов ботом в Telegram
        </p>
      </div>

      <!-- Поисковая строка -->
      <div class="lib-search-wrap">
        <span class="lib-search-icon">🔍</span>
        <input type="text" id="lib-search-input" class="lib-search-input" placeholder="Поиск по названию, автору или теме..." value="${searchQuery}" />
      </div>

      <!-- Фильтры категорий -->
      <div class="lib-categories-bar" id="lib-cat-bar">
        ${categories.map(cat => `
          <button type="button" class="lib-cat-chip ${cat.id === activeCategory ? 'active' : ''}" data-category="${cat.id}">
            ${cat.icon}${cat.title}
          </button>
        `).join('')}
      </div>

      <!-- Счетчик книг -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 0 2px;">
        <span style="font-size: 12px; color: var(--text-muted, #94a3b8);" id="lib-counter-label">Загрузка...</span>
        <span style="font-size: 12px; font-weight: 700; color: #c084fc;">PDF ботом в 1 клик</span>
      </div>

      <!-- Список книг -->
      <div id="lib-books-list-container"></div>
    `;

    bindLibraryEvents(container);
    filterAndRenderBooks(container);
  }

  function filterAndRenderBooks(container) {
    const listEl = container.querySelector('#lib-books-list-container');
    const counterEl = container.querySelector('#lib-counter-label');
    if (!listEl) return;

    const allBooks = (window.BOOKS_DATA && window.BOOKS_DATA.length > 0) ? window.BOOKS_DATA : FALLBACK_BOOKS;
    const filtered = allBooks.filter(book => {
      const matchCat = (activeCategory === 'all') || (book.category === activeCategory);
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query) ||
        (book.topics && book.topics.some(t => t.toLowerCase().includes(query)));
      return matchCat && matchSearch;
    });

    if (counterEl) {
      counterEl.textContent = `Показано: ${filtered.length} из ${allBooks.length}`;
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 32px 16px; color: var(--text-muted, #94a3b8);">
          <div style="font-size: 36px; margin-bottom: 8px;">📖</div>
          <div style="font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 4px;">Ничего не найдено</div>
          <div style="font-size: 13px;">Попробуйте скорректировать поисковый запрос</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(book => `
      <div class="lib-book-card" data-book-id="${book.id}">
        <div class="lib-book-top">
          <div>
            <h3 class="lib-book-title">${book.title}</h3>
            <span class="lib-book-author">✍️ ${book.author}</span>
          </div>
          <span class="lib-meta-chip badge-pdf">${book.format || 'PDF'}</span>
        </div>

        <div class="lib-book-meta-chips">
          <span class="lib-meta-chip">📅 ${book.year}</span>
          <span class="lib-meta-chip">📄 ${book.pages} стр.</span>
          <span class="lib-meta-chip">💾 ${book.fileSize}</span>
          <span class="lib-meta-chip" style="color: #c084fc;">🏷️ ${book.categoryName}</span>
        </div>

        <p class="lib-book-desc">${book.description}</p>

        <div class="lib-topics-trigger" data-trigger-topics>
          <span>Содержание и ключевые темы</span>
          <span class="topics-chevron">▾</span>
        </div>
        <div class="lib-topics-box">
          <ul class="lib-topics-list">
            ${(book.topics || []).map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>

        <div class="lib-audience-box">
          <strong>Кому подходит:</strong> ${book.targetAudience}
        </div>

        <button type="button" class="lib-btn-download" data-action-send="${book.id}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
          <span>Получить книгу ботом (PDF)</span>
        </button>
      </div>
    `).join('');
  }

  function bindLibraryEvents(container) {
    const searchInput = container.querySelector('#lib-search-input');
    const catBar = container.querySelector('#lib-cat-bar');

    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterAndRenderBooks(container);
    });

    catBar?.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-category]');
      if (!chip) return;
      if (typeof window.haptic === 'function') window.haptic('light');
      catBar.querySelectorAll('.lib-cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-category');
      filterAndRenderBooks(container);
    });

    container.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-trigger-topics]');
      if (trigger) {
        if (typeof window.haptic === 'function') window.haptic('light');
        const box = trigger.nextElementSibling;
        const chevron = trigger.querySelector('.topics-chevron');
        if (box) {
          box.classList.toggle('open');
          if (chevron) {
            chevron.style.transform = box.classList.contains('open') ? 'rotate(180deg)' : 'none';
          }
        }
        return;
      }

      const sendBtn = e.target.closest('[data-action-send]');
      if (sendBtn) {
        const bookId = sendBtn.getAttribute('data-action-send');
        const allBooks = (window.BOOKS_DATA && window.BOOKS_DATA.length > 0) ? window.BOOKS_DATA : FALLBACK_BOOKS;
        const found = allBooks.find(b => b.id === bookId);
        if (found) {
          sendBookViaTelegram(found);
        }
      }
    });
  }

  function sendBookViaTelegram(book) {
    if (typeof window.haptic === 'function') window.haptic('medium');

    const botUsername = 'zoj_tl_bot';
    const deepLinkUrl = `https://t.me/${botUsername}?start=book_${book.id}`;

    if (window.Telegram?.WebApp && typeof window.Telegram.WebApp.openTelegramLink === 'function') {
      try {
        window.Telegram.WebApp.openTelegramLink(deepLinkUrl);
        return;
      } catch (e) {}
    }

    if (window.tgService?.openLink) {
      window.tgService.openLink(deepLinkUrl);
    } else {
      window.open(deepLinkUrl, '_blank');
    }
  }

  // Экспорт под обоими именами для роутера и main.js
  window.renderLibraryScreen = renderLibraryScreen;
  window.renderLibraryTab = renderLibraryScreen;
})();