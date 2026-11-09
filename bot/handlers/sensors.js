// handlers/sensors.js
const { sensorsSubmenu } = require('../utils/keyboards');

// Texnik hujjatlar va ma'lumotlar bazasi
const DOCS = {
    doc_arduino_uno: {
        title: '🤖 Arduino Uno R3',
        description: `<b>Arduino Uno R3</b> — ATmega328P mikrokontrolleriga asoslangan eng mashhur plata.\n\n` +
            `🔹 <b>Texnik xususiyatlar:</b>\n` +
            `• Mikrokontroller: ATmega328P (16 MHz)\n` +
            `• Ishchi kuchlanish: 5V (Tavsiya etilgan kirish: 7-12V)\n` +
            `• Raqamli I/O pinlar: 14 ta (ulardan 6 tasi PWM)\n` +
            `• Analog kirishlar: 6 ta (A0-A5, 10-bit)\n` +
            `• Flesh xotira: 32 KB\n` +
            `• SRAM: 2 KB, EEPROM: 1 KB\n\n` +
            `📌 <b>Pinout:</b>\n` +
            `• Pin 0 (RX) va Pin 1 (TX) - Serial aloqa\n` +
            `• Pin 2 va 3 - Tashqi uzilishlar (Interrupts)\n` +
            `• Pin 3, 5, 6, 9, 10, 11 - PWM chiqishlari\n` +
            `• Pin 13 - O‘rnatilgan LED indikatori`
    },
    doc_dht11: {
        title: '🌡 DHT11 Harorat va Namlik Sensori',
        description: `<b>DHT11</b> — xonadagi havo harorati va nisbiy namligini o‘lchovchi raqamli datchik.\n\n` +
            `🔹 <b>Xususiyatlar:</b>\n` +
            `• Namlik diapazoni: 20-90% RH (aniqlik: ±5%)\n` +
            `• Harorat diapazoni: 0-50°C (aniqlik: ±2°C)\n` +
            `• Ishchi kuchlanish: 3.3V - 5V DC\n` +
            `• Signal turi: Raqamli bitta simli (Single-bus)\n\n` +
            `📌 <b>Ulanish sxemasi:</b>\n` +
            `• VCC → Arduino 5V\n` +
            `• GND → Arduino GND\n` +
            `• DATA → Arduino Digital Pin 2 (10k rezistor bilan pull-up tavsiya etiladi)\n\n` +
            `💻 <b>Kod namunasi:</b>\n` +
            `<pre>` +
            `#include "DHT.h"\n` +
            `#define DHTPIN 2\n` +
            `#define DHTTYPE DHT11\n` +
            `DHT dht(DHTPIN, DHTTYPE);\n\n` +
            `void setup() {\n` +
            `  Serial.begin(9600);\n` +
            `  dht.begin();\n` +
            `}\n` +
            `void loop() {\n` +
            `  float h = dht.readHumidity();\n` +
            `  float t = dht.readTemperature();\n` +
            `  Serial.print("Namlik: "); Serial.print(h);\n` +
            `  Serial.print("% Harorat: "); Serial.println(t);\n` +
            `  delay(2000);\n` +
            `}` +
            `</pre>`
    },
    doc_hcsr04: {
        title: '📏 HC-SR04 Ultratovushli Masofa Sensori',
        description: `<b>HC-SR04</b> — 2 sm dan 400 sm gacha bo‘lgan masofani kontaktsiz o‘lchash uchun ultratovushli sensor.\n\n` +
            `🔹 <b>Xususiyatlar:</b>\n` +
            `• O‘lchash masofasi: 2 cm - 400 cm\n` +
            `• Aniqlik: 3 mm gacha\n` +
            `• Ishchi chastota: 40 kHz\n` +
            `• Ishchi kuchlanish: 5V DC\n\n` +
            `📌 <b>Ulanish:</b>\n` +
            `• VCC → 5V\n` +
            `• Trig → Digital Pin 9\n` +
            `• Echo → Digital Pin 10\n` +
            `• GND → GND\n\n` +
            `💻 <b>Kod namunasi:</b>\n` +
            `<pre>` +
            `const int trigPin = 9;\n` +
            `const int echoPin = 10;\n` +
            `void setup() {\n` +
            `  pinMode(trigPin, OUTPUT);\n` +
            `  pinMode(echoPin, INPUT);\n` +
            `  Serial.begin(9600);\n` +
            `}\n` +
            `void loop() {\n` +
            `  digitalWrite(trigPin, LOW); delayMicroseconds(2);\n` +
            `  digitalWrite(trigPin, HIGH); delayMicroseconds(10);\n` +
            `  digitalWrite(trigPin, LOW);\n` +
            `  long duration = pulseIn(echoPin, HIGH);\n` +
            `  float distance = duration * 0.034 / 2;\n` +
            `  Serial.print("Masofa: "); Serial.print(distance); Serial.println(" cm");\n` +
            `  delay(500);\n` +
            `}` +
            `</pre>`
    },
    doc_pir: {
        title: '🚶 HC-SR501 PIR Harakat Sensori',
        description: `<b>PIR sensori</b> — inson va hayvonlar tanasidan chiquvchi infraqizil nurlanish (issiqlik) harakatini aniqlaydi.\n\n` +
            `🔹 <b>Xususiyatlar:</b>\n` +
            `• Sezgirlik masofasi: 3 - 7 metr (potensiometr orqali sozlanadi)\n` +
            `• Ko‘rish burchagi: < 120°\n` +
            `• Chiqish signali: HIGH (3.3V) / LOW (0V)\n\n` +
            `📌 <b>Ulanish:</b>\n` +
            `• VCC → 5V\n` +
            `• OUT → Digital Pin 2\n` +
            `• GND → GND\n\n` +
            `💻 <b>Kod namunasi:</b>\n` +
            `<pre>` +
            `int pirPin = 2;\n` +
            `void setup() {\n` +
            `  pinMode(pirPin, INPUT);\n` +
            `  Serial.begin(9600);\n` +
            `}\n` +
            `void loop() {\n` +
            `  if (digitalRead(pirPin) == HIGH) {\n` +
            `    Serial.println("Harakat aniqlandi!");\n` +
            `  }\n` +
            `  delay(200);\n` +
            `}` +
            `</pre>`
    },
    doc_l298n: {
        title: '🏎 L298N Motor Drayveri',
        description: `<b>L298N</b> — 2 ta doimiy tok (DC) motorini yoki 1 ta 4-fazali qadamli (stepper) motorni boshqarish uchun kuchli drayver.\n\n` +
            `🔹 <b>Xususiyatlar:</b>\n` +
            `• Maksimal kuchlanish: 46V gacha\n` +
            `• Maksimal oqim: har bir kanal uchun 2A\n` +
            `• O‘rnatilgan 5V kuchlanish stabilizatori (78M05)\n\n` +
            `📌 <b>Ulanish:</b>\n` +
            `• IN1 & IN2 → Motor A yo‘nalishi\n` +
            `• IN3 & IN4 → Motor B yo‘nalishi\n` +
            `• ENA & ENB → Tezlikni boshqarish (PWM)\n` +
            `• VMS (12V) → Motorlar tashqi quvvat manbai\n` +
            `• GND → Umumiy yer (Arduino GND bilan ulanishi shart!)`
    },
    doc_esp8266: {
        title: '📶 ESP8266 ESP-01 WiFi Moduli',
        description: `<b>ESP8266</b> — mikrokontrollerlarni internetga yoki mahalliy WiFi tarmoqqa ulash uchun arzon va kuchli modul.\n\n` +
            `🔹 <b>Xususiyatlar:</b>\n` +
            `• Standart: 802.11 b/g/n (2.4 GHz)\n` +
            `• Ishchi kuchlanish: <b>Faqat 3.3V</b> (5V ulasangiz kuyib ketadi!)\n` +
            `• Protokollar: TCP/IP, UDP, HTTP, MQTT\n\n` +
            `📌 <b>Asosiy AT buyruqlari:</b>\n` +
            `• <code>AT</code> → OK (aloqani tekshirish)\n` +
            `• <code>AT+CWMODE=1</code> → Klient rejimiga o‘tish\n` +
            `• <code>AT+CWJAP="WiFi_Nomi","Parol"</code> → WiFi tarmog‘iga ulanish\n` +
            `• <code>AT+CIFSR</code> → Olingan IP manzilni ko‘rish`
    }
};

