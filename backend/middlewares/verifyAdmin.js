const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = verifyAdmin;
