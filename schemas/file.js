const mongoose = require('mongoose');

const File = new mongoose.Schema({
    path : {
        type: String,
        required: true,
    },
    filename : {
        type: String,
        required: true,
    },
    password : String,
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    uploadDate: {
        type: Date,
        required: true,
    },
    downloadCount : {
        type: Number,
        required: true,
        default: 0,
    }
})

module.exports = mongoose.model('File', File)