# **TÀI LIỆU ĐẶC TẢ GAME & KỸ THUẬT (GDD \+ TECH SPEC)**

**Tên dự án:** Tiệm Cà Phê Bất Ổn — Từ Vỉa Hè Đến Chuỗi Đế Chế\!  
**Thể loại:** Cozy Simulation / Idle Tycoon (2D)  
**Thị trường mục tiêu:** Việt Nam (Ưu tiên viral tự nhiên trên TikTok/Threads, mở rộng Global ở giai đoạn End-game)  
**Mục đích tài liệu:** Đặc tả đầy đủ thiết kế gameplay, hệ thống kinh tế, kiến trúc mã nguồn, lược đồ dữ liệu (Data Schema) và lộ trình chia task để lập trình viên hoặc AI Agent trên Google Antigravity triển khai trực tiếp phiên bản MVP (Giai đoạn 1 đến 3\) và sẵn sàng mở rộng đến Giai đoạn 6\.  
---

# **1\. TỔNG QUAN SẢN PHẨM & ĐỊNH HƯỚNG NGHỆ THUẬT**

## **1.1. Tầm nhìn sản phẩm (High Concept)**

Người chơi bắt đầu hành trình khởi nghiệp từ một quán cà phê cóc vỉa hè với vài chiếc ghế nhựa xanh đỏ, tự tay pha chế cà phê phin với âm thanh ASMR thư giãn, đối phó với những tình huống hài hước đậm chất Việt Nam (trời mưa bất chợt, trật tự đô thị, shipper hối đơn), sau đó từng bước mở rộng lên Xe đẩy, Booth Take-away, Quán nhỏ trong hẻm, Quán lớn Flagship 2 tầng, Xưởng rang xay và phát triển thành chuỗi thương hiệu toàn quốc rồi xuất ngoại

## **1.2. Định hướng Đồ họa & Âm thanh (Art & Audio Direction)**

