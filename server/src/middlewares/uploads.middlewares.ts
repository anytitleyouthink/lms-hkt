import multer from 'multer'
import fs from 'fs'

// ==============================================================
// 1. STORAGE CHO ẢNH & VIDEO (Lưu trên RAM để up Cloudinary)
// ==============================================================
const memoryStorage = multer.memoryStorage()

// Middleware cho Ảnh (Thumbnail, Avatar)
export const uploadImageMiddleware = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Chỉ chấp nhận file ảnh!'))
  }
})

// Middleware cho Video (Bài giảng)
export const uploadVideoMiddleware = multer({
  storage: memoryStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) cb(null, true)
    else cb(new Error('Chỉ chấp nhận file video!'))
  }
})

// ==============================================================
// 2. STORAGE TÁCH BIỆT CHO TÀI LIỆU (Lưu ổ cứng cho AI đọc)
// ==============================================================
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/temp'
    // Tự động tạo thư mục nếu chưa có
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    // Thêm timestamp để tên file không bao giờ bị trùng
    cb(null, `doc-${Date.now()}-${file.originalname}`)
  }
})

// Middleware cho Tài liệu (PDF/Word cho AI)
export const uploadDocMiddleware = multer({
  storage: diskStorage, // <-- Quan trọng: Đã đổi sang diskStorage
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Chỉ chấp nhận file PDF hoặc Word!'))
  }
}).single('file')