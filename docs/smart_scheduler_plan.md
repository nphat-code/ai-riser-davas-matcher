# Kế hoạch triển khai: Thuật toán xếp lịch thông minh (Smart Scheduler)

Tính năng "Smart Scheduler" nhằm mục đích tự động sắp xếp lịch hẹn (1:1 Meeting) cho Startups và Investors dựa trên điểm số (Matching Score) do AI đánh giá, đảm bảo tối ưu hóa quỹ thời gian có hạn của sự kiện. 

## 1. Bài toán xếp lịch (Scheduling Problem)
- **Đầu vào (Input):** 
  - Danh sách Startups (S).
  - Danh sách Investors (I).
  - Danh sách Điểm tương thích (Matching Scores) giữa từng cặp S-I (do AI trả về từ `/api/matchmaking`).
  - Số lượng khung giờ (Time-slots) có sẵn trong sự kiện (Ví dụ: Slot 1: 13:00, Slot 2: 13:30...).
- **Ràng buộc (Constraints):**
  1. Trong cùng 1 khung giờ, 1 Startup chỉ được gặp tối đa 1 Investor (và ngược lại). Không được trùng lịch (No Overlap).
  2. Hai người chỉ gặp nhau 1 lần duy nhất trong toàn bộ sự kiện.
  3. (Tùy chọn) Chỉ xếp lịch cho các cặp có điểm số AI đánh giá đủ cao (Ví dụ: > 75 điểm).
- **Mục tiêu (Objective):** Lấp đầy các khung giờ sao cho **tổng điểm Matching của toàn bộ sự kiện là cao nhất**, từ đó mang lại giá trị cao nhất cho các bên tham gia.

## 2. Phương pháp tiếp cận thuật toán
Vì đây là một bài toán tối ưu tổ hợp (có thể phức tạp nếu dữ liệu lớn), để phù hợp với kiến trúc Web App hiện tại, chúng ta sẽ áp dụng **Thuật toán Tham lam (Greedy Algorithm)** kết hợp với Hàng đợi (Sorting).

**Luồng chạy của thuật toán (Workflow):**
1. Nhận toàn bộ mảng `matches` từ Frontend State.
2. Sắp xếp mảng này theo thứ tự `matching_score` giảm dần (Ưu tiên các cặp hợp nhau nhất).
3. Khởi tạo mảng các khung giờ trống (Ví dụ có 5 Slots, mỗi Slot quản lý danh sách ai đang bận).
4. Duyệt qua từng cặp trong mảng `matches`:
   - Lặp qua các khung giờ từ sớm đến muộn (Slot 1, Slot 2...).
   - Kiểm tra: Tại Slot hiện tại, nếu cả Startup và Investor đều đang "Rảnh" (chưa có lịch ở slot này), thì gán cặp này vào Slot đó. Đánh dấu cả hai là "Bận".
   - Nếu bị trùng, chuyển sang Slot tiếp theo.
5. Lặp đến khi hết Slot hoặc hết danh sách. Trả về mảng Lịch trình cuối cùng.

## 3. Kế hoạch Code (Proposed Changes)
Việc xếp lịch có thể thực hiện thẳng ở phía Frontend (React) để hiển thị ngay lập tức, hoặc đưa xuống Backend (Node.js) nếu cần chia sẻ lịch cho nhiều người dùng xem cùng lúc.

#### Nếu thực hiện tại Frontend (`src/utils/scheduler.ts`):
1. Tạo thư mục `src/utils/` và file `scheduler.ts`.
2. Viết hàm `generateSmartSchedule(matches, availableSlots)`.
3. Import vào `src/App.tsx`.
4. Trong hàm `handleGenerateSchedule`, thay vì dùng `setTimeout` giả lập, ta sẽ gọi `generateSmartSchedule` và cập nhật lại state `scheduleSlots`.

#### Kiểm thử (Verification Plan):
- Giao diện AdminDashboard phải render được bảng lịch trình phân chia rõ ràng theo từng Slot và Table.
- Không có bất kỳ Startup hay Investor nào xuất hiện 2 lần trong cùng 1 Time-slot.
