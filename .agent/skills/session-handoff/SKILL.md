---
name: session-handoff
description: Tóm tắt tiến độ vào .agent/PROGRESS.md khi kết thúc một Milestone hoặc khi khung chat bắt đầu dài để người dùng mở phiên chat mới tiết kiệm token.
---
# Quy trình bàn giao phiên làm việc
Khi hoàn thành một Milestone hoặc khi người dùng gõ "chốt sổ":
1. Cập nhật file `.agent/PROGRESS.md` (tối đa 20 dòng) gồm 3 mục:
   - **Đã hoàn thành:** Danh sách ngắn gọn các tính năng/Milestone đã pass build.
   - **Đang làm / Lỗi tồn đọng:** (Nếu có, ghi rõ tên file và dòng lỗi).
   - **Bước tiếp theo:** Nhiệm vụ kế tiếp cần làm.
2. Nhắc người dùng có thể mở một đoạn chat mới và chỉ cần gõ: "Đọc .agent/PROJECT_MAP.md và .agent/PROGRESS.md để làm tiếp".
