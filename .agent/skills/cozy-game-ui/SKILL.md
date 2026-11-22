---
name: cozy-game-ui
description: Bộ quy chuẩn thiết kế giao diện Game Mobile 2D Cozy vẽ tay phong cách Sài Gòn xưa cho dự án Tiệm Cà Phê Bất Ổn. Bắt buộc áp dụng cho mọi React component và modal.
---

# Cozy Game UI Design System — Tiệm Cà Phê Bất Ổn

Hệ thống thiết kế giao diện Game Mobile 2D Cozy mô phỏng quán cà phê vỉa hè Sài Gòn. CẤM TUYỆT ĐỐI việc sử dụng phong cách website thông thường (như nền trắng tinh `#FFFFFF`, viền mờ `border-gray-200`, bóng nhạt `shadow-md`, font hệ thống không cá tính). Mọi thành phần hiển thị phải mang xúc giác đồ chơi, hoạt hình vẽ tay ấm áp.

---

## 🎨 1. Bảng Màu & Chất Liệu Quy Chuẩn

| Vai trò | Mã màu HEX | Tên gọi dân gian | Ứng dụng |
| :--- | :--- | :--- | :--- |
| **Nền giấy / Bảng gỗ** | `#FFF3D6` | Vàng kem giấy cũ | Nền modal, thẻ bài, bảng thông tin |
| **Viền mực đậm** | `#4A3222` | Nâu bã cà phê | Viền mọi card, nút, icon, dải ruy-băng |
| **Rãnh trượt / Nền tối** | `#5C3D28` | Gỗ sẫm màu | Rãnh thanh tiến trình, background lõm |
| **Dải ruy-băng tiêu đề** | `#F6E5C0` | Giấy bồi cổ | Header ribbon, bảng hiệu quán |
| **Nút Xác nhận / Mua** | `#5C9E54` | Xanh lá tán bàng | Nút Mua, Nâng cấp, Bắt đầu |
| **Nút Nâng cấp / Nhận** | `#F4A236` | Vàng mật ong phin | Nút Nhận thưởng, Boost, Tăng cấp |
| **Nút Đóng / Cảnh báo** | `#E04F4F` | Đỏ ghế nhựa vỉa hè | Nút Đóng [X], Hủy, Cứu hộ khẩn cấp |
| **Nút Phụ / Thông tin** | `#FAF0E1` | Sữa đặc Ông Thọ | Nút tab chưa chọn, nút toggle nhỏ |

---

## ✍️ 2. Quy Chuẩn Typography (Hỗ trợ 100% Tiếng Việt)

- **Font Tiêu đề & Bảng hiệu:** `font-mali` (`'Mali', cursive, sans-serif`)
  - Dùng cho: Tiêu đề quán, tên modal, dải ruy-băng, tên món nước, bảng hiệu.
  - Kiểu chữ: Nét vẽ tay mềm mại, tròn trịa, vui tươi, đậm (`font-bold` hoặc `font-black`).
- **Font Số liệu & Nút bấm:** `font-nunito` (`'Nunito', sans-serif`)
  - Dùng cho: Giá tiền (VND), số lượng nguyên liệu, nút bấm, mô tả chi tiết, quest log.
  - Kiểu chữ: Đậm nét (`font-extrabold` hoặc `font-black`), rõ ràng, không bị méo khi thu nhỏ.

---

## 🧱 3. Bộ Lớp CSS Tiện Ích Chuẩn Game (`src/index.css`)

### 1. Thẻ bài & Khung bảng gỗ (`game-panel`)
```css
.game-panel {
  background-color: #FFF3D6;
  border: 3px solid #4A3222;
  box-shadow: 0 5px 0 #4A3222;
  border-radius: 1rem; /* rounded-2xl */
}
```

### 2. Dải ruy-băng tiêu đề (`game-ribbon`)
```css
.game-ribbon {
  background-color: #F6E5C0;
  border: 2.5px solid #4A3222;
  box-shadow: 0 3px 0 #4A3222;
  border-radius: 0.75rem; /* rounded-xl */
  font-family: 'Mali', cursive, sans-serif;
  font-weight: 700;
  color: #4A3222;
}
```

### 3. Nút bấm nổi 3D xúc giác (`game-btn`)
Mọi nút bấm phải có cạnh đáy dày và hiệu ứng thụt lún khi ấn (tactile press):
```css
.game-btn {
  border: 2.5px solid #4A3222;
  box-shadow: 0 4px 0 #4A3222;
  font-family: 'Nunito', sans-serif;
  font-weight: 800;
  transition: all 0.08s ease;
  user-select: none;
  cursor: pointer;
}
.game-btn:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #4A3222;
}
```
Các biến thể màu:
- `.game-btn-green`: Nền `#5C9E54`, chữ trắng
- `.game-btn-gold`: Nền `#F4A236`, chữ `#4A3222`
- `.game-btn-red`: Nền `#E04F4F`, chữ trắng
- `.game-btn-cream`: Nền `#FAF0E1`, chữ `#4A3222`

### 4. Thanh tiến trình rãnh sâu bóng nước (`game-bar`)
```css
.game-bar-track {
  background-color: #5C3D28;
  border: 2px solid #4A3222;
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}
.game-bar-fill {
  background: linear-gradient(180deg, #FDE68A 0%, #F4A236 45%, #D97706 100%);
  border-radius: 9999px;
  height: 100%;
  position: relative;
}
.game-bar-fill::after {
  content: '';
  position: absolute;
  top: 1px;
  left: 2px;
  right: 2px;
  height: 35%;
  background: rgba(255, 255, 255, 0.45);
  border-radius: 9999px;
}
```

---

## 🖼️ 4. Quy Chuẩn Icon & Tài Nguyên Hình Ảnh

1. **Tuyệt đối hạn chế emoji thô:**
   - Thay emoji thô bằng sprite PNG thực tế trong `/assets/sprites/` (`phin_ca_phe.png`, `cf_sua_da.png`, `bac_xiu.png`, `ghe_nhua_do.png`, `pet_cun_vang.png`, `pet_meo_muop.png`, ...).
   - Với các biểu tượng giao diện hệ thống (bánh răng, mũi tên, đóng, giỏ hàng, thông báo), sử dụng thư viện `lucide-react` kết hợp màu viền `#4A3222`.
2. **Kích thước sprite thu nhỏ trong UI:**
   - Icon thức uống / vật phẩm: `w-8 h-8` hoặc `w-10 h-10`, `object-contain drop-shadow-[0_2px_0_rgba(74,50,34,0.3)]`.

---

## 📱 5. Quy Trình Tự Kiểm Tra Thị Giác (Visual Self-Check)

Sau khi sửa hoặc tạo mới bất kỳ component UI nào:
1. Đảm bảo tỷ lệ màn hình là `390x844` (khung mobile dọc tiêu chuẩn).
2. Không bị tràn chữ, vỡ layout, hay che mất các nút tương tác ngón cái ở mép dưới.
3. Chạy `npm run build` để kiểm tra 0 lỗi TypeScript.
4. Mở Browser Preview chụp ảnh màn hình để so sánh với thiết kế Cozy mẫu.
