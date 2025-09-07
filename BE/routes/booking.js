const express = require('express');
const router = express.Router();
const { sql } = require('../db');

// Đặt bàn
router.post('/', async (req, res) => {
    const { people, date, time } = req.body;

    try {
        // Validate input
        if (!people || !date || !time) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }

        if (people < 1 || people > 20) {
            return res.status(400).json({ error: 'Số người phải từ 1 đến 20' });
        }

        await sql.query`
            INSERT INTO Bookings (people, date, time, status) 
            VALUES (${people}, ${date}, ${time}, N'pending')
        `;
        
        res.status(201).json({ message: 'Đặt bàn thành công' });
    } catch (err) {
        console.error('Lỗi khi đặt bàn:', err);
        res.status(500).json({ error: 'Lỗi khi đặt bàn' });
    }
});

// Lấy danh sách đặt bàn (cho admin)
router.get('/', async (req, res) => {
    try {
        const result = await sql.query`
            SELECT * FROM Bookings 
            ORDER BY date DESC, time DESC
        `;
        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi khi lấy danh sách đặt bàn:', err);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách đặt bàn' });
    }
});

module.exports = router;