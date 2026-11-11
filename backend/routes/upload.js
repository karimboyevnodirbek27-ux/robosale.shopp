const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { protect, adminOnly } = require('../middleware/auth');
const ImageAsset = require('../models/ImageAsset');

const useCloudinary = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

let cloudinary = null;
if (useCloudinary) {
    cloudinary = require('cloudinary').v2;
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    });
}

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Faqat rasm fayllarini yuklash mumkin (JPEG, PNG, GIF, WEBP)'), false);
    }
};

// Faylni xotiraga olamiz: keyin Cloudinary'ga yoki MongoDB'ga yozamiz.
// (Render'da lokal disk vaqtinchalik bo'lgani uchun diskka yozmaymiz.)
const upload = multer({
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    storage: multer.memoryStorage()
});

// Lokal diskdagi eski rasmlarni o'chirish uchun (orqaga moslik)
const legacyUploadDir = path.join(__dirname, '..', 'uploads');

const extFromMime = (mimetype, originalName) => {
    const ext = path.extname(originalName || '').toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) return ext;
    if (mimetype === 'image/png') return '.png';
    if (mimetype === 'image/gif') return '.gif';
    if (mimetype === 'image/webp') return '.webp';
    return '.jpg';
};

// @route   POST /api/upload
// @desc    Rasm yuklash (Admin)
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Rasm fayli yuklanmadi'
            });
        }

        if (useCloudinary) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'robosale/products', resource_type: 'image' },
                    (error, uploaded) => {
                        if (error) reject(error);
                        else resolve(uploaded);
                    }
                );
                stream.end(req.file.buffer);
            });

            return res.json({
                success: true,
                message: 'Rasm muvaffaqiyatli yuklandi',
                imageUrl: result.secure_url,
                publicId: result.public_id,
                originalName: req.file.originalname,
                size: req.file.size
            });
        }

        // Cloudinary sozlanmagan: rasmni MongoDB'ga saqlaymiz (doimiy).
        const image = await ImageAsset.create({
            data: req.file.buffer,
            contentType: req.file.mimetype,
            filename: req.file.originalname,
            size: req.file.size
        });

        const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
        const ext = extFromMime(req.file.mimetype, req.file.originalname);
        const imageUrl = `${baseUrl.replace(/\/$/, '')}/api/images/${image._id}${ext}`;

        res.json({
            success: true,
            message: 'Rasm muvaffaqiyatli yuklandi',
            imageUrl,
            imageId: image._id,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Rasm yuklashda xatolik yuz berdi'
        });
    }
});

// @route   DELETE /api/upload/:id
// @desc    Yuklangan rasmni o'chirish (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const rawId = String(req.params.id).split('.')[0];

        // MongoDB'da saqlangan rasm
        if (mongoose.Types.ObjectId.isValid(rawId)) {
            const deleted = await ImageAsset.findByIdAndDelete(rawId);
            if (deleted) {
                return res.json({ success: true, message: 'Rasm o\'chirildi' });
            }
        }

        // Eski lokal fayl (faqat fayl nomi berilgan bo'lsa)
        if (!req.params.id.includes('/')) {
            const filePath = path.join(legacyUploadDir, req.params.id);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return res.json({ success: true, message: 'Rasm o\'chirildi' });
            }
        }

        return res.status(404).json({ success: false, message: 'Rasm topilmadi' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ success: false, message: 'Rasmni o\'chirishda xatolik' });
    }
});

// Multer xatolarini ushlash
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'Fayl hajmi 5MB dan oshmasligi kerak'
        });
    }

    res.status(400).json({
        success: false,
        message: error.message || 'Yuklashda xatolik'
    });
});

module.exports = router;
