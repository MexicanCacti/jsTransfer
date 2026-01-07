const express = require('express');
const File = require("../schemas/file");
const router = express.Router();

router.post('/download', async (req, res) => {
    try{
        const file = await File.create(req.body);
        res.status(201).json({id : file._id})
    } catch (err) {
        res.status(400).json({error: err})
    }
})

module.exports = router;