import { Router } from 'express'

import { createQuizSchema } from '~/validations/quizzes.validation'
import { validate } from '~/utils/validation'
import { accessTokenValidationMiddleware, checkRoleMiddleware } from '~/middlewares/users.middleware'
import { lessonIdValidator } from '~/middlewares/lessons.middlewares' // Import vào đây
import { UserRole } from '~/constants/enums'
import { wrapAsync } from '~/utils/handlers'
import { generateQuizController } from '~/controllers/ai.controllers'
import { getQuizController, submitQuizController, createQuizController } from '~/controllers/quizzes.controllers'
import { uploadDocMiddleware } from '~/middlewares/uploads.middlewares'

const quizzesRouter = Router()

/**
 * Description: Tạo mới một bộ câu hỏi trắc nghiệm (Quiz) cho một Lesson bằng AI
 * Path: /quizzes
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { lesson_id: string, lesson_content?: string }
 * Return: { message: string, result: Quiz }
 */
quizzesRouter.post(
  '/',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]), 
  validate(createQuizSchema), 
  lessonIdValidator,         
  wrapAsync(generateQuizController)
)

/**
 * Description: Generate bộ câu hỏi từ file/tài liệu (Upload lên và cho AI xử lý)
 * Path: /quizzes/generate
 * Method: POST
 * Header: Tham gia multipart/form-data
 * FormData: { document: File }
 * Return: { message: string, result: GeneratedQuiz }
 */
quizzesRouter.post(
  '/generate', 
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  uploadDocMiddleware, // Bắt file và lưu xuống local trước
  generateQuizController // Xử lý AI và xóa file
)

// Get Quiz (With hidden answers via projection in service)
quizzesRouter.get(
  '/:quiz_id',
  accessTokenValidationMiddleware,
  wrapAsync(getQuizController)
);

// Submit Quiz attempt for grading
quizzesRouter.post(
  '/:quiz_id/submit',
  accessTokenValidationMiddleware,
  wrapAsync(submitQuizController)
);

export default quizzesRouter