/**
 * Модуль очистительных практик (Шаткармы)
 * Файл: src/modules/yoga/shatkarmas.js
 */

(function () {
  'use strict';

  const SHATKARMAS_LIST = [
    {
      id: 'trataka',
      nameRu: 'Тратака (Концентрация и зрение)',
      nameSanskrit: 'Trātaka (Бахиранга и Антаранга)',
      badge: 'Мир глазами йогов 👁️',
      level: 'Для всех',
      shortDesc: 'Фиксация взгляда на пламени свечи без моргания с последующей визуализацией. Улучшает аккомодацию глазных мышц и успокаивает ум.',
      protocol: '1. Подготовка: затемненная комната без сквозняков. Зажгите свечу на уровне глаз на расстоянии вытянутой руки (60–80 см).\n' +
                '2. Бахиранга (Внешняя Тратака): сядьте с прямой спиной. Направьте расслабленный взгляд на верхнюю треть фитиля пламени. Старайтесь не моргать до появления легкого слезотечения.\n' +
                '3. Антаранга (Внутренняя Тратака): при появлении слез мягко прикройте веки. Удерживайте остаточный светящийся образ пламени в области межбровья (Аджня чакра) как можно дольше.\n' +
                '4. Завершение: разогрейте ладони трением и выполните пальминг (мягкое прижатие теплых ладоней к закрытым глазам без давления на глазные яблоки на 1–2 минуты).',
      benefits: 'Тренирует цилиарную мышцу глаза, снимает спазм аккомодации при работе за экраном, очищает слезные каналы, стимулирует эпифиз и развивает концентрацию внимания (Дхарана).',
      contraindications: 'Острые воспалительные заболевания глаз (конъюнктивит, увеит), отслоение сетчатки, глаукома, тяжелые формы депрессии и психозов.'
    },
    {
      id: 'jala-neti',
      nameRu: 'Джала Нети (Очищение носоглотки)',
      nameSanskrit: 'Jala Neti Kriyā',
      badge: 'Гигиена дыхания',
      level: 'Базовый',
      shortDesc: 'Промывание носовых ходов теплым изотоническим солевым раствором с помощью специального чайничка (Нети-пот).',
      protocol: '1. Раствор: чистая теплая вода (36–37°C) + поваренная или морская соль без добавок из расчета 1 чайная ложка (без горки) на 500 мл воды (строго изотоническая концентрация 0.9%).\n' +
                '2. Положение: наклон над раковиной под углом 45°, голова наклонена вбок, подбородок слегка прижат к груди. Дыхание непрерывно осуществляется через открытый рот!\n' +
                '3. Процесс: носик Нети-пота плотно прижимается к верхней ноздре. Вода самотеком вливается в нее и вытекает через нижнюю ноздрю. Вылейте по 200–250 мл на каждую сторону.\n' +
                '4. Обязательная сушка носа: встаньте прямо, наклонитесь вперед и выполните серию мягких резких выдохов носом в разные стороны. Вода не должна остаться в лобных и гайморовых пазухах!',
      benefits: 'Удаляет аллергены, бактериальную слизь и пыль, стимулирует реснитчатый эпителий, восстанавливает носовое дыхание, снижает риск простуд.',
      contraindications: 'Острый отит, частые носовые кровотечения, полная механическая непроходимость носовых ходов (полипы, выраженное искривление перегородки).'
    },
    {
      id: 'nauli',
      nameRu: 'Наули (Волна животом)',
      nameSanskrit: 'Nauli Kriyā',
      badge: 'Массаж внутренних органов',
      level: 'Продвинутый',
      shortDesc: 'Вращение и изоляция прямых мышц живота на фоне вакуумного втягивания брюшной стенки (Уддияна Бандха).',
      protocol: '1. Выполняется строго утром натощак (после стакана теплой воды и опорожнения кишечника).\n' +
                '2. Исходное положение: поза рыбака (ноги шире плеч, колени согнуты, ладони упираются в бедра чуть выше коленей, корпус наклонен).\n' +
                '3. Этап 1: полный глубокий выдох, задержка дыхания, втягивание живота под ребра (вакуум — Уддияна Бандха).\n' +
                '4. Этап 2 (Мадхьяма Наули): перенося вес на бедра, напрягите и вытолкните вперед центральный жгут прямых мышц живота.\n' +
                '5. Этап 3 (Вращение): перенося упор на левую руку, изолируйте левый жгут (Вама Наули), затем на правую руку (Дакшина Наули), создавая круговую волну.',
      benefits: 'Глубокий висцеральный самомассаж, ликвидация венозного застоя в малом тазу, стимуляция перистальтики кишечника, повышение тонуса блуждающего нерва.',
      contraindications: 'Беременность, менструация, язва желудка и 12-перстной кишки в период обострения, камни в желчном пузыре, пупочная грыжа.'
    },
    {
      id: 'agnisara',
      nameRu: 'Агнисара Дхаути (Огненное дыхание)',
      nameSanskrit: 'Agnisāra Dhauti Kriyā',
      badge: 'Огонь пищеварения',
      level: 'Базовый / Средний',
      shortDesc: 'Ритмичные пульсации брюшной стенкой на задержке дыхания после полного выдоха.',
      protocol: '1. Исходное положение: стоя с упором руками в бедра или сидя в Ваджрасане (на пятках).\n' +
                '2. Сделайте спокойный вдох через нос, затем полный выдох через рот со звуком «Ха-а-а».\n' +
                '3. Задержите дыхание на выдохе (Бахья Кумбхака).\n' +
                '4. На задержке дыхания ритмично и быстро втягивайте и выпячивайте живот вперед-назад (от 15 до 30 движений за одну задержку).\n' +
                '5. Мягко расслабьте живот и сделайте медленный спокойный вдох.\n' +
                '6. Выполните 3–5 подходов с перерывом на восстановление дыхания.',
      benefits: 'Разжигает огонь пищеварения (Джатарагни), ликвидирует вялость кишечника, активизирует кровоток в печени и поджелудочной железе, укрепляет поперечную мышцу живота.',
      contraindications: 'Острые боли в животе, гастрит в стадии обострения, гипертония, сердечные патологии, беременность.'
    },
    {
      id: 'vamana-dhauti',
      nameRu: 'Вамана Дхаути (Кунджала Крия)',
      nameSanskrit: 'Vamana Dhauti (Kunjal)',
      badge: 'Детоксикация ЖКТ',
      level: 'Средний',
      shortDesc: 'Очищение пищевода и желудка быстрым питьем теплой подсоленной воды с последующим ее рефлекторным опорожнением.',
      protocol: '1. Утром натощак приготовьте 1.5–2 литра теплой кипяченой воды (37–39°C) с добавлением 1 чайной ложки соли на литр.\n' +
                '2. Стоя пейте воду стакан за стаканом быстро и непрерывно, пока не возникнет ощущение переполнения желудка (обычно 4–6 стаканов).\n' +
                '3. Наклонитесь над раковиной под углом 90°, сомкните стопы, прижмите левую ладонь к низу живота.\n' +
                '4. Указательным и средним пальцами правой руки мягко коснитесь корня языка, вызывая рефлекторный выход воды без напряжения горла.\n' +
                '5. Вода выходит легко и чистыми порциями. После завершения отдохните 20–30 минут, первый прием пищи — через 40 минут.',
      benefits: 'Устраняет избыточную кислотность, застойную желчь и слизь из верхних отделов ЖКТ, уменьшает изжогу, снимает спазмы бронхов.',
      contraindications: 'Язва желудка, варикозное расширение вен пищевода, гипертоническая болезнь высокой степени, грыжа пищеводного отверстия диафрагмы.'
    },
    {
      id: 'kapalabhati-kriya',
      nameRu: 'Капалабхати (Крия)',
      nameSanskrit: 'Kapālabhāti Kriyā',
      badge: 'Вентиляция легких',
      level: 'Базовый',
      shortDesc: 'Очищение дыхательных путей и лобных пазух серией резких выдохов носом за счет рефлекторного толчка диафрагмы.',
      protocol: '1. Сядьте с прямой спиной в устойчивую позу (Сукхасана, Падмасана).\n' +
                '2. Выполните 3 серии по 36, 54 или 108 резких выдохов носом.\n' +
                '3. Акцент исключительно на выдохе (активное втягивание низа живота). Вдох происходит автоматически.\n' +
                '4. После каждой серии выполняется глубокий вдох, комфортная задержка дыхания и мягкий плавный выдох.',
      benefits: 'Удаляет застойный воздух из легких, очищает носовые рецепторы, тонизирует кору больших полушарий головного мозга.',
      contraindications: 'Внутричерепная гипертензия, глаукома, отслоение сетчатки, эпилепсия, грыжи.'
    }
  ];

  function renderShatkarmasTab(container) {
    const root = container || 
                 document.getElementById('yoga-tab-content') || 
                 document.getElementById('yoga-subview-container');
    if (!root) return;

    root.innerHTML = `
      <!-- Промо-карточка Trataka & Мир глазами йогов -->
      <div class="card promo-hero-card" style="
        margin: 0 0 16px 0; 
        border: 1px solid rgba(139, 92, 246, 0.35); 
        background: linear-gradient(135deg, rgba(17, 14, 38, 0.95) 0%, rgba(30, 21, 64, 0.95) 100%);
        border-radius: 18px;
        padding: 16px;
      ">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span style="font-size: 18px;">✨</span>
          <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #c4b5fd; letter-spacing: 0.5px;">
            Научные труды автора
          </span>
        </div>
        <h3 style="font-size: 17px; font-weight: 800; color: #ffffff; margin: 0 0 4px 0;">МИР ГЛАЗАМИ ЙОГОВ</h3>
        <p style="font-size: 12.5px; color: #cbd5e1; line-height: 1.45; margin: 0 0 12px 0;">
          Внешняя и внутренняя тратака. Комплекс авторских упражнений для восстановления зрения и профилактики астенопии.
        </p>
        <button type="button" id="btn-open-trataka-card" class="calc-btn" style="
          width: 100%; 
          margin-top: 0; 
          padding: 10px 16px; 
          font-size: 13.5px; 
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
        ">
          👁️ Изучить протокол Тратаки
        </button>
      </div>

      <!-- Заголовок каталога очистительных практик -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 0 2px;">
        <h3 style="font-size: 15px; font-weight: 800; color: var(--text-main, #f8fafc); margin: 0;">Классические Шаткармы</h3>
        <span style="font-size: 11.5px; color: var(--text-muted, #94a3b8);">${SHATKARMAS_LIST.length} практик</span>
      </div>

      <!-- Список карточек Шаткарм -->
      <div class="items-list" id="shatkarmas-list-container" style="display: flex; flex-direction: column; gap: 10px;"></div>
    `;

    renderShatkarmasCards(root);

    const btnTrataka = root.querySelector('#btn-open-trataka-card');
    if (btnTrataka) {
      btnTrataka.addEventListener('click', () => {
        if (typeof window.haptic === 'function') window.haptic('light');
        const tratakaItem = SHATKARMAS_LIST.find(i => i.id === 'trataka');
        if (tratakaItem) showShatkarmaDetailModal(tratakaItem);
      });
    }
  }

  function renderShatkarmasCards(container) {
    const listEl = container.querySelector('#shatkarmas-list-container');
    if (!listEl) return;

    listEl.innerHTML = SHATKARMAS_LIST.map(item => `
      <div class="card feature-item-card" data-shatkarma-id="${item.id}" style="
        cursor: pointer; 
        padding: 14px; 
        margin-bottom: 0;
        border: 1px solid var(--border-card, rgba(255,255,255,0.08));
        background: var(--bg-card, #1e293b);
        border-radius: 14px;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: transform 0.15s ease, border-color 0.2s ease;
      ">
        <div style="
          width: 40px; height: 40px; border-radius: 10px; 
          background: rgba(139, 92, 246, 0.18); 
          border: 1px solid rgba(139, 92, 246, 0.35); 
          display: flex; align-items: center; justify-content: center; 
          font-size: 20px; flex-shrink: 0;
        ">✨</div>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 2px;">
            <span style="font-size: 14px; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${item.nameRu}
            </span>
            <span style="font-size: 10px; font-weight: 700; background: rgba(139,92,246,0.22); color: #c4b5fd; padding: 2px 7px; border-radius: 999px; white-space: nowrap;">
              ${item.badge}
            </span>
          </div>
          <div style="font-size: 11.5px; font-style: italic; color: #c4b5fd; margin-bottom: 4px;">
            ${item.nameSanskrit}
          </div>
          <p style="font-size: 12px; color: var(--text-muted, #94a3b8); margin: 0; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${item.shortDesc}
          </p>
        </div>
        <div style="color: #8b5cf6; font-size: 18px; font-weight: 700; margin-left: 4px;">›</div>
      </div>
    `).join('');

    listEl.querySelectorAll('.feature-item-card').forEach(card => {
      card.addEventListener('click', () => {
        if (typeof window.haptic === 'function') window.haptic('light');
        const id = card.getAttribute('data-shatkarma-id');
        const found = SHATKARMAS_LIST.find(s => s.id === id);
        if (found) showShatkarmaDetailModal(found);
      });
    });
  }

  function showShatkarmaDetailModal(item) {
    let modal = document.getElementById('shatkarma-detail-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'shatkarma-detail-modal';
      modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.65); display: flex; align-items: flex-end;
        z-index: 10000; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
      `;
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="
        background: var(--bg-card, #1e293b); width: 100%; max-height: 85vh; 
        border-top-left-radius: 20px; border-top-right-radius: 20px; 
        padding: 20px; overflow-y: auto; box-sizing: border-box; position: relative;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.1);
      ">
        <button id="close-shatkarma-modal" style="
          position: absolute; top: 16px; right: 16px; border: none; 
          background: rgba(255, 255, 255, 0.1); color: #fff; width: 32px; height: 32px; 
          border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        ">✕</button>

        <div style="background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.35); padding: 14px; border-radius: 14px; margin-bottom: 14px;">
          <div style="font-size: 18px; font-weight: 800; color: #ffffff;">${item.nameRu}</div>
          <div style="font-size: 13px; font-style: italic; color: #c4b5fd; margin-top: 2px;">${item.nameSanskrit}</div>
          <div style="display: flex; gap: 8px; margin-top: 10px;">
            <span style="font-size: 11px; font-weight: 700; background: #8b5cf6; color: #fff; padding: 3px 8px; border-radius: 6px;">${item.level}</span>
            <span style="font-size: 11px; font-weight: 700; background: rgba(255,255,255,0.1); color: #e2e8f0; padding: 3px 8px; border-radius: 6px;">${item.badge}</span>
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.25); padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 12px;">
          <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #38bdf8; margin-bottom: 6px;">
            🎯 Пошаговый протокол выполнения:
          </div>
          <div style="font-size: 13px; color: var(--text-main, #f8fafc); line-height: 1.55;">
            ${item.protocol.split('\n').map(line => `<p style="margin: 0 0 6px 0;">${line}</p>`).join('')}
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.25); padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 12px;">
          <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #10b981; margin-bottom: 6px;">
            🌿 Физиологическое действие и терапия:
          </div>
          <div style="font-size: 13px; color: var(--text-muted, #94a3b8); line-height: 1.5;">
            ${item.benefits}
          </div>
        </div>

        <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 12px 14px; border-radius: 8px;">
          <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #f87171; margin-bottom: 4px;">
            ⚠️ Противопоказания и ограничения:
          </div>
          <div style="font-size: 12.5px; color: #fca5a5; line-height: 1.45;">
            ${item.contraindications}
          </div>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    modal.querySelector('#close-shatkarma-modal')?.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  // Экспорт функции в глобальную область видимости
  window.renderShatkarmasTab = renderShatkarmasTab;
})();