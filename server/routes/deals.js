import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Ensure settings table exists (Lazy Init)
const initSettingsTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS settings (
            section VARCHAR(50) PRIMARY KEY,
            value TEXT
        )
    `);

    // Seed default flash sale time if not exists (24 hours from now)
    const [rows] = await pool.query('SELECT value FROM settings WHERE section = ?', ['flash_sale_end']);
    if (rows.length === 0) {
        const tomorrow = new Date();
        tomorrow.setHours(tomorrow.getHours() + 24);
        await pool.query('INSERT INTO settings (section, value) VALUES (?, ?)', ['flash_sale_end', tomorrow.toISOString()]);
    }
};

// Initialize on load
initSettingsTable().catch(console.error);

// Get Flash Sale Timer
router.get('/timer', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT value FROM settings WHERE section = ?', ['flash_sale_end']);
        if (rows.length > 0) {
            res.json({ endTime: rows[0].value });
        } else {
            // Fallback
            const tomorrow = new Date();
            tomorrow.setHours(tomorrow.getHours() + 5);
            res.json({ endTime: tomorrow.toISOString() });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Flash Sale Timer (Admin only - simply protected by route for now)
router.post('/timer', async (req, res) => {
    try {
        const { endTime } = req.body; // ISO String expected
        await pool.query('INSERT INTO settings (section, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?', ['flash_sale_end', endTime, endTime]);

        // Notify users via socket?
        const io = req.app.get('io');
        if (io) {
            io.emit('timer_update', { endTime });
        }

        res.json({ message: 'Timer updated', endTime });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
