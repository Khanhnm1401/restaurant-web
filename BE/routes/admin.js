const express = require('express');
const router = express.Router();
const { sql } = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Tất cả các route admin đều yêu cầu xác thực và quyền admin
router.use(authenticateToken);
router.use(isAdmin);

// Thêm món ăn mới
router.post('/add-item', async (req, res) => {
    const { name, price, description, image } = req.body;

    try {
        await sql.query`INSERT INTO MenuItems (name, price, description, image) VALUES (${name}, ${price}, ${description}, ${image})`;
        res.status(201).json({ message: 'Thêm món ăn thành công' });
    } catch (err) {
        console.error('Lỗi khi thêm món ăn:', err);
        res.status(500).json({ error: 'Lỗi khi thêm món ăn' });
    }
});

// Lấy danh sách khách hàng có phân trang
router.get('/users', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const countResult = await sql.query`SELECT COUNT(*) as total FROM Users`;
        const total = countResult.recordset[0].total;

        const result = await sql.query`
            SELECT id, email, role FROM Users
            ORDER BY id
            OFFSET ${offset} ROWS
            FETCH NEXT ${limit} ROWS ONLY
        `;
        res.json({
            users: result.recordset,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách khách hàng' });
    }
});

// Lấy danh sách đơn đặt bàn có phân trang
router.get('/bookings', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const countResult = await sql.query`SELECT COUNT(*) as total FROM Bookings`;
        const total = countResult.recordset[0].total;

        const result = await sql.query`
            SELECT * FROM Bookings
            ORDER BY id
            OFFSET ${offset} ROWS
            FETCH NEXT ${limit} ROWS ONLY
        `;
        res.json({
            bookings: result.recordset,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách đặt bàn' });
    }
});

// Lấy danh sách tất cả đơn hàng có phân trang
router.get('/orders', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        // Lấy tổng số đơn hàng
        const countResult = await sql.query`SELECT COUNT(*) as total FROM Orders`;
        const total = countResult.recordset[0].total;

        // Lấy danh sách đơn hàng với thông tin chi tiết
        const result = await sql.query`
            SELECT 
                o.*,
                u.email as customerEmail,
                STRING_AGG(CONCAT(m.name, ' (', oi.quantity, ')'), ', ') as items
            FROM Orders o
            LEFT JOIN Users u ON o.userId = u.id
            LEFT JOIN OrderItems oi ON o.id = oi.orderId
            LEFT JOIN MenuItems m ON oi.itemId = m.id
            GROUP BY o.id, o.userId, o.totalAmount, o.paymentMethod, o.status, 
                     o.transactionId, o.createdAt, o.updatedAt, o.isConfirmed, u.email
            ORDER BY o.createdAt DESC
            OFFSET ${offset} ROWS
            FETCH NEXT ${limit} ROWS ONLY
        `;

        res.json({
            orders: result.recordset,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', err);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách đơn hàng' });
    }
});

// Lấy chi tiết một đơn hàng
router.get('/orders/:orderId', async (req, res) => {
    const { orderId } = req.params;

    try {
        const result = await sql.query`
            SELECT 
                o.*,
                u.email as customerEmail,
                oi.quantity,
                oi.price as itemPrice,
                m.name as itemName,
                m.image as itemImage
            FROM Orders o
            LEFT JOIN Users u ON o.userId = u.id
            LEFT JOIN OrderItems oi ON o.id = oi.orderId
            LEFT JOIN MenuItems m ON oi.itemId = m.id
            WHERE o.id = ${orderId}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        }

        // Nhóm các món ăn trong đơn hàng
        const order = {
            ...result.recordset[0],
            items: result.recordset.map(row => ({
                name: row.itemName,
                quantity: row.quantity,
                price: row.itemPrice,
                image: row.itemImage
            }))
        };

        res.json(order);
    } catch (err) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
        res.status(500).json({ error: 'Lỗi khi lấy chi tiết đơn hàng' });
    }
});

// Lấy danh sách tất cả khách hàng (có phân trang)
router.get('/all-users', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try {
        // Đếm tổng số khách hàng
        const countResult = await sql.query`
            SELECT COUNT(*) as total FROM Users
        `;
        const total = countResult.recordset[0].total;

        // Lấy danh sách khách hàng phân trang với CTE và ISNULL
        const result = await sql.query`
            WITH UserStats AS (
                SELECT 
                    u.id,
                    u.email,
                    u.role,
                    ISNULL(COUNT(DISTINCT CASE WHEN o.status = 'paid' AND o.isConfirmed = 1 THEN o.id END), 0) as totalOrders,
                    ISNULL(SUM(CASE WHEN o.status = 'paid' AND o.isConfirmed = 1 THEN o.totalAmount ELSE 0 END), 0) as totalSpent
                FROM Users u
                LEFT JOIN Orders o ON u.id = o.userId
                GROUP BY u.id, u.email, u.role
            )
            SELECT *
            FROM UserStats
            ORDER BY id
            OFFSET ${offset} ROWS
            FETCH NEXT ${limit} ROWS ONLY
        `;

        res.json({
            users: result.recordset,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error('Lỗi khi lấy danh sách khách hàng:', err);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách khách hàng' });
    }
});

// Thống kê tổng doanh thu
router.get('/revenue', async (req, res) => {
    try {
        const result = await sql.query`SELECT SUM(totalAmount) AS totalRevenue FROM Orders WHERE status = 'paid' AND isConfirmed = 1`;
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi tính toán doanh thu' });
    }
});

// Lấy danh sách món ăn (Menu) chỉ lấy món chưa bị xóa
router.get('/menu', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM MenuItems WHERE isDeleted = 0`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách món ăn' });
    }
});

