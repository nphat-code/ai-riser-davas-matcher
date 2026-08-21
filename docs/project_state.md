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

## 2. Trạng thái hiện tại (Kiến trúc Full-Stack Mới)

Dự án đã được chuyển đổi từ việc phụ thuộc vào Google Apps Script sang một ứng dụng **Full-Stack (Node.js/Express + React/Vite)** hoàn chỉnh.

**1. Giai đoạn 1 & 2: Cấu trúc lõi & Giao diện (Đã hoàn thành 100%)**
- **Frontend (React/Vite):** 
  - Đã xây dựng hoàn thiện UI cao cấp (Glassmorphism), chia làm 2 góc nhìn: `AdminDashboard` và `ParticipantPortal`.
  - Có các chức năng: Xem tổng quan (Overview), quản lý Startups/Investors, Xem kết quả Matching, Modal hiển thị chi tiết (AIMatchModal) và sinh email (FollowUpModal).
- **Backend (Node.js/Express):** 
  - Tích hợp thành công `@google/genai` gọi Gemini API trực tiếp.
  - Endpoint `POST /api/matchmaking`: Trả về `matching_score`, `reason`, `ice_breakers`.
  - Endpoint `POST /api/ai-followup`: Sinh email và `actionItems` dựa vào ghi chú của nhà đầu tư.
- **Dữ liệu:** Hiện tại đang sử dụng Mock Data từ thư mục `src/data/mockData.ts` để dựng UI và test luồng.

**2. Giai đoạn 3: Thuật toán Smart Scheduler (Đã hoàn thành)**
- Đã triển khai thành công thuật toán xếp lịch (Greedy + Priority Queue) trên Backend, đảm bảo không trùng lặp lịch họp cho các phiên Business Matching 1:1.

**4. Giai đoạn 4: Tích hợp Google Sheets API (Đã hoàn thành)**
- Tích hợp thành công API đọc dữ liệu thật từ Google Sheets (bằng Apps Script).
- Bổ sung logic parse/làm giàu dữ liệu (Data Enrichment) tại `App.tsx` giúp format giao diện UI.

**5. Giai đoạn 5: Google Calendar & Email Sync (Đã hoàn thành)**
- Nút "Generate Smart Schedule" gọi API POST `/api/schedule` để đẩy webhook sang Apps Script.
- Tự động hóa gửi email và đặt lịch 1:1 trên Google Calendar bằng Apps Script cho từng cặp Match.

**6. Giai đoạn 6: Thuật toán Best-Fit Smart Matchmaking & Dữ liệu Chuẩn hóa (Đã hoàn thành)**
- **Semantic Sector, Stage & Ticket Size Scoring:** Thuật toán bóc tách từ khóa (tokenization), so khớp ngữ nghĩa ngành nghề, tính điểm thưởng đa ngành (Multi-sector Overlap Bonus), quét sâu ngữ nghĩa luận điểm đầu tư (Thesis Deep Scanning), lọc quy mô vốn gọi (Ticket Size Matching) và phạt lệch vòng gọi vốn.
- **Tối ưu hóa đa tiêu chí (100% Deterministic Best-Fit):** Tích hợp trọng số khẩu vị đầu tư (Thesis), phạt vốn vượt trần quỹ (`-50pts`), phạt lệch Stage (`-35pts`), phạt chống trùng lặp cặp match (`-60pts`) và cơ chế cân bằng tải (`Load Balancing`), loại bỏ ngẫu nhiên để luôn luôn chọn ra Quỹ đầu tư phù hợp nhất số 1 ngay lần bấm đầu tiên.
- **Chuẩn hóa Toàn diện Bộ Dữ liệu (62 Startups & 31 Investors):**
  - Cập nhật 62 Startups với tên gọi, người đại diện, vòng gọi vốn và ngành nghề khớp 100% (không còn tình trạng tên Edu đi với Cleantech).
  - Cập nhật 31 Quỹ đầu tư với câu Investment Thesis độc bản, chuẩn văn phong VC quốc tế trong `davas_investors.csv` và `davas_startups.csv`.
