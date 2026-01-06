const express = require('express');
const User = require('../schemas/User');

const router = express.Router()

router.post('/register', async (req, res) => {
    try{
        const user = await User.create(req.body)
        res.status(201).json({id: user._id})
    } catch(err){
        res.status(400).json({error: err})
    }
})

module.exports = router;
