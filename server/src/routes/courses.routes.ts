import { Router } from 'express'
import { createCourseController, getCourseByIdController, getCoursesController, updateCourseController } from '~/controllers/courses.controllers'
import { courseIdValidator, createCourseValidator, updateCourseValidator } from '~/middlewares/courses.middlewares'
import { accessTokenValidationMiddleware, checkRoleMiddleware } from '~/middlewares/users.middleware'
import { wrapAsync } from '~/utils/handlers'
import { UserRole } from '~/constants/enums'
import { updateCourseSchema } from '~/validations/courses.validation'
import validate from 'uuid/dist/validate'

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
coursesRouter.patch(
  '/:course_id',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  courseIdValidator,             
 updateCourseValidator,
  wrapAsync(updateCourseController)
)
export default coursesRouter