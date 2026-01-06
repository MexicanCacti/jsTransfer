const express = require('express');
const File = require("../schemas/File")

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

router.get('/upload', (req, res, next) => {
    // res.render(uploadPage)
    console.log('Giving uploadPage!')
    res.send("<h1>Upload Page</h1>");
})

router.post('/upload', async (req, res) => {
    try{
        const file = await File.create(req.body);
        res.status(201).json({id : file._id})
    } catch (err) {
        res.status(400).json({error: err})
    }
})


module.exports = router