## Giải thích cách xây dựng cơ sở dữ liệu

Cơ sở dữ liệu được thiết kế để quản lý hoạt động của các trạm xăng, bao gồm các thông tin về trạm, hàng hóa, trụ bơm, giao dịch và các báo cáo doanh thu. Quá trình xây dựng CSDL dựa trên các bước sau:

1. **Tạo database**: Sử dụng lệnh tạo mới database `QLBX` nếu chưa tồn tại.
2. **Tạo các bảng**:
   - `TRAMXANG`: Lưu thông tin các trạm xăng (tên, địa chỉ, quản lý, ngày hoạt động...)
   - `HANGHOA`: Lưu thông tin các loại hàng hóa (xăng, dầu, giá, loại...)
   - `TRUBOM`: Quản lý các trụ bơm tại mỗi trạm, liên kết với hàng hóa và trạm xăng.
   - `GIAODICH`: Lưu các giao dịch bán hàng, liên kết với trạm, trụ bơm, hàng hóa, có thông tin số lượng, đơn giá, tổng tiền, phương thức thanh toán.
3. **Thiết lập khóa chính, khóa ngoại**: Đảm bảo tính liên kết giữa các bảng, ví dụ `TRUBOM` liên kết với `TRAMXANG` và `HANGHOA`, `GIAODICH` liên kết với các bảng còn lại.
4. **Thêm dữ liệu mẫu**: Chèn các bản ghi mẫu cho trạm xăng, hàng hóa, trụ bơm và giao dịch để kiểm thử hệ thống.
5. **Tạo các thủ tục (Stored Procedure)**: Xây dựng các thủ tục để truy vấn dữ liệu như:
   - Lấy giao dịch của một trạm trong khoảng ngày.
   - Tính doanh thu theo ngày cho từng trụ bơm hoặc trạm.
   - Thống kê top 3 hàng hóa bán chạy nhất trong tháng tại một trạm.

Các bước trên giúp hệ thống hóa dữ liệu, đảm bảo tính toàn vẹn và hỗ trợ các nghiệp vụ quản lý, báo cáo cho các trạm xăng.

---

## Giải thích cách hoạt động bên trong từng thủ tục

1. **GIAODICHCUAMOTTRAM**
   - Khi thực thi, thủ tục nhận vào ID trạm và hai ngày (bắt đầu, kết thúc).
   - Chuyển đổi hai tham số ngày sang kiểu DATE để đảm bảo so sánh chính xác.
   - Truy vấn bảng GIAODICH, kết hợp với bảng TRAMXANG và HANGHOA để lấy thông tin chi tiết.
   - Lọc các giao dịch theo đúng trạm và nằm trong khoảng thời gian chỉ định.
   - Sắp xếp kết quả theo thời gian giao dịch tăng dần.

2. **DOANHTHUTHEONGAYCHOTRUBOM**
   - Nhận vào ID trạm và ID trụ bơm.
   - Truy vấn bảng GIAODICH, kết hợp với các bảng liên quan để lấy thông tin trụ, trạm, hàng hóa.
   - Lọc các giao dịch đúng trạm và đúng trụ bơm.
   - Nhóm kết quả theo ngày, tính tổng số lượng và tổng doanh thu mỗi ngày.
   - Sắp xếp kết quả theo ngày tăng dần.

3. **DOANHTHUTHEONGAYCHOTRAM**
   - Nhận vào ID trạm.
   - Truy vấn bảng GIAODICH, kết hợp với bảng TRAMXANG và HANGHOA.
   - Lọc các giao dịch đúng trạm.
   - Nhóm kết quả theo ngày, tính tổng số lượng và tổng doanh thu mỗi ngày.
   - Sắp xếp kết quả theo ngày tăng dần.

4. **DOANHSOTHANG_TOP3HANGHOA**
   - Nhận vào ID trạm, năm và tháng.
   - Truy vấn bảng GIAODICH, kết hợp với bảng HANGHOA.
   - Lọc các giao dịch đúng trạm, đúng năm và tháng cần thống kê.
   - Nhóm kết quả theo từng loại hàng hóa, tính tổng số lượng và tổng doanh thu.
   - Sắp xếp kết quả theo tổng số lượng giảm dần, lấy top 3 hàng hóa bán chạy nhất.

---

## Hướng dẫn cách chạy các thủ tục

Để thực thi các thủ tục đã tạo trong SQL, bạn thực hiện như sau:

1. Mở phần mềm quản lý SQL Server (ví dụ: SQL Server Management Studio).
2. Mở file 'Task3.sql'.
3. Nhấn f5 để chạy lần lượt các lệnh trong file 'Task3.sql'.
4. Sử dụng lệnh EXEC để gọi từng thủ tục với các tham số phù hợp. Ví dụ:

- Lấy giao dịch của một trạm trong khoảng ngày:
  ```sql
  EXEC GIAODICHCUAMOTTRAM 0, '2025-01-20', '2025-08-25';
  ```
- Doanh thu theo ngày cho một trụ bơm:
  ```sql
  EXEC DOANHTHUTHEONGAYCHOTRUBOM 0, 0;
  ```
- Doanh thu theo ngày cho một trạm:
  ```sql
  EXEC DOANHTHUTHEONGAYCHOTRAM 0;
  ```
- Top 3 hàng hóa bán chạy nhất trong tháng:
  ```sql
  EXEC DOANHSOTHANG_TOP3HANGHOA @TramID = 1, @Nam = 2025, @Thang = 8;
  ```

5. Xem kết quả trả về trên giao diện phần mềm hoặc xuất ra file báo cáo theo nhu cầu.

Bạn có thể thay đổi các tham số đầu vào để truy xuất dữ liệu phù hợp với từng trường hợp quản lý hoặc thống kê.
