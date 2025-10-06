const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({message: 'AUTHORIZATION ERROR: No token, no access!'});
    }

    try {
        const tokenOnly = token.split(' ')[1];

        const decoded = jwt.verify(tokenOnly, process.env.JWT_SECRET);

        req.user = decoded.user;

        next();
    } catch (err) {
        res.status(401).json({message: 'AUTHORIZATION ERROR: Invalid token!'});
    }
};