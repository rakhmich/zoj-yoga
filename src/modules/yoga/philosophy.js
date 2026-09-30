/**
 * МОДУЛЬ ФИЛОСОФИИ ЙОГИ (ЕДИНЫЙ СТИЛЬ, АНАТОМИЧЕСКИЕ ЧАКРЫ, КЛИКАБЕЛЬНЫЕ АСАНЫ)
 * Файл: src/modules/yoga/philosophy.js
 */

(function () {
  'use strict';

  const PHILOSOPHY_DATA = {
    // 1. ЯМА И НИЯМА (Единая нумерация, санскрит мягким акцентом)
    yama: [
      {
        num: '1',
        nameRu: 'Ахимса (Ненасилие)',
        sanskrit: 'Ahiṃsā',
        short: 'Отказ от причинения вреда действием, словом и мыслью.',
        full: 'Фундамент всей практики. На физическом уровне — отказ от форсирования асан через боль, бережное отношение к связкам и суставам. На ментальном — устранение самоедства, токсичной критики и внутреннего гнева.'
      },
      {
        num: '2',
        nameRu: 'Сатья (Правдивость)',
        sanskrit: 'Satya',
        short: 'Честность перед собой и отсутствие иллюзий.',
        full: 'Трезвая оценка своих возможностей на коврике без эгоистичного желания «дотянуться любой ценой». Правда всегда согласуется с ненасилием и не должна нести разрушения.'
      },
      {
        num: '3',
        nameRu: 'Астея (Неприсвоение чужого)',
        sanskrit: 'Asteya',
        short: 'Свобода от зависти, чужих заслуг и чужого времени.',
        full: 'Искореняет привычку сравнивать себя с другими практиками в зале. Внимание удерживается исключительно на личном дыхании, проприоцепции и ощущениях в теле.'
      },
      {
        num: '4',
        nameRu: 'Брахмачарья (Умеренность)',
        sanskrit: 'Brahmacarya',
        short: 'Контроль чувств и сохранение витальной энергии (Оджаса).',
        full: 'Осознанный расход сил, отказ от растраты энергии на импульсивные излишества. Направление сохраненных ресурсов в регулярные тренировки, ясность ума и творчество.'
      },
      {
        num: '5',
        nameRu: 'Апариграха (Нестяжательство)',
        sanskrit: 'Aparigraha',
        short: 'Свобода от накопительства, ожиданий и эмоциональных привязок.',
        full: 'Умение отпускать ожидания мгновенной гибкости или внешнего признания. Освобождение сознания от ментального хлама и фоновой тревожности.'
      }
    ],
    niyama: [
      {
        num: '1',
        nameRu: 'Шауча (Чистота)',
        sanskrit: 'Śauca',
        short: 'Внутренняя и внешняя гигиена тела, чистота мыслей и пространства.',
        full: 'Включает физиологическую чистоту, сбалансированное питание, информационный детокс ума и регулярное очищение внутренних органов через крии (шаткармы).',
        action: { text: 'Практики очищения (Шаткармы)', icon: '🌊', subview: 'shatkarmas' },
        actionAlwaysVisible: true
      },
      {
        num: '2',
        nameRu: 'Сантоша (Удовлетворенность)',
        sanskrit: 'Saṃtoṣa',
        short: 'Принятие настоящего момента и душевный покой.',
        full: 'Способность удерживать эмоциональный баланс при любых внешних колебаниях. Отсутствие сопротивления реальности сберегает колоссальный запас сил.'
      },
      {
        num: '3',
        nameRu: 'Тапас (Самодисциплина)',
        sanskrit: 'Tapas',
        short: '«Огонь» регулярности, преодоление лени и инерции.',
        full: 'Волевой импульс каждый день расстилать коврик, соблюдать режим дня и преодолевать внутренний саботаж ради качественного прогресса.'
      },
      {
        num: '4',
        nameRu: 'Свадхьяя (Самопознание)',
        sanskrit: 'Svādhyāya',
        short: 'Изучение первоисточников и исследование реакций ума.',
        full: 'Анализ работы сознания через чтение авторитетных трактатов («Йога-Сутры», «Хатха-Йога Прадипика») и постоянное самоисследование.',
        action: { text: 'Первоисточники в Библиотеке', icon: '📚', subview: 'library' },
        actionAlwaysVisible: true
      },
      {
        num: '5',
        nameRu: 'Ишвара Пранидхана (Доверие)',
        sanskrit: 'Īśvarapraṇidhāna',
        short: 'Преданность пути и отказ от эгоцентрического контроля.',
        full: 'Самоотдача процессу при спокойном принятии любого результата. Устранение гордыни (Ахамкары).'
      }
    ],

    // 2. СТУПЕНИ ХАТХА-ЙОГИ
    hathaStages: [
      {
        step: '1',
        title: 'Асана (Āsana)',
        badge: 'ФИЗИЧЕСКИЙ БАЗИС',
        short: 'Устойчивое положение тела, избавление от телесной инертности и болезней.',
        full: `
          <div class="ph-term-row">
            <div><span class="ph-term">Стхайрья</span> — непоколебимая устойчивость и стабильность позы.</div>
            <div><span class="ph-term">Арогья</span> — избавление тела от болезней и застойных зон.</div>
            <div><span class="ph-term">Лагава</span> — ощущение телесной невесомости, подвижности и легкости.</div>
          </div>
          В Хатха-йоге асана устраняет мышечные зажимы, выравнивает ось позвоночника и балансирует сосудистый тонус. Тело перестает отвлекать ум болевыми сигналами, превращаясь в надежный сосуд для праны.
        `,
        action: { text: 'Открыть Каталог асан', icon: '🧘', subview: 'asanas' },
        actionAlwaysVisible: false
      },
      {
        step: '2',
        title: 'Кумбхака и Пранаяма (Prāṇāyāma)',
        badge: 'ЭНЕРГЕТИЧЕСКИЙ МОСТ',
        short: 'Осознанное управление дыханием и задержка (Кумбхака) для распределения энергии.',
        full: `
          <div class="ph-term-row">
            <div><span class="ph-term">Прана</span> — витальная жизненная энергия дыхания.</div>
            <div><span class="ph-term">Кумбхака</span> — задержка дыхания (Антара — на вдохе, Бахья — на выдохе).</div>
            <div><span class="ph-term">Ида и Пингала</span> — лунный (торможение) и солнечный (активация) каналы ВНС.</div>
            <div><span class="ph-term">Нади</span> — сеть 72 000 энергетических каналов.</div>
          </div>
          «Пока движется дыхание — блуждает ум. С прекращением дыхания достигается неподвижность ума». Пранаяма выравнивает вегетативную нервную систему и очищает нади.
        `,
        action: { text: 'Запустить Дыхательный тренажер', icon: '🌬️', subview: 'pranayama' },
        actionAlwaysVisible: false
      },
      {
        step: '3',
        title: 'Мудры и Бандхи (Mudrā & Bandha)',
        badge: 'ЭНЕРГЕТИЧЕСКИЕ ЗАМКИ',
        short: 'Запечатывание энергии и направление праны в осевой канал позвоночника.',
        full: `
          <div class="ph-term-row">
            <div><span class="ph-term">Мула-бандха</span> — корневой замок (мышцы промежности и тазового дна).</div>
            <div><span class="ph-term">Уддияна-бандха</span> — брюшной вакуум (подтягивание диафрагмы вверх под ребра).</div>
            <div><span class="ph-term">Джаландхара-бандха</span> — горловой замок (подбородок в яремную впадину).</div>
            <div><span class="ph-term">Сушумна</span> — центральный осевой энергетический канал.</div>
          </div>
          Бандхи блокируют утечку энергии наружу, направляя аккумулированную прану вверх вдоль позвоночника и пробуждая потенциал Кундалини.
        `
      },
      {
        step: '4',
        title: 'Нада-анусандхана и Самадхи (Nāda)',
        badge: 'РАСТВОРЕНИЕ УМА (ЛАЙЯ)',
        short: 'Концентрация на внутреннем звуке сердца и растворение ментальных колебаний.',
        full: `
          <div class="ph-term-row">
            <div><span class="ph-term">Анахата-нада</span> — внутренний тонкий звук в сердце, возникающий без соударения.</div>
            <div><span class="ph-term">Лайя</span> — состояние растворения эго в первоисточнике сознания.</div>
            <div><span class="ph-term">Унмани</span> — абсолютная ментальная тишина за пределами слов.</div>
          </div>
          Внимая внутреннему резонансу, ум освобождается от власти внешних раздражителей. Исчезает дуальность «я» и «мир», наступает состояние чистого Самадхи.
        `
      }
    ],

    // 3. РАДЖА-ЙОГА
    rajaLimbs: [
      {
        step: '5',
        name: 'Пратьяхара',
        sanskrit: 'Pratyāhāra',
        badge: 'Сенсорный детокс',
        iconSvg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#c084fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/><path d="M12 9v1m0 4v1"/></svg>`,
        desc: 'Сворачивание органов чувств внутрь, подобно тому как черепаха втягивает лапы в панцирь. Сознание отключается от внешнего шума и информационного фона.'
      },
      {
        step: '6',
        name: 'Дхарана',
        sanskrit: 'Dhāraṇā',
        badge: 'Фокус внимания',
        iconSvg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#c084fc" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="#c084fc"/></svg>`,
        desc: 'Непреклонная фиксация внимания на одном объекте (дыхание на кончике носа, пламя свечи в Тратаке, мантра). Ум превращается в сфокусированный луч.'
      },
      {
        step: '7',
        name: 'Дхьяна',
        sanskrit: 'Dhyāna',
        badge: 'Поток осознанности',
        iconSvg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#c084fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 8v5M8 10c-2 2-2 4-2 6h12c0-2 0-4-2-6M6 19h12"/></svg>`,
        desc: 'Непрерывный и плавный поток созерцания объекта без напряжения воли, словно ровная струя масла. Стирается граница между наблюдателем и наблюдаемым.'
      },
      {
        step: '8',
        name: 'Самадхи',
        sanskrit: 'Samādhi',
        badge: 'Вершина йоги',
        iconSvg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#c084fc" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9" stroke-dasharray="2 3"/><path d="M12 3v3m0 12v3M3 12h3m12 0h3"/><circle cx="12" cy="12" r="3" fill="#c084fc"/></svg>`,
        desc: 'Состояние полного слияния с Абсолютом. Освобождение от иллюзий эго, выход за пределы времени и осознание своей подлинной духовной природы (Пуруши).'
      }
    ],

    // 4. ТРИ ГУНЫ (Спокойное благородное оформление)
    gunas: [
      {
        id: 'sattva',
        name: 'Саттва (Чистота и Ясность)',
        sanskrit: 'Sattva Guṇa',
        symbolSvg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/></svg>`,
        color: '#10b981',
        short: 'Состояние легкости, кристальной ясности ума, доброжелательности и гармонии.',
        mind: 'Спокойный ум, способный к глубокому анализу, искреннему состраданию и объективному видению без предвзятости.',
        foods: ['Спелые фрукты', 'Зеленые овощи и зелень', 'Топленое масло Гхи', 'Миндаль и орехи', 'Бурый рис', 'Чистая вода и мед'],
        foodDesc: 'Пища легкая, сочная, свежеприготовленная, не отягощающая ЖКТ и дарящая чистую жизненную силу.',
        practice: 'Осознанные отстройки поз, ровное непрерывное дыхание, отсутствие эго-соперничества, медитативная тишина.',
        balanceRule: 'Поддерживается ранним подъемом, медитацией, чтением первоисточников и благодарностью.'
      },
      {
        id: 'rajas',
        name: 'Раджас (Страсть и Движение)',
        sanskrit: 'Rajas Guṇa',
        symbolSvg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c-3 4-6 7.5-6 11a6 6 0 0 0 12 0c0-3.5-3-7-6-11z"/></svg>`,
        color: '#f59e0b',
        short: 'Энергия действий, амбиций, соперничества, нетерпения и жажды признания.',
        mind: 'Беспокойный, суетливый ум. Постоянная спешка, жажда обладания результатами, тревожность и раздражительность.',
        foods: ['Кофе и энергетики', 'Острый перец чили', 'Чеснок и лук', 'Ферментированные соусы', 'Горький шоколад'],
        foodDesc: 'Пища горячая, острая, возбуждающая нервную систему и стимулирующая выброс адреналина.',
        practice: 'Стремление форсировать асаны через силу, перенапряжение мышц лица, задержки дыхания от натуживания, риск травм.',
        balanceRule: 'Снижается замедлением темпа, плавными наклонами вперед, охлаждающими пранаямами (Ситали, Нади Шодхана).'
      },
      {
        id: 'tamas',
        name: 'Тамас (Инерция и Покой)',
        sanskrit: 'Tamas Guṇa',
        symbolSvg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18h16M6 14h12M8 10h8"/></svg>`,
        color: '#94a3b8',
        short: 'Качество тяжести, лени, инерции, апатии, сонливости и консерватизма.',
        mind: 'Затуманенное сознание, прокрастинация, иллюзии, упрямство и поиск оправданий для бездействия.',
        foods: ['Фастфуд и жареное', 'Мясные полуфабрикаты', 'Вчерашняя подогретая еда', 'Алкоголь', 'Рафинированный сахар'],
        foodDesc: 'Пища тяжелая, несвежая, бедная праной, вызывающая тяжесть в теле и сонливость.',
        practice: 'Пропуск занятий, засыпание во время Шавасаны, вялость суставов, отсутствие мышечного тонуса.',
        balanceRule: 'Преодолевается активной разминкой (Сурья Намаскар), форсированным дыханием (Капалабхати) и контрастным душем.'
      }
    ],

    // 5. ЧАКРЫ (Массив рекомендуемых асан для интерактивного перехода)
    chakras: [
      {
        num: '1',
        nameRu: 'Муладхара (Корневая чакра)',
        sanskrit: 'Mūlādhāra',
        element: 'Земля',
        color: '#ef4444',
        bija: 'ЛАМ',
        posPercent: 88,
        location: 'Основание позвоночника, область промежности',
        nervePlexus: 'Копчиковое нервное сплетение',
        endocrineGland: 'Надпочечники (адреналин и кортизол)',
        short: 'Базовая безопасность, укоренение, связь с физическим телом и инстинкт выживания.',
        full: 'Фундамент всей энергетической структуры. В гармонии дарует физическую выносливость, отсутствие фоновых страхов и устойчивость к кризисам. При дисбалансе — панические атаки, жадность, слабость опорно-двигательного аппарата.',
        asanas: ['Тадасана', 'Врикшасана', 'Вирабхадрасана I', 'Маласана', 'Уткатасана'],
        pranayamaAction: 'Корневой замок (Мула-бандха), брюшное дыхание с фиксацией опоры стоп.'
      },
      {
        num: '2',
        nameRu: 'Свадхистхана (Сакральная чакра)',
        sanskrit: 'Svādhiṣṭhāna',
        element: 'Вода',
        color: '#f97316',
        bija: 'ВАМ',
        posPercent: 75,
        location: 'Низ живота, на 3-4 см ниже пупка (крестец)',
        nervePlexus: 'Крестцовое сплетение, тазовые нервы',
        endocrineGland: 'Гонады (половые железы)',
        short: 'Творчество, чувственность, эмоциональная гибкость и радость жизни.',
        full: 'Отвечает за текучесть, адаптивность к переменам и циркуляцию жидкостей в теле. В гармонии пробуждает творческую искру и радость. При блокировке — чувство вины, эмоциональная ригидность, потеря вкуса к жизни.',
        asanas: ['Баддха Конасана', 'Упавиштха Конасана', 'Супта Баддха Конасана'],
        pranayamaAction: 'Плавное волновое дыхание животом, гармонизирующая Нади Шодхана.'
      },
      {
        num: '3',
        nameRu: 'Манипура (Солнечное сплетение)',
        sanskrit: 'Maṇipūra',
        element: 'Огонь',
        color: '#eab308',
        bija: 'РАМ',
        posPercent: 62,
        location: 'Область солнечного сплетения, выше пупка',
        nervePlexus: 'Чревное (солнечное) сплетение',
        endocrineGland: 'Поджелудочная железа (инсулин), печень',
        short: 'Сила воли, метаболический огонь (Джатарагни), уверенность и лидерство.',
        full: 'Центральный реактор организма. Управляет усвоением нутриентов и ментальной информации. В балансе дарует волю, харизму и умение отстаивать границы. При нарушении — неуверенность в себе, язвенные процессы ЖКТ, раздражительность.',
        asanas: ['Парипурна Навасана', 'Паривритта Триконасана', 'Дханурасана'],
        pranayamaAction: 'Капалабхати, Бхастрика, Агнисара Дхаути, Уддияна Бандха.'
      },
      {
        num: '4',
        nameRu: 'Анахата (Сердечная чакра)',
        sanskrit: 'Anāhata',
        element: 'Воздух',
        color: '#10b981',
        bija: 'ЯМ',
        posPercent: 49,
        location: 'Центр грудины, уровень физического сердца',
        nervePlexus: 'Сердечное сплетение (Plexus Cardiacus)',
        endocrineGland: 'Тимус (вилочковая железа, иммунитет)',
        short: 'Безусловная любовь, сострадание, принятие, баланс материального и духовного.',
        full: 'Связующий мост между нижними физическими и верхними ментальными центрами. В сбалансированном состоянии дарует глубокую эмпатию, эмоциональную зрелость и снятие спазмов грудной клетки. В дисбалансе — обидчивость, сутулость.',
        asanas: ['Бхуджангасана', 'Сету Бандхасана', 'Гомукхасана', 'Матсиасана'],
        pranayamaAction: 'Полное трехфазное дыхание йогов, акустический ориентир 432 Гц.'
      },
      {
        num: '5',
        nameRu: 'Вишудха (Горловая чакра)',
        sanskrit: 'Viśuddha',
        element: 'Эфир (Акаша)',
        color: '#06b6d4',
        bija: 'ХАМ',
        posPercent: 36,
        location: 'Основание шеи, область щитовидного хряща',
        nervePlexus: 'Глоточное и гортанное нервные сплетения',
        endocrineGland: 'Щитовидная и паращитовидные железы',
        short: 'Самовыражение, искренность, творческий голос, аутентичность и чистота речи.',
        full: 'Центр очищения: здесь яд иллюзий трансформируется в нектар ясности. Отвечает за способность транслировать свои мысли миру и говорить правду. При блокировке — спазм голосовых связок, болезни щитовидной железы, страх выступлений.',
        asanas: ['Сарвангасана', 'Халасана', 'Матсиасана', 'Симхасана'],
        pranayamaAction: 'Удджайи (дыхание прибоя), Джаландхара-бандха, Бхрамари.'
      },
      {
        num: '6',
        nameRu: 'Аджна («Третий глаз»)',
        sanskrit: 'Ājñā',
        element: 'Разум (Манас)',
        color: '#6366f1',
        bija: 'ОМ',
        posPercent: 23,
        location: 'Область межбровья, глубина центра черепа',
        nervePlexus: 'Кавернозное сплетение, зрительные тракты мозга',
        endocrineGland: 'Гипофиз (главный регулятор эндокринной системы)',
        short: 'Интуиция, проницательность, образное мышление, власть над блуждающим умом.',
        full: 'Командный пункт энергоинформационной структуры, место слияния каналов Иды, Пингалы и Сушумны. В гармонии открывает ясное видение и концентрацию. При дисбалансе — мигрени, бессонница от хаотичных мыслей.',
        asanas: ['Адхо Мукха Шванасана', 'Врикшасана', 'Падангуштхасана'],
        pranayamaAction: 'Тратака (фиксация взгляда на пламени свечи), Нади Шодхана с паузой.'
      },
      {
        num: '7',
        nameRu: 'Сахасрара (Коронная чакра)',
        sanskrit: 'Sahasrāra',
        element: 'Чистое Сознание',
        color: '#c084fc',
        bija: 'СО-ХАМ',
        posPercent: 10,
        location: 'Область родничка, макушка головы',
        nervePlexus: 'Кора больших полушарий головного мозга',
        endocrineGland: 'Эпифиз (шишковидная железа, выработка мелатонина)',
        short: 'Высшая осознанность, единение с мирозданием, освобождение от оков эго.',
        full: 'Тысячелепестковый венчающий лотос за пределами материальной проявленности. Символизирует слияние индивидуального сознания с космическим океаном Бытия. Финальная цель йоги (Самадхи / Мокша).',
        asanas: ['Ширшасана', 'Падмасана', 'Сиддхасана', 'Шавасана'],
        pranayamaAction: 'Дхьяна (беспредметное созерцание), непрерывное удержание роли Свидетеля.'
      }
    ],

    // 6. ДОКАЗАТЕЛЬНАЯ БАЗА
    evidence: [
      {
        id: 'ev-neuro',
        icon: '🧠',
        badge: 'Нейробиология',
        title: 'Медитация и реорганизация коры головного мозга',
        meta: 'Гарвардская медицинская школа (Исследования Сары Лазар & Nature Neuroscience)',
        short: 'МРТ-сканирование подтверждает физическое изменение объема серого вещества за 8 недель практики.',
        full: `
          Продольные исследования с использованием высокопольного МРТ зафиксировали следующие сдвиги:<br><br>
          • <strong>Утолщение серого вещества в гиппокампе:</strong> зона мозга, ответственная за долговременную память, эмоциональную саморегуляцию и пространственную ориентацию.<br>
          • <strong>Редукция объема амигдалы:</strong> центра тревоги и паники. Уменьшение серого вещества в этой зоне прямо коррелирует со снижением субъективного стресса.<br>
          • <strong>Подавление Default Mode Network (DMN):</strong> сеть пассивного режима работы мозга отвечает за руминацию и самокритику. Медитация снижает её гиперактивность.
        `
      },
      {
        id: 'ev-vagus',
        icon: '🫀',
        badge: 'Кардиология и ВНС',
        title: 'Тонус блуждающего нерва и вариабельность ритма сердца (HRV)',
        meta: 'Поливагальная теория Стивена Порджеса & Journal of Cardiology',
        short: 'Ритмическое медленное дыхание (5.5–6 циклов в минуту) стимулирует парасимпатику и регенерацию.',
        full: `
          Дыхательные техники пранаямы вызывают выраженный кардиопротективный отклик через блуждающий нерв (Nervus Vagus):<br><br>
          • <strong>Рост вариабельности сердечного ритма (HRV):</strong> свидетельствует о гибкости сердечно-сосудистой адаптации и преобладании восстановительных процессов.<br>
          • <strong>Синхронизация барорефлекса:</strong> при удлинении выдоха относительно вдоха раздражение барорецепторов сонной артерии замедляет пульс и купирует тревожность.<br>
          • <strong>Дыхательная синусовая аритмия:</strong> гармонизация фаз вентиляции снижает метаболические энергозатраты миокарда на 15–20%.
        `
      },
      {
        id: 'ev-hormones',
        icon: '🧬',
        badge: 'Эндокринология',
        title: 'Биохимия стресса, ГАМК (GABA) и нейрогенез (BDNF)',
        meta: 'Бостонский университет медицины & Журнал Psychoneuroendocrinology',
        short: 'Системная практика асан снижает базальный кортизол и поднимает тормозные нейромедиаторы спокойствия.',
        full: `
          В клинических исследованиях выявлено:<br><br>
          • <strong>Всплеск ГАМК (GABA) на 27%:</strong> тренировка по хатха-йоге увеличивает уровень гамма-аминомасляной кислоты — главного тормозного нейромедиатора ЦНС, защищающего мозг от тревоги.<br>
          • <strong>Нормализация циркадного кортизола:</strong> вечерние расслабляющие комплексы и пранаямы предотвращают гиперсекрецию гормонов надпочечников.<br>
          • <strong>Повышение BDNF:</strong> стимуляция роста новых синаптических связей и ускорение восстановления после переутомления.
        `
      },
      {
        id: 'ev-fascia',
        icon: '⚡',
        badge: 'Биомеханика',
        title: 'Механотрансдукция фасциальной ткани и лимфоотток',
        meta: 'Институт фасциальных исследований Ульма (Роберт Шляйп, Томас Майерс)',
        short: 'Статическое вытяжение асан обновляет коллагеновый матрикс и предотвращает спаечные процессы.',
        full: `
          Фасция представляет собой единый непрерывный проприоцептивный орган тела:<br><br>
          • <strong>Феномен механотрансдукции:</strong> механическое натяжение фасций во время удержания асаны активизирует фибробласты, синтезирующие свежую гиалуроновую кислоту.<br>
          • <strong>Перекалибровка рецепторов Гольджи:</strong> глубокая растяжка купирует хронические миофасциальные боли в поясничном и шейном отделах.<br>
          • <strong>Висцеральный насос:</strong> вакуумные техники (Уддияна Бандха, Наули) стимулируют движение лимфы по грудному протоку, дренируя застойные зоны.
        `
      },
      {
        id: 'ev-telomeres',
        icon: '⏳',
        badge: 'Генетика и геронтология',
        title: 'Защита теломер и замедление клеточного старения',
        meta: 'Калифорнийский университет Сан-Франциско (Лауреат Нобелевской премии Элизабет Блэкбёрн)',
        short: 'Регулярная медитация осознанности активизирует фермент теломеразу, продлевая жизнь клеток.',
        full: `
          Теломеры — концевые защитные участки хромосом, укорачивающиеся при делении клеток и стрессе:<br><br>
          • <strong>Повышение активности теломеразы на 30–43%:</strong> регулярные циклы медитации и дыхания снижают маркеры воспаления (интерлейкин-6, TNF-альфа), защищая концы хромосом.<br>
          • <strong>Эпигенетическая регуляция NF-kB:</strong> подавляется активность провоспалительных генов, ускоряющих соматическое увядание тканей.
        `
      }
    ]
  };

  /**
   * Анатомический силуэт человека в позе Лотоса с вихрем чакры и Сушумной
   */
  function getChakraVisualSvg(c) {
    const y = Math.round(c.posPercent * 1.5 + 10);
    return `
      <div class="chakra-figure-container">
        <svg viewBox="0 0 160 175" class="chakra-human-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="ch-glow-${c.num}" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b1"/>
              <feGaussianBlur stdDeviation="12" result="b2"/>
              <feMerge>
                <feMergeNode in="b2"/>
                <feMergeNode in="b1"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <radialGradient id="ch-radial-${c.num}" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="40%" stop-color="${c.color}"/>
              <stop offset="100%" stop-color="${c.color}" stop-opacity="0"/>
            </radialGradient>
          </defs>

          <!-- Осевой энергетический канал Сушумна -->
          <line x1="80" y1="20" x2="80" y2="155" stroke="rgba(192, 132, 252, 0.25)" stroke-width="2.5" stroke-dasharray="3 3"/>

          <!-- Реалистичный медитативный контур сидящего человека -->
          <g stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.8" fill="rgba(15, 23, 42, 0.65)" stroke-linecap="round" stroke-linejoin="round">
            <!-- Голова и шея -->
            <ellipse cx="80" cy="24" rx="9.5" ry="11.5"/>
            <path d="M77 35v5c-9 2-18 6-25 12-4 3-7 8-7 15 0 8 3 14 6 22l8 18"/>
            <path d="M83 35v5c9 2 18 6 25 12 4 3 7 8 7 15 0 8-3 14-6 22l-8 18"/>
            <!-- Торс и грудная клетка -->
            <path d="M68 53c3 16 2 34-3 48 4 6 8 10 15 11 7-1 11-5 15-11-5-14-6-32-3-48"/>
            <!-- Скрещенные ноги в лотосе и бедра -->
            <path d="M42 126c-8 3-18 10-18 18 0 7 8 9 24 9 18 0 24-4 32-9 8 5 14 9 32 9 16 0 24-2 24-9 0-8-10-15-18-18"/>
            <!-- Руки на коленях (Джняна-мудра) -->
            <path d="M48 109c-3 8-6 16-10 24 6 3 14 6 24 7"/>
            <path d="M112 109c3 8 6 16 10 24-6 3-14 6-24 7"/>
            <circle cx="34" cy="136" r="3.5" fill="rgba(192, 132, 252, 0.3)"/>
            <circle cx="126" cy="136" r="3.5" fill="rgba(192, 132, 252, 0.3)"/>
          </g>

          <!-- Фоновое сияние центра чакры -->
          <circle cx="80" cy="${y}" r="24" fill="${c.color}" opacity="0.32" filter="url(#ch-glow-${c.num})"/>
          <circle cx="80" cy="${y}" r="14" fill="${c.color}" opacity="0.6" filter="url(#ch-glow-${c.num})"/>

          <!-- Пульсирующий вихрь и ядро чакры -->
          <circle cx="80" cy="${y}" r="11" fill="none" stroke="${c.color}" stroke-width="1.8" stroke-dasharray="3 3"/>
          <circle cx="80" cy="${y}" r="6.5" fill="url(#ch-radial-${c.num})"/>
          <circle cx="80" cy="${y}" r="2" fill="#ffffff"/>
        </svg>
      </div>
    `;
  }

  function injectSliderStyles() {
    if (document.getElementById('ph-slider-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'ph-slider-styles';
    styleEl.textContent = `
      .ph-tabs-topbar {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding: 4px 2px 12px 2px;
        margin-bottom: 12px;
        scrollbar-width: none;
        position: sticky;
        top: 0;
        z-index: 10;
        background: transparent;
        cursor: grab;
      }
      .ph-tabs-topbar:active { cursor: grabbing; }
      .ph-tabs-topbar::-webkit-scrollbar { display: none; }

      .ph-tab-chip {
        flex-shrink: 0;
        padding: 7px 14px;
        background: var(--bg-card, rgba(15, 23, 42, 0.75));
        border: 1px solid var(--border-card, rgba(192, 132, 252, 0.25));
        border-radius: 20px;
        color: var(--text-muted, #94a3b8);
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.22s ease;
        user-select: none;
      }
      .ph-tab-chip.active {
        background: rgba(192, 132, 252, 0.22);
        border-color: #c084fc;
        color: #ffffff;
        box-shadow: 0 0 12px rgba(192, 132, 252, 0.3);
      }

      .ph-slider-track {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        gap: 16px;
      }
      .ph-slider-track::-webkit-scrollbar { display: none; }

      .ph-slide {
        min-width: 100%;
        max-width: 100%;
        scroll-snap-align: start;
        flex-shrink: 0;
        box-sizing: border-box;
      }

      /* Единый аккордеон-стиль */
      .ph-expand-card {
        background: var(--bg-card, rgba(15, 23, 42, 0.75));
        border: 1px solid var(--border-card, rgba(192, 132, 252, 0.2));
        border-radius: 16px;
        padding: 14px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-sizing: border-box;
        width: 100%;
        backdrop-filter: blur(8px);
      }
      .ph-expand-card:hover { border-color: rgba(192, 132, 252, 0.45); }
      .ph-expand-card.expanded {
        border-color: rgba(192, 132, 252, 0.7);
        box-shadow: 0 4px 20px rgba(192, 132, 252, 0.15);
      }

      .ph-card-header {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      /* Единый стиль цифры последовательности */
      .ph-badge-num {
        width: 32px;
        height: 32px;
        border-radius: 10px;
        border: 1.5px solid rgba(192, 132, 252, 0.4);
        background: rgba(192, 132, 252, 0.12);
        color: #e9d5ff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13.5px;
        font-weight: 800;
        flex-shrink: 0;
      }
      .ph-card-titles {
        flex: 1;
        min-width: 0;
      }
      .ph-card-title {
        font-size: 15px;
        font-weight: 800;
        color: var(--text-main, #f8fafc);
        margin: 0;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 6px;
      }
      /* Санскрит лавандовым цветом */
      .ph-sanskrit-tag {
        font-size: 12px;
        font-style: italic;
        color: #c084fc;
        font-weight: 600;
      }
      .ph-tap-hint {
        font-size: 11.5px;
        color: var(--text-muted, #94a3b8);
        display: block;
        margin-top: 2px;
      }
      .ph-expand-card.expanded .ph-tap-hint { display: none; }
      .ph-chevron {
        font-size: 13px;
        color: var(--text-muted, #94a3b8);
        transition: transform 0.25s ease;
      }
      .ph-expand-card.expanded .ph-chevron {
        transform: rotate(180deg);
        color: #c084fc;
      }

      .ph-short-desc {
        font-size: 13px;
        color: var(--text-secondary, #cbd5e1);
        line-height: 1.45;
        margin: 8px 0 0 0;
      }
      .ph-full-details {
        display: none;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed rgba(255, 255, 255, 0.12);
      }
      .ph-expand-card.expanded .ph-full-details { display: block; }
      .ph-detail-text {
        font-size: 13px;
        color: var(--text-main, #f8fafc);
        line-height: 1.55;
      }

      .yoga-cross-btn {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 100% !important;
        padding: 10px 14px !important;
        background: rgba(192, 132, 252, 0.14) !important;
        border: 1px solid rgba(192, 132, 252, 0.4) !important;
        border-radius: 12px !important;
        color: #f3e8ff !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        text-align: left !important;
        box-sizing: border-box !important;
      }
      .yoga-cross-btn:active { transform: scale(0.98) !important; }

      .hatha-compact-badge {
        font-size: 10.5px !important;
        font-weight: 800 !important;
        letter-spacing: 0.3px !important;
        padding: 3px 8px !important;
        border-radius: 10px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        white-space: nowrap !important;
        background: rgba(192, 132, 252, 0.16) !important;
        color: #e9d5ff !important;
        border: 1px solid rgba(192, 132, 252, 0.35) !important;
      }

      .ph-term-row {
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(192, 132, 252, 0.15);
        border-radius: 10px;
        padding: 10px 12px;
        margin-bottom: 8px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 12.5px;
        line-height: 1.5;
      }
      .ph-term {
        background: rgba(56, 189, 248, 0.15);
        color: #38bdf8;
        padding: 2px 7px;
        border-radius: 6px;
        font-weight: 800;
        font-size: 12px;
        display: inline-block;
        margin-right: 4px;
      }

      /* Сетка Раджа-йоги */
      .raja-limbs-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      .raja-card {
        background: var(--bg-card, rgba(15, 23, 42, 0.75));
        border: 1px solid rgba(192, 132, 252, 0.25);
        border-radius: 16px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .raja-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      .raja-step-num {
        width: 26px;
        height: 26px;
        border-radius: 8px;
        background: rgba(192, 132, 252, 0.15);
        border: 1px solid rgba(192, 132, 252, 0.4);
        color: #c084fc;
        font-size: 13px;
        font-weight: 900;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .raja-icon-wrapper {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: rgba(192, 132, 252, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .raja-sub-badge {
        display: inline-block;
        font-size: 10.5px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 2px 7px;
        border-radius: 10px;
        background: rgba(192, 132, 252, 0.14);
        color: #e9d5ff;
        border: 1px solid rgba(192, 132, 252, 0.35);
        margin-bottom: 6px;
      }

      /* Стили Чакр */
      .chakra-card {
        border-left-width: 4px !important;
      }
      .chakra-tag {
        font-size: 11px;
        font-weight: 800;
        padding: 3px 8px;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        white-space: nowrap;
      }
      .chakra-meta-table {
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 10px 12px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 12.5px;
      }
      .chakra-meta-line {
        display: flex;
        justify-content: space-between;
        gap: 8px;
      }
      .chakra-meta-line span:first-child {
        color: var(--text-muted, #94a3b8);
        font-weight: 600;
      }
      .chakra-meta-line span:last-child {
        color: #f8fafc;
        font-weight: 700;
        text-align: right;
      }
      .chakra-figure-container {
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle, rgba(15, 23, 42, 0.9) 0%, rgba(10, 15, 29, 0.95) 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 10px;
        margin-bottom: 12px;
      }
      .chakra-human-svg {
        width: 140px;
        height: 155px;
      }

      /* Кликабельные чипы асан в чакрах */
      .chakra-asanas-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 6px;
      }
      .chakra-asana-chip {
        font-size: 12px;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 10px;
        background: rgba(56, 189, 248, 0.12);
        border: 1px solid rgba(56, 189, 248, 0.35);
        color: #38bdf8;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        transition: all 0.15s ease;
      }
      .chakra-asana-chip:active {
        transform: scale(0.96);
        background: rgba(56, 189, 248, 0.25);
      }

      /* Стили Гун (спокойные, аккуратные) */
      .guna-card {
        border-left-width: 4px !important;
      }
      .guna-food-chips-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 6px 0 8px 0;
      }
      .guna-food-chip {
        font-size: 11.5px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #f8fafc;
      }
      .guna-meta-block {
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 10px 12px;
        margin-top: 8px;
      }
      .guna-meta-title {
        font-size: 12.5px;
        font-weight: 800;
        margin-bottom: 4px;
      }

      .intro-toggle-bar {
        display: flex;
        gap: 8px;
        margin-bottom: 10px;
      }
      .intro-tab-btn {
        flex: 1;
        padding: 9px 12px;
        border-radius: 12px;
        border: 1px solid var(--border-card, rgba(192, 132, 252, 0.25));
        background: var(--bg-card, rgba(15, 23, 42, 0.75));
        color: var(--text-muted, #94a3b8);
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .intro-tab-btn.active {
        background: rgba(192, 132, 252, 0.2);
        border-color: #c084fc;
        color: #ffffff;
      }
    `;
    document.head.appendChild(styleEl);
  }
  
  function renderPhilosophyScreen(targetContainer) {
    const container = targetContainer || 
                      document.getElementById('yoga-tab-content') || 
                      document.getElementById('tab-philosophy') || 
                      document.getElementById('yoga-subview-container');
    if (!container) return;

    injectSliderStyles();

    container.innerHTML = `
      <!-- Меню 6 вкладок со скроллом -->
      <div class="ph-tabs-topbar" id="ph-topbar">
        <button type="button" class="ph-tab-chip active" data-slide-index="0">Яма и Нияма</button>
        <button type="button" class="ph-tab-chip" data-slide-index="1">Ступени Хатхи</button>
        <button type="button" class="ph-tab-chip" data-slide-index="2">Раджа-Йога</button>
        <button type="button" class="ph-tab-chip" data-slide-index="3">Гуны</button>
        <button type="button" class="ph-tab-chip" data-slide-index="4">✨ Чакры</button>
        <button type="button" class="ph-tab-chip" data-slide-index="5">🔬 Наука и Доказательства</button>
      </div>

      <!-- Слайдер-трек -->
      <div class="ph-slider-track" id="ph-slider">
        
        <!-- СЛАЙД 1: ЯМА И НИЯМА -->
        <div class="ph-slide">
          <div class="section-title-wrap" style="margin-bottom: 12px;">
            <h2 style="font-size: 18px; font-weight: 800; color: var(--text-main, #f8fafc); margin-bottom: 4px;">
              Яма и Нияма
            </h2>
            <p style="font-size: 13px; color: var(--text-muted, #94a3b8); line-height: 1.45;">
              Этический кодекс и внутренняя культура восьмеричной йоги
            </p>
          </div>

          <div class="philosophy-intro-card" style="margin-bottom: 12px;">
            <div class="intro-toggle-bar">
              <button type="button" class="intro-tab-btn active" id="ph-sub-yama">🌿 5 принципов Ямы</button>
              <button type="button" class="intro-tab-btn" id="ph-sub-niyama">🔥 5 столпов Ниямы</button>
            </div>
            <div class="intro-desc-text" id="ph-sub-desc" style="font-size: 12.5px; color: var(--text-secondary, #cbd5e1); line-height: 1.45; padding: 2px 4px;">
              Пять базовых принципов гармонии во взаимодействии с окружающим миром и обществом.
            </div>
          </div>

          <div id="yama-cards-box" class="philosophy-sublist active">
            ${PHILOSOPHY_DATA.yama.map(it => renderCardHtml(it)).join('')}
          </div>
          <div id="niyama-cards-box" class="philosophy-sublist" style="display:none;">
            ${PHILOSOPHY_DATA.niyama.map(it => renderCardHtml(it)).join('')}
          </div>
        </div>

        <!-- СЛАЙД 2: СТУПЕНИ ХАТХА-ЙОГИ -->
        <div class="ph-slide">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <h2 style="font-size: 18px; font-weight: 800; color: var(--text-main, #f8fafc); margin: 0;">
              Ступени Хатха-Йоги
            </h2>
            <span class="hatha-compact-badge">СВАТМАРАМА</span>
          </div>
          <p style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 12px; line-height: 1.45;">
            Четыре канонических этапа телесно-энергетического преображения
          </p>

          <div class="hatha-stages-list">
            ${PHILOSOPHY_DATA.hathaStages.map(st => renderHathaCardHtml(st)).join('')}
          </div>
        </div>

        <!-- СЛАЙД 3: РАДЖА-ЙОГА -->
        <div class="ph-slide">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <h2 style="font-size: 18px; font-weight: 800; color: var(--text-main, #f8fafc); margin: 0;">
              Раджа-Йога
            </h2>
            <span class="hatha-compact-badge">СТУПЕНИ 5–8</span>
          </div>
          <p style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 12px; line-height: 1.45;">
            Антаранга-садхана: высшие ступени медитации и покоя ума
          </p>

          <div class="raja-limbs-grid">
            ${PHILOSOPHY_DATA.rajaLimbs.map(r => `
              <div class="raja-card">
                <div>
                  <div class="raja-card-top">
                    <span class="raja-step-num">${r.step}</span>
                    <div class="raja-icon-wrapper">${r.iconSvg}</div>
                  </div>
                  <span class="raja-sub-badge">${r.badge}</span>
                  <div style="font-size: 15px; font-weight: 800; color: #ffffff; margin-top: 2px;">${r.name}</div>
                  <div style="font-size: 12px; font-style: italic; color: #c084fc; margin-bottom: 8px;">${r.sanskrit}</div>
                </div>
                <p style="font-size: 12.5px; color: var(--text-secondary, #cbd5e1); line-height: 1.45; margin: 0;">${r.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- СЛАЙД 4: ГУНЫ (СПОКОЙНАЯ ПАЛИТРА) -->
        <div class="ph-slide">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <h2 style="font-size: 18px; font-weight: 800; color: var(--text-main, #f8fafc); margin: 0;">
              Гуны материальной природы
            </h2>
            <span class="hatha-compact-badge" style="background: rgba(16, 185, 129, 0.15) !important; border-color: rgba(16, 185, 129, 0.35) !important; color: #10b981 !important;">
              3 КАЧЕСТВА
            </span>
          </div>
          <p style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 12px; line-height: 1.45;">
            Психотипы сознания, питание и правила балансировки энергий
          </p>

          <div class="gunas-list">
            ${PHILOSOPHY_DATA.gunas.map(g => renderGunaCardHtml(g)).join('')}
          </div>

          <div class="guna-rule-box" style="margin-top: 14px; margin-bottom: 24px; padding: 12px 14px; background: rgba(192, 132, 252, 0.1); border: 1px solid rgba(192, 132, 252, 0.25); border-radius: 14px;">
            <div style="font-size: 14px; font-weight: 800; color: #e9d5ff; margin-bottom: 4px;">
              ⚖️ Закон подъема энергии (Тамас → Раджас → Саттва):
            </div>
            <div style="font-size: 13px; color: #cbd5e1; line-height: 1.5;">
              Из инерции невозможно шагнуть сразу в чистый покой. Сначала тело пробуждают движением и контролируемым огнем активности (<strong>Раджас</strong>), а затем гармонизируют дыханием и созерцанием в устойчивую ясность (<strong>Саттва</strong>).
            </div>
          </div>
        </div>

        <!-- СЛАЙД 5: ЧАКРЫ (АНАТОМИЧЕСКАЯ ФИГУРА И СВЯЗЬ С АСАНАМИ) -->
        <div class="ph-slide">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <h2 style="font-size: 18px; font-weight: 800; color: var(--text-main, #f8fafc); margin: 0;">
              Энергетические центры (Чакры)
            </h2>
            <span class="hatha-compact-badge">7 ЦЕНТРОВ</span>
          </div>
          <p style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 12px; line-height: 1.45;">
            Взаимосвязь тонких энергетических вихрей с нервными сплетениями и эндокринными железами
          </p>

          <div class="chakras-list">
            ${PHILOSOPHY_DATA.chakras.map(c => renderChakraCardHtml(c)).join('')}
          </div>
        </div>

        <!-- СЛАЙД 6: НАУКА И ДОКАЗАТЕЛЬСТВА -->
        <div class="ph-slide">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <h2 style="font-size: 18px; font-weight: 800; color: var(--text-main, #f8fafc); margin: 0;">
              Наука и Доказательства
            </h2>
            <span class="hatha-compact-badge">EVIDENCE-BASED</span>
          </div>
          <p style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 14px; line-height: 1.45;">
            Клинические исследования, данные МРТ, биохимия стресса и фасциальная физиология
          </p>

          <div class="evidence-list" style="margin-bottom: 24px;">
            ${PHILOSOPHY_DATA.evidence.map(e => renderEvidenceCardHtml(e)).join('')}
          </div>
        </div>

      </div>
    `;

    bindSliderAndCards(container);
  }

  function renderCardHtml(item) {
    const actionBtn = item.action ? `
      <div style="margin-top: 10px;">
        <button type="button" class="yoga-cross-btn" data-yoga-subview="${item.action.subview}">
          <span>${item.action.icon} ${item.action.text}</span>
          <span style="font-size: 15px; font-weight: 900; margin-left: 6px;">→</span>
        </button>
      </div>
    ` : '';

    return `
      <div class="ph-expand-card">
        <div class="ph-card-header">
          <span class="ph-badge-num">${item.num}</span>
          <div class="ph-card-titles">
            <h3 class="ph-card-title">
              <span>${item.nameRu}</span>
              ${item.sanskrit ? `<span class="ph-sanskrit-tag">(${item.sanskrit})</span>` : ''}
            </h3>
            <span class="ph-tap-hint">Нажмите для подробностей</span>
          </div>
          <span class="ph-chevron">▾</span>
        </div>
        <p class="ph-short-desc">${item.short}</p>
        ${item.actionAlwaysVisible && actionBtn ? actionBtn : ''}
        <div class="ph-full-details">
          <p class="ph-detail-text">${item.full}</p>
          ${!item.actionAlwaysVisible && actionBtn ? actionBtn : ''}
        </div>
      </div>
    `;
  }

  function renderHathaCardHtml(st) {
    const actionBtn = st.action ? `
      <div style="margin-top: 10px;">
        <button type="button" class="yoga-cross-btn" data-yoga-subview="${st.action.subview}">
          <span>${st.action.icon} ${st.action.text}</span>
          <span style="font-size: 15px; font-weight: 900; margin-left: 6px;">→</span>
        </button>
      </div>
    ` : '';

    return `
      <div class="ph-expand-card">
        <div class="ph-card-header" style="justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
            <span class="ph-step-badge">${st.step}</span>
            <div class="ph-card-titles">
              <h4 class="ph-card-title">${st.title}</h4>
              <span class="ph-tap-hint">Нажмите для подробностей</span>
            </div>
          </div>
          <span class="hatha-compact-badge">${st.badge}</span>
          <span class="ph-chevron" style="margin-left: 8px;">▾</span>
        </div>
        <p class="ph-short-desc">${st.short}</p>
        <div class="ph-full-details">
          <div class="ph-detail-text">${st.full}</div>
          ${actionBtn}
        </div>
      </div>
    `;
  }

  function renderGunaCardHtml(g) {
    return `
      <div class="ph-expand-card guna-card" style="border-left-color: ${g.color};">
        <div class="ph-card-header">
          <div style="display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.08); flex-shrink: 0;">
            ${g.symbolSvg}
          </div>
          <div class="ph-card-titles">
            <h4 class="ph-card-title" style="color: #ffffff;">
              <span>${g.name}</span>
              <span class="ph-sanskrit-tag">(${g.sanskrit})</span>
            </h4>
            <span class="ph-tap-hint">Нажмите для разбора питания и психологии</span>
          </div>
          <span class="ph-chevron">▾</span>
        </div>
        <p class="ph-short-desc">${g.short}</p>

        <div class="ph-full-details">
          <div class="guna-meta-block" style="border-left: 3px solid ${g.color};">
            <div class="guna-meta-title" style="color: #f8fafc;">🧠 Проявление в уме:</div>
            <div style="font-size: 13px; color: var(--text-secondary, #cbd5e1); line-height: 1.5;">${g.mind}</div>
          </div>
          <div class="guna-meta-block" style="border-left: 3px solid ${g.color};">
            <div class="guna-meta-title" style="color: #f8fafc;">🥗 Рекомендуемые продукты:</div>
            <div class="guna-food-chips-wrap">
              ${g.foods.map(f => `<span class="guna-food-chip">${f}</span>`).join('')}
            </div>
            <div style="font-size: 12.5px; color: var(--text-muted, #94a3b8); line-height: 1.45;">${g.foodDesc}</div>
          </div>
          <div class="guna-meta-block" style="border-left: 3px solid ${g.color};">
            <div class="guna-meta-title" style="color: #f8fafc;">🧘 Проявление на коврике:</div>
            <div style="font-size: 13px; color: var(--text-secondary, #cbd5e1); line-height: 1.5;">${g.practice}</div>
          </div>
          <div class="guna-meta-block" style="border-left: 3px solid ${g.color};">
            <div class="guna-meta-title" style="color: #c084fc;">💡 Стратегия балансировки:</div>
            <div style="font-size: 13px; color: #ffffff; line-height: 1.5;">${g.balanceRule}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderChakraCardHtml(c) {
    return `
      <div class="ph-expand-card chakra-card" style="border-left-color: ${c.color};">
        <div class="ph-card-header">
          <span class="ph-badge-num" style="border-color:${c.color}66; color:#ffffff;">${c.num}</span>
          <div class="ph-card-titles">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
              <h4 class="ph-card-title">${c.nameRu}</h4>
              <span class="chakra-tag" style="background:${c.color}22; color:${c.color}; border:1px solid ${c.color}55;">
                ${c.bija}
              </span>
            </div>
            <div style="display:flex; gap:8px; align-items:center; margin-top:2px;">
              <span class="ph-sanskrit-tag">(${c.sanskrit})</span>
              <span style="font-size:12px; color:${c.color}; font-weight:700;">Стихия: ${c.element}</span>
            </div>
            <span class="ph-tap-hint">Нажмите для анатомии и балансировки</span>
          </div>
          <span class="ph-chevron">▾</span>
        </div>

        <p class="ph-short-desc">${c.short}</p>

        <div class="ph-full-details">
          <!-- Анатомический векторный силуэт со светящимся вихрем -->
          ${getChakraVisualSvg(c)}

          <div class="chakra-meta-table">
            <div class="chakra-meta-line">
              <span>Локализация:</span>
              <span>${c.location}</span>
            </div>
            <div class="chakra-meta-line">
              <span>Нервное сплетение:</span>
              <span>${c.nervePlexus}</span>
            </div>
            <div class="chakra-meta-line">
              <span>Эндокринная железа:</span>
              <span>${c.endocrineGland}</span>
            </div>
          </div>

          <div style="font-size:13px; color:var(--text-main, #f8fafc); line-height:1.55; margin-bottom:10px;">
            ${c.full}
          </div>

          <!-- Кликабельные чипы асан для перехода в каталог -->
          <div class="guna-meta-block" style="border-left: 3px solid ${c.color};">
            <div class="guna-meta-title" style="color: ${c.color};">🧘 Рекомендуемые асаны (нажмите для изучения):</div>
            <div class="chakra-asanas-chips">
              ${c.asanas.map(name => `
                <button type="button" class="chakra-asana-chip" data-jump-asana="${name}">
                  <span>🧘</span>
                  <span>${name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="guna-meta-block" style="border-left: 3px solid ${c.color};">
            <div class="guna-meta-title" style="color:${c.color};">🌬️ Пранаяма и замок:</div>
            <div style="font-size: 12.5px; color: var(--text-secondary, #cbd5e1); line-height: 1.45;">${c.pranayamaAction}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderEvidenceCardHtml(e) {
    return `
      <div class="ph-expand-card">
        <div class="ph-card-header">
          <div style="width: 34px; height: 34px; border-radius: 10px; background: rgba(192, 132, 252, 0.14); border: 1px solid rgba(192, 132, 252, 0.35); display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0;">
            ${e.icon}
          </div>
          <div class="ph-card-titles">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
              <h4 class="ph-card-title">${e.title}</h4>
              <span class="hatha-compact-badge">${e.badge}</span>
            </div>
            <span class="ph-tap-hint">Нажмите для ознакомления с клинической базой</span>
          </div>
          <span class="ph-chevron">▾</span>
        </div>

        <p class="ph-short-desc">${e.short}</p>

        <div class="ph-full-details">
          <div style="font-size: 12.5px; font-style: italic; color: #c084fc; margin-bottom: 8px;">
            📚 ${e.meta}
          </div>
          <div class="ph-detail-text" style="line-height: 1.55;">
            ${e.full}
          </div>
        </div>
      </div>
    `;
  }

  function bindSliderAndCards(container) {
    const slider = container.querySelector('#ph-slider');
    const topbar = container.querySelector('#ph-topbar');
    const tabs = container.querySelectorAll('.ph-tab-chip');

    function scrollToSlide(index) {
      if (!slider) return;
      const slideWidth = slider.clientWidth + 16;
      slider.scrollTo({ left: index * slideWidth, behavior: 'smooth' });
      tabs.forEach((t, i) => t.classList.toggle('active', i === index));

      const activeTab = tabs[index];
      if (activeTab && topbar) {
        const offset = activeTab.offsetLeft - (topbar.clientWidth / 2) + (activeTab.clientWidth / 2);
        topbar.scrollTo({ left: offset, behavior: 'smooth' });
      }
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        if (typeof window.haptic === 'function') window.haptic('light');
        const index = parseInt(tab.getAttribute('data-slide-index'), 10);
        scrollToSlide(index);
      });
    });

    slider?.addEventListener('scroll', () => {
      const slideWidth = slider.clientWidth + 16;
      const activeIdx = Math.round(slider.scrollLeft / slideWidth);
      tabs.forEach((t, idx) => {
        t.classList.toggle('active', idx === activeIdx);
      });
    }, { passive: true });

    const btnYama = container.querySelector('#ph-sub-yama');
    const btnNiyama = container.querySelector('#ph-sub-niyama');
    const boxYama = container.querySelector('#yama-cards-box');
    const boxNiyama = container.querySelector('#niyama-cards-box');
    const descEl = container.querySelector('#ph-sub-desc');

    btnYama?.addEventListener('click', () => {
      if (typeof window.haptic === 'function') window.haptic('light');
      btnYama.classList.add('active');
      btnNiyama?.classList.remove('active');
      if (boxYama) boxYama.style.display = 'block';
      if (boxNiyama) boxNiyama.style.display = 'none';
      if (descEl) descEl.textContent = 'Пять базовых принципов гармонии во взаимодействии с окружающим миром и обществом.';
    });

    btnNiyama?.addEventListener('click', () => {
      if (typeof window.haptic === 'function') window.haptic('light');
      btnNiyama.classList.add('active');
      btnYama?.classList.remove('active');
      if (boxYama) boxYama.style.display = 'none';
      if (boxNiyama) boxNiyama.style.display = 'block';
      if (descEl) descEl.textContent = 'Пять правил личной психогигиены, чистоты тела, упорства и духовного самопознания.';
    });

    // Обработка кликов внутри философии
    container.addEventListener('click', (e) => {
      // 1. Клик по интерактивной асане внутри чакры
      const asanaChip = e.target.closest('[data-jump-asana]');
      if (asanaChip) {
        e.stopPropagation();
        if (typeof window.haptic === 'function') window.haptic('medium');
        const asanaName = asanaChip.getAttribute('data-jump-asana');
        jumpToAsanaCatalog(asanaName);
        return;
      }

      // 2. Раскрытие карточки-аккордеона
      const card = e.target.closest('.ph-expand-card');
      if (card && !e.target.closest('.yoga-cross-btn') && !e.target.closest('[data-yoga-subview]')) {
        if (typeof window.haptic === 'function') window.haptic('light');
        card.classList.toggle('expanded');
      }
    });
  }

  /**
   * Интерактивный переход из Чакры в Каталог асан с автоматическим поиском и открытием
   */
  function jumpToAsanaCatalog(queryName) {
    if (window.Router && typeof window.Router.openYoga === 'function') {
      window.Router.openYoga('asanas');
    } else if (window.Router && typeof window.Router.openYogaTab === 'function') {
      window.Router.openYogaTab('asanas');
    }

    setTimeout(() => {
      const searchInput = document.getElementById('asanas-search-input');
      if (searchInput) {
        searchInput.value = queryName;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));

        setTimeout(() => {
          const firstCard = document.querySelector('.asana-card-acc');
          if (firstCard) {
            firstCard.classList.add('expanded');
            firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      }
    }, 200);
  }

  window.renderPhilosophyScreen = renderPhilosophyScreen;
  window.renderPhilosophyTab = renderPhilosophyScreen;
  window.renderYogaPhilosophy = renderPhilosophyScreen;
})();