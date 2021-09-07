const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({
            status: 401,
            message: 'no token provided'
        });
    } else {
        try {
            const decoded = jwt.verify(token, config.get('jwtPassword'));
            req.user = decoded;
            next();
        } catch (ex) {
            return res.status(400).json({
                status: 400,
                message: 'invalid token provided'
            });
        }
    }
}