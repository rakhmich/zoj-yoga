/**
 * Vercel Serverless Function: Отправка фото/видео ботом в чат Telegram
 * Файл: api/send-photo.js
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN не задан в переменных окружения' });
  }

  try {
    const { image, photo, userId, chatId, caption } = req.body;
    const targetChatId = chatId || userId;
    const mediaBase64 = photo || image;

    if (!targetChatId || !mediaBase64) {
      return res.status(400).json({ error: 'Не переданы targetChatId или изображение' });
    }

    // Очищаем base64
    const base64Data = mediaBase64.replace(/^data:(image|video)\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Формируем FormData для Telegram Bot API
    const formData = new FormData();
    formData.append('chat_id', targetChatId);
    if (caption) formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');

    const isVideo = mediaBase64.startsWith('data:video');
    const method = isVideo ? 'sendVideo' : 'sendPhoto';
    const field = isVideo ? 'video' : 'photo';
    const filename = isVideo ? 'story.mp4' : 'story.png';

    const blob = new Blob([buffer], { type: isVideo ? 'video/mp4' : 'image/png' });
    formData.append(field, blob, filename);

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      body: formData
    });

    const data = await tgRes.json();
    if (!data.ok) {
      return res.status(400).json({ error: data.description || 'Ошибка Telegram Bot API' });
    }

    return res.status(200).json({ success: true, messageId: data.result.message_id });
  } catch (err) {
    console.error('[API send-photo] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}