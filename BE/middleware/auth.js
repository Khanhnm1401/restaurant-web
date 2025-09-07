const jwt = require('jsonwebtoken');
const { sql } = require('../db');

// Middleware xác thực JWT token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Truy cập bị từ chối. Không có token.' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const result = await sql.query`SELECT * FROM Users WHERE id = ${decoded.id}`;
        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ error: 'Không tìm thấy người dùng' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Token không hợp lệ' });
    }
};

// Middleware kiểm tra quyền admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Truy cập bị từ chối. Yêu cầu quyền admin.' });
    }
};

// Middleware kiểm tra quyền nhân viên
const isStaff = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'staff')) {
        next();
    } else {
        res.status(403).json({ error: 'Truy cập bị từ chối. Yêu cầu quyền nhân viên.' });
    }
};

module.exports = {
    authenticateToken,
    isAdmin,
    isStaff
}; 