const mongoose = require('mongoose'); 

const clubSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    admins: [{ type: String, required: true }], // Array of Auth0 user IDs
    members: { type: [String], default: [] }, // Array of Auth0 user IDs
    createdAt: { type: Date, default: Date.now }
});

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;