import { v2 as cloudinary } from 'cloudinary'
import { v4 as uuidv4 } from 'uuid'
import stream from 'stream'
import { config } from 'dotenv'

config()

// Cấu hình Cloudinary (Đảm bảo Tài đã có các biến này trong .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

class MediasService {
  /**
   * Hàm upload file chung cho toàn hệ thống (Ảnh, Video của khóa học)
   * @param file File lấy từ req.file của multer (đang ở dạng Buffer)
   * @param folder Tên thư mục con trên Cloudinary (vd: 'images', 'videos')
   */
  async uploadSingleMedia(file: Express.Multer.File, folder: string) {
    return new Promise((resolve, reject) => {
      // 1. Tạo luồng upload lên Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `lms/${folder}`, // Lưu vào thư mục tương ứng
          // Lấy tên file gốc bỏ đuôi, ghép với UUID để không bao giờ trùng lặp
          public_id: `${uuidv4()}-${file.originalname.split('.').slice(0, -1).join('.')}`,
          resource_type: 'auto' // Trả về nguyên bản: Tự động nhận diện Image/Video
        },
        (error, result) => {
          if (error) {
            console.error('Lỗi upload Cloudinary:', error)
            return reject(new Error('Lỗi khi upload file lên Cloudinary'))
          }
          resolve(result)
        }
      )

      // 2. Chuyển Buffer từ RAM thành Stream và bơm vào Cloudinary
      const bufferStream = new stream.PassThrough()
      bufferStream.end(file.buffer)
      bufferStream.pipe(uploadStream)
    })
  }
}

const mediasService = new MediasService()
export default mediasService