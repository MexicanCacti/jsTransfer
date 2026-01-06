const mongoose = require('mongoose');

const User = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    }
})


module.exports = mongoose.model('User', User)