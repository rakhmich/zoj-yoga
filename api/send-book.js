import crypto from 'crypto';

// Реестр реальных книг и их file_id в Telegram Cloud
const BOOKS_REGISTRY = {
  'hatha-yoga-pradipika-svatmarama': {
    title: 'Хатха-Йога Прадипика',
    author: 'Свами Сватмарама',
    fileId: 'BQACAgIAAxkBAAMFaq25iyK3dnaOb7i_9b4gJJaeGBMAAiawAAJJSnBJzAoVwc3Nn3c9BA',
    caption: '<b>📖 «Хатха-Йога Прадипика» — Свами Сватмарама</b>\n\nКлассический средневековый первоисточник: 4 ступени от асан и шаткарм до мудр и самадхи.\n\n<i>Приятного изучения! Отправлено из приложения «Физра & Йога» ⚡🧘</i>'
  },
  'yoga-personal-hygiene-yogendra': {
    title: 'Йога. Личная гигиена',
    author: 'Шри Йогендра',
    fileId: 'BQACAgIAAxkBAAMGaq25i7Eydkp7Eq9ZM3nTgvkzDCIAAiewAAJJSnBJxK4rr1bYtwY9BA',
    caption: '<b>📖 «Йога. Личная гигиена» — Шри Йогендра</b>\n\nФундаментальное руководство по чистоте тела (деха-шуддхи), профилактике заболеваний и шаткармам.\n\n<i>Приятного изучения! Отправлено из приложения «Физра & Йога» ⚡🧘</i>'
  },
  'yoga-business-man-poltavtsev': {
    title: 'Йога делового человека',
    author: 'Игорь Полтавцев',
    fileId: 'BQACAgIAAxkBAAMHaq25i0fT-uxZ3MOD_Zwma5kItoEAAimwAAJJSnBJsZcfzOL4_QU9BA',
    caption: '<b>📖 «Йога делового человека» — И. Н. Полтавцев</b>\n\nПрактическое руководство по психофизической саморегуляции, снятию стресса и раскрытию потенциала.\n\n<i>Приятного изучения! Отправлено из приложения «Физра & Йога» ⚡🧘</i>'
  },
  'hatha-yoga-theos-bernard': {
    title: 'Хатха-йога',
    author: 'Теос Бернард',
    fileId: 'BQACAgIAAxkBAAMIaq25i5m3e0mvgqaJEd3hvqVMm9MAAiqwAAJJSnBJ034kAAGVIO7MPQQ',
    caption: '<b>📖 «Хатха-йога» — Теос Бернард</b>\n\nДокументальный дневник американского исследователя о традиционном обучении йоге в Индии и Тибете.\n\n<i>Приятного изучения! Отправлено из приложения «Физра & Йога» ⚡🧘</i>'
  },
  'hatha-yoga-pradipika-satyananda': {
    title: 'Хатха-Йога Прадипика (с комментариями)',
    author: 'Свами Сатьянанда Сарасвати',
    fileId: 'BQACAgIAAxkBAAMJaq25izrqUu9BR9dODXcakG_cMm8AAiuwAAJJSnBJlO9xFivisio9BA',
    caption: '<b>📖 «Хатха-Йога Прадипика (с комментариями)» — Сатьянанда Сарасвати</b>\n\nПолный академический и тантрический комментарий Бихарской школы йоги к трактату Сватмарамы.\n\n<i>Приятного изучения! Отправлено из приложения «Физра & Йога» ⚡🧘</i>'
  }
};

/**
 * Валидация подлинности сессии Telegram WebApp (HMAC-SHA256)
 */
function validateTelegramInitData(initData, botToken) {
  if (!initData || !botToken) return { isValid: false, user: null };

  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    const dataCheckArr = [];
    for (const [key, value] of urlParams.entries()) {
      dataCheckArr.push(`${key}=${value}`);
    }
    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    const isValid = calculatedHash === hash;
    const userData = urlParams.get('user') ? JSON.parse(urlParams.get('user')) : null;

    return { isValid, user: userData };
  } catch (err) {
    console.error('[validateTelegramInitData] Ошибка проверки:', err);
    return { isValid: false, user: null };
  }
}

/**
 * Обработчик запроса отправки книги пользователю в диалог с ботом
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return res.status(500).json({ error: 'Server configuration error: TELEGRAM_BOT_TOKEN missing' });
  }

  const { bookId, initData, userId: directUserId } = req.body || {};

  if (!bookId) {
    return res.status(400).json({ error: 'Missing bookId parameter' });
  }

  const book = BOOKS_REGISTRY[bookId];
  if (!book) {
    return res.status(404).json({ error: 'Book not found in registry' });
  }

  let targetChatId = null;

  if (initData) {
    const { isValid, user } = validateTelegramInitData(initData, botToken);
    if (!isValid || !user || !user.id) {
      return res.status(401).json({ error: 'Invalid or expired Telegram WebApp session' });
    }
    targetChatId = user.id;
  } else if (directUserId && process.env.NODE_ENV === 'development') {
    targetChatId = directUserId;
  } else {
    return res.status(400).json({ error: 'Authentication required: provide initData' });
  }

  try {
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendDocument`;

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        document: book.fileId,
        caption: book.caption,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('[send-book] Ошибка Telegram API:', result);
      if (result.error_code === 403) {
        return res.status(403).json({
          error: 'bot_blocked_or_not_started',
          message: 'Пожалуйста, откройте диалог с ботом и нажмите Start, чтобы он мог прислать файл.'
        });
      }
      return res.status(502).json({ error: 'telegram_api_error', details: result.description });
    }

    return res.status(200).json({
      success: true,
      message: `Книга «${book.title}» успешно отправлена в ваш чат с ботом.`
    });
  } catch (error) {
    console.error('[send-book] Ошибка сетевого запроса:', error);
    return res.status(500).json({ error: 'internal_server_error' });
  }
}