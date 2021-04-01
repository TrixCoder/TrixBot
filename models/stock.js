const mongoose = require('mongoose');

module.exports = mongoose.model("Stock", new mongoose.Schema({
  guild: String,
  nitro_classic: Array,
  nitro_booster: Array,
  nitro_yearly_classic: Array,
  nitro_yearly_booster: Array
}));