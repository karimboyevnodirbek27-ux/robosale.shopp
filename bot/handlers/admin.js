// handlers/admin.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const { formatPrice } = require('./catalog');
const { STATUS_MAP } = require('./order');
const { getAdminOrderKeyboard } = require('../utils/keyboards');

const WEBSITE_URL = (process.env.WEBSITE_URL || 'https://robosale.pages.dev').replace(/\/$/, '');

// Adminligini tekshirish
function isAdmin(userId, adminId) {
    if (!adminId) return false;
    return userId.toString() === adminId.toString();
}

// Admin bosh paneli
async function showAdminDashboard(bot, chatId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayOrders, totalPending, totalProducts, allOrdersCount] = await Promise.all([
        Order.find({ createdAt: { $gte: today } }),
        Order.countDocuments({ orderStatus: 'pending' }),
        Product.countDocuments(),
        Order.countDocuments()
    ]);

    const todayRevenue = todayOrders
        .filter(o => o.orderStatus !== 'cancelled')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const text = `👨‍💼 <b>RoboSale Admin Paneli</b>\n\n` +
        `📊 <b>Umumiy ko‘rsatkichlar:</b>\n` +
        `• Jami barcha buyurtmalar: <b>${allOrdersCount} ta</b>\n` +
        `• Bugungi buyurtmalar: <b>${todayOrders.length} ta</b>\n` +
        `• Bugungi tushum: <b>${formatPrice(todayRevenue)}</b>\n` +
        `• Kutilayotgan (Pending): <b>${totalPending} ta</b>\n` +
        `• Bazadagi tovarlar: <b>${totalProducts} ta</b>\n\n` +
        `🌐 <b>Veb Admin Panel:</b> <a href="${WEBSITE_URL}/admin">${WEBSITE_URL}/admin</a>\n` +
        `<i>Login ma'lumotlari sayt admin panelida (.env orqali boshqariladi).</i>\n\n` +
        `Quyidagi tugmalar orqali buyurtmalarni ko‘rishingiz va holatini o‘zgartirishingiz mumkin:`;

    const inline_keyboard = [
        [
            { text: '📦 So‘nggi buyurtmalar', callback_data: 'adm_recent_orders' },
            { text: '⏳ Kutilayotganlar', callback_data: 'adm_pending_orders' }
        ],
        [
            { text: '🔄 Yangilash', callback_data: 'adm_refresh' }
        ]
    ];

    await bot.sendMessage(chatId, text, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: { inline_keyboard }
    });

    // Avtomatik ravishda so'nggi buyurtmalarni ham ko'rsatamiz
    return showAdminOrdersList(bot, chatId);
}

// So'nggi yoki kutilayotgan buyurtmalarni ro'yxat shaklida ko'rsatish
async function showAdminOrdersList(bot, chatId, statusFilter = null) {
    const query = statusFilter ? { orderStatus: statusFilter } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(5);

    if (orders.length === 0) {
        return bot.sendMessage(chatId, 'Hech qanday buyurtma topilmadi.');
    }

    for (const order of orders) {
        let msg = `📋 <b>Buyurtma #: ${order.orderNumber}</b>\n` +
            `👤 Mijoz: <b>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</b>\n` +
            `📱 Tel: <b>${order.shippingAddress.phone}</b>\n` +
            `📍 Manzil: ${order.shippingAddress.city}, ${order.shippingAddress.address}\n` +
            `💰 Summa: <b>${formatPrice(order.totalAmount)}</b>\n` +
            `💳 To‘lov: ${order.paymentMethod.toUpperCase()}\n` +
            `Holati: <b>${STATUS_MAP[order.orderStatus] || order.orderStatus}</b>\n` +
            `⏰ Sana: ${new Date(order.createdAt).toLocaleString('uz-UZ')}\n\n` +
            `<b>Mahsulotlar:</b>\n`;

        order.items.forEach(i => {
            msg += `• ${i.name} × ${i.quantity} = ${formatPrice(i.price * i.quantity)}\n`;
        });

        await bot.sendMessage(chatId, msg, {
            parse_mode: 'HTML',
            ...getAdminOrderKeyboard(order._id)
        });
    }
}

