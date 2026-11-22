# ĐẶC TẢ MỞ RỘNG GAMEPLAY CHÂN THỰC (REALISM ADD-ON SPEC)
**Dự án:** Tiệm Cà Phê Bất Ổn
**Mục tiêu:** Nâng cấp chiều sâu mô phỏng kinh doanh F&B thực tế tại Việt Nam từ giai đoạn khởi nghiệp vỉa hè (pha chế đa công đoạn, gu khách hàng, quản lý kho, vệ sinh bàn ghế) đến giai đoạn vận hành quy mô lớn (nghiên cứu công thức R&D, xưởng rang xay, quản trị nhân sự, chọn mặt bằng theo bản đồ Việt Nam và thi đấu giữa các tỉnh thành) nhưng vẫn giữ nhịp độ thư giãn (Cozy).

---

## 1. HỆ THỐNG PHA CHẾ ĐA CÔNG ĐOẠN & "GU KHÁCH VIỆT"

Thay vì chỉ bấm 1 nút và chờ hết thanh thời gian, thao tác pha chế của người chơi (ở Giai đoạn 1 và khi tự tay hỗ trợ ở Giai đoạn 2–3) được chia thành **3 bước chạm nhanh (1.5 – 3 giây tổng cộng)** kết hợp kiểm tra yêu cầu riêng của khách.

### 1.1. Danh sách Ghi chú Order (Order Modifiers)
Khi khách sinh ra đơn hàng, hệ thống random 1 ghi chú dựa trên giai đoạn hiện tại:

| Mã Modifier | Hiển thị trên bong bóng | Tỷ lệ xuất hiện | Thao tác đúng yêu cầu |
| :--- | :--- | :--- | :--- |
| `normal` | *"Bình thường nha"* | 40% | Mức sữa 1, Mức đá 2, Ly tại chỗ |
| `less_ice` | *"Ít đá thôi nha"* | 20% | Chỉ chạm 1 lần vào thùng đá (thay vì 2 lần) |
| `more_milk` | *"Nhiều sữa ít cà phê"* | 15% | Chạm 2 lần vào hộp sữa đặc |
| `no_sugar` | *"Đen không đường/sữa"* | 10% | Bỏ qua bước thêm sữa/đường |
| `take_away` | *"Mang đi bỏ bịch"* | 15% | Chọn ly nhựa mang đi thay vì ly thủy tinh |

### 1.2. Quy tắc chấm điểm "Chuẩn Gu"
* **Pha đúng 100% ghi chú:** Hiện huy hiệu **"Chuẩn Gu! ✨"**, cộng thêm **+20% tiền tip** và **+1 Điểm Sống Ảo**.
* **Pha sai ghi chú (VD: khách dặn không đường nhưng vẫn bỏ sữa):** Khách vẫn nhận nước và trả tiền gốc, nhưng hiện bong bóng than phiền hài hước (*"Ủa dặn không sữa mà sao ngọt dữ vậy trời?"*), **không có tiền tip**.

---

## 2. VÒNG ĐỜI BÀN GHẾ & VỆ SINH QUÁN (TABLE LIFECYCLE)

Mỗi vị trí ghế/bàn trên `CafeScene` tuân theo vòng đời 3 trạng thái:

1. **`EMPTY` (Sạch sẽ):** Sẵn sàng đón khách mới ngồi vào.
2. **`OCCUPIED` (Đang phục vụ):** Khách đang ngồi gọi món, chờ nước hoặc thưởng thức.
3. **`DIRTY` (Bàn bẩn):** Sau khi khách uống xong và rời đi, trên ghế/bàn xuất hiện sprite **ly rỗng + vỏ hạt hướng dương + khăn giấy**.
   * **Tác động:** Khách mới đi tới thấy bàn bẩn sẽ đứng khựng lại, hiện icon chổi quét/nhăn mặt và giảm tốc độ kiên nhẫn.
   * **Cách xử lý:** Người chơi chạm 1 lần vào bàn bẩn để dọn (phát âm thanh quét dọn nhẹ + rơi ngẫu nhiên 1.000đ – 2.000đ tiền lẻ khách bỏ quên). Từ Giai đoạn 2–3, nhân viên phụ quán sẽ tự động đi dọn bàn bẩn khi rảnh tay.

