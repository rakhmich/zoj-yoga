/**
 * МОДУЛЬ ДЫХАТЕЛЬНЫХ ПРАКТИК (ПРАНАЯМА) — АККОРДЕОН, ТАКТИЛЬНЫЙ ПЕЙСЕР И ФИЛЬТРЫ
 * Файл: src/modules/yoga/pranayama.js
 */

(function () {
  'use strict';

  const PRANAYAMA_LIST = [
    {
      id: 'samavritti',
      nameRu: 'Самавритти (Квадратное дыхание)',
      nameSanskrit: 'Sama Vṛtti Prāṇāyāma',
      level: 'Для всех',
      ratio: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
      badge: 'Квадрат 4:4:4:4',
      shortDesc: 'Равновеликое дыхание с одинаковой длительностью фаз. Быстро снижает тревожность и нормализует пульс.',
      technique: [
        'Примите удобную позу сидя с прямой спиной и расслабленными плечами.',
        'Сделайте плавный вдох через нос на 4 счета, расширяя живот и нижние ребра.',
        'Задержите дыхание на 4 счета после вдоха (Антара Кумбхака), сохраняя горло мягким.',
        'Спокойно и без рывков выдохните через нос на 4 счета, подтягивая живот.',
        'Задержите дыхание на 4 счета в фазе выдоха (Бахья Кумбхака).',
        'Повторите от 8 до 16 непрерывных циклов.'
      ],
      benefits: 'Выравнивает вегетативный баланс (индекс Кердо), купирует панические реакции, снижает артериальное давление и возвращает ясность мышления.',
      contraindications: 'Гипертонический криз (в этом случае задержки исключаются, остаётся мягкий вдох-выдох).'
    },
    {
      id: 'nadi-shodhana',
      nameRu: 'Нади Шодхана (Попеременное дыхание)',
      nameSanskrit: 'Nāḍī Śodhana Prāṇāyāma',
      level: 'Базовый',
      ratio: { inhale: 4, holdIn: 0, exhale: 6, holdOut: 0 },
      badge: 'Баланс полушарий',
      shortDesc: 'Очищение тонких каналов Ида и Пингала попеременным дыханием через правую и левую ноздри.',
      technique: [
        'Сложите пальцы правой руки в Насикагра-мудру (указательный и средний пальцы в межбровье, большой управляет правой ноздрей, безымянный — левой).',
        'Прикройте правую ноздрю большим пальцем, сделайте мягкий вдох через левую ноздрю (4 секунды).',
        'Закройте левую ноздрю, откройте правую — сделайте длинный выдох (6 секунд).',
        'Вдохните через правую ноздрю (4 секунды).',
        'Закройте правую, откройте левую — сделайте выдох (6 секунд). Это один завершенный цикл.'
      ],
      benefits: 'Синхронизирует полушария мозга, активизирует парасимпатический тонус, готовит ум к медитации и снимает предэкзаменационный стресс.',
      contraindications: 'Острый ринит, синусит, гайморит, сильная заложенность носовых ходов.'
    },
    {
      id: 'kapalabhati',
      nameRu: 'Капалабхати («Сияющий череп»)',
      nameSanskrit: 'Kapālabhāti',
      level: 'Средний',
      ratio: { inhale: 1, holdIn: 0, exhale: 1, holdOut: 0 },
      badge: 'Очищение и бодрость',
      shortDesc: 'Интенсивное очистительное дыхание: акцентированный резкий выдох животом и пассивный рефлекторный вдох.',
      technique: [
        'Сядьте прямо, расслабьте плечи, ладони положите на колени или низ живота.',
        'Сделайте спокойный вдох животом.',
        'Резко вытолкните воздух через нос за счет быстрого сокращения мышц брюшного пресса (пупок к позвоночнику).',
        'Мгновенно расслабьте живот — воздух сам бесшумно войдет в легкие.',
        'Темп: 1–2 цикла в секунду. Выполняйте 3 серии по 36–54 выдоха с отдыхом между ними.'
      ],
      benefits: 'Глубокий массаж внутренних органов ЖКТ, очищение лобных пазух, насыщение тканей кислородом, преодоление утренней сонливости.',
      contraindications: 'Беременность, менструация, язва желудка, повышенное внутричерепное давление, грыжи.'
    },
    {
      id: 'bhramari',
      nameRu: 'Бхрамари («Дыхание пчелы»)',
      nameSanskrit: 'Bhrāmarī Prāṇāyāma',
      level: 'Для всех',
      ratio: { inhale: 4, holdIn: 0, exhale: 8, holdOut: 0 },
      badge: 'Антистресс и сон',
      shortDesc: 'Звуковая вибрационная практика: плавный вдох и долгий выдох с мягким гудящим звуком «ммм», резонирующим в черепе.',
      technique: [
        'Сядьте удобно, прикройте ушные раковины козелками ушей большими пальцами рук (Шанмукхи-мудра).',
        'Сделайте глубокий мягкий вдох через нос.',
        'На выдохе сомкните губы (зубы слегка разомкнуты) и издавайте низкий ровный гудящий звук «М-м-м», концентрируясь на вибрации в центре головы.',
        'Повторите от 6 до 12 циклов перед сном или медитацией.'
      ],
      benefits: 'Мощно стимулирует блуждающий нерв, стимулирует выработку оксида азота (NO) в носоглотке, снимает головные боли напряжения и лечит бессонницу.',
      contraindications: 'Острый отит, гнойные воспаления среднего уха.'
    },
    {
      id: 'ujjayi',
      nameRu: 'Удджайи («Победоносное дыхание»)',
      nameSanskrit: 'Ujjāyī Prāṇāyāma',
      level: 'Базовый',
      ratio: { inhale: 5, holdIn: 0, exhale: 5, holdOut: 0 },
      badge: 'Дыхание в асанах',
      shortDesc: 'Дыхание с мягким сжатием голосовой щели. Создает шипящий звук морского прибоя, разогревая воздух и тело.',
      technique: [
        'Слегка опустите подбородок к яремной ямке.',
        'Частично сомкните голосовую щель (как при попытке согреть дыханием стекло с закрытым ртом).',
        'Дышите через нос, удерживая легкое сопротивление воздуху и мягкий шипящий звук волны как на вдохе, так и на выдохе.'
      ],
      benefits: 'Согревает входящий воздух, препятствует скачкам пульса при силовых связках асан, стабилизирует нервную систему.',
      contraindications: 'Выраженная гипотония (пониженное давление) в фазе упадка сил.'
    },
    {
      id: 'bhastrika',
      nameRu: 'Бхастрика («Кузнечные меха»)',
      nameSanskrit: 'Bhastrikā Prāṇāyāma',
      level: 'Продвинутый',
      ratio: { inhale: 2, holdIn: 0, exhale: 2, holdOut: 0 },
      badge: 'Энергетик и жар',
      shortDesc: 'Интенсивные, одинаково мощные форсированные вдохи и выдохи диафрагмой. Разогревает тело и разгоняет обмен веществ.',
      technique: [
        'Спина прямая, грудная клетка раскрыта.',
        'Выполняйте одинаково активный, акцентированный вдох и такой же мощный выдох с участием диафрагмы и ребер.',
        'Скорость: 1 цикл в секунду. 3 подхода по 15–20 циклов с завершающей комфортной задержкой дыхания на вдохе.'
      ],
      benefits: 'Увеличивает жизненную емкость легких (ЖЕЛ), стимулирует симпатический тонус, повышает термогенез и ликвидирует застойные явления в бронхах.',
      contraindications: 'Сердечно-сосудистые заболевания, гипертония, глаукома, эпилепсия, грыжи.'
    },
    {
      id: 'sitali',
      nameRu: 'Ситали (Охлаждающее дыхание)',
      nameSanskrit: 'Śītalī Prāṇāyāma',
      level: 'Базовый',
      ratio: { inhale: 4, holdIn: 2, exhale: 6, holdOut: 0 },
      badge: 'Охлаждение и детокс',
      shortDesc: 'Вдох через свернутый в трубочку язык и выдох через нос. Охлаждает кровь, снижает чувство жажды и жара.',
      technique: [
        'Высуньте кончик языка и сверните его края вверх трубочкой (если генетически это недоступно — делайте вдох сквозь сжатые зубы, практика Ситкари).',
        'Медленно втяните прохладный воздух через язык в легкие.',
        'Заберите язык в рот, закройте губы и сделайте плавный длинный выдох через нос.'
      ],
      benefits: 'Снижает температуру тела в жаркую погоду, уменьшает артериальное давление, успокаивает раздражение, снижает аппетит.',
      contraindications: 'Бронхит, астма в холодное время года, хронический кашель, пониженное давление.'
    }
  ];

  const LEVEL_CONFIG = {
    'для всех': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.35)' },
    'базовый': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.35)' },
    'средний': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.35)' },
    'продвинутый': { color: '#c084fc', bg: 'rgba(192, 132, 252, 0.18)', border: 'rgba(192, 132, 252, 0.4)' }
  };

  const CATEGORIES = [
    { id: 'all', label: 'Все' },
    { id: 'для всех', label: 'Для всех' },
    { id: 'базовый', label: 'Базовый' },
    { id: 'средний', label: 'Средний' },
    { id: 'продвинутый', label: 'Продвинутый' }
  ];

  let activePractice = PRANAYAMA_LIST[0];
  let pacerRunning = false;
  let currentPhaseIndex = 0;
  let phaseSecondsLeft = 0;
  let completedCyclesCount = 0;
  let activeCountdownId = null;
  let soundEnabled = true;

  let activeCategory = 'all';
  let searchQuery = '';

  function injectPranayamaStyles() {
    if (document.getElementById('pranayama-view-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'pranayama-view-styles';
    styleEl.textContent = `
      .prana-wrapper {
        width: 100%;
        box-sizing: border-box;
      }

      /* Карточка тренажера */
      .prana-pacer-card {
        border: 1px solid var(--border-card, rgba(139, 92, 246, 0.35));
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%);
        margin-bottom: 16px;
        border-radius: 18px;
        padding: 16px;
        box-sizing: border-box;
        backdrop-filter: blur(10px);
        overflow: hidden;
      }
      .prana-pacer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      .prana-pacer-tag {
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        color: #c4b5fd;
        letter-spacing: 0.5px;
      }
      .prana-header-controls {
        display: flex;
        gap: 6px;
        align-items: center;
      }
      .prana-sound-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #f8fafc;
        border-radius: 999px;
        padding: 3px 9px;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: all 0.2s ease;
      }
      .prana-sound-btn.muted {
        color: var(--text-muted, #94a3b8);
        background: rgba(0, 0, 0, 0.3);
      }
      .prana-cycles-badge {
        font-size: 11px;
        font-weight: 800;
        background: rgba(139, 92, 246, 0.25);
        color: #e9d5ff;
        padding: 3px 9px;
        border-radius: 999px;
        border: 1px solid rgba(139, 92, 246, 0.35);
      }

      /* Таблица ритма */
      .prana-rhythm-chips {
        display: flex;
        gap: 6px;
        margin: 10px 0 12px 0;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .prana-rhythm-chips::-webkit-scrollbar { display: none; }
      .prana-rhythm-chip {
        flex: 1;
        min-width: 58px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 6px 4px;
        text-align: center;
        transition: all 0.25s ease;
      }
      .prana-rhythm-chip.active-phase {
        background: rgba(139, 92, 246, 0.25);
        border-color: #8b5cf6;
        box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
      }
      .prana-rhythm-chip-label {
        font-size: 10px;
        font-weight: 700;
        color: var(--text-muted, #94a3b8);
        text-transform: uppercase;
      }
      .prana-rhythm-chip-val {
        font-size: 13.5px;
        font-weight: 900;
        margin-top: 1px;
      }

      /* Дыхательный круг с безопасной зоной высоты */
      .prana-circle-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 220px;
        padding: 16px 0;
        position: relative;
        box-sizing: border-box;
      }
      .prana-visual-circle {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.45) 0%, rgba(139, 92, 246, 0.06) 70%);
        border: 3px solid #8b5cf6;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease;
        box-shadow: 0 0 24px rgba(139, 92, 246, 0.35);
        transform: scale(1);
        will-change: transform;
      }
      .prana-phase-name {
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        color: #ffffff;
        letter-spacing: 1px;
      }
      .prana-phase-seconds {
        font-size: 36px;
        font-weight: 900;
        color: #c4b5fd;
        line-height: 1;
        margin-top: 4px;
      }
      .prana-phase-hint {
        font-size: 12px;
        color: var(--text-secondary, #cbd5e1);
        margin-top: 14px;
        font-weight: 600;
        text-align: center;
        min-height: 18px;
        max-width: 90%;
      }

      /* Поиск и категории */
      .prana-search-box {
        position: relative;
        margin-bottom: 10px;
      }
      .prana-search-input {
        width: 100%;
        padding: 11px 36px 11px 36px;
        font-size: 13.5px;
        border-radius: 12px;
        border: 1px solid var(--border-card, rgba(192, 132, 252, 0.25));
        background: var(--bg-card, rgba(15, 23, 42, 0.75));
        color: var(--text-main, #f8fafc);
        outline: none;
        box-sizing: border-box;
        font-family: inherit;
      }
      .prana-search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 14px;
        pointer-events: none;
        opacity: 0.7;
      }
      .prana-search-clear {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.12);
        border: none;
        color: var(--text-muted, #94a3b8);
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 11px;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
      }
      .prana-search-clear.visible { display: flex; }

      .prana-chips-bar {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 10px;
        margin-bottom: 12px;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
        touch-action: pan-x;
        cursor: grab;
      }
      .prana-chips-bar::-webkit-scrollbar { display: none; }
      .prana-chip-btn {
        flex-shrink: 0;
        padding: 6px 13px;
        font-size: 12px;
        font-weight: 700;
        border-radius: 20px;
        border: 1px solid var(--border-card, rgba(192, 132, 252, 0.25));
        background: var(--bg-card, rgba(15, 23, 42, 0.75));
        color: var(--text-muted, #94a3b8);
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .prana-chip-btn.active {
        background: rgba(192, 132, 252, 0.22);
        border-color: #c084fc;
        color: #ffffff;
        box-shadow: 0 0 10px rgba(192, 132, 252, 0.3);
      }

      /* Аккордеон техник */
      .prana-card-acc {
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
      .prana-card-acc:hover { border-color: rgba(192, 132, 252, 0.45); }
      .prana-card-acc.expanded {
        border-color: rgba(192, 132, 252, 0.7);
        box-shadow: 0 4px 20px rgba(192, 132, 252, 0.15);
      }
      .prana-card-acc.is-active-pacer {
        border-color: #8b5cf6;
        background: rgba(139, 92, 246, 0.12);
      }

      .prana-acc-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .prana-acc-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: rgba(139, 92, 246, 0.18);
        border: 1px solid rgba(139, 92, 246, 0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        flex-shrink: 0;
      }
      .prana-acc-title-group {
        flex: 1;
        min-width: 0;
      }
      .prana-acc-title {
        font-size: 15.5px;
        font-weight: 800;
        color: #ffffff;
        margin: 0 0 2px 0;
        line-height: 1.3;
      }
      .prana-acc-sanskrit {
        font-size: 12px;
        font-style: italic;
        color: #c4b5fd;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .prana-acc-tags {
        display: flex;
        gap: 6px;
        align-items: center;
        flex-wrap: wrap;
      }
      .prana-tag-level {
        font-size: 10.5px;
        font-weight: 800;
        padding: 2px 7px;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        border: 1px solid transparent;
      }
      .prana-tag-ratio {
        font-size: 11px;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #f1f5f9;
      }
      .prana-acc-chevron {
        font-size: 14px;
        color: var(--text-muted, #94a3b8);
        transition: transform 0.25s ease;
        margin-left: 6px;
        flex-shrink: 0;
      }
      .prana-card-acc.expanded .prana-acc-chevron {
        transform: rotate(180deg);
        color: #c084fc;
      }

      .prana-acc-short {
        font-size: 13px;
        color: var(--text-secondary, #cbd5e1);
        line-height: 1.45;
        margin: 8px 0 0 0;
      }
      .prana-card-acc.expanded .prana-acc-short { display: none; }

      .prana-acc-details {
        display: none;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px dashed rgba(255, 255, 255, 0.12);
        flex-direction: column;
        gap: 10px;
      }
      .prana-card-acc.expanded .prana-acc-details { display: flex; }

      .prana-detail-box {
        background: rgba(0, 0, 0, 0.25);
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.06);
      }
      .prana-detail-label {
        font-size: 11.5px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        margin-bottom: 4px;
      }
      .prana-detail-text {
        font-size: 13px;
        line-height: 1.5;
        color: var(--text-secondary, #cbd5e1);
      }
      .prana-contra-box {
        background: rgba(239, 68, 68, 0.08);
        border-left: 3px solid #ef4444;
        border-radius: 8px;
        padding: 10px 12px;
      }

      .btn-select-pacer {
        width: 100%;
        padding: 10px 14px;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(109, 40, 217, 0.3) 100%);
        border: 1.5px solid #8b5cf6;
        border-radius: 12px;
        color: #ffffff;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: transform 0.15s ease;
      }
      .btn-select-pacer:active { transform: scale(0.98); }
    `;
    document.head.appendChild(styleEl);
  }

  function renderPranayamaTab(container) {
    let root = container;
    if (!root || !(root instanceof HTMLElement)) {
      root = document.getElementById('yoga-tab-content') || 
             document.getElementById('yoga-subview-container');
    }
    if (!root) return;

    injectPranayamaStyles();
    stopPacer();

    root.innerHTML = `
      <div class="prana-wrapper">
        <!-- БЛОК ТРЕНАЖЕРА (PACER) -->
        <div class="prana-pacer-card" id="prana-top-pacer">
          <div class="prana-pacer-header">
            <span class="prana-pacer-tag">Дыхательный тренажер</span>
            <div class="prana-header-controls">
              <button type="button" class="prana-sound-btn ${soundEnabled ? '' : 'muted'}" id="btn-sound-toggle">
                <span>${soundEnabled ? '🔔' : '🔕'}</span>
                <span>${soundEnabled ? 'Звук' : 'Без звука'}</span>
              </button>
              <span class="prana-cycles-badge" id="pacer-cycles-badge">Циклов: 0</span>
            </div>
          </div>

          <h3 id="pacer-practice-title" style="font-size: 17px; font-weight: 800; color: #ffffff; margin: 0 0 4px 0;">
            ${activePractice.nameRu}
          </h3>
          <p id="pacer-practice-desc" style="font-size: 12.5px; color: var(--text-muted, #94a3b8); margin: 0; line-height: 1.4;">
            ${activePractice.shortDesc}
          </p>

          <!-- Полоса фаз текущего ритма -->
          <div class="prana-rhythm-chips" id="pacer-rhythm-chips">
            ${renderRhythmChipsHtml(activePractice.ratio, -1)}
          </div>

          <!-- Визуальный круг в безопасном контейнере -->
          <div class="prana-circle-wrap">
            <div id="pacer-visual-circle" class="prana-visual-circle">
              <span id="pacer-phase-name" class="prana-phase-name">ГОТОВНОСТЬ</span>
              <span id="pacer-phase-seconds" class="prana-phase-seconds">4</span>
            </div>
            <div id="pacer-phase-hint" class="prana-phase-hint">
              Нажмите «Начать практику» для старта дыхательного цикла
            </div>
          </div>

          <!-- Кнопки управления -->
          <div style="display: flex; gap: 8px; margin-top: 6px;">
            <button type="button" id="btn-pacer-toggle" class="calc-btn" style="flex: 2; margin-top: 0; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);">
              Начать практику
            </button>
            <button type="button" id="btn-pacer-reset" class="calc-btn secondary-btn" style="flex: 1; margin-top: 0; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);">
              Сброс
            </button>
          </div>
        </div>

        <!-- ПОИСК И ФИЛЬТРЫ КАТЕГОРИЙ СЛОЖНОСТИ -->
        <div class="prana-search-box">
          <span class="prana-search-icon">🔍</span>
          <input 
            type="text" 
            id="prana-search-input" 
            class="prana-search-input"
            placeholder="Поиск практики (например, Нади, Квадрат)..." 
            value="${searchQuery}"
          />
          <button type="button" id="prana-search-clear" class="prana-search-clear ${searchQuery ? 'visible' : ''}">✕</button>
        </div>

        <div class="prana-chips-bar" id="prana-chips-bar">
          ${CATEGORIES.map(cat => `
            <button 
              type="button" 
              class="prana-chip-btn ${cat.id === activeCategory ? 'active' : ''}" 
              data-cat-id="${cat.id}">
              <span>${cat.label}</span>
              <span style="opacity:0.8; font-size:11px; margin-left:3px;">(${getCatCount(cat.id)})</span>
            </button>
          `).join('')}
        </div>

        <!-- СПИСОК РАСКРЫВАЮЩИХСЯ КАРТОЧЕК (АККОРДЕОН) -->
        <div id="pranayama-cards-list" style="display: flex; flex-direction: column; width: 100%;">
          ${renderPracticeCardsHtml()}
        </div>
      </div>
    `;

    setupEvents(root);
  }

  function getCatCount(catId) {
    if (catId === 'all') return PRANAYAMA_LIST.length;
    return PRANAYAMA_LIST.filter(p => p.level.toLowerCase() === catId.toLowerCase()).length;
  }

  function renderRhythmChipsHtml(ratio, activeIdx) {
    return `
      <div class="prana-rhythm-chip ${activeIdx === 0 ? 'active-phase' : ''}" id="chip-phase-0">
        <div class="prana-rhythm-chip-label" style="color: #38bdf8;">Вдох</div>
        <div class="prana-rhythm-chip-val" style="color: #38bdf8;">${ratio.inhale}с</div>
      </div>
      <div class="prana-rhythm-chip ${activeIdx === 1 ? 'active-phase' : ''}" id="chip-phase-1">
        <div class="prana-rhythm-chip-label" style="color: #8b5cf6;">Задержка</div>
        <div class="prana-rhythm-chip-val" style="color: #8b5cf6;">${ratio.holdIn}с</div>
      </div>
      <div class="prana-rhythm-chip ${activeIdx === 2 ? 'active-phase' : ''}" id="chip-phase-2">
        <div class="prana-rhythm-chip-label" style="color: #10b981;">Выдох</div>
        <div class="prana-rhythm-chip-val" style="color: #10b981;">${ratio.exhale}с</div>
      </div>
      <div class="prana-rhythm-chip ${activeIdx === 3 ? 'active-phase' : ''}" id="chip-phase-3">
        <div class="prana-rhythm-chip-label" style="color: #94a3b8;">Пауза</div>
        <div class="prana-rhythm-chip-val" style="color: #94a3b8;">${ratio.holdOut}с</div>
      </div>
    `;
  }

  function renderPracticeCardsHtml() {
    const query = searchQuery.toLowerCase().trim();
    const filtered = PRANAYAMA_LIST.filter(item => {
      const matchCat = (activeCategory === 'all') || (item.level.toLowerCase() === activeCategory.toLowerCase());
      const matchSearch = !query ||
        item.nameRu.toLowerCase().includes(query) ||
        item.nameSanskrit.toLowerCase().includes(query) ||
        item.benefits.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      return `
        <div style="text-align: center; padding: 32px 16px; color: var(--text-muted, #94a3b8);">
          <div style="font-size: 34px; margin-bottom: 6px;">🌬️</div>
          <div style="font-size: 14.5px; font-weight: 700; color: #fff;">Практики не найдены</div>
          <div style="font-size: 12.5px;">Попробуйте выбрать другую категорию</div>
        </div>
      `;
    }

    return filtered.map(item => {
      const lvlKey = item.level.toLowerCase();
      const lvlCfg = LEVEL_CONFIG[lvlKey] || LEVEL_CONFIG['базовый'];
      const isActive = item.id === activePractice.id;

      return `
        <div class="prana-card-acc ${isActive ? 'is-active-pacer' : ''}" data-pranayama-id="${item.id}">
          <div class="prana-acc-header">
            <div class="prana-acc-icon">🌬️</div>
            <div class="prana-acc-title-group">
              <h4 class="prana-acc-title">${item.nameRu}</h4>
              <div class="prana-acc-sanskrit">${item.nameSanskrit}</div>
              <div class="prana-acc-tags">
                <span class="prana-tag-level" style="color: ${lvlCfg.color}; background: ${lvlCfg.bg}; border-color: ${lvlCfg.border};">
                  ${item.level}
                </span>
                <span class="prana-tag-ratio">${item.badge}</span>
              </div>
            </div>
            <span class="prana-acc-chevron">▾</span>
          </div>

          <p class="prana-acc-short">${item.shortDesc}</p>

          <div class="prana-acc-details">
            <button type="button" class="btn-select-pacer" data-select-id="${item.id}">
              <span>⚡</span> <span>Запустить в тренажёре</span>
            </button>

            <div class="prana-detail-box">
              <div class="prana-detail-label" style="color: #38bdf8;">🎯 Пошаговая техника:</div>
              <div class="prana-detail-text" style="color: var(--text-main, #f8fafc);">
                ${item.technique.map(step => `<p style="margin: 0 0 5px 0;">${step}</p>`).join('')}
              </div>
            </div>

            <div class="prana-detail-box">
              <div class="prana-detail-label" style="color: #10b981;">🌿 Физиологический эффект:</div>
              <div class="prana-detail-text">${item.benefits}</div>
            </div>

            <div class="prana-contra-box">
              <div class="prana-detail-label" style="color: #f87171;">⚠️ Ограничения:</div>
              <div class="prana-detail-text" style="color: #fca5a5;">${item.contraindications}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function setupEvents(container) {
    const btnToggle = container.querySelector('#btn-pacer-toggle');
    const btnReset = container.querySelector('#btn-pacer-reset');
    const btnSound = container.querySelector('#btn-sound-toggle');
    const searchInput = container.querySelector('#prana-search-input');
    const clearBtn = container.querySelector('#prana-search-clear');
    const chipsBar = container.querySelector('#prana-chips-bar');

    // Переключение звука
    btnSound?.addEventListener('click', (e) => {
      e.stopPropagation();
      soundEnabled = !soundEnabled;
      if (typeof window.haptic === 'function') window.haptic('light');
      btnSound.classList.toggle('muted', !soundEnabled);
      btnSound.innerHTML = `<span>${soundEnabled ? '🔔' : '🔕'}</span><span>${soundEnabled ? 'Звук' : 'Без звука'}</span>`;
    });

    // Управление тренажером
    btnToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window.haptic === 'function') window.haptic('medium');
      if (!pacerRunning) {
        startPacer(container);
      } else {
        stopPacer();
      }
    });

    btnReset?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window.haptic === 'function') window.haptic('light');
      stopPacer();
      resetPacerUI(container);
    });

    // Живой поиск
    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearBtn) clearBtn.classList.toggle('visible', !!searchQuery);
      refreshCards(container);
    });

    clearBtn?.addEventListener('click', () => {
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      clearBtn.classList.remove('visible');
      refreshCards(container);
      searchInput?.focus();
    });

    // Скролл чипов колесом мыши
    chipsBar?.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        chipsBar.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    // Фильтрация по уровням сложности
    chipsBar?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cat-id]');
      if (!btn) return;
      if (typeof window.haptic === 'function') window.haptic('light');

      chipsBar.querySelectorAll('.prana-chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeCategory = btn.getAttribute('data-cat-id') || 'all';
      refreshCards(container);
    });

    bindAccordionCards(container);
  }

  function refreshCards(container) {
    const listEl = container.querySelector('#pranayama-cards-list');
    if (listEl) {
      listEl.innerHTML = renderPracticeCardsHtml();
      bindAccordionCards(container);
    }
  }

  function bindAccordionCards(container) {
    container.querySelectorAll('.prana-card-acc').forEach(card => {
      card.addEventListener('click', (e) => {
        const selectBtn = e.target.closest('[data-select-id]');
        if (selectBtn) {
          e.stopPropagation();
          const targetId = selectBtn.getAttribute('data-select-id');
          const found = PRANAYAMA_LIST.find(p => p.id === targetId);
          if (found) {
            selectPractice(container, found);
            container.querySelector('#prana-top-pacer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          return;
        }

        e.stopPropagation();
        if (typeof window.haptic === 'function') window.haptic('light');
        card.classList.toggle('expanded');
      });
    });
  }

  function selectPractice(container, practice) {
    activePractice = practice;
    stopPacer();
    resetPacerUI(container);

    const titleEl = container.querySelector('#pacer-practice-title');
    const descEl = container.querySelector('#pacer-practice-desc');
    const chipsEl = container.querySelector('#pacer-rhythm-chips');

    if (titleEl) titleEl.textContent = practice.nameRu;
    if (descEl) descEl.textContent = practice.shortDesc;
    if (chipsEl) chipsEl.innerHTML = renderRhythmChipsHtml(practice.ratio, -1);

    container.querySelectorAll('.prana-card-acc').forEach(c => {
      const isCurrent = c.getAttribute('data-pranayama-id') === practice.id;
      c.classList.toggle('is-active-pacer', isCurrent);
    });
  }

  function startPacer(container) {
    pacerRunning = true;
    const btnToggle = container.querySelector('#btn-pacer-toggle');
    if (btnToggle) {
      btnToggle.textContent = 'Приостановить';
      btnToggle.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    }

    currentPhaseIndex = 0;
    runNextPhase(container);
  }

  function stopPacer() {
    pacerRunning = false;
    if (activeCountdownId) {
      clearInterval(activeCountdownId);
      activeCountdownId = null;
    }

    const btnToggle = document.querySelector('#btn-pacer-toggle');
    if (btnToggle) {
      btnToggle.textContent = 'Начать практику';
      btnToggle.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)';
    }
  }

  function resetPacerUI(container) {
    completedCyclesCount = 0;
    const circle = container.querySelector('#pacer-visual-circle');
    const phaseNameEl = container.querySelector('#pacer-phase-name');
    const secEl = container.querySelector('#pacer-phase-seconds');
    const hintEl = container.querySelector('#pacer-phase-hint');
    const cyclesBadge = container.querySelector('#pacer-cycles-badge');
    const chipsEl = container.querySelector('#pacer-rhythm-chips');

    if (circle) {
      circle.style.transform = 'scale(1)';
      circle.style.borderColor = '#8b5cf6';
      circle.style.boxShadow = '0 0 24px rgba(139, 92, 246, 0.35)';
    }
    if (phaseNameEl) phaseNameEl.textContent = 'ГОТОВНОСТЬ';
    if (secEl) secEl.textContent = '4';
    if (hintEl) hintEl.textContent = 'Нажмите «Начать практику» для старта дыхательного цикла';
    if (cyclesBadge) cyclesBadge.textContent = 'Циклов: 0';
    if (chipsEl) chipsEl.innerHTML = renderRhythmChipsHtml(activePractice.ratio, -1);
  }

  function updateActiveChipPhase(phaseIndex) {
    for (let i = 0; i < 4; i++) {
      const chip = document.getElementById(`chip-phase-${i}`);
      if (chip) chip.classList.toggle('active-phase', i === phaseIndex);
    }
  }

  function runNextPhase(container) {
    if (!pacerRunning) return;

    const ratio = activePractice.ratio;
    const phases = [];

    // Безопасный масштаб: вдох = 1.18, выдох = 0.88
    if (ratio.inhale > 0) phases.push({ chipIdx: 0, name: 'ВДОХ', sec: ratio.inhale, scale: 1.18, color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', hint: 'Плавный вдох носом, расширяйте ребра и живот' });
    if (ratio.holdIn > 0) phases.push({ chipIdx: 1, name: 'ЗАДЕРЖКА', sec: ratio.holdIn, scale: 1.18, color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.5)', hint: 'Мягкая задержка на вдохе, расслабьте плечи' });
    if (ratio.exhale > 0) phases.push({ chipIdx: 2, name: 'ВЫДОХ', sec: ratio.exhale, scale: 0.88, color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', hint: 'Медленный выдох через нос, втягивайте живот' });
    if (ratio.holdOut > 0) phases.push({ chipIdx: 3, name: 'ПАУЗА', sec: ratio.holdOut, scale: 0.88, color: '#64748b', glow: 'rgba(100, 116, 139, 0.35)', hint: 'Пауза после выдоха в покое' });

    if (currentPhaseIndex >= phases.length) {
      currentPhaseIndex = 0;
      completedCyclesCount++;
      const badge = container.querySelector('#pacer-cycles-badge');
      if (badge) badge.textContent = `Циклов: ${completedCyclesCount}`;
    }

    const phase = phases[currentPhaseIndex];
    const circle = container.querySelector('#pacer-visual-circle');
    const phaseNameEl = container.querySelector('#pacer-phase-name');
    const secEl = container.querySelector('#pacer-phase-seconds');
    const hintEl = container.querySelector('#pacer-phase-hint');

    // Тактильный импульс для практики с закрытыми глазами
    if (typeof window.haptic === 'function') {
      window.haptic(phase.name === 'ВДОХ' ? 'medium' : 'light');
    }

    // Звуковой сигнал (если включен)
    if (soundEnabled) {
      playChime(phase.name === 'ВДОХ' ? 580 : (phase.name === 'ВЫДОХ' ? 440 : 500));
    }

    // Подсветка фазы в таблице ритма
    updateActiveChipPhase(phase.chipIdx);

    if (circle) {
      circle.style.transition = `transform ${phase.sec}s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s ease, box-shadow 0.4s ease`;
      circle.style.transform = `scale(${phase.scale})`;
      circle.style.borderColor = phase.color;
      circle.style.boxShadow = `0 0 28px ${phase.glow}`;
    }

    if (phaseNameEl) phaseNameEl.textContent = phase.name;
    if (hintEl) hintEl.textContent = phase.hint;

    phaseSecondsLeft = phase.sec;
    if (secEl) secEl.textContent = phaseSecondsLeft;

    if (activeCountdownId) clearInterval(activeCountdownId);

    activeCountdownId = setInterval(() => {
      if (!pacerRunning) {
        clearInterval(activeCountdownId);
        return;
      }

      phaseSecondsLeft--;
      if (secEl) secEl.textContent = phaseSecondsLeft;

      if (phaseSecondsLeft <= 0) {
        clearInterval(activeCountdownId);
        currentPhaseIndex++;
        runNextPhase(container);
      }
    }, 1000);
  }

  function playChime(freq = 520) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {}
  }

  window.renderPranayamaTab = renderPranayamaTab;
})();