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
    password : {
        type: String,
        select : false,
        default : null,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    uploadDate: {
        type: Date,
        required: true,
    },
    downloadCount : {
        type: Number,
        required: true,
        default: 0,
    },
    size : {
        type: Number,
    }
});

File.index({ filename: 'text' });

module.exports = mongoose.models.File || mongoose.model('File', File);