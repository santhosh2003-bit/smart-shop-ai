import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

import multer from 'multer';
import path from 'path';
import { createNotification } from '../utils/notificationHelper.js';

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'product-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Get products (with filters)
router.get('/', async (req, res) => {
    try {
        const { storeId, category, search } = req.query;
        let query = 'SELECT p.*, s.name as storeName FROM products p LEFT JOIN stores s ON p.storeId = s.id';
        const params = [];
        const conditions = [];

        if (storeId) {
            conditions.push('p.storeId = ?');
            params.push(storeId);
        }
        if (category) {
            conditions.push('p.category = ?');
            params.push(category);
        }
        if (search) {
            conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [products] = await pool.query(query, params);

        // Transform to match frontend interface (store object)
        const formattedProducts = products.map(p => ({
            ...p,
            inStock: Boolean(p.inStock),
            store: {
                id: p.storeId,
                name: p.storeName
            }
        }));

        res.json(formattedProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Product
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const product = req.body;
        const id = Date.now().toString();

        // Handle Image Path
        let imagePath = product.image; // Fallback to URL if provided
        if (req.file) {
            // Use full URL or relative path depending on frontend setup. 
            // Assuming served at /uploads
            imagePath = `http://localhost:${process.env.PORT || 3000}/uploads/${req.file.filename}`;
        }

        // Extract storeId (handle both direct ID and nested store object)
        const storeId = product.storeId || (product.store && product.store.id);

        if (!storeId) {
            return res.status(400).json({ message: 'Store ID is required' });
        }

        const query = 'INSERT INTO products (id, name, description, price, originalPrice, discount, image, category, storeId, inStock, offer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            id, product.name, product.description, product.price, product.originalPrice,
            product.discount, imagePath, product.category, storeId,
            true, product.offer
        ];

        await pool.query(query, values);
        const [newProduct] = await pool.query(`
            SELECT p.*, s.name as storeName, s.ownerId 
            FROM products p 
            JOIN stores s ON p.storeId = s.id 
            WHERE p.id = ?`, [id]);

        const formattedProduct = {
            ...newProduct[0],
            inStock: Boolean(newProduct[0].inStock),
            store: {
                id: newProduct[0].storeId,
                name: newProduct[0].storeName
            }
        };

        // Notify Store Owner (safely)
        if (newProduct.length > 0) {
            try {
                await createNotification(req, {
                    userId: newProduct[0].ownerId,
                    type: 'product_create',
                    message: `New product "${product.name}" added to your store ${newProduct[0].storeName}`,
                    relatedId: id,
                    relatedType: 'product'
                });
            } catch (notifErr) {
                console.error("Notification failed, but product created:", notifErr);
            }
        }

        res.status(201).json(formattedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Product
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        // Clean up updates object
        delete updates.store;
        delete updates.storeId; // Prevent changing store via update for safety/simplicity
        delete updates.createdAt;
        delete updates.id;

        // Handle Image File
        if (req.file) {
            updates.image = `http://localhost:${process.env.PORT || 3000}/uploads/${req.file.filename}`;
        }

        // Handle numeric/boolean conversions for FormData (everything is string)
        if (updates.price) updates.price = parseFloat(updates.price);
        if (updates.originalPrice) {
            const op = parseFloat(updates.originalPrice);
            updates.originalPrice = isNaN(op) ? null : op;
        } else if (updates.originalPrice === '') {
            updates.originalPrice = null;
        }

        if (updates.discount) {
            const d = parseInt(updates.discount);
            updates.discount = isNaN(d) ? null : d;
        } else if (updates.discount === '') {
            updates.discount = null;
        }

        if (updates.inStock !== undefined) {
            // "true" -> true, "false" -> false, or "1"/"0"
            updates.inStock = (updates.inStock === 'true' || updates.inStock === '1' || updates.inStock === true);
        }

        // Handle optional lat/lng if passed
        if (updates.latitude && updates.latitude !== '') updates.latitude = parseFloat(updates.latitude);
        if (updates.longitude && updates.longitude !== '') updates.longitude = parseFloat(updates.longitude);

        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), id];

        if (fields.length > 0) {
            await pool.query(`UPDATE products SET ${fields} WHERE id = ?`, values);
        }

        const [updatedProduct] = await pool.query(`
            SELECT p.*, s.name as storeName, s.ownerId 
            FROM products p 
            JOIN stores s ON p.storeId = s.id 
            WHERE p.id = ?`, [id]);

        if (updatedProduct.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const formattedProduct = {
            ...updatedProduct[0],
            inStock: Boolean(updatedProduct[0].inStock),
            store: {
                id: updatedProduct[0].storeId,
                name: updatedProduct[0].storeName
            }
        };

        // Notify Store Owner (safely)
        if (updatedProduct.length > 0) {
            try {
                await createNotification(req, {
                    userId: updatedProduct[0].ownerId,
                    type: 'product_update',
                    message: `Product "${updatedProduct[0].name}" was updated`,
                    relatedId: id,
                    relatedType: 'product'
                });
            } catch (notifErr) {
                console.error("Notification failed, but product updated:", notifErr);
            }
        }

        res.json(formattedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Product
router.delete('/:id', async (req, res) => {
    try {
        const [existing] = await pool.query('SELECT name, storeId FROM products WHERE id = ?', [req.params.id]);

        await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);

        if (existing.length > 0) {
            const [store] = await pool.query('SELECT ownerId FROM stores WHERE id = ?', [existing[0].storeId]);
            if (store.length > 0) {
                await createNotification(req, {
                    userId: store[0].ownerId,
                    type: 'product_delete',
                    message: `Product "${existing[0].name}" can no longer be seen in your store (Deleted)`,
                    relatedId: req.params.id,
                    relatedType: 'product'
                });
            }
        }

        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
