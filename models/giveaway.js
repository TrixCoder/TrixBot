const mongoose = require('mongoose');

module.exports = mongoose.model("Giveaway", new mongoose.Schema({
  name: { type: String, default: 'Giveaway' },
  id: { type: String, required: true },
  channel: { type: String, required: true },
  embed: { type: Object, required: true },
  winnerCount: { type: Number, required: true },
  time: { type: Number, required: true },
  msgId: { type: String, required: true },
  enabled: { type: Boolean, required: true },
  host: { type: String, required: true },
  prize: { type: String, required: true },
  role: { type: String },
  server: { type: String },
  messages: { type: Number },
  type: { type: String }
}));