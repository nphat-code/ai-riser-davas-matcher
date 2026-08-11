# Kế hoạch Triển khai (Implementation Plan) - Dự án AI Matchmaker (Đề tài #10)

Đây là bản thiết kế lộ trình từng bước để xây dựng dự án từ con số 0 đến khi nộp bài. AI (tôi) sẽ đóng vai trò **Cố vấn, Người kiểm tra và Gợi ý giải pháp** ở từng bước.

## Giai đoạn 1: Xây dựng Não bộ AI & Dữ liệu đầu vào
- **Bước 1.1: Tạo Google Forms & Sheets.**
  - Tạo 2 Forms: 1 cho Startup (điền thông tin, upload Pitch Deck PDF), 1 cho Nhà đầu tư (Gu đầu tư).
  - Trút dữ liệu về 1 file Google Sheets.
- **Bước 1.2: Thiết kế System Prompt trên Google AI Studio.**
  - Đóng vai "Chuyên gia phân tích đầu tư".
  - Định nghĩa **Structured Output (JSON Schema)** để ép AI trả về: `Matching_Score`, `Reason`, và `Ice_breakers`.

## Giai đoạn 2: Tự động hóa Tích hợp (Integration)
- **Bước 2.1: Lấy API Key từ Google AI Studio.**
- **Bước 2.2: Viết Google Apps Script.**
  - Code Apps Script nhúng vào file Google Sheets.
  - Lắng nghe Trigger -> Gọi Gemini API -> Nhận JSON -> Ghi vào Sheet.

## Giai đoạn 3: Đặt lịch và Hành động (Action) - ĐANG THỰC HIỆN
Mục tiêu: Khi một cặp đấu được Gemini chấm điểm > 75, hệ thống sẽ lập tức gửi Email cho cả 2 bên và tạo sẵn một khung giờ gặp mặt (Sự kiện Calendar).

### User Review Required
> [!IMPORTANT]
> Google Apps Script có giới hạn gửi Email (thường là 100 email/ngày cho tài khoản thường). Bạn cần xác nhận xem sự kiện DAVAS của bạn dự kiến có quy mô bao nhiêu cặp đấu một ngày để tránh vượt hạn mức.

### Open Questions
> [!WARNING]
> 1. Sự kiện DAVAS sẽ diễn ra vào ngày nào? Chúng ta cần chốt một ngày cụ thể để code tự động gán ngày đó vào Google Calendar.
> 2. Bạn muốn khung giờ meeting mặc định kéo dài bao nhiêu phút (ví dụ: 30 phút)?
> 3. Bạn muốn thiết lập thư mời email bằng tiếng Anh hay tiếng Việt?

### Proposed Changes
Chúng ta sẽ viết thêm 2 hàm vào cùng một file `Code.gs` trong Apps Script:
#### [MODIFY] `Code.gs`
1. Thêm hàm `sendMatchEmail(startupEmail, investorEmail, reason, iceBreakers)` sử dụng `MailApp.sendEmail()`.
2. Thêm hàm `createCalendarEvent(startupEmail, investorEmail, date, time)` sử dụng `CalendarApp.createEvent()`.
3. Bổ sung vòng lặp điều kiện `if (score >= 75)` vào hàm `runMatchmaker` hiện tại để kích hoạt 2 hàm trên.

### Verification Plan
- **Automated Tests:** Chạy mô phỏng code với email cá nhân của bạn để đảm bảo không spam nhầm người lạ.
- **Manual Verification:** Kiểm tra Hộp thư đến (Inbox) xem thư mời có đẹp không và kiểm tra Google Calendar xem sự kiện có được tạo tự động chưa.

## Giai đoạn 4: Triển khai Cloud Run (10 điểm Bonus)
- **Bước 4.1: Làm Web Dashboard đơn giản.**
  - Lập trình trang web (Next.js/React) hiển thị kết quả cho BTC. Kết nối trực tiếp Google Sheets API.
- **Bước 4.2: Đóng gói và Deploy.**
  - Viết `Dockerfile` và deploy lên Google Cloud Run (Public).

## Giai đoạn 5: Chuẩn bị nộp bài
- Quay Video Demo (3-5 phút).
- Viết bài post Social.
- Nộp đơn cho BTC AI Riser.