---

## 3. QUẢN LÝ KHO NGUYÊN LIỆU & HAO HỤT (INVENTORY & SUPPLY)

Để tạo cảm giác quản lý dòng tiền thật (Vốn lưu động), quán có **3 chỉ số kho cơ bản** hiển thị bằng 3 thanh nhỏ gọn cạnh quầy pha chế:

| Nguyên liệu | Ký hiệu | Mức tiêu hao / 1 đơn | Chi phí nhập đầy kho (100%) | Tác động khi cạn kho (0%) |
| :--- | :--- | :--- | :--- | :--- |
| **Cà phê & Trà** | `coffeeStock` | -4% / ly | 40.000đ | Không thể pha đồ uống, khách đứng chờ |
| **Đá cây / Đá bi** | `iceStock` | -5% / ly đá (+tự tan 1%/15s buổi trưa) | 20.000đ | Chỉ bán được món nóng / bánh, từ chối món đá |
| **Sữa & Topping** | `milkStock` | -4% / ly có sữa/trà trái cây | 35.000đ | Chỉ pha được cà phê đen & trà đá |

* **Trải nghiệm nhập hàng:** Khi bất kỳ nguyên liệu nào xuống dưới **20%**, nút **"Gọi mối giao hàng"** nhấp nháy màu cam. Bấm vào sẽ trừ tiền xu và chạy animation một chiếc xe máy chở thùng đá/bao cà phê chạy ngang qua trước quán để nạp đầy 100% kho.

---

## 4. CHU KỲ THỜI GIAN TRONG NGÀY & SỔ THU CHI CUỐI NGÀY

### 4.1. Nhịp điệu 1 Ngày trong game (Tổng thời lượng: 3 phút 30 giây thực)
Đồng hồ góc trên màn hình chạy từ **06:00** đến **22:00**:

* **06:00 – 10:30 (Buổi Sáng - Nắng nhẹ vàng ấm):**
  * Tốc độ khách xuất hiện: **1.3x**.
  * Nhóm khách chủ đạo: Chú Ba Xe Ôm, Cô Tư Vé Số, dân văn phòng mua cà phê mang đi.
* **10:30 – 14:30 (Buổi Trưa - Nắng gắt):**
  * Tốc độ tan đá tăng gấp đôi; khách ưu tiên gọi Trà đá, Trà đào cam sả; ở Giai đoạn 3 khách tràn vào tìm chỗ máy lạnh.
* **14:30 – 18:00 (Buổi Chiều - Giờ xế công sở):**
  * Tỷ lệ xuất hiện **Anh Shipper Công Nghệ** tăng gấp đôi (đặt combo 3–5 ly).
* **18:00 – 22:00 (Buổi Tối - Ánh đèn vàng ấm áp):**
  * Bật hiệu ứng đèn vàng/đèn lồng trong quán; Sinh viên chạy deadline và cặp đôi ngồi lâu, gọi nhiều bánh ngọt.

### 4.2. Sổ Thu Chi & Đánh Giá Cuối Ngày (Daily Ledger Modal)
Đúng **22:00**, quán đóng cửa tổng kết ngày (có nút "Qua ngày mới" hoặc tự động chuyển sau khi xem):

* **Bảng hạch toán tài chính:**
  * (+) Doanh thu bán nước & bánh
  * (+) Tiền tip "Chuẩn Gu"
  * (-) Chi phí nhập nguyên liệu (Đá, Cà phê, Sữa)
  * (-) Tiền phạt trật tự đô thị (nếu có)
  * **(=) Lợi nhuận ròng trong ngày**
* **Góc Review Mạng Xã Hội (1–2 bình luận ngẫu nhiên phản ánh đúng cách chơi trong ngày):**
  * *Nếu phục vụ nhanh & nhiều "Chuẩn Gu":* ⭐⭐⭐⭐⭐ *"Quán pha đúng gu ít đá nhiều sữa đỉnh chóp, anh chủ dễ thương!"*
  * *Nếu để bàn bẩn nhiều:* ⭐⭐⭐ *"Nước ngon mà bàn trước chưa kịp dọn hơi nhiều vỏ hướng dương nha quán ơi."*
  * *Nếu hết đá giữa buổi trưa:* ⭐⭐ *"Trưa nắng 38 độ ghé quán mà báo hết đá, buồn ngang!"*

