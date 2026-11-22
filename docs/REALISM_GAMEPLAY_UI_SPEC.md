# ĐẶC TẢ CƠ CHẾ GAMEPLAY CHÂN THỰC & THIẾT KẾ GIAO DIỆN (6 GIAI ĐOẠN)

**Dự án:** Tiệm Cà Phê Bất Ổn
**Mục tiêu thiết kế:** Xây dựng mô hình mô phỏng kinh doanh F&B thực tế tại Việt Nam từ quy mô vỉa hè đến chuỗi quốc tế. Tài liệu này quy định chi tiết cả **cơ chế vận hành kinh tế 6 giai đoạn** lẫn **kiến trúc giao diện di động dọc 9:16 (UI/UX)** để đồng bộ hoàn toàn giữa Phaser Canvas và React Overlay.

---

## 1. HỆ THỐNG CƠ CHẾ LÕI XUYÊN SUỐT (CORE REALISM MECHANICS)

### 1.1. Cơ chế Pha chế 3 Bước & Chấm điểm "Chuẩn Gu" (Multi-step Brewing)
Thay vì bấm 1 nút chờ tự động, thao tác pha chế thủ công của người chơi được mô phỏng theo đúng quy trình quầy bar Việt Nam trong **1.5 – 3.0 giây**:
1. **Bước 1 — Chọn Vật Đựng & Cốt Nền:** Chọn Ly thủy tinh (uống tại chỗ) hoặc Ly nhựa + Bịch mang đi (`take_away`), sau đó hứng cốt cà phê phin / trà ủ.
2. **Bước 2 — Định Lượng Gia Vị (Sữa / Đường / Kem muối):**
   - `normal`: 1 chạm hộp sữa đặc (mức chuẩn).
   - `more_milk`: 2 chạm hộp sữa đặc (béo ngọt).
   - `no_sugar`: 0 chạm (bỏ qua bước sữa/đường).
3. **Bước 3 — Nhiệt Độ & Đá:**
   - Uống đá chuẩn: 2 chạm vào thùng đá đỏ.
   - `less_ice` (Ít đá): 1 chạm vào thùng đá đỏ.
   - Đánh bọt / Lắc shaker (với Bạc xỉu, Cà phê muối, Trà đào): Nhấn giữ và thả trong vùng màu vàng trên thanh lực.

* **Công thức tính thưởng "Chuẩn Gu":**
  $$\text{Tiền thực nhận} = \text{Giá gốc} \times (1 + \text{Bonus Nâng Cấp}) + \text{Tip}$$
  - **Khớp 100% Modifier:** Đạt trạng thái **"Chuẩn Gu! ✨"** $\rightarrow$ Tiền Tip $= 20\% \times \text{Giá bán}$, cộng thêm $+1$ Điểm Sống Ảo và $+1$ Điểm Đua Top Tỉnh.
  - **Sai 1 bước (VD: khách dặn ít đá nhưng bỏ nhiều đá):** Khách vẫn nhận nước, trả 100% giá gốc nhưng **Tip = 0đ**, hiện thoại góp ý hài hước.

### 1.2. Vòng đời Vệ sinh Bàn Ghế & Điểm Sạch Sẽ (Hygiene Loop)
Mỗi vị trí ghế/bàn trên `CafeScene` vận hành theo State Machine 3 trạng thái:
- `EMPTY` $\rightarrow$ `OCCUPIED` (Khách ngồi trong $15\text{s} - 40\text{s}$ tùy nhóm khách) $\rightarrow$ `DIRTY`.
- **Cơ chế bàn bẩn (`DIRTY`):**
  - Khi khách đứng dậy, trên bàn xuất hiện rác đặc trưng (ly rỗng, vỏ hạt hướng dương, khăn giấy).
  - Khách mới đi tới gặp bàn `DIRTY` sẽ đứng khựng lại, không thể ngồi và bị trừ **2 điểm kiên nhẫn/giây**.
  - **Tương tác:** Chạm vào bàn bẩn để dọn sạch ($0.5\text{s}$), có xác suất **25%** nhặt được tiền lẻ khách để quên ($1.000\text{đ} - 5.000\text{đ}$). Từ Giai đoạn 2 trở đi, nhân viên phụ quán sẽ tự động ưu tiên dọn bàn khi không có đơn chờ.

### 1.3. Chuỗi Cung Ứng Kho & Hao Hụt Tự Nhiên (Working Capital)
Quán vận hành 3 kho nguyên liệu tiêu hao liên tục (`0% - 100%`):

