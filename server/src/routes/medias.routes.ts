import { Router } from 'express'
import { uploadMediaController } from '~/controllers/medias.controllers'
import { uploadDocMiddleware, uploadImageMiddleware, uploadVideoMiddleware } from '~/middlewares/uploads.middlewares'

import { wrapAsync } from '~/utils/handlers'

const mediasRouter = Router()

// API Up ảnh
mediasRouter.post(
  '/upload-image',
  uploadImageMiddleware.single('image'),
  wrapAsync(uploadMediaController('images'))
)

// API Up Video
mediasRouter.post(
  '/upload-video',
  uploadVideoMiddleware.single('video'),
  wrapAsync(uploadMediaController('videos'))
)

// API Up Tài liệu (Cho AI)
mediasRouter.post(
  '/upload-doc',
  uploadDocMiddleware.single('doc'),
  wrapAsync(uploadMediaController('documents'))
)

export default mediasRouter