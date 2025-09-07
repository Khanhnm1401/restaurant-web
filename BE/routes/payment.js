const express = require('express');
const router = express.Router();
const { sql } = require('../db');
const { authenticateToken, isStaff } = require('../middleware/auth');

// Tạo đơn hàng mới - yêu cầu xác thực
router.post('/create-order', authenticateToken, async (req, res) => {
    const { items, totalAmount, paymentMethod } = req.body;
    const userId = req.user.id;
    
    try {
        // tạo oder
        const orderResult = await sql.query`
            INSERT INTO Orders (userId, totalAmount, paymentMethod, status)
            OUTPUT INSERTED.id
            VALUES (${userId}, ${totalAmount}, ${paymentMethod}, 'pending')
        `;
        
        const orderId = orderResult.recordset[0].id;
        //tạo order items song song với order
        for (const item of items) {
            await sql.query`
                INSERT INTO OrderItems (orderId, itemId, quantity, price)
                VALUES (${orderId}, ${item.id}, ${item.quantity}, ${item.price})
            `;
        }
        
        res.status(201).json({ 
            message: 'Order created successfully',
            orderId: orderId
        });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ error: 'Error creating order' });
    }
});

// Cập nhật trạng thái thanh toán - yêu cầu quyền staff
router.put('/update-payment-status/:orderId', authenticateToken, isStaff, async (req, res) => {
    const { orderId } = req.params;
    const { status, transactionId } = req.body;
    
    try {
        await sql.query`
            UPDATE Orders 
            SET status = ${status},
                transactionId = ${transactionId},
                updatedAt = GETDATE(),
                isConfirmed = 1
            WHERE id = ${orderId}
        `;
        
        res.json({ message: 'Payment status updated and confirmed by admin' });
    } catch (err) {
        console.error('Error updating payment status:', err);
        res.status(500).json({ error: 'Error updating payment status' });
    }
});

// Lấy thông tin đơn hàng - yêu cầu xác thực
router.get('/order/:orderId', authenticateToken, async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.id;
    
    try {
        const orderResult = await sql.query`
            SELECT o.*, oi.*, m.name as itemName
            FROM Orders o
            LEFT JOIN OrderItems oi ON o.id = oi.orderId
            LEFT JOIN MenuItems m ON oi.itemId = m.id
            WHERE o.id = ${orderId}
            AND (o.userId = ${userId} OR ${req.user.role} IN ('admin', 'staff'))
        `;
        
        if (orderResult.recordset.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json(orderResult.recordset);
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ error: 'Error fetching order details' });
    }
});

// Lấy lịch sử đơn hàng của người dùng - yêu cầu xác thực
router.get('/user-orders/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params;
    
    // Kiểm tra quyền truy cập
    if (req.user.id !== parseInt(userId) && !['admin', 'staff'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    try {
        const orders = await sql.query`
            SELECT * FROM Orders
            WHERE userId = ${userId}
            ORDER BY createdAt DESC
        `;
        
        res.json(orders.recordset);
    } catch (err) {
        console.error('Error fetching user orders:', err);
        res.status(500).json({ error: 'Error fetching user orders' });
    }
});

// Lấy lịch sử thanh toán - yêu cầu xác thực
router.get('/payment-history/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params;
    
    // Kiểm tra quyền truy cập
    if (req.user.id !== parseInt(userId) && !['admin', 'staff'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    try {
        const payments = await sql.query`
            SELECT 
                o.id as orderId,
                o.totalAmount,
                o.paymentMethod,
                o.status,
                o.transactionId,
                o.createdAt as paymentDate
            FROM Orders o
            WHERE o.userId = ${userId}
            AND o.status != 'pending'
            ORDER BY o.createdAt DESC
        `;
        
        res.json(payments.recordset);
    } catch (err) {
        console.error('Error fetching payment history:', err);
        res.status(500).json({ error: 'Error fetching payment history' });
    }
});

// API thanh toán đơn hàng - yêu cầu xác thực
router.post('/pay', authenticateToken, async (req, res) => {
    const { orderId, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentMethod) {
        return res.status(400).json({ error: 'orderId and paymentMethod are required' });
    }

    try {
        // Kiểm tra đơn hàng tồn tại và thuộc về người dùng
        const orderResult = await sql.query`
            SELECT * FROM Orders 
            WHERE id = ${orderId} 
            AND status = 'pending'
            AND userId = ${userId}
        `;

        if (orderResult.recordset.length === 0) {
            return res.status(400).json({ error: 'Order not found or cannot be paid' });
        }

        const transactionId = 'TRX' + Date.now();

        await sql.query`
            UPDATE Orders
            SET status = 'paid',
                paymentMethod = ${paymentMethod},
                transactionId = ${transactionId},
                updatedAt = GETDATE()
            WHERE id = ${orderId}
        `;

        res.json({
            message: 'Payment successful',
            orderId,
            transactionId
        });
    } catch (err) {
        console.error('Error processing payment:', err);
        res.status(500).json({ error: 'Error processing payment' });
    }
});

// Thống kê tổng doanh thu - chỉ tính đơn đã thanh toán
router.get('/revenue', async (req, res) => {
    try {
        const result = await sql.query`
            SELECT ISNULL(SUM(totalAmount), 0) AS totalRevenue 
            FROM Orders 
            WHERE status = 'paid' AND isConfirmed = 1
        `;
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi tính toán doanh thu' });
    }
});

// Thống kê doanh thu theo ngày - chỉ tính đơn đã xác nhận
router.get('/revenue-by-day', async (req, res) => {
    const { date } = req.query; // YYYY-MM-DD
    try {
        const result = await sql.query`
            SELECT ISNULL(SUM(totalAmount), 0) AS totalRevenue
            FROM Orders
            WHERE CAST(createdAt AS DATE) = ${date} AND status = 'paid' AND isConfirmed = 1
        `;
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy doanh thu theo ngày' });
    }
});

// Thống kê doanh thu theo tháng - chỉ tính đơn đã xác nhận
router.get('/revenue-by-month', async (req, res) => {
    const { month } = req.query; // YYYY-MM
    try {
        const result = await sql.query`
            SELECT ISNULL(SUM(totalAmount), 0) AS totalRevenue
            FROM Orders
            WHERE FORMAT(createdAt, 'yyyy-MM') = ${month} AND status = 'paid' AND isConfirmed = 1
        `;
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy doanh thu theo tháng' });
    }
});

// Thống kê doanh thu theo năm - chỉ tính đơn đã xác nhận
router.get('/revenue-by-year', async (req, res) => {
    const { year } = req.query; // YYYY
    try {
        const result = await sql.query`
            SELECT ISNULL(SUM(totalAmount), 0) AS totalRevenue
            FROM Orders
            WHERE YEAR(createdAt) = ${year} AND status = 'paid' AND isConfirmed = 1
        `;
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy doanh thu theo năm' });
    }
});

module.exports = router; 