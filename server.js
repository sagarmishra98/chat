const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle joining a room
    socket.on('joinRoom', ({ room, guestName }) => {
        socket.join(room);
        console.log(`${guestName} joined room: ${room}`);
    });

    // Handle chat messages
    socket.on('chatMessage', (data) => {
        io.to(data.room).emit('chatMessage', {
            message: data.message,
            guestName: data.guestName
        });
    });

    // Handle clearing messages
    socket.on('clearMessages', (room) => {
        io.to(room).emit('clearMessages');  // Broadcast to all clients in the room
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
