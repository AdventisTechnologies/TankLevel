const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

// Load the app (REST APIs and Angular frontend config)
const app = require('./app');

// Create HTTP server
const server = http.createServer(app);

// WebSocket server
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:4200', 'https://tanklevel.onrender.com'],
    methods: ['GET', 'POST']
  }
});

// WebSocket logic
io.on('connection', (socket) => {
  console.log('🟢 WebSocket connected');

  const tankData = [
    {
      tankid: 'FM002',
      level: '70%',
    }
  ];

  socket.emit('equipment-update', tankData);

  setInterval(() => {
    socket.emit('equipment-update', tankData);
  }, 1000);
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
