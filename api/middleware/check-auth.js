const jwt = require('jsonwebtoken');

/**
 * Check the requested token is valid and authenticate user to access
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 * 
 * @returns 
 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed! Please login first to access this.'
        });
    }
};
