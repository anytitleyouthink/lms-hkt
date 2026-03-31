import { Router } from 'express'
import { uploadMediaController } from '~/controllers/medias.controllers'
import { uploadDocMiddleware, uploadImageMiddleware, uploadVideoMiddleware } from '~/middlewares/uploads.middlewares'

import { wrapAsync } from '~/utils/handlers'

const mediasRouter = Router()

/**
 * Description: Upload file hình ảnh
 * Path: /medias/upload-image
 * Method: POST
 * Header: Không yêu cầu header đặc biệt ngoài multipart/form-data
 * FormData: { image: File }
 * Return: { message: string, result: { url: string } }
 */
mediasRouter.post(
  '/upload-image',
  uploadImageMiddleware.single('image'),
  wrapAsync(uploadMediaController('images'))
)

/**
 * Description: Upload file Video
 * Path: /medias/upload-video
 * Method: POST
 * Header: Không yêu cầu header đặc biệt ngoài multipart/form-data
 * FormData: { video: File }
 * Return: { message: string, result: { url: string } }
 */
mediasRouter.post(
  '/upload-video',
  uploadVideoMiddleware.single('video'),
  wrapAsync(uploadMediaController('videos'))
)

// API Up Tài liệu (Cho AI)


export default mediasRouter