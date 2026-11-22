# TIẾN ĐỘ DỰ ÁN - TIỆM CÀ PHÊ BẤT ỔN

### 1. Đã hoàn thành (Toàn diện 6 Giai Đoạn & UI Cozy Storybook 9:16):
- **Core Realism Loop:** Sub-HUD hiển thị đồng hồ ảo (06:00-22:00, 4 thời điểm Sáng-Trưa-Chiều-Tối), 3 thanh kho (% Cà phê, Đá, Sữa) có cảnh báo và nút nhập kho nhanh, cơ chế đá tan trưa hè.
- **Smart Order & Chuẩn Gu!:** Khách gắn OrderModifier ngẫu nhiên (ít đá, nhiều sữa, mang đi, không đường) kèm badge thông minh trên bong bóng; Trạm pha chế ASMR 3 bước chấm điểm "Chuẩn Gu! ✨" thưởng +20% Tip & 1 🫘 Đậu Vàng.
- **Vệ Sinh & Bàn Ghế:** Rác bàn bẩn (ly rỗng, khăn giấy, vỏ hạt) xuất hiện sau khi khách về, chạm dọn bàn nhặt tiền lẻ rơi (1k-5kđ), nút dọn bàn nhanh FAB trên mobile.
- **Sổ Thu Chi P&L:** Hạch toán chi tiết doanh thu, tip, kho, mặt bằng, phạt đô thị, lợi nhuận ròng và đánh giá sao khách hàng lúc 22:00.
- **Giai Đoạn 4 (Bản Đồ Đa Tỉnh & Cúp Phin Vàng):** `VietnamMapModal` (5 tỉnh thành x 4 vị trí mặt bằng sinh lợi thụ động), `ProvincialLeagueModal` đua top cúp phin vàng, `StaffPanel` quản lý thể lực stamina và khao trà sữa cả team.
- **Giai Đoạn 5 & 6 (Xưởng Rang & Toàn Cầu):** `RndAndRoasteryModal` (Xưởng rang Robusta/Arabica giảm 35% vốn, Lab sáng tạo món Signature hot trend, Tech Tree 4 nhánh và Chuỗi nhượng quyền quốc tế Tokyo/Seoul/Paris/NY).
- **Hệ thống Cozy Game UI 2D (v4.0):** Cài đặt Google Fonts `Mali` & `Nunito` hỗ trợ 100% tiếng Việt, tạo skill `.agent/skills/cozy-game-ui/SKILL.md` với chuẩn `game-panel`, `game-ribbon`, `game-btn`, `game-bar` (viền mực `#4A3222`, bóng đổ cứng 3D xúc giác, cấm style web phẳng).
- **Refactor toàn bộ UI & Sprites:** Tích hợp `lucide-react` và các sprite PNG thực tế (`phin_ca_phe.png`, `cf_sua_da.png`, `ghe_nhua_do.png`, linh vật cún & mèo) vào `TopHUD`, `BottomNav`, `BrewMiniPanel`, `SplashScreen`, `MenuPanel`, `UpgradePanel`, `DailyQuestPanel`, `OfflineRewardModal`, `DecorPanel`, `ShopPanel`, `RenameShopModal`.
- **Đồng bộ Giao diện PC & Mobile:** Bọc khung Cozy viền mực `#4A3222`, loại bỏ góc cạnh pixel thô, build TypeScript 0 lỗi.

### 2. Đang làm / Lỗi tồn đọng:
- Kiểm thử toàn diện và đẩy code lên Git remote `main`.

### 3. Bước tiếp theo:
- Giám sát trải nghiệm người chơi thực tế và mở rộng thêm sự kiện mùa lễ hội.