---

## 5. HỆ THỐNG CHUYÊN SÂU: BẢN ĐỒ ĐỊA ĐIỂM, ĐẤU TRƯỜNG TỈNH THÀNH & R&D MỞ RỘNG

### 5.1. Chọn Địa Điểm Khởi Nghiệp & Mở Rộng Theo Bản Đồ Việt Nam (Geo-Location Strategy)
Ngay từ lúc bắt đầu (hoặc khi mở chi nhánh mới), người chơi mở **Bản Đồ Việt Nam 2D** để chọn tỉnh thành và **chọn cụ thể từng loại mặt bằng (Vị trí)**, mỗi nơi có hệ số khách hàng, tiền thuê mặt bằng và khẩu vị riêng biệt:

#### A. Chọn Tỉnh Thành Hoạt Động (Regional Profiles)
| Khu vực / Tỉnh thành | Đặc trưng khẩu vị & Khách hàng | Món đặc sản mở khóa | Thử thách địa phương |
| :--- | :--- | :--- | :--- |
| **TP. Hồ Chí Minh** | Thích cà phê sữa đá nhiều đá, uống nhanh, đơn Shipper nổ liên tục | Cà phê sữa đá Sài Gòn, Trà tắc xí muội | Mưa rào bất chợt, kẹt xe giờ cao điểm |
| **Hà Nội** | Thích ngồi vỉa hè/phố cổ, chuộng vị đậm truyền thống, ngồi trò chuyện lâu | Cà phê trứng, Cà phê nâu nóng, Sấu đá | Trật tự đô thị gắt, gió mùa đông bắc (tăng món nóng) |
| **Đà Lạt (Lâm Đồng)** | Khách du lịch & KOL đông, chuộng không gian gỗ chill, chụp ảnh sống ảo | Trà Atiso đỏ, Cà phê Arabica Cầu Đất, Sữa đậu nành nóng | Sương mù & mưa phùn (cần nâng cấp lò sưởi/đèn ấm) |
| **Huế & Đà Nẵng** | Tốc độ sống vừa phải, chuộng vị đậm béo, khách du lịch theo đoàn | Cà phê muối xứ Huế, Trà cung đình | Mùa bão miền Trung (cần gia cố mái che/cửa kính) |
| **Cần Thơ & Miền Tây** | Khách hào sảng, hay cho tiền tip cao, thích đồ uống ngọt thanh giải nhiệt | Cà phê kho quẹt, Trà mãng cầu, Dừa tươi cà phê | Triều cường (bấm kê cao ghế nhựa nhận thưởng vui) |
| **Global (End-game)** | Tokyo, Seoul, Paris, New York — Khách quốc tế tò mò văn hóa phin Việt | Bánh mì que + Phin Việt Set | Rào cản ngôn ngữ (cần thuê nhân viên biết ngoại ngữ) |

#### B. Chọn Vị Trí Mặt Bằng Trong Tỉnh (Micro-Location Selection)
Trong mỗi tỉnh thành, người chơi được chọn 1 trong 4 điểm đặt quán (ảnh hưởng trực tiếp đến lượng khách và chi phí):
1. **Cổng Trường Đại Học / Ký Túc Xá:** Giá thuê rẻ, lượng sinh viên cực đông, bán chạy món giá mềm (Trà đá, Bạc xỉu, Bánh mì que), yêu cầu nhiều ổ cắm.
2. **Khu Văn Phòng / Ngã Tư Trung Tâm:** Giá thuê cao, bùng nổ vào khung giờ sáng (7h–9h) và giờ đặt Shipper buổi chiều (14h–16h), khách trả tiền nhanh, tip cao.
3. **Hẻm Nhỏ Yên Tĩnh / Khu Phố Cổ:** Giá thuê trung bình, ít khách vãng lai nhưng cực kỳ hút **KOL / Reviewer** nếu điểm Decor cao.
4. **Điểm Du Lịch / Bờ Hồ / Chợ Đêm:** Doanh thu bùng nổ vào cuối tuần và các dịp lễ, khách gọi combo lớn.

---

