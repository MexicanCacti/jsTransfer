const express = require('express');
const File = require("../schemas/file");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get('/download', async(req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const displayLimit = 10;
    const skip = (page - 1) * displayLimit;

    try{
        const files = await File.find({})
            .sort({filename: 1})
            .skip(skip)
            .limit(displayLimit)
            .select("_id filename password")
            .lean();

        files.forEach(f => {
            f.hasPassword = Boolean(f.password)
            delete f.password;
        })

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

router.post('/files/:id/download', async (req, res) => {
    const { password } = req.body;

    const file = await File.findById(req.params.id).select("+password");

    if (!file) {
        return res.sendStatus(404);
    }

    if (file.password) {
        if (!password) {
            return res.sendStatus(401);
        }

        const match = await bcrypt.compare(password, file.password);
        if (!match) {
            return res.sendStatus(401);
        }
    }

    file.downloadCount += 1;
    await file.save();

    res.download(file.path, file.filename);
});


module.exports = router;