import pool from '../config/db.js';

/**
 * Creates a notification and emits it via Socket.IO
 * @param {Object} req - Express request object (to access io)
 * @param {Object} data - Notification data
 * @param {string} data.userId - Target user ID (or role logic if needed)
 * @param {string} data.type - Type of notification (order, system, product)
 * @param {string} data.message - Notification message
 * @param {string} [data.relatedId] - ID of related entity (orderId, productId)
 * @param {string} [data.relatedType] - Type of related entity
 */
export const createNotification = async (req, { userId, type, message, relatedId, relatedType }) => {
    try {
        const id = Date.now().toString();

        // Save to DB
        await pool.query(
            'INSERT INTO notifications (id, userId, type, message, isRead, relatedId, relatedType, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
            [id, userId, type, message, false, relatedId, relatedType]
        );

        // Emit Socket Event
        const io = req.app.get('io');
        if (io) {
            // If userId is provided, emit to that user's room
            if (userId) {
                io.to(`user_${userId}`).emit('notification', {
                    id,
                    userId,
                    type,
                    message,
                    isRead: false,
                    relatedId,
                    relatedType,
                    createdAt: new Date()
                });
            } else {
                // If no userId, maybe broadcast to all (e.g., admin announcements)
                // For now, let's assume specific targeting or admin room
                if (type === 'system_admin') {
                    // specific room for admins if implemented
                }
            }
        }
    } catch (error) {
        console.error('Notification creation failed:', error);
    }
};
