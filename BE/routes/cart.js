const express = require('express');
const router = express.Router();
const { sql } = require('../db');

// Thêm sản phẩm vào giỏ hàng
router.post('/add', async (req, res) => {
    const { userId, itemId, quantity } = req.body;

    try {
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItem = await sql.query`
            SELECT * FROM CartItems 
            WHERE userId = ${userId} AND itemId = ${itemId}
        `;

        if (existingItem.recordset.length > 0) {
            // Nếu đã có, cập nhật số lượng
            await sql.query`
                UPDATE CartItems 
                SET quantity = quantity + ${quantity}
                WHERE userId = ${userId} AND itemId = ${itemId}
            `;
        } else {
            // Nếu chưa có, thêm mới
            await sql.query`
                INSERT INTO CartItems (userId, itemId, quantity)
                VALUES (${userId}, ${itemId}, ${quantity})
            `;
        }

        res.status(201).json({ message: 'Sản phẩm đã được thêm vào giỏ hàng' });
    } catch (err) {
        console.error('Lỗi khi thêm vào giỏ hàng:', err);
        res.status(500).json({ error: 'Lỗi khi thêm vào giỏ hàng' });
    }
});

// Lấy danh sách sản phẩm trong giỏ hàng
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await sql.query`
            SELECT ci.*, mi.name, mi.price, mi.image
            FROM CartItems ci
            JOIN MenuItems mi ON ci.itemId = mi.id
            WHERE ci.userId = ${userId}
        `;
        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi khi lấy giỏ hàng:', err);
        res.status(500).json({ error: 'Lỗi khi lấy giỏ hàng' });
    }
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/update', async (req, res) => {
    const { userId, itemId, quantity } = req.body;

    try {
        await sql.query`
            UPDATE CartItems 
            SET quantity = ${quantity}
            WHERE userId = ${userId} AND itemId = ${itemId}
        `;
        res.json({ message: 'Cập nhật giỏ hàng thành công' });
    } catch (err) {
        console.error('Lỗi khi cập nhật giỏ hàng:', err);
        res.status(500).json({ error: 'Lỗi khi cập nhật giỏ hàng' });
    }
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/remove', async (req, res) => {
    const { userId, itemId } = req.body;

    try {
        await sql.query`
            DELETE FROM CartItems 
            WHERE userId = ${userId} AND itemId = ${itemId}
        `;
        res.json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công' });
    } catch (err) {
        console.error('Lỗi khi xóa khỏi giỏ hàng:', err);
        res.status(500).json({ error: 'Lỗi khi xóa khỏi giỏ hàng' });
    }
});

// Xóa toàn bộ giỏ hàng
router.delete('/clear/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        await sql.query`
            DELETE FROM CartItems 
            WHERE userId = ${userId}
        `;
        res.json({ message: 'Đã xóa toàn bộ giỏ hàng' });
    } catch (err) {
        console.error('Lỗi khi xóa giỏ hàng:', err);
        res.status(500).json({ error: 'Lỗi khi xóa giỏ hàng' });
    }
});

module.exports = router; 