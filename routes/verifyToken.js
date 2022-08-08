
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        // split token header (since when testing in postman, we set token = bearer {token})
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_Secret, (err, user) => {
            if (err) res.status(403).json("token is not valid!");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("you are not authenticated!");
    }
};

const verifyTokenAndAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin){
           //continue operations
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin){
           //continue operations
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    });
}

module.exports = {verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin};