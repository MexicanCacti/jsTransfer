const File = require('../schemas/file');
const bcrypt = require("bcrypt");
const salt_amount = parseInt(process.env.SALT_AMOUNT);

exports.info = async (req, res) => {
    try{
        // get fileID, return file metadata (uploadedBy, uploadDate, downloadCount)
    } catch(err) {
        console.error(err);
        // return something
    }
}

exports.upload = async (req, res) => {
    try {
        if (!req.file){
            return res.status(400).render('upload', {
                error: 'No file was selected.',
                success: null
            });
        }

        let passwordHash = ""
        if(req.body.password && req.body.password.trim() !== ''){
            passwordHash = await bcrypt.hash(req.body.password, salt_amount);
        }

        await File.create({
            path: req.file.path,
            filename: req.file.originalname,
            size: req.file.size,
            uploadedBy: req.session.user_id,
            uploadDate: new Date(),
            password: passwordHash
        });

        res.status(201).render('upload', {
            success: 'file uploaded successfully',
            error: null
        });
    } catch(err){
        console.error(err);
        return res.status(500).render('upload', {
            error: 'Upload failed.',
            success: null
        });
    }
};

exports.download = async (req, res) => {
    try{
        const fileId = req.params.id;
        const {password} = req.body;

        if(!fileId){
            return res.status(400).json({error: 'No file was selected.'});
        }

        const file = await File.findById(fileId);
        if(!file){
            return res.status(404).json({error: 'No file found.'});
        }

        if(file.password && file.password.length > 0) {
            if(!password){
                return res.status(401).json({error: 'Password required.'});
            }

            const match = await bcrypt.compare(password, file.password);
            if(!match){
                return res.status(401).json({error: 'Password not match.'});
            }
        }

        file.downloadCount += 1;
        await file.save();

        res.download(file.path, file.filename);
    } catch(err) {
        console.error(err);
        // return something
    }
};

exports.delete = async (req, res) => {
    try{
        const { id: fileId } = req.params;
        const { password } = req.body;

        if(!fileId){
            return res.status(400).json({error: 'No file was selected.'});
        }

        const file = await File.findById(fileId);
        if(!file){
            return res.status(404).json({error: 'No file found.'});
        }

        /*
        const userId = req.session.user_id;
        if (file.uploadedBy.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this file.' });
        }
        */

        if(file.password && file.password.length > 0) {
            if(!password){
                return res.status(401).json({error: 'Password required.'});
            }

            const match = await bcrypt.compare(password, file.password);
            if(!match){
                return res.status(401).json({error: 'Password not match.'});
            }
        }


        await File.findByIdAndDelete(fileId);
        return res.status(200).json({success: 'file deleted successfully.'});

    } catch(err) {
        console.error(err);
        return res.status(500).json({error: 'failed to delete file.'});
    }
};

exports.search = async (req, res) => {
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
}
