import { Router } from 'express'
import { createSectionController, getSectionsController } from '~/controllers/sections.controllers'
import { accessTokenValidationMiddleware, checkRoleMiddleware } from '~/middlewares/users.middleware'
import { UserRole } from '~/constants/enums'
import { wrapAsync } from '~/utils/handlers'

const sectionsRouter = Router()

// Tạo chương mới
sectionsRouter.post(
  '/',
  accessTokenValidationMiddleware,
  // checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  wrapAsync(createSectionController)
)

// Lấy danh sách chương của 1 khóa học (Dùng Course ID)
sectionsRouter.get(
  '/course/:course_id',
  accessTokenValidationMiddleware,
  wrapAsync(getSectionsController)
)

export default sectionsRouter