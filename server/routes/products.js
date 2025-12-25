import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

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
router.post('/', async (req, res) => {
    try {
        const product = req.body;
        const id = Date.now().toString();
        const query = 'INSERT INTO products (id, name, description, price, originalPrice, discount, image, category, storeId, inStock, offer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            id, product.name, product.description, product.price, product.originalPrice,
            product.discount, product.image, product.category, product.store?.id || product.storeId,
            true, product.offer
        ];

        await pool.query(query, values);
        const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        res.status(201).json(newProduct[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Product
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        delete updates.store; // Remove nested object if present

        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), id];

        if (fields.length > 0) {
            await pool.query(`UPDATE products SET ${fields} WHERE id = ?`, values);
        }

        const [updated] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        res.json(updated[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Product
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
