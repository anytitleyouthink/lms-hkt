import { Router } from 'express'
import { createSectionController, getSectionsController } from '~/controllers/sections.controllers'
import { accessTokenValidationMiddleware, checkRoleMiddleware } from '~/middlewares/users.middleware'
import { UserRole } from '~/constants/enums'
import { wrapAsync } from '~/utils/handlers'

const sectionsRouter = Router()

/**
 * Description: Tạo mới một chương (Section)
 * Path: /sections
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { course_id, title, order }
 * Return: { message: string, result: Section }
 */
sectionsRouter.post(
  '/',
  accessTokenValidationMiddleware,
  // checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  wrapAsync(createSectionController)
)

/**
 * Description: Lấy danh sách các chương của 1 khóa học bằng Course ID
 * Path: /sections/course/:course_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Body: Không yêu cầu
 * Return: { message: string, result: Array<Section> }
 */
sectionsRouter.get(
  '/course/:course_id',
  accessTokenValidationMiddleware,
  wrapAsync(getSectionsController)
)

export default sectionsRouter