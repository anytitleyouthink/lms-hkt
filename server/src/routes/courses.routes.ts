import { Router } from 'express'
import { createCourseController, getCourseByIdController, getCoursesController } from '~/controllers/courses.controllers'
import { courseIdValidator, createCourseValidator } from '~/middlewares/courses.middlewares'
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
coursesRouter.get(
  '/',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer, UserRole.Employee]),
  wrapAsync(getCoursesController)
)
coursesRouter.get(
  '/:course_id',
  accessTokenValidationMiddleware,
  courseIdValidator, 
  wrapAsync(getCourseByIdController)
)
export default coursesRouter