// handlers/catalog.js
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const { categoriesKeyboard } = require('../utils/keyboards');

const PAGE_SIZE = 5;

// Rasm yo'lini topish yordamchi funksiyasi
function getLocalImagePath(imageStr) {
    if (!imageStr) return null;
    if (imageStr.startsWith('http://') || imageStr.startsWith('https://')) {
        return imageStr;
    }
    // frontend/public or backend/uploads
    const cleanPath = imageStr.startsWith('/') ? imageStr.slice(1) : imageStr;
    const frontendPath = path.join(__dirname, '../../frontend/public', cleanPath);
    if (fs.existsSync(frontendPath) && !frontendPath.endsWith('.svg')) {
        return frontendPath;
    }
    const backendUploadPath = path.join(__dirname, '../../backend', cleanPath);
    if (fs.existsSync(backendUploadPath) && !backendUploadPath.endsWith('.svg')) {
        return backendUploadPath;
    }
    return null;
}

// Narxni chiroyli formatlash: 150000 -> 150,000 so'm
function formatPrice(price) {
    return Number(price || 0).toLocaleString('uz-UZ') + " so'm";
}

// Kategoriyalar menyusini ko'rsatish
async function showCategories(bot, chatId) {
    const text = `🛍 <b>RoboSale Mahsulotlar Katalogi</b>\n\nQuyidagi kategoriyalardan birini tanlang:`;
    return bot.sendMessage(chatId, text, {
        parse_mode: 'HTML',
        ...categoriesKeyboard
    });
}

// Mahsulot kartasini chiqarish
async function sendProductCard(bot, chatId, product) {
    const priceText = formatPrice(product.price);
    const oldPriceText = product.oldPrice ? `\n<s>Eski narxi: ${formatPrice(product.oldPrice)}</s>` : '';
    const stockText = product.stockCount > 0 ? `⚡ Omborda: ${product.stockCount} ta` : '❌ Omborda tugagan';

    const caption = `📦 <b>${product.name}</b>\n\n` +
        `💰 Narxi: <b>${priceText}</b>${oldPriceText}\n` +
        `📂 Kategoriya: <i>${product.category}</i>\n` +
        `${stockText}\n\n` +
        `📝 ${product.description ? product.description.slice(0, 150) + (product.description.length > 150 ? '...' : '') : ''}`;

    const inline_keyboard = [
        [
            { text: '🛒 Savatga', callback_data: `add_cart_${product._id}` },
            { text: 'ℹ️ Batafsil', callback_data: `detail_${product._id}` }
        ]
    ];

    const imagePath = getLocalImagePath(product.image);
    if (imagePath) {
        try {
            return await bot.sendPhoto(chatId, imagePath, {
                caption: caption,
                parse_mode: 'HTML',
                reply_markup: { inline_keyboard }
            });
        } catch (err) {
            console.error('Rasm yuborishda xatolik:', err.message);
        }
    }

    return await bot.sendMessage(chatId, caption, {
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard }
    });
}

// Kategoriya bo'yicha mahsulotlarni sahifalab ko'rsatish
async function showCategoryProducts(bot, chatId, category, page = 0, messageId = null) {
    const query = { category: category };
    const totalCount = await Product.countDocuments(query);

    if (totalCount === 0) {
        const text = `Ushbu kategoriyada hozircha mahsulotlar mavjud emas.`;
        if (messageId) {
            return bot.editMessageText(text, { chat_id: chatId, message_id: messageId });
        }
        return bot.sendMessage(chatId, text);
    }

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    const currentPage = Math.max(0, Math.min(page, totalPages - 1));

    const products = await Product.find(query)
        .skip(currentPage * PAGE_SIZE)
        .limit(PAGE_SIZE);

    await bot.sendMessage(chatId, `📂 <b>Kategoriya:</b> <i>${category.toUpperCase()}</i> (Jami: ${totalCount} ta)\n📄 Sahifa: ${currentPage + 1}/${totalPages}`, {
        parse_mode: 'HTML'
    });

    for (const prod of products) {
        await sendProductCard(bot, chatId, prod);
    }

    // Sahifalash tugmalari
    const navButtons = [];
    if (currentPage > 0) {
        navButtons.push({ text: '◀️ Oldingisi', callback_data: `cat_${category}_${currentPage - 1}` });
    }
    if (currentPage < totalPages - 1) {
        navButtons.push({ text: 'Keyingisi ▶️', callback_data: `cat_${category}_${currentPage + 1}` });
    }

    const markup = {
        inline_keyboard: [
            navButtons,
            [{ text: '📂 Boshqa kategoriyalar', callback_data: 'show_all_cats' }]
        ].filter(row => row.length > 0)
    };

    return bot.sendMessage(chatId, `Sahifa ${currentPage + 1}/${totalPages}`, {
        reply_markup: markup
    });
}

// Mahsulotning to'liq tavsifini ko'rsatish
async function showProductDetail(bot, chatId, productId) {
    const product = await Product.findById(productId);
    if (!product) {
        return bot.sendMessage(chatId, 'Kechirasiz, mahsulot topilmadi.');
    }

    let specs = '';
    if (product.specifications && product.specifications.size > 0) {
        specs = '\n<b>Texnik xususiyatlari:</b>\n';
        for (const [key, val] of product.specifications.entries()) {
            specs += `• ${key}: ${val}\n`;
        }
    }

    const priceText = formatPrice(product.price);
    const detailText = `📦 <b>${product.name}</b>\n\n` +
        `💰 Narxi: <b>${priceText}</b>\n` +
        `📂 Kategoriya: ${product.category}\n` +
        `⚡ Omborda: ${product.stockCount > 0 ? product.stockCount + ' ta' : 'Yo‘q'}\n\n` +
        `📝 <b>Tavsif:</b>\n${product.description || 'Tavsif yo‘q'}\n` +
        specs;

    const inline_keyboard = [
        [{ text: '🛒 Savatga qo‘shish', callback_data: `add_cart_${product._id}` }],
        [{ text: '◀️ Katalogga qaytish', callback_data: 'show_all_cats' }]
    ];

    const imagePath = getLocalImagePath(product.image);
    if (imagePath) {
        try {
            return await bot.sendPhoto(chatId, imagePath, {
                caption: detailText,
                parse_mode: 'HTML',
                reply_markup: { inline_keyboard }
            });
        } catch (e) {
            // fallback
        }
    }

    return bot.sendMessage(chatId, detailText, {
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard }
    });
}

// Qidiruv natijalari
async function searchProducts(bot, chatId, queryText) {
    if (!queryText || queryText.trim().length === 0) {
        return bot.sendMessage(chatId, 'Iltimos, qidirish uchun mahsulot nomini yozing:');
    }

    const regex = new RegExp(queryText.trim(), 'i');
    const products = await Product.find({ name: regex }).limit(10);

    if (products.length === 0) {
        return bot.sendMessage(chatId, `🔍 "<b>${queryText}</b>" bo‘yicha hech narsa topilmadi.\nBoshqa so‘z bilan qidirib ko‘ring yoki katalogdan tanlang.`, {
            parse_mode: 'HTML',
            ...categoriesKeyboard
        });
    }

    await bot.sendMessage(chatId, `🔍 "<b>${queryText}</b>" bo‘yicha topilgan mahsulotlar (${products.length} ta):`, {
        parse_mode: 'HTML'
    });

    for (const prod of products) {
        await sendProductCard(bot, chatId, prod);
    }
}

module.exports = {
    showCategories,
    showCategoryProducts,
    showProductDetail,
    sendProductCard,
    searchProducts,
    formatPrice
};
