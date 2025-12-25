import express from 'express';
import pool from '../config/db.js';
import multer from 'multer';
import { parsePoster } from '../services/ocrService.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Analyze Poster
router.post('/:id/poster', upload.single('poster'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const products = await parsePoster(req.file.path);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'OCR failed' });
    }
});

// Get all stores
router.get('/', async (req, res) => {
    try {
        const { status, ownerId } = req.query;
        let query = 'SELECT * FROM stores';
        const params = [];

        if (status || ownerId) {
            query += ' WHERE';
            const conditions = [];
            if (status) {
                conditions.push(' status = ?');
                params.push(status);
            }
            if (ownerId) {
                conditions.push(' ownerId = ?');
                params.push(ownerId);
            }
            query += conditions.join(' AND');
        }

        const [stores] = await pool.query(query, params);
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Store
router.post('/', async (req, res) => {
    try {
        const store = req.body;
        const id = Date.now().toString();
        const query = 'INSERT INTO stores (id, name, logo, rating, reviewCount, distance, deliveryTime, address, isOpen, status, ownerId, description, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            id, store.name, store.logo, 0, 0, store.distance, store.deliveryTime, store.address,
            true, 'pending', store.ownerId, store.description, store.phone, store.email
        ];

        await pool.query(query, values);

        // Fetch created store
        const [newStore] = await pool.query('SELECT * FROM stores WHERE id = ?', [id]);
        res.status(201).json(newStore[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Store
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Build dynamic update query
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), id];

        if (fields.length > 0) {
            await pool.query(`UPDATE stores SET ${fields} WHERE id = ?`, values);
        }

        const [updatedStore] = await pool.query('SELECT * FROM stores WHERE id = ?', [id]);
        res.json(updatedStore[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Store
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM stores WHERE id = ?', [req.params.id]);
        res.json({ message: 'Store deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
