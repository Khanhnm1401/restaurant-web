const express = require('express');
const router = express.Router();
const { sql } = require('../db');

// API khách hàng gửi đánh giá
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
    }
    try {
        await sql.query`
            INSERT INTO Reviews (name, email, message)
            VALUES (${name}, ${email}, ${message})
        `;
        res.status(201).json({ message: 'Gửi đánh giá thành công' });
    } catch (err) {
        console.error('Lỗi khi gửi đánh giá:', err); // Log chi tiết lỗi
        res.status(500).json({ error: 'Lỗi khi gửi đánh giá', details: err.message });
    }
});

module.exports = router;
