const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT tokenni tekshirish va foydalanuvchini req.user ga qo'shish
const protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Avtorizatsiya talab qilinadi'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Foydalanuvchi topilmadi'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token yaroqsiz yoki muddati tugagan'
        });
    }
};

// Faqat admin foydalanuvchilarga ruxsat berish
const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin huquqi talab qilinadi'
        });
    }
    next();
};

module.exports = { protect, adminOnly };