### 5.2. Đấu Trường Tỉnh Thành & Bảng Xếp Hạng Địa Phương (Provincial Competition)
Tạo động lực cạnh tranh lành mạnh (Cozy PvP / Asynchronous Leaderboard) giữa người chơi ở các tỉnh thành trên cả nước:

* **Đại Diện Tỉnh Thành (Hometown Pride):**
  * Người chơi chọn **1 Tỉnh/Thành phố quê hương** làm đại bản doanh chính (hiện huy hiệu tỉnh cạnh tên quán, VD: `[65 - Cần Thơ] Tiệm Cà Phê Bất Ổn`).
  * Mọi điểm Uy tín & Doanh thu kiếm được sẽ đóng góp vào **Tổng Điểm Đua Top Tỉnh Thành** theo tuần.
* **Giải Đấu "Cúp Phin Vàng Toàn Quốc" (Sự kiện cuối tuần — Thứ 6 đến Chủ Nhật):**
  * Hệ thống chia bảng đấu giữa các tỉnh (VD: *Đại chiến Cà phê Sữa Đá Sài Gòn vs Cà phê Trứng Hà Nội*, hoặc *Đua Top 63 Tỉnh Thành*).
  * **Thử thách trực tiếp:** Trong 48 giờ cuối tuần, quán nào đạt chuỗi "Chuẩn Gu" cao nhất hoặc bán được nhiều món đặc sản địa phương nhất sẽ mang điểm về cho tỉnh mình.
  * **Phần thưởng:** Toàn bộ người chơi thuộc Top 3 Tỉnh dẫn đầu nhận **Hạt Cà Phê Vàng**, **Bảng hiệu Vàng độc quyền** và **Linh vật trang phục truyền thống vùng miền** (Mèo mặc áo dài, Mèo đội nón lá, Mèo quàng khăn rằn).
* **Chế độ "Ghé Thăm & Thách Đấu Quán Bạn" (Social Visit):**
  * Xem bảng xếp hạng trong cùng tỉnh thành, bấm ghé thăm không gian quán của người chơi khác để tham khảo cách Decor, thả tim tặng nhau 1 Hạt Vàng/ngày hoặc gửi lời mời **"Giao hữu tốc độ pha chế 60 giây"**.

---

### 5.3. Phòng R&D — Sáng Tạo Công Thức & Cây Công Nghệ F&B (Deep R&D Tree)
Mở rộng tính năng nghiên cứu thành 2 nhánh rõ rệt: **Sáng tạo món Signature** và **Nâng cấp Cây Công Nghệ Kinh Doanh**:

#### A. Bàn Thí Nghiệm Công Thức (Recipe Lab)
Người chơi tự phối 3 thành phần `[Cốt nền] + [Topping/Hương vị] + [Kỹ thuật]` để khám phá hơn **30+ công thức ẩn**:
* `Cà phê phin` + `Kem muối` + `Đánh bông` ➔ **Cà phê muối Signature** (+35% giá bán, hút Shipper).
* `Trà Oolong` + `Mãng cầu xiêm` + `Giã tay` ➔ **Trà mãng cầu hot trend** (tạo cơn sốt viral 3 ngày liên tiếp).
* `Cà phê Robusta` + `Lòng đỏ trứng gà` + `Đánh kem nóng` ➔ **Cà phê trứng Phố Cổ** (tăng mạnh uy tín tại Hà Nội).
* `Cà phê sữa` + `Nước cốt dừa` + `Xay đá tuyết` ➔ **Cà phê dừa nhiệt đới** (hút khách du lịch Đà Nẵng & Quốc tế).
* **Tự đặt tên món & Thiết kế tem ly:** Món Signature thành công được người chơi đặt tên riêng và gắn nhãn **"Best-Seller"** đầu menu.