| Mã Kho | Tên Nguyên Liệu | Hao hụt / 1 đơn | Hao hụt tự nhiên | Giá nhập đầy (100%) | Hậu quả khi cạn (0%) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `coffeeStock` | Cà phê bột & Trà lá | $-4\%$ | Không | $40.000\text{đ}$ | Ngừng nhận đơn đồ uống |
| `iceStock` | Đá cây / Đá bi | $-5\%$ | $-1\% / 15\text{s}$ (Buổi trưa) | $20.000\text{đ}$ | Chỉ bán được đồ nóng / bánh |
| `milkStock` | Sữa đặc & Topping | $-4\%$ | Không | $35.000\text{đ}$ | Khóa món có sữa & trà trái cây |

- **Luồng nhập hàng thực tế:** Khi kho $< 20\%$, biểu tượng cảnh báo nhấp nháy. Bấm **"Gọi mối giao hàng"** sẽ trừ tiền mặt từ quỹ quán và kích hoạt hoạt ảnh xe chở hàng chạy ngang cửa quán để nạp đầy kho sau $2\text{s}$.

### 1.4. Chu kỳ Ngày Đêm & Sổ Thu Chi Cuối Ngày (Day/Night & P&L Ledger)
Một ngày kinh doanh kéo dài **3 phút 30 giây thực** (tương ứng **06:00 $\rightarrow$ 22:00**):
- **06:00 – 10:30 (Buổi Sáng):** Tốc độ khách $1.3\times$. Khách vỉa hè & dân công sở mua mang đi chiếm $70\%$.
- **10:30 – 14:30 (Buổi Trưa):** Nắng gắt, đá tan nhanh gấp đôi. Nhu cầu trà trái cây & chỗ ngồi máy lạnh tăng mạnh.
- **14:30 – 18:00 (Buổi Chiều):** Khung giờ "xế chiều", **Anh Shipper** xuất hiện với tần suất $2.0\times$, đặt đơn gộp $3 - 5$ ly.
- **18:00 – 22:00 (Buổi Tối):** Lên đèn vàng ấm áp. Sinh viên chạy deadline & cặp đôi ngồi lâu, tăng tỷ lệ gọi bánh ngọt kèm nước.
- **22:00 (Đóng cửa & Hạch toán P&L):** Hiển thị bảng **Sổ Thu Chi Cuối Ngày** tính rõ: $\text{Lợi nhuận ròng} = (\text{Doanh thu} + \text{Tip}) - (\text{Tiền nhập kho} + \text{Tiền thuê mặt bằng} + \text{Lương nhân viên} + \text{Tiền phạt})$ kèm 2 đánh giá thực tế của khách hàng dựa trên hiệu suất trong ngày.

---

## 2. PHÂN TÍCH CHI TIẾT 6 GIAI ĐOẠN PHÁT TRIỂN KINH DOANH

### GIAI ĐOẠN 1: QUÁN CÓC VỈA HÈ (Khởi nghiệp Siêu nhỏ)
- **Điều kiện mở khóa:** Mặc định khi tạo quán (Vốn khởi điểm: $50.000\text{đ}$, Tiền thuê mặt bằng: $0\text{đ}/\text{ngày}$).
- **Quy mô vật lý:** $1$ gốc cây vỉa hè, $1$ quầy gỗ nhỏ, $3$ ghế nhựa lùn (tối đa $5$ ghế khi nâng cấp), $1$ thùng đá đỏ.
- **Trọng tâm Gameplay (Thao tác tay & Phản xạ):**
  - Người chơi trực tiếp thực hiện mọi khâu: Nhận order $\rightarrow$ Pha phin 3 bước $\rightarrow$ Thu tiền $\rightarrow$ Dọn vỏ hướng dương.
  - Khách hàng đặc trưng: *Chú Ba Xe Ôm*, *Cô Tư Vé Số*, *Cô Bảy Hàng Xóm* (thời gian kiên nhẫn cao, giá bán thấp $10.000\text{đ} - 22.000\text{đ}$, hay trò chuyện đời thường).
- **Biến cố đặc trưng:**
  1. **Mưa rào bất chợt:** Kéo dài $15\text{s}$. Nếu không bấm **"Căng bạt ngay"** trong $5\text{s}$, khách bỏ chạy hết và tốc độ pha giảm $50\%$.
  2. **Trật tự đô thị đi ngang:** Cảnh báo còi xe trước $3\text{s}$. Bấm **"Thu ghế nhanh"** trong $4\text{s}$ để giấu ghế nhựa; nếu trễ bị phạt $25.000\text{đ}$ và khóa $2$ ghế trong $30\text{s}$.
