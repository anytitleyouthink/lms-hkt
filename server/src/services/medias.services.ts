import cloudinary from '~/utils/cloudinary'
import { v4 as uuidv4 } from 'uuid'
import streamifier from 'streamifier' // Cài thêm: npm install streamifier

class MediasService {
  async uploadToCloudinary(file: Express.Multer.File, folder: string) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `lms/${folder}`, // Tự động tạo thư mục trên Cloudinary
          public_id: `${uuidv4()}-${file.originalname}`,
          resource_type: 'auto'    // Tự động nhận diện ảnh, video hoặc pdf
        },
        (error, result) => {
          if (error) return reject(error)
          resolve(result?.secure_url) 
        }
      )

      // Đẩy Buffer từ RAM vào stream của Cloudinary
      streamifier.createReadStream(file.buffer).pipe(uploadStream)
    })
  }
}

const mediasService = new MediasService()
export default mediasService