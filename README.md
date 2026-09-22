# MathQuiz

Prototype website luyện tập cho khoảng 300 sinh viên.

- Đăng nhập bằng MSSV + mật khẩu.
- 30 câu hỏi có MathJax.
- 30 phút/lượt, tối đa 3 lượt, giữ điểm cao nhất.
- Giao diện responsive.
- Có vị trí banner tài trợ nhưng không yêu cầu người học click.

## Lưu ý

Đây là prototype front-end. MSSV, mật khẩu demo, đáp án và điểm hiện được xử lý trong trình duyệt nên **chưa dùng cho thi thật**.

Bản production nên dùng Supabase Auth/Database + Row Level Security, whitelist MSSV, lưu đáp án/điểm phía server và dashboard giảng viên.

Repo được chuẩn bị để xuất bản bằng GitHub Pages.