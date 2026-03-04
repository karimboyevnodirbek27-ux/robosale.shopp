const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Uploads papkasini yaratish
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage konfiguratsiyasi
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Unikal fayl nomi: timestamp + original nom
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `product-${uniqueSuffix}${ext}`);
    }
});

// Fayl filteri - faqat rasmlar
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Faqat rasm fayllarini yuklash mumkin (JPEG, PNG, GIF, WEBP)'), false);
    }
};

// Multer instansiyasi
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Rasm yuklash endpoint
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Rasm fayli yuklanmadi'
            });
        }

        // Yuklangan fayl URL'ini qaytarish
        const imageUrl = `/uploads/${req.file.filename}`;

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

// Rasmni o'chirish endpoint
router.delete('/:filename', (req, res) => {
    try {
        const filePath = path.join(uploadDir, req.params.filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'Rasm o\'chirildi'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Rasm topilmadi'
            });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Rasmni o\'chirishda xatolik'
        });
    }
});

// Error handler for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Fayl hajmi 5MB dan oshmasligi kerak'
            });
        }
    }
    res.status(400).json({
        success: false,
        message: error.message || 'Yuklashda xatolik'
    });
});

module.exports = router;
