import { Router } from 'express'
import { createCourseController, getCourseByIdController, getCoursesController, updateCourseController, deleteCourseController, getCourseDetailController } from '~/controllers/courses.controllers'
import { getCourseProgressController } from '~/controllers/progress.controllers'
import { courseIdValidator, createCourseValidator, updateCourseValidator } from '~/middlewares/courses.middlewares'
import { checkCourseExistParamsMiddleware } from '~/middlewares/progress.middlewares'
import { getCourseProgressSchema } from '~/validations/progress.validation'
import { validate } from '~/utils/validation'
import { accessTokenValidationMiddleware, checkRoleMiddleware } from '~/middlewares/users.middleware'
import { wrapAsync } from '~/utils/handlers'
import { UserRole } from '~/constants/enums'
import { updateCourseSchema } from '~/validations/courses.validation'
import { checkEnrollmentExistMiddleware } from '~/middlewares/enrollments.middlewares'

const coursesRouter = Router()
/**
 * Description: Tạo mới một khóa học
 * Path: /courses
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { title, description, thumbnail, isPublish }
 * Return: { message: string, result: Course }
 */
coursesRouter.post(
  '/',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  createCourseValidator,
  wrapAsync(createCourseController)
)

/**
 * Description: Lấy danh sách tất cả các khóa học
 * Path: /courses
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { search?: string }
 * Body: Không yêu cầu
 * Return: { message: string, result: Array<Course> }
 */
coursesRouter.get(
  '',
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
  checkEnrollmentExistMiddleware,
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
  // checkEnrollmentExistMiddleware,
  courseIdValidator,             
 updateCourseValidator,
  wrapAsync(updateCourseController)
)
/**
 * Description: Lấy chi tiết khóa học (bao gồm thông tin cơ bản + danh sách chương học + danh sách bài học)
 * Path: /courses/:course_id/detail
 * Method: get
 * Header: { Authorization: Bearer <access_token> }
 * Body: { course_id: string }
 * Return: { message: string, result: Course }
 */
coursesRouter.get(
  "/:course_id/detail",
   accessTokenValidationMiddleware, 
   checkEnrollmentExistMiddleware,
  wrapAsync(getCourseDetailController)
);

/**
 * Description: Xóa mềm khóa học
 * Path: /courses/:course_id/soft-delete
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Return: { message: string }
 */
coursesRouter.patch(
  '/:course_id/soft-delete',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  checkEnrollmentExistMiddleware,
  courseIdValidator,
  wrapAsync(deleteCourseController)
)

export default coursesRouter