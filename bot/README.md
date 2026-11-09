# RoboSale Telegram bot

## Ishga tushirish (Windows)

1. `bot\.env` faylida quyidagilar bo'lishi kerak:
   ```
   TELEGRAM_BOT_TOKEN=...
   TELEGRAM_ADMIN_ID=...
   MONGODB_URI=mongodb://localhost:27017/robosale_db
   WEBSITE_URL=https://robosale.pages.dev
   ```
2. `start-bot.bat` faylini ikki marta bosing **yoki**:
   ```powershell
   cd C:\Users\adikcyber\Desktop\RoboSale\bot
   npm install
   node bot.js
   ```

Bot ishlayotganda:
```
✅ MongoDB ga muvaffaqiyatli ulandi
🤖 RoboSale bot ishga tushdi (polling)!
```

## Muhim

- Bot **faqat jarayon ishlab turganda** javob beradi. Kompyuter o'chsa yoki
  terminal yopilsa, tugmalar bosilganda hech qanday javob kelmaydi.
- Bir vaqtda **faqat bitta** `node bot.js` jarayoni ishlashi mumkin.
  Ikkinchisini ishga tushirsangiz `409 Conflict` xatosi chiqadi.
- Agar avval webhook o'rnatilgan bo'lsa, bot ishga tushishda uni avtomatik
  o'chiradi va polling rejimiga o'tadi.
- Telegram bot tokeni chatda ko'rsatilgan bo'lsa, @BotFather → `/revoke` orqali
  yangilang va yangi tokenni faqat `.env`ga yozing.

## 24/7 hosting (keyinroq)

Bepul variantlar:

1. **Render Web Service (webhook rejimi)** — botni kichik HTTP server bilan
   webhook sifatida ishga tushirish. Bepul reja 15 daqiqa harakatsizlikdan
   keyin uxlaydi, lekin Telegram xabar yuborganda uyg'onadi (30–60 soniya
   kechikish bo'lishi mumkin).
2. **Shaxsiy kompyuter + `start-bot.bat`** — eng oddiy, lekin kompyuter
   doim yoniq turishi kerak.
3. **VPS** — eng barqaror, lekin pullik.

Hozircha sayt bilan bir xil MongoDB bazasidan foydalanadi
(`robosale_db`). Production'da `MONGODB_URI` ni Atlas manziliga almashtiring.
