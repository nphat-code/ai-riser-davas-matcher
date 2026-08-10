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

## Giai đoạn 3: Đặt lịch và Hành động (Action)
- **Bước 3.1: Tích hợp Google Calendar API.**
  - Nếu `Matching_Score > 80`, Apps Script tự động tạo sự kiện lịch.
- **Bước 3.2: Tích hợp Gmail.**
  - Gửi thư mời cho cả Startup và Nhà đầu tư đính kèm `Reason` và `Ice_breakers`.

## Giai đoạn 4: Triển khai Cloud Run (10 điểm Bonus)
- **Bước 4.1: Làm Web Dashboard đơn giản.**
  - Lập trình trang web (Next.js/React) hiển thị kết quả cho BTC. Kết nối trực tiếp Google Sheets API.
- **Bước 4.2: Đóng gói và Deploy.**
  - Viết `Dockerfile` và deploy lên Google Cloud Run (Public).

## Giai đoạn 5: Chuẩn bị nộp bài
- Quay Video Demo (3-5 phút).
- Viết bài post Social.
- Nộp đơn cho BTC AI Riser.
