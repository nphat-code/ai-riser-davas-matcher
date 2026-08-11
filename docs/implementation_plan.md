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

## Giai đoạn 4: Kết nối Dữ liệu Thật & Triển khai Cloud Run (10 điểm Bonus) - ĐANG THỰC HIỆN
Mục tiêu: Đồng bộ giao diện React (Frontend) để đọc dữ liệu thật từ Google Sheets thay vì dùng `presetData.ts`, sau đó đóng gói lên Google Cloud Run.

### User Review Required
> [!IMPORTANT]
> - Để Web đọc được Sheets thật, chúng ta cần biến Apps Script thành một API mở (bằng hàm `doGet`). Việc này yêu cầu bạn sẽ phải Deploy Apps Script dưới dạng **Web App** (trên giao diện Google Apps Script).
> - Google Cloud Run yêu cầu Project của bạn phải được liên kết với Thẻ thanh toán (Billing Account). Nếu bạn dùng tài khoản chưa add thẻ, quá trình deploy sẽ bị lỗi từ chối.

### Open Questions
> [!WARNING]
> 1. Bạn đồng ý làm thêm bước xuất API từ Google Sheets để Frontend đọc dữ liệu thật chứ? (Điều này sẽ làm Frontend "xịn" đúng nghĩa).
> 2. Bạn đã cài đặt công cụ **Google Cloud CLI (`gcloud`)** trên máy tính của mình chưa?
> 3. Tài khoản Google Cloud của bạn hiện tại có đang được gắn Thẻ thanh toán (Billing) hợp lệ không? 

### Proposed Changes
#### [MODIFY] `AppsScript_Phase3.js`
- Bổ sung hàm `doGet(e)` để trả về dữ liệu (JSON) gồm danh sách Startup và Nhà đầu tư lấy trực tiếp từ Google Sheets.

#### [MODIFY] `src/App.tsx` & `src/data/...`
- Thêm logic `useEffect` và `fetch()` để gọi API từ Apps Script khi trang Web vừa load lên.
- Gắn dữ liệu thật vào các State (`startups`, `investors`) thay thế cho `PRESET_STARTUPS` và `PRESET_INVESTORS`.

#### [NEW] `Dockerfile` & `.dockerignore`
- Tạo file cấu hình để đóng gói nguyên bộ source React này thành Docker Image, sẵn sàng đẩy lên Google Cloud Run.

### Verification Plan
- **Automated Tests:** Chạy `npm run dev` ở dưới local, kiểm tra console xem dữ liệu từ Sheets đã kéo về được chưa.
- **Manual Verification:** Deploy lên Cloud Run và truy cập Web thực tế để đảm bảo giao diện hiển thị đúng những người đã điền Form đăng ký.

## Giai đoạn 5: Chuẩn bị nộp bài
- Quay Video Demo (3-5 phút).
- Viết bài post Social.
- Nộp đơn cho BTC AI Riser.
