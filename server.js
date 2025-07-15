// server.js
require('dotenv').config();
const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const Equipment = require('./models/testapi'); // adjust path if needed

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGODB || 'mongodb://localhost:27017/cmms';

const server = http.createServer(app);

// Attach Socket.IO to the server
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:4200', 'https://tanklevel.onrender.com'],
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// MongoDB connection
mongoose.connect(MONGO_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// WebSocket connection logic
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  const interval = setInterval(async () => {
    try {
      const data = await Equipment.find({});
      socket.emit('equipment-update', data);
    } catch (err) {
      console.error('Error fetching equipment:', err);
    }
  }, 5000); // every 5 seconds

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
    clearInterval(interval);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
