const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    id: { type: String, required: true },
    guildID: { type: String, required: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    target: { type: Number, default: 100 },
    message: { type: Array, default: [] },
    custom_bg: { type: String, default: "https://images.unsplash.com/photo-1568059114791-bab96bff7011?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" }
});


module.exports = model('Level', productSchema);