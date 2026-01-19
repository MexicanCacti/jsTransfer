const express = require('express');

const router = express.Router();

router.get('/', (req,res) => {
    res.render('upload', { error: null, success: null });
})

module.exports = router