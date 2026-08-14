# Kế hoạch Triển khai (Implementation Plan) - Dự án AI Matchmaker (Đề tài #10)

Đây là bản thiết kế lộ trình từng bước để xây dựng dự án từ con số 0 đến khi nộp bài. Dựa trên source code Web Application hiện tại, AI (tôi) sẽ đóng vai trò **Cố vấn, Người kiểm tra và Gợi ý giải pháp** ở các bước tiếp theo.

## Giai đoạn 1 & 2: Xây dựng Core System & UI (ĐÃ HOÀN THÀNH)
- **Frontend (React/Vite):** 
  - Đã xây dựng UI hoàn chỉnh với TailwindCSS (Glassmorphism).
  - Phân tách 2 màn hình Admin Dashboard và Participant Portal.
- **Backend (Node.js/Express):** 
  - Khởi tạo Server kết hợp Vite middleware.
  - Tích hợp `@google/genai` (Gemini 3.6 Flash) với Structured Output.
  - Xây dựng 2 Endpoint: `/api/matchmaking` (đánh giá mức độ hợp nhau) và `/api/ai-followup` (soạn nháp email).

## Giai đoạn 3: Logic Ứng dụng & Smart Scheduler (ĐANG THỰC HIỆN)
Mục tiêu: Đưa các tính năng mô phỏng (Mock/setTimeout) thành các hàm logic có giá trị thực tiễn cao.

### Proposed Tasks
1. **Hoàn thiện Smart Scheduler:** 
   - Thay thế hàm mô phỏng `handleGenerateSchedule` bằng thuật toán Greedy + Priority Queue thật sự (viết bằng TypeScript) nhằm chia thời gian và không để trùng lặp (Overlap).
2. **Quản lý State:** 
   - Đảm bảo dữ liệu Matches sau khi chạy AI được lưu lại chính xác vào State và truyền vào Scheduler.

## Giai đoạn 4: Dữ liệu thật & Triển khai Cloud Run (10 điểm Bonus) - SẮP TỚI
Mục tiêu: Đọc dữ liệu từ Google Sheets thay vì Mock Data và Public dự án lên Cloud Run.

### Proposed Tasks
1. **Kết nối Google Sheets API:**
   - Sử dụng `googleapis` trong backend (Node.js) để tải dữ liệu (Startups & Investors) trực tiếp từ bảng tính.
   - Viết Endpoint `/api/data` để React Frontend fetch về khi tải trang.
2. **Triển khai (Deployment):**
   - Đã có `Dockerfile` và `package.json` cài đặt sẵn lệnh `build`.
   - Chạy lệnh `gcloud run deploy` bằng Google Cloud CLI (yêu cầu User có Billing Account).

## Giai đoạn 5: Chuẩn bị nộp bài
- Cấu hình lại giao diện (Tiếng Anh 100%) cho chuyên nghiệp.
- Quay Video Demo (3-5 phút) quá trình bấm "Run AI Matchmaker" và "Generate Smart Schedule".
- Viết bài post Social.
- Submit link AI Studio & Cloud Run cho BTC AI Riser.
