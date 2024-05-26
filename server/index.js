const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Use CORS middleware
app.use(cors());

// Set up Socket.io with CORS configuration
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', user => {
        console.log('New user:', user);
        users[socket.id] = user;
        socket.broadcast.emit('user-joined', user);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, user: users[socket.id] });
    });

    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            socket.broadcast.emit('left', user);
            delete users[socket.id];
        }
    });
});

// Start the server
server.listen(8000, () => {
    console.log('Socket.io server running on port 8000');
});
