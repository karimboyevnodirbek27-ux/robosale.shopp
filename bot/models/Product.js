const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Mahsulot nomi kiritilishi shart'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Tavsif kiritilishi shart']
    },
    price: {
        type: Number,
        required: [true, 'Narx kiritilishi shart'],
        min: 0
    },
    oldPrice: {
        type: Number,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: '/images/placeholder.svg'
    },
    images: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    },
    inStock: {
        type: Boolean,
        default: true
    },
    stockCount: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    specifications: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
