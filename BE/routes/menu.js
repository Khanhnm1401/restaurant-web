const express = require('express');
const router = express.Router();
const { sql } = require('../db');

// Public: Lấy danh sách menu cho user
router.get('/', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM MenuItems WHERE isDeleted = 0`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách món ăn' });
    }
});

module.exports = router;