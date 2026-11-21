# TIỆM CÀ PHÊ BẤT ỔN — TỪ VỈA HÈ ĐẾN CHUỖI ĐẾ CHẾ!
## MASTER GAME DESIGN DOCUMENT (GDD) & 6-PHASE DEVELOPMENT ROADMAP

* **Tên Dự Án:** Tiệm Cà Phê Bất Ổn (Unstable Cafe / Cozy Saigon Sidewalk Tycoon)
* **Phiên Bản Tài Liệu:** v2.0.0 — Master Production Specification
* **Công Nghệ Cốt Lõi:** Vite v6.4, React 19.1.0, Tailwind CSS v4.1.8, Phaser 3.87.0, Zustand 5.0.5, Web Audio API / Howler.js
* **Nền Tảng Đích:** Responsive Dual-View Web (PC 16:9 Landscape & Mobile 9:16 Portrait) -> Native Mobile (iOS/Android via Capacitor)
* **Tác Giả & Đơn Vị Phát Triển:** Teamwork Game Design & Architecture Committee

---

## MỤC LỤC TỔNG QUAN

1. [CHƯƠNG 1: TỔNG QUAN DỰ ÁN & HIGH CONCEPT](#chương-1-tổng-quan-dự-án--high-concept)
2. [CHƯƠNG 2: BÁO CÁO BENCHMARK ĐỐI SÁNH TRỰC QUAN 6 TỰA GAME THAM CHIẾU](#chương-2-báo-cáo-benchmark-đối-sánh-trực-quan-6-tựa-game-tham-chiếu)
3. [CHƯƠNG 3: BỘ QUY CHUẨN NGHỆ THUẬT, BẢNG MÀU, TYPOGRAPHY & PHẢN HỒI XÚC GIÁC ASMR](#chương-3-bộ-quy-chuẩn-nghệ-thuật-bảng-màu-typography--phản-hồi-xúc-giác-asmr)
4. [CHƯƠNG 4: ĐẶC TẢ WIREFRAME & BỐ CỤC DUAL-VIEW (PC 16:9 VS MOBILE 9:16)](#chương-4-đặc-tả-wireframe--bố-cục-dual-view-pc-169-vs-mobile-916)
5. [CHƯƠNG 5: HỆ THỐNG TIẾN TRÌNH GAMEPLAY 6 GIAI ĐOẠN CHI TIẾT](#chương-5-hệ-thống-tiến-trình-gameplay-6-giai-đoạn-chi-tiết)
6. [CHƯƠNG 6: HỆ THỐNG BIẾN CỐ BẤT TRẮC ĐỜI THỰC (HAZARDS & CRISES)](#chương-6-hệ-thống-biến-cố-bất-trắc-đời-thực-hazards--crises)
7. [CHƯƠNG 7: CƠ CHẾ TƯƠNG TRỢ CỘNG ĐỒNG ĐỜI THỰC (SOLIDARITY RESCUE MECHANICS)](#chương-7-cơ-chế-tương-trợ-cộng-đồng-đời-thực-solidarity-rescue-mechanics)
8. [CHƯƠNG 8: MÔ HÌNH TOÁN HỌC CÂN BẰNG KINH TẾ (BALANCING MODEL)](#chương-8-mô-hình-toán-học-cân-bằng-kinh-tế-balancing-model)
9. [CHƯƠNG 9: KẾ HOẠCH TRIỂN KHAI KỸ THUẬT THEO TỪNG GIAI ĐOẠN (TECH ROADMAP)](#chương-9-kế-hoạch-triển-khai-kỹ-thuật-theo-từng-giai-đoạn-tech-roadmap)
10. [CHƯƠNG 10: TIÊU CHUẨN SẢN XUẤT, KIỂM THỬ & BẢO ĐẢM CHẤT LƯỢNG](#chương-10-tiêu-chuẩn-sản-xuất-kiểm-thử--bảo-đảm-chất-lượng)

---

# CHƯƠNG 1: TỔNG QUAN DỰ ÁN & HIGH CONCEPT

## 1.1. Tầm Nhìn Sản Phẩm (Vision & High Concept)
**"Tiệm Cà Phê Bất Ổn"** là tựa game mô phỏng kinh doanh (Tycoon / Simulation) kết hợp tương tác xúc giác ASMR đậm đà bản sắc văn hóa đường phố Việt Nam. 

Người chơi vào vai một bạn trẻ khởi nghiệp từ con số không tròn trĩnh: một chiếc thùng đá móp méo, vài chiếc ghế nhựa xanh đỏ dưới bóng mát tán cây bàng Sài Gòn, một chiếc phin nhôm truyền thống và tấm biển gỗ viết phấn mộc mạc *"Cà phê sữa đá 15k - Trà đá miễn phí"*. Người chơi sẽ trải nghiệm trọn vẹn sự hối hả, náo nhiệt, những tình huống bất trắc "dở khóc dở cười" của đời sống vỉa hè, dần tích lũy vốn liếng để nâng cấp qua 6 nấc thang kinh doanh thực thụ:
$$\text{Quán Cóc Vỉa Hè} \longrightarrow \text{Kiosk Take-Away} \longrightarrow \text{Quán Nhỏ Trong Hẻm} \longrightarrow \text{Flagship 2 Tầng} \longrightarrow \text{Xưởng Rang Xay} \longrightarrow \text{Chuỗi Toàn Cầu}$$

## 1.2. Bốn Trụ Cột Trải Nghiệm Cốt Lõi (Core Pillars)
1. **Âm Thanh Xúc Giác ASMR Thư Giãn (Tactile Brewing ASMR):** Mọi thao tác pha chế — từ tiếng nước sôi rót vào phin róc rách, tiếng sữa đặc Ông Thọ sánh mịn đổ xuống đáy ly, tiếng đá bi rơi lách cách đến tiếng muỗng inox khuấy xoáy vào thành ly thủy tinh — đều mang lại cảm giác thỏa mãn thính giác và xúc giác sâu sắc.
2. **Sự Bất Ổn Chân Thực & Hài Hước (Authentic Sidewalk Hazards):** Không giống các game tycoon phương Tây êm đềm, quán cà phê vỉa hè Việt Nam luôn đối mặt với những biến số bất ngờ: mưa rào ngập lề đường, xe trật tự đô thị tuần tra, bão giá nguyên liệu chợ đầu mối, cúp điện giờ trưa, và áp lực đòi nợ đáo hạn.
3. **Tình Làng Nghĩa Xóm & Tương Trợ Đời Thực (Community Solidarity):** Khi người chơi rơi vào nguy cơ phá sản, game không trừng phạt bằng màn hình Game Over lạnh lùng, mà kích hoạt nét đẹp tình người Sài Gòn: Chú Ba xe ôm cho vay vốn xoay vòng 0% lãi, Cô Bảy tạp hóa cho mượn góc vỉa hè né đô thị, bạn thân chạy xe máy tới phụ quán giờ cao điểm, và khách ruột đứng ra bảo vệ uy tín tiệm.
4. **Vòng Tiến Hóa Đa Tầng Sâu Sắc (Deep Multi-Tier Progression):** Game kết hợp mượt mà giữa tương tác thủ công ở giai đoạn đầu (Active Play) và hệ thống tự động hóa nhàn rỗi (Idle Automation) ở giai đoạn sau, phát triển từ kỹ năng cá nhân lên năng lực quản trị chuỗi cung ứng B2B và nhượng quyền quốc tế.

## 1.3. Định Vị Thị Trường & Khán Giả Mục Tiêu
* **Thị trường sơ cấp:** Việt Nam (thế hệ Gen Z, dân văn phòng, học sinh, người yêu văn hóa cà phê vỉa hè). Game tối ưu để tạo meme tự nhiên trên TikTok, Threads, Facebook Reels thông qua các câu thoại đố mẹo, tình huống trốn đô thị và chế độ chụp ảnh kỷ niệm Polaroid.
* **Thị trường thứ cấp:** Cộng đồng kiều bào và người chơi quốc tế yêu thích dòng game Cozy Indie (Good Pizza Great Pizza, Coffee Talk, Boba Story), mong muốn khám phá văn hóa ẩm thực Việt Nam.

---

# CHƯƠNG 2: BÁO CÁO BENCHMARK ĐỐI SÁNH TRỰC QUAN 6 TỰA GAME THAM CHIẾU

Để xây dựng một trải nghiệm đỉnh cao, dự án đã tiến hành nghiên cứu đối sánh chuyên sâu 6 tựa game mô phỏng và tycoon tiêu biểu trên toàn cầu:

```
                       BENCHMARK 6 TỰA GAME THAM CHIẾU
                                      │
    ┌──────────────────┬──────────────┼──────────────┬──────────────────┐
    ▼                  ▼              ▼              ▼                  ▼
[Good Pizza GP]  [Coffee Talk]  [Cat Snack Bar] [Boba Story]    [Rent Please!]  [Kairosoft]
(Pha chế xúc giác) (Storytelling) (Micro-Idle Flow)(Tùy biến Decor)(Hạ tầng bậc thang)(Combo & Chỉ số)
```

### 2.1. Phân Tích Chi Tiết Từng Tựa Game

#### 1. Good Pizza, Great Pizza (Nhà phát triển: TapBlaze)
* **Đặc trưng UI/UX nổi bật:**
  * *Bàn làm việc góc nhìn thứ nhất (First-person Counter View):* Người chơi trực tiếp cán bột, rải sốt, rắc phô mai và nướng bánh.
  * *Hệ thống đơn hàng đố mẹo (Riddle Orders):* Khách không gọi thẳng tên món mà đưa ra câu đố ("Cho tôi một chiếc bánh như một buổi hoàng hôn bên bờ biển").
  * *Thanh kiên nhẫn biểu cảm (Dynamic Patience Meter):* Tụt dần theo thời gian thực kèm biểu cảm mặt khách thay đổi từ hào hứng sang cau có.
  * *Kênh thời sự PNN News:* Mở đầu ngày mới bằng bản tin hoạt họa dí dỏm, thông báo biến động thị trường hoặc đối thủ mới.
* **Bài học áp dụng cho Tiệm Cà Phê Bất Ổn:**
  * Xây dựng trạm pha chế xúc giác 4 bước (Ủ phin -> Sữa đặc -> Đá bi -> Khuấy).
  * Khách hàng vỉa hè có câu order đố vui: *"Cho ly cà phê nhìn thấy đáy lòng"* (cà phê đen ít đường), *"Bạc xỉu nhưng đừng để anh xỉu vì ngọt"* (bạc xỉu ít sữa).
  * Bản tin "Thời Sự Hẻm 7h Tối" tổng kết chi phí nguyên liệu và dự báo mưa ngập hôm sau.

#### 2. Coffee Talk (Nhà phát triển: Toge Productions)
* **Đặc trưng UI/UX nổi bật:**
  * *Không khí Cozy Lo-Fi tĩnh lặng:* Bối cảnh quán cà phê đêm mưa Seattle, ánh đèn vàng ấm, tiếng mưa rơi trên mái kính.
  * *Pha chế dẫn dắt cốt truyện (Narrative Brewing):* Đồ uống người chơi pha quyết định tâm trạng và diễn biến cuộc đời khách hàng.
  * *Khám phá công thức tự do (Freeform Recipe Discovery):* Hệ thống kết hợp 3 khay thành phần (Base + Primary + Secondary) để người chơi tự mày mò công thức ẩn.
* **Bài học áp dụng cho Tiệm Cà Phê Bất Ổn:**
  * Thiết lập bảng màu pastel hoài niệm kết hợp BGM Lo-Fi đường phố (tiếng còi xe Cub xa xăm, tiếng chuông hàng rong).
  * Hệ thống pha chế sáng tạo: Kết hợp Cà phê Robusta + Sữa đặc + Muối biển tinh luyện để mở khóa món ẩn *"Cà Phê Muối Hoàng Gia"*.
  * Cốt truyện khách quen: Mảnh đời Chú Ba, Cô Tư vé số dần hé lộ qua từng ly nước pha chuẩn vị.

#### 3. Cat Snack Bar (Nhà phát triển: TREEPLLA)
* **Đặc trưng UI/UX nổi bật:**
  * *Quy trình trạm làm việc siêu tinh gọn (Micro-Station Workflow):* Nhận đơn -> Trạm nấu -> Trạm đóng gói -> Phục vụ -> Thu tiền -> Nâng cấp.
  * *Phản hồi nảy bật cực đã (Juicy & Bouncy Feedback):* Tiền xu bắn lên như suối, icon trái tim bay phấp phới, nhân vật lắc lư vui nhộn.
  * *Giao diện công thái học 1 ngón tay (One-Thumb Portrait UI):* Toàn bộ thao tác nâng cấp và điều hướng nằm gọn trong vùng với của ngón cái.
* **Bài học áp dụng cho Tiệm Cà Phê Bất Ổn:**
  * Tối ưu hóa layout dọc Mobile 9:16 với Bottom Navigation bo tròn sát đáy.
  * Hiệu ứng tiền xu bay uốn lượn (Coin Splatter Tween) từ bàn khách bay vào biểu tượng ví tiền trên TopHUD kèm âm thanh kim loại leng keng.
  * Tự động hóa nhân viên phụ quán từ Giai đoạn 2 để người chơi tận hưởng nhịp độ idle thư giãn.

#### 4. Boba Story (Nhà phát triển: MafiaCat Studios)
* **Đặc trưng UI/UX nổi bật:**
  * *Tùy biến ly nước phong phú (Whimsical Drink Customizer):* Chọn hình dáng ly, nắp đậy tai mèo, ống hút xoắn, loại trân châu đổi màu.
  * *Trang trí nội ngoại thất ấm cúng (Cozy Decor System):* Cho phép sắm sửa từng chậu cây, tấm thảm, bóng đèn.
  * *Mini-game luyện thành phần (Magic Den):* Cơ chế kết hợp nguyên liệu bí mật tạo hương vị mới.
* **Bài học áp dụng cho Tiệm Cà Phê Bất Ổn:**
  * Tùy biến ly nước thuần Việt: Ly thủy tinh sọc khía cổ điển, ly nhựa mang đi in logo quán, quai cói thân thiện môi trường.
  * Hệ thống decor vỉa hè: Biển hiệu gỗ khắc tay, bạt sọc dưa che mưa, ghế nhựa Duy Tân, giàn hoa giấy Sài Gòn, đèn lồng Hội An.
  * Thú cưng hộ mệnh: Cún Vàng nằm ngủ (buff +15% thời gian kiên nhẫn cho khách), Mèo Mướp canh xe (tự gom tiền tip).

#### 5. Rent Please! Landlord Sim (Nhà phát triển: ShimmerGames)
* **Đặc trưng UI/UX nổi bật:**
  * *Tiến trình phân khu độc lập (Zone Expansion Progression):* Người chơi mở từng căn hộ, khu dịch vụ, tiện ích công cộng.
  * *Hạ tầng kỹ thuật leo thang (Escalating Infrastructure):* Phải nâng cấp trạm điện, đường ống nước, xử lý rác để đáp ứng nhu cầu cư dân.
  * *Khách phàn nàn trực quan:* Khi mất điện hoặc thiếu tiện ích, icon tức giận đỏ rực xuất hiện trên đầu nhân vật.
* **Bài học áp dụng cho Tiệm Cà Phê Bất Ổn:**
  * Lộ trình mở rộng không gian vật lý từ 4 ghế cóc vỉa hè -> quầy booth -> quán máy lạnh -> toà nhà 2 tầng -> xưởng sản xuất.
  * Sự cố hạ tầng đô thị: Mất điện cúp máy lạnh, nghẹt cống ngập nước, thùng đá bi tan chảy do nắng gắt.
  * Nhu cầu khách hàng phân tầng: Sinh viên cần ổ cắm Wi-Fi, KOL cần ánh sáng sống ảo, doanh nhân cần không gian yên tĩnh.

#### 6. Kairosoft Tycoon Series (Cafeteria Nipponica, Game Dev Story)
* **Đặc trưng UI/UX nổi bật:**
  * *Hệ thống chỉ số chiều sâu (Deep Stat Matrix):* Món ăn có điểm Hương vị (Taste), Mùi thơm (Aroma), Ngoại quan (Appearance).
  * *Chỉ số nhân viên & đào tạo (Staff Dexterity & Speed):* Nhân sự có tốc độ chạy bàn, độ khéo tay và sự thân thiện.
  * *Cuộc thi tay nghề & bảng xếp hạng:* Tham gia hội thi ẩm thực khu vực để thăng hạng sao Michelin.
* **Bài học áp dụng cho Tiệm Cà Phê Bất Ổn:**
  * 4 chỉ số chất lượng đồ uống: Đậm đà, Độ béo ngọt, Độ lạnh, Hương thơm.
  * Hệ thống đào tạo nhân sự từ sinh viên part-time thành Trưởng quầy Barista.
  * Hội thi "Pha Phin Vàng Sài Gòn" giúp thăng hạng uy tín quán từ Hạng Phường lên Hạng Thành Phố và Di Sản Toàn Cầu.

### 2.2. Bảng Tổng Hợp Đối Sánh & Quyết Định Thiết Kế

| Tựa Game | Yếu Tố Benchmark Trọng Tâm | Điểm Giới Hạn Cần Khắc Phục | Giải Pháp Cải Tiến Của "Tiệm Cà Phê Bất Ổn" |
| :--- | :--- | :--- | :--- |
| **Good Pizza** | Pha chế xúc giác bàn làm việc | Góc nhìn 1st person che khuất không gian quán | **Hybrid 2-Layer View:** Nửa trên hiển thị phố xá khách ngồi, nửa dưới là trạm pha chế trượt mượt mà. |
| **Coffee Talk** | Cốt truyện sâu lắng, nhạc Lo-fi | Lối chơi nặng đọc thoại (Visual Novel), ít yếu tố kinh tế | **Kết hợp cốt truyện vào Tycoon:** Câu thoại ngắn gọn 1-2 dòng dạng Comic Bubble, không ngắt quãng nhịp bán hàng. |
| **Cat Snack Bar** | Micro-idle flow, nhịp phục vụ nhanh | Lối chơi lặp lại, thiếu chiều sâu biến cố xã hội | **Đưa văn hóa đời thực vào:** Thêm 6 biến cố bất trắc (mưa rào, trật tự đô thị, bão giá) và 4 cơ chế cứu trợ xóm giềng. |
| **Boba Story** | Decor dễ thương, tùy biến ly | Chỉ số decor đơn giản, không tác động nhiều đến gameplay | **Decor gắn với Điểm Sống Ảo (★):** Điểm sống ảo quyết định tần suất xuất hiện của KOL, Reviewer và mở khóa Giai đoạn mới. |
| **Rent Please!** | Nâng cấp phân tầng hạ tầng | Giao diện trên PC bị kéo dãn, quản lý vi mô phức tạp | **Responsive Dual-View:** Mobile tập trung ngón cái, PC mở rộng thành 3-Column Tycoon Cockpit chuyên nghiệp. |
| **Kairosoft** | Hệ thống chỉ số kinh tế chuyên sâu | Đồ họa pixel cổ điển kén người chơi trẻ | **Nghệ thuật 2D Hand-drawn Cozy:** Giữ trọn chiều sâu toán học Kairosoft nhưng khoác lên lớp áo minh họa ấm cúng, dễ thương. |

---

# CHƯƠNG 3: BỘ QUY CHUẨN NGHỆ THUẬT, BẢNG MÀU, TYPOGRAPHY & PHẢN HỒI XÚC GIÁC ASMR

## 3.1. Phong Cách Nghệ Thuật (Art Style Direction)
* **Định nghĩa phong cách:** 2D Hand-drawn Cozy Vector Illustration (Minh họa vẽ tay vector ấm áp), kết hợp đường viền hữu cơ màu nâu cà phê sẫm mỏng 1.5px – 2px (Warm Organic Outlines).
* **Góc nhìn không gian:** Cắt lớp đa tầng (Layered 2.5D Isometric nhẹ). Không gian quán được thể hiện chân thực với các chi tiết quen thuộc: vỉa hè gạch men hoài cổ, bóng râm tán cây bàng, bảng gỗ viết phấn viền cong, cốc thủy tinh sọc khía có quai.
* **Hệ thống ánh sáng 4 pha trong ngày (4-Phase Day Cycle Dynamic Lighting):**
  1. *Sáng sớm (06:00 – 10:00 - Morning Golden Hour):* Ánh sáng vàng mật ong dịu nhẹ xuyên qua kẽ lá, bóng đổ dài mềm mại.
  2. *Trưa nắng gắt (11:00 – 14:00 - Harsh Noon Sun):* Ánh sáng rực rỡ, độ tương phản cao, bóng đổ tròn gắt dưới chân ghế nhựa, không khí có hiệu ứng sóng nhiệt lấp lánh.
  3. *Chiều mưa rào (15:00 – 17:00 - Saigon Afternoon Downpour):* Bầu trời chuyển xám xanh trầm buồn lãng mạn, hạt mưa rơi xiên, mặt đường phản chiếu ánh đèn xe lóng lánh.
  4. *Tối lên đèn (18:00 – 22:00 - Cozy Lantern Night):* Ánh sáng vàng cam ấm áp tỏa ra từ dây bóng đèn tròn và đèn lồng Hội An, không gian lắng đọng và thư thái.

## 3.2. Bảng 12 Mã Màu Quy Chuẩn (Standardized 12-Color Semantic Palette)

Tất cả các thành phần đồ họa Canvas và giao diện UI React/Tailwind v4 phải tuân thủ nghiêm ngặt 12 mã màu semantic dưới đây:

| STT | Tên Màu Chuẩn | Mã Hex | Nhóm Semantic | Vị Trí Áp Dụng Trong Game & UI |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **Robusta Dark** | `#2D1B0E` | Main Shell / Dark Bg | Nền desktop bên ngoài, viền ngoài HUD, text tiêu đề có độ tương phản cao trên nền sáng. |
| **2** | **Roasted Coffee** | `#4A2E1B` | Secondary Container | Nền thẻ card sản phẩm, thanh điều hướng chân trang (BottomNav), nền bảng phím tắt PC. |
| **3** | **Warm Phin Brown** | `#6F4E37` | Border / Divider | Viền khung modal, đường phân cách hóa đơn, màu gỗ bàn ghế và quầy pha chế phin. |
| **4** | **Caramel Swirl** | `#D4A373` | Highlight / Accent Warm | Nút bấm phụ, viền tab active, hiệu ứng ánh sáng sóng sánh bề mặt cà phê sữa. |
| **5** | **Condensed Milk Cream** | `#FFF3D6` | Canvas Background / Paper | Nền chính canvas game vỉa hè, nền hóa đơn tổng kết ca bán, popup card giấy xi-măng. |
| **6** | **Pure Milk Foam** | `#FDFBF7` | Light Surface / Text High | Lớp bọt sữa béo, text hiển thị trên nền tối, viền sáng nút bấm và điểm bắt sáng ly nước. |
| **7** | **Saigon Stool Red** | `#E04F4F` | Urgent / Warning / Red Stool | Ghế nhựa đỏ, nút cảnh báo xe trật tự/đòi nợ, thanh kiên nhẫn khi sắp cạn (<30%). |
| **8** | **Saigon Stool Teal** | `#2EB8AC` | Cool / Action Primary / Teal Stool | Ghế nhựa xanh ngọc, nút hành động chính, tab mở thực đơn, hiệu ứng đồ uống đá lạnh. |
| **9** | **Ong Tho Golden** | `#FFD700` | Soft Currency / Perfect Spark | Icon Tiền Xu (VNĐ), sao đánh giá, viền hộp quà, hiệu ứng Perfect khi pha chế chính xác. |
| **10**| **Golden Bean Amber** | `#F39C12` | Hard Currency / Premium | Icon Hạt Cà Phê Vàng, gói mua sắm IAP cao cấp, tính năng tự động hóa đặc quyền. |
| **11**| **Canopy Green** | `#5C9E54` | Success / Nature / Margin | Tán lá cây bàng, chỉ số lợi nhuận dương (+VNĐ), thanh kiên nhẫn an toàn (>60%). |
| **12**| **Shipper Orange** | `#F3722C` | Notification / App Order | Áo khoác shipper, viền thông báo đơn hàng app khẩn cấp, viền bạt sọc dưa che mưa. |

## 3.3. Quy Chuẩn Typography & Phông Chữ

Giao diện sử dụng hệ thống phông chữ tối ưu hiển thị tiếng Việt, không bị lỗi dấu (glyph-safe):
1. **Tiêu Đề & Thương Hiệu (Display Headers):**
   * *Phông chữ:* `Montserrat Black` hoặc `Be Vietnam Pro ExtraBold`.
   * *Kích thước:* 18px – 24px (Mobile), 22px – 28px (PC).
   * *Định dạng:* In hoa (UPPERCASE), đổ bóng nhẹ viền chìm: `drop-shadow(0 2px 4px rgba(45,27,14,0.4))`.
2. **Nội Dung & Câu Thoại Khách Hàng (Body Text & Dialogue):**
   * *Phông chữ:* `Inter Medium` hoặc `Quicksand SemiBold`.
   * *Kích thước:* 12px – 14px (Mobile), 13px – 15px (PC). Chiều cao dòng: `line-height: 1.45`.
   * *Màu chữ:* `#2D1B0E` (trên nền giấy kem `#FFF3D6`), `#FFF3D6` (trên nền gỗ sẫm `#4A2E1B`).
3. **Chỉ Số Tài Chính & Tiền Tệ (Numbers & Monospace):**
   * *Phông chữ:* `JetBrains Mono ExtraBold` hoặc `Space Mono`.
   * *Quy cách hiển thị:* Luôn có dấu chấm phân cách hàng nghìn và ký hiệu đơn vị rõ ràng (Ví dụ: `15.000đ`, `+350.000đ`, `25 ★`, `12 Hạt`).

## 3.4. Hệ Thống Phản Hồi Xúc Giác & Âm Thanh ASMR (Tactile Feedback)
* **Micro-interaction Chạm (Spring Physics):** Mọi nút bấm và vật thể tương tác (ghế, ly nước, thú cưng) khi bấm co nhẹ `scale: 0.95` trong 80ms, sau đó nảy bật `scale: 1.05 -> 1.0` theo đường cong đàn hồi.
* **Hiệu Ứng Tiền Xu Bay (Coin Splatter Tween):** Khi hoàn tất phục vụ đơn hàng, 5–8 đồng xu vàng `#FFD700` bung tỏa hình nan quạt từ bàn khách, sau đó uốn cong bay thẳng vào ví tiền trên TopHUD kèm âm thanh kim loại leng keng `sfx_coin_fountain`.
* **Thanh Kiên Nhẫn Động (Dynamic Fluid Patience Meter):** Thanh tiến trình hình viên thuốc nhỏ nổi trên đầu khách với 3 trạng thái màu sắc và vi biểu cảm:
  * *Xanh lá `#5C9E54` (100% – 60%):* Khách mỉm cười, rung đùi thư giãn.
  * *Vàng cam `#F9C74F` (59% – 30%):* Khách ngó nghiêng, gõ nhẹ ngón tay lên bàn.
  * *Đỏ rực `#E04F4F` (<30%):* Rung giật nhẹ (jitter animation), toát mồ hôi hột, chuẩn bị đứng dậy bỏ về.
* **Bộ Âm Thanh ASMR Pha Chế Độc Lập (100% Offline Web Audio API & Audio Buffers):**
  * `sfx_boiling_pour`: Tiếng nước sôi ùng ục rót từ ấm nhôm vào phin.
  * `sfx_phin_drip`: Tiếng từng giọt cà phê nhỏ xuống đáy ly thủy tinh trong vắt.
  * `sfx_condensed_milk`: Tiếng muỗng gạt dòng sữa đặc quánh dẻo.
  * `sfx_ice_clink`: Tiếng đá bi va vào thành ly lách cách mát rượi.
  * `sfx_spoon_clink`: Tiếng muỗng inox khuấy xoáy tròn tạo tiếng lốc xoáy ngọt ngào.

---

# CHƯƠNG 4: ĐẶC TẢ WIREFRAME & BỐ CỤC DUAL-VIEW (PC 16:9 VS MOBILE 9:16)

Dự án thiết kế cấu trúc giao diện co giãn thông minh (Responsive Dual-View), mang lại trải nghiệm tối ưu trên cả điện thoại di động và màn hình máy tính để bàn:

```
+---------------------------------------------------------------------------------------+
|                               PC 16:9 THREE-COLUMN COCKPIT                           |
| +---------------------+ +-----------------------------------+ +---------------------+ |
| | CỘT TRÁI (25% Width)| |       CỘT GIỮA (50% Width)        | | CỘT PHẢI (25% Width)| |
| | - Sổ Tài Chính      | |  +-----------------------------+  | | - Kẹp Vé Đơn Hàng   | |
| | - Bảng Quản Lý Kho  | |  |    TopHUD (Status Bar)      |  | | - Hotline Tương Trợ | |
| | - Phím Tắt [D,1,2,3]| |  +-----------------------------+  | | - Radar Thời Tiết   | |
| | - Nhiệm Vụ Ngày     | |  |    Phaser 3 Canvas Window   |  | | - Bảng Tin Vỉa Hè   | |
| |                     | |  |    - Vỉa hè, bàn ghế        |  | |                     | |
| |                     | |  |    - Quầy pha chế ASMR      |  | |                     | |
| |                     | |  +-----------------------------+  | |                     | |
| |                     | |  |    Bottom Navigation Tabs   |  | |                     | |
| +---------------------+ +-----------------------------------+ +---------------------+ |
+---------------------------------------------------------------------------------------+
```

## 4.1. Bố Cục Mobile Portrait (9:16 Touch-Friendly Single-Thumb)
Dành cho màn hình điện thoại di động (`viewport <= 768px`), ưu tiên thao tác công thái học bằng một ngón tay cái:
1. **TopHUD (0% – 10% Chiều cao màn hình, ~56px):**
   * Tên quán tùy chỉnh dập nổi trên thanh gỗ sẫm.
   * Cụm 3 ô tài nguyên bo góc: Tiền xu VNĐ, Hạt cà phê vàng, Điểm sống ảo ★.
   * Nút chụp ảnh Polaroid và nút bật/tắt âm thanh nhanh.
2. **Khu Vực Thế Giới Game - Phaser Canvas (10% – 75% Chiều cao màn hình):**
   * *Nửa trên:* Bầu trời biến đổi 4 pha ngày đêm, tán cây bàng, mặt tiền nhà cổ, dây cờ hoa.
   * *Nửa dưới:* Bờ kè vỉa hè gạch retro, quầy pha chế lưu động, cụm bàn ghế nhựa xanh đỏ, thú cưng nằm ngủ.
   * *Khách hàng:* Đi bộ từ mép màn hình vào, ngồi xuống bàn và hiện bong bóng gọi món to bản kèm thanh kiên nhẫn.
3. **Lớp Tương Tác Nổi Khẩn Cấp (Floating Overlays, 60% – 85% Chiều cao):**
   * Nút hành động khẩn cấp nhấp nháy khi có biến cố: **"CĂNG BẠT NGAY!"** (Mưa rào) hoặc **"THU GHẾ NHANH!"** (Trật tự đô thị).
4. **Bottom Navigation (90% – 100% Chiều cao, ~64px):**
   * Thanh điều hướng nổi dạng Thumb-Zone gồm 5 nút bấm có diện tích chạm tối thiểu 48x48px:
     1. `Thực Đơn` (Mở khóa & Nâng cấp công thức)
     2. `Nâng Cấp` (Sắm máy móc, bàn ghế, thuê phụ quán)
     3. `Trang Trí` (Mua decor tăng điểm sống ảo)
     4. `Nhiệm Vụ` (Danh sách việc cần làm nhận hạt vàng)
     5. `Chợ Sỉ` (Theo dõi giá & Nhập hàng chợ đầu mối)

## 4.2. Bố Cục PC Desktop (16:9 Three-Column Tycoon Cockpit)
Khi phát hiện kích thước màn hình `>= 1024px`, hệ thống tự động kích hoạt chế độ **Hybrid Tycoon Dashboard**:
1. **Cột Trái (25% Width - Operations & Inventory Command):**
   * *Bảng Quản Lý Kho Thời Gian Thực:* Hiển thị số lượng 4 nguyên liệu chính (Cà phê, Sữa đặc, Đá bi, Trà lài), nhấp nháy đỏ khi mức tồn dưới 20%.
   * *Bảng Phím Tắt Nhanh (Hotkey Panel):*
     * Phím `D`: Dọn sạch toàn bộ bàn bẩn và thu tiền tip ngay lập tức.
     * Phím `1`: Mở Menu Thực đơn.
     * Phím `2`: Mở Bảng Nâng cấp.
     * Phím `3`: Mở Danh sách Nhiệm vụ.
     * Phím `Space`: Tua nhanh hội thoại / Xác nhận hoàn tất pha chế.
     * Phím `Esc`: Đóng toàn bộ popup đang mở.
   * *Thanh Tiến Trình Chỉ Tiêu Ca Bán:* Hiển thị tiến độ hoàn thành ca bán (Doanh thu mục tiêu, số ly đã phục vụ).
2. **Khung Giữa (50% Width - Core Interactive Game Stage):**
   * Toàn bộ Canvas Phaser 3 được đặt trong khung viền gỗ sẫm bo tròn sang trọng viền đồng, tạo cảm giác người chơi đang ngắm nhìn quán qua khung cửa sổ hoài niệm.
   * Khi mở mini-game pha chế, giao diện trượt mở êm ái mà không làm che khuất hoàn toàn tầm nhìn đường phố.
3. **Cột Phải (25% Width - Order Tickets & Community Hotline):**
   * *Kẹp Vé Đơn Hàng (Ticket Rail kiểu Good Pizza):* Hiển thị danh sách khách đang chờ, thành phần yêu cầu, và thời gian kiên nhẫn còn lại.
   * *Hotline Tương Trợ Xóm Giềng:* Nút gọi nhanh Chú Ba (vay vốn xoay vòng), Cô Bảy (trợ giúp mặt bằng), Bạn thân (ứng cứu giờ cao điểm).
   * *Radar Dự Báo Thời Tiết & Đô Thị:* Kim đồng hồ đo nguy cơ mưa ngập hoặc xe trật tự đi tuần trong ca bán.

## 4.3. Đặc Tả Chi Tiết 4 Khu Vực Trọng Tâm Của Game

### Khu Vực 1: Khu Vực Pha Chế (Preparation Area)
* **Tiến trình cơ chế qua các giai đoạn:**
  * *Giai đoạn 1 (Thủ công 100%):* Mini-game 4 bước với thanh căn lực (Gauge Bar) cho thao tác rót nước sôi. Rót trúng vạch xanh lá (70% – 90%) nhận điểm thưởng `PERFECT` (+25% giá bán, x2 điểm sống ảo).
  * *Giai đoạn 2 (Bán tự động):* Nâng cấp phin lớn và máy dập nắp ly tự động; người chơi chuẩn bị ly, nhân viên hoàn thiện đóng gói.
  * *Giai đoạn 3 – 6 (Tự động hóa hoàn toàn & R&D):* Nhân viên Barista tự động pha chế; người chơi chuyển sang phòng R&D nghiên cứu công thức ủ lạnh Cold Brew, chỉnh nhiệt độ rang mộc và kiểm soát chuỗi cung ứng.
* **Hiệu ứng đồ họa:** Hơi nước bốc khói mờ ảo, giọt cà phê sóng sánh nhỏ chậm, bọt sữa dâng lên, thìa xoáy tạo lốc xoáy nâu caramel.

### Khu Vực 2: Khu Vực Vỉa Hè (Sidewalk Area)
* **Không gian vật lý:**
  * Mặt vỉa hè lát gạch men cổ điển Sài Gòn, bờ lề ngăn cách lòng đường với dòng xe máy Cub chạy qua lại.
  * Cụm bàn ghế nhựa linh hoạt: Khởi đầu với 2 bàn / 4 ghế, có thể nâng cấp mở rộng lên 4 bàn / 8 ghế hoặc kê tràn sang hiên nhà Cô Bảy.
  * Điểm nhấn môi trường: Bảng gỗ viết phấn (thay đổi danh ngôn hài hước mỗi ngày), tán cây bàng râm mát, góc ngủ của cún vàng và mèo mướp.
* **Máy trạng thái bàn (Table FSM):**
  $$\text{TRỐNG} \xrightarrow{\text{Khách vào}} \text{KHÁCH NGỒI} \xrightarrow{\text{Order}} \text{CHỜ MÓN} \xrightarrow{\text{Giao nước}} \text{THƯỞNG THỨC} \xrightarrow{\text{Khách về}} \text{BÀN BẨN (CÓ TIỀN)} \xrightarrow{\text{Dọn dẹp}} \text{TRỐNG}$$

### Khu Vực 3: Thanh Trạng Thái (Status Bar / TopHUD)
* Hiển thị trực quan 3 chỉ số tài chính: Vốn kinh doanh (Tiền xu VNĐ), Hạt Cà Phê Vàng (Hard Currency), Điểm Sống Ảo / Uy Tín (★).
* Đồng hồ đếm ngược ca bán (Shift Timer: 75s – 120s mỗi ca) kèm biểu tượng thời tiết hiện tại (Nắng / Âm u / Mưa rào).

### Khu Vực 4: Menu Quản Lý (Management Menus)
Gồm 5 phân hệ menu toàn diện:
1. *Thực Đơn (Menu R&D):* Mở khóa món mới, nâng cấp cấp độ món (+15% giá bán/level), xem thông số định mức nguyên liệu.
2. *Nâng Cấp (Equipment & Staff):* Nâng cấp phin nhôm, mua ghế nhựa chống gãy, sắm máy dập nắp, thuê bạn sinh viên phụ quán, máy phát điện dự phòng.
3. *Trang Trí (Decor & Lifestyle):* Biển hiệu vintage, chậu cây hoa giấy, dàn đèn lồng Hội An, loa phát nhạc retro (+Điểm Sống Ảo).
4. *Chợ Sỉ (Wholesale Market):* Biểu đồ biến động giá nguyên liệu hàng ngày (Cà phê hạt, Sữa hộp, Đá bi, Trà lài); mua sỉ tích trữ khi giá giảm.
5. *Sổ Nợ & Tương Trợ (Community Ledger):* Theo dõi các khoản vay Chú Ba, điểm thân thiết với hàng xóm và lịch trả góp mặt bằng.

---

# CHƯƠNG 5: HỆ THỐNG TIẾN TRÌNH GAMEPLAY 6 GIAI ĐOẠN CHI TIẾT

Tiến trình phát triển của người chơi được phân định thành **đúng 6 giai đoạn rõ rệt** với độ khó tăng dần, mở khóa những tầng sâu gameplay mới:

```
[Phase 1: Quán Cóc Vỉa Hè] ──> [Phase 2: Kiosk Take-Away] ──> [Phase 3: Quán Nhỏ Trong Hẻm]
         │                              │                                │
      Khởi nghiệp 0đ              Làn sóng Shipper App             Góc sống ảo & Deadline
         │                              │                                │
         ▼                              ▼                                ▼
[Phase 4: Flagship 2 Tầng] ─> [Phase 5: Xưởng Rang Xay] ───> [Phase 6: Đế Chế Toàn Cầu]
         │                              │                                │
   Sân vườn & Barista              Tự chủ chuỗi cung ứng             Xuất ngoại Tokyo, Paris
```

## Bảng Đặc Tả Chi Tiết 6 Giai Đoạn

| Giai Đoạn | Quy Mô Không Gian | Điều Kiện Mở Khóa | Mục Tiêu Cốt Lõi | Tệp Khách Tiêu Biểu | Thực Đơn & Cơ Chế Pha Chế |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Quán Cóc Vỉa Hè** | 4 ghế nhựa xanh đỏ dưới bóng mát tán cây bàng, thùng đá mút xốp, bảng gỗ viết phấn | • Vốn: `0đ`<br>• Uy tín: `0 ★`<br>*(Bắt đầu game)* | • Thuần thục kỹ thuật pha phin xúc giác.<br>• Làm quen với khách xóm giềng.<br>• Phản xạ nhanh với mưa rào & trật tự đô thị.<br>• Tích lũy 500k sắm Xe Đẩy. | • Chú Ba Xe Ôm<br>• Cô Tư Vé Số<br>• Cô Bảy Hàng Xóm | • **Menu (4 món):** Trà đá (5k), Cà phê đen đá (15k), Cà phê sữa đá (15k), Bạc xỉu (20k).<br>• **Pha chế:** Thủ công 100% bằng tay (rót phin canh gauge, đổ sữa, xúc đá). |
| **Phase 2: Kiosk Take-Away & Xe Đẩy** | Xe đẩy inox lưu động có mái che, bảng menu LED, 2 ghế chờ, khu vực đứng nhận đơn cho shipper | • Vốn: `500.000đ`<br>• Uy tín: `20 ★`<br>• Sở hữu Xe Đẩy Lưu Động | • Đáp ứng làn sóng đơn hàng app từ shipper.<br>• Thuê nhân viên sinh viên đầu tiên phụ quán.<br>• Mở khóa hũ tiền ngoại tuyến Idle (tích trữ 4h).<br>• Quản lý chi phí khi giá sữa biến động. | • Thêm: Anh Shipper Công Nghệ (Grab/Shopee)<br>• Dân văn phòng mua mang đi vội<br>• Học sinh tan trường | • **Thêm 4 món:** Bánh mì que pate giòn (18k), Trà đào cam sả (28k), Cà phê muối béo ngậy (32k), Cà phê sương sáo (25k).<br>• **Pha chế:** Máy dập nắp ly tự động, bình lắc shaker trà đào. |
| **Phase 3: Quán Nhỏ Trong Hẻm (Indie)** | Mặt bằng máy lạnh có cửa kính, 8 chỗ ngồi, ổ cắm điện, góc sống ảo hoa giấy, kệ merchandise | • Vốn: `3.500.000đ`<br>• Uy tín: `100 ★` | • Thiết kế không gian decor sống ảo thu hút giới trẻ.<br>• Phục vụ sinh viên cày deadline ngồi lâu.<br>• Đón tiếp Reviewer/KOL kéo bão khách.<br>• Bán lẻ cà phê đóng chai mang về. | • Thêm: Sinh Viên Chạy Deadline<br>• Reviewer / TikToker Sống Ảo<br>• Freelancer IT / Designer | • **Thêm 4 món:** Matcha Latte đánh chổi chasen (45k), Bánh Tiramisu/Croissant (42k), Cold Brew cam vàng (40k), Cà phê đóng chai 250ml (55k).<br>• **Pha chế:** Khách tự lấy bánh và chai sẵn ở kệ bán lẻ. |
| **Phase 4: Quán Lớn Flagship 2 Tầng** | Biệt thự phố cổ 2 tầng góc ngã tư sầm uất: Tầng 1 Barista & sân vườn, Tầng 2 co-working, Rooftop ngắm hoàng hôn | • Vốn: `25.000.000đ`<br>• Uy tín: `350 ★` | • Quản lý nhân sự đa phân khu.<br>• Thuê Quản lý Cửa hàng tự động điều phối.<br>• Tổ chức đêm nhạc Acoustic cuối tuần.<br>• Vượt qua đợt thanh tra ATTP và đối thủ mở sát vách. | • Thêm: Dân Công Sở Cấp Cao<br>• Khách Doanh Nghiệp (họp đối tác)<br>• Du Khách Nước Ngoài<br>• Gia đình đi cà phê cuối tuần | • **Thêm 5 món:** Espresso Single/Double (35k/45k), Cappuccino Latte Art (50k), Cà phê Trứng Hà Nội (55k), Trà Nhiệt Đới Đại Dương (48k), Set Trà Bánh Hoàng Gia (85k).<br>• **Pha chế:** Máy pha chuyên nghiệp 2 group, máy đánh trứng mịn. |
| **Phase 5: Xưởng Rang Xay & Bếp Trung Tâm** | Tổ hợp nhà máy chế biến hạt, phòng thí nghiệm Cupping Lab, kho lạnh bảo quản hạt mộc và dây chuyền đóng gói | • Vốn: `120.000.000đ`<br>• Uy tín: `1.000 ★` | • Tự chủ 100% nguồn cung hạt Robusta và Arabica.<br>• Ký hợp đồng độc quyền với nông hộ Tây Nguyên.<br>• Sản xuất bánh tươi & si-rô cung cấp cho toàn chuỗi.<br>• Giảm 35% chi phí nguyên liệu toàn hệ thống. | • Thêm: Chuyên Gia Cupping (Q-Grader)<br>• Đại lý đối tác nhập sỉ hạt<br>• Học viên đăng ký lớp Barista<br>• Khách VIP sưu tầm hạt mộc | • **Thêm dòng sản phẩm B2B & Quà tặng:** Gói Robusta Buôn Ma Thuột 500g (120k), Arabica Cầu Đất Honey (180k), Can Cốt Cà Phê 2L (250k), Hộp Quà Di Sản (450k).<br>• **Gameplay:** Mini-game căn nhiệt độ rang hạt (Roasting Profile). |
| **Phase 6: Chuỗi Toàn Quốc & Vươn Tầm Quốc Tế** | Bản đồ nhượng quyền Việt Nam (Sài Gòn, Hà Nội, Đà Lạt, Đà Nẵng) -> Thế giới (Tokyo, Seoul, Paris, New York) | • Vốn: `600.000.000đ`<br>• Uy tín: `3.000 ★` | • Quản lý chuỗi nhượng quyền đa quốc gia.<br>• Cân bằng tỷ giá hối đoái và logistics quốc tế.<br>• Chiến dịch "Lan Tỏa Văn Hóa Cà Phê Phin Ra Thế Giới".<br>• Hoàn thành Game End-Loop với Prestige System. | • Khách Hàng Quốc Tế Đa Sắc Tộc<br>• Đại Sứ Văn Hóa Ẩm Thực<br>• Quỹ Đầu Tư Nhượng Quyền Toàn Cầu<br>• Kiều bào xa xứ ghé ủng hộ | • **Thực đơn Di Sản Quốc Tế:** Heritage Drip Coffee ($4.5), Coconut Slush Coffee ($5.5), Hanoi Egg Coffee Special ($6.0), Da Lat High-altitude Arabica Drip ($5.0).<br>• **Gameplay:** Bản đồ thế giới, quản lý hợp đồng Master Franchise. |

---

# CHƯƠNG 6: HỆ THỐNG BIẾN CỐ BẤT TRẮC ĐỜI THỰC (HAZARDS & CRISES)

Một trong những bản sắc độc đáo nhất tạo nên thương hiệu **"Tiệm Cà Phê Bất Ổn"** là hệ thống 6 biến cố bất trắc đời thực. Không một ngày buôn bán nào trôi qua một cách tẻ nhạt:

```
                       CÁC BIẾN CỐ BẤT TRẮC ĐỜI THỰC
                                     │
    ┌─────────────────┬──────────────┴──────────────┬─────────────────┐
    ▼                 ▼                             ▼                 ▼
[Bão Giá Chợ]   [Mưa Ngập Vỉa Hè]             [Thanh Tra ATTP]   [Cúp Điện Đột Ngột]
(Tăng giá vốn)   (Ướt đồ, trôi ghế)            (Kiểm tra độ sạch)  (Hỏng máy pha)
                      │                             │
                      ▼                             ▼
              [Đòi Nợ Đến Kỳ]               [Đối Thủ Phá Giá]
              (Áp lực dòng tiền)            (Mở quán sát vách)
```

### 1. Biến Cố 1: Biến Động Giá Nguyên Liệu Thị Trường (Market Price Volatility)
* **Bối cảnh:** Hạn hán tại Tây Nguyên đẩy giá hạt nhân xanh tăng vọt; giá sữa đặc và đá bi biến động theo chu kỳ giá xăng dầu.
* **Tần suất & Giai đoạn:** Xuất hiện từ Phase 1 đến Phase 6 (xác suất 20% mỗi sáng ở phase `PREP`).
* **Tác động gameplay:** Giá nhập sỉ trong kho tăng từ 30% đến 80%. Tỷ suất lợi nhuận gộp bị bóp nghẹt.
* **Cách giải quyết:** Người chơi chủ động theo dõi biểu đồ dự báo giá, nhập hàng trữ sẵn vào những ngày giá rẻ, hoặc tạm thời tăng giá bán nhẹ (chấp nhận khách phàn nàn nhẹ).

### 2. Biến Cố 2: Mưa Rào Trút Nước & Triều Cường Ngập Vỉa Hè (Severe Weather & Sidewalk Flooding)
* **Bối cảnh:** Cơn mưa rào bất chợt đặc trưng Sài Gòn, cống thoát nước quá tải làm nước ngập mép vỉa hè, ghế nhựa có nguy cơ trôi nổi.
* **Tần suất & Giai đoạn:** Nguy hiểm nhất ở Phase 1 và Phase 2 (xác suất 35% trong mùa mưa).
* **Tác động gameplay:** Màn hình tối sầm, sấm chớp gầm vang, mưa rơi xối xả. Xuất hiện bộ đếm ngược 5 giây. Nếu thất bại: Toàn bộ khách đang ngồi bỏ chạy tán loạn, hủy toàn bộ order đang pha, làm hư hỏng 10 đơn vị đá bi và bột cà phê trong kho.
* **Cách giải quyết:** Người chơi bấm nhanh nút **"CĂNG BẠT & KÊ CAO THÙNG ĐÁ"** trong 5 giây. Vượt qua thành công sẽ kích hoạt hiệu ứng ấm lòng: Khách nép sát vào nhau dưới mái bạt, tiền tip tăng thêm +30% và nhu cầu đồ uống nóng tăng gấp đôi.

### 3. Biến Cố 3: Thanh Tra Vệ Sinh An Toàn Thực Phẩm (ATTP Inspection)
* **Bối cảnh:** Đoàn thanh tra liên ngành đột xuất ghé thăm kiểm tra độ sạch của dụng cụ pha chế, xuất xứ hạt cà phê và tình trạng vệ sinh bàn ghế.
* **Tần suất & Giai đoạn:** Xuất hiện từ Phase 2 trở đi (xác suất 15%).
* **Tác động gameplay:** Hệ thống kiểm tra 2 tiêu chí: (1) Số lượng bàn bẩn chưa dọn (nếu `dirtyTables.length >= 2`), (2) Chất lượng nguyên liệu trong kho (nếu mua loại trôi nổi). Nếu vi phạm: Phạt tiền 20% tổng quỹ tiền mặt hiện có và trừ 30 Điểm Sống Ảo.
* **Cách giải quyết:** Giữ thói quen dọn bàn kịp thời (tap tay hoặc phím tắt `D`), trang bị nắp đậy thùng đá và chỉ nhập hàng từ nhà cung cấp uy tín. Nếu đạt chuẩn xuất sắc: Cấp chứng nhận "Tiệm Cà Phê Vệ Sinh Vàng" (+50 Điểm Sống Ảo, tăng lượng khách 25% trong 3 ngày).

### 4. Biến Cố 4: Cúp Điện Bất Chợt Giữa Trưa Nắng (Unexpected Power Outages)
* **Bối cảnh:** Quá tải lưới điện cục bộ mùa nắng nóng, nổ biến áp đầu hẻm. Máy pha Espresso, quạt máy và tủ mát tắt lịm.
* **Tần suất & Giai đoạn:** Xuất hiện từ Phase 2 đến Phase 4 (xác suất 15%).
* **Tác động gameplay:** Không thể pha các món máy (Espresso, sinh tố). Đá bi trong kho tan nhanh gấp đôi. Khách hàng tụt kiên nhẫn nhanh gấp đôi do nóng bức.
* **Cách giải quyết:** Nhanh chóng chuyển toàn bộ sang pha phin thủ công truyền thống, dùng quạt nan tre vẫy mát cho khách và phục vụ trà đá miễn phí; hoặc đầu tư máy phát điện mini (chi phí xăng 50.000đ/ca).

### 5. Biến Cố 5: Áp Lực Nợ Vay & Đòi Tiền Mặt Bằng (Rent & Debt Repayment Pressure)
* **Bối cảnh:** Để mở rộng quán lên Kiosk (Phase 2) hoặc thuê mặt bằng hẻm (Phase 3), người chơi vay vốn kinh doanh. Cứ mỗi 7 ngày trong game, kỳ hạn thanh toán lãi và gốc lại đến.
* **Tần suất & Giai đoạn:** Định kỳ Chủ Nhật hàng tuần.
* **Tác động gameplay:** Nếu tài khoản không đủ tiền thanh toán: Chủ nợ ghé quán cằn nhằn, tạo áp lực tâm lý khiến khách sợ hãi không dám vào (lượng khách giảm 50% cho đến khi thanh toán xong).
* **Cách giải quyết:** Duy trì quỹ dự phòng khẩn cấp tối thiểu 20% doanh thu mỗi tuần, quản lý dòng tiền cẩn trọng, không vung tay mua sắm đồ trang trí xa xỉ khi sắp đến hạn trả nợ.

### 6. Biến Cố 6: Đối Thủ Cạnh Tranh Mở Sát Vách Phá Giá (Aggressive Adjacent Competitors)
* **Bối cảnh:** Thấy quán buôn may bán đắt, quán "Trà Đào 10k" hoặc thương hiệu chuỗi mở ngay bên cạnh, bật loa quảng cáo và phát tờ rơi mua 1 tặng 1.
* **Tần suất & Giai đoạn:** Xuất hiện từ Phase 2 đến Phase 5.
* **Tác động gameplay:** Lượng khách vãng lai sụt giảm 35% trong 2 ngày liên tiếp.
* **Cách giải quyết:** Phản công bằng giá trị văn hóa và chất lượng dịch vụ: Kích hoạt chương trình "Trà đá miễn phí & Nụ cười thân thiện", đảm bảo mọi ly nước đạt chuẩn `PERFECT`, tặng kèm bánh quy gừng cho khách quen. Khách hàng trung thành sẽ giúp quán chiến thắng đối thủ tự động dời đi sau 3 ngày.

---

# CHƯƠNG 7: CƠ CHẾ TƯƠNG TRỢ CỘNG ĐỒNG ĐỜI THỰC (SOLIDARITY RESCUE MECHANICS)

Sự khắc nghiệt của đời sống vỉa hè được cân bằng bằng **tình làng nghĩa xóm** — nét đẹp văn hóa bình dị giúp "Tiệm Cà Phê Bất Ổn" trở thành một tựa game ấm áp và nhân văn:

| Cơ Chế Tương Trợ | Nhân Vật Đại Diện | Điều Kiện Kích Hoạt | Chi Phí & Điều Kiện Đáp Lễ | Hiệu Ứng Giải Cứu & Lợi Ích Mang Lại |
| :--- | :--- | :--- | :--- | :--- |
| **1. Quỹ Tương Trợ Chú Ba**<br>*(Vay Vốn Xoay Vòng 0% Lãi)* | Chú Ba Xe Ôm | Tiền mặt rớt xuống dưới `50.000đ` và không đủ tiền mua nguyên liệu mở ca bán mới. Điểm thân thiết với Chú Ba `>= 3 ly` pha chuẩn. | Hoàn toàn 0% lãi suất. Người chơi chỉ cần mời Chú Ba 1 ly cà phê đen đá mỗi sáng trong 3 ngày liên tiếp. | Cho mượn nóng ngay từ `200.000đ` đến `1.000.000đ` tiền mặt để nhập nguyên liệu buôn bán, cứu tiệm thoát khỏi bờ vực phá sản. |
| **2. San Sẻ Mặt Bằng Cô Bảy**<br>*(Cho Mượn Góc Vỉa Hè)* | Cô Bảy Tạp Hóa | Khi xe trật tự đô thị đi tuần gắt gao HOẶC khi quán quá tải khách giờ cao điểm không còn chỗ ngồi. | Mời Cô Bảy ly bạc xỉu ít ngọt nhiều sữa và trông dùm sạp báo khi cô đi chợ. | Cho phép dời tạm 2 bộ bàn ghế nhựa sang góc hiên có mái che của nhà cô. Tăng thêm 2 chỗ ngồi trong 3 phút mà không lo bị lập biên bản đô thị. |
| **3. Bạn Thân Ứng Cứu Giờ Vàng**<br>*(Đội Phụ Quán Cấp Tốc)* | 2 Bạn Thân Cùng Lớp | Khi có đơn hàng bão Shipper dồn dập (hơn 4 đơn app cùng lúc) HOẶC đoàn khách công ty 10 người ập vào quán. | Đãi nhóm bạn một chầu chè đậu đỏ bánh lọt cuối tuần. | Hai người bạn thân chạy xe máy tới phụ quán trong 90 giây: Tự động hoàn thành pha chế với tốc độ x2, tự động dọn sạch bàn bẩn, triệt tiêu nguy cơ khách bỏ đi. |
| **4. Khách Quen Đứng Ra Bảo Vệ**<br>*(Hòa Giải & Bảo Kê Nghĩa Hiệp)* | Anh Công An Khu Vực & Hội Khách Ruột | Khi quán bị đối thủ chơi xấu, khách say xỉn quậy phá, hoặc chủ nợ to tiếng trước quán. | Tặng thẻ VIP "Khách Tri Kỷ Vỉa Hè" giảm giá 10% trọn đời. | Khách quen thân thiết lập tức đứng ra khuyên can, hòa giải và bảo vệ uy tín tiệm. Hóa giải 100% rủi ro biến cố tiêu cực, cộng thưởng ngay +25 Điểm Sống Ảo. |

---

# CHƯƠNG 8: MÔ HÌNH TOÁN HỌC CÂN BẰNG KINH TẾ (BALANCING MODEL)

Mô hình kinh tế được tính toán định lượng chặt chẽ để đảm bảo chiều sâu chiến lược, tránh việc game quá dễ gây nhàm chán hoặc quá khó gây ức chế:

## 8.1. Bảng Định Mức COGS & Tỷ Suất Lợi Nhuận Gộp (Gross Profit Margins)
Tỷ suất lợi nhuận gộp bám sát thực tế ngành F&B đồ uống tại Việt Nam, dao động từ **62% đến 88.3%**:
$$\text{Gross Margin} = \frac{\text{Giá Bán} - \text{Chi Phí Nguyên Liệu (COGS)}}{\text{Giá Bán}} \times 100\%$$

| ID Món | Tên Món Ăn / Đồ Uống | Giai Đoạn | Giá Bán Cơ Bản | Định Mức & Chi Phí COGS | Lợi Nhuận Gộp / Ly | Tỷ Suất Lợi Nhuận | Thời Gian Pha |
| :--- | :--- | :---: | :---: | :--- | :---: | :---: | :---: |
| `tra_da` | Trà Đá Mát Lạnh | Phase 1 | **5.000đ** | 0.2 trà (500đ) + 0.5 đá (250đ) = **750đ** | +4.250đ | **85.0%** | 1.0s |
| `cf_den_da` | Cà Phê Phin Đen Đá | Phase 1 | **15.000đ** | 1.0 cà phê (1.500đ) + 0.5 đá (250đ) = **1.750đ** | +13.250đ | **88.3%** | 2.5s |
| `cf_sua_da` | Cà Phê Sữa Đá Sài Gòn | Phase 1 | **15.000đ** | 1.0 cà phê (1.500đ) + 1.0 sữa (2.250đ) + 0.5 đá (250đ) = **4.000đ** | +11.000đ | **73.3%** | 2.5s |
| `bac_xiu` | Bạc Xỉu Đá 3 Tầng | Phase 1 | **20.000đ** | 0.5 cà phê (750đ) + 2.0 sữa (4.500đ) + 0.5 đá (250đ) = **5.500đ** | +14.500đ | **72.5%** | 3.0s |
| `banh_mi_que`| Bánh Mì Que Hải Phòng | Phase 2 | **18.000đ** | 1 bánh mì que thô + pate gan = **6.000đ** | +12.000đ | **66.7%** | 2.0s |
| `tra_dao` | Trà Đào Cam Sả | Phase 2 | **28.000đ** | 1 trà lài (1.000đ) + 3 miếng đào (5.500đ) + sả/đá (1.500đ) = **8.000đ** | +20.000đ | **71.4%** | 3.5s |
| `cf_muoi` | Cà Phê Muối Kem Béo | Phase 2 | **32.000đ** | 1 cà phê (1.500đ) + 1 kem béo (6.500đ) + muối/sữa (2.000đ) = **10.000đ** | +22.000đ | **68.8%** | 4.0s |
| `matcha_latte`| Matcha Latte Nhật Bản | Phase 3 | **45.000đ** | Bột matcha (8.000đ) + Sữa tươi thanh trùng (6.000đ) = **14.000đ** | +31.000đ | **68.9%** | 4.5s |
| `banh_tiramisu`| Bánh Tiramisu Ý | Phase 3 | **42.000đ** | Cốt bánh ngọt nhập xưởng = **15.000đ** | +27.000đ | **64.3%** | 2.0s |
| `cf_dong_chai`| Cà Phê Đóng Chai 250ml | Phase 3 | **55.000đ** | 2.5 shot cà phê + sữa đặc + vỏ chai thủy tinh = **18.000đ** | +37.000đ | **67.3%** | Tự động lấy |
| `espresso_d` | Double Espresso Ý | Phase 4 | **45.000đ** | 18g hạt Arabica Cầu Đất (6.500đ) + điện/nước = **8.000đ** | +37.000đ | **82.2%** | 2.0s |
| `cf_trung` | Cà Phê Trứng Hà Nội | Phase 4 | **55.000đ** | 1 cà phê + 2 lòng đỏ trứng gà + mật ong = **15.000đ** | +40.000đ | **72.7%** | 5.0s |
| `set_tra_banh`| Set Trà Bánh Hoàng Gia | Phase 4 | **85.000đ** | Bình trà mạn sen Tây Hồ + 3 loại bánh ngọt = **28.000đ** | +57.000đ | **67.1%** | 3.0s |
| `goi_hat_500g`| Gói Robusta Buôn Ma Thuột| Phase 5 | **120.000đ**| 500g hạt mộc chọn lọc + túi zip van 1 chiều = **45.000đ** | +75.000đ | **62.5%** | B2B / Kệ |
| `can_cot_2l` | Can Cốt Cà Phê Pha Sẵn 2L| Phase 5 | **250.000đ**| Chiết xuất công nghiệp 800g hạt + chai can = **85.000đ** | +165.000đ | **66.0%** | B2B / Sỉ |
| `global_slush`| Coconut Slush Coffee | Phase 6 | **$5.50 (135k)**| Cà phê phin cốt dừa đông lạnh xuất khẩu = **32.000đ** | +103.000đ | **76.3%** | 4.0s |

## 8.2. Công Thức Hệ Số Chất Lượng & Tiền Tip Khách Hàng
Tổng thu nhập của từng ly nước được xác định bằng công thức:
$$\text{Thu Nhập Ly} = \left(\text{DrinkPrice}(\text{Level}) \times \text{QualityMultiplier}\right) + \text{CustomerTip}$$

Trong đó:
* **Hệ Số Đánh Giá Chất Lượng (Quality Multiplier):**
  * `PERFECT` (Rót nước đúng vạch xanh 70% – 90%, đủ sữa, đủ đá): $\times 1.25$ giá bán cơ bản, cộng thêm $2 \times$ Điểm Sống Ảo.
  * `GOOD` (Rót lệch nhẹ nhưng vẫn ngon): $\times 1.0$ giá bán cơ bản.
  * `POOR` (Rót tràn ly hoặc thiếu nước): $\times 0.75$ giá bán cơ bản, khách phàn nàn.
* **Công Thức Tính Tiền Tip Ngẫu Nhiên:**
  $$\text{CustomerTip} = \begin{cases} 
  \text{DrinkPrice} \times \text{TipMultiplier} \times (1 + \text{WeatherRainBuff}) & \text{với xác suất } \text{TipChance} \\ 
  0 & \text{với xác suất } 1 - \text{TipChance} 
  \end{cases}$$
  *(Ví dụ: Chú Ba xe ôm có `tipMultiplier: 0.15`, nếu mua ly 15.000đ sẽ bo thêm 2.000đ – 3.000đ tiền lẻ).*

## 8.3. Đường Cong Nâng Cấp & Thu Nhập Ngoại Tuyến (Progression Curves)
1. **Chi phí nâng cấp món ăn & thiết bị tăng theo cấp số mũ:**
   $$\text{UpgradeCost}(\text{level}) = \text{Round}\left(\text{BaseCost} \times 1.18^{\text{level} - 1}\right)$$
   *Hệ số $1.18$ mang lại độ dốc tăng trưởng vừa phải trong 10 cấp đầu, sau đó tăng mạnh để kích thích người chơi tối ưu hóa dây chuyền.*
2. **Giá bán đồ uống tăng theo cấp độ nâng cấp:**
   $$\text{DrinkPrice}(\text{level}) = \text{Round}\left(\text{BasePrice} \times \left(1 + 0.15 \times (\text{level} - 1)\right)\right)$$
3. **Thu nhập ngoại tuyến khi người chơi rời game (Idle Offline Earnings):**
   $$\text{OfflineEarnings} = \text{IncomePerSecond} \times \min(\text{ElapsedSeconds}, \text{MaxCapSeconds}) \times 0.5$$
   * Giới hạn thời gian cơ bản: $\text{MaxCapSeconds} = 14.400\text{ giây}$ (tương đương 4 giờ).
   * Khi mở lại game, người chơi có 2 lựa chọn: **Nhận ngay (x1)** hoặc **Xem video quảng cáo nhận (x2)**.

## 8.4. Ma Trận Xác Suất Kích Hoạt Biến Cố & Nhịp Độ Chơi (Playtime Pacing)

| Giai Đoạn | Ngưỡng Tiền Tích Lũy | Ngưỡng Uy Tín ★ | Thời Gian Hoàn Thành Dự Kiến | Biến Cố Trọng Tâm & Xác Suất Xuất Hiện |
| :--- | :---: | :---: | :--- | :--- |
| **Phase 1: Cóc Vỉa Hè** | 0đ -> 500.000đ | 0 -> 20 ★ | **15 – 20 phút** chơi liên tục | Mưa rào (35%), Trật tự đô thị (25%), Biến động giá (20%). |
| **Phase 2: Kiosk Take-Away**| 500.000đ -> 3.500.000đ | 20 -> 100 ★ | **45 – 60 phút** (hoặc 1 ngày) | Shipper bão đơn (40%), Cúp điện (15%), Bão giá sữa (25%). |
| **Phase 3: Quán Nhỏ Hẻm** | 3.500.000đ -> 25.000.000đ | 100 -> 350 ★ | **2 – 3 ngày** chơi thư thả | Sinh viên cày deadline (50%), KOL ghé thăm (20%), Nợ tuần (100%). |
| **Phase 4: Flagship 2 Tầng** | 25.000.000đ -> 120.000.000đ| 350 -> 1.000 ★| **5 – 7 ngày** chơi | Thanh tra ATTP (25%), Quán đối thủ phá giá (30%), Cúp điện (20%). |
| **Phase 5: Xưởng Rang Xay** | 120.000.000đ -> 600.000.000đ| 1.000 -> 3.000 ★| **2 – 3 tuần** chơi | Mất mùa cà phê Tây Nguyên (30%), Tắc nghẽn logistics (20%). |
| **Phase 6: Chuỗi Toàn Cầu** | > 600.000.000đ | > 3.000 ★ | **End-game dài hạn** | Biến động tỷ giá hối đoái ($/€), Cạnh tranh chuỗi toàn cầu. |

---

# CHƯƠNG 9: KẾ HOẠCH TRIỂN KHAI KỸ THUẬT THEO TỪNG GIAI ĐOẠN (TECH ROADMAP)

Kế hoạch kỹ thuật được ánh xạ trực tiếp và khả thi 100% với kiến trúc mã nguồn hiện tại của dự án:

```
                            KIẾN TRÚC HỆ THỐNG PHÂN TẦNG
+-----------------------------------------------------------------------------------+
|               REACT 19 UI LAYER (Tailwind CSS v4 & Lucide Icons)                  |
| TopHUD | BottomNav | CoffeeBrewingModal | DailyReportModal | EventAlert | ShopModal|
+-----------------------------------------------------------------------------------+
                                      ▲   │
                  useGameStore Hooks  │   │ Actions (consume, cleanTable...)
                                      │   ▼
+-----------------------------------------------------------------------------------+
|               ZUSTAND 5 CENTRAL STORE (LocalStorage Persist Engine)               |
| gold | goldenBeans | reputation | inventory | dayPhase | dirtyTables | upgrades   |
+-----------------------------------------------------------------------------------+
                                      ▲   │
       Phaser Events (customer-speak) │   │ React Events (request-brew, clean-all)
                                      │   ▼
+-----------------------------------------------------------------------------------+
|                   EVENTBUS (Phaser.Events.EventEmitter Singleton)                 |
+-----------------------------------------------------------------------------------+
                                      ▲   │
                                      │   ▼
+-----------------------------------------------------------------------------------+
|                     PHASER 3 ENGINE (Canvas 2D Rendering)                         |
| BootScene | CafeScene | Customer FSM | Staff AI | Weather Particle | SoundManager |
+-----------------------------------------------------------------------------------+
```

## Lộ Trình Triển Khai 6 Giai Đoạn Kỹ Thuật

### Giai Đoạn 1: Hoàn Thiện MVP Nền Tảng (Hiện Đã Vận Hành 100%)
* **Công việc đã hoàn thành:**
  * Khởi tạo dự án Vite v6.4, React 19.1, Tailwind v4.1, Phaser 3.87, Zustand 5.0.5.
  * Xây dựng `useGameStore` với vòng đời ngày bán (`PREP` -> `OPEN` -> `SUMMARY`).
  * Xây dựng `EventBus` kết nối hai chiều giữa Phaser Canvas và React UI.
  * Triển khai `CoffeeBrewingModal` tương tác ASMR 4 bước căn lực rót phin.
  * Dựng `CafeScene` vỉa hè với bàn ghế nhựa, tán cây bàng, bảng gỗ viết phấn và khách hàng FSM.
  * Tích hợp 2 sự kiện ngẫu nhiên: Mưa rào và Trật tự đô thị trong `EventManager.ts`.

### Giai Đoạn 2: Kiosk Take-Away, Làn Sóng Shipper & Idle Offline
* **Nhiệm vụ kỹ thuật:**
  * Mở rộng `CafeScene`: Thêm quầy xe đẩy inox có mái che và 4 vị trí xếp hàng riêng cho Shipper.
  * Lập trình thực thể `Staff.ts` (FSM nhân viên tự động pha chế và giao hàng cho shipper).
  * Xây dựng `OfflineModal.tsx` tính toán thời gian `elapsedSeconds`, nhân đôi x2 khi xem quảng cáo giả lập.
  * Bổ sung thực đơn 4 món mới vào `gameData.ts` (Trà đào cam sả, Cà phê muối, Bánh mì que).

### Giai Đoạn 3: Quán Nhỏ Trong Hẻm, Hệ Thống Decor & Sống Ảo
* **Nhiệm vụ kỹ thuật:**
  * Tạo scene mới `IndoorScene.ts`: Không gian phòng máy lạnh, cửa kính nhìn ra hẻm, giàn hoa giấy.
  * Xây dựng hệ thống lưới Decor (`DecorGridSystem`): Cho phép người chơi đặt bàn ghế, đèn lồng, tranh ảnh và tự động cộng Điểm Sống Ảo vào store.
  * Xây dựng thực thể `KOLCustomer`: Khi xuất hiện kích hoạt hiệu ứng Flash máy ảnh và buff x2 lượng khách trong 60 giây.
  * Triển khai `PolaroidModal.tsx`: Chụp snapshot canvas, lồng khung Polaroid kèm tên quán để xuất ảnh chia sẻ.

### Giai Đoạn 4: Quán Lớn Flagship 2 Tầng & Đa Phân Khu
* **Nhiệm vụ kỹ thuật:**
  * Kiến trúc chuyển đổi đa tầng: Nút bấm chuyển view nhanh giữa Tầng 1 (Sân vườn & Quầy Bar) và Tầng 2 (Co-working & Ban công ngắm phố).
  * Lập trình AI `FloorManager`: Tự động điều phối nhân viên phục vụ giữa các tầng khi có tầng quá tải.
  * Sự kiện định kỳ "Đêm Nhạc Acoustic Cuối Tuần": Thay đổi BGM sang guitar mộc, tăng 50% giá bán đồ uống trong 2 giờ game.
  * Bổ sung cơ chế thanh tra ATTP kiểm tra độ sạch định kỳ.

### Giai Đoạn 5: Xưởng Rang Xay & Bếp Trung Tâm (Roastery)
* **Nhiệm vụ kỹ thuật:**
  * Tạo phân hệ mới `RoasteryScene.ts`: Hệ thống máy rang hạt công nghiệp và phòng thử nếm Cupping Lab.
  * Xây dựng mini-game rang hạt `RoastingCanvas.tsx`: Người chơi điều chỉnh thanh gia nhiệt bám theo đường cong nhiệt độ chuẩn (Roasting Curve: Light -> Cinnamon -> City -> Dark Roast).
  * Xây dựng phân hệ quản lý kho B2B: Ký hợp đồng cung ứng hạt mộc cho các đối tác, tạo nguồn doanh thu thụ động quy mô lớn.

### Giai Đoạn 6: Chuỗi Toàn Quốc & Nhượng Quyền Quốc Tế (End-Game)
* **Nhiệm vụ kỹ thuật:**
  * Tạo scene bản đồ thế giới `WorldMapScene.ts` (Sài Gòn, Hà Nội, Tokyo, Paris, New York).
  * Xây dựng hệ thống chuyển đổi ngoại tệ (VNĐ, JPY, USD, EUR) dựa trên tỷ giá ảo trong game.
  * Hệ thống nhượng quyền Master Franchise: Thu tiền bản quyền thương hiệu theo % doanh thu mỗi chi nhánh toàn cầu.
  * Tích hợp Prestige System: "Tái khởi nghiệp" để nhận huy hiệu Di Sản Cà Phê Thế Giới và mở khóa công thức cà phê thần thoại.

---

# CHƯƠNG 10: TIÊU CHUẨN SẢN XUẤT, KIỂM THỬ & BẢO ĐẢM CHẤT LƯỢNG

## 10.1. Tiêu Chuẩn Mã Nguồn & Kiến Trúc
1. **Tuân thủ TypeScript Strict Mode:** Tuyệt đối không sử dụng kiểu `any` lỏng lẻo. Toàn bộ thực thể (Customer, Recipe, Event, Decor) phải kế thừa từ interface chuẩn trong `src/data/gameData.ts`.
2. **Nguyên tắc Decoupling (Tách biệt tuyệt đối):**
   * Phaser 3 chỉ chịu trách nhiệm render 2D, animation, particle và phát tín hiệu qua EventBus.
   * React 19 và Tailwind v4 chịu trách nhiệm toàn bộ các bảng modal, nút bấm, HUD và tương tác người dùng.
   * Zustand chịu trách nhiệm lưu trữ và đồng bộ trạng thái duy nhất của toàn bộ ứng dụng (Single Source of Truth).
3. **Hiệu Năng & Tối Ưu Bộ Nhớ:**
   * Sử dụng Object Pooling cho hạt mưa, giọt nước cà phê và tiền xu bay để duy trì tốc độ khung hình 60 FPS ổn định trên thiết bị di động tầm trung.
   * Lazy load các modal ít sử dụng và nén sprite sheet theo chuẩn WebP/PNG tối ưu.

## 10.2. Quy Trình Kiểm Thử Bắt Buộc (Verification Protocol)
Trước khi bàn giao bất kỳ tính năng hoặc tài liệu nào vào hệ thống:
1. **Kiểm thử biên dịch mã nguồn sạch:** Chạy lệnh `npm run build` (`tsc -b && vite build`), bắt buộc mã thoát là `0` và không có bất kỳ cảnh báo lỗi TypeScript nào.
2. **Kiểm tra tương thích đa nền tảng:**
   * Kiểm thử trên kích thước Mobile (`390x844` đến `420x932`): Giao diện 9:16 nằm trọn vẹn, thanh điều hướng ngón cái không bị che khuất.
   * Kiểm thử trên kích thước PC Desktop (`>= 1024px`): Hệ thống 3 cột Tycoon Cockpit kích hoạt đầy đủ, các phím tắt `D`, `1`, `2`, `3`, `Esc` phản hồi chính xác.
3. **Kiểm tra lưu trữ an toàn (Save/Load Integrity):** Kiểm tra khả năng lưu trữ và phục hồi dữ liệu qua `localStorage` khi người dùng F5 tải lại trang, đảm bảo không bị thất thoát tiền tệ hay trang bị của người chơi.

---
*Tài liệu Game Design Document & 6-Phase Roadmap này là tài sản kỹ thuật chuẩn mực của dự án "Tiệm Cà Phê Bất Ổn", sẵn sàng làm kim chỉ nam sản xuất cho toàn bộ đội ngũ phát triển.*
