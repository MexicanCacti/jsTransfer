const express = require('express');
const upload = require("../middleware/multer");
const uploadLogic = require("../logic/uploadLogic");

const router = express.Router();

router.use((req, res, next) => {
    console.log('Time', Date.now());
    next();
})

router.use((req, res, next) => {
    console.log("URL:", req.originalUrl)
    console.log("Method:", req.method)
    next()
})

router.post('/upload', (req, res) => {
    upload.single('file')(req, res, err => {
        if (err) {
            return res.status(400).render('error', {
                error: err.message,
                success: null
            });
        }
        uploadLogic.handleUpload(req, res);
    });
});


module.exports = router