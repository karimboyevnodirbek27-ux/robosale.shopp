const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ism kiritilishi shart'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email kiritilishi shart'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email formati noto\'g\'ri']
    },
    phone: {
        type: String,
        required: [true, 'Telefon raqami kiritilishi shart']
    },
    password: {
        type: String,
        required: [true, 'Parol kiritilishi shart'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    address: {
        city: String,
        street: String,
        zipCode: String
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
