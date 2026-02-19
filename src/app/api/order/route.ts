import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, phone, message, title } = await req.json();

    // Валидация
    if (!name || !phone || name.length > 100 || phone.length > 30) {
      return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Функция экранирования для MarkdownV2 (защищает от _ * [ ] ( ) ~ ` > # + - = | { } . !)
    const escapeMd = (str: string) => str.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');

    // Формируем безопасное сообщение
    const safeName = escapeMd(name);
    const safePhone = escapeMd(phone);
    const safeMessage = message ? escapeMd(message) : '\\-';
    const safeTitle = title ? escapeMd(title) : 'Лендинг';

    const text = `🚀 *Новый заказ*\n\n` +
                 `🏗 *Проект:* ${safeTitle}\n` +
                 `👤 *Имя:* ${safeName}\n` +
                 `📞 *Телефон:* \`${safePhone}\`\n` +
                 `💬 *Сообщение:* ${safeMessage}`;

    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: CHAT_ID, 
        text, 
        parse_mode: 'MarkdownV2' 
      }),
    });

    if (!res.ok) {
      console.error('Telegram Error:', await res.text());
      return NextResponse.json({ error: 'Ошибка отправки в TG' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}