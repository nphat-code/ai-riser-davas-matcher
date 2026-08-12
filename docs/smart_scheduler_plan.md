# Kế hoạch triển khai: Thuật toán xếp lịch thông minh (Smart Scheduler)

Dựa trên sự thống nhất của chúng ta: Dùng Google Login, lưu trữ Google Sheets, và **Ưu tiên làm Thuật toán xếp lịch trước**, dưới đây là kế hoạch chi tiết để lập trình thuật toán này ngay trong source code hiện tại (bằng TypeScript).

## 1. Bài toán xếp lịch (Scheduling Problem)
- **Đầu vào (Input):** 
  - Danh sách Startups (S).
  - Danh sách Investors (I).
  - Danh sách Điểm tương thích (Matching Scores) giữa từng cặp S-I (do AI đánh giá).
  - Số lượng khung giờ (Time-slots) có sẵn (Ví dụ: 4 slots).
- **Ràng buộc (Constraints):**
  1. Trong cùng 1 khung giờ, 1 Startup chỉ được gặp tối đa 1 Investor (và ngược lại). Không được trùng lịch (No Overlap).
  2. Hai người chỉ gặp nhau 1 lần duy nhất trong toàn bộ sự kiện.
  3. Chỉ ưu tiên xếp lịch cho các cặp có điểm số đủ cao (Ví dụ: Điểm > 75).
- **Mục tiêu (Objective):** Lấp đầy các khung giờ sao cho **tổng điểm Matching của toàn bộ sự kiện là cao nhất**.

## 2. Phương pháp tiếp cận thuật toán
Để phù hợp với 1 hệ thống MVP chạy nhanh và hiệu quả, chúng ta sẽ áp dụng **Thuật toán Tham lam (Greedy Algorithm)** kết hợp với Hàng đợi Ưu tiên (Priority Queue).

**Luồng chạy của thuật toán (Workflow):**
1. Lấy tất cả các cặp có Điểm Match > 75.
2. Sắp xếp danh sách này theo thứ tự Điểm từ cao xuống thấp (Ví dụ cặp 95 điểm đứng đầu).
3. Khởi tạo các khung giờ trống (Slot 1, Slot 2, ...).
4. Duyệt qua từng cặp trong danh sách đã sắp xếp:
   - Thử nhét cặp (Startup A - Investor B) này vào khung giờ sớm nhất (Slot 1).
   - Kiểm tra điều kiện: Nếu ở Slot 1, cả Startup A và Investor B đều đang "rảnh", thì chốt lịch! Đánh dấu cả hai là "bận" ở Slot 1.
   - Nếu một trong hai người "bận", tiếp tục thử ở Slot 2, Slot 3... cho đến khi tìm được chỗ trống.
5. Thuật toán kết thúc khi đã duyệt hết danh sách hoặc các slot đã kín.

## 3. Các thay đổi về File & Code (Proposed Changes)

Chúng ta sẽ tạo ra các file tiện ích trong ứng dụng React hiện tại để mô phỏng và test thuật toán này.

### Core Component (Logic)

#### [NEW] [scheduler.ts](file:///c:/Study/Projects/ai-riser-davas-matcher/src/utils/scheduler.ts)
- Viết core logic thuật toán `generateSchedule(startups, investors, scores, numSlots, threshold)`.
- Trả về cấu trúc dữ liệu Lịch trình (Schedule) cho từng Time-slot.

#### [NEW] [SchedulerView.tsx](file:///c:/Study/Projects/ai-riser-davas-matcher/src/components/SchedulerView.tsx)
- Một trang giao diện mới (Tab mới trên UI) để bạn bấm nút "Chạy xếp lịch".
- Hiển thị kết quả xếp lịch dạng Bảng (Timeline) phân chia theo từng Slot, hiển thị rõ ai gặp ai.

#### [MODIFY] [App.tsx](file:///c:/Study/Projects/ai-riser-davas-matcher/src/App.tsx)
- Bổ sung tab `scheduler` vào thanh điều hướng.
- Import và render component `SchedulerView`.

## 4. Kế hoạch kiểm thử (Verification Plan)
- Tạo một tập dữ liệu giả lập nhỏ (5 Startups x 5 Investors) với điểm số cố định.
- Chạy thuật toán và in kết quả ra màn hình (hoặc console).
- Dò bằng mắt thường xem có cặp nào bị trùng khung giờ (Conflict) hay không, để chứng minh thuật toán hoạt động đúng ranh giới thời gian.
