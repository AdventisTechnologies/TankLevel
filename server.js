const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Route and model imports
const TestApiRoutes = require('./route/testapi');
const TankModel = require('./models/testapi'); // MongoDB model

// Connect to MongoDB
mongoose.connect(process.env.MONGODB, {
  // useNewUrlParser and useUnifiedTopology are no longer needed
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection failed', err));

// Serve Angular build (static files)
app.use(express.static(path.join(__dirname, 'tanklevel', 'browser')));

// REST API routes
app.use('/api/user', TestApiRoutes);

// Fallback for Angular routing (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'tanklevel', 'browser', 'index.html'));
});

// Create WebSocket server
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:4200', 'https://tanklevel.onrender.com'],
    methods: ['GET', 'POST']
  }
});

// WebSocket event
io.on('connection', (socket) => {
  console.log('🟢 WebSocket connected');

  // Send live data every second
  const intervalId = setInterval(async () => {
    try {
      const latestTankData = await TankModel.aggregate([
        { $sort: { _id: -1 } }, // Sort by most recent
        {
          $group: {
            _id: '$tankid',
            tankid: { $first: '$tankid' },
            level: { $first: '$level' },
            timestamp: { $first: '$_id' }
          }
        }
      ]);
      socket.emit('equipment-update', latestTankData);
    } catch (err) {
      console.error('❌ Failed to fetch tank data:', err);
    }
  }, 1000);

  socket.on('disconnect', () => {
    clearInterval(intervalId);
    console.log('🔌 WebSocket disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
