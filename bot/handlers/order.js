// handlers/order.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const { formatPrice } = require('./catalog');
const { calculateCartTotals, clearCart, getUserState } = require('./cart');
const {
    mainMenu,
    phoneKeyboard,
    cancelKeyboard,
    citiesKeyboard,
    paymentKeyboard,
    confirmOrderKeyboard,
    getAdminOrderKeyboard
} = require('../utils/keyboards');

// Status emojilari va matnlari
const STATUS_MAP = {
    pending: '⏳ Kutilmoqda',
    confirmed: '✅ Qabul qilindi',
    processing: '🔄 Tayyorlanmoqda',
    shipped: '🚚 Yo‘lda',
    delivered: '✅ Yetkazildi',
    cancelled: '❌ Bekor qilingan'
};

// Buyurtma jarayonini boshlash
async function startOrderFlow(bot, chatId, userStateMap) {
    const state = getUserState(userStateMap, chatId);
    if (!state.cart || state.cart.length === 0) {
        return bot.sendMessage(chatId, 'Buyurtma berish uchun avval savatga mahsulot qo‘shing.', mainMenu);
    }

    state.step = 'AWAITING_FIRST_NAME';
    state.formData = {
        items: [...state.cart]
    };

    return bot.sendMessage(chatId, '📝 <b>Buyurtmani rasmiylashtirish (1/6)</b>\n\nIltimos, ismingizni kiriting:', {
        parse_mode: 'HTML',
        ...cancelKeyboard
    });
}

// Matnli xabarlar bo'yicha buyurtma qadamlarini boshqarish
async function handleOrderStepText(bot, msg, userStateMap) {
    const chatId = msg.chat.id;
    const text = msg.text ? msg.text.trim() : '';
    const state = getUserState(userStateMap, chatId);

    if (text === '❌ Bekor qilish') {
        state.step = null;
        state.formData = {};
        return bot.sendMessage(chatId, 'Buyurtma rasmiylashtirish bekor qilindi.', mainMenu);
    }

    // 1-qadam: Ism
    if (state.step === 'AWAITING_FIRST_NAME') {
        if (text.length < 2) {
            return bot.sendMessage(chatId, 'Iltimos, to‘g‘ri ism kiriting (kamida 2 harf):');
        }
        state.formData.firstName = text;
        state.step = 'AWAITING_LAST_NAME';
        return bot.sendMessage(chatId, 'Familiyangizni kiriting:', cancelKeyboard);
    }

    // 2-qadam: Familiya
    if (state.step === 'AWAITING_LAST_NAME') {
        if (text.length < 2) {
            return bot.sendMessage(chatId, 'Iltimos, to‘g‘ri familiya kiriting:');
        }
        state.formData.lastName = text;
        state.step = 'AWAITING_PHONE';
        return bot.sendMessage(chatId, '📱 Telefon raqamingizni yuboring yoki quyidagi formatda yozing (+998901234567):', phoneKeyboard);
    }

    // 3-qadam: Telefon (matn orqali kiritilsa)
    if (state.step === 'AWAITING_PHONE') {
        let phone = text;
        if (msg.contact && msg.contact.phone_number) {
            phone = msg.contact.phone_number;
        }
        if (!phone.startsWith('+')) {
            phone = '+' + phone;
        }
        if (phone.length < 9) {
            return bot.sendMessage(chatId, 'Iltimos, telefon raqamingizni to‘g‘ri formatda yuboring:', phoneKeyboard);
        }

        state.formData.phone = phone;
        state.step = 'AWAITING_CITY';

        return bot.sendMessage(chatId, '📍 Qaysi shaharga yetkazib berilsin? Shahringizni tanlang:', citiesKeyboard);
    }

    // 5-qadam: To'liq manzil
    if (state.step === 'AWAITING_ADDRESS') {
        if (text.length < 4) {
            return bot.sendMessage(chatId, 'Iltimos, aniqroq manzil kiriting (ko‘cha, uy raqami):');
        }
        state.formData.address = text;
        state.step = 'AWAITING_PAYMENT';

        return bot.sendMessage(chatId, '💳 To‘lov usulini tanlang:', paymentKeyboard);
    }

    return false;
}

// Kontakt (telefon raqam) yuborilganda
async function handleOrderContact(bot, msg, userStateMap) {
    const chatId = msg.chat.id;
    const state = getUserState(userStateMap, chatId);
    if (state.step === 'AWAITING_PHONE') {
        let phone = msg.contact.phone_number;
        if (!phone.startsWith('+')) {
            phone = '+' + phone;
        }
        state.formData.phone = phone;
        state.step = 'AWAITING_CITY';

        return bot.sendMessage(chatId, '📍 Qaysi shaharga yetkazib berilsin? Shahringizni tanlang:', citiesKeyboard);
    }
}

