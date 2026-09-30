const crypto = require('crypto');

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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN missing in environment variables' });
  }

  const { bookId, userId, chatId } = req.body || {};
  const targetChatId = userId || chatId;

  if (!bookId) {
    return res.status(400).json({ error: 'Missing bookId parameter' });
  }

  const book = BOOKS_REGISTRY[bookId];
  if (!book) {
    return res.status(404).json({ error: 'Book not found in registry' });
  }

  if (!targetChatId) {
    return res.status(400).json({ error: 'Missing userId or chatId' });
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
      console.error('[send-book] Telegram API error:', result);
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
    console.error('[send-book] Network error:', error);
    return res.status(500).json({ error: 'internal_server_error' });
  }
};
