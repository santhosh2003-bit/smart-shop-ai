import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config({ path: './.env' }); // Ensure correct path to .env if running from root or server dir

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
};

async function initDb() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL server.');

        // Create Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'smart_shop'}\`;`);
        console.log('Database created or already exists.');

        await connection.changeUser({ database: process.env.DB_NAME || 'smart_shop' });

        // Create Tables
        const createUsers = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin', 'store_owner') DEFAULT 'user',
        avatar VARCHAR(255),
        phone VARCHAR(20),
        storeId VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

        const createStores = `
      CREATE TABLE IF NOT EXISTS stores (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo TEXT,
        rating DECIMAL(3,1) DEFAULT 0,
        reviewCount INT DEFAULT 0,
        distance VARCHAR(50),
        deliveryTime VARCHAR(50),
        address TEXT,
        isOpen BOOLEAN DEFAULT true,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        ownerId VARCHAR(50),
        description TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE SET NULL
      );
    `;

        const createCategories = `
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(50),
        productCount INT DEFAULT 0
      );
    `;

        const createProducts = `
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        originalPrice DECIMAL(10,2),
        discount INT,
        image TEXT,
        category VARCHAR(255),
        storeId VARCHAR(50),
        inStock BOOLEAN DEFAULT true,
        rating DECIMAL(3,1) DEFAULT 0,
        reviewCount INT DEFAULT 0,
        offer VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE
      );
    `;

        const createOrders = `
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        userId VARCHAR(50),
        storeId VARCHAR(50),
        status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered') DEFAULT 'pending',
        total DECIMAL(10,2) NOT NULL,
        deliveryAddress TEXT,
        estimatedDelivery VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (storeId) REFERENCES stores(id)
      );
    `;

        const createOrderItems = `
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderId VARCHAR(50),
        productId VARCHAR(50),
        quantity INT DEFAULT 1,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(id)
      );
    `;

        await connection.query(createUsers);
        await connection.query(createStores);
        await connection.query(createCategories);
        await connection.query(createProducts);
        await connection.query(createOrders);
        await connection.query(createOrderItems);

        console.log('Tables created successfully.');

        // Seed Data
        const usersExist = await connection.query('SELECT 1 FROM users LIMIT 1');
        if (usersExist[0].length === 0) {
            console.log('Seeding initial data...');

            // Users
            const hashedPassword = await bcrypt.hash('123456', 10);
            const adminPass = await bcrypt.hash('admin123', 10);
            const storePass = await bcrypt.hash('store123', 10);

            const users = [
                ['1', 'Admin User', 'admin@dealfinder.com', adminPass, 'admin', null, null, null],
                ['2', 'Store Owner', 'store@dealfinder.com', storePass, 'store_owner', null, null, '1'],
                ['3', 'John Doe', 'user@dealfinder.com', hashedPassword, 'user', null, null, null]
            ];

            await connection.query('INSERT INTO users (id, name, email, password, role, avatar, phone, storeId) VALUES ?', [users]);

            // Stores
            const stores = [
                ['1', 'FreshMart Express', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=100&h=100&fit=crop', 4.8, 2340, '1.2 km', '10-15 min', '123 Market Street, Downtown', true, 'approved', '2'],
                ['2', 'QuickGrocery', 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=100&h=100&fit=crop', 4.6, 1890, '2.5 km', '15-20 min', '456 Commerce Ave, Midtown', true, 'approved', null],
                ['3', 'Nature\'s Basket', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop', 4.9, 3200, '0.8 km', '8-12 min', '789 Green Lane, Uptown', true, 'approved', null]
            ];

            await connection.query('INSERT INTO stores (id, name, logo, rating, reviewCount, distance, deliveryTime, address, isOpen, status, ownerId) VALUES ?', [stores]);

            // Categories
            const categories = [
                ['1', 'Fruits & Vegetables', '🥬', 245],
                ['2', 'Dairy & Eggs', '🥛', 89],
                ['3', 'Meat & Seafood', '🍖', 156],
                ['4', 'Bakery', '🥐', 67],
                ['5', 'Beverages', '🥤', 198],
                ['6', 'Snacks', '🍿', 234],
                ['7', 'Personal Care', '🧴', 145],
                ['8', 'Household', '🧹', 112]
            ];

            await connection.query('INSERT INTO categories (id, name, icon, productCount) VALUES ?', [categories]);

            // Products
            const products = [
                ['1', 'Fresh Organic Apples', 'Sweet and crispy organic apples...', 4.99, 6.99, 29, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6', 'Fruits & Vegetables', '1', true, 4.8, 234, '🔥 Hot Deal'],
                ['2', 'Farm Fresh Eggs (12 pack)', 'Free-range eggs...', 5.49, 7.99, 31, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f', 'Dairy & Eggs', '2', true, 4.9, 456, '⚡ Flash Sale'],
                ['3', 'Whole Grain Bread', 'Freshly baked...', 3.99, null, null, 'https://images.unsplash.com/photo-1509440159596-0249088772ff', 'Bakery', '3', true, 4.7, 189, null],
                ['4', 'Organic Milk (1L)', 'Pure organic whole milk...', 2.99, 3.99, 25, 'https://images.unsplash.com/photo-1563636619-e9143da7973b', 'Dairy & Eggs', '1', true, 4.6, 567, '🎁 Buy 2 Get 1 Free'],
                ['5', 'Premium Chicken Breast', 'Boneless, skinless...', 9.99, 12.99, 23, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791', 'Meat & Seafood', '2', true, 4.8, 345, '🔥 Weekend Special'],
                ['6', 'Avocados (3 pack)', 'Ripe and ready-to-eat...', 5.99, null, null, 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578', 'Fruits & Vegetables', '3', true, 4.5, 278, null],
                ['7', 'Orange Juice (1L)', 'Freshly squeezed...', 4.49, 5.99, 25, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b', 'Beverages', '1', true, 4.7, 412, '⚡ Limited Time'],
                ['8', 'Mixed Nuts (500g)', 'Premium selection...', 8.99, 11.99, 25, 'https://images.unsplash.com/photo-1599599810694-b5b37304c041', 'Snacks', '2', true, 4.9, 523, '🎉 Best Seller']
            ];

            await connection.query('INSERT INTO products (id, name, description, price, originalPrice, discount, image, category, storeId, inStock, rating, reviewCount, offer) VALUES ?', [products]);

            console.log('Seeding completed.');
        } else {
            console.log('Data already exists, skipping seed.');
        }

    } catch (error) {
        console.error('Database initialization failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

initDb();
