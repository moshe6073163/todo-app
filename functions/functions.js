const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "dhd;fhckwejfjfkwjefiefwoi49838787854338%$wndndw@#cdkckdcj";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";


const generateToken = (user) => {
    if(!user || !user.id|| !user._id || !user.email || !user.role) {
        throw new Error("Invalid user object");
    }
    const payload = {
        id: user.id,
        _id: user._id,
        email: user.email,
        role: user.role,
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

const verifyToken = (token) => {
    if(!token) {
        throw new Error("Token is required");
    }
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    generateToken,
    verifyToken
}