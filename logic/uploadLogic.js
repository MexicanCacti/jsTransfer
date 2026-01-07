const File = require("../schemas/File")

exports.handleUpload = async (req, res) => {
    try {
        if (!req.file){
            return res.status(400).render('upload', {
                error: 'No file was selected.',
                success: null
            });
        }

        const file = await File.create({
            path: req.file.path,
            filename: req.file.filename,
            size: req.file.size,
            uploadDate: Date.now()
        });

        res.status(201).render('upload', {
            success: 'file uploaded successfully',
            error: null
        });
    } catch(err){
        console.error(err);
        res.status(500).render('upload', {
            error: 'upload failed',
            success: null
        });
    }
};