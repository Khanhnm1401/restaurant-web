const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { sql } = require('../db');
const fs = require('fs');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/') // Lưu ảnh trong thư mục public/images
    },
    filename: function (req, file, cb) {
        // Tạo tên file unique
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Chỉ chấp nhận file ảnh
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    }
});

// API upload hình ảnh - yêu cầu quyền admin
router.post('/upload', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Không có file được upload' });
        }

        // Tạo URL cho ảnh
        const imageUrl = `/images/${req.file.filename}`;

        // Lưu URL vào database
        await sql.query`
            INSERT INTO Images (url)
            VALUES (${imageUrl})
        `;

        // Lấy id vừa insert
        const result = await sql.query`
            SELECT TOP 1 id FROM Images ORDER BY id DESC
        `;

        res.status(201).json({
            message: 'Upload ảnh thành công',
            imageId: result.recordset[0].id,
            imageUrl: imageUrl
        });
    } catch (err) {
        console.error('Lỗi khi upload ảnh:', err);
        res.status(500).json({ error: 'Lỗi khi upload ảnh' });
    }
});

// API lấy danh sách ảnh - yêu cầu quyền admin
router.get('/images', authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await sql.query`SELECT id, url FROM Images ORDER BY id DESC`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi khi lấy danh sách ảnh:', err);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách ảnh' });
    }
});

// API xóa ảnh - yêu cầu quyền admin
router.delete('/images/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        // Lấy URL của ảnh
        const imageResult = await sql.query`SELECT url FROM Images WHERE id = ${id}`;
        if (imageResult.recordset.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy ảnh' });
        }

        // Xóa file ảnh
        const imagePath = path.join(__dirname, '..', 'public', imageResult.recordset[0].url);
        fs.unlinkSync(imagePath);

        // Xóa URL khỏi database
        await sql.query`DELETE FROM Images WHERE id = ${id}`;
        
        res.json({ message: 'Xóa ảnh thành công' });
    } catch (err) {
        console.error('Lỗi khi xóa ảnh:', err);
        res.status(500).json({ error: 'Lỗi khi xóa ảnh' });
    }
});

module.exports = router; 