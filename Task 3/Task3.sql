IF DB_ID('QLBX') IS NULL
BEGIN
	CREATE DATABASE QLBX;
END;
GO

USE QLBX;
GO

IF OBJECT_ID('dbo.TRAMXANG', 'U') IS NULL
BEGIN
	CREATE TABLE TRAMXANG
	(
		TramID INT PRIMARY KEY IDENTITY(0,1),
		TenTram NVARCHAR(100) NOT NULL,
		DiaChi NVARCHAR(255),
		SoDienThoai VARCHAR(20),
		QuanLy NVARCHAR(100),  
		NgayHoatDong DATE
	)
END;
GO

IF OBJECT_ID('dbo.HANGHOA', 'U') IS NULL
BEGIN
	CREATE TABLE HANGHOA
	(
		HangHoaID INT PRIMARY KEY IDENTITY(0,1),
		TenHangHoa NVARCHAR(100) NOT NULL,  
		Loai NVARCHAR(50),                  
		DonViTinh NVARCHAR(20) DEFAULT 'lít',
		GiaHienTai DECIMAL(10,2) NOT NULL, 
		NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP
	)
END;
GO

IF OBJECT_ID('dbo.TRUBOM', 'U') IS NULL
BEGIN
	CREATE TABLE TRUBOM
	(
		TruBomID INT PRIMARY KEY IDENTITY(0,1),
		MaSoTru VARCHAR(50) NOT NULL,     
		TramID INT NOT NULL,
		HangHoaID INT NOT NULL,
		TrangThai BIT DEFAULT 0, --0: hoạt động, 1: dừng hoạt động 
		FOREIGN KEY (TramID) REFERENCES TRAMXANG(TramID),
		FOREIGN KEY (HangHoaID) REFERENCES HANGHOA(HangHoaID),
		UNIQUE (TramID, MaSoTru) 
	)
END;
GO

IF OBJECT_ID('dbo.GIAODICH', 'U') IS NULL
BEGIN
	CREATE TABLE GIAODICH
	(
		GiaoDichID BIGINT PRIMARY KEY IDENTITY(0,1),
		TramID INT NOT NULL,
		TruBomID INT NOT NULL,
		HangHoaID INT NOT NULL,
		SoLuong DECIMAL(10,2) NOT NULL,
		DonGia DECIMAL(10,2) NOT NULL,
		TongTien AS (SoLuong * DonGia) PERSISTED, 
		NgayGio DATETIME DEFAULT GETDATE(),
		PhuongThucThanhToan NVARCHAR(50),
		FOREIGN KEY (TramID) REFERENCES TRAMXANG(TramID),
		FOREIGN KEY (TruBomID) REFERENCES TRUBOM(TruBomID),
		FOREIGN KEY (HangHoaID) REFERENCES HANGHOA(HangHoaID)
	)
END;
GO

INSERT INTO TRAMXANG (TenTram, DiaChi, SoDienThoai, QuanLy, NgayHoatDong)
VALUES 
(N'Tràm xăng Q1', N'123 Lê Lợi, Quận 1, TP.HCM', '0909123456', N'Nguyễn Văn A', '2015-05-10'),
(N'Tràm xăng Q7', N'45 Nguyễn Văn Linh, Quận 7, TP.HCM', '0909765432', N'Trần Thị B', '2018-08-20'),
(N'Tràm xăng Bình Thạnh', N'88 Điện Biên Phủ, Bình Thạnh, TP.HCM', '0912345678', N'Lê Văn C', '2020-03-15');
GO

INSERT INTO HANGHOA (TenHangHoa, Loai, DonViTinh, GiaHienTai, NgayCapNhat)
VALUES
(N'Xăng RON 95-IV', N'Xăng', N'Lít', 24000, GETDATE()),
(N'Xăng E5 RON 92', N'Xăng', N'Lít', 23000, GETDATE()),
(N'Dầu DO 0,05S', N'Dầu', N'Lít', 20000, GETDATE()),
(N'Dầu hỏa', N'Dầu', N'Lít', 18000, GETDATE());
GO

-- Trạm Q1 có 2 trụ
INSERT INTO TRUBOM (MaSoTru, TramID, HangHoaID, TrangThai)
VALUES
('T1', 0, 0, 0),   -- Trụ T1 bán RON 95
('T2', 0, 1, 0);   -- Trụ T2 bán E5
GO

-- Trạm Q7 có 3 trụ
INSERT INTO TRUBOM (MaSoTru, TramID, HangHoaID, TrangThai)
VALUES
('T1', 1, 0, 0),
('T2', 1, 2, 0),
('T3', 1, 3, 1);
GO

-- Trạm Bình Thạnh có 2 trụ
INSERT INTO TRUBOM (MaSoTru, TramID, HangHoaID, TrangThai)
VALUES
('T1', 2, 1, 0),
('T2', 2, 2, 0);
GO

