import { c } from '@faker-js/faker/dist/airline-Dz1uGqgJ'
import { Router } from 'express'
import { UserRole } from '~/constants/enums'
import { approveEnrollmentController, getPendingEnrollmentsController, requestEnrollmentController } from '~/controllers/enrollments.controllers'
import { enrollValidator } from '~/middlewares/enrollments.middlewares'



import { accessTokenValidationMiddleware, checkRoleMiddleware } from '~/middlewares/users.middleware'

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
 * Description: Lấy danh sách các yêu cầu đăng ký đang chờ duyệt (Pending)
 * Path: /enrollments/pending
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Body: Không yêu cầu
 * Return: { message: string, result: Array<Enrollment> }
 */
enrollmentsRouter.get('/pending', 
  accessTokenValidationMiddleware, 
  checkRoleMiddleware([UserRole.Trainer, UserRole.Admin]),
   getPendingEnrollmentsController)

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
  approveEnrollmentController
)

export default enrollmentsRouter