const File = require("../schemas/File")
const bcrypt = require("bcrypt")

const salt_amount = 10;

exports.handleUpload = async (req, res) => {
    try {
        if (!req.file){
            return res.status(400).render('upload', {
                error: 'No file was selected.',
                success: null
            });
        }

        let passwordHash = ""
        if(req.body.password && req.body.password.trim() !== "" ){
            console.log(req.body.password.trim());
            passwordHash = await bcrypt.hash(req.body.password, salt_amount);
        }

        await File.create({
            path: req.file.path,
            filename: req.file.filename,
            size: req.file.size,
            uploadDate: Date.now(),
            password: passwordHash
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