// Shahar tanlanganda
async function handleCitySelection(bot, chatId, city, userStateMap, messageId) {
    const state = getUserState(userStateMap, chatId);
    state.formData.city = city;
    state.step = 'AWAITING_ADDRESS';

    if (messageId) {
        try {
            await bot.deleteMessage(chatId, messageId);
        } catch (e) { }
    }

    return bot.sendMessage(chatId, `Tanlangan shahar: <b>${city}</b>\n\nEndi ko‘cha, uy/xonadon raqami kabi aniq yetkazib berish manzilingizni yozing:`, {
        parse_mode: 'HTML',
        ...cancelKeyboard
    });
}

// To'lov usuli tanlanganda
async function handlePaymentSelection(bot, chatId, paymentMethod, userStateMap, messageId) {
    const state = getUserState(userStateMap, chatId);
    state.formData.paymentMethod = paymentMethod;
    state.step = 'CONFIRM_ORDER';

    if (messageId) {
        try {
            await bot.deleteMessage(chatId, messageId);
        } catch (e) { }
    }

    const { itemsTotal, shippingCost, totalAmount } = calculateCartTotals(state.formData.items);
    state.formData.itemsTotal = itemsTotal;
    state.formData.shippingCost = shippingCost;
    state.formData.totalAmount = totalAmount;

    let payText = '💵 Naqd pul';
    if (paymentMethod === 'payme') payText = '💳 Payme';
    if (paymentMethod === 'click') payText = '💳 Click';

    let summary = `📋 <b>Buyurtmani tasdiqlash</b>\n\n`;
    summary += `👤 <b>Mijoz:</b> ${state.formData.firstName} ${state.formData.lastName}\n`;
    summary += `📱 <b>Telefon:</b> ${state.formData.phone}\n`;
    summary += `📍 <b>Yetkazish manzili:</b> ${state.formData.city}, ${state.formData.address}\n`;
    summary += `💳 <b>To‘lov turi:</b> ${payText}\n\n`;
    summary += `🛍 <b>Mahsulotlar:</b>\n`;

    state.formData.items.forEach(item => {
        summary += `  • ${item.name} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}\n`;
    });

    summary += `\n📦 Mahsulotlar summasi: <b>${formatPrice(itemsTotal)}</b>\n`;
    summary += `🚚 Yetkazib berish: <b>${shippingCost === 0 ? 'Bepul' : formatPrice(shippingCost)}</b>\n`;
    summary += `💰 <b>Jami to‘lov: ${formatPrice(totalAmount)}</b>\n\n`;
    summary += `Ma’lumotlar to‘g‘rimi? Tasdiqlaysizmi?`;

    return bot.sendMessage(chatId, summary, {
        parse_mode: 'HTML',
        ...confirmOrderKeyboard
    });
}

