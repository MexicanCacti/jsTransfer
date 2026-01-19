const express = require('express');
const File = require("../schemas/file");
const router = express.Router();

router.get('/', async(req, res) => {
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

module.exports = router;