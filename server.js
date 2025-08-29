const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API endpoint to handle Google login
app.post('/api/auth/google', (req, res) => {
    const token = req.body.token;
    // In a real application, you would verify this token with Google's API
    // For this example, we'll just simulate a successful login
    const mockUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        winRate: 0.75 // Example win rate
    };
    console.log('User signed in with token:', token);
    res.json({
        success: true,
        user: mockUser
    });
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle 'get-rooms' request
    socket.on('get-rooms', () => {
        // In a real app, you would fetch real room data from a database
        const mockRooms = [
            { id: 'room-1', players: 2 },
            { id: 'room-2', players: 4 }
        ];
        socket.emit('rooms-list', mockRooms);
    });

    // Handle 'join-room' request
    socket.on('join-room', (data) => {
        const roomId = data.roomId;
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        // You would emit a 'room-joined' event back to the client
        // and start the game logic here
        io.to(roomId).emit('room-joined', { id: roomId, user: data.user });
    });

    // Handle 'disconnect' event
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});