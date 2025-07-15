const mongoose = require('mongoose');

const TestApiSchema = new mongoose.Schema({
  tankid: {
    type: String,
    required: true,
    // unique: true, // ✅ Enforces unique index at DB level
  },
  level: {
    type: String,
    required: true,
  },

});

module.exports = mongoose.model('tankdata', TestApiSchema);
