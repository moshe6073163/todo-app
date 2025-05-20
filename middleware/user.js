const { verifyToken } = require("../functions/functions")

const checkLogin = (req, res, next) => {
    delete req.user;
    delete req.body.user;
    const currUser = verifyToken(req.body.token);
    if (!currUser) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = currUser;
    next();
}

module.exports = {
    checkLogin
}