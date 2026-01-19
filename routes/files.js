const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require("../controllers/files_controller");

const upload = multer({ dest: 'uploads/'});

router.get('/search', fileController.search);
router.post('/', upload.single('file'), fileController.upload);
router.post('/:id', fileController.download);
router.delete('/:id', fileController.delete);

module.exports = router;