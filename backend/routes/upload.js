const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, adminOnly } = require('../middleware/auth');

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

const uploadOptions = {
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
};

let upload;
let uploadDir = null;

if (useCloudinary) {
    // Cloudinary bo'lsa, faylni xotiraga yuklab, u yerdan Cloudinary'ga jo'natamiz
    upload = multer({ ...uploadOptions, storage: multer.memoryStorage() });
} else {
    // Lokal rejim: fayl backend/uploads papkasiga saqlanadi
    uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            cb(null, `product-${uniqueSuffix}${ext}`);
        }
    });

    upload = multer({ ...uploadOptions, storage });
}

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

        const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl.replace(/\/$/, '')}/uploads/${req.file.filename}`;

        res.json({
            success: true,
            message: 'Rasm muvaffaqiyatli yuklandi',
            imageUrl,
            filename: req.file.filename,
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

// @route   DELETE /api/upload/:filename
// @desc    Lokal rasmni o'chirish (Admin)
router.delete('/:filename', protect, adminOnly, async (req, res) => {
    try {
        if (useCloudinary) {
            return res.status(400).json({
                success: false,
                message: 'Cloudinary rejimida rasmni publicId orqali o\'chirish kerak'
            });
        }

        const filePath = path.join(uploadDir, req.params.filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return res.json({ success: true, message: 'Rasm o\'chirildi' });
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
