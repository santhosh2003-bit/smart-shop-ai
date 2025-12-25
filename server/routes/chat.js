import express from 'express';

const router = express.Router();

import pool from '../config/db.js';

router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [rows] = await pool.query(
            'SELECT * FROM messages WHERE userId = ? ORDER BY createdAt ASC',
            [userId]
        );
        res.json(rows.map(row => ({
            id: row.id,
            text: row.text,
            sender: row.sender,
            timestamp: row.createdAt
        })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch chat history' });
    }
});

// Legacy POST endpoint can remain or be deprecated in favor of Socket
router.post('/message', async (req, res) => {
    // ... existing logic if needed for fallback
    res.status(200).json({ message: 'Use WebSockets for chat' });
});

export default router;
