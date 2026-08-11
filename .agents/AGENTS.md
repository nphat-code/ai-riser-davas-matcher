# AI Riser Vietnam 2026 - Project Guidelines

Khi làm việc với dự án này, AI bắt buộc phải tuân thủ nghiêm ngặt các nguyên tắc sau:

1. **Đề tài trọng tâm:** 
   - Đề tài #10 (Tối ưu lịch kết nối Business Matching, DAVAS Event).

2. **Quy tắc làm việc cốt lõi (Ghi nhớ vĩnh viễn):**
   - **BẮT BUỘC** phải luôn luôn "note lại những phần quan trọng" (các thay đổi lớn, tiến độ, cấu trúc dữ liệu mới) vào file `project_state.md` hoặc các file tài liệu tương ứng. KHÔNG ĐƯỢC làm xong rồi bỏ quên bối cảnh.

3. **Công nghệ cốt lõi:** 
   - Bắt buộc lấy **Google AI Studio (Gemini)** làm bộ não xử lý (Sử dụng System Instructions, Multimodal, và Structured Outputs JSON schema).

4. **Kiến trúc Hệ sinh thái Google (Zero-cost MVP):** 
   - Ưu tiên sử dụng các công cụ có sẵn của Google để lấy điểm cộng:
     - **Input:** Google Forms
     - **Storage/Trigger:** Google Drive, Google Sheets, Google Apps Script
     - **Action:** Google Calendar API (đặt lịch tự động)
     - **Deployment:** Web/Dashboard được build và host trên Google Cloud Run hoặc Firebase.

5. **Tính năng bắt buộc (Nâng cao):**
   - Phải có tính năng AI Ice-breaker (AI tạo 3 câu hỏi phá băng trước cuộc gặp).
   - Phải có AI Follow-up Tracking (AI tự động hỏi thăm và vẽ biểu đồ tỷ lệ thành công sau sự kiện).

6. **Tiêu chí chấm điểm & Checklist nộp bài (Hackathon Rules):**
   - **Mục tiêu 100 điểm (Core):** Đảm bảo tính sáng tạo, tính khả thi và tiềm năng tác động của AI Matchmaker.
   - **Mục tiêu +10 điểm Bonus (Ecosystem):** Bắt buộc tích hợp đa dạng các công nghệ Google (Google Workspace, Calendar, Sheets, Drive) bên cạnh Gemini.
   - **Mục tiêu +10 điểm Bonus (Deployment):** Web/Dashboard của dự án BẮT BUỘC phải được deploy và chạy thực tế trên **Google Cloud Run** ở chế độ công khai.
   - **Mục tiêu +3 điểm Bonus (Speed):** Nỗ lực hoàn thiện và nộp sớm nhất có thể.
   - **Checklist bắt buộc khi nộp bài:**
     - [ ] Link dự án trên Google AI Studio.
     - [ ] Link ứng dụng chạy thực tế trên Google Cloud Run.
     - [ ] Video Demo trên YouTube (Công khai).
     - [ ] Bài đăng mạng xã hội chia sẻ hành trình tham gia.
