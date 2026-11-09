// Admin foydalanuvchisini yaratish yoki yangilash.
// Ishlatish: npm run seed:admin
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const run = async () => {
    const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const name = (process.env.ADMIN_NAME || 'RoboSale Admin').trim();
    const phone = (process.env.ADMIN_PHONE || '+998900000000').trim();

    if (!email || !password) {
        console.error('XATOLIK: ADMIN_EMAIL va ADMIN_PASSWORD .env faylida ko\'rsatilishi shart.');
        process.exit(1);
    }

    if (password.length < 8) {
        console.error('XATOLIK: ADMIN_PASSWORD kamida 8 belgidan iborat bo\'lishi kerak.');
        process.exit(1);
    }

    await connectDB();

    let user = await User.findOne({ email });

    if (user) {
        user.name = name;
        user.phone = phone;
        user.role = 'admin';
        user.password = password;
        await user.save();
        console.log(`✅ Admin yangilandi: ${user.email}`);
    } else {
        user = await User.create({
            name,
            email,
            phone,
            password,
            role: 'admin'
        });
        console.log(`✅ Admin yaratildi: ${user.email}`);
    }

    await mongoose.disconnect();
    process.exit(0);
};

run().catch(async (error) => {
    console.error('❌ Admin yaratishda xatolik:', error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});
