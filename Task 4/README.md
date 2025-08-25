# Hướng dẫn thực thi chương trình

## Yêu cầu
- Đã cài đặt Node.js
- Đã cài đặt thư viện axios: Chạy lệnh `npm install axios` trong thư mục dự án

## Thực thi
1. Mở terminal tại thư mục dự án
2. Cài đặt các thư viện cần thiết
   ```bash
   npm install
   ```
3. Chạy lệnh sau để thực thi:
   ```powershell
   node task4.js
   ```
4. Chương trình sẽ tự động:
   - Lấy dữ liệu từ API
   - Xử lý các truy vấn
   - Gửi kết quả lên API

## Lưu ý
- Nếu có lỗi xác thực hoặc lỗi API, kiểm tra lại kết nối mạng và thông báo lỗi trên terminal.
- Kết quả sẽ được in ra màn hình để kiểm tra nhanh.

## Giải thích thuật toán và các hàm

Chương trình gồm các bước và hàm sau, đảm bảo độ phức tạp O(n + q):

### 1. Hàm getInput
- Gửi yêu cầu GET đến API để lấy dữ liệu đầu vào (mảng số nguyên, truy vấn, token).
- Độ phức tạp: O(1)

### 2. Hàm processQueries
- Xử lý toàn bộ truy vấn trên mảng số nguyên.
- Các bước thực hiện:
  1. Tính mảng cộng dồn (`prefixSum` và `altPrefixSum`) bằng cách duyệt qua mảng một lần. Độ phức tạp: O(n)
  2. Với mỗi truy vấn, chỉ cần lấy hiệu hai giá trị trong mảng cộng dồn để ra kết quả. Độ phức tạp: O(q)
- Tổng: O(n + q)

### 3. Hàm postOutput
- Gửi kết quả lên API bằng phương thức POST.
- Độ phức tạp: O(1)

### 4. Hàm main
- Điều phối các bước: lấy dữ liệu, xử lý truy vấn, gửi kết quả.
- Trình tự: getInput → processQueries → postOutput

### Vì sao đạt O(n + q)?
- Tính mảng cộng dồn chỉ duyệt qua mảng một lần (O(n)).
- Mỗi truy vấn chỉ cần thao tác với hai giá trị trong mảng cộng dồn (O(1)), tổng cộng O(q).
- Không duyệt lại mảng con cho từng truy vấn.