// Menyu chiqarish
async function showSensorsMenu(bot, chatId) {
    const text = `📡 <b>Sensorlar, Kontrollerlar va Datchiklar Bo‘limi</b>\n\n` +
        `Bu yerda siz robototexnika komponentlarining texnik xususiyatlari, ulanish sxemalari va kod namunalari bilan tanishishingiz mumkin.\n\n` +
        `Kerakli bo‘limni tanlang:`;

    return bot.sendMessage(chatId, text, {
        parse_mode: 'HTML',
        ...sensorsSubmenu
    });
}

// Tanlangan komponent ma'lumotlarini ko'rsatish
async function showDocDetail(bot, chatId, docKey) {
    const doc = DOCS[docKey];
    if (!doc) {
        return bot.sendMessage(chatId, 'Ma’lumot topilmadi.');
    }

    const inline_keyboard = [
        [{ text: '📋 Datasheet / Yordam so‘rash', callback_data: `req_datasheet_${docKey}` }],
        [{ text: '◀️ Orqaga', callback_data: 'menu_sensors' }]
    ];

    return bot.sendMessage(chatId, doc.description, {
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard }
    });
}

// Datasheet so'rash funksiyasi
async function handleDatasheetRequest(bot, query, adminId) {
    const chatId = query.message.chat.id;
    const docKey = query.data.replace('req_datasheet_', '');
    const doc = DOCS[docKey];
    const user = query.from;

    const username = user.username ? `@${user.username}` : `${user.first_name || ''} ${user.last_name || ''}`;

    await bot.answerCallbackQuery(query.id, {
        text: 'So‘rovingiz qabul qilindi!',
        show_alert: true
    });

    await bot.sendMessage(chatId, `✅ <b>${doc ? doc.title : 'Komponent'}</b> bo‘yicha to‘liq datasheet so‘rovingiz qabul qilindi. Menejerimiz tez orada siz bilan bog‘lanadi yoki faylni yuboradi!`, {
        parse_mode: 'HTML'
    });

    if (adminId) {
        const adminAlert = `📋 <b>DATASHEET SO‘ROVI!</b>\n\n` +
            `👤 Mijoz: <b>${username}</b> (ID: <code>${user.id}</code>)\n` +
            `📦 Komponent: <b>${doc ? doc.title : docKey}</b>\n` +
            `⏰ Vaqt: ${new Date().toLocaleString('uz-UZ')}`;

        try {
            await bot.sendMessage(adminId, adminAlert, { parse_mode: 'HTML' });
        } catch (e) {
            console.error('Adminga datasheet so‘rovi yuborilmadi:', e.message);
        }
    }
}

module.exports = {
    showSensorsMenu,
    showDocDetail,
    handleDatasheetRequest
};
