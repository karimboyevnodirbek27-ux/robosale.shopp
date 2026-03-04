const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @route   POST /api/orders
// @desc    Yangi buyurtma yaratish
router.post('/', async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, itemsTotal, shippingCost = 0 } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Buyurtma bo\'sh' });
        }

        const order = await Order.create({
            items,
            shippingAddress,
            paymentMethod,
            itemsTotal,
            shippingCost,
            totalAmount: itemsTotal + shippingCost
        });

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
router.get('/', async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        let query = {};
        if (status) {
            query.orderStatus = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [orders, total] = await Promise.all([
            Order.find(query)
                .sort({ createdAt: -1 })
                .limit(parseInt(limit))
                .skip(skip),
            Order.countDocuments(query)
        ]);

        res.json({
            success: true,
            count: orders.length,
            total,
            pages: Math.ceil(total / parseInt(limit)),
            orders
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/orders/:id
// @desc    Bitta buyurtmani olish
router.get('/:id', async (req, res) => {
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

// @route   GET /api/orders/track/:orderNumber
// @desc    Buyurtmani kuzatish
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

// @route   PUT /api/orders/:id/status
// @desc    Buyurtma statusini yangilash (Admin)
router.put('/:id/status', async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const updateData = {};
        if (orderStatus) updateData.orderStatus = orderStatus;
        if (paymentStatus) {
            updateData.paymentStatus = paymentStatus;
            if (paymentStatus === 'paid') {
                updateData.paidAt = new Date();
            }
        }
        if (orderStatus === 'delivered') {
            updateData.deliveredAt = new Date();
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   GET /api/orders/stats/summary
// @desc    Buyurtmalar statistikasi (Admin)
router.get('/stats/summary', async (req, res) => {
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

module.exports = router;
