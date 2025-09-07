-- Thêm cột paymentMethod
BEGIN TRY
    ALTER TABLE Orders ADD paymentMethod VARCHAR(50) NULL;
    PRINT 'Added paymentMethod column';
END TRY
BEGIN CATCH
    PRINT 'paymentMethod column already exists';
END CATCH

-- Thêm cột status
BEGIN TRY
    ALTER TABLE Orders ADD status VARCHAR(20) NULL;
    PRINT 'Added status column';
END TRY
BEGIN CATCH
    PRINT 'status column already exists';
END CATCH

-- Thêm cột transactionId
BEGIN TRY
    ALTER TABLE Orders ADD transactionId VARCHAR(100) NULL;
    PRINT 'Added transactionId column';
END TRY
BEGIN CATCH
    PRINT 'transactionId column already exists';
END CATCH

-- Thêm cột updatedAt
BEGIN TRY
    ALTER TABLE Orders ADD updatedAt DATETIME NULL;
    PRINT 'Added updatedAt column';
END TRY
BEGIN CATCH
    PRINT 'updatedAt column already exists';
END CATCH

-- Cập nhật giá trị mặc định cho các cột mới
UPDATE Orders 
SET paymentMethod = 'cash' 
WHERE paymentMethod IS NULL;

UPDATE Orders 
SET status = 'completed' 
WHERE status IS NULL;

UPDATE Orders 
SET updatedAt = GETDATE() 
WHERE updatedAt IS NULL;

-- Thêm ràng buộc NOT NULL và DEFAULT cho status
BEGIN TRY
    ALTER TABLE Orders ALTER COLUMN status VARCHAR(20) NOT NULL;
    ALTER TABLE Orders ADD CONSTRAINT DF_Orders_status DEFAULT 'pending' FOR status;
    PRINT 'Updated status column constraints';
END TRY
BEGIN CATCH
    PRINT 'Could not update status column constraints';
END CATCH

-- Tạo bảng OrderItems nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OrderItems')
BEGIN
    CREATE TABLE OrderItems (
        id INT IDENTITY(1,1) PRIMARY KEY,
        orderId INT NOT NULL,
        itemId INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (orderId) REFERENCES Orders(id),
        FOREIGN KEY (itemId) REFERENCES MenuItems(id)
    );
    PRINT 'Created OrderItems table';
END
ELSE
BEGIN
    PRINT 'OrderItems table already exists';
END
