# Trạng thái Dự án (Project State) - AI Matchmaker (DAVAS)

Tài liệu này dùng để lưu trữ tiến độ chi tiết và những gì người dùng (User) đã hoàn thành trong thực tế, giúp AI không bị mất trí nhớ về bối cảnh dự án.

## Trạng thái hiện tại (Đang ở Giai đoạn 2)

**1. Giai đoạn 1: Đã hoàn thành (100%)**
- **Google Forms & Sheets:** User ĐÃ tạo xong Google Forms thật và trút dữ liệu về Google Sheets (Form Responses). Cột tiêu đề trong Sheets là các câu hỏi thật từ Form.
- **AI Studio Prompt:** Đã test thành công System Prompt trên giao diện "Code and Chat" của AI Studio. Đã cấu hình ép kiểu trả về JSON nghiêm ngặt (`matching_score`, `reason`, `ice_breakers`).
- **Giao diện phụ:** User đã Export thành công source code React/Vite UI do AI Studio sinh ra, cất vào `src/frontend/` để dự trữ cho Giai đoạn 4.

**2. Giai đoạn 2: Đang thực hiện**
- **API Key:** Đã lấy thành công Gemini API Key (chuẩn Free Tier).
- **Apps Script:** Đã test thành công hàm `testGemini` (nhận JSON thành công). 
- **Script Matching (Hiện tại):** Đã cung cấp hàm `runMatchmaker` tự động đọc Header (Câu hỏi Form) và Value (Câu trả lời) để đóng gói gửi cho Gemini. 
- **Next step:** User đang chạy thử hàm `runMatchmaker` với dữ liệu thực tế từ Form của họ.

**3. Cấu trúc Dữ liệu thực tế (Google Sheets Headers)**
- **Investors Sheet:** `Timestamp`, `Investor or Fund Name`, `Representative Name`, `Email Address`, `Phone Number`, `Interested Industries`, `Maximum Ticket Size (USD)`, `Investment Philosophy and matching criteria`
- **Startups Sheet:** `Timestamp`, `Startup Name`, `Representative Name`, `Email Address`, `Phone Number`, `Primary Industry`, `Current Funding Stage`, `Target Funding Amount in USD`, `Upload Pitch Deck (PDF)`

**Ghi chú quan trọng cho AI:**
- KHÔNG yêu cầu User nhập dữ liệu mẫu (mock data) nếu họ đã có file Sheets liên kết với Form.
- Hệ thống Apps Script đã được thiết kế linh hoạt (đọc động theo Headers) nên không cần quan tâm cấu trúc Form của User.
