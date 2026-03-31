import { Router } from 'express'
import { createLessonController, getLessonsController } from '~/controllers/lessons.controllers'
import { accessTokenValidationMiddleware, checkRoleMiddleware } from '~/middlewares/users.middleware'

import { createLessonSchema } from '~/validations/lessons.validation'
import { UserRole } from '~/constants/enums'
import { wrapAsync } from '~/utils/handlers'
import { validate } from '~/utils/validation'
import { sectionIdValidator } from '~/middlewares/sections.middlewares'
const lessonsRouter = Router()
/**
 * Description: Tạo mới một bài học (Lesson) trong một Section
 * Path: /lessons
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { section_id, title, content, video_url, duration, order, type }
 * Return: { message: string, result: Lesson }
 */
lessonsRouter.post(
  '/',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  validate(createLessonSchema),
  sectionIdValidator,
  wrapAsync(createLessonController)
)

/**
 * Description: Lấy danh sách các bài học thuộc một Section
 * Path: /lessons/section/:section_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Body: Không yêu cầu
 * Return: { message: string, result: Array<Lesson> }
 */
lessonsRouter.get(
  '/section/:section_id',
  accessTokenValidationMiddleware,
  wrapAsync(getLessonsController)
)

export default lessonsRouter