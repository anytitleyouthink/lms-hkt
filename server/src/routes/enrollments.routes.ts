import { c } from '@faker-js/faker/dist/airline-Dz1uGqgJ'
import { Router } from 'express'
import { UserRole } from '~/constants/enums'
import { approveEnrollmentController, getPendingEnrollmentsController, requestEnrollmentController } from '~/controllers/enrollments.controllers'
import { enrollValidator } from '~/middlewares/enrollments.middlewares'



import { accessTokenValidationMiddleware, checkRoleMiddleware } from '~/middlewares/users.middleware'

const enrollmentsRouter = Router()

// API cho nhân viên đăng ký học
enrollmentsRouter.post(
  '/',
  accessTokenValidationMiddleware,
  enrollValidator,     
  requestEnrollmentController
)
enrollmentsRouter.get('/pending', 
  accessTokenValidationMiddleware, 
  checkRoleMiddleware([UserRole.Trainer, UserRole.Admin]),
   getPendingEnrollmentsController)
// API cho Trainer duyệt 
enrollmentsRouter.patch(
  '/:enrollment_id/approve',
  accessTokenValidationMiddleware,
   checkRoleMiddleware([UserRole.Trainer, UserRole.Admin]), 
  approveEnrollmentController
)

export default enrollmentsRouter