#### B. Cây Công Nghệ F&B (Business Tech Tree)
Dùng điểm nghiên cứu (tích lũy từ việc bán hàng và đọc review khách) để mở khóa các công nghệ vận hành hiện đại:
1. **Nhánh Vận Hành:** *App Order tại bàn QR Code* (tự động nhận order không cần nhân viên chạy bàn) ➔ *Máy pha Espresso tự động kép* (giảm 40% thời gian pha) ➔ *Hệ thống ERP quản lý kho tự động* (tự nhập hàng khi dưới 15%).
2. **Nhánh Marketing & Viral:** *Chạy quảng cáo TikTok địa phương* (tăng 50% lượng khách trong 3 phút) ➔ *Hợp tác Food Reviewer nổi tiếng* ➔ *Ra mắt bộ sưu tập Ly đổi màu & Túi Tote giới hạn* (tăng gấp đôi doanh thu kệ bán lẻ).
3. **Nhánh Chuỗi Cung Ứng (Xưởng Rang Xay):** *Liên kết nông trại Buôn Ma Thuột & Cầu Đất* ➔ *Máy rang tự động kiểm soát nhiệt độ* ➔ *Dây chuyền đóng chai cà phê Cold Brew xuất khẩu*.

---

### 5.4. Xưởng Rang Xay & Quản Trị Nhân Sự Thực Tế (Giai đoạn 4–5)
* **Xưởng Rang Xay (Roastery):** Chọn hạt **Robusta Buôn Ma Thuột** (đậm, giá vốn rẻ) hoặc **Arabica Cầu Đất** (thơm thanh, giá bán cao), canh mức rang **Light / Medium / Dark** để tự cung ứng hạt cho toàn bộ chi nhánh các tỉnh, giảm 30% chi phí nhập kho.
* **Nhân sự có Năng lượng (Stamina) & Kỹ năng vùng miền:** Nhân viên làm việc giờ cao điểm sẽ giảm năng lượng; bấm **"Khao cả team chầu trà sữa/bánh tráng"** để hồi phục 100% và buff tốc độ +25%.
* **Biến cố thực tế:** *Mất điện luân phiên buổi trưa* (quay về dùng phin nhôm pha tay trong 45s để cứu quán), *Thanh tra Vệ sinh An toàn Thực phẩm* (kiểm tra độ sạch bàn ghế & kho).

---

## 6. CẬP NHẬT LƯỢC ĐỒ DỮ LIỆU TYPESCRIPT (`src/store/useGameStore.ts`)

```typescript
export type OrderModifier = 'normal' | 'less_ice' | 'more_milk' | 'no_sugar' | 'take_away';
export type TimeOfDay = 'MORNING' | 'NOON' | 'AFTERNOON' | 'EVENING';
export type RoastLevel = 'LIGHT' | 'MEDIUM' | 'DARK';
export type ProvinceId = 'hcm' | 'hanoi' | 'dalat' | 'hue_danang' | 'cantho' | 'global';
export type SpotType = 'university' | 'office' | 'alley' | 'tourist';

export interface BranchLocationState {
  provinceId: ProvinceId;
  spotType: SpotType;
  branchName: string;
  stage: StageId;
  passiveIncomePerMin: number;
  localReputation: number;
}

export interface ProvincialLeagueState {
  homeProvinceId: ProvinceId;
  weeklyContributionScore: number;
  currentRankInProvince: number;
  provinceTotalScore: number;
  claimedWeekendReward: boolean;
}

export interface SeatState {
  index: number;
  status: 'EMPTY' | 'OCCUPIED' | 'DIRTY';
  customerId: string | null;
}

export interface InventoryStock {
  coffeeStock: number; // 0 - 100
  iceStock: number;    // 0 - 100
  milkStock: number;   // 0 - 100
}

export interface SignatureRecipe {
  id: string;
  customName: string;
  baseIngredient: string;
  toppingIngredient: string;
  technique: string;
  priceMultiplier: number;
  isTrending: boolean;
}

export interface TechTreeState {
  researchPoints: number;
  unlockedNodes: string[]; // VD: ['qr_order', 'auto_restock', 'tiktok_ads']
}

export interface DailyReport {
  dayNumber: number;
  revenue: number;
  tips: number;
  supplyCost: number;
  penalties: number;
  netProfit: number;
  perfectOrdersCount: number;
  reviewStars: number;
  reviewComment: string;
}
```

---

## 7. LỘ TRÌNH PROMPT TRIỂN KHAI CHO GOOGLE ANTIGRAVITY AGENT

