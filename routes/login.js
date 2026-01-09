const bcrypt = require('bcrypt');
const User = require('../schemas/User');
const express = require("express");
const router = express.Router()

router.post("/login", async(req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({username});
    if(!user) {
        return res.status(401).render("login", {error: "Invalid credentials"});
    }

    const ok = await bcrypt.compare(password, user.hashedPassword);
    if(!ok) {
        return res.status(401).render("login", {error: "Invalid credentials"});
    }

    req.session.userID = user._id
})

router.get('/login/auth', (req, res) => {
    // Login logic
    res.render("login");
})

module.exports = router;