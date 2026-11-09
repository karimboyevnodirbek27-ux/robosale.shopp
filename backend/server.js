require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload');

const app = express();

// Render/Cloudflare kabi proxy ortida ishlaganda to'g'ri protocol/host aniqlash
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// CORS: production'da CORS_ORIGIN env'da vergul bilan ajratilgan domenlar
const corsOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors(corsOrigins.length > 0 ? { origin: corsOrigins } : {}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Static files - uploads papkasi
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: '🤖 RoboSale API Server',
        version: '1.0.0',
        endpoints: {
            products: '/api/products',
            users: '/api/users',
            orders: '/api/orders'
        }
    });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route topilmadi' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Server xatosi',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════╗
  ║                                       ║
  ║   🤖 RoboSale API Server              ║
  ║                                       ║
  ║   Port: ${PORT}                          ║
  ║   Mode: ${process.env.NODE_ENV || 'development'}                  ║
  ║                                       ║
  ╚═══════════════════════════════════════╝
  `);
});
