# Thiết Kế Kiến Trúc Hệ Thống (System Architecture) - DAVAS Matchmaker

Tài liệu này là bản vẽ kỹ thuật (Blueprint) tổng thể cho toàn bộ hệ thống DAVAS Matchmaker. Phiên bản này phản ánh kiến trúc Full-Stack mới nhất (React + Express), phù hợp với tiêu chí Hackathon.

## 1. Các Quyết Định Kiến Trúc (Architectural Decisions)
Hệ thống được thiết kế theo hướng **Full-Stack Web App** linh hoạt, dễ dàng scale và có giao diện (UI/UX) cao cấp.
- **Frontend (UI/UX):** Sử dụng **React** (với Vite), TailwindCSS để xây dựng giao diện Glassmorphism.
- **Backend (API/Logic):** Sử dụng **Node.js (Express)** để xử lý logic nội bộ và giao tiếp với Google Gemini.
- **AI Engine:** Tích hợp trực tiếp `@google/genai` vào Backend (Model `gemini-3.6-flash`) để xử lý các bài toán suy luận (Matching & Follow-up).
- **Deployment (Triển khai):** Đóng gói bằng **Docker** để chạy trên **Google Cloud Run**.

---

## 2. Mô hình các lớp Hệ thống (System Layers)

### Lớp 1: Giao diện người dùng (Frontend / UI - `src/`)
Được chia làm 2 phân hệ (Views) chính trong ứng dụng:
1. **Admin Dashboard (Dành cho Ban tổ chức):**
   - Quản lý danh sách Startups và Investors.
   - Theo dõi sự kiện (Overview Dashboard).
   - Chạy AI Matchmaker và Smart Scheduler.
2. **Participant Portal (Dành cho Khách mời - Startups & Investors):**
   - Hiển thị Lịch trình cá nhân 1:1.
   - Giao diện điền Note-taking và tạo bản nháp Follow-up email từ AI.

### Lớp 2: Lõi xử lý nghiệp vụ (Backend API - `server.ts`)
Server Express cung cấp các API endpoints phục vụ Frontend:
1. **`POST /api/matchmaking`**: 
   - Đầu vào: Object Startup và Investor.
   - Xử lý: Xây dựng Prompt tổng hợp gửi tới Gemini AI, yêu cầu Structured Output (JSON Schema).
   - Đầu ra: `matching_score`, `reason`, `ice_breakers`.
2. **`POST /api/ai-followup`**:
   - Đầu vào: Profile Startup/Investor và Ghi chú (User Notes).
   - Đầu ra: Draft Email (`emailSubject`, `emailBody`), `keyTakeaways`, `actionItems`.

### Lớp 3: Tích hợp Dữ liệu (Database / Data Layer)
- **Tình trạng hiện tại (Dev):** Đang sử dụng Mock Data (Object cứng trong mã nguồn) để kiểm thử Frontend và luồng AI.
- **Định hướng tiếp theo:** Khởi tạo lớp giao tiếp với **Google Sheets API** (hoặc DB khác) để đọc dữ liệu từ Google Forms thực tế lúc runtime.

---

## 3. Luồng dữ liệu (Data Flow) trong thực tế

1. **(Data Ingestion)** Khách điền Google Form -> Dữ liệu đổ về Google Sheets.
2. **(Admin Action)** Admin truy cập Dashboard, nhấn "Run AI Matchmaking". 
3. **(AI Processing)** Frontend gọi API `/api/matchmaking` -> Backend Node.js gọi Google Gemini -> Trả kết quả JSON về Frontend.
4. **(Scheduling)** Admin bấm "Generate Smart Schedule" -> Thuật toán sắp xếp lịch (Frontend/Backend) chia đều các Slot.
5. **(Participant Action)** Khách tham dự xem lịch trong Participant Portal, gặp mặt, điền Ghi chú vào form.
6. **(Follow-up)** Khi nhấn lưu ghi chú, Frontend gọi `/api/ai-followup` -> AI phân tích Note, tạo bản nháp Follow-up ngay lập tức để nhà đầu tư gửi cho startup.

---

## 4. Kiến trúc Triển khai (Deployment Architecture) - Đảm bảo +10 điểm Bonus

Để thỏa mãn tiêu chí bắt buộc của Hackathon (Cloud Run/Firebase):
1. **Single Container (Docker):** Dự án đóng gói cả Frontend (sau khi build tĩnh) và Backend Express vào chung 1 Docker container.
2. **Google Cloud Run:** Deploy container này lên Cloud Run, exposed cổng 3000 hoặc theo biến môi trường `PORT`.
3. Khi người dùng truy cập web, Express sẽ Serve các file tĩnh của React. Khi React gọi API `/api/*`, Express sẽ xử lý. Kiến trúc này tiết kiệm chi phí, dễ deploy và hoàn toàn Serverless.
