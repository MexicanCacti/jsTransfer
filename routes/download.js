const express = require('express');
const File = require("../schemas/file");
const router = express.Router();

router.get('/download', async(req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const displayLimit = 10;
    const skip = (page - 1) * displayLimit;

    try{
        const files = await File.find({})
            .sort({filename: 1})
            .skip(skip)
            .limit(displayLimit)
            .lean();
        const totalFiles = await File.countDocuments();
        const totalPages = Math.ceil(totalFiles / displayLimit);

        res.render("download", {
            files,
            page,
            totalPages
        });
    } catch(err){
        res.status(500).send("Server error");
    }
});

router.get('/files/:id/download', async (req, res) => {
    const file = await File.findById(req.params.id);

    if(!file){
        return res.status(404)
    }

    file.downloadCount += 1;
    await file.save()

    res.download(file.path, file.filename)
});

module.exports = router;