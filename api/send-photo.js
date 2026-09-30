/**
 * Serverless-функция отправки медиа (фото или видео) пользователю в Telegram
 * Файл: api/send-photo.js
 * Использует чистый CommonJS для Vercel Node.js
 */

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const botToken = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN missing in environment variables' });
  }

  const { video, image, photo, type, mimeType, userId, chatId, caption } = req.body || {};
  const targetChatId = userId || chatId;

  if (!targetChatId) {
    return res.status(400).json({ error: 'Missing userId or chatId parameter' });
  }

  const isVideo = type === 'video' || Boolean(video);

  try {
    // =============================================================
    // 1. ОТПРАВКА ВИДЕО (MP4 / WebM) ЧЕРЕЗ sendVideo
    // =============================================================
    if (isVideo && video) {
      const base64Data = video.replace(/^data:[^;]+;base64,/, '');
      const videoBuffer = Buffer.from(base64Data, 'base64');
      const videoBlob = new Blob([videoBuffer], { type: mimeType || 'video/mp4' });

      const formData = new FormData();
      formData.append('chat_id', targetChatId);
      formData.append('video', videoBlob, 'story.mp4');
      if (caption) {
        formData.append('caption', caption);
        formData.append('parse_mode', 'HTML');
      }
      formData.append('supports_streaming', 'true');

      let tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
        method: 'POST',
        body: formData
      });

      let result = await tgResponse.json();

      // Если Telegram отклонил кодек видео в sendVideo — отправляем надежным документом
      if (!result.ok && result.error_code !== 403) {
        console.warn('[send-photo] sendVideo error, fallback to sendDocument:', result.description);
        const docFormData = new FormData();
        docFormData.append('chat_id', targetChatId);
        docFormData.append('document', videoBlob, 'story.mp4');
        if (caption) {
          docFormData.append('caption', caption);
          docFormData.append('parse_mode', 'HTML');
        }
        const docResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
          method: 'POST',
          body: docFormData
        });
        result = await docResponse.json();
      }

      if (!result.ok) {
        console.error('[send-photo:video] Telegram API error:', result);
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
        type: 'video',
        message: 'Видео-сторис успешно отправлено в ваш чат с ботом.'
      });
    }

    // =============================================================
    // 2. ОТПРАВКА ФОТО (PNG / JPEG) ЧЕРЕЗ sendPhoto
    // =============================================================
    if (image || photo) {
      const base64Data = (image || photo).replace(/^data:image\/\w+;base64,/, '');
      const photoBuffer = Buffer.from(base64Data, 'base64');
      const photoBlob = new Blob([photoBuffer], { type: 'image/png' });

      const formData = new FormData();
      formData.append('chat_id', targetChatId);
      formData.append('photo', photoBlob, 'story.png');
      if (caption) {
        formData.append('caption', caption);
        formData.append('parse_mode', 'HTML');
      }

      const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: formData
      });

      const result = await tgResponse.json();

      if (!result.ok) {
        console.error('[send-photo:photo] Telegram API error:', result);
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
        type: 'photo',
        message: 'Фото-карточка успешно отправлена в ваш чат с ботом.'
      });
    }

    return res.status(400).json({ error: 'No media content provided (expected image or video)' });

  } catch (error) {
    console.error('[send-photo] Server error:', error);
    return res.status(500).json({ error: 'internal_server_error', message: error.message });
  }
};