INSERT INTO GIAODICH (TramID, TruBomID, HangHoaID, SoLuong, DonGia, PhuongThucThanhToan)
VALUES
(0, 0, 0, 20, 24000, N'Tiền mặt'),   -- Q1, Trụ T1, RON95, 20L
(0, 1, 1, 15, 23000, N'Thẻ ngân hàng'), -- Q1, Trụ T2, E5, 15L
(1, 0, 0, 30, 24000, N'Tiền mặt'),   -- Q7, Trụ T1, RON95, 30L
(1, 1, 2, 50, 20000, N'Ví điện tử'), -- Q7, Trụ T2, Dầu DO, 50L
(2, 0, 1, 25, 23000, N'Tiền mặt'),   -- Bình Thạnh, Trụ T1, E5, 25L
(2, 1, 2, 40, 20000, N'Thẻ ngân hàng'); -- Bình Thạnh, Trụ T2, Dầu DO, 40L
GO

--Lấy tất cả giao dịch của 1 trạm trong khoảng ngày
CREATE OR ALTER PROCEDURE GIAODICHCUAMOTTRAM
@TramID INT, 
@NgayBD VARCHAR(10), 
@NgayKT VARCHAR(10)
AS
BEGIN 
	DECLARE @NgayBatDau DATE;
	DECLARE @NgayKetThuc DATE;

	SET @NgayBatDau = CONVERT(DATE, @NgayBD, 23)
	SET @NgayKetThuc = CONVERT(DATE, @NgayKT, 23)

	SELECT g.GiaoDichID,
           t.TenTram,
           h.TenHangHoa,
           g.SoLuong,
           g.DonGia,
           g.TongTien,
           g.NgayGio,
           g.PhuongThucThanhToan
    FROM GIAODICH g
    JOIN TRAMXANG t ON g.TramID = t.TramID
    JOIN HANGHOA h ON g.HangHoaID = h.HangHoaID
    WHERE g.TramID = @TramID
      AND g.NgayGio BETWEEN @NgayBatDau AND @NgayKetThuc -- lấy đến hết ngày kết thúc
    ORDER BY g.NgayGio;
END;
GO

EXEC GIAODICHCUAMOTTRAM 0, '2025-01-20', '2025-08-25';
GO

--Tổng doanh thu theo ngày cho một trụ bơm
CREATE OR ALTER PROCEDURE DOANHTHUTHEONGAYCHOTRUBOM
@TramID INT,
@TruBomID INT
AS
BEGIN 
	SELECT 
        g.TruBomID,
        tb.MaSoTru,
        t.TenTram,
        h.TenHangHoa,
        CAST(g.NgayGio AS DATE) AS Ngay,
        SUM(g.SoLuong) AS TongSoLuong,
        SUM(g.TongTien) AS TongDoanhThu
    FROM GiaoDich g
    JOIN TramXang t ON g.TramID = t.TramID
    JOIN HangHoa h ON g.HangHoaID = h.HangHoaID
    JOIN TruBom tb ON g.TruBomID = tb.TruBomID
    WHERE g.TramID = @TramID
      AND g.TruBomID = @TruBomID
    GROUP BY g.TruBomID, tb.MaSoTru, t.TenTram, h.TenHangHoa, CAST(g.NgayGio AS DATE)
    ORDER BY Ngay ASC;
END;
GO

EXEC DOANHTHUTHEONGAYCHOTRUBOM 0, 0
GO

--Tổng doanh thu theo ngày cho một trạm
CREATE OR ALTER PROCEDURE DOANHTHUTHEONGAYCHOTRAM
@TramID INT
AS
BEGIN 
	SELECT 
        t.TramID,
        t.TenTram,
        CAST(g.NgayGio AS DATE) AS Ngay,
        SUM(g.SoLuong) AS TongSoLuong,
        SUM(g.TongTien) AS TongDoanhThu
    FROM GiaoDich g
    JOIN TramXang t ON g.TramID = t.TramID
    JOIN HangHoa h ON g.HangHoaID = h.HangHoaID
    WHERE g.TramID = @TramID
    GROUP BY t.TramID, t.TenTram, CAST(g.NgayGio AS DATE)
    ORDER BY Ngay;
END;
GO

EXEC DOANHTHUTHEONGAYCHOTRAM 0
GO

--Top 3 hàng hóa bán chạy nhất và tổng số lít tại một trạm trong tháng
CREATE OR ALTER PROCEDURE DOANHSOTHANG_TOP3HANGHOA
    @TramID INT,
    @Nam INT,
    @Thang INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 3
        h.HangHoaID,
        h.TenHangHoa,
        SUM(g.SoLuong) AS TongSoLuong,  -- Tổng số lít bán
        SUM(g.TongTien) AS TongDoanhThu
    FROM GiaoDich g
    JOIN HangHoa h ON g.HangHoaID = h.HangHoaID
    WHERE g.TramID = @TramID
      AND YEAR(g.NgayGio) = @Nam
      AND MONTH(g.NgayGio) = @Thang
    GROUP BY h.HangHoaID, h.TenHangHoa
    ORDER BY TongSoLuong DESC;   -- Lấy top 3 theo số lượng
END;
GO

EXEC DOANHSOTHANG_TOP3HANGHOA @TramID = 1, @Nam = 2025, @Thang = 8;
GO