# RoboSale — bepul joylashtirish (deploy) qo'llanmasi

Maqsad: domen sotib olmasdan, 0 so'mga saytni internetga chiqarish.

```
Foydalanuvchi
     │
     ▼
Cloudflare Pages  (https://robosale.pages.dev)
     │  VITE_API_URL
     ▼
Render Web Service (https://robosale-api.onrender.com)
     │  MONGODB_URI
     ▼
MongoDB Atlas M0 (bepul 512 MB)
     │
     └── Cloudinary (bepul rasm saqlash, ixtiyoriy)
```

---

## 0. Muhim eslatmalar

- `backend/.env` **hech qachon** GitHub'ga qo'shilmaydi (`.gitignore`da bor).
- Admin paroli `backend/.env` faylidagi `ADMIN_PASSWORD` da saqlanadi. Chatda yuborilmaydi.
- Telegram bot tokeni avval chatda ko'rsatilgan bo'lsa — @BotFather orqali **revoke** qiling va yangisini faqat `.env`ga yozing.
- Render bepul rejasi 15 daqiqa harakatsizlikdan keyin uxlaydi. Birinchi so'rov 30–60 soniya kishi mumkin.

---

## 1. MongoDB Atlas (bepul M0)

1. https://www.mongodb.com/cloud/atlas/register — ro'yxatdan o'ting.
2. **Build a Database** → **M0 FREE** → provayder: AWS → region: **Frankfurt (eu-central-1)**.
3. **Database Access** → **Add New Database User**:
   - username: masalan `robosale`
   - password: kuchli parol yarating va saqlab qo'ying
4. **Network Access** → **Add IP Address** → `0.0.0.0/0` (Render IP'lari o'zgaruvchan, shuning uchun hammasi ochiladi; baza parol bilan himoyalangan).
5. **Database** → **Connect** → **Drivers** → connection string'ni nusxalang:
   ```
   mongodb+srv://robosale:<PAROL>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Oxiriga baza nomini qo'shing:
   ```
   mongodb+srv://robosale:<PAROL>@cluster0.xxxxx.mongodb.net/robosale_db?retryWrites=true&w=majority
   ```
7. **Lokal kompyuterda** mahsulotlar va adminni Atlas'ga ko'chirish:

   ```powershell
   cd C:\Users\adikcyber\Desktop\RoboSale\backend
   ```

   `backend/.env` ichida `MONGODB_URI` ni **vaqtincha** Atlas manziliga almashtiring, so'ng:

   ```powershell
   npm run seed:products
   npm run seed:admin
   ```

   Ikkalasi muvaffaqiyatli tugagach, `MONGODB_URI` ni yana lokal bazaga qaytaring:
   ```
   MONGODB_URI=mongodb://localhost:27017/robosale_db
   ```

> `seed:products` avvalgi mahsulotlarni o'chirib, yangilarini yozadi. Buyurtmalar o'chmaydi.

---

## 2. Render — backend (bepul)

0. Avval repo'ni GitHub'ga push qiling:
   ```powershell
   cd C:\Users\adikcyber\Desktop\RoboSale
   git remote -v   # URL to'g'rimi?
   git push origin main
   ```
   `Repository not found` chiqsa: repo o'chirilgan/nomlangan yoki private va login yo'q.
   https://github.com/new da `RoboSale` nomli repo yarating va
   `git remote set-url origin https://github.com/<foydalanuvchi>/RoboSale.git` qilib qayta push qiling.
1. https://render.com → **New** → **Blueprint** (repo'da `render.yaml` bor) yoki **Web Service**.
   - Repository: `karimboyevnodirbek27-ux/RoboSale`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: **Free**
