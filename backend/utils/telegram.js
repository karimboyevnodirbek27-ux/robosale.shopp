// Yangi buyurtma haqida adminga Telegram orqali xabar yuborish.
// Token yoki admin ID bo'lmasa, jim o'tkazib yuboriladi.
const formatPrice = (price) =>
    new Intl.NumberFormat('uz-UZ').format(Number(price) || 0) + " so'm";

const escapeHtml = (value) =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

async function notifyTelegram(order) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_ID || process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) return;

    const items = (order.items || [])
        .map((item) => `• ${escapeHtml(item.name)} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`)
        .join('\n');

    const address = order.shippingAddress || {};
    const text = [
        '🛒 <b>Yangi buyurtma!</b>',
        '',
        `📋 Raqam: <b>#${escapeHtml(order.orderNumber)}</b>`,
        `👤 Mijoz: <b>${escapeHtml(address.firstName)} ${escapeHtml(address.lastName)}</b>`,
        `📱 Telefon: <b>${escapeHtml(address.phone)}</b>`,
        `📍 Manzil: ${escapeHtml(address.city)}, ${escapeHtml(address.address)}`,
        `💳 To'lov: ${escapeHtml((order.paymentMethod || 'cash').toUpperCase())}`,
        '',
        '<b>Mahsulotlar:</b>',
        items,
        '',
        `💰 Jami: <b>${formatPrice(order.totalAmount)}</b>`
    ].join('\n');

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        });

        if (!response.ok) {
            const body = await response.text();
            console.error('Telegram notify error:', response.status, body.slice(0, 300));
        }
    } catch (error) {
        console.error('Telegram notify error:', error.message);
    }
}

module.exports = { notifyTelegram };
