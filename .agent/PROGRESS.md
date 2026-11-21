# TIẾN ĐỘ DỰ ÁN - TIỆM CÀ PHÊ BẤT ỔN

### 1. Đã hoàn thành (Fix 3 lỗi nghiêm ngặt theo yêu cầu):
- **Khắc phục Menu bị che khuất:** Chuyển `MenuPanel` và `UpgradePanel` thành Modal Pixel Art căn giữa màn hình (`z-50`, viền đen 4px, `max-h-[82vh]`), tách biệt hoàn toàn với thanh điều hướng `BottomNav` (`z-30`). 100% không còn bị hàng nút bấm che khuất.
- **Sửa triệt để lỗi giao diện PC:** Loại bỏ chế độ Widescreen làm vỡ tỉ lệ Phaser canvas (trắng 65% góc phải); cố định bố cục Studio Cabinet 3 cột trên PC (Trái: Đài Radio ASMR & Kho; Giữa: Viewport quán cóc 9:16 chuẩn nét; Phải: Hàng xóm & Nhiệm vụ).
- **Xóa vĩnh viễn "Cái bảng lon ton đi mua cà phê":** Tìm ra nguyên nhân gốc là file `khach_xe_om.png` bị gán nhầm sprite bảng phấn từ bảng cắt cũ. Đã trích xuất đúng hình Chú Ba Xe Ôm đội mũ bảo hiểm/áo khoác từ hàng 3 spritesheet gốc và xóa bỏ toàn bộ sprite bảng cũ.
- **Pass Build 100%:** 0 lỗi TypeScript, Vite dev server sẵn sàng tại `http://localhost:5173/`.

### 2. Đang làm / Lỗi tồn đọng:
- Không còn lỗi tồn đọng.

### 3. Bước tiếp theo:
- Sẵn sàng trải nghiệm trên cả Mobile và PC mượt mà, chân thực.
