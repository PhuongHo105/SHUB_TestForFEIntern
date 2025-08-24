# Cấu trúc dự án

```
Task 1/
├── public/               # Chứa các file tĩnh (hình ảnh, favicon, ...)
│   └── vite.svg
├── src/                  # Chứa mã nguồn React
│   ├── App.jsx           # Component chính, xử lý giao diện và logic
│   ├── App.css           # Style cho App
│   ├── index.css         # Style toàn cục
│   ├── main.jsx          # Điểm khởi tạo ứng dụng React
│   └── assets/           # Chứa các hình ảnh sử dụng trong src
│       └── react.svg
├── index.html            # File HTML gốc
├── package.json          # Thông tin, script và dependency của dự án
├── vite.config.js        # Cấu hình cho Vite
├── eslint.config.js      # Cấu hình ESLint
└── README.md             # Hướng dẫn sử dụng và phát triển
```

# Ứng dụng Báo cáo doanh thu xăng dầu

## Chức năng

- Upload file báo cáo giao dịch (.xlsx) của cửa hàng xăng dầu
- Chọn khoảng thời gian (giờ bắt đầu, giờ kết thúc)
- Tính tổng "Thành tiền" trong khoảng thời gian đã chọn
- Hiển thị toàn bộ dữ liệu đã đọc từ file dưới dạng bảng
- Hỗ trợ kéo & thả file hoặc chọn file từ máy tính
- Kiểm tra định dạng file, báo lỗi nếu không đúng định dạng

## Cách chạy ứng dụng

1. Cài đặt các package cần thiết:
   
	```bash
	npm install
	```

2. Chạy ứng dụng:
   
	```bash
	npm run dev
	```

3. Truy cập địa chỉ hiển thị trên terminal (thường là http://localhost:5173)

## Hướng dẫn sử dụng

1. Chuẩn bị file báo cáo giao dịch dạng Excel (.xlsx), header nằm ở hàng 8 (dòng 8 là tiêu đề cột).
2. Kéo & thả file vào vùng "Kéo và thả file báo cáo (.xlsx) vào đây" hoặc chọn file bằng nút "Chọn file báo cáo".
3. Chọn giờ bắt đầu và giờ kết thúc cần truy vấn.
4. Nhấn nút "Tính tổng Thành tiền" để xem kết quả.
5. Dữ liệu từ file sẽ được hiển thị ở bảng bên dưới, có thể kiểm tra lại các cột như "Tên khách hàng", "Thành tiền (VNĐ)", ...


## Giải thích cách phát triển các chức năng

### 1. Upload và Drag & Drop file
- Sử dụng thẻ `<input type="file" />` để chọn file từ máy tính.
- Thêm vùng drag & drop, xử lý sự kiện `onDrop` để nhận file khi người dùng kéo thả.
- Kiểm tra định dạng file, chỉ nhận file `.xlsx`, nếu sai sẽ báo lỗi.

### 2. Đọc dữ liệu từ file Excel
- Sử dụng thư viện [SheetJS (xlsx)](https://github.com/SheetJS/sheetjs) để đọc dữ liệu từ file Excel ngay trên trình duyệt.
- Đọc dữ liệu từ sheet đầu tiên, bắt đầu từ hàng 8 (dòng 8 là header), sử dụng option `range: 7`.
- Chuyển dữ liệu thành mảng các object, mỗi object là một dòng dữ liệu.

### 3. Hiển thị dữ liệu dưới dạng bảng
- Dữ liệu đọc được sẽ lưu vào state `tableData`.
- Nếu có dữ liệu, render bảng với các cột động dựa trên header của file.
- Nếu chưa có dữ liệu, giữ khung bảng cố định để giao diện không bị thay đổi kích thước.

### 4. Tính tổng "Thành tiền" theo khoảng thời gian
- Khi người dùng nhập giờ bắt đầu/kết thúc và nhấn nút, lọc dữ liệu theo cột "Giờ".
- Tính tổng giá trị từ cột "Thành tiền (VNĐ)" trong khoảng thời gian đã chọn.

### 5. Kiểm tra lỗi và thông báo
- Nếu file sai định dạng hoặc lỗi khi đọc, hiển thị thông báo lỗi rõ ràng cho người dùng.
- Nếu không có dữ liệu hoặc thiếu cột, cũng báo lỗi hoặc hướng dẫn chỉnh lại file.

### 6. Xử lý hoàn toàn phía client
- Tất cả thao tác đọc file, xử lý dữ liệu, tính toán đều thực hiện trên trình duyệt, không gửi dữ liệu ra server.
