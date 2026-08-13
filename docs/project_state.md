# Trạng thái Dự án (Project State) - AI Matchmaker (DAVAS)

Tài liệu này dùng để lưu trữ tiến độ chi tiết và những gì người dùng (User) đã hoàn thành trong thực tế, giúp AI không bị mất trí nhớ về bối cảnh dự án.

## 1. Bối cảnh & Mục tiêu của DAVAS
- **Bối cảnh:** DAVAS là sự kiện thường niên về đầu tư khởi nghiệp đổi mới sáng tạo, kết nối startup tiềm năng với quỹ đầu tư mạo hiểm, nhà đầu tư thiên thần và đối tác trong/ngoài nước. Sự kiện quy tụ hàng trăm đại biểu với các hoạt động: Pitching, Business Matching 1:1, triển lãm khởi nghiệp, hội thảo chuyên đề và lễ ký kết hợp tác.
- **Thách thức hiện tại:**
  - Ghép nối thủ công, khó đúng khẩu vị và giai đoạn đầu tư.
  - Khó tối ưu lịch Business Matching 1:1 quy mô lớn, dễ bị trùng lịch và sai đối tượng.
  - Dữ liệu hồ sơ startup/nhà đầu tư phân tán, chưa được chuẩn hóa.
  - Quản lý quy trình trước-trong-sau sự kiện phân tán trên nhiều công cụ.
  - Cần có cơ chế theo dõi và duy trì kết nối sau sự kiện.
  - Chưa đo lường được hiệu quả kết nối và tỷ lệ thành công các thương vụ.
  - Khó cá nhân hóa đề xuất lịch trình/hội thảo cho từng khách mời.
- **Mong muốn/Giải pháp:** Giải pháp AI Matchmaker cần hướng tới giải quyết bài toán tổng thể về kết nối, theo dõi, đo lường hiệu quả nói chung, hoặc có thể tập trung giải quyết sâu một số thách thức và vấn đề riêng lẻ.

## 2. Trạng thái hiện tại (Đang ở Giai đoạn 2)

**1. Giai đoạn 1: Đã hoàn thành (100%)**
- **Google Forms & Sheets:** User ĐÃ tạo xong Google Forms thật và trút dữ liệu về Google Sheets (Form Responses). Cột tiêu đề trong Sheets là các câu hỏi thật từ Form.
- **AI Studio Prompt:** Đã test thành công System Prompt trên giao diện "Code and Chat" của AI Studio. Đã cấu hình ép kiểu trả về JSON nghiêm ngặt (`matching_score`, `reason`, `ice_breakers`).
- **Giao diện phụ:** User đã Export thành công source code React/Vite UI do AI Studio sinh ra, cất vào `src/frontend/` để dự trữ cho Giai đoạn 4.

**2. Giai đoạn 2: Đã hoàn thành (100%)**
- **API Key:** Đã lấy thành công Gemini API Key (chuẩn Free Tier).
- **Apps Script:** Đã test thành công hàm `testGemini` (nhận JSON thành công). 
- **Script Matching:** Đã chạy thành công hàm `runMatchmaker`. AI đã chấm điểm chính xác (EcoGrow = 95/100, EduBot = 20/100) và xuất dữ liệu ra Sheet "Matches".
- **Kiến trúc Hệ thống (System Architecture):** Đã hoàn thiện toàn bộ bản vẽ thiết kế (`docs/system_architecture.md`). Đã cập nhật 2 điểm chốt hạ để lấy 100% điểm Bonus của Ban giám khảo:
  - (1) Bổ sung **Kiến trúc Triển khai (Deployment)** bằng Docker lên Google Cloud Run.
  - (2) Bổ sung tính năng **AI Follow-up Tracking** vào Phase 4 (AI tự động phân tích tỷ lệ chốt Deal từ kết quả khảo sát).


**3. Giai đoạn 3: Đang thực hiện**
- Tự động hóa gửi Email (Gmail) và tạo sự kiện Google Calendar cho các cặp đấu có điểm số > 75.
- **Quyết định (Cấu hình):** 
  - **Lịch:** Linh hoạt gán thời gian là `10:00 AM` của `7 ngày` kể từ lúc code chạy.
  - **Thời lượng Meeting:** 30 phút.
  - **Ngôn ngữ Email:** Tiếng Anh (Kể cả phần AI tự gen ra: Reason & Ice-breakers cũng bị ép 100% tiếng Anh bằng System Prompt).
- Đã xuất file code `AppsScript_Phase3.js` cho User.

