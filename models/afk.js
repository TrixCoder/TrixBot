const mongoose = require('mongoose');

module.exports = mongoose.model("Afk", new mongoose.Schema({
  message: String,
  user: String,
  guild: String,
  type: String
}));