# Thiết Kế Kiến Trúc Hệ Thống (System Architecture) - DAVAS Matchmaker

Tài liệu này là bản vẽ kỹ thuật (Blueprint) tổng thể cho toàn bộ hệ thống DAVAS Matchmaker. Phiên bản này phản ánh kiến trúc Full-Stack mới nhất (React + Express), phù hợp với tiêu chí Hackathon.

## 1. Các Quyết Định Kiến Trúc (Architectural Decisions)
Hệ thống được thiết kế theo hướng **Full-Stack Web App** linh hoạt, dễ dàng scale và có giao diện (UI/UX) cao cấp.
- **Frontend (UI/UX):** Sử dụng **React** (với Vite), TailwindCSS để xây dựng giao diện Glassmorphism.
- **Backend (API/Logic):** Sử dụng **Node.js (Express)** để xử lý logic nội bộ và giao tiếp với Google Gemini.
- **AI Engine:** Tích hợp trực tiếp `@google/genai` vào Backend (Model Google Gemini) để xử lý các bài toán suy luận (4-Pillar Matching, AI Ice-breakers & Follow-up Draft).
- **Deployment (Triển khai):** Đóng gói bằng **Docker** để chạy tự động trên **Google Cloud Run** (lắng nghe cổng môi trường động `PORT`).

---

## 2. Mô hình các lớp Hệ thống (System Layers)

### Lớp 1: Giao diện người dùng (Frontend / UI - `src/`)
Được thiết kế theo hệ thống **Linear Design System** (Dark Mode cao cấp, Glassmorphism, Zero-Truncation), chia làm 2 phân hệ chính:
1. **Admin Dashboard (Dành cho Ban tổ chức):**
   - Quản lý 62 Startups và 31 Quỹ đầu tư (phân trang, bộ lọc ngành, tìm kiếm).
   - Post-Event Conversion Telemetry: Theo dõi $27.4M vốn mục tiêu luân chuyển & Term Sheet Velocity (57.9%).
   - Chạy AI Matchmaker và Thuật toán Smart Scheduler.
   - Sơ đồ 12 Bàn họp thực địa (Zones A–D tại Furama Resort Đà Nẵng) với đo lường tỷ lệ lấp đầy 100%.
2. **Participant Portal (Dành cho Khách mời - Dual Persona: Startups 🤝 Investors):**
   - Chuyển đổi linh hoạt góc nhìn giữa 31 Quỹ VC và 62 Startup Founders.
   - Hiển thị Lịch trình cá nhân 1:1, chuẩn bị Pitch Prep và gợi ý Hội thảo chuyên đề 3 ngày (AI & Bán dẫn, Web3, Market Access).
   - Điền ghi chú thẩm định (Investor Notes) và tự động sinh bản thảo Email Follow-up 4 đoạn từ Gemini AI.

### Lớp 2: Lõi xử lý nghiệp vụ (Backend API - `server.ts`)
Server Express cung cấp các API endpoints phục vụ Frontend:
1. **`POST /api/matchmaking`**: 
   - Đầu vào: Object Startup và Investor.
   - Xử lý: Xây dựng Prompt thẩm định 4 trụ cột gửi tới Gemini AI, ép kiểu Structured Output (JSON Schema).
   - Đầu ra: `matching_score`, `reason`, `ice_breakers`.
2. **`POST /api/ai-followup`**:
   - Đầu vào: Profile Startup/Investor và Ghi chú nhận định (Investor Notes).
   - Đầu ra: Bản thảo Email chuẩn mực 4 đoạn (`emailSubject`, `emailBody`), `keyTakeaways`, `actionItems`.

### Lớp 3: Tích hợp Dữ liệu & Hệ sinh thái Google (Google Workspace Integration)
- **Google Sheets Database:** Quản lý cơ sở dữ liệu thời gian thực 62 Startups, 31 VCs và lịch sử Matches.
- **Google Apps Script & CacheService:** Tầng API Middleware tích hợp bộ nhớ đệm RAM đám mây 3600s, giảm thời gian phản hồi từ 4s xuống còn < 0.2s.
- **Google Calendar API:** Tự động tạo sự kiện và đồng bộ lịch 1:1, số bàn họp vào lịch cá nhân của đại biểu.

---

## 3. Luồng dữ liệu (Data Flow) trong thực tế

1. **(Data Ingestion)** Tiếp nhận hồ sơ qua Google Forms -> Dữ liệu đổ về Google Sheets.
2. **(Admin Action)** Admin truy cập Dashboard, nhấn "Run Matchmaking". 
3. **(AI Processing)** Backend gọi Google Gemini -> Trả về bảng điểm tương thích 4 trụ cột và 3 câu hỏi AI Ice-breaker (Structured JSON).
4. **(Smart Scheduling)** Admin bấm "Generate Smart Schedule" -> Thuật toán Greedy Scheduler phân bổ tối ưu 12 bàn họp và 8 ca họp tại Furama Resort, triệt tiêu 100% trùng lịch.
5. **(Participant Action)** Đại biểu truy cập Participant Portal xem lịch cá nhân, gặp mặt và điền ghi chú.
6. **(Follow-up & Sync)** Gemini AI tự sinh email cảm ơn 4 đoạn, đồng thời dữ liệu được đồng bộ 2 chiều vào Google Sheets và Google Calendar.

---

## 4. Kiến trúc Triển khai (Deployment Architecture) - Đảm bảo +10 điểm Bonus

1. **Single Container (Docker):** Dự án đóng gói cả Frontend (sau khi build tĩnh ra `dist/`) và Backend Express vào chung 1 Docker container siêu nhẹ.
2. **Google Cloud Run:** Deploy container này lên Google Cloud Run, tự động lắng nghe cổng động qua `process.env.PORT` (mặc định 8080 trên Cloud Run / 3000 local).
3. **Hiệu năng & Khả năng mở rộng:** Kiến trúc Serverless Container giúp ứng dụng tự động co giãn (Auto-scaling), độ trễ thấp và hoàn toàn miễn phí chi phí duy trì cố định (Zero-Cost MVP).
