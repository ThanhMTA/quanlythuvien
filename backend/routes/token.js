import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // Lấy token từ header
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
        // Xác thực token
        const verified = jwt.verify(token, 'your_secret_key_here');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

export default verifyToken;
