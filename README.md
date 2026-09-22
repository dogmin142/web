# MathQuiz

Prototype quiz cho khoảng 300 sinh viên, triển khai trên GitHub Pages.

## Luồng làm bài

Bản giao diện hiện tại tham khảo các mẫu tương tác phổ biến của Moodle Quiz:

- Một câu hỏi trên mỗi màn hình.
- Khối **Điều hướng bài kiểm tra** với số câu và trạng thái đã trả lời.
- Có thể **đánh dấu câu hỏi** để quay lại.
- Nút Trang trước / Trang tiếp theo.
- Đồng hồ đếm ngược và tự nộp khi hết giờ.
- Màn hình **Tóm tắt lần làm bài** trước khi nộp.
- Tối đa 3 lần làm và giữ điểm cao nhất.
- Tự lưu đáp án đang làm vào localStorage để có thể tiếp tục sau khi tải lại trang.
- MathJax cho công thức toán.
- Một vùng banner tài trợ trong mỗi màn hình câu hỏi, tách khỏi nút điều hướng.

## Cảnh báo

Đây vẫn là **prototype front-end**, chưa phù hợp cho kỳ thi chính thức. Đăng nhập, đáp án và điểm vẫn nằm trong trình duyệt.

Bản production nên chuyển sang Supabase/Postgres với xác thực tài khoản, Row Level Security, ngân hàng câu hỏi phía server, ghi nhận attempt/grade phía server, dashboard giảng viên và import/export câu hỏi.