- **Cột mốc chuyển giai đoạn:** Tích lũy đủ **$250.000\text{đ}$** + **15 Điểm Uy Tín** để mua *Xe Đẩy & Kiosk Take-Away*.

---

### GIAI ĐOẠN 2: BOOTH TAKE-AWAY & XE ĐẨY (Tối ưu Tốc độ & Đơn Giao Hàng)
- **Điều kiện mở khóa:** Đạt mốc Giai đoạn 1 (Tiền thuê vỉa hè cố định: $30.000\text{đ}/\text{ngày}$).
- **Quy mô vật lý:** Kiosk gỗ có mái che, quầy đóng gói mang đi, máy ép màng ly, khu vực đậu xe chờ của Shipper.
- **Trọng tâm Gameplay (Quản lý hàng đợi & Nhân sự đầu tiên):**
  - Mở khóa thực đơn mới: *Trà đào cam sả*, *Cà phê muối*, *Bánh mì que*.
  - **Cơ chế Đơn App & Shipper:** Shipper đến theo hàng đợi riêng (tối đa $3$ Shipper đứng chờ cùng lúc). Mỗi đơn Shipper gồm $2 - 4$ món và có đồng hồ đếm ngược **$45\text{s}$**. Giao kịp nhận thưởng tốc độ $+30\%$; trễ giờ bị đánh giá **1 sao** (trừ $2$ Điểm Uy Tín).
  - **Thuê Nhân viên Part-time đầu tiên:** Thuê *Bạn Sinh Viên Phụ Quán* (lương $40.000\text{đ}/\text{ngày}$) tự động pha các món cơ bản (Trà đá, Đen đá) và dọn bàn khi rảnh.
- **Biến cố đặc trưng:**
  - **Giờ cao điểm kẹt đơn (Flash Rush):** Nổ liên tiếp $4$ đơn Shipper cùng lúc.
  - **Hết ly nhựa / Hết đá đột xuất:** Buộc người chơi phải canh kho chủ động trước khung giờ 14:30.
- **Cột mốc chuyển giai đoạn:** Tích lũy đủ **$1.500.000\text{đ}$** + **60 Điểm Uy Tín** để thuê mặt bằng *Quán Nhỏ Trong Hẻm*.

---

### GIAI ĐOẠN 3: QUÁN NHỎ TRONG HẺM (Kinh doanh Không gian & Trải nghiệm)
- **Điều kiện mở khóa:** Đạt mốc Giai đoạn 2 (Tiền thuê mặt bằng: $120.000\text{đ}/\text{ngày}$ + Tiền điện máy lạnh $30.000\text{đ}/\text{ngày}$).
- **Quy mô vật lý:** Không gian trong nhà ấm cúng ($4$ bàn gỗ = $8 - 10$ chỗ ngồi), điều hòa, tủ bánh ngọt, góc decor sống ảo, kệ bán cà phê chai.
- **Trọng tâm Gameplay (Cân bằng Ghế ngồi & Tối ưu Doanh thu/Giờ):**
  - Mở khóa thực đơn cao cấp: *Matcha Latte*, *Bánh Tiramisu*, *Cà phê đóng chai mang về*.
  - **Bài toán "Sinh viên chạy deadline":** Nhóm khách *Sinh Viên* chỉ gọi $1$ ly nước rẻ nhưng ngồi chiếm bàn suốt $40\text{s}$ (tương đương 2 tiếng trong game) với thanh **Pin Laptop** trên đầu. Người chơi cần nâng cấp **Ổ cắm điện & Wi-Fi tốc độ cao** để tăng xác suất họ gọi thêm *Bánh Tiramisu* khi ngồi lâu.
  - **Hiệu ứng KOL / Reviewer:** Khi điểm Decor đạt mốc yêu cầu, *Reviewer / KOL* sẽ tới chụp ảnh góc sống ảo, kích hoạt trạng thái **"Viral trên TikTok"** (tăng $60\%$ lượng khách trong $90\text{s}$).
  - **Chế độ Chụp Ảnh Polaroid:** Cho phép người chơi chụp lại góc quán tự trang trí, lưu khung ảnh kỷ niệm kèm tên quán để nhận thưởng Hạt Vàng.
