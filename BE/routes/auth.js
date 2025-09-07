const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql } = require('../db');

// Đăng ký
router.post('/signup', async (req, res) => {
    const { email, password, role = 'user' } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await sql.query`INSERT INTO Users (email, password, role) VALUES (${email}, ${hashedPassword}, ${role})`;
        res.status(201).json({ message: 'Đăng ký người dùng thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi đăng ký người dùng' });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await sql.query`SELECT * FROM Users WHERE email = ${email}`;
        const user = result.recordset[0];

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { 
                    id: user.id,
                    role: user.role 
                }, 
                'your_jwt_secret', 
                { expiresIn: '1h' }
            );
            res.json({ 
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi đăng nhập' });
    }
});

module.exports = router;