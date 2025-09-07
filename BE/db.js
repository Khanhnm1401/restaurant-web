const sql = require('mssql');

const config = {
    user: 'sa',
    password: '123456',
    server: 'localhost', // hoặc '127.0.0.1'
    database: 'RestaurantDB',
    port: 50841,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

module.exports = { sql, connectDB };