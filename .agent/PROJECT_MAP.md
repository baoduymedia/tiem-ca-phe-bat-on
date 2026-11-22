# BẢN ĐỒ DỰ ÁN (PROJECT MAP) - TIỆM CÀ PHÊ BẤT ỔN

## 1. Cây thư mục & Vai trò từng file

- `package.json`: Khai báo dependencies (Vite, React 19, TypeScript, Tailwind CSS v4, Phaser 3, Zustand, Howler).
- `package-lock.json`: Khóa phiên bản chi tiết của toàn bộ gói phụ thuộc trong node_modules.
- `tsconfig.json`: Root TypeScript configuration định tuyến tới tsconfig.app.json.
- `tsconfig.app.json`: Cấu hình TypeScript strict mode và compiler options cho mã nguồn src.
- `vite.config.ts`: Cấu hình bundler Vite tích hợp React plugin và Tailwind CSS v4 plugin.
- `index.html`: Entry point HTML chuẩn mobile-first dọc 9:16, gắn thẻ mount #root.
- `.agent/rules/game-rules.md`: Bộ quy tắc cốt lõi của dự án (tech stack, tỷ lệ dọc 9:16, cozy palette, tách biệt data).
- `.agent/skills/verify-build/SKILL.md`: Quy trình kiểm thử bắt buộc (npm run build 0 lỗi TS & kiểm tra console).
- `.agent/skills/project-map/SKILL.md`: Hướng dẫn đọc và duy trì bản đồ mã nguồn PROJECT_MAP.md.
- `.agent/skills/session-handoff/SKILL.md`: Quy trình tóm tắt bàn giao phiên làm việc vào PROGRESS.md khi kết thúc Milestone.
- `.agent/skills/lean-coding/SKILL.md`: Quy tắc tối ưu token (không đọc file rác, sửa cục bộ, phản hồi ngắn gọn).
- `.agent/PROJECT_MAP.md`: Bản đồ tổng quan kiến trúc, vai trò file, state và event bus của dự án.
- `.agent/PROGRESS.md`: Bản ghi tiến độ hiện tại, việc đã hoàn thành và nhiệm vụ kế tiếp (dưới 20 dòng).
- `.vscode/extensions.json`: Danh sách extension VS Code khuyến nghị (Tailwind, ESLint, Prettier, ErrorLens).
- `docs/game_design_document.md`: Bộ Master GDD v2.0 (10 chương, 551 dòng) đặc tả benchmark 6 tựa game, wireframe kép PC 16:9 / Mobile 9:16, art guide, hệ thống bất trắc & tương trợ đời thực, và mô hình toán kinh tế.
- `docs/GDD_TECH_SPEC.md`: Tài liệu đặc tả gameplay gốc, hệ thống kinh tế và lộ trình kỹ thuật 6 giai đoạn.
- `docs/tiem_ca_phe_bat_on_game_data.json`: Dữ liệu gốc cấu hình stages, recipes, customers, events, upgrades, shop.
- `docs/poster_key_art.png`: Ảnh poster nghệ thuật mẫu tham chiếu bố cục và bảng màu Cozy của game.
- `src/main.tsx`: Khởi tạo và render React Root component vào DOM.
- `src/App.tsx`: Layout chính căn giữa tỷ lệ 9:16, kết nối vòng đời Phaser Canvas và React UI Overlay.
- `src/index.css`: Thiết lập theme Tailwind CSS v4 và định nghĩa biến màu Cozy chuẩn của game.
- `src/vite-env.d.ts`: Khai báo kiểu môi trường client cho Vite.
- `src/data/tiem_ca_phe_bat_on_game_data.json`: File dữ liệu kinh tế và cấu hình game dùng runtime trong src.
- `src/data/gameData.ts`: Định nghĩa TypeScript interfaces và các hàm helper truy vấn dữ liệu từ file JSON.
- `src/data/sprites.ts`: Định nghĩa hằng số SPRITES trỏ tới 18 sprite 2D vẽ tay trong public/assets/sprites/.
- `src/store/useGameStore.ts`: Zustand store quản lý toàn bộ trạng thái game, tự lưu localStorage và format tiền VNĐ.
- `src/game/EventBus.ts`: Bộ phát sự kiện Phaser.Events.EventEmitter làm cầu nối 2 chiều giữa Phaser và React.
- `src/game/PhaserGame.ts`: Khởi tạo instance game Phaser 3 tự co giãn theo tỷ lệ dọc 9:16.
- `src/game/audio/SoundManager.ts`: Sound Engine tổng hợp Web Audio API offline (Lo-fi BGM, còi xe Cub, rao hàng rong, ASMR phin giọt, đá bi, que khuấy, tiền xu, cún/mèo).
- `src/game/scenes/CafeScene.ts`: Scene chính Giai đoạn 1 quán cóc vỉa hè, quản lý chỗ ngồi, pha phin ASMR, hiệu ứng thời tiết, animation linh vật (cún thở + bong bóng 💤, mèo mướp) và tương tác chạm squish.
- `src/game/entities/Customer.ts`: Thực thể khách hàng (State Machine 5 bước, tween nhún chân bước đi, nhịp thở nhẹ, lắc sốt ruột, nhảy vui mừng + hiệu ứng sao/xu khi xong món, phản ứng chạm).
- `src/game/entities/EventManager.ts`: Quản lý kích hoạt các sự kiện ngẫu nhiên Stage 1 (Mưa rào Sài Gòn & Trật tự đô thị).
- `src/components/DailyPrepModal.tsx`: Modal phong cách giấy kraft chuẩn bị nguyên liệu buổi sáng trước giờ mở bán (bột cà phê, sữa đặc, đá bi, trà) kèm dự báo thời tiết.
- `src/components/DailySummaryModal.tsx`: Modal hóa đơn giấy cổ điển chốt sổ doanh thu, tiền tip, chi phí vốn và lợi nhuận ròng cuối ngày.
- `src/components/CoffeeBrewingModal.tsx`: Trạm pha chế thủ công ASMR chuẩn Cozy Storybook tương tác trực tiếp (châm phin, rót sữa Ông Thọ, xúc đá bi, khuấy bọt) nhận thưởng Chuẩn Vị Sài Gòn (+50% Tip).
- `src/components/RenameShopModal.tsx`: Modal đổi tên quán tùy chỉnh kết hợp chọn chủ quán (Anh Ba / Chị Bảy) và đồng bộ bảng hiệu Canvas.
- `src/components/PolaroidPhotoMode.tsx`: Chế độ chụp ảnh Polaroid vintage viền trắng cổ điển, sticker và watermark chia sẻ Story khớp Mockup 8.
- `src/components/DailyQuestPanel.tsx`: Bảng quản lý 3 nhiệm vụ ngày (linh vật mèo múp, cún cưng, shipper) thưởng Hạt Cà Phê Vàng 🫘 khớp Mockup 5.
- `src/components/StageRoadmapModal.tsx`: Modal bản đồ lộ trình 6 giai đoạn tiến hóa và cốt truyện khởi nghiệp từng chương với theme thẻ bài Cozy.
- `src/components/OfflineRewardModal.tsx`: Modal Hũ Tiền Ngoại Tuyến (hũ gốm đất nung cổ truyền, nhận x1 hoặc xem clip nhận x2) khớp 100% Mockup 1.
- `src/components/SplashScreen.tsx`: Màn hình mở đầu game với bảng hiệu gỗ treo dây thừng, mèo cún ngủ trưa và nhập tên quán tùy chỉnh khớp Mockup 2.
- `src/components/TopHUD.tsx`: Thanh trạng thái ribbon mềm mại hiển thị tên quán, tiền xu (🪙), hạt vàng (🫘) và điểm sống ảo (⭐).
- `src/components/BottomNav.tsx`: Thanh menu dưới đáy gồm 5 nút vòm tròn bo góc mềm mại tích hợp Barista Brew Bar mini phía trên khớp Mockup.
- `src/components/MenuPanel.tsx`: Modal xem danh sách, mở khóa và nâng cấp đồ uống Stage 1 bố cục 2 cột thẻ Cozy khớp Mockup 4.
- `src/components/UpgradePanel.tsx`: Modal nâng cấp thiết bị và cột mốc Giai đoạn 2 dạng thẻ bo góc Cozy khớp Mockup 4.
- `src/components/DecorPanel.tsx`: Bảng Decor trang trí vỉa hè 4 tab phân loại dạng lưới 3 cột thẻ Cozy khớp Mockup 9.
- `src/components/ShopPanel.tsx`: Cửa hàng Gói Ưu Đãi, Hạt Cà Phê và QC Miễn Phí dạng thẻ Cozy khớp Mockup 7.
- `src/components/EventAlert.tsx`: Banner thông báo sự kiện đếm ngược và nút hành động nhanh bo tròn ấm áp (CĂNG BẠT / THU GHẾ).
- `src/components/CustomerDialogueToast.tsx`: Toast hiển thị các câu thoại bóng thoại bo góc mềm mại kèm icon chat.

