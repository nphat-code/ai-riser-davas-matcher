# AI Riser Vietnam 2026 - Project Guidelines

Khi làm việc với dự án này, AI bắt buộc phải tuân thủ nghiêm ngặt các nguyên tắc sau:

1. **Đề tài trọng tâm:** 
   - Đề tài #10 (Tối ưu lịch kết nối Business Matching, DAVAS Event).

2. **Quy tắc làm việc cốt lõi (Ghi nhớ vĩnh viễn):**
   - **BẮT BUỘC** phải luôn luôn "note lại những phần quan trọng" (các thay đổi lớn, tiến độ, cấu trúc dữ liệu mới) vào file `docs/project_state.md` hoặc các file tài liệu tương ứng. KHÔNG ĐƯỢC làm xong rồi bỏ quên bối cảnh.
   - **BẮT BUỘC:** Với dự án này, mọi kế hoạch (Plan/Architecture/Roadmap) phải được ghi/cập nhật trực tiếp vào file trong Source code (như `docs/plan.md` hoặc thư mục `docs/`). Memory ngắn hạn (não ẩn của AI) chỉ dùng để xử lý task hiện tại. Khi hoàn thành task, hãy tự động cập nhật trạng thái vào file plan trong source code.

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

7. **Phân công nhiệm vụ (Code Generation & AI Studio):**
   - **Tuyệt đối tuân thủ:** Tất cả các phần code chính (Core Logic, Backend, Frontend Component) của dự án sẽ do User chủ động prompt trên **Google AI Studio** để sinh ra mã nguồn.
   - **Vai trò của AI trong IDE (Tôi):** Chức năng chính chỉ là Thiết kế hệ thống (Architecture/Planning), Review Code, Debug lỗi khi cần thiết, Quản lý tài liệu (Docs), và đóng vai trò như một "Kiến trúc sư/Cố vấn kỹ thuật". KHÔNG tự ý viết mới các file tính năng lớn nếu User không yêu cầu cụ thể.

8. **Ngôn ngữ giao diện (Language):**
   - Mặc định toàn bộ ứng dụng Web (UI/UX), thông báo lỗi, nội dung text hiển thị, tên biến và tên hàm đều phải sử dụng **Tiếng Anh (English)** để đảm bảo tính chuyên nghiệp cho một sự kiện quốc tế.

