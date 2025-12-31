import express from 'express';

const router = express.Router();

// Mock in-memory notifications for now, but dynamic from API perspective
import pool from '../config/db.js';

router.get('/', async (req, res) => {
    try {
        // Assume userId is passed in query or header in a real app authentication middleware
        // For now, grabbing all or specific user's logic needs context.
        // Let's assume a simplified "get all relevant"
        // In reality, req.user would be populated by middleware.
        // We'll trust the frontend sending a query param for now or just fetch global + user specific
        // But since I don't have middleware here shown, I'll update it to accept a query param userId
        const { userId, role } = req.query;
        console.log(`Fetching notifications for userId: ${userId}, role: ${role}`);

        let query = 'SELECT * FROM notifications';
        let params = [];

        if (role === 'admin') {
            // Admin sees all
            query += ' ORDER BY createdAt DESC LIMIT 50';
        } else {
            // Regular User / Store Owner
            query += ' WHERE userId IS NULL';
            if (userId && userId !== 'undefined' && userId !== 'null') {
                query += ' OR userId = ?';
                params.push(userId);
            }
            query += ' ORDER BY createdAt DESC LIMIT 20';
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error('Notification Fetch Error:', err);
        res.status(500).json({ error: 'Failed to fetch notifications', details: err.message });
    }
});

router.post('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE notifications SET isRead = TRUE WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

export default router;