// Admin tomonidan buyurtma holatini o'zgartirish
async function handleAdminStatusChange(bot, query, adminId) {
    if (!isAdmin(query.from.id, adminId)) {
        return bot.answerCallbackQuery(query.id, { text: 'Siz admin emassiz!', show_alert: true });
    }

    // format: adm_status_<orderId>_<newStatus>
    const parts = query.data.split('_');
    const orderId = parts[2];
    const newStatus = parts[3];

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return bot.answerCallbackQuery(query.id, { text: 'Buyurtma topilmadi!', show_alert: true });
        }

        const wasCancelled = order.orderStatus === 'cancelled';
        const willBeCancelled = newStatus === 'cancelled';

        // Bekor qilinsa, omborni qaytarish (faqat bir marta)
        if (!wasCancelled && willBeCancelled && !order.stockRestored) {
            for (const item of order.items) {
                if (!item.product) continue;
                await Product.updateOne(
                    { _id: item.product },
                    { $inc: { stockCount: item.quantity }, $set: { inStock: true } }
                );
            }
            order.stockRestored = true;
        }

        // Bekor qilingan buyurtma qayta faollashtirilsa, omborni yana kamaytirish
        if (wasCancelled && !willBeCancelled && order.stockRestored) {
            const decreased = [];
            for (const item of order.items) {
                if (!item.product) continue;

                const updated = await Product.findOneAndUpdate(
                    { _id: item.product, stockCount: { $gte: item.quantity } },
                    { $inc: { stockCount: -item.quantity } },
                    { new: true }
                );

                if (!updated) {
                    for (const done of decreased) {
                        await Product.updateOne(
                            { _id: done.product },
                            { $inc: { stockCount: done.quantity }, $set: { inStock: true } }
                        );
                    }
                    return bot.answerCallbackQuery(query.id, {
                        text: `"${item.name}" uchun omborda yetarli mahsulot yo'q!`,
                        show_alert: true
                    });
                }

                if (Number(updated.stockCount) <= 0) {
                    await Product.updateOne({ _id: updated._id }, { $set: { inStock: false } });
                }

                decreased.push({ product: updated._id, quantity: item.quantity });
            }
            order.stockRestored = false;
        }

        order.orderStatus = newStatus;
        if (newStatus === 'delivered') {
            order.deliveredAt = new Date();
        }
        await order.save();

        const statusLabel = STATUS_MAP[newStatus] || newStatus;

        await bot.answerCallbackQuery(query.id, {
            text: `Holat "${statusLabel}" ga o‘zgartirildi!`,
            show_alert: false
        });

        // Adminga xabarni yangilash
        try {
            await bot.editMessageReplyMarkup(
                getAdminOrderKeyboard(order._id).reply_markup,
                { chat_id: query.message.chat.id, message_id: query.message.message_id }
            );
        } catch (e) { }

        await bot.sendMessage(query.message.chat.id, `✅ <b>#${order.orderNumber}</b> buyurtma holati <b>${statusLabel}</b> ga yangilandi.`, {
            parse_mode: 'HTML'
        });

        // Mijozga bildirishnoma yuborish
        if (order.telegramChatId) {
            const customerMsg = `🔔 <b>Buyurtmangiz holati yangilandi!</b>\n\n` +
                `📋 Buyurtma: <b>#${order.orderNumber}</b>\n` +
                `Yangi holat: <b>${statusLabel}</b>\n\n` +
                `Qo‘shimcha savollar bo‘lsa, /start orqali biz bilan bog‘lanishingiz mumkin.`;

            try {
                await bot.sendMessage(order.telegramChatId, customerMsg, { parse_mode: 'HTML' });
            } catch (custErr) {
                console.error('Mijozga xabar yuborishda xatolik:', custErr.message);
            }
        }

    } catch (err) {
        console.error('Status o\'zgartirishda xatolik:', err);
        await bot.answerCallbackQuery(query.id, { text: 'Xatolik yuz berdi!', show_alert: true });
    }
}

// Buyurtma qidirish (raqam bo'yicha)
async function searchOrderByNumber(bot, chatId, orderNum) {
    const cleanNum = orderNum.replace('#', '').trim();
    const order = await Order.findOne({ orderNumber: cleanNum });

    if (!order) {
        return bot.sendMessage(chatId, `🔍 <b>#${cleanNum}</b> raqamli buyurtma topilmadi.`, { parse_mode: 'HTML' });
    }

    let msg = `📋 <b>Buyurtma #: ${order.orderNumber}</b>\n` +
        `👤 Mijoz: <b>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</b>\n` +
        `📱 Tel: <b>${order.shippingAddress.phone}</b>\n` +
        `📍 Manzil: ${order.shippingAddress.city}, ${order.shippingAddress.address}\n` +
        `💰 Summa: <b>${formatPrice(order.totalAmount)}</b>\n` +
        `Holati: <b>${STATUS_MAP[order.orderStatus] || order.orderStatus}</b>\n` +
        `⏰ Sana: ${new Date(order.createdAt).toLocaleString('uz-UZ')}\n\n` +
        `<b>Mahsulotlar:</b>\n`;

    order.items.forEach(i => {
        msg += `• ${i.name} × ${i.quantity} = ${formatPrice(i.price * i.quantity)}\n`;
    });

    return bot.sendMessage(chatId, msg, {
        parse_mode: 'HTML',
        ...getAdminOrderKeyboard(order._id)
    });
}

module.exports = {
    isAdmin,
    showAdminDashboard,
    showAdminOrdersList,
    handleAdminStatusChange,
    searchOrderByNumber
};
