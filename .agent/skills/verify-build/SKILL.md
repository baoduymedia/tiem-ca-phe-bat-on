---
name: verify-build
description: Quy trình kiểm thử bắt buộc sau mỗi Milestone của dự án Tiệm Cà Phê Bất Ổn.
---

# Quy trình Verify Build sau mỗi Milestone

## Bước 1 — Build TypeScript (bắt buộc 0 lỗi)
```bash
npm run build
```
- Nếu có bất kỳ lỗi TypeScript nào → **KHÔNG được báo hoàn thành Milestone**.
- Sửa hết lỗi, chạy lại cho đến khi `build` thành công hoàn toàn (exit code 0).

## Bước 2 — Chạy Dev Server và kiểm tra trình duyệt
```bash
npm run dev
```
- Mở trình duyệt tại URL dev server (mặc định `http://localhost:5173`).
- Kiểm tra khung hiển thị giữ đúng **tỷ lệ dọc 9:16** (mobile-first), căn giữa trên desktop.
- Mở **DevTools → Console**: xác nhận **không có lỗi** (warning chấp nhận được, error thì không).
- Xác nhận giao diện render đúng bảng màu Cozy và các thành phần UI placeholder hiển thị bình thường.

## Tiêu chí đạt
- [x] `npm run build` exit code 0, không lỗi TypeScript.
- [x] Dev server chạy, trang load không lỗi Console.
- [x] Khung 9:16 hiển thị đúng, căn giữa trên desktop.
