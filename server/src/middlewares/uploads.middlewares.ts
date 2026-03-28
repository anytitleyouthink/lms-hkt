import multer from 'multer'

const storage = multer.memoryStorage()

// Middleware cho Ảnh (Thumbnail, Avatar)
export const uploadImageMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Chỉ chấp nhận file ảnh!'))
  }
})

// Middleware cho Video (Bài giảng)
export const uploadVideoMiddleware = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) cb(null, true)
    else cb(new Error('Chỉ chấp nhận file video!'))
  }
})

// Middleware cho Tài liệu (PDF/Word cho AI)
export const uploadDocMiddleware = multer({
  storage,
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
})