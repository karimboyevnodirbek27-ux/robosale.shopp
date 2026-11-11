const express = require('express');
const mongoose = require('mongoose');
const ImageAsset = require('../models/ImageAsset');

const router = express.Router();

// @route   GET /api/images/:id
// @desc    MongoDB'da saqlangan rasmni qaytarish (ommaviy)
router.get('/:id', async (req, res) => {
    try {
        // ".jpg" kabi kengaytmani olib tashlaymiz
        const id = String(req.params.id).split('.')[0];

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Noto\'g\'ri rasm ID' });
        }

        const image = await ImageAsset.findById(id);

        if (!image || !image.data) {
            return res.status(404).json({ success: false, message: 'Rasm topilmadi' });
        }

        res.set('Content-Type', image.contentType || 'image/jpeg');
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        res.send(image.data);
    } catch (error) {
        console.error('Image serve error:', error);
        res.status(500).json({ success: false, message: 'Rasmni olishda xatolik' });
    }
});

module.exports = router;