**4. Cấu trúc Dữ liệu thực tế (Google Sheets Headers)**
- **Investors Sheet:** `Timestamp`, `Investor or Fund Name`, `Representative Name`, `Email Address`, `Phone Number`, `Interested Industries`, `Maximum Ticket Size (USD)`, `Investment Philosophy and matching criteria`
- **Startups Sheet:** `Timestamp`, `Startup Name`, `Representative Name`, `Email Address`, `Phone Number`, `Primary Industry`, `Current Funding Stage`, `Target Funding Amount in USD`, `Upload Pitch Deck (PDF)`

**Ghi chú quan trọng cho AI:**
- KHÔNG yêu cầu User nhập dữ liệu mẫu (mock data) nếu họ đã có file Sheets liên kết với Form.
- Hệ thống Apps Script đã được thiết kế linh hoạt (đọc động theo Headers) nên không cần quan tâm cấu trúc Form của User.

---

## 5. Quy trình tổ chức và tham gia (DAVAS Workflow)
Được thiết kế theo 4 giai đoạn chuẩn quốc tế cho một sự kiện gọi vốn mạo hiểm:

**Phase 1: Chuẩn bị & Tuyển chọn (2–3 tháng trước sự kiện)**
- **Ban tổ chức (BTC):**
  - Mở cổng đăng ký trực tuyến cho các dự án khởi nghiệp và gửi thư mời các quỹ đầu tư (VCs), nhà đầu tư thiên thần (Angels).
  - Thành lập Hội đồng thẩm định để sàng lọc hồ sơ, chọn ra khoảng 20–30 startup xuất sắc nhất.
- **Startup:**
  - Đăng ký hồ sơ, nộp Pitch Deck (slide thuyết trình gọi vốn) và các chỉ số kinh doanh chính (Traction, TAM/SAM/SOM, Financials).
  - Tham gia chuỗi huấn luyện (Masterclass/Coaching) do BTC tổ chức để tinh chỉnh kĩ năng thuyết trình và định giá doanh nghiệp.

**Phase 2: Kết nối trước sự kiện – Pre-matching (2–4 tuần trước sự kiện)**
- BTC công bố danh sách các startup và nhà đầu tư đã xác nhận tham gia trên hệ thống trực tuyến.
- Hệ thống tiến hành ghép đôi sơ bộ dựa trên tiêu chí đầu tư (ngành hàng, giai đoạn Seed/Series A, quy mô vốn yêu cầu).
- Nhà đầu tư và Startup đặt lịch hẹn làm việc 1:1 (Booking Meeting slots) cho ngày diễn ra sự kiện.

**Phase 3: Diễn ra sự kiện chính (1–2 ngày)**
- **1. Khai mạc & Hội thảo chuyên đề:** Báo cáo tổng quan về hệ sinh thái khởi nghiệp Đà Nẵng và chính sách ưu đãi đầu tư. Các phiên thảo luận (Panel Discussions) về xu hướng công nghệ (AI, DeepTech, ESG...) từ các chuyên gia quốc tế.
- **2. Phiên Pitching Gọi vốn (Main Stage):** Các startup được chọn lên sân khấu trình bày (thường 5 phút thuyết trình + 5 phút Q&A từ Hội đồng đầu tư). Nhà đầu tư đánh giá mô hình, tiềm năng thị trường và khả năng mở rộng quy mô.
- **3. Phiên Kết nối 1:1 (Investment Matching Area):** Doanh nghiệp và nhà đầu tư gặp gỡ trực tiếp tại các bàn làm việc riêng theo lịch đã hẹn trước để đi sâu vào số liệu tài chính và mô hình vận hành.
- **4. Ký kết Hợp tác & Vinh danh:** Lễ ký kết biên bản ghi nhớ (MOU) giữa BTC với các quỹ đầu tư hoặc giữa quỹ đầu tư và startup đã thỏa thuận thành công.

**Phase 4: Theo dõi & Thẩm định sau sự kiện – Post-event (3–6 tháng sau)**
- **Due Diligence (Thẩm định pháp lý & tài chính):** Các quỹ đầu tư có hứng thú sẽ tiếp tục rà soát sổ sách, sản phẩm, hợp đồng pháp lý của startup.
- **Đàm phán Term Sheet:** Hai bên chốt các điều khoản về tỷ lệ cổ phần, định giá công ty, quyền kiểm soát và lộ trình giải ngân.
- **Giải ngân & Hỗ trợ:** Hoàn tất thủ tục pháp lý, nhận vốn đầu tư và bắt đầu sự đồng hành từ nhà đầu tư.
- **Báo cáo hệ sinh thái:** BTC DAVAS tổng hợp giá trị các thương vụ ký kết thành công để đánh giá hiệu quả sự kiện.
