const mongoose = require('mongoose');

module.exports = mongoose.model("Guild", new mongoose.Schema({
  guild: String,
  prefix: String,
  modRoles: Array,
  currency: String,
  shop: Array
}));