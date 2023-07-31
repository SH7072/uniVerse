const jwt = require("jsonwebtoken");
// const { JWT_SECRET, JWT_EXPIRES_IN } = require("/");
// const process.env.JWT_SECRET = JWT_SECRET;
// const process.env.JWT_EXPIRES_IN = JWT_EXPIRES_IN;

// Jsonwebtoken Sign a token with the user's id and a secret
function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

// Jsonwebtoken Verify a request token with the user's id and a secret
function verifyToken(req, res, next) {
    const header = req.headers["authorization"];
    if (typeof header !== "undefined") {
        const bearer = header.split(" ");
        const token = bearer[1];
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            req.user = jwt.verify(token, process.env.JWT_SECRET);
            next();
        } catch (err) {
            res.status(401).json({
                error: "Token not valid, please authenticate again",
            });
            return;
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports = {
    signToken,
    verifyToken,
};