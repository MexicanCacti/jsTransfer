const User = require("../schemas/User")

const requireLogin = async function (req, res, next) {
    if(!req.session.userID){
        return res.redirect("/login");
    }

    const user = await User.findByID(req.session.userID);
    if(!user){
        req.session.destroy();
        return res.redirect("/login");
    }

    req.user = user;
    next();
}

module.exports = requireLogin;