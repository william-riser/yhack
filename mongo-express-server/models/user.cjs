// models/user.cjs
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    receipts: {
        type: Array,
        default: [],
    }
});

module.exports = mongoose.model('User', userSchema);
