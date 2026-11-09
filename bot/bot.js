// bot.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

// Modellar va handlerlar
const { mainMenu, cancelKeyboard } = require('./utils/keyboards');
const {
    showCategories,
    showCategoryProducts,
    showProductDetail,
    searchProducts
} = require('./handlers/catalog');
const {
    addToCart,
    changeQuantity,
    removeFromCart,
    clearCart,
    showCart,
    getUserState
} = require('./handlers/cart');
const {
    startOrderFlow,
    handleOrderStepText,
    handleOrderContact,
    handleCitySelection,
    handlePaymentSelection,
    finalizeOrder,
    showUserOrders
} = require('./handlers/order');
const {
    showSensorsMenu,
    showDocDetail,
    handleDatasheetRequest
} = require('./handlers/sensors');
const {
    isAdmin,
    showAdminDashboard,
    showAdminOrdersList,
    handleAdminStatusChange,
    searchOrderByNumber
} = require('./handlers/admin');

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminId = process.env.TELEGRAM_ADMIN_ID;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/robosale_db';
const websiteUrl = (process.env.WEBSITE_URL || 'https://robosale.pages.dev').replace(/\/$/, '');

if (!token) {
    console.error('XATOLIK: TELEGRAM_BOT_TOKEN .env faylida ko\'rsatilmagan!');
    process.exit(1);
}

// Telegram botni ishga tushirish.
// Polling faqat MongoDB ulangandan keyin boshlanadi — shunda tugmalar
// bosilganda baza tayyor bo'ladi.
const bot = new TelegramBot(token, { polling: false });

// Foydalanuvchilar holati (Session Map)
const userState = new Map();

// MongoDB ga ulanish
mongoose.connect(mongoUri)
    .then(async () => {
        console.log('✅ MongoDB ga muvaffaqiyatli ulandi:', mongoUri);

        // Agar avval webhook o'rnatilgan bo'lsa, polling ishlamaydi.
        try {
            await bot.deleteWebHook({ drop_pending_updates: false });
        } catch (err) {
            console.error('Webhookni tozalashda xatolik:', err.message);
        }

        await bot.startPolling();
        console.log('🤖 RoboSale bot ishga tushdi (polling)!');

        try {
            await bot.setMyCommands([
                { command: 'start', description: 'Bosh menyu' },
                { command: 'admin', description: 'Admin panel (faqat admin)' }
            ]);
        } catch (err) {
            console.error('setMyCommands xatolik:', err.message);
        }
    })
    .catch((err) => {
        console.error('❌ MongoDB ga ulanishda xatolik:', err.message);
        // Baza bo'lmasa bot tugmalarga javob bera olmaydi.
        process.exit(1);
    });

// /start komandasi
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'Hurmatli mijoz';
    const state = getUserState(userState, chatId);
    state.step = null;

    const welcomeMsg = `Assalomu alaykum, <b>${firstName}</b>!\n\n` +
        `🤖 <b>RoboSale</b> — robototexnika, datchiklar va elektronika do‘konining rasmiy botiga xush kelibsiz!\n\n` +
        `Bu yerda siz:\n` +
        `• Mahsulotlar katalogini ko‘rishingiz 🛍\n` +
        `• Kerakli ehtiyot qismlarni qidirishingiz 🔍\n` +
        `• Oson va tez buyurtma berishingiz 🛒\n` +
        `• Sensorlar va datchiklar haqida texnik ma’lumot olishingiz mumkin 📡\n\n` +
        `Quyidagi menyudan kerakli bo‘limni tanlang:`;

    bot.sendMessage(chatId, welcomeMsg, {
        parse_mode: 'HTML',
        ...mainMenu
    });
});

// /admin komandasi
bot.onText(/\/admin/, async (msg) => {
    const chatId = msg.chat.id;
    if (!isAdmin(msg.from.id, adminId)) {
        return bot.sendMessage(chatId, 'Kechirasiz, siz admin huquqiga ega emassiz.');
    }
    return showAdminDashboard(bot, chatId);
});

// Kontakt (telefon raqam) kelganda
bot.on('contact', async (msg) => {
    await handleOrderContact(bot, msg, userState);
});

