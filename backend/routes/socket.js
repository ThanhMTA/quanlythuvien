// socket.js
import { Server } from 'socket.io';

export default function initializeSocket(server) {
    const io = new Server(server);

    // WebSocket endpoint
    io.on('connection', (socket) => {
        console.log('Client connected');

        socket.on('notifyChange', () => {
            // Emit notification to all connected clients
            io.emit('dataChanged');
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
}
