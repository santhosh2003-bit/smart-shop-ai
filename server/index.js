import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import storeRoutes from './routes/stores.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

import { createServer } from 'http';
import { Server } from 'socket.io';
import pool from './config/db.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // In production restrict this
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Make io accessible in routes
app.set('io', io);

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_user_room', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`User registered: ${userId}`);
    });

    socket.on('send_message', async (data) => {
        const { userId, text, sender } = data;
        try {
            // Save to DB
            const [result] = await pool.query(
                'INSERT INTO messages (id, userId, sender, text, createdAt) VALUES (?, ?, ?, ?, NOW())',
                [Date.now().toString(), userId, sender, text] // Simple ID gen
            );

            // Echo back to user room (handle multiple devices)
            io.to(`user_${userId}`).emit('new_message', {
                id: result.insertId || Date.now().toString(), // fallback
                userId,
                sender,
                text,
                timestamp: new Date()
            });

            // Simulate Bot Response if user sent it
            if (sender === 'user') {
                setTimeout(async () => {
                    let botText = "I received your message! How else can I help?";
                    if (text.toLowerCase().includes('order')) botText = "You can check your orders in the History section.";
                    if (text.toLowerCase().includes('hello')) botText = "Hello! 👋 Welcome to Smart Shop Support.";

                    const botMsgId = Date.now().toString();
                    await pool.query(
                        'INSERT INTO messages (id, userId, sender, text, createdAt) VALUES (?, ?, ?, ?, NOW())',
                        [botMsgId, userId, 'bot', botText]
                    );

                    io.to(`user_${userId}`).emit('new_message', {
                        id: botMsgId,
                        userId,
                        sender: 'bot',
                        text: botText,
                        timestamp: new Date()
                    });
                }, 1000);
            }

        } catch (err) {
            console.error("Socket message error:", err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('Smart Shop API is running');
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
