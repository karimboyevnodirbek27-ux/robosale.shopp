// handlers/cart.js
const Product = require('../models/Product');
const { formatPrice } = require('./catalog');

// Foydalanuvchi ma'lumotlarini olish / yaratish
function getUserState(userStateMap, chatId) {
    if (!userStateMap.has(chatId)) {
        userStateMap.set(chatId, {
            cart: [],
            step: null,
            formData: {}
        });
    }
    return userStateMap.get(chatId);
}

// Savatga mahsulot qo'shish
async function addToCart(userStateMap, chatId, productId) {
    const state = getUserState(userStateMap, chatId);
    const product = await Product.findById(productId);
    if (!product) return { success: false, message: 'Mahsulot topilmadi' };

    const existingIndex = state.cart.findIndex(item => item.productId.toString() === productId.toString());
    if (existingIndex > -1) {
        state.cart[existingIndex].quantity += 1;
    } else {
        state.cart.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }

    return {
        success: true,
        productName: product.name,
        totalItems: state.cart.reduce((sum, i) => sum + i.quantity, 0)
    };
}

// Miqdorni o'zgartirish (+1 yoki -1)
function changeQuantity(userStateMap, chatId, productId, delta) {
    const state = getUserState(userStateMap, chatId);
    const itemIndex = state.cart.findIndex(i => i.productId.toString() === productId.toString());
    if (itemIndex === -1) return false;

    state.cart[itemIndex].quantity += delta;
    if (state.cart[itemIndex].quantity <= 0) {
        state.cart.splice(itemIndex, 1);
    }
    return true;
}

// Mahsulotni butunlay o'chirish
function removeFromCart(userStateMap, chatId, productId) {
    const state = getUserState(userStateMap, chatId);
    state.cart = state.cart.filter(i => i.productId.toString() !== productId.toString());
}

// Savatni tozalash
function clearCart(userStateMap, chatId) {
    const state = getUserState(userStateMap, chatId);
    state.cart = [];
}

// Savat hisob-kitobi
function calculateCartTotals(cart) {
    const itemsTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // Masalan, 300,000 so'mdan oshsa bepul, aks holda 25,000 so'm yetkazish
    const shippingCost = itemsTotal > 300000 || itemsTotal === 0 ? 0 : 25000;
    const totalAmount = itemsTotal + shippingCost;
    return { itemsTotal, shippingCost, totalAmount };
}

// Savatni ko'rsatish
async function showCart(bot, chatId, userStateMap, messageId = null) {
    const state = getUserState(userStateMap, chatId);

    if (!state.cart || state.cart.length === 0) {
        const emptyText = `🛒 <b>Sizning savatingiz bo‘sh!</b>\n\nMahsulotlar qo‘shish uchun katalogdan foydalaning.`;
        const emptyKeyboard = {
            inline_keyboard: [
                [{ text: '🛍 Katalogga o‘tish', callback_data: 'show_all_cats' }]
            ]
        };
        if (messageId) {
            try {
                return await bot.editMessageText(emptyText, {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: 'HTML',
                    reply_markup: emptyKeyboard
                });
            } catch (e) { }
        }
        return await bot.sendMessage(chatId, emptyText, {
            parse_mode: 'HTML',
            reply_markup: emptyKeyboard
        });
    }

    const { itemsTotal, shippingCost, totalAmount } = calculateCartTotals(state.cart);

    let text = `🛒 <b>Sizning savatingiz:</b>\n\n`;
    const inline_keyboard = [];

    state.cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        text += `${index + 1}. <b>${item.name}</b>\n`;
        text += `   ${formatPrice(item.price)} × ${item.quantity} = <b>${formatPrice(itemSubtotal)}</b>\n\n`;

        // Har bir mahsulot uchun boshqaruv tugmalari
        inline_keyboard.push([
            { text: `➖`, callback_data: `cart_dec_${item.productId}` },
            { text: `${item.name.slice(0, 15)}: ${item.quantity} ta`, callback_data: `noop` },
            { text: `➕`, callback_data: `cart_inc_${item.productId}` },
            { text: `🗑`, callback_data: `cart_del_${item.productId}` }
        ]);
    });

    text += `───────────────\n`;
    text += `📦 Mahsulotlar: <b>${formatPrice(itemsTotal)}</b>\n`;
    text += `🚚 Yetkazib berish: <b>${shippingCost === 0 ? "Bepul" : formatPrice(shippingCost)}</b>\n`;
    text += `💰 Jami to‘lov: <b>${formatPrice(totalAmount)}</b>\n`;

    // Pastki tugmalar
    inline_keyboard.push([
        { text: '✅ Buyurtma berish', callback_data: 'start_order' }
    ]);
    inline_keyboard.push([
        { text: '🗑 Savatni tozalash', callback_data: 'cart_clear' },
        { text: '🛍 Katalog', callback_data: 'show_all_cats' }
    ]);

    if (messageId) {
        try {
            return await bot.editMessageText(text, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: { inline_keyboard }
            });
        } catch (e) { }
    }

    return await bot.sendMessage(chatId, text, {
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard }
    });
}

module.exports = {
    getUserState,
    addToCart,
    changeQuantity,
    removeFromCart,
    clearCart,
    calculateCartTotals,
    showCart
};
