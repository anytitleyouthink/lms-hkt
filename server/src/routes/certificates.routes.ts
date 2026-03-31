import { Router } from 'express'
import { getUserCertificatesController, issueCertificateController } from '~/controllers/certificates.controllers'
import { accessTokenValidationMiddleware } from '~/middlewares/users.middleware'
import { checkEligibleForCertificateMiddleware, checkCourseExistMiddleware } from '~/middlewares/certificates.middlewares'
import { validate } from '~/utils/validation'
import { issueCertificateSchema } from '~/validations/certificates.validation'

const certificatesRouter = Router()

/**
 * Description: Phát hành chứng chỉ cho khóa học đã hoàn thành 100%
 * Path: /certificates/issue
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { course_id: string }
 * Return: { message: string, result: Certificate (bao gồm HTML template và cert_code) }
 */
certificatesRouter.post(
  '/issue',
  accessTokenValidationMiddleware,
  validate(issueCertificateSchema),
  checkCourseExistMiddleware,
  checkEligibleForCertificateMiddleware,
  issueCertificateController
)

/**
 * Description: Lấy danh sách chứng chỉ của học viên đang đăng nhập
 * Path: /certificates
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Body: không yêu cầu
 * Return: { message: string, result: Array<Certificate> }
 */
certificatesRouter.get(
  '/',
  accessTokenValidationMiddleware,
  getUserCertificatesController
)

export default certificatesRouter
