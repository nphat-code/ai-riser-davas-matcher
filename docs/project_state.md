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

**2. Giai đoạn 3: Thuật toán Smart Scheduler (Đang thực hiện)**
- Trên giao diện đã có nút "Generate Smart Schedule" giả lập bằng `setTimeout`.
- Cần triển khai thuật toán xếp lịch thật sự (Greedy + Priority Queue) ở Frontend hoặc Backend để tránh trùng lặp lịch họp.

**3. Giai đoạn 4: Đóng gói và Triển khai (Cloud Run)**
- Đã có file `Dockerfile` chuẩn bị cho việc đẩy lên Google Cloud Run.
- Cần hoàn thiện việc kết nối dữ liệu thật (từ Google Sheets hoặc DB) để loại bỏ Mock Data trước khi Public dự án.

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
