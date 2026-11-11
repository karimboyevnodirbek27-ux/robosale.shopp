const mongoose = require('mongoose');

// Render bepul planida lokal disk vaqtinchalik (deploy/restart'da o'chib ketadi).
// Shuning uchun yuklangan rasmlarni MongoDB'da saqlaymiz — ular doimiy qoladi.
const imageAssetSchema = new mongoose.Schema(
    {
        data: { type: Buffer, required: true },
        contentType: { type: String, default: 'image/jpeg' },
        filename: { type: String },
        size: { type: Number }
    },
    { timestamps: true }
);

module.exports = mongoose.model('ImageAsset', imageAssetSchema);
