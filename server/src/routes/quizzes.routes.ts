import { Router } from 'express'

import { createQuizSchema } from '~/validations/quizzes.validation'
import { validate } from '~/utils/validation'
import { accessTokenValidationMiddleware, checkRoleMiddleware } from '~/middlewares/users.middleware'
import { lessonIdValidator } from '~/middlewares/lessons.middlewares' // Import vào đây
import { UserRole } from '~/constants/enums'
import { wrapAsync } from '~/utils/handlers'
import { generateQuizController } from '~/controllers/ai.controllers'
import { uploadDocMiddleware } from '~/middlewares/uploads.middlewares'

const quizzesRouter = Router()

quizzesRouter.post(
  '/',
  accessTokenValidationMiddleware,
  // checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]), 
  validate(createQuizSchema), 
  lessonIdValidator,         
  wrapAsync(generateQuizController)
)
quizzesRouter.post(
  '/generate', 
  uploadDocMiddleware, // Bắt file và lưu xuống local trước
  generateQuizController // Xử lý AI và xóa file
)

export default quizzesRouter