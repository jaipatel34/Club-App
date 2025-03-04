const mongoose = require('mongoose'); 

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Club = mongoose.model('User', clubSchema);

module.exports = Club;