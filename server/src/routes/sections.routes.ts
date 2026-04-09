import { Router } from 'express'
import { createSectionController, deleteSectionController, updateSectionController } from '~/controllers/sections.controllers'
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
  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  wrapAsync(createSectionController)
)

/**
 * Description: Cập nhật một chương học (Section)
 * Path: /sections/:section_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: { title?, order? }
 * Return: { message: string, result: Section }
 */
sectionsRouter.patch(
  '/:section_id',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  wrapAsync(updateSectionController)
)

/**
 * Description: xóa một chương học (Section) và tất cả bài học (Lesson) bên trong nó
 * Path: /sections/:section_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Return: { message: string, result: success }
 */
sectionsRouter.delete(
  '/:section_id',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  wrapAsync(deleteSectionController)
);

export default sectionsRouter