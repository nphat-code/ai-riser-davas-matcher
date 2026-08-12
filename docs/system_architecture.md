# Thiết Kế Kiến Trúc Hệ Thống (System Architecture) - DAVAS Matchmaker

Tài liệu này là bản vẽ kỹ thuật (Blueprint) tổng thể cho toàn bộ hệ thống DAVAS Matchmaker. Nó mô tả các thành phần (Components) sẽ tương tác với nhau như thế nào xuyên suốt 4 giai đoạn của sự kiện.

## 1. Các Quyết Định Kiến Trúc (Architectural Decisions)
Dựa trên yêu cầu của bạn, hệ thống được thiết kế theo hướng **Zero-cost MVP** (Tối giản chi phí, ra mắt nhanh):
- **Authentication (Xác thực):** Sử dụng **Google Login** để đảm bảo tính bảo mật và nhanh chóng.
- **Database (Lưu trữ):** Khởi tạo với **Google Sheets** làm cơ sở dữ liệu chính yếu.
- **Backend/Logic:** Kết hợp giữa Node.js (thuật toán phức tạp) và Google Apps Script (tương tác với hệ sinh thái Google).

---

## 2. Mô hình các lớp Hệ thống (System Layers)

### Lớp 1: Giao diện người dùng (Frontend / UI)
Ứng dụng Web (React/Vite) được chia làm 2 phân hệ (Portals):
1. **Admin Dashboard (Dành cho Ban tổ chức):**
   - Xem tổng quan tất cả hồ sơ Startups / Investors.
   - Nút kích hoạt AI chấm điểm toàn bộ.
   - Nút kích hoạt **Thuật toán xếp lịch (Smart Scheduler)**.
   - Xem Dashboard thống kê sau sự kiện.
2. **Participant Portal (Dành cho Khách mời - Startups & Investors):**
   - Khách mời Đăng nhập bằng Google Login.
   - Xem Lịch trình 1:1 cá nhân (Ví dụ: 13:00 gặp quỹ A, 14:00 gặp quỹ B).
   - Gợi ý hội thảo cá nhân hóa.
   - Chức năng **Check-in & Note-taking** ngay trên web sau mỗi cuộc họp.

### Lớp 2: Lõi xử lý nghiệp vụ (Business Logic / Backend)
1. **AI Matchmaking Engine:**
   - Giao tiếp với Google Gemini API.
   - Đầu vào: Dữ liệu JSON (Hồ sơ từ Form).
   - Đầu ra: Điểm tương thích (Score 1-100), Lý do (Rationale), 3 Câu hỏi phá băng (Ice-breakers).
2. **Smart Scheduler Engine (Sẽ được code đầu tiên):**
   - Thuật toán nhận vào danh sách điểm số từ AI.
   - Đầu ra: Bảng phân bổ lịch họp (Time-slots) tối ưu nhất, cam kết không trùng lịch.

### Lớp 3: Tự động hóa & Tích hợp (Google Workspace Layer)
Được viết bằng Google Apps Script, hoạt động như một hệ thống Background Job:
1. **Lắng nghe Form Submit:** Chuẩn hóa dữ liệu ngay khi có người điền Form đăng ký.
2. **Calendar Automation:** Nhận kết quả từ thuật toán Xếp lịch -> Tự động bắn thư mời Google Calendar hàng loạt.
3. **Follow-up Trigger:** Cài đặt hẹn giờ (Time-driven). Đúng 1 tháng sau sự kiện, tự động gửi Email chứa link Google Form khảo sát tỷ lệ chốt Deal.

### Lớp 4: Cơ sở dữ liệu (Database - Google Sheets)
Cấu trúc các bảng (Sheets) chính:
- `Investors_Raw` / `Startups_Raw`: Lưu dữ liệu gốc từ Form.
- `AI_Scores_Matrix`: Bảng lưu điểm số mọi cặp đôi do AI sinh ra.
- `Final_Schedules`: Bảng lưu lịch họp chính thức (Ai - Gặp ai - Giờ nào - Bàn số mấy).
- `Post_Event_Feedback`: Nơi đổ về kết quả Note-taking và Follow-up.

---

## 3. Luồng dữ liệu (Data Flow) trong thực tế

1. **(Phase 1)** Startups/Investors điền **Google Form**. Dữ liệu chảy vào **Google Sheets**.
2. **(Phase 2)** Admin mở **Web Dashboard**, bấm nút "Chạy AI". Code sẽ kéo dữ liệu từ Sheets, gửi lên **Gemini**, nhận kết quả và lưu ngược lại Sheets.
3. **(Phase 2)** Admin tiếp tục bấm "Xếp Lịch". Code chạy **Thuật toán Smart Scheduler**, phân bổ Time-slots và chốt lịch vào bảng `Final_Schedules`.
4. **(Phase 2)** **Apps Script** đọc bảng lịch, tự động gửi **Google Calendar** cho tất cả mọi người.
5. **(Phase 3)** Khách mời tới sự kiện, mở điện thoại vào **Participant Portal** (đăng nhập Google) xem lịch, đi họp, và nhập ghi chú thẳng lên Portal.
6. **(Phase 4)** **Apps Script** tự động gửi Form khảo sát. Kết quả đổ về Sheets, Admin xem biểu đồ tỷ lệ thành công trên **Web Dashboard**.
