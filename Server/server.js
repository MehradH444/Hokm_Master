const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// تنظیمات اولیه
const app = express();
const PORT = process.env.PORT || 5000;

// میان‌افزارها (Middlewares)
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST']
}));
app.use(express.json());

const server = http.createServer(app);

// راه‌اندازی Socket.io
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// مسیر تست سلامت API
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'HOKM MASTER Server is running perfectly!',
        timestamp: new Date().toISOString()
    });
});

// مدیریت اتصالات زنده
io.on('connection', (socket) => {
    console.log(`🟢 کاربر متصل شد: ${socket.id}`);

    socket.on('ping', () => {
        socket.emit('pong', { message: 'ارتباط زنده برقرار است!' });
    });

    socket.on('disconnect', () => {
        console.log(`🔴 کاربر قطع شد: ${socket.id}`);
    });
});

// روشن کردن سرور
server.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 HOKM MASTER Server Started!`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`=================================`);
});
