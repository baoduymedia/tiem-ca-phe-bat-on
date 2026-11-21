---
name: project-map
description: Đọc nhanh cấu trúc và chức năng từng file qua bản đồ dự án thay vì quét toàn bộ thư mục. Tự động cập nhật bản đồ sau khi thêm, sửa hoặc xóa file.
---
# Quy trình sử dụng Bản đồ Dự án (Project Map)

## Trước khi bắt đầu làm tính năng mới:
1. KHÔNG chạy lệnh quét toàn bộ cây thư mục hay đọc hàng loạt file không liên quan.
2. Chỉ đọc duy nhất file `.agent/PROJECT_MAP.md` để nắm toàn bộ cấu trúc, trách nhiệm của từng file, các EventBus events và State chính.
3. Dựa vào bản đồ, chỉ mở đọc và chỉnh sửa đúng những file trực tiếp liên quan đến yêu cầu hiện tại.

## Sau khi hoàn thành tính năng (hoặc thêm/xóa/đổi tên file):
1. Cập nhật ngay lập tức các thay đổi mới vào `.agent/PROJECT_MAP.md` (giữ mô tả mỗi file ngắn gọn trong 1 dòng).
2. Cập nhật thêm danh sách các EventBus mới hoặc State mới nếu có.
