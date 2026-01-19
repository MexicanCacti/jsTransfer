const User = require('../schemas/User');
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
    if(!req.body.username) {
        return res.status(400).json({ error: "Username is required" });
    }

    if(!req.body.password) {
        return res.status(400).json({ error: "Password is required" });
    }

    const {username, password} = req.body;

    const user = await User.findOne({username});
    if(!user) {
        return res.status(404).json({error: "Could not find user with username"});
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match) {
        return res.status(401).json({error: "Invalid credentials"});
    }

    req.session.user_id = user._id;
    req.session.username = user.username;

    return res.json({success: true});
};

exports.logout = (req, res) => {
    if(!req.session.user_id) {
        return res.status(204).end();
    }
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Logout failed" });
        }

        res.clearCookie('fileshare.sid');
        return res.status(204).end();
    });
};