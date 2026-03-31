import { Router } from 'express'
import { completeLessonController } from '~/controllers/progress.controllers'
import { accessTokenValidationMiddleware } from '~/middlewares/users.middleware'
import { validate } from '~/utils/validation'
import { completeLessonSchema } from '~/validations/progress.validation'
import { checkCourseAndLessonExistMiddleware } from '~/middlewares/progress.middlewares'

const progressRouter = Router()

/**
 * Description: Đánh dấu hoàn thành một bài học (Lesson), tính toán % khóa học và tự động cấp chứng chỉ nếu đạt 100%
 * Path: /progress/complete
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { course_id: string, lesson_id: string }
 * Return: { message: string, result: { percentage: number, isEligibleForCertificate: boolean, certCode?: string } }
 */
progressRouter.post(
  '/complete',
  accessTokenValidationMiddleware,
  validate(completeLessonSchema),
  checkCourseAndLessonExistMiddleware,
  completeLessonController
)

export default progressRouter
