# Hướng dẫn sử dụng và chạy dự án

## 1. Cách hoạt động

- Dự án là một ứng dụng React nhập giao dịch cho cửa hàng bán xăng, gồm các trường: thời gian, số lượng, đơn giá, doanh thu, trụ.
- Khi nhập số lượng và đơn giá, doanh thu sẽ tự động tính toán.
- Khi nhấn "Cập nhật", dữ liệu sẽ được kiểm tra hợp lệ bằng thư viện `yup` (kiểm tra thiếu, sai kiểu dữ liệu, v.v.).
- Nếu có lỗi, sẽ hiện thông báo đỏ. Nếu thành công, sẽ hiện thông báo xanh.
- Có thể chọn trụ bằng combobox. Khi nhấn "Đóng" sẽ đóng tab trình duyệt (nếu được phép).

## 2. Cách chạy dự án

1. Cài đặt Node.js và npm nếu chưa có.
2. Mở terminal tại thư mục dự án và chạy lệnh:
   ```sh
   npm install
   ```
   để cài đặt các package cần thiết.
3. Chạy dự án bằng lệnh:
   ```sh
   npm run dev
   ```
   hoặc
   ```sh
   npm start
   ```
4. Mở trình duyệt và truy cập địa chỉ hiển thị (thường là http://localhost:5173 hoặc http://localhost:3000).

## 3. Thư viện sử dụng
- React
- Yup (validate dữ liệu)
- Vite (hoặc Create React App) để chạy dev server

## 4. Lưu ý
- Nếu muốn build production, dùng lệnh:
   ```sh
   npm run build
   ```
- Nếu gặp lỗi, kiểm tra lại các trường dữ liệu hoặc xem console trình duyệt.

## 5. Tùy chỉnh
- Có thể chỉnh sửa giao diện trong các file CSS tương ứng.
- Thêm/xóa trường dữ liệu bằng cách chỉnh file `App.jsx` và các component liên quan.

# Giải thích cấu trúc dự án và cách xây dựng chức năng

## 1. Cấu trúc dự án

```
Task 2/
├── public/
│   └── vite.svg
├── src/
│   ├── index.css
│   ├── main.jsx
│   ├── components/
│   │   ├── Input/
│   │   │   ├── Input.jsx
│   │   │   └── Input.css
│   │   ├── Combobox/
│   │   │   ├── Combobox.jsx
│   │   │   └── Combobox.css
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   └── Button.css
│   ├── pages/
│   │   └── App/
│   │       └── App.jsx
├── README.md
├── README_HDSD.md
├── package.json
├── vite.config.js
├── .gitignore
```

### Giải thích các phần chính:
- `public/`: Chứa các file tĩnh như ảnh, favicon, dùng cho giao diện hoặc branding.
- `src/`: Chứa toàn bộ mã nguồn chính của dự án.
  - `index.css`: File CSS tổng cho toàn bộ ứng dụng.
  - `main.jsx`: File khởi tạo React, render ứng dụng vào DOM.
  - `components/`: Chứa các component tái sử dụng cho form, nút, combobox, datepicker...
    - `Input/`: Component nhập liệu cho các trường số, ngày, v.v.
    - `Combobox/`: Component select (combobox) để chọn trụ hoặc các lựa chọn khác.
    - `Button/`: Component nút bấm, dùng cho các thao tác như cập nhật, đóng.
    - `DatePicker/`: Component chọn ngày, nếu cần giao diện riêng cho ngày tháng.
  - `pages/App/`: Chứa file `App.jsx` là trang chính, quản lý state, logic form, validate và hiển thị giao diện.
- `README.md`, `README_HDSD.md`: Hướng dẫn sử dụng, giải thích cấu trúc và cách vận hành dự án.
- `package.json`: Khai báo các package, script chạy dự án, thông tin dự án.
- `vite.config.js`: Cấu hình cho Vite (hoặc có thể là Create React App nếu dùng CRA).
- `.gitignore`: Khai báo các file/thư mục không push lên git (ví dụ: node_modules).

## 2. Cách xây dựng chức năng

- Sử dụng React để tạo các component Input, Combobox, Button giúp tái sử dụng và dễ quản lý.
- Quản lý dữ liệu form bằng state trong `App.jsx` (dùng useState cho từng trường).
- Tính toán doanh thu tự động khi số lượng hoặc đơn giá thay đổi bằng công thức: `doanhThu = soLuong * donGia`.
- Validate dữ liệu khi nhấn "Cập nhật" bằng thư viện `yup` để kiểm tra các trường bắt buộc, kiểu dữ liệu, giá trị hợp lệ.
- Hiển thị thông báo lỗi hoặc thành công dựa trên kết quả validate.
- Component Combobox nhận danh sách trụ, truyền value/onChange để đồng bộ với state.
- Style giao diện bằng các file CSS riêng cho từng component, đảm bảo giao diện hiện đại, dễ nhìn.
- Nút "Đóng" sử dụng sự kiện click để đóng tab trình duyệt (window.close()).

## 3. Lợi ích
- Cấu trúc rõ ràng, dễ mở rộng và bảo trì.
- Tách biệt logic, giao diện và style giúp phát triển nhanh và kiểm soát tốt.
- Sử dụng thư viện chuẩn (yup) giúp validate dễ dàng, tránh lỗi thủ công.
- Giao diện responsive, dễ sử dụng trên nhiều thiết bị.

## 4. Giải thích cách sử dụng thư viện yup

- `yup` là thư viện giúp định nghĩa và kiểm tra (validate) dữ liệu form một cách dễ dàng, ngắn gọn và có thể tái sử dụng.
- Đầu tiên, cài đặt bằng lệnh: `npm install yup`
- Để sử dụng, import vào file cần validate:
  ```js
  import * as yup from 'yup';
  ```
- Định nghĩa schema (cấu trúc dữ liệu cần kiểm tra):
  ```js
  const schema = yup.object().shape({
    thoiGian: yup.string().required('Vui lòng chọn thời gian'),
    soLuong: yup.number().min(1, 'Số lượng phải lớn hơn 0').required('Vui lòng nhập số lượng'),
    donGia: yup.number().min(1, 'Đơn giá phải lớn hơn 0').required('Vui lòng nhập đơn giá'),
    tru: yup.string().required('Vui lòng chọn trụ'),
  });
  ```
- Khi submit form, gọi hàm validate:
  ```js
  try {
    await schema.validate({ thoiGian, soLuong, donGia, tru });
    // Nếu hợp lệ, thực hiện tiếp
  } catch (err) {
    // Nếu lỗi, err.message sẽ chứa thông báo lỗi
  }
  ```
- Yup sẽ tự động kiểm tra kiểu dữ liệu, giá trị, trường bắt buộc... và trả về lỗi nếu không hợp lệ.
- Có thể mở rộng schema cho nhiều trường, kiểu dữ liệu khác nhau.
- Giúp giảm code kiểm tra thủ công, dễ bảo trì và mở rộng.