- **Biến cố đặc trưng:**
  - **Mất điện luân phiên buổi trưa:** Máy lạnh và máy pha tự động ngừng hoạt động trong $30\text{s}$; người chơi phải dùng phin nhôm pha tay và quạt tay để giữ chân khách.
- **Cột mốc chuyển giai đoạn:** Tích lũy đủ **$10.000.000\text{đ}$** + **200 Điểm Uy Tín** để mở khóa *Bản Đồ Việt Nam & Mở Chi Nhánh Đa Tỉnh*.

---

### GIAI ĐOẠN 4: CHUỖI CỬA HÀNG ĐA TỈNH & ĐẤU TRƯỜNG TỈNH THÀNH
- **Điều kiện mở khóa:** Đạt mốc Giai đoạn 3.
- **Trọng tâm Gameplay (Chiến lược Địa lý & Đua Top Cúp Phin Vàng):**
  - Mở khóa **Bản Đồ Việt Nam 2D**: Người chơi chọn mở chi nhánh tại các tỉnh thành chiến lược (*TP.HCM, Hà Nội, Đà Lạt, Huế/Đà Nẵng, Cần Thơ*) và chọn vị trí mặt bằng cụ thể (*Cổng Đại học, Khu Văn phòng, Hẻm Phố cổ, Điểm Du lịch*).
  - **Đặc sản & Khí hậu vùng miền:** Mỗi tỉnh mở khóa công thức đặc trưng (VD: *Cà phê trứng* ở Hà Nội, *Cà phê muối* ở Huế, *Trà Atiso đỏ* ở Đà Lạt) và thử thách riêng (sương mù Đà Lạt, triều cường Cần Thơ).
  - **Quản trị Nhân sự & Stamina:** Nhân viên có thanh **Năng lượng (Stamina)** và chỉ số **Tay nghề (Lv.1 – Lv.10)**. Khi Stamina thấp, nhân viên pha chậm và dễ làm đổ ly; người chơi bấm **"Khao cả team chầu trà sữa"** ($50.000\text{đ}$) để hồi đầy $100\%$ năng lượng và buff tốc độ $+25\%$.
  - **Đấu Trường "Cúp Phin Vàng Toàn Quốc":** Đóng góp điểm Uy tín và chuỗi "Chuẩn Gu" của các chi nhánh cho tỉnh quê hương để đua Top cuối tuần, nhận **Bảng hiệu Vàng** và **Trang phục vùng miền cho Mèo/Cún**.
- **Cột mốc chuyển giai đoạn:** Sở hữu tối thiểu **$3$ chi nhánh tỉnh thành** và **$50.000.000\text{đ}$** để xây dựng *Xưởng Rang Xay & Phòng R&D*.

---

### GIAI ĐOẠN 5: XƯỞNG RANG XAY & PHÒNG R&D (Làm chủ Chuỗi Cung Ứng & Công Nghệ)
- **Điều kiện mở khóa:** Đạt mốc Giai đoạn 4.
- **Trọng tâm Gameplay (Tự chủ Sản xuất & Sáng tạo Độc quyền):**
  - **Xưởng Rang Xay (Roastery):** Ngừng phụ thuộc giá nhập kho biến động. Người chơi thu mua hạt thô trực tiếp từ nông trại **Robusta Buôn Ma Thuột** (giá vốn thấp, vị đậm) hoặc **Arabica Cầu Đất** (hương thơm, bán giá cao), tự điều chỉnh mẻ rang (**Light / Medium / Dark**) để cung ứng nguyên liệu cho toàn bộ hệ thống chi nhánh, giúp **giảm $35\%$ chi phí vận hành**.
  - **Bàn Thí Nghiệm Công Thức (Recipe Lab):** Tự phối hợp 3 nguyên liệu `[Cốt nền] + [Topping] + [Kỹ thuật]` để khám phá $30+$ món ẩn (VD: *Trà mãng cầu giã tay*, *Cà phê dừa tuyết*), tự đặt tên món Signature và đẩy thành xu hướng Hot Trend toàn quốc.
  - **Cây Công Nghệ F&B (Tech Tree):** Dùng Điểm Nghiên Cứu mở khóa:
    - *Order QR tại bàn:* Khách tự quét mã gọi món, giải phóng $100\%$ nhân viên chạy bàn.
    - *Hệ thống ERP Kho tự động:* Tự động điều phối nguyên liệu giữa xưởng rang và các chi nhánh khi kho chạm ngưỡng $15\%$.
    - *Dây chuyền đóng chai Cold Brew:* Tạo nguồn doanh thu bán lẻ thụ động ngay cả khi quán đóng cửa.
