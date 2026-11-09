const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const fs = require('fs');
const path = require('path');

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected...');

        const frontendData = fs.readFileSync(path.join(__dirname, '../frontend/src/data/products.js'), 'utf8');
        
        let productsArrayString = frontendData.substring(
            frontendData.indexOf('export const products = ') + 'export const products = '.length,
            frontendData.indexOf('// Kategoriyalar')
        ).trim();
        
        if (productsArrayString.endsWith(';')) {
            productsArrayString = productsArrayString.slice(0, -1);
        }
        
        const products = JSON.parse(productsArrayString);

        await Product.deleteMany({});
        console.log('Old products deleted.');

        const transformedProducts = products.map(p => ({
            name: p.name,
            description: p.description,
            price: p.price,
            oldPrice: p.oldPrice,
            category: p.category,
            image: p.image, // Use relative URL so frontend resolves it automatically
            rating: p.rating,
            reviews: p.reviews,
            inStock: true,
            stockCount: p.stock || 10,
            featured: p.featured || false
        }));

        // Actually wait, earlier the images were relative "/uploads/...". 
        // If I put "http://localhost:7878/images/..." the frontend will load them correctly!
        
        await Product.insertMany(transformedProducts);
        console.log(`Seeded ${transformedProducts.length} new products!`);
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
