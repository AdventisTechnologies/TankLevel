const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const TestApi = require('./route/testapi');

const allowedOrigins = ['http://localhost:4200', 'https://tanklevel.onrender.com'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS: ' + origin));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// ✅ Register API routes BEFORE Angular static serving
app.use('/api/user', TestApi);

// ✅ Serve Angular build
app.use(express.static(path.join(__dirname, 'tanklevel', 'browser')));

// ✅ Handle SPA routes (must come LAST)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'tanklevel', 'browser', 'index.html'));
});

module.exports = app;
