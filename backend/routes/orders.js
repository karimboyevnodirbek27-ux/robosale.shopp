const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const { notifyTelegram } = require('../utils/telegram');

const PAYMENT_METHODS = ['payme', 'click', 'cash', 'installment'];

// @route   POST /api/orders
// @desc    Yangi buyurtma yaratish (ochiq)
// Narxlar serverda qayta hisoblanadi, mijoz yuborgan narxga ishonilmaydi.
router.post('/', async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod = 'cash' } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Buyurtma bo\'sh' });
        }

        if (!shippingAddress ||
            !shippingAddress.firstName?.trim() ||
            !shippingAddress.lastName?.trim() ||
            !shippingAddress.phone?.trim() ||
            !shippingAddress.city?.trim() ||
            !shippingAddress.address?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Yetkazib berish uchun barcha majburiy maydonlarni to\'ldiring'
            });
        }

        if (!PAYMENT_METHODS.includes(paymentMethod)) {
            return res.status(400).json({ success: false, message: 'To\'lov usuli noto\'g\'ri' });
        }

        // Items: [{ product: "<ObjectId>", quantity: 2 }]
        const normalizedItems = items.map((item) => ({
            productId: item.product || item.productId || item._id || item.id,
            quantity: Number(item.quantity)
        }));

        for (const item of normalizedItems) {
            if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
                return res.status(400).json({ success: false, message: 'Mahsulot ID si noto\'g\'ri' });
            }
            if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
                return res.status(400).json({ success: false, message: 'Mahsulot soni noto\'g\'ri' });
            }
        }

        const productIds = normalizedItems.map((item) => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });
        const productMap = new Map(products.map((product) => [String(product._id), product]));

        let itemsTotal = 0;
        const orderItems = [];

        for (const item of normalizedItems) {
            const product = productMap.get(String(item.productId));

            if (!product) {
                return res.status(400).json({ success: false, message: 'Mahsulot topilmadi' });
            }

            if (product.inStock === false || Number(product.stockCount) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `"${product.name}" omborda tugagan`
                });
            }

            if (Number(product.stockCount) < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `"${product.name}" uchun omborda faqat ${product.stockCount} ta qoldi`
                });
            }

            itemsTotal += Number(product.price) * item.quantity;
            orderItems.push({
                product: product._id,
                name: product.name,
                price: Number(product.price),
                quantity: item.quantity,
                image: product.image
            });
        }

        // Omborni kamaytirish. Biror mahsulotda yetarli bo'lmasa, oldingilarni qaytaramiz.
        const decremented = [];
        for (const item of orderItems) {
            const updated = await Product.findOneAndUpdate(
                {
                    _id: item.product,
                    inStock: { $ne: false },
                    stockCount: { $gte: item.quantity }
                },
                { $inc: { stockCount: -item.quantity } },
                { new: true }
            );

            if (!updated) {
                for (const done of decremented) {
                    await Product.updateOne(
                        { _id: done.product },
                        { $inc: { stockCount: done.quantity }, $set: { inStock: true } }
                    );
                }
                return res.status(400).json({
                    success: false,
                    message: `"${item.name}" omborda yetarli emas`
                });
            }

            if (Number(updated.stockCount) <= 0) {
                await Product.updateOne({ _id: updated._id }, { $set: { inStock: false } });
            }

            decremented.push(item);
        }

        const shippingCost = 0;
        const totalAmount = itemsTotal + shippingCost;

        let order;
        try {
            order = await Order.create({
                items: orderItems,
                shippingAddress,
                paymentMethod,
                itemsTotal,
                shippingCost,
                totalAmount
            });
        } catch (error) {
            // Buyurtma yaratilmasa, omborni qaytarish
            for (const done of decremented) {
                await Product.updateOne(
                    { _id: done.product },
                    { $inc: { stockCount: done.quantity }, $set: { inStock: true } }
                );
            }
            throw error;
        }

        // Adminga Telegram xabari (javobni kutmasdan)
        notifyTelegram(order).catch((error) => console.error('Telegram notify error:', error.message));

        res.status(201).json({
            success: true,
            order: {
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                orderStatus: order.orderStatus
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   GET /api/orders
// @desc    Barcha buyurtmalarni olish (Admin)
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

        let query = {};
        if (status) {
            query.orderStatus = status;
        }

        const skip = (pageNum - 1) * limitNum;

        const [orders, total] = await Promise.all([
            Order.find(query)
                .sort({ createdAt: -1 })
                .limit(limitNum)
                .skip(skip),
            Order.countDocuments(query)
        ]);

        res.json({
            success: true,
            count: orders.length,
            total,
            pages: Math.ceil(total / limitNum),
            orders
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/orders/stats/summary
// @desc    Buyurtmalar statistikasi (Admin)
// NOTE: /:id dan oldin turishi shart
router.get('/stats/summary', protect, adminOnly, async (req, res) => {
    try {
        const [totalOrders, pendingOrders, completedOrders, totalRevenue] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ orderStatus: 'pending' }),
            Order.countDocuments({ orderStatus: 'delivered' }),
            Order.aggregate([
                { $match: { paymentStatus: 'paid' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ])
        ]);

        res.json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                completedOrders,
                totalRevenue: totalRevenue[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/orders/track/:orderNumber
// @desc    Buyurtmani kuzatish (ochiq)
// NOTE: /:id dan oldin turishi shart
router.get('/track/:orderNumber', async (req, res) => {
    try {
        const order = await Order.findOne({ orderNumber: req.params.orderNumber });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
        }

        res.json({
            success: true,
            order: {
                orderNumber: order.orderNumber,
                orderStatus: order.orderStatus,
                paymentStatus: order.paymentStatus,
                totalAmount: order.totalAmount,
                createdAt: order.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/orders/:id
// @desc    Bitta buyurtmani olish (Admin)
router.get('/:id', protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Buyurtma statusini yangilash (Admin)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
        }

        const wasCancelled = order.orderStatus === 'cancelled';
        const willBeCancelled = orderStatus === 'cancelled';

        // Buyurtma bekor qilinsa, omborni qaytarish (faqat bir marta)
        if (!wasCancelled && willBeCancelled && !order.stockRestored) {
            for (const item of order.items) {
                if (!item.product) continue;
                await Product.updateOne(
                    { _id: item.product },
                    { $inc: { stockCount: item.quantity }, $set: { inStock: true } }
                );
            }
            order.stockRestored = true;
        }

        // Bekor qilingan buyurtma qayta faollashtirilsa, omborni yana kamaytirish
        if (wasCancelled && orderStatus && !willBeCancelled && order.stockRestored) {
            const decreased = [];
            for (const item of order.items) {
                if (!item.product) continue;
                const updated = await Product.findOneAndUpdate(
                    { _id: item.product, stockCount: { $gte: item.quantity } },
                    { $inc: { stockCount: -item.quantity } },
                    { new: true }
                );
                if (!updated) {
                    for (const done of decreased) {
                        await Product.updateOne(
                            { _id: done.product },
                            { $inc: { stockCount: done.quantity }, $set: { inStock: true } }
                        );
                    }
                    return res.status(400).json({
                        success: false,
                        message: `"${item.name}" uchun omborda yetarli mahsulot yo'q`
                    });
                }
                decreased.push(item);
            }
            order.stockRestored = false;
        }

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
            if (paymentStatus === 'paid') {
                order.paidAt = new Date();
            }
        }
        if (orderStatus === 'delivered') {
            order.deliveredAt = new Date();
        }

        await order.save();

        res.json({ success: true, order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
