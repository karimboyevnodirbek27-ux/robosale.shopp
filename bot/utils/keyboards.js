// utils/keyboards.js

// Asosiy menyu (Reply Keyboard)
const mainMenu = {
    reply_markup: {
        keyboard: [
            [{ text: '🛍 Katalog' }, { text: '🔍 Qidiruv' }],
            [{ text: '🛒 Savat' }, { text: '📦 Buyurtmalarim' }],
            [{ text: '📡 Sensorlar va kontrollerlar' }, { text: '📞 Aloqa' }]
        ],
        resize_keyboard: true
    }
};

// Telefon raqam so'rash klaviaturasi
const phoneKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: '📱 Raqamni ulashish', request_contact: true }],
            [{ text: '❌ Bekor qilish' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};

// Bekor qilish klaviaturasi
const cancelKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: '❌ Bekor qilish' }]
        ],
        resize_keyboard: true
    }
};

// Kategoriyalar (Inline Keyboard)
const categoriesKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: '⚡ Arduino & Platalar', callback_data: 'cat_arduino_0' },
                { text: '📡 Sensorlar', callback_data: 'cat_sensors_0' }
            ],
            [
                { text: '⚙️ Motorlar & Drayverlar', callback_data: 'cat_motors_0' },
                { text: '🔌 Modullar', callback_data: 'cat_modules_0' }
            ],
            [
                { text: '🤖 To‘plamlar (Kits)', callback_data: 'cat_kits_0' },
                { text: '🔋 Quvvat manbalari', callback_data: 'cat_power_0' }
            ],
            [
                { text: '🧵 Kabellar', callback_data: 'cat_cables_0' },
                { text: '🧰 Asboblar & Boshqa', callback_data: 'cat_tools_0' }
            ]
        ]
    }
};

// Shaharlar (Inline Keyboard)
const citiesKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'Toshkent', callback_data: 'city_Toshkent' }, { text: 'Samarqand', callback_data: 'city_Samarqand' }],
            [{ text: 'Buxoro', callback_data: 'city_Buxoro' }, { text: 'Nukus', callback_data: 'city_Nukus' }],
            [{ text: 'Beruniy', callback_data: 'city_Beruniy' }, { text: 'Urganch', callback_data: 'city_Urganch' }],
            [{ text: 'Andijon', callback_data: 'city_Andijon' }, { text: 'Namangan', callback_data: 'city_Namangan' }],
            [{ text: 'Farg‘ona', callback_data: 'city_Farg‘ona' }, { text: 'Boshqa shahar', callback_data: 'city_Boshqa' }]
        ]
    }
};

// To'lov usullari (Inline Keyboard)
const paymentKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '💳 Payme', callback_data: 'pay_payme' }, { text: '💳 Click', callback_data: 'pay_click' }],
            [{ text: '💵 Naqd pul (Qabul qilganda)', callback_data: 'pay_cash' }]
        ]
    }
};

// Buyurtmani tasdiqlash
const confirmOrderKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: '✅ Tasdiqlash', callback_data: 'confirm_order_yes' },
                { text: '❌ Bekor qilish', callback_data: 'confirm_order_no' }
            ]
        ]
    }
};

// Sensorlar va kontrollerlar submenyu
const sensorsSubmenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '🛒 Sensor va kontrollerlar katalogi', callback_data: 'cat_sensors_0' }],
            [{ text: '📚 Arduino Uno ma’lumotlari', callback_data: 'doc_arduino_uno' }],
            [{ text: '📚 DHT11 sensor ma’lumotlari', callback_data: 'doc_dht11' }],
            [{ text: '📚 HC-SR04 ultrasonic ma’lumotlari', callback_data: 'doc_hcsr04' }],
            [{ text: '📚 PIR sensor ma’lumotlari', callback_data: 'doc_pir' }],
            [{ text: '📚 L298N motor driver ma’lumotlari', callback_data: 'doc_l298n' }],
            [{ text: '📚 ESP8266 WiFi ma’lumotlari', callback_data: 'doc_esp8266' }]
        ]
    }
};

// Admin buyurtma holati tugmalari
function getAdminOrderKeyboard(orderId) {
    return {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '✅ Qabul qilish', callback_data: `adm_status_${orderId}_confirmed` },
                    { text: '🔄 Tayyorlanmoqda', callback_data: `adm_status_${orderId}_processing` }
                ],
                [
                    { text: '🚚 Yo‘lda', callback_data: `adm_status_${orderId}_shipped` },
                    { text: '🏁 Yetkazildi', callback_data: `adm_status_${orderId}_delivered` }
                ],
                [
                    { text: '❌ Bekor qilish', callback_data: `adm_status_${orderId}_cancelled` }
                ]
            ]
        }
    };
}

module.exports = {
    mainMenu,
    phoneKeyboard,
    cancelKeyboard,
    categoriesKeyboard,
    citiesKeyboard,
    paymentKeyboard,
    confirmOrderKeyboard,
    sensorsSubmenu,
    getAdminOrderKeyboard
};