// Matnli xabarlarni qayta ishlash
bot.on('message', async (msg) => {
    // Agar buyruq yoki rasm yoki kontakt bo'lmasa
    if (!msg.text) return;
    const chatId = msg.chat.id;
    const text = msg.text.trim();
    const state = getUserState(userState, chatId);

    // /start va /admin alohida ushlangan
    if (text.startsWith('/start') || text.startsWith('/admin')) {
        return;
    }

    // Buyurtma jarayonida bo'lsa (AWAITING_...)
    if (state.step && state.step.startsWith('AWAITING_')) {
        const handled = await handleOrderStepText(bot, msg, userState);
        if (handled !== false) return;
    }

    // Qidiruv rejimida bo'lsa
    if (state.step === 'SEARCHING') {
        state.step = null;
        if (text === '❌ Bekor qilish') {
            return bot.sendMessage(chatId, 'Qidiruv bekor qilindi.', mainMenu);
        }
        return searchProducts(bot, chatId, text);
    }

    // Asosiy menyu tugmalari
    switch (text) {
        case '🛍 Katalog':
            state.step = null;
            return showCategories(bot, chatId);

        case '🔍 Qidiruv':
            state.step = 'SEARCHING';
            return bot.sendMessage(chatId, '🔍 Qidirmoqchi bo‘lgan mahsulot nomini yozing (masalan: <i>Arduino, Servo, Sensor</i>):', {
                parse_mode: 'HTML',
                ...cancelKeyboard
            });

        case '🛒 Savat':
            state.step = null;
            return showCart(bot, chatId, userState);

        case '📦 Buyurtmalarim':
            state.step = null;
            return showUserOrders(bot, chatId, userState);

        case '📡 Sensorlar va kontrollerlar':
            state.step = null;
            return showSensorsMenu(bot, chatId);

        case '📞 Aloqa':
            state.step = null;
            const contactText = `📞 <b>RoboSale bilan aloqa:</b>\n\n` +
                `📍 <b>Manzil:</b> Beruniy shahri\n` +
                `📱 <b>Telefon:</b> +998 90 123 45 67\n` +
                `🌐 <b>Sayt:</b> ${websiteUrl}\n` +
                `📲 <b>Instagram:</b> @robosale_uz\n` +
                `⏰ <b>Ish vaqti:</b> 9:00 - 18:00 (Dushanba - Shanba)\n\n` +
                `Savollaringiz yoki takliflaringiz bo‘lsa, bemalol murojaat qilishingiz mumkin! 🤝`;
            return bot.sendMessage(chatId, contactText, {
                parse_mode: 'HTML',
                ...mainMenu
            });

        case '❌ Bekor qilish':
            state.step = null;
            return bot.sendMessage(chatId, 'Bosh menyuga qaytildi.', mainMenu);

        default:
            // Agar admin buyurtma raqamini yozsa (RB...)
            if (isAdmin(msg.from.id, adminId) && (text.toUpperCase().startsWith('RB') || text.startsWith('#RB'))) {
                return searchOrderByNumber(bot, chatId, text.toUpperCase());
            }
            break;
    }
});

