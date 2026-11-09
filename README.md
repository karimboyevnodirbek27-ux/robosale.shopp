# RoboSale - Robotika Mahsulotlari Online Do'koni 🤖

O'zbekistondagi eng sifatli robotika mahsulotlari do'koni!

## 📦 Loyiha Tuzilishi

```
RoboSale/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/ # Qayta ishlatiladigan komponentlar
│   │   ├── pages/      # Sahifalar
│   │   ├── context/    # React Context (Cart)
│   │   ├── data/       # Statik ma'lumotlar
│   │   └── assets/     # Rasmlar va ikonlar
│   └── public/
│       └── images/     # Mahsulot rasmlari
├── backend/            # Express.js backend
│   ├── config/         # Konfiguratsiya
│   ├── models/         # MongoDB modellari
│   ├── routes/         # API routelari
│   └── server.js       # Asosiy server
├── bot/                # Telegram bot
│   ├── handlers/       # Katalog, savat, buyurtma, admin
│   ├── models/         # MongoDB modellari
│   ├── utils/          # Klaviaturalar
│   ├── bot.js          # Botning kirish nuqtasi
│   └── start-bot.bat   # Windows uchun ishga tushirish
└── README.md
```

## 🚀 Ishga Tushirish

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend http://localhost:7878 da ishlaydi.

`frontend/.env` faylida backend manzilini ko'rsating (namuna: `frontend/.env.example`):
```
VITE_API_URL=http://localhost:5000/api
```

### Backend
```bash
cd backend
npm install
npm run dev
```
Backend http://localhost:5000 da ishlaydi.

### Ma'lumotlar Bazasini To'ldirish
```bash
cd backend
npm run seed:products   # mahsulotlar
npm run seed:admin      # admin foydalanuvchisi (.env dagi ADMIN_* bo'yicha)
```

> `backend/.env` faylini `backend/.env.example` asosida yarating. Admin paroli va JWT secret hech qachon GitHub'ga yuborilmaydi.

### Telegram bot
```bash
cd bot
npm install
node bot.js
```
Windows'da `bot\start-bot.bat` faylini ikki marta bosish ham mumkin. Batafsil: [`bot/README.md`](./bot/README.md).

## 🛠 Texnologiyalar

### Frontend
- React 18
- Vite
- React Router DOM
- React Icons
- Vanilla CSS

### Backend
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- bcryptjs (Password hashing)

## 📱 Xususiyatlar

- ✅ Zamonaviy va responsive dizayn
- ✅ Mahsulotlarni ko'rish va qidirish
- ✅ Kategoriya bo'yicha filterlash
- ✅ Savatcha (localStorage)
- ✅ Checkout / Buyurtma berish
- ✅ Foydalanuvchi autentifikatsiyasi
- ✅ To'lov usullari (Payme, Click, Naqd)
- ✅ RESTful API

## 💳 To'lov Usullari

- Naqd pul (hozircha faol)
- Payme / Click / bo'lib to'lash (tez orada — merchant akkaunt kerak)

## 🚀 Bepul deploy

Cloudflare Pages + Render + MongoDB Atlas bo'yicha to'liq qo'llanma: [`DEPLOY.md`](./DEPLOY.md).

## 🔐 Xavfsizlik

- Admin API'lari JWT bilan himoyalangan (`protect` + `adminOnly`).
- Buyurtma narxlari serverda qayta hisoblanadi.
- Eski hardcoded admin login va botdagi backdoor olib tashlangan.
- `.env` fayllari git'ga qo'shilmaydi.

## 📞 Aloqa

- Telefon: +998 90 123 45 67
- Email: info@robosale.uz
- Manzil: Toshkent, IT Park

---

© 2024 RoboSale. Barcha huquqlar himoyalangan.
