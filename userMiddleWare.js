const jwt = require("jsonwebtoken");
const { SECRET_KEY_USER } = require("./config.js");

const withAuth = function (req, res, next) {
    const token =
        req.cookies.talkspace_auth_token ||
        req.body.talkspace_auth_token ||
        req.query.talkspace_auth_token
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided")
    } else {
        jwt.verify(token, SECRET_KEY_USER, function (err, decoded) {
            if (err) {
                return res.status(401).send("Unauthorized: Invalid token")
            } else {
                req.uid = decoded.uid
                req.firstName = decoded.firstName
                req.lastName = decoded.lastName
            }
        })
    }
}

module.exports = withAuth;