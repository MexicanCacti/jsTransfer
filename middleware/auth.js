const User = require("../schemas/User")

const requireLogin = async function (req, res, next) {
    if(!req.session.user_id){
        return res.redirect("/");
    }

    const user = await User.findById(req.session.user_id);
    if (!user) {
        return req.session.destroy(() => {
            res.clearCookie("fileshare.sid");
            return res.redirect("/");
        });
    }

    req.user = user;
    next();
}

module.exports = requireLogin;