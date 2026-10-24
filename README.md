# MP Learning · MP Transformation

Nền tảng đào tạo nhân viên nội bộ, tùy biến từ ClassroomIO.

- Khóa học, bài học và bài tập.
- Chương trình đào tạo, theo dõi tiến độ và chứng chỉ.
- Quản lý nhân viên, giảng viên, phân quyền và báo cáo.
- Nhận diện MP Transformation, tiếng Việt mặc định, đăng ký có kiểm soát bằng lời mời/email được cấp phép.
- Không có website quảng bá hay landing page công khai trong luồng sử dụng.

## Chạy bằng Docker

```sh
node scripts/setup-mp.mjs --email admin@your-company.vn --origin http://localhost:3082
# Điền cấu hình SMTP trong .env trước khi mời nhân viên.
docker compose --profile storage up -d --build
```

Mở http://localhost:3082. Dùng email quản trị đã cấu hình để kích hoạt tài khoản tại `/signup` và tạo tổ chức MP Transformation.

Xem [hướng dẫn triển khai](docs/mp-deployment.md) cho HTTPS, lưu trữ, quyền truy cập, sao lưu và nghiệm thu production. Chỉ dùng compose build từ source; compose image upstream không chứa tùy biến MP.

## Phát triển

Node 24 theo `.nvmrc`, pnpm 10.19.0 theo `packageManager`.

```sh
pnpm install --frozen-lockfile
pnpm dashboard:dev
pnpm api:dev
```

Cần PostgreSQL, Redis và cấu hình `apps/api/.env`, `apps/dashboard/.env` theo file example. Đặt cùng chế độ `PUBLIC_IS_SELFHOSTED=true`; cấu hình `LMS_ALLOWED_EMAILS` phía API cho tài khoản đầu tiên. Các script dev chạy riêng trong terminal khác nhau.

## Nguồn gốc

Dựa trên [ClassroomIO](https://github.com/classroomio/classroomio). Giữ nguyên [LICENSE](LICENSE) và các thông báo bản quyền upstream. Namespace `@cio/*`, tên bảng và cookie được giữ để tương thích; không phải mọi module dùng chung đã bị xóa khỏi monorepo.
