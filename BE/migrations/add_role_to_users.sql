-- Thêm cột role vào bảng Users
ALTER TABLE Users ADD role VARCHAR(20) NOT NULL DEFAULT 'user';

-- Tạo index cho cột role để tăng tốc truy vấn
CREATE INDEX idx_users_role ON Users(role);

-- Cập nhật người dùng hiện có với vai trò 'user'
UPDATE Users SET role = 'user' WHERE role IS NULL;

-- Thêm ràng buộc để đảm bảo role chỉ có thể là: 'user', 'staff', 'admin'
ALTER TABLE Users ADD CONSTRAINT chk_users_role 
CHECK (role IN ('user', 'staff', 'admin')); 