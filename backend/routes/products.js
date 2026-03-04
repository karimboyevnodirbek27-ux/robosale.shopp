const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Barcha mahsulotlarni olish
router.get('/', async (req, res) => {
    try {
        const { category, search, sort, featured, limit = 50, page = 1 } = req.query;

        let query = {};

        // Kategoriya bo'yicha filter
        if (category && category !== 'all') {
            query.category = category;
        }

        // Qidiruv
        if (search) {
            query.$text = { $search: search };
        }

        // Featured filter
        if (featured === 'true') {
            query.featured = true;
        }

        // Sorting
        let sortOption = {};
        switch (sort) {
            case 'price-low':
                sortOption = { price: 1 };
                break;
            case 'price-high':
                sortOption = { price: -1 };
                break;
            case 'rating':
                sortOption = { rating: -1 };
                break;
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            default:
                sortOption = { featured: -1, createdAt: -1 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [products, total] = await Promise.all([
            Product.find(query)
                .sort(sortOption)
                .limit(parseInt(limit))
                .skip(skip),
            Product.countDocuments(query)
        ]);

        res.json({
            success: true,
            count: products.length,
            total,
            pages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/products/:id
// @desc    Bitta mahsulotni olish
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
        }

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/products
// @desc    Yangi mahsulot qo'shish (Admin)
router.post('/', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/products/:id
// @desc    Mahsulotni yangilash (Admin)
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
        }

        res.json({ success: true, product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/products/:id
// @desc    Mahsulotni o'chirish (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
        }

        res.json({ success: true, message: 'Mahsulot o\'chirildi' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/products/category/:category
// @desc    Kategoriya bo'yicha mahsulotlar
router.get('/category/:category', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
