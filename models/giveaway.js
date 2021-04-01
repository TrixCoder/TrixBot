const mongoose = require('mongoose');

module.exports = mongoose.model("Giveaway", new mongoose.Schema({
  message: String,
  timer: Number,
  prize: String,
  winnerCount: Number
}));