2. **Environment** bo'limida quyidagilarni kiriting:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Atlas connection string (`.../robosale_db?...`) |
   | `JWT_SECRET` | uzun tasodifiy satr (Blueprint avtomatik yaratadi) |
   | `CORS_ORIGIN` | `https://robosale.pages.dev` (keyinroq domen qo'shiladi) |
   | `BACKEND_URL` | `https://robosale-api.onrender.com` |
   | `ADMIN_NAME` | `RoboSale Admin` |
   | `ADMIN_EMAIL` | `karimboyevnodirbek27@gmail.com` |
   | `ADMIN_PHONE` | `+998507087845` |
   | `ADMIN_PASSWORD` | `backend/.env` dagi parol (o'zingiz bilasiz) |
   | `TELEGRAM_BOT_TOKEN` | yangi token (ixtiyoriy) |
   | `TELEGRAM_ADMIN_ID` | sizning Telegram ID'ingiz (ixtiyoriy) |
   | `CLOUDINARY_*` | 4-bo'limdan keyin (ixtiyoriy) |

3. Deploy tugagach tekshiring:
   ```
   https://robosale-api.onrender.com/health
   ```
   Javob: `{"status":"OK",...}`

> Render'da `ADMIN_PASSWORD` faqat `seed:admin` uchun kerak. Atlas'ga admin allaqachon 1-qadamda yaratildi.

---

## 3. Cloudflare Pages — frontend (bepul)

1. https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Repo: `RoboSale`.
3. Build sozlamalari:
   - Framework preset: **Vite**
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. **Environment variables**:
   ```
   VITE_API_URL = https://robosale-api.onrender.com/api
   NODE_VERSION = 22
   ```
   (`frontend/.nvmrc` fayli ham `22` ni ko'rsatadi — Vite 7 uchun Node 20.19+ yoki 22+ kerak.)
5. **Save and Deploy**. Manzil: `https://robosale.pages.dev`.
6. Render'ga qaytib, `CORS_ORIGIN` ni yangilang:
   ```
   https://robosale.pages.dev
   ```
   va **Manual Deploy → Clear build cache & deploy**.

### SPA routing

`frontend/public/_redirects` fayli bor:
```
/*    /index.html    200
```
Shu sababli `/admin`, `/products`, `/order-tracking` kabi yo'llar yangilanganda 404 bermaydi.

---

## 4. Cloudinary — rasmlar (bepul, tavsiya etiladi)

Render bepul rejasida lokal `uploads/` papkasi har restartda o'chib ketadi. Rasmlar saqlanib qolishi uchun:

1. https://cloudinary.com — bepul akkaunt oching.
2. Dashboard → **Product Environment Credentials**:
   - `Cloud name`
   - `API Key`
   - `API Secret`
3. Render → Environment:
   ```
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```
4. Redeploy. Endi admin panelda yuklangan rasmlar Cloudinary'ga saqlanadi.

Cloudinary sozlanmasa ham sayt ishlaydi — rasmlar vaqtincha `backend/uploads/`ga tushadi.

---

## 5. Admin panel

- Manzil: `https://robosale.pages.dev/admin`
- Login: `karimboyevnodirbek27@gmail.com` + `backend/.env` dagi `ADMIN_PASSWORD`.
- Parolni unutgan bo'lsangiz:
  1. `backend/.env` da `ADMIN_PASSWORD` ni o'zgartiring.
  2. Atlas manzili bilan `npm run seed:admin` ni qayta ishga tushiring.

---

## 6. Buyurtmalar va Telegram

- Har bir yangi buyurtma MongoDB'ga yoziladi va ombor soni kamayadi.
- Buyurtma bekor qilinsa, ombor avtomatik qaytadi.
- `TELEGRAM_BOT_TOKEN` va `TELEGRAM_ADMIN_ID` to'ldirilgan bo'lsa, adminga xabar boradi.
- To'lov hozircha faqat **naqd**. Payme/Click/bo'lib to'lash "Tez orada" deb belgilangan — merchant akkaunt ochilgach yoqiladi.

---

## 7. Tekshirish ro'yxati

- [ ] `https://robosale-api.onrender.com/health` → OK
- [ ] `https://robosale.pages.dev` → mahsulotlar ko'rinadi
- [ ] Admin login ishlaydi
- [ ] Admin panelda mahsulot qo'shish / o'chirish ishlaydi
- [ ] Buyurtma berish ishlaydi va `RB...` raqam qaytadi
- [ ] Buyurtma kuzatish (`/order-tracking`) ishlaydi
- [ ] Admin panelda buyurtma statusi o'zgaradi
- [ ] Telegram xabar keladi (token sozlangan bo'lsa)
- [ ] Rasm yuklash ishlaydi (Cloudinary yoki lokal)

---

## 8. Keyinroq

- Domen: `robosale.shop` (Porkbun ~$2 birinchi yil). Cloudflare Pages → Custom domains ga qo'shiladi, Render CORS'ga yangi domen yoziladi.
- Botni 24/7 hostingga chiqarish (Render Background Worker / Railway).
- Payme/Click merchant akkauntlari ochilgach real to'lov integratsiyasi.
