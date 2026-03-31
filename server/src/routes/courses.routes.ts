import { Router } from 'express'
import { createCourseController, getCourseByIdController, getCoursesController, updateCourseController } from '~/controllers/courses.controllers'
import { getCourseProgressController } from '~/controllers/progress.controllers'
import { courseIdValidator, createCourseValidator, updateCourseValidator } from '~/middlewares/courses.middlewares'
import { checkCourseExistParamsMiddleware } from '~/middlewares/progress.middlewares'
import { getCourseProgressSchema } from '~/validations/progress.validation'
import { validate } from '~/utils/validation'
import { accessTokenValidationMiddleware, checkRoleMiddleware } from '~/middlewares/users.middleware'
import { wrapAsync } from '~/utils/handlers'
import { UserRole } from '~/constants/enums'
import { updateCourseSchema } from '~/validations/courses.validation'

const coursesRouter = Router()
/**
 * Description: Tạo mới một khóa học
 * Path: /courses
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { title, description, category, price, thumbnail, isPublish }
 * Return: { message: string, result: Course }
 */
coursesRouter.post(
  '/',
  accessTokenValidationMiddleware,
  // checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  createCourseValidator,
  wrapAsync(createCourseController)
)

/**
 * Description: Lấy danh sách tất cả các khóa học
 * Path: /courses
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Body: Không yêu cầu
 * Return: { message: string, result: Array<Course> }
 */
coursesRouter.get(
  '/',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer, UserRole.Employee]),
  wrapAsync(getCoursesController)
)

/**
 * Description: Lấy chi tiết một khóa học theo ID
 * Path: /courses/:course_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Body: Không yêu cầu
 * Return: { message: string, result: Course }
 */
coursesRouter.get(
  '/:course_id',
  accessTokenValidationMiddleware,
  courseIdValidator, 
  wrapAsync(getCourseByIdController)
)
/**
 * Description: Lấy thông tin tiến độ của một học viên đối với một khóa học cụ thể
 * Path: /courses/:id/progress
 * param :  course_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Body: Không yêu cầu
 * Return: { message: string, result: { percentage: number, isEligibleForCertificate: boolean, certCode?: string } }
 */
coursesRouter.get(
  '/:id/progress',
  accessTokenValidationMiddleware,
  validate(getCourseProgressSchema),
  checkCourseExistParamsMiddleware,
  getCourseProgressController
)

/**
 * Description: Cập nhật thông tin một khóa học
 * Path: /courses/:course_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: { title?, description?, category?, price?, thumbnail?, isPublish? }
 * Return: { message: string, result: Course }
 */
coursesRouter.patch(
  '/:course_id',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  courseIdValidator,             
 updateCourseValidator,
  wrapAsync(updateCourseController)
)
export default coursesRouter