## 2. State cốt lõi (useGameStore)

- `shopName` (string): Tên quán do người chơi đặt (mặc định: "Tiệm Cà Phê Bất Ổn").
- `currentStage` (1 | 2 | 3 | 4 | 5 | 6): Giai đoạn phát triển hiện tại của quán (1: Quán Cóc Vỉa Hè).
- `gold` (number): Tiền xu VNĐ kiếm từ bán đồ uống và kinh doanh vỉa hè (dùng hàm formatVND hiển thị k, M, B).
- `goldenBeans` (number): Hạt Cà Phê Vàng (hard currency) kiếm từ nhiệm vụ, thành tựu hoặc quà tặng.
- `reputation` (number): Điểm Sống Ảo / Uy tín dùng để mở khóa các mốc giai đoạn tiếp theo.
- `unlockedRecipes` (Record<string, number>): Danh sách đồ uống đã mở khóa kèm level tương ứng.
- `upgrades` (Record<string, number>): Danh sách nâng cấp thiết bị, chỗ ngồi, nhân sự đã sở hữu.
- `equippedDecor` & `ownedDecor` (string[]): Danh sách ID đồ trang trí đang lắp đặt và đã mua.
- `hasCompletedSplash` (boolean): Trạng thái xác nhận người chơi đã qua màn hình Splash đặt tên để khởi tạo Phaser.
- `activeTab` ('menu' | 'upgrade' | 'decor' | 'shop' | 'quest'): Tab chức năng đang chọn ở thanh BottomNav.
- `lastActiveTimestamp` (number): Thời điểm lưu trữ cuối để tính thu nhập Offline (Idle Income).

## 3. EventBus & Luồng kết nối (Phaser ↔ React)

- **Chiều Phaser → React**:
  - `scene-ready`: Báo Phaser canvas đã khởi tạo xong (`CafeScene`).
  - `customer-speak` (payload: `{ name, dialogue }`): Gửi câu thoại khách hàng lên React toast.
  - `event-warning` (payload: `{ id, name, durationSec, message }`): Báo trước sự kiện Trật tự đô thị.
  - `event-started` (payload: `{ id, name, buttonLabel, alertText, durationSec }`): Kích hoạt popup nút bấm sự kiện khẩn cấp.
  - `event-resolved` (payload: `{ id, success, message }`): Kết quả xử lý sự kiện (thưởng tiền/boost tip hoặc bị phạt).
- **Chiều React → Phaser**:
  - `request-brew` (payload: `{ customer, recipe }`): Nhận lệnh pha chế khi người chơi bấm vào khách/bong bóng.
  - `handle-event-action` (payload: `{ eventId }`): Gửi tín hiệu người chơi bấm nút "CĂNG BẠT" hoặc "THU GHẾ".
  - `shop-name-updated` (payload: `name`): Cập nhật tên quán trên bảng hiệu gỗ của Phaser scene.