### Đợt A — Cơ chế Chân thực & Chọn Địa điểm Khởi nghiệp (Giai đoạn 1–3)
```text
Đọc `.agent/PROJECT_MAP.md`, `.agent/PROGRESS.md` và mục 1–4, mục 5.1 trong `docs/REALISM_ADDON_SPEC.md`. Tuân thủ `.agent/rules/game-rules.md` và skill `lean-coding`.

Hãy nâng cấp game "Tiệm Cà Phê Bất Ổn" với các cơ chế thực tế sau:
1. **Chọn Tỉnh Thành & Mặt Bằng trên Bản Đồ Việt Nam (`VietnamMapModal.tsx`):** Khi tạo quán mới (hoặc chuyển địa điểm), cho phép chọn tỉnh đại diện (TP.HCM, Hà Nội, Đà Lạt, Huế/Đà Nẵng, Cần Thơ) và chọn loại mặt bằng (`university`, `office`, `alley`, `tourist`). Áp dụng hệ số khách hàng, món đặc sản và tiền thuê mặt bằng tương ứng.
2. **Pha chế 3 bước & Order Modifiers (`Customer.ts` + `BrewMiniPanel.tsx`):** Gắn ghi chú yêu cầu (`normal`, `less_ice`, `more_milk`, `no_sugar`, `take_away`) cho khách. Người chơi chọn mức sữa, mức đá, loại ly; khớp yêu cầu nhận +20% tip "Chuẩn Gu!".
3. **Vệ sinh bàn & Kho nguyên liệu (`CafeScene.ts` + `useGameStore.ts`):** Bàn chuyển sang `DIRTY` sau khi khách rời đi (chạm để dọn). Thêm kho `coffeeStock`, `iceStock`, `milkStock` và nút "Gọi giao hàng" nạp đầy kho.
4. **Chu kỳ Sáng/Trưa/Chiều/Tối & Sổ Thu Chi (`DailyReportModal.tsx`):** Chạy đồng hồ 06:00–22:00 trong ngày, cuối ngày hiển thị Sổ Thu Chi lợi nhuận ròng kèm review đánh giá sao của khách.

Chạy skill `verify-build` (`npm run build` 0 lỗi, kiểm tra Console), sau đó cập nhật `.agent/PROJECT_MAP.md` và `.agent/PROGRESS.md`.
```

### Đợt B — Đấu Trường Tỉnh Thành, Cây R&D & Chuỗi Quốc Tế (End-game)
```text
Đọc `.agent/PROJECT_MAP.md`, `.agent/PROGRESS.md` và mục 5.2–5.4, mục 6 trong `docs/REALISM_ADDON_SPEC.md`. Tuân thủ `.agent/rules/game-rules.md` và skill `lean-coding`.

Hãy triển khai các tính năng mở rộng & thi đấu tỉnh thành:
1. **Đấu Trường Tỉnh Thành "Cúp Phin Vàng" (`ProvincialLeagueModal.tsx`):** Hiển thị bảng xếp hạng đua Top giữa các tỉnh thành Việt Nam (mô phỏng dữ liệu cạnh tranh sống động theo thời gian thực), điểm đóng góp của người chơi và phần thưởng skin linh vật vùng miền (áo dài, nón lá, khăn rằn).
2. **Phòng R&D & Cây Công Nghệ F&B (`RndModal.tsx`):** Gồm 2 tab: Tab 1 tự phối 3 nguyên liệu tạo món Signature đặt tên riêng; Tab 2 nâng cấp Cây Công Nghệ (`QR Order`, `Tự động nhập kho`, `Quảng cáo TikTok`).
3. **Xưởng Rang Xay & Quản trị Nhân sự (`RoasteryPanel.tsx` + `Staff.ts`):** Chọn hạt Buôn Ma Thuột / Cầu Đất, canh mức rang giảm chi phí kho; thêm thanh Stamina cho nhân viên, nút "Khao chầu trà sữa" hồi phục năng lượng và sự kiện "Mất điện buổi trưa".
4. **Mở Chi Nhánh Đa Tỉnh & Xuất Ngoại (`VietnamMapModal.tsx`):** Cho phép mở thêm chi nhánh ở các tỉnh khác và quốc tế (Tokyo, Seoul, Paris, New York) để thu doanh thu thụ động về quỹ tổng.

Chạy skill `verify-build`, sau đó cập nhật `.agent/PROJECT_MAP.md` và `.agent/PROGRESS.md`.
```