* **Phong cách đồ họa:** 2D vẽ tay nét mảnh (Hand-drawn Cozy Illustration), góc nhìn cắt lớp (Layered 2D / 2.5D Isometric nhẹ), lấy cảm hứng từ poster chủ đạo "Tiệm Cà Phê Bất Ổn" (từ góc vỉa hè có bảng phấn "Cà phê sữa đá 15k", biển "Trà đá miễn phí", cún vàng nằm ngủ, mèo ôm ly cà phê đến xe đẩy có shipper xếp hàng, quán nhỏ đèn lồng, quán 2 tầng đèn dây và xưởng rang xay).  
* **Bảng màu chủ đạo:** Tông pastel ấm áp (Vàng kem \#FFF3D6, Nâu cà phê \#6F4E37, Xanh lá tán cây \#5C9E54, nhấn bằng màu ghế nhựa đỏ \#E04F4F và xanh ngọc \#2EB8AC, áo shipper xanh lá và cam).  
* **Animation:** Nhẹ nhàng, tiết kiệm tài nguyên (lắc lư nhân vật, bốc khói ly cà phê, hạt mưa rơi, hiệu ứng tiền xu bay lên).  
* **Âm thanh (ASMR là yếu tố cốt lõi chiếm 40% trải nghiệm):**  
  * Nhạc nền: Lo-fi nhẹ nhàng, êm dịu (có nút bật/tắt độc lập với SFX).  
  * Hiệu ứng SFX/ASMR: Tiếng nước sôi rót vào phin, tiếng nhỏ giọt cà phê, tiếng đập đá lách cách, tiếng khuấy muỗng thủy tinh, tiếng chuông cửa khi khách vào, tiếng máy pha Espresso, tiếng mưa rào rơi trên mái tôn/bạt, tiếng tiền xu leng keng.

# **2\. VÒNG LẶP LỐI CHƠI & LỘ TRÌNH TIẾN HÓA 6 GIAI ĐOẠN**

## **2.1. Vòng lặp cốt lõi (Core Loop)**

* **Vòng lặp ngắn (2–5 phút/phiên):** Khách vào quán \-\> Nhận order \-\> Pha chế (bấm tay ở Giai đoạn 1 hoặc nhân viên tự pha từ Giai đoạn 2\) \-\> Phục vụ & Thu tiền xu \+ Điểm Sống Ảo \-\> Nâng cấp thiết bị / Mở món mới / Mua đồ trang trí.  
* **Vòng lặp dài (Giữ chân nhiều tuần):** Sưu tầm đầy đủ bộ khách hàng & cốt truyện mảnh ghép \-\> Mở khóa món ăn đặc sản qua mini-game R\&D \-\> Trang trí quán theo mùa \-\> Chuyển cấp lên quy mô quán mới \-\> Mở chuỗi các thành phố.

## **2.2. Bảng Lộ trình 6 Giai đoạn (Phân chia MVP và Update)**

| Giai đoạn | Phạm vi | Quy mô không gian | Thực đơn mở khóa | Cơ chế Gameplay mới & Điểm nhấn |
| :---- | :---- | :---- | :---- | :---- |
| Giai đoạn 1 | MVP | Quán Cóc Vỉa Hè \-\> Nâng cấp cuối giai đoạn thành Xe Đẩy Lưu Động | Ghế nhựa xanh đỏ, thùng đá dưới tán cây, bảng gỗ viết phấn | Cà phê phin đen/sữa đá, bạc xỉu, trà đá miễn phí |
| Giai đoạn 2 | MVP | Booth Take-Away (Kiosk) | Quầy gỗ có mái che, bảng menu đèn LED, khu đứng chờ | Máy Espresso mini, trà đào cam sả, cà phê muối, bánh mì que |
| Giai đoạn 3 | MVP | Quán Nhỏ Trong Hẻm (Indie Cafe) | Mặt bằng máy lạnh, cửa kính, ổ cắm điện, góc sống ảo | Trà trái cây nhiệt đới, Matcha latte, bánh ngọt (Tiramisu, Croissant) |
| Giai đoạn 4 | Update 1 | Quán Lớn (Flagship 2 Tầng / Sân Vườn) | Nhiều phân khu: Quầy bar lớn, Khu chạy deadline yên tĩnh, Rooftop | Cold Brew ủ lạnh, đồ uống theo mùa (Seasonal), đồ ăn nhẹ |
| Giai đoạn 5 | Update 2 | Xưởng Rang Xay & Bếp Trung Tâm | Khu vực Roastery và dây chuyền đóng gói | Hạt Robusta Buôn Ma Thuột, Arabica Cầu Đất, cốt trà độc quyền |
| Giai đoạn 6 | Update 3 | Chuỗi Toàn Quốc \-\> Xuất Ngoại | Bản đồ Việt Nam (Sài Gòn \-\> Hà Nội \-\> Đà Lạt \-\> Huế \-\> Phú Quốc) \-\> Thế giới (Tokyo, Seoul, Paris, New York) | Món đặc sản vùng miền (Cà phê trứng Hà Nội, Trà Atiso Đà Lạt, Cà phê dừa...) |

## **2.3. Hệ thống Nhân vật & Sự kiện đặc trưng Việt Nam**

* **Nhóm Khách hàng (Customer Archetypes):**  
  * *Chú xe ôm / Cô bán vé số:* Gọi món nhanh (cà phê đen, trà đá), ít kiên nhẫn nhưng hay để lại tip nhỏ.  
  * *Sinh viên chạy deadline:* Ngồi lâu chiếm chỗ (Giai đoạn 3), yêu cầu có ổ cắm/Wi-Fi, nhưng thường gọi thêm bánh ngọt và cà phê đậm.  
  * *Anh Shipper công nghệ:* Xuất hiện từ Giai đoạn 2, đặt combo 2–5 ly cùng lúc, có thanh đếm ngược thời gian (giao đúng hẹn được thưởng combo vàng).  
  * *Cô hàng xóm:* Thỉnh thoảng ghé vào kể chuyện xóm (mở khóa nhật ký cốt truyện & nhiệm vụ phụ).  
  * *Reviewer / KOL:* Xuất hiện khi "Điểm Sống Ảo" đạt ngưỡng, chụp ảnh đăng bài giúp kéo lượng khách x2 trong 60 giây.  
  * *Mèo mướp hoang / Cún nằm ngủ:* Linh vật tương tác; bấm vuốt ve hoặc cho ăn để tăng chỉ số hài lòng và nhận quà ngẫu nhiên.  
* **Sự kiện ngẫu nhiên (Random Events):**  
  * *Mưa rào bất chợt (Giai đoạn 1):* Màn hình tối nhẹ, tiếng mưa rơi; người chơi bấm nút "Căng bạt" trong 5 giây để giữ khách (nếu chậm, khách chạy mất). Tăng nhu cầu đồ uống nóng.  
  * *Trật tự đô thị đi ngang (Giai đoạn 1):* Có còi hú nhẹ cảnh báo trước 3 giây; người chơi bấm "Thu ghế" để né bị phạt tiền xu.  
  * *Đoàn khách công ty:* Đặt đơn hàng lớn (10 ly), tạo cảm giác bận rộn thú vị và mang lại khoản tiền lớn.

# **3\. HỆ THỐNG KINH TẾ & CÂN BẰNG (ECONOMY & BALANCING)**

## **3.1. Đơn vị tiền tệ & Chỉ số**

1. **Tiền Xu / VNĐ (Soft Currency \- Ký hiệu: k hoặc đ):** Kiếm được từ bán đồ uống, tiền tip, thu nhập offline. Dùng để nâng cấp thiết bị, mở món, thuê nhân viên, mở giai đoạn mới.  
2. **Hạt Cà Phê Vàng (Hard Currency):** Kiếm được từ nhiệm vụ ngày, thành tựu, xem quảng cáo, nạp IAP. Dùng để mua đồ trang trí đặc biệt, nhân viên thú cưng tự động, đẩy nhanh tiến độ.  
3. **Điểm Sống Ảo / Uy tín (Reputation Stars):** Tăng khi mua đồ trang trí (Decor) và phục vụ khách hài lòng. Là điều kiện bắt buộc để mở khóa Giai đoạn tiếp theo và thu hút KOL.

## **3.2. Công thức Cân bằng cốt lõi**

* **Chi phí nâng cấp thiết bị/món ăn:**  
  * UpgradeCost(level) \= Math.round(BaseCost \* Math.pow(1.18, level \- 1))  
* **Giá bán đồ uống theo cấp độ món:**  
  * DrinkPrice(level) \= Math.round(BasePrice \* (1 \+ 0.15 \* (level \- 1)))  
* **Thu nhập ngoại tuyến (Idle Offline Income):**  
  * Chỉ mở khóa từ cuối Giai đoạn 1 / đầu Giai đoạn 2 (khi có nhân viên hoặc xe đẩy).  
  * Giới hạn tích trữ tối đa (Idle Cap): **4 giờ** (có thể nâng cấp lên 6–8 giờ).  
  * Công thức: OfflineEarnings \= IncomePerSecond \* Math.min(ElapsedSeconds, MaxCapSeconds) \* 0.5  
  * Khi người chơi quay lại game sau hơn 5 phút offline, hiện Popup "Hũ Tiền Ngoại Tuyến" với 2 nút: **Nhận (x1)** và **Xem Quảng Cáo nhận (x2)**.

## **3.3. Bảng thông số mẫu cho bản MVP (Giai đoạn 1 – 3\)**

| Giai đoạn | Món / Hạng mục | Giá bán gốc (VNĐ) | Thời gian pha (giây) | Mục tiêu lên giai đoạn tiếp theo |
| :---- | :---- | :---- | :---- | :---- |
| Giai đoạn 1 (Vỉa hè) | Trà đá | 5.000đ | 1.0s | Tích lũy 500.000đ \+ 20 Điểm Uy tín (Dự kiến chơi 15–20 phút) |
| Giai đoạn 1 (Vỉa hè) | Cà phê đen đá / Sữa đá | 15.000đ | 2.5s | (Nâng cấp Xe đẩy ở mốc 250.000đ) |
| Giai đoạn 1 (Vỉa hè) | Bạc xỉu | 20.000đ | 3.0s | \- |
| Giai đoạn 2 (Booth) | Trà đào cam sả | 28.000đ | 3.5s | Tích lũy 3.500.000đ \+ 100 Điểm Uy tín (Dự kiến Ngày 2–3) |
| Giai đoạn 2 (Booth) | Cà phê muối | 32.000đ | 4.0s | \- |
| Giai đoạn 2 (Booth) | Bánh mì que | 18.000đ | 2.0s | \- |
| Giai đoạn 3 (Quán nhỏ) | Matcha Latte | 45.000đ | 4.5s | Tích lũy 25.000.000đ \+ 350 Điểm Uy tín (End of MVP) |
| Giai đoạn 3 (Quán nhỏ) | Bánh Tiramisu / Croissant | 42.000đ | 2.0s | \- |
| Giai đoạn 3 (Quán nhỏ) | Cà phê đóng chai (Kệ bán lẻ) | 55.000đ | Tự động lấy | \- |

# **4\. CHIẾN LƯỢC KIẾM TIỀN & GIỮ CHÂN (MONETIZATION & RETENTION)**

## **4.1. Nguyên tắc Monetization (Pay-to-Cute & Convenience)**

* **TUYỆT ĐỐI KHÔNG** sử dụng quảng cáo xen kẽ ép buộc (Forced Interstitial Ads) vì phá vỡ trải nghiệm Cozy.  
* Tập trung vào **Quảng cáo có thưởng (Rewarded Ads)** (chiếm \~60–70% doanh thu) và các gói **Micro-transactions giá rẻ** phù hợp sức chi tiêu Việt Nam.

## **4.2. Danh mục Gói IAP & Vị trí đặt Quảng cáo**

| Mã gói (SKU) | Tên hiển thị | Giá đề xuất (VNĐ) | Quyền lợi | Thời điểm hiển thị |
| :---- | :---- | :---- | :---- | :---- |
| reward\_offline\_x2 | x2 Tiền Ngoại Tuyến | Xem Video 30s | Nhân đôi toàn bộ tiền trong hũ Idle | Popup khi mở lại game |
| reward\_vip\_wave | Gọi Đoàn Khách VIP | Xem Video 30s | Tăng tốc độ khách vào x2 trong 2 phút | Nút nhỏ góc màn hình |
| iap\_starter\_pack | Gói Khởi Nghiệp "Ly Trà Sữa" | 22.000đ | 1 Nhân viên Mèo tự giao đơn Shipper \+ 50 Hạt Vàng \+ 200k Xu | Gợi ý khi lên Giai đoạn 2 |
| iap\_noads\_week | Vé Tuần Không Quảng Cáo | 19.000đ | Bỏ qua mọi quảng cáo thưởng trong 7 ngày | Cửa hàng (Shop) |
| iap\_noads\_month | Vé Tháng Không Quảng Cáo | 49.000đ | Bỏ qua mọi quảng cáo thưởng trong 30 ngày \+ 10 Hạt Vàng/ngày | Cửa hàng / Khi lên Giai đoạn 3 |
| iap\_noads\_forever | Đặc Quyền Trọn Đời | 119.000đ | Xóa toàn bộ quảng cáo thưởng vĩnh viễn | Cửa hàng |
| iap\_decor\_theme | Bộ Nội Thất Chủ Đề | 29.000đ – 59.000đ | Full bộ decor Đà Lạt / Hội An / Tết Xưa (+50 Điểm Sống Ảo) | Mục Trang trí ở Giai đoạn 3 |

## **4.3. Tính năng Giữ chân & Viral**

* **Đặt tên quán tùy chỉnh:** Cho phép người chơi nhập tên quán của riêng mình (ví dụ: "Cà Phê Nợ Môn"), tên hiển thị trực tiếp lên bảng hiệu trong Canvas game.  
* **Chụp ảnh Polaroid (Photo Mode):** Nút camera ẩn toàn bộ UI điều khiển, xuất ảnh có khung Polaroid \+ tên quán \+ watermark nhỏ của game để chia sẻ lên TikTok/Threads/Facebook Story.  
* **Nhiệm vụ ngày (Daily Quests):** 3 nhiệm vụ siêu nhẹ mỗi ngày (VD: Pha 15 ly cà phê, Phục vụ 3 anh Shipper, Nâng cấp 1 món) thưởng Hạt Cà Phê Vàng.

# **5\. KIẾN TRÚC KỸ THUẬT CHO GOOGLE ANTIGRAVITY**

## **5.1. Đề xuất Tech Stack tối ưu cho Agentic IDE**

Để Google Antigravity có thể lập trình, chạy preview trực tiếp trên trình duyệt, tự động kiểm thử UI và sau đó đóng gói mượt mà sang iOS/Android:

* **Ngôn ngữ:** TypeScript (Strict mode để giảm lỗi runtime khi AI sinh code).  
* **Game Engine (2D Canvas): Phaser 3** (nhẹ, quản lý Sprite, Animation, Particle, Tween, Camera cực tốt cho game 2D Cozy).  
* **UI Layer (HUD, Shop, Menu, Modals): React 18+ & Tailwind CSS** nằm chồng (overlay) lên Canvas Phaser. Tách bạch hoàn toàn giữa Game Loop (Phaser) và Giao diện (React) giúp AI code UI cực nhanh và đẹp.  
* **Quản lý Trạng thái (State Management): Zustand** (dùng chung làm cầu nối giữa Phaser và React, kèm middleware persist lưu vào localStorage / IndexedDB).  
* **Âm thanh: Howler.js** (hỗ trợ phát nhiều lớp âm thanh ASMR và nhạc nền Lo-fi ổn định trên mobile browser).  
* **Đóng gói Mobile & Monetization: Capacitor** (build ra app native iOS/Android) \+ Plugin @capacitor-community/admob (Rewarded Ads) \+ RevenueCat (IAP).

## **5.2. Cấu trúc Thư mục chuẩn (Project Directory Structure)**

```
tiem-ca-phe-bat-on/
├── public/
│   ├── assets/
│   │   ├── sprites/        # Nhân vật, khách hàng, nhân viên, bàn ghế, decor
│   │   ├── backgrounds/    # Nền 3 giai đoạn MVP (via-he, booth, quan-nho)
│   │   ├── ui/             # Icon tiền xu, hạt vàng, khung polaroid
│   │   └── audio/          # bgm_lofi.mp3, sfx_pour.mp3, sfx_ice.mp3, sfx_rain.mp3
├── src/
│   ├── data/               # Cấu hình tĩnh (JSON/TS) tách riêng khỏi logic
│   │   ├── stages.ts       # Cấu hình 6 giai đoạn (MVP bật 1-3)
│   │   ├── recipes.ts      # Danh sách đồ uống & giá gốc
│   │   ├── customers.ts    # Dữ liệu khách hàng & câu thoại hài hước
│   │   ├── upgrades.ts     # Danh sách nâng cấp máy móc, nhân viên, decor
│   │   └── shop.ts         # Cấu hình gói IAP & Rewarded Ads
│   ├── store/
│   │   ├── useGameStore.ts # Zustand store chính (tiền, cấp độ, inventory, offline time)
│   │   └── saveManager.ts  # Logic tính toán Offline Income & Migration save file
│   ├── game/               # Toàn bộ mã nguồn Phaser 3
│   │   ├── PhaserGame.ts   # Khởi tạo Phaser config (responsive 9:16 portrait mobile)
│   │   ├── EventBus.ts     # Cầu nối sự kiện giữa Phaser và React
│   │   ├── scenes/
│   │   │   ├── BootScene.ts
│   │   │   ├── CafeScene.ts # Scene chính xử lý render quán theo Stage hiện tại
│   │   └── entities/
│   │       ├── Customer.ts  # State machine: WALK_IN -> ORDER -> WAIT -> DRINK -> LEAVE
│   │       ├── Staff.ts     # AI nhân viên tự động pha chế / giao đồ cho Shipper
│   │       └── EventManager.ts # Xử lý Mưa rào & Trật tự đô thị
│   ├── components/         # React UI Overlay
│   │   ├── TopHUD.tsx      # Tên quán, Tiền xu, Hạt vàng, Điểm Sống Ảo
│   │   ├── BottomNav.tsx   # Menu: Thực đơn, Nâng cấp, Decor, Cửa hàng, Nhiệm vụ
│   │   ├── BrewMiniPanel.tsx # Bảng thao tác pha chế tay cho Giai đoạn 1
│   │   ├── OfflineModal.tsx # Popup nhận tiền Offline x1 / x2 Ads
│   │   ├── EventAlert.tsx  # Nút bấm nhanh "Căng bạt!" / "Thu ghế!"
│   │   └── PolaroidModal.tsx # Chế độ chụp ảnh khoe quán
│   ├── services/
│   │   ├── AudioService.ts # Quản lý Howler.js (BGM & ASMR SFX)
│   │   └── MonetizationService.ts # Mock Ads/IAP trên Web, gọi Native SDK trên Mobile
│   └── App.tsx
```

## **5.3. Lược đồ Dữ liệu cốt lõi (Core TypeScript Interfaces)**

```ts
export type StageId = 1 | 2 | 3 | 4 | 5 | 6;

export interface GameState {
  shopName: string;              // VD: "Tiệm Cà Phê Bất Ổn"
  currentStage: StageId;         // Giai đoạn hiện tại (1-3 cho MVP)
  gold: number;                  // Tiền xu (VNĐ)
  goldenBeans: number;           // Hạt Cà Phê Vàng (Hard currency)
  reputation: number;            // Điểm Sống Ảo / Uy tín
  unlockedRecipes: Record<string, number>; // { "cf_sua_da": level }
  upgrades: Record<string, number>;        // { "xe_day": 1, "staff_barista": 2 }
  equippedDecor: string[];       // Danh sách ID đồ trang trí đang bật
  ownedDecor: string[];
  hasNoAds: boolean;             // Trạng thái gói xóa quảng cáo
  noAdsExpiry: number | null;    // Timestamp hết hạn (null nếu vĩnh viễn)
  lastActiveTimestamp: number;   // Dùng để tính Offline Income
  dailyQuests: DailyQuestProgress[];
  settings: {
    bgmVolume: number;
    sfxVolume: number;
  };
}

export interface CustomerEntityState {
  id: string;
  archetype: 'xe_om' | 'sinh_vien' | 'shipper' | 'hang_xom' | 'kol';
  orderItems: { recipeId: string; quantity: number }[];
  patienceMax: number;
  patienceCurrent: number;
  status: 'ENTERING' | 'WAITING_ORDER' | 'WAITING_DRINK' | 'DRINKING' | 'LEAVING';
  seatIndex: number | null;
}
```

# **6\. KẾ HOẠCH TRIỂN KHAI CHO GOOGLE ANTIGRAVITY AGENT**

## **6.1. Quy tắc kỹ thuật bắt buộc cho Agent (Agent Guidelines)**

1. **Tỷ lệ màn hình (Mobile-First Portrait):** Toàn bộ khung game thiết kế chuẩn dọc **9:16** (căn giữa trên màn hình desktop kèm khung nền tối, full-screen trên điện thoại).  
2. **Chiến lược Asset Placeholder (Chạy được ngay):** Trong giai đoạn dựng logic chưa có đủ file ảnh vẽ tay, Agent phải tạo **Vector/SVG hoặc Phaser Graphics Placeholder đẹp mắt theo đúng bảng màu Cozy** (ghế nhựa xanh đỏ, ly cà phê, nhân vật hình khối dễ thương kèm nhãn) để game chơi được ngay và dễ dàng thay thế bằng sprite PNG sau này.  
3. **Tách biệt dữ liệu:** Không hardcode giá bán hay thời gian trong file logic; mọi thông số phải đọc từ thư mục src/data/ để dễ cân bằng kinh tế.  
4. **Kiểm thử tự động:** Sau mỗi Milestone, đảm bảo ứng dụng build không lỗi TypeScript (npm run build), hiển thị sạch sẽ trên trình duyệt và test được luồng Save/Load khi reload trang.

## **6.2. Lộ trình 5 Milestone thực thi (Task Breakdown)**

* **Milestone 1 — Khung dự án & Kiến trúc lõi:**  
  * Khởi tạo dự án Vite \+ React \+ TypeScript \+ Tailwind CSS \+ Phaser 3 \+ Zustand.  
  * Dựng useGameStore có tự động lưu vào localStorage, cài đặt EventBus kết nối Phaser và React.  
  * Dựng màn hình Splash \+ Nhập tên quán tùy chỉnh \+ TopHUD và BottomNav.  
* **Milestone 2 — Gameplay Giai đoạn 1 (Quán Cóc Vỉa Hè):**  
  * Dựng CafeScene với bối cảnh vỉa hè (tán cây, ghế nhựa, quầy phin).  
  * Lập trình AI khách hàng đi vào, gọi món (hiện bong bóng order trên đầu), thanh kiên nhẫn.  
  * Lập trình thao tác chạm pha chế cà phê phin (tiến trình pha chế \+ hiệu ứng bay tiền xu \+ cộng tiền).  
  * Lập trình 2 sự kiện ngẫu nhiên: **Trời mưa rào** (nút Căng bạt) và **Trật tự đô thị** (nút Thu ghế) kèm hiệu ứng hình ảnh.  
  * Thêm cột mốc nâng cấp **Xe Đẩy Lưu Động** ở cuối Giai đoạn 1\.  
* **Milestone 3 — Giai đoạn 2 (Booth Take-Away), Shipper & Idle Offline:**  
  * Chuyển đổi cảnh nền và layout sang Booth Take-Away khi đạt đủ điều kiện Tiền \+ Điểm Uy tín.  
  * Thêm loại khách **Shipper** (xếp hàng khu vực riêng, đặt đơn nhiều ly, có thưởng tốc độ).  
  * Lập trình **Nhân viên tự động** (thuê Barista tự pha chế, thuê Mèo phụ giao đơn).  
  * Hoàn thiện OfflineModal tính toán thu nhập khi quay lại game (giới hạn 4 tiếng, nút nhận x1 và giả lập nút xem quảng cáo x2).  
* **Milestone 4 — Giai đoạn 3 (Quán Nhỏ Trong Hẻm), Decor & Viral:**  
  * Chuyển đổi không gian sang Quán Nhỏ máy lạnh có khu vực chỗ ngồi cho Sinh viên chạy deadline & KOL.  
  * Xây dựng **Hệ thống Decor** (mua và bật/tắt đồ trang trí ngay trên scene quán, cộng Điểm Sống Ảo).  
  * Thêm **Kệ Bán Lẻ & Merchandise** (khách tự động mua thêm cà phê đóng chai).  
  * Xây dựng **Chế độ chụp ảnh Polaroid** (html2canvas hoặc export từ Phaser Canvas kèm khung Polaroid và tên quán).  
  * Thêm bảng thông báo *"Sắp ra mắt: Quán Flagship 2 tầng & Xưởng Rang Xay"* làm điểm kết thúc vòng lặp MVP.  
* **Milestone 5 — Âm thanh ASMR, Monetization & Đóng gói Mobile:**  
  * Tích hợp AudioService (Howler.js) với nút điều chỉnh âm lượng BGM / SFX riêng biệt.  
  * Dựng hoàn chỉnh Cửa hàng (Shop) với các gói IAP (Starter Pack 22k, Vé Tuần/Tháng/Vĩnh viễn No-Ads, Bộ Decor) và Daily Quests.  
  * Cấu hình Capacitor sẵn sàng xuất bản build Android (.aab) và iOS.

## **6.3. Prompt mẫu để khởi động ngay trên Google Antigravity**

Cung cấp một khung prompt ngắn gọn ở cuối tài liệu để chủ dự án copy trực tiếp vào Google Antigravity:  
"Hãy đọc toàn bộ tài liệu GDD & Tech Spec của dự án 'Tiệm Cà Phê Bất Ổn'. Bắt đầu thực hiện Milestone 1: Khởi tạo dự án Vite \+ React \+ TypeScript \+ Tailwind CSS \+ Phaser 3 \+ Zustand theo đúng cấu trúc thư mục mục 5.2 và interface mục 5.3. Sử dụng đồ họa placeholder dạng vector màu pastel ấm áp để tôi có thể chạy preview ngay lập tức trên trình duyệt theo tỷ lệ dọc 9:16."