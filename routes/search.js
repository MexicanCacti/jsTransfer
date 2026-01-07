const express = require('express');
const File = require("../schemas/file");
const router = express.Router();

router.get('/search', async(req, res) => {
    const searchQuery = req.query.query || '';
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const displayLimit = 10;
    const skip = (page - 1) * displayLimit;
    try {

        const files = await File.find(
            { $text: { $search: searchQuery } },
            { score: { $meta: 'textScore' } }
        )
            .sort({ score: { $meta: 'textScore' } })
            .skip(skip)
            .limit(displayLimit)
            .lean();
        const totalFiles = await File.countDocuments();
        const totalPages = Math.ceil(totalFiles / displayLimit);
        res.render('search', {
            files,
            page,
            totalPages
        });
    } catch(err) {
        res.status(500).send("Server error");
    }
});


router.get('/api/search', async (req, res) => {
    const searchQuery = req.query.query || '';
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const displayLimit = 10;
    const skip = (page - 1) * displayLimit;

    const files = await File.find(
        { $text: { $search: searchQuery } },
        { score: { $meta: 'textScore' } }
    )
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(displayLimit)
        .lean();

    res.json(files);
});

module.exports = router;