// Inline tugmalar (Callback Query) qayta ishlash
bot.on('callback_query', async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const state = getUserState(userState, chatId);

    try {
        // Savatga qo'shish
        if (data.startsWith('add_cart_')) {
            const productId = data.replace('add_cart_', '');
            const res = await addToCart(userState, chatId, productId);
            if (res.success) {
                await bot.answerCallbackQuery(query.id, {
                    text: `✅ ${res.productName} savatga qo‘shildi! (Jami: ${res.totalItems} ta)`,
                    show_alert: false
                });
            } else {
                await bot.answerCallbackQuery(query.id, { text: res.message, show_alert: true });
            }
            return;
        }

        // Mahsulot tafsilotlari
        if (data.startsWith('detail_')) {
            const productId = data.replace('detail_', '');
            await bot.answerCallbackQuery(query.id);
            return showProductDetail(bot, chatId, productId);
        }

        // Kategoriya mahsulotlari (sahifalash bilan: cat_<category>_<page>)
        if (data.startsWith('cat_')) {
            const parts = data.split('_');
            const category = parts[1];
            const page = parseInt(parts[2] || '0', 10);
            await bot.answerCallbackQuery(query.id);
            return showCategoryProducts(bot, chatId, category, page);
        }

        // Barcha kategoriyalarni ko'rsatish
        if (data === 'show_all_cats') {
            await bot.answerCallbackQuery(query.id);
            return showCategories(bot, chatId);
        }

        // Savat ichidagi miqdorni oshirish
        if (data.startsWith('cart_inc_')) {
            const productId = data.replace('cart_inc_', '');
            changeQuantity(userState, chatId, productId, 1);
            await bot.answerCallbackQuery(query.id);
            return showCart(bot, chatId, userState, messageId);
        }

        // Savat ichidagi miqdorni kamaytirish
        if (data.startsWith('cart_dec_')) {
            const productId = data.replace('cart_dec_', '');
            changeQuantity(userState, chatId, productId, -1);
            await bot.answerCallbackQuery(query.id);
            return showCart(bot, chatId, userState, messageId);
        }

        // Savatdan mahsulotni o'chirish
        if (data.startsWith('cart_del_')) {
            const productId = data.replace('cart_del_', '');
            removeFromCart(userState, chatId, productId);
            await bot.answerCallbackQuery(query.id, { text: 'Mahsulot o‘chirildi' });
            return showCart(bot, chatId, userState, messageId);
        }

        // Savatni tozalash
        if (data === 'cart_clear') {
            clearCart(userState, chatId);
            await bot.answerCallbackQuery(query.id, { text: 'Savat tozalandi' });
            return showCart(bot, chatId, userState, messageId);
        }

        // Buyurtmani boshlash
        if (data === 'start_order') {
            await bot.answerCallbackQuery(query.id);
            return startOrderFlow(bot, chatId, userState);
        }

        // Shahar tanlash
        if (data.startsWith('city_')) {
            const city = data.replace('city_', '');
            await bot.answerCallbackQuery(query.id);
            return handleCitySelection(bot, chatId, city, userState, messageId);
        }

        // To'lov turi tanlash
        if (data.startsWith('pay_')) {
            const paymentMethod = data.replace('pay_', '');
            await bot.answerCallbackQuery(query.id);
            return handlePaymentSelection(bot, chatId, paymentMethod, userState, messageId);
        }

        // Buyurtmani tasdiqlash
        if (data === 'confirm_order_yes') {
            await bot.answerCallbackQuery(query.id, { text: 'Buyurtma rasmiylashtirilmoqda...' });
            try {
                await bot.deleteMessage(chatId, messageId);
            } catch (e) { }
            return finalizeOrder(bot, chatId, userState, adminId);
        }

        // Buyurtmani bekor qilish
        if (data === 'confirm_order_no') {
            state.step = null;
            state.formData = {};
            await bot.answerCallbackQuery(query.id, { text: 'Buyurtma bekor qilindi' });
            try {
                await bot.deleteMessage(chatId, messageId);
            } catch (e) { }
            return bot.sendMessage(chatId, 'Buyurtma berish bekor qilindi.', mainMenu);
        }

        // Sensorlar bo'limi
        if (data === 'menu_sensors') {
            await bot.answerCallbackQuery(query.id);
            return showSensorsMenu(bot, chatId);
        }

        // Sensor/kontroller texnik hujjati
        if (data.startsWith('doc_')) {
            await bot.answerCallbackQuery(query.id);
            return showDocDetail(bot, chatId, data);
        }

        // Datasheet so'rash
        if (data.startsWith('req_datasheet_')) {
            return handleDatasheetRequest(bot, query, adminId);
        }

        // Admin: buyurtma holatini o'zgartirish
        if (data.startsWith('adm_status_')) {
            return handleAdminStatusChange(bot, query, adminId);
        }

        // Admin: so'nggi 5 buyurtma
        if (data === 'adm_recent_orders') {
            await bot.answerCallbackQuery(query.id);
            return showAdminOrdersList(bot, chatId);
        }

        // Admin: kutilayotgan buyurtmalar
        if (data === 'adm_pending_orders') {
            await bot.answerCallbackQuery(query.id);
            return showAdminOrdersList(bot, chatId, 'pending');
        }

        // Admin: dashboardni yangilash
        if (data === 'adm_refresh') {
            await bot.answerCallbackQuery(query.id, { text: 'Yangilandi' });
            try {
                await bot.deleteMessage(chatId, messageId);
            } catch (e) { }
            return showAdminDashboard(bot, chatId);
        }

        // Bo'sh tugma bosilganda
        if (data === 'noop') {
            return bot.answerCallbackQuery(query.id);
        }

        await bot.answerCallbackQuery(query.id);
    } catch (err) {
        console.error('Callback query xatolik:', err);
        try {
            await bot.answerCallbackQuery(query.id, { text: 'Xatolik yuz berdi' });
        } catch (e) { }
    }
});

// Xatoliklarni ushlash
bot.on('polling_error', (error) => {
    // 409 xatosi (Conflict: terminated by other getUpdates) chiqmasligi uchun log qilish
    if (error.code !== 'EFATAL') {
        console.error('Polling xatolik:', error.code, error.message);
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
