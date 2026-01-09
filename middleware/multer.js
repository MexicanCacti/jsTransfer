const multer = require("multer");

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 10, // 10Gb limit
    }
});

module.exports = upload;