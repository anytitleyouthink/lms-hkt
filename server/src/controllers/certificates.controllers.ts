import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import certificatesService from '~/services/certificates.services'
import { TokenPayload } from '~/models/requests/User.requests'
import { ErrorResponse } from '~/models/Errors'
import { certificateMessages, userMessages } from '~/constants/messages'

export const issueCertificateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { course_id } = req.body
    const user = req.decoded_access_token as TokenPayload;
    const user_id = user?.user_id;

    if (!user_id) {
       return next(new ErrorResponse(userMessages.ACCESS_TOKEN_REQUIRED, StatusCodes.UNAUTHORIZED))
    }

    const certificate = await certificatesService.issueCertificate(user_id, course_id as string)

    return res.status(StatusCodes.OK).json({
      message: certificateMessages.ISSUE_SUCCESS,
      result: certificate
    })
  } catch (error: any) {
    next(new ErrorResponse(error.message || 'Failed to issue certificate', StatusCodes.BAD_REQUEST))
  }
}

export const getUserCertificatesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.decoded_access_token as TokenPayload;
    const user_id = user?.user_id;

    if (!user_id) {
       return next(new ErrorResponse(userMessages.ACCESS_TOKEN_REQUIRED, StatusCodes.UNAUTHORIZED))
    }

    const certificates = await certificatesService.getUserCertificates(user_id)

    return res.status(StatusCodes.OK).json({
      message: certificateMessages.GET_SUCCESS,
      result: certificates
    })
  } catch (error: any) {
    next(new ErrorResponse(error.message || 'Failed to retrieve certificates', StatusCodes.BAD_REQUEST))
  }
}

export const verifyCertificateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cert_code } = req.params
    const result = await certificatesService.verifyCertificate(cert_code)

    return res.status(StatusCodes.OK).json({
      message: "Certificate verified successfully",
      result
    })
  } catch (error: any) {
    next(new ErrorResponse(error.message || 'Verification failed', StatusCodes.NOT_FOUND))
  }
}
