import { Router } from 'express'
import { createSectionController, deleteSectionController } from '~/controllers/sections.controllers'
import { accessTokenValidationMiddleware, checkRoleMiddleware } from '~/middlewares/users.middleware'
import { UserRole } from '~/constants/enums'
import { wrapAsync } from '~/utils/handlers'
import { checkEnrollmentExistMiddleware } from '~/middlewares/enrollments.middlewares'

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
 * Description: xóa một chương học (Section) và tất cả bài học (Lesson) bên trong nó
 * Path: /sections/sections/:section_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Body: Course ID (để biết xóa chương nào)
 * Return: { message: string, result: Array<Section> }
 */
sectionsRouter.delete(
  '/sections/:section_id',
  accessTokenValidationMiddleware,
  checkEnrollmentExistMiddleware,
  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  wrapAsync(deleteSectionController)
);

export default sectionsRouter