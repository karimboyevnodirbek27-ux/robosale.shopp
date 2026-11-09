const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: String,
    price: Number,
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image: String
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderNumber: {
        type: String,
        unique: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        email: String,
        city: { type: String, required: true },
        address: { type: String, required: true },
        notes: String
    },
    paymentMethod: {
        type: String,
        enum: ['payme', 'click', 'cash', 'installment'],
        default: 'cash'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    itemsTotal: {
        type: Number,
        required: true
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    deliveredAt: Date,
    paidAt: Date,
    // Bekor qilinganda ombor qaytarilganini belgilash uchun
    stockRestored: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Generate order number before saving.
// Vaqt + tasodifiy qism ishlatiladi, countDocuments race condition'i oldini oladi.
orderSchema.pre('save', function (next) {
    if (!this.orderNumber) {
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(100 + Math.random() * 900);
        this.orderNumber = `RB${timestamp}${random}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
