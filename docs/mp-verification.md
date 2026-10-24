# Kiểm tra MP Learning — 23/10/2026

## Kết quả đã xác nhận

- Build các dependency, API, email và dashboard: thành công.
- 34 unit test: 12 kiểm tra endpoint ngừng sử dụng, 7 kiểm tra cấp quyền đăng ký, 15 kiểm tra đường dẫn nội bộ.
- Formatter trên toàn bộ file thay đổi: đạt. `git diff --check`: đạt.
- `pnpm format:check`: không có file staged; kết quả formatter phía trên được chạy riêng trên file thay đổi.
- PostgreSQL, Redis, SeaweedFS: healthy. Khởi tạo ba bucket: exit 0.
- Migration và seed dữ liệu tham chiếu trên database mới: thành công, không seed dữ liệu demo upstream.
- Đăng ký email ngoài danh sách cho phép: HTTP 403.
- Đăng ký quản trị bootstrap, đăng nhập: HTTP 200.
- Tạo tổ chức MP Transformation và khóa học tự học nội bộ: HTTP 201.
- Dashboard của quản trị với phiên đăng nhập hợp lệ: HTTP 200.
- Truy cập `/lms`, `/courses` khi chưa đăng nhập: HTTP 303 về đăng nhập.
- Landing page, widget và API danh mục công khai: HTTP 404.
- Logo MP được phục vụ từ thư mục static của ứng dụng: HTTP 200; không phụ thuộc thư mục assets tạm.

## Môi trường thử hiện tại

Mở http://localhost:3082/login. Tài khoản thử được lưu trong `.env.local` ở gốc repository (đã được Git bỏ qua). Đây là tài khoản thử, không dùng cho production.

API và dashboard đang chạy trực tiếp bằng Node trên máy; PostgreSQL, Redis và storage chạy trong Docker Compose project `mp-learning-test`, dùng volume riêng. Chưa chạy toàn bộ ứng dụng bằng Docker image. Các tiến trình Node cần được khởi động lại sau khi tắt máy; hướng dẫn triển khai Docker đầy đủ nằm trong `mp-deployment.md`.

Node kiểm tra là 24.14.0; repository yêu cầu 24.22.1 nên trình quản lý gói còn cảnh báo phiên bản. Các build nêu trên đã hoàn tất trên phiên bản hiện có.

## Phần cần nghiệm thu trước production

- Công cụ điều khiển trình duyệt bị tắt trong Work settings: chưa kiểm tra trực quan desktop/mobile trong phiên này.
- Chưa cấu hình SMTP: chưa nghiệm thu nhận thư mời, xác minh email và quên mật khẩu.
- Chưa chạy đầy đủ luồng nhân viên học, nộp bài, cấp chứng chỉ và xử lý video qua background worker.
- Chưa có domain, HTTPS, SMTP và storage endpoint production; chưa kiểm tra backup/restore trên hạ tầng doanh nghiệp.
- Bộ bản dịch mới có đủ 12 locale. Lệnh dịch tự động gặp giới hạn 429 với một số khóa cũ còn thiếu của upstream; các khóa MP mới đã được bổ sung và kiểm tra placeholder.
