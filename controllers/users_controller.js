const User = require('../schemas/User');
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const existing = await User.findOne({username});
        if (existing) {
            return res.status(409).json({ error: "Username already exists" });
        }

        const hash = await bcrypt.hash(password, Number(process.env.SALT_AMOUNT) || 10);

        await User.create({
            username: username,
            password: hash
        });

        return res.status(201).json({ success: true });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};