# Tài liệu API LMS (Hệ thống Quản lý Học tập) - Bản Toàn Diện

Tài liệu này cung cấp chi tiết về các Endpoint, phương thức và định dạng dữ liệu cho hệ thống LMS. Ngôn ngữ mặc định là Tiếng Việt.

---

## 1. Nhóm Authentication (Hệ thống xác thực)


/**
 * Description: Đăng nhập vào hệ thống
 * Path: /auth/login
 * Method: POST
 * Header: Không yêu cầu
 * Body: { "email": "admin@example.com", "password": "..." }
 * Return: { "message": "Login successful", "access_token": "..." }
 */

/**
 * Description: Làm mới Access Token khi hết hạn (Sử dụng Cookie refresh_token)
 * Path: /auth/refresh-token
 * Method: POST
 * Header: Không yêu cầu (Tự động gửi Cookie)
 * Return: { "message": "Refresh token successful", "access_token": "..." }
 */

---

## 2. Nhóm Course Management (Dành cho Admin/Trainer)

/**
 * Description: Tạo khóa học mới (Có thể đính kèm URL thumbnail từ Cloudinary)
 * Path: /courses
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { "title": "Khóa học React", "description": "Học React từ cơ bản", "thumbnail": "https://res.cloudinary.com/..." }
 * Return: { "message": "Course created successfully", "result": { ... } }
 */

/**
 * Description: Xóa mềm (Soft Delete) khóa học
 * Path: /courses/:course_id/soft-delete
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Return: { "message": "Course soft deleted successfully" }
 */

/**
 * Description: Tạo Chương (Section) cho khóa học
 * Path: /sections
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { "course_id": "...", "title": "Chương 1: Giới thiệu", "order": 1 }
 * Return: { "message": "Section created successfully", "result": { ... } }
 */

/**
 * Description: Tạo Bài học (Lesson) trong một Chương
 * Path: /lessons
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { "section_id": "...", "title": "Bài 1", "video_url": "...", "type": 0, "order": 1 }
 * Return: { "message": "Lesson created successfully", "result": { ... } }
 */

/**
 * Description: Tạo bộ câu hỏi trắc nghiệm (Quiz) bằng AI từ nội dung bài học
 * Path: /quizzes
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { "lesson_id": "...", "title": "Bài kiểm tra số 1" }
 * Return: { "message": "AI đã đọc tài liệu và tạo Quiz thành công!", "result": { ... } }
 */

/**
 * Description: Duyệt yêu cầu tham gia khóa học của học viên
 * Path: /enrollments/:enrollment_id/approve
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Return: { "message": "Enrollment approved successfully" }
 */

/**
 * Description: Tìm kiếm người dùng (Dashboard nâng cao)
 * Path: /admin/users
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: ?search=keyword (Tìm theo Name hoặc Email)
 * Return: { "message": "Get profile success", "result": Array<{ ..., enrolled_courses_count: number }> }
 */

---

## 3. Nhóm Learning Flow (Dành cho Employee/Học viên)

/**
 * Description: Lấy danh sách khóa học (Tìm kiếm/Lọc)
 * Path: /courses
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: ?search=react
 * Return: { "message": "Get courses successfully", "result": Array<Course> }
 */

/**
 * Description: Đăng ký tham gia một khóa học
 * Path: /enrollments
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { "course_id": "..." }
 * Return: { "message": "Enrollment request sent, please wait for approval" }
 */

/**
 * Description: Đánh dấu hoàn thành bài học (Tự động cấp chứng chỉ nếu đạt 100%)
 * Path: /progress/complete
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { "course_id": "...", "lesson_id": "..." }
 * Return: { "message": "Lesson completed successfully", "result": { "percentage": 100, "isEligibleForCertificate": true, "certCode": "CERT-..." } }
 */

---

## 4. Nhóm Tương tác & Media

### Socket.io Chat Events
- **Cổng kết nối**: `http://localhost:4000`
- **Join Room**: `socket.emit('join_course', course_id)`
- **Send Message**: `socket.emit('send_message', { course_id, content })`
- **Receive Message**: `socket.on('receive_message', (msg) => { ... })`

/**
 * Description: Upload Ảnh/Video lên Cloudinary
 * Path: /medias/upload-image (hoặc /upload-video)
 * Method: POST
 * Body: FormData { image: File }
 * Return: { "message": "Upload image successfully", "result": { "url": "..." } }
 */

---

## 5. Certification (Chứng chỉ)

/**
 * Description: Xác thực chứng chỉ học viên bằng mã Cert Code (CÔNG KHAI)
 * Path: /certificates/verify/:cert_code
 * Method: GET
 * Return: { "message": "Certificate verified successfully", "result": { "student_name": "...", "course_name": "...", "issued_at": "..." } }
 */

---

