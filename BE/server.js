const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 8080;

// Đặt các middleware toàn cục trước
app.use(cors());  //cho phép cross-origin requests
app.use(express.json());  // Phân tích JSON body

// Cấu hình static file serving cho thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Kết nối đến SQL Server
connectDB();

// Mount các route
app.use('/api/menu', require('./routes/menu'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/booking', require('./routes/booking'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/review', require('./routes/review'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});