- **UI/UX Phân trang, Tìm kiếm & Persona Switcher:** 
  - Tích hợp bộ lọc ngành và phân trang (8 items/trang) cho 62 Startups và 31 Investors, kèm nút "Match VC" trực tiếp trên từng dòng.
  - Tích hợp "Investor Persona Switcher" trong Participant Portal cho phép chuyển đổi và kiểm tra lịch riêng biệt của 31 VCs.
- **Đồng bộ Lịch Trình & Cập nhật Hai Chiều với Google Sheets:**
  - Đồng bộ `save_match`, `update_schedule` và `save_followup` vào tab `Matches` trên Google Sheets (cột T: Investor_Notes, cột U: AI_Followup_Draft, cột V: Deal_Outcome).
  - Tự động hydrate (khôi phục) toàn bộ nội dung ghi chú và bản thảo email khi F5 tải lại trang.
  - **Server Pre-warming & In-Memory Caching (Tải tức thì 0.01s):** Tự động gửi request ngầm nạp dữ liệu từ Google Sheets ngay khi Server khởi động, lưu RAM 60s để triệt tiêu độ trễ Cold Start.
  - **Quy trình Điều phối 2 Bước Chuẩn hóa (2-Phase Matchmaking Workflow):** Khi vừa Match ban đầu, cặp đấu ở trạng thái `Pending Schedule` / `Table TBD`. Chỉ khi bấm "Generate Smart Schedule", hệ thống mới chính thức phân bổ ca họp, số bàn chính thức và chuyển sang `Scheduled`.
  - **Thuật toán Xếp lịch Tăng dần & Khóa Cố định (Slot-Locking Incremental Scheduler):** Khóa cứng giờ họp, số bàn, ghi chú và trạng thái của các cuộc hẹn đã chốt lịch, chỉ phân bổ khung giờ và bàn còn trống cho các cặp mới mà không làm xáo trộn lịch cũ.
- **Hệ thống Chỉ số Đo lường Động học (100% Dynamic Post-Event Analytics):**
  - "Avg AI Match Score": Tính trung bình cộng chuẩn xác theo danh sách các cặp đấu thực tế.
  - "Deal Success Rate": Tự động theo dõi dựa trên các cuộc họp đã diễn ra và có ghi chú tích cực từ VC (hiển thị `--` khi chưa có phản hồi).
  - "Term Sheets Target": Tính tổng giá trị deal gọi vốn (Pipeline Funding Value) thực tế từ các startup được ghép cặp.

**7. Giai đoạn 7: Đóng gói và Triển khai (Cloud Run)**
- Đã có file `Dockerfile` chuẩn bị cho việc đẩy lên Google Cloud Run.
- Cần public dự án và test thử.

## 3. Quy trình tổ chức và tham gia (DAVAS Workflow)

**Phase 1: Chuẩn bị & Tuyển chọn (2–3 tháng trước sự kiện)**
- Startup đăng ký hồ sơ, nộp Pitch Deck. Ban tổ chức chọn lọc.

**Phase 2: Kết nối trước sự kiện – Pre-matching (2–4 tuần trước sự kiện)**
- Sử dụng **Admin Dashboard** để chạy tính năng AI Matchmaking (chấm điểm).
- Chạy thuật toán **Smart Scheduler** để sinh ra lịch họp 1:1 (Ví dụ: Table A1, 13:00 - 13:30).

**Phase 3: Diễn ra sự kiện chính (1–2 ngày)**
- Khách mời đăng nhập **Participant Portal** xem lịch họp.
- Tại sự kiện, nhà đầu tư có thể ghi chú (Note-taking) trực tiếp trên Portal về Startup.
- Hệ thống gọi API `/api/ai-followup` để tự sinh draft email và highlight.

**Phase 4: Theo dõi & Thẩm định sau sự kiện – Post-event (3–6 tháng sau)**
- Theo dõi các Action Items và gửi Email Follow-up để tăng tỷ lệ chốt deal (Due Diligence).

---
**Ghi chú cho AI (Tôi):**
- Bối cảnh mới yêu cầu tôi làm việc chủ yếu trên Node.js/Express (`server.ts`) và React (`src/`).
- KHÔNG viết lại Apps Script để làm logic chính nữa.
