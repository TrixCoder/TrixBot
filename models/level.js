const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    id: { type: String, required: true },
    guildID: { type: String, required: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 }
});


module.exports = model('Level', productSchema);