// Xóa mềm món ăn
router.delete('/menu/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`UPDATE MenuItems SET isDeleted = 1 WHERE id = ${id}`;
        res.json({ message: 'Đã ẩn món ăn thành công' });
    } catch (err) {
        console.error('Lỗi khi ẩn món ăn:', err);
        res.status(500).json({ error: 'Lỗi khi ẩn món ăn' });
    }
});

// Lấy doanh thu theo ngày - chỉ tính đơn đã xác nhận
router.get('/revenue-by-day', async (req, res) => {
    const { date } = req.query; // YYYY-MM-DD
    try {
        const result = await sql.query`
            SELECT SUM(totalAmount) AS totalRevenue 
            FROM Orders 
            WHERE CAST(createdAt AS DATE) = ${date} 
              AND status = 'paid' 
              AND isConfirmed = 1
        `;
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy doanh thu theo ngày' });
    }
});

// Lấy doanh thu theo tháng - chỉ tính đơn đã xác nhận
router.get('/revenue-by-month', async (req, res) => {
    const { month } = req.query; // YYYY-MM
    try {
        const result = await sql.query`
            SELECT SUM(totalAmount) AS totalRevenue
            FROM Orders
            WHERE FORMAT(createdAt, 'yyyy-MM') = ${month}
              AND status = 'paid'
              AND isConfirmed = 1
        `;
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy doanh thu theo tháng' });
    }
});

// Xem tất cả đánh giá (chỉ admin)
router.get('/reviews', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Reviews ORDER BY createdAt DESC`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi khi lấy danh sách đánh giá:', err);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách đánh giá' });
    }
});

// Check/chấp nhận đánh giá (chỉ admin)
router.put('/reviews/:id/check', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`UPDATE Reviews SET checked = 1 WHERE id = ${id}`;
        res.json({ message: 'Đánh giá đã được kiểm tra/chấp nhận' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi cập nhật đánh giá' });
    }
});

// Xác nhận thanh toán đơn hàng (chỉ admin)
router.put('/orders/:orderId/confirm', async (req, res) => {
    const { orderId } = req.params;
    const { status, transactionId } = req.body; // status nên là 'paid'
    try {
        await sql.query`
            UPDATE Orders
            SET status = ${status},
                transactionId = ${transactionId},
                updatedAt = GETDATE(),
                isConfirmed = 1
            WHERE id = ${orderId}
        `;
        res.json({ message: 'Đơn hàng đã được xác nhận thanh toán bởi admin' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xác nhận thanh toán đơn hàng' });
    }
});

// Admin chấp nhận đơn đặt bàn
router.put('/bookings/:bookingId/accept', async (req, res) => {
    const { bookingId } = req.params;
    try {
        await sql.query`
            UPDATE Bookings
            SET status = N'accepted'
            WHERE id = ${bookingId}
        `;
        res.json({ message: 'Đơn đặt bàn đã được chấp nhận' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi chấp nhận đơn đặt bàn' });
    }
});

// Admin từ chối đơn đặt bàn
router.put('/bookings/:bookingId/reject', async (req, res) => {
    const { bookingId } = req.params;
    try {
        await sql.query`
            UPDATE Bookings
            SET status = N'rejected'
            WHERE id = ${bookingId}
        `;
        res.json({ message: 'Đơn đặt bàn đã bị từ chối' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi từ chối đơn đặt bàn' });
    }
});

// Admin xóa đơn đặt bàn
router.delete('/bookings/:bookingId', async (req, res) => {
    const { bookingId } = req.params;
    try {
        await sql.query`
            DELETE FROM Bookings WHERE id = ${bookingId}
        `;
        res.json({ message: 'Đã xóa đơn đặt bàn thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa đơn đặt bàn' });
    }
});

module.exports = router;