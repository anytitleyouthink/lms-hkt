import { Router } from 'express'
import { createCourseController } from '~/controllers/courses.controllers'
import { createCourseValidator } from '~/middlewares/courses.middlewares'
import { accessTokenValidationMiddleware, checkRoleMiddleware } from '~/middlewares/users.middleware'
import { wrapAsync } from '~/utils/handlers'
import { UserRole } from '~/constants/enums'

const coursesRouter = Router()
coursesRouter.post(
  '/',
  accessTokenValidationMiddleware,
  // checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  createCourseValidator,
  wrapAsync(createCourseController)
)

export default coursesRouter