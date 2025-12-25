import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
    try {
        const [products] = await pool.query('SELECT COUNT(*) as count FROM products');
        const [stores] = await pool.query('SELECT COUNT(*) as count FROM stores');
        const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
        // Using a sum of totals for revenue - simplified
        const [revenue] = await pool.query('SELECT SUM(total) as total FROM orders');

        // Quick Stats
        const [activeDeals] = await pool.query('SELECT COUNT(*) as count FROM products WHERE discount IS NOT NULL');
        const [inStock] = await pool.query('SELECT COUNT(*) as count FROM products WHERE inStock = 1');
        const [openStores] = await pool.query("SELECT COUNT(*) as count FROM stores WHERE status = 'approved'"); // simplified 'open' as approved

        const [recentOrders] = await pool.query(`
        SELECT o.id, u.name as customer, o.total as amount, o.status 
        FROM orders o 
        JOIN users u ON o.userId = u.id 
        ORDER BY o.createdAt DESC 
        LIMIT 5
    `);

        res.json({
            totalProducts: products[0].count,
            activeStores: stores[0].count,
            totalUsers: users[0].count,
            revenue: revenue[0].total || 0,
            activeDeals: activeDeals[0].count,
            inStock: inStock[0].count,
            openStores: openStores[0].count,
            recentOrders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
