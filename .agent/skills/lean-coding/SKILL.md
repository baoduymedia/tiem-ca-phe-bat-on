---
name: lean-coding
description: Tối ưu lượng token tiêu thụ khi đọc file, sửa code và phản hồi trong khung chat.
---
# Quy tắc tiết kiệm Token bắt buộc
1. **Không đọc file rác:** Tuyệt đối không mở hoặc quét `node_modules/`, `dist/`, `package-lock.json`, hoặc các file ảnh/audio.
2. **Đọc có chọn lọc:** Với file dài (>150 dòng) hoặc `tiem_ca_phe_bat_on_game_data.json`, chỉ tìm kiếm (grep) và đọc đúng đoạn dòng liên quan, không đọc toàn bộ file.
3. **Sửa cục bộ (Surgical Edit):** Chỉ sửa đúng khối code cần thay đổi, không viết lại toàn bộ file nếu không cần thiết.
4. **Phản hồi ngắn gọn:** Trong khung chat, chỉ báo cáo kết quả bằng gạch đầu dòng ngắn (file nào đã sửa, kết quả build). Không dán lại toàn bộ code đã viết ra khung chat trừ khi người dùng yêu cầu.
