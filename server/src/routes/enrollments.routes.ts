import { c } from '@faker-js/faker/dist/airline-Dz1uGqgJ'
import { Router } from 'express'
import { UserRole } from '~/constants/enums'
import { approveEnrollmentController, getEnrollmentRequestsByCourseController, getPendingEnrollmentsController, requestEnrollmentController, rejectEnrollmentController, getMyEnrolledCoursesController } from '~/controllers/enrollments.controllers'
import { enrollValidator } from '~/middlewares/enrollments.middlewares'



import { accessTokenValidationMiddleware, checkRoleMiddleware } from '~/middlewares/users.middleware'
import { wrapAsync } from '~/utils/handlers'

const enrollmentsRouter = Router()

/**
 * Description: Học viên gửi yêu cầu đăng ký một khóa học
 * Path: /enrollments
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { course_id: string }
 * Return: { message: string, result: Enrollment }
 */
enrollmentsRouter.post(
  '/',
  accessTokenValidationMiddleware,
  enrollValidator,     
  requestEnrollmentController
)

/**
 * Description: Lấy danh sách khóa học mà nhân viên đã tham gia thành công
 * Path: /enrollments/my-courses
 * Method: GET
 */
enrollmentsRouter.get(
  '/my-courses',
  accessTokenValidationMiddleware,
  wrapAsync(getMyEnrolledCoursesController)
)

/**
 * Description: Lấy danh sách các yêu cầu đăng ký đang chờ duyệt (Pending)
 * Path: /enrollments/pending
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { email?: string }
 * Body: Không yêu cầu
 * Return: { message: string, result: Array<Enrollment> }
 */
enrollmentsRouter.get('/:course_id/requests/pending', 
  accessTokenValidationMiddleware, 
  checkRoleMiddleware([UserRole.Trainer, UserRole.Admin]),
   wrapAsync(getPendingEnrollmentsController))

/**
 * Description: Cập nhật trạng thái duyệt/từ chối yêu cầu đăng ký
 * Path: /enrollments/:enrollment_id/approve
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: { status: string } // ví dụ: Approved, Rejected
 * Return: { message: string, result: Enrollment }
 */
enrollmentsRouter.patch(
  '/:enrollment_id/approve',
  accessTokenValidationMiddleware,
   checkRoleMiddleware([UserRole.Trainer, UserRole.Admin]), 
  wrapAsync(approveEnrollmentController)
)

/**
 * Description: Xóa/Từ chối yêu cầu đăng ký
 * Path: /enrollments/:enrollment_id/reject
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
enrollmentsRouter.delete(
  '/:enrollment_id/reject',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Trainer, UserRole.Admin]), 
  wrapAsync(rejectEnrollmentController)
)
// Path: /enrollments/:course_id/list-user-course
enrollmentsRouter.get(
  '/:course_id/list-user-course',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Trainer, UserRole.Admin]),
  wrapAsync(getEnrollmentRequestsByCourseController)
)

export default enrollmentsRouter