- **Cột mốc chuyển giai đoạn:** Đạt **$200.000.000\text{đ}$** + **1.000 Điểm Uy Tín** + hoàn thành **3 món Signature đạt chuẩn xuất khẩu**.

---

### GIAI ĐOẠN 6: TẬP ĐOÀN CÀ PHÊ TOÀN CẦU (Nhượng Quyền Quốc Tế)
- **Điều kiện mở khóa:** Đạt mốc Giai đoạn 5.
- **Trọng tâm Gameplay (Vươn tầm Quốc tế & End-game Tự động hóa):**
  - Mở khóa bản đồ **Chi Nhánh Quốc Tế**: *Tokyo (Nhật Bản), Seoul (Hàn Quốc), Paris (Pháp), New York (Mỹ)*.
  - **Cơ chế Văn hóa & Bản địa hóa:**
    - Khách quốc tế lần đầu uống cà phê phin Việt Nam có thanh **"Độ say Caffeine"** (uống Robusta đậm đặc dễ bị mắt mở to ngạc nhiên đầy hài hước và để lại review 5 sao độc lạ).
    - **Rào cản ngôn ngữ:** Cần tuyển dụng hoặc đào tạo **Quản lý biết ngoại ngữ** cho từng chi nhánh nước ngoài để tránh giao nhầm món.
    - **Combo Văn hóa Việt:** Bán kèm *Phin nhôm lưu niệm*, *Bánh mì que* và *Cà phê hòa tan đóng hộp* giúp nhân đôi biên lợi nhuận ngoại tệ.
  - **Hệ thống Cổ Tức & Quản Lý Vĩ Mô:** Toàn bộ chuỗi cửa hàng trong nước và quốc tế tự động vận hành, tổng hợp báo cáo lợi nhuận theo phút về **Trụ sở Tập đoàn**, cho phép người chơi tập trung sưu tầm trọn bộ Decor di sản, trang phục linh vật và giữ vững ngôi vương trên Bảng Xếp Hạng Toàn Cầu.

---

## 3. KIẾN TRÚC THIẾT KẾ GIAO DIỆN DI ĐỘNG (UI/UX DESIGN SYSTEM 9:16)

### 3.1. Phân Tầng Không Gian Màn Hình (Z-Index & Safe-Area Layout)
Khung hiển thị luôn khóa tỷ lệ dọc **9:16** ($390 \times 844\text{px}$ chuẩn thiết kế, tự co giãn theo chiều cao màn hình và căn giữa có viền bo tròn `rounded-3xl` trên desktop), chia thành **5 tầng chức năng** không chồng lấn vùng chạm:

```text
┌──────────────────────────────────────────────┐
│ [Z-40] TOP HUD BAR (Cao 76px + Safe-Area)    │
│  [Icon Quán]  [Bảng Tên Quán + Giai Đoạn]    │
│  [Đồng hồ 08:30 ☀️]  [🪙 500k] [🫘 150] [⭐ 20]│
├──────────────────────────────────────────────┤
│ [Z-30] SUB-HUD KHO & SỰ KIỆN (Cao 44px)      │
│  [☕ 85%] [🧊 60%] [🥛 90%]   [📸 Polaroid]  │
│  (Thanh cảnh báo Mưa rào / Trật tự đô thị)   │
├──────────────────────────────────────────────┤
│                                              │
│ [Z-10] PHASER WORLD CANVAS (Chiếm ~58% màn)  │
│  - Nền vỉa hè / Kiosk / Quán hẻm đổi màu     │
│    theo chu kỳ Sáng - Trưa - Chiều - Tối     │
│  - Khách hàng + Bong bóng món + Thanh chờ    │
│  - Ghế/Bàn (Chạm dọn rác) + Linh vật Mèo/Cún │
│                                              │
├──────────────────────────────────────────────┤
│ [Z-25] BREW ACTION DOCK (Cao 110px)          │
│  [Khay Pha 3 Bước: Ly ➔ Sữa/Đường ➔ Đá]      │
│  [Thanh lực lắc/đánh bọt]  [⚡ Boost x2]     │
├──────────────────────────────────────────────┤
│ [Z-40] BOTTOM NAVIGATION (Cao 82px)          │
│  [Thực đơn] [Nâng cấp] [Decor] [Shop] [NVụ]  │
└──────────────────────────────────────────────┘
```

### 3.2. Hệ Thống Token Thẩm Mỹ (Cozy Tactile Style)
* **Bảng màu giao diện (UI Palette):**
  * **Nền giấy kem ấm (Surface Cream):** `#FFF3D6` (nền modal, thẻ card) và `#F6E5C0` (nền phụ).
  * **Viền nét vẽ tay (Ink Border):** `#4A3222` (`border-2` hoặc `border-[2.5px]` bo góc `rounded-2xl`), tạo cảm giác nét bút mực truyện tranh Việt Nam.
  * **Nút hành động chính (Primary CTA):** Xanh lá tán cây `#5C9E54` (viền dưới đậm `border-b-4 border-[#3D6E37]`, nhấn lún xuống `active:translate-y-0.5`).
  * **Nút cảnh báo / Sự kiện khẩn:** Đỏ ghế nhựa `#E04F4F` (rung nhẹ `animate-bounce` kèm hiệu ứng viền sáng).
  * **Điểm nhấn phụ / Take-away:** Xanh ngọc `#2EB8AC` và Vàng hổ phách `#F4A236`.
* **Typography & Khả năng đọc một tay:**
  * Dùng font bo tròn thân thiện (`Nunito` hoặc `Quicksand` hỗ trợ đầy đủ dấu tiếng Việt).
  * Mọi nút bấm tương tác trên điện thoại đều có kích thước tối thiểu **$44 \times 44\text{px}$** (chuẩn Thumb-Zone) để người chơi thao tác bằng một ngón cái dễ dàng.

### 3.3. Ngôn Ngữ Phản Hồi Thị Giác & Vi Tương Tác (Micro-Interactions)
1. **Phản hồi khi Pha chế "Chuẩn Gu! ✨":**
   - Ly nước phát hào quang vàng, bật chữ nổi **"CHUẨN GU +20% TIP!"** bay lên cùng chuỗi đồng xu rơi theo đường cong Bezier về góc phải `TopHUD`.
2. **Bong bóng Order Thông minh (Smart Order Bubble):**
   - Hiển thị tối đa **2 thông tin trực quan** trên đầu khách: `[Icon Món]` + `[Badge Ghi chú nhỏ]` (VD: `🧊-` nghĩa là Ít đá, `🥛+` nghĩa là Nhiều sữa, `🛍️` nghĩa là Mang đi), giúp người chơi liếc 0.5 giây là hiểu ngay không cần đọc chữ dài.
3. **Chuyển sắc Môi trường theo Thời gian thực (Ambient Lighting):**
   - **06:00 – 10:30:** Nắng sớm trong trẻo (tint vàng nhạt `0xFFFDF5`).
   - **10:30 – 14:30:** Nắng trưa rực (kèm icon nhiệt kế nhỏ trên thanh `iceStock`).
   - **14:30 – 18:00:** Hoàng hôn cam ấm (`0xFFE6C7`).
   - **18:00 – 22:00:** Phủ lớp tối dịu (`alpha 0.25`) và bật sáng đèn lồng / đèn dây tóc vàng ấm trong quán.
4. **Hiệu ứng Chuyển cảnh Chi nhánh (Stage 4–6):**
   - Khi chuyển đổi giữa các tỉnh thành hoặc chi nhánh quốc tế trên Bản đồ, dùng hiệu ứng đóng/mở **màn che bạt sọc xanh cam** kéo ngang mượt mà trong $0.4\text{s}$.

---

## 4. BẢNG TỔNG HỢP CÂN BẰNG KINH TẾ 6 GIAI ĐOẠN

| Giai đoạn | Tên gọi | Vốn mở khóa | Chi phí cố định / ngày | Giá bán TB / đơn | Cơ chế cốt lõi mở mới |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Stage 1** | Quán Cóc Vỉa Hè | $0\text{đ}$ (Mặc định) | $0\text{đ}$ | $15.000\text{đ}$ | Pha phin 3 bước, Dọn bàn bẩn, Mưa rào, Trật tự đô thị |
| **Stage 2** | Booth Take-Away | $250.000\text{đ}$ | $30.000\text{đ}$ | $25.000\text{đ}$ | Hàng đợi Shipper 45s, Thuê nhân viên Part-time đầu tiên |
| **Stage 3** | Quán Nhỏ Trong Hẻm | $1.500.000\text{đ}$ | $150.000\text{đ}$ | $38.000\text{đ}$ | Quản lý chỗ ngồi, Pin laptop sinh viên, KOL Viral, Polaroid |
| **Stage 4** | Chuỗi Đa Tỉnh | $10.000.000\text{đ}$ | $450.000\text{đ}$ | $45.000\text{đ}$ | Bản đồ VN, Chọn mặt bằng, Đấu trường Cúp Phin Vàng, Stamina |
| **Stage 5** | Xưởng Rang & R&D | $50.000.000\text{đ}$ | $1.200.000\text{đ}$ | $55.000\text{đ}$ | Rang hạt BMT/Cầu Đất (-35% giá vốn), Recipe Lab, Tech Tree |
| **Stage 6** | Tập Đoàn Toàn Cầu | $200.000.000\text{đ}$ | $3.500.000\text{đ}$ | $95.000\text{đ}$ | Chi nhánh Tokyo/Seoul/Paris/NY, Quản lý ngoại ngữ, Cổ tức |

---

## 5. LƯỢC ĐỒ DỮ LIỆU TYPESCRIPT MỞ RỘNG (`src/types/realism.ts`)

```typescript
export type StageId = 1 | 2 | 3 | 4 | 5 | 6;
export type OrderModifier = 'normal' | 'less_ice' | 'more_milk' | 'no_sugar' | 'take_away';
export type TimeOfDay = 'MORNING' | 'NOON' | 'AFTERNOON' | 'EVENING';
export type RoastLevel = 'LIGHT' | 'MEDIUM' | 'DARK';
export type BeanOrigin = 'robusta_bmt' | 'arabica_caudat';
export type ProvinceId = 'hcm' | 'hanoi' | 'dalat' | 'hue_danang' | 'cantho';
export type GlobalCityId = 'tokyo' | 'seoul' | 'paris' | 'newyork';
export type SpotType = 'university' | 'office' | 'alley' | 'tourist';

export interface SeatState {
  index: number;
  status: 'EMPTY' | 'OCCUPIED' | 'DIRTY';
  customerId: string | null;
  hasPowerOutlet: boolean; // Dùng cho Stage 3 (Sinh viên sạc laptop)
}

export interface InventoryStock {
  coffeeStock: number; // 0 - 100
  iceStock: number;    // 0 - 100
  milkStock: number;   // 0 - 100
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'barista' | 'cleaner' | 'roaster' | 'global_manager';
  skillLevel: number; // 1 - 10
  stamina: number;    // 0 - 100
  dailyWage: number;
  knowsForeignLanguage?: boolean;
}

export interface BranchState {
  id: string;
  locationId: ProvinceId | GlobalCityId;
  isInternational: boolean;
  spotType: SpotType;
  branchName: string;
  unlocked: boolean;
  netIncomePerMin: number;
  assignedManagerId: string | null;
}

export interface RoasteryState {
  unlocked: boolean;
  selectedOrigin: BeanOrigin;
  roastLevel: RoastLevel;
  roastedBeanReserve: number; // Giảm 35% chi phí nhập kho toàn chuỗi khi > 0
}

export interface SignatureRecipe {
  id: string;
  customName: string;
  baseIngredient: string;
  toppingIngredient: string;
  technique: string;
  sellPrice: number;
  trendingDaysLeft: number;
}

export interface ProvincialLeagueState {
  homeProvinceId: ProvinceId;
  weeklyScore: number;
  provinceRank: number;
  unlockedRegionalSkins: string[];
}

export interface DailyReport {
  dayNumber: number;
  stage: StageId;
  revenue: number;
  tips: number;
  supplyCost: number;
  fixedCost: number; // Thuê mặt bằng + điện + lương nhân viên
  penalties: number;
  netProfit: number;
  perfectOrdersCount: number;
  reviewStars: number;
  reviewComment: string;
}
```

---

## 6. LỘ TRÌNH PROMPT TRIỂN KHAI TỪNG PHẦN CHO GOOGLE ANTIGRAVITY

### Phần 1 — Giao Diện 9:16 & Lõi Chân Thực Stage 1–3 (`BrewMiniPanel`, Bàn bẩn, Kho, Chu kỳ Ngày/Đêm)
```text
Đọc `.agent/PROJECT_MAP.md`, `.agent/PROGRESS.md` và mục 1, mục 2 (Stage 1–3), mục 3, mục 5 trong `docs/REALISM_ADDON_SPEC.md`. Tuân thủ `.agent/rules/game-rules.md` và skill `lean-coding`.

Hãy triển khai giao diện chuẩn 9:16 và lớp cơ chế chân thực cho Giai đoạn 1–3:
1. Tạo `src/types/realism.ts` theo đúng lược đồ dữ liệu trong đặc tả.
2. Tinh chỉnh UI layout di động 9:16 theo mục 3 (TopHUD, Sub-HUD thanh kho `coffeeStock`/`iceStock`/`milkStock` + đồng hồ ngày, Brew Action Dock 3 bước, BottomNav 5 tab với nút bấm chuẩn Cozy viền mực `#4A3222`).
3. Cập nhật `Customer.ts` và `BrewMiniPanel.tsx`: gắn ngẫu nhiên `OrderModifier` (`normal`, `less_ice`, `more_milk`, `no_sugar`, `take_away`) kèm badge trực quan trên bong bóng order; cho phép thao tác 3 bước pha chế và thưởng +20% tip "Chuẩn Gu!" khi khớp 100%.
4. Cập nhật `CafeScene.ts`: thêm trạng thái bàn bẩn `DIRTY` (chạm dọn sạch và nhặt tiền lẻ rơi), hiệu ứng ánh sáng Sáng-Trưa-Chiều-Tối, Pin Laptop sinh viên ở Stage 3 và popup `DailyReportModal.tsx` hạch toán lãi/lỗ cuối ngày.

Chạy skill `verify-build` (`npm run build` 0 lỗi, kiểm tra Console), sau đó cập nhật `.agent/PROJECT_MAP.md` và `.agent/PROGRESS.md`.
```

### Phần 2 — Bản Đồ Việt Nam, Đấu Trường Tỉnh Thành & Nhân Sự (Stage 4)
```text
Đọc `.agent/PROJECT_MAP.md`, `.agent/PROGRESS.md` và mục 2 (Stage 4) trong `docs/REALISM_ADDON_SPEC.md`. Tuân thủ `.agent/rules/game-rules.md` và skill `lean-coding`.

Hãy triển khai hệ thống Giai đoạn 4 (Chuỗi Đa Tỉnh & Đấu Trường Tỉnh Thành):
1. Tạo `VietnamMapModal.tsx`: cho phép chọn tỉnh khởi nghiệp/mở chi nhánh (`hcm`, `hanoi`, `dalat`, `hue_danang`, `cantho`) và chọn vị trí mặt bằng (`university`, `office`, `alley`, `tourist`) với hệ số khách, món đặc sản và tiền thuê mặt bằng riêng.
2. Tạo `ProvincialLeagueModal.tsx`: hiển thị Đấu Trường "Cúp Phin Vàng Toàn Quốc", điểm đóng góp của người chơi cho tỉnh quê hương và phần thưởng trang phục vùng miền cho linh vật Mèo/Cún.
3. Nâng cấp hệ thống Nhân sự (`StaffPanel.tsx`): thêm thanh năng lượng `stamina`, chỉ số `skillLevel` và nút "Khao cả team chầu trà sữa" hồi phục 100% Stamina + buff tốc độ.

Chạy skill `verify-build`, sau đó cập nhật `.agent/PROJECT_MAP.md` và `.agent/PROGRESS.md`.
```

### Phần 3 — Xưởng Rang Xay, Phòng R&D & Tập Đoàn Toàn Cầu (Stage 5–6)
```text
Đọc `.agent/PROJECT_MAP.md`, `.agent/PROGRESS.md` và mục 2 (Stage 5–6) trong `docs/REALISM_ADDON_SPEC.md`. Tuân thủ `.agent/rules/game-rules.md` và skill `lean-coding`.

Hãy triển khai hoàn thiện End-game Giai đoạn 5 và Giai đoạn 6:
1. Tạo `RndAndRoasteryModal.tsx`:
   - Tab Xưởng Rang Xay: chọn hạt `robusta_bmt` hoặc `arabica_caudat`, canh mức rang `LIGHT/MEDIUM/DARK` để tự cung ứng hạt giảm 35% chi phí kho toàn chuỗi.
   - Tab Phòng R&D: phối 3 nguyên liệu tạo món Signature đặt tên riêng và nâng cấp Cây Công Nghệ (`QR Order`, `ERP Kho tự động`, `Dây chuyền Cold Brew`).
2. Mở rộng bản đồ sang Giai đoạn 6 (`tokyo`, `seoul`, `paris`, `newyork`): yêu cầu phân công `global_manager` biết ngoại ngữ, bán combo Phin + Bánh mì que ngoại tệ và tổng hợp cổ tức thụ động về quỹ tổng.

Chạy skill `verify-build`, sau đó cập nhật `.agent/PROJECT_MAP.md` và `.agent/PROGRESS.md`.
```