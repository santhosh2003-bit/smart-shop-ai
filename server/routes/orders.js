import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Get Single Order
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [orders] = await pool.query(`
      SELECT o.*, s.name as storeName, s.id as storeId 
      FROM orders o 
      JOIN stores s ON o.storeId = s.id 
      WHERE o.id = ?
    `, [id]);

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orders[0];
        const [items] = await pool.query(`
      SELECT oi.*, p.name as productName, p.image 
      FROM order_items oi 
      JOIN products p ON oi.productId = p.id 
      WHERE oi.orderId = ?
    `, [id]);

        const orderWithItems = {
            ...order,
            store: { id: order.storeId, name: order.storeName },
            items: items.map(i => ({
                quantity: i.quantity,
                product: { name: i.productName, image: i.image, price: i.price }
            })),
            trackingSteps: [
                { title: 'Order Placed', completed: true, time: order.createdAt },
                { title: 'Confirmed', completed: ['confirmed', 'preparing', 'out_for_delivery', 'delivered'].includes(order.status) },
                { title: 'Delivered', completed: order.status === 'delivered' }
            ]
        };

        res.json(orderWithItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Orders (for user or store)
router.get('/', async (req, res) => {
    try {
        const { userId, storeId } = req.query;
        let query = `
      SELECT o.*, s.name as storeName, s.id as storeId 
      FROM orders o 
      JOIN stores s ON o.storeId = s.id 
    `;
        const params = [];

        if (userId) {
            query += ' WHERE o.userId = ?';
            params.push(userId);
        } else if (storeId) {
            query += ' WHERE o.storeId = ?';
            params.push(storeId);
        }

        query += ' ORDER BY o.createdAt DESC';

        const [orders] = await pool.query(query, params);

        // Fetch items for each order (simple loop for now, could catch with join)
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const [items] = await pool.query(`
        SELECT oi.*, p.name as productName, p.image 
        FROM order_items oi 
        JOIN products p ON oi.productId = p.id 
        WHERE oi.orderId = ?
      `, [order.id]);

            return {
                ...order,
                store: { id: order.storeId, name: order.storeName },
                items: items.map(i => ({
                    quantity: i.quantity,
                    product: { name: i.productName, image: i.image, price: i.price }
                })),
                trackingSteps: [ // Mock tracking steps for now
                    { title: 'Order Placed', completed: true, time: order.createdAt },
                    { title: 'Confirmed', completed: ['confirmed', 'preparing', 'out_for_delivery', 'delivered'].includes(order.status) },
                    { title: 'Delivered', completed: order.status === 'delivered' }
                ]
            };
        }));

        res.json(ordersWithItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Order
router.post('/', async (req, res) => {
    try {
        const { userId, items, total, deliveryAddress, storeId } = req.body;
        const orderId = 'ORD-' + Date.now();

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            await connection.query(
                'INSERT INTO orders (id, userId, storeId, status, total, deliveryAddress, estimatedDelivery) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [orderId, userId, storeId || items[0].product.store.id, 'pending', total, deliveryAddress, '15-30 min']
            );

            for (const item of items) {
                await connection.query(
                    'INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.product.id, item.quantity, item.product.price]
                );
            }

            await connection.commit();
            res.status(201).json({ id: orderId, message: 'Order created' });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Order Status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
