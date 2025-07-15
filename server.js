const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:4200', 'https://tanklevel.onrender.com'],
    methods: ['GET', 'POST']
  }
});

// Your REST API
const TestApi = require('./route/testapi');
app.use('/api/user', TestApi);

// WebSocket connection
io.on('connection', (socket) => {
  console.log('🟢 WebSocket connected');

  // You can send live data here
  const tankData = [
    {
      tankid: 'FM002',
      level: '70%',
    }
  ];

  socket.emit('equipment-update', tankData);

  // Optionally, send updates every few seconds
  setInterval(() => {
    socket.emit('equipment-update', tankData);
  }, 1000);
});

// Start server
server.listen(process.env.PORT || 4000, () => {
  console.log('🚀 Server running');
});
