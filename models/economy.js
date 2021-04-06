const mongoose = require('mongoose');

module.exports = mongoose.model("Economy", new mongoose.Schema({
  id: { type: String, required: true },
  balance: {type: Number, default: 500},
  daily_lastUsed: Number,
  work_lastUsed: { type: Number, default: null },
  rob_lastUsed: { type: Number, default: null },
  crime_lastUsed: { type: Number, default: null },
  inv: Array,
}));