// Buyurtmani yakuniy tasdiqlash va bazaga saqlash
async function finalizeOrder(bot, chatId, userStateMap, adminId) {
    const state = getUserState(userStateMap, chatId);
    if (!state.formData || !state.formData.items) {
        return bot.sendMessage(chatId, 'Buyurtma ma’lumotlari topilmadi.', mainMenu);
    }

    const decremented = [];
    let orderSaved = false;

    try {
        const orderItems = [];

        // Omborni tekshirish va atomik kamaytirish.
        // Narxlar bazadan olinadi, savatdagi eski narxga ishonilmaydi.
        for (const item of state.formData.items) {
            const quantity = Number(item.quantity);
            const updated = await Product.findOneAndUpdate(
                {
                    _id: item.productId,
                    inStock: { $ne: false },
                    stockCount: { $gte: quantity }
                },
                { $inc: { stockCount: -quantity } },
                { new: true }
            );

            if (!updated) {
                for (const done of decremented) {
                    await Product.updateOne(
                        { _id: done.product },
                        { $inc: { stockCount: done.quantity }, $set: { inStock: true } }
                    );
                }
                return bot.sendMessage(
                    chatId,
                    `Kechirasiz, "${item.name}" mahsuloti omborda yetarli emas. Savatni yangilab, qayta urinib ko'ring.`,
                    mainMenu
                );
            }

            if (Number(updated.stockCount) <= 0) {
                await Product.updateOne({ _id: updated._id }, { $set: { inStock: false } });
            }

            decremented.push({ product: updated._id, quantity });
            orderItems.push({
                product: updated._id,
                name: updated.name,
                price: updated.price,
                quantity,
                image: updated.image
            });
        }

        const itemsTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shippingCost = Number(state.formData.shippingCost) || 0;
        const totalAmount = itemsTotal + shippingCost;

        const newOrder = new Order({
            telegramChatId: chatId,
            items: orderItems,
            shippingAddress: {
                firstName: state.formData.firstName,
                lastName: state.formData.lastName,
                phone: state.formData.phone,
                city: state.formData.city,
                address: state.formData.address
            },
            paymentMethod: state.formData.paymentMethod,
            itemsTotal,
            shippingCost,
            totalAmount,
            orderStatus: 'pending'
        });

        await newOrder.save();
        orderSaved = true;

        // Savat va holatni tozalash
        clearCart(userStateMap, chatId);
        state.step = null;
        state.formData = {};

        // Foydalanuvchiga muvaffaqiyat xabari
        const userMsg = `🎉 <b>Buyurtmangiz muvaffaqiyatli qabul qilindi!</b>\n\n` +
            `📋 Buyurtma raqamingiz: <b>#${newOrder.orderNumber}</b>\n` +
            `💰 Jami summa: <b>${formatPrice(newOrder.totalAmount)}</b>\n\n` +
            `Tez orada operatorimiz siz bilan bog‘lanadi. Xaridingiz uchun rahmat! 🤖`;

        await bot.sendMessage(chatId, userMsg, {
            parse_mode: 'HTML',
            ...mainMenu
        });

        // Adminga xabar yuborish
        if (adminId) {
            let adminMsg = `🛒 <b>YANGI BUYURTMA!</b>\n\n` +
                `📋 Buyurtma #: <b>${newOrder.orderNumber}</b>\n` +
                `👤 Mijoz: <b>${newOrder.shippingAddress.firstName} ${newOrder.shippingAddress.lastName}</b>\n` +
                `📱 Telefon: <b>${newOrder.shippingAddress.phone}</b>\n` +
                `📍 Manzil: ${newOrder.shippingAddress.city}, ${newOrder.shippingAddress.address}\n\n` +
                `🛍 <b>Mahsulotlar:</b>\n`;

            newOrder.items.forEach(i => {
                adminMsg += `  • ${i.name} × ${i.quantity} = ${formatPrice(i.price * i.quantity)}\n`;
            });

            adminMsg += `\n💰 Mahsulotlar: ${formatPrice(newOrder.itemsTotal)}\n` +
                `🚚 Yetkazib berish: ${formatPrice(newOrder.shippingCost)}\n` +
                `💵 <b>Jami summa: ${formatPrice(newOrder.totalAmount)}</b>\n` +
                `💳 To‘lov: <b>${newOrder.paymentMethod.toUpperCase()}</b>\n` +
                `⏰ Vaqt: ${new Date().toLocaleString('uz-UZ')}\n`;

            try {
                await bot.sendMessage(adminId, adminMsg, {
                    parse_mode: 'HTML',
                    ...getAdminOrderKeyboard(newOrder._id)
                });
            } catch (admErr) {
                console.error('Adminga xabar yuborishda xatolik:', admErr.message);
            }
        }

    } catch (err) {
        console.error('Buyurtma saqlashda xatolik:', err);

        // Buyurtma bazaga yozilmagan bo'lsa, omborni qaytaramiz.
        if (!orderSaved) {
            for (const done of decremented) {
                await Product.updateOne(
                    { _id: done.product },
                    { $inc: { stockCount: done.quantity }, $set: { inStock: true } }
                ).catch(() => {});
            }
        }

        await bot.sendMessage(chatId, 'Kechirasiz, buyurtmani saqlashda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.', mainMenu);
    }
}

// Foydalanuvchining o'z buyurtmalarini ko'rish
async function showUserOrders(bot, chatId, userStateMap) {
    const orders = await Order.find({ telegramChatId: chatId }).sort({ createdAt: -1 }).limit(10);

    if (orders.length === 0) {
        return bot.sendMessage(chatId, `📦 Sizda hali hech qanday buyurtma mavjud emas.\nMahsulotlarni tanlash uchun katalogga kiring.`, mainMenu);
    }

    let text = `📦 <b>Sizning so‘nggi buyurtmalaringiz:</b>\n\n`;

    orders.forEach(order => {
        const dateStr = new Date(order.createdAt).toLocaleDateString('uz-UZ');
        const statusText = STATUS_MAP[order.orderStatus] || order.orderStatus;
        text += `📋 <b>#${order.orderNumber}</b> (${dateStr})\n`;
        text += `   Holati: ${statusText}\n`;
        text += `   Summa: <b>${formatPrice(order.totalAmount)}</b>\n`;
        text += `   Mahsulotlar soni: ${order.items.length} xil\n\n`;
    });

    return bot.sendMessage(chatId, text, {
        parse_mode: 'HTML',
        ...mainMenu
    });
}

module.exports = {
    startOrderFlow,
    handleOrderStepText,
    handleOrderContact,
    handleCitySelection,
    handlePaymentSelection,
    finalizeOrder,
    showUserOrders,
    STATUS_MAP
};
