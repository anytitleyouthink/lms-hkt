import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TokenPayload } from '~/models/requests/User.requests'
import progressServices from '~/services/progress.services'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { ErrorResponse } from '~/models/Errors'
import { certificateMessages, enrollmentMessages, userMessages } from '~/constants/messages'

export const checkEligibleForCertificateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { course_id } = req.body
    const user = req.decoded_access_token as TokenPayload
    const user_id = user?.user_id

    if (!course_id || !user_id) {
      return next(new ErrorResponse(userMessages.VALIDATION_ERROR, StatusCodes.BAD_REQUEST))
    }

    const { isEligibleForCertificate, percentage } = await progressServices.getCourseProgress(user_id, course_id)

    if (!isEligibleForCertificate) {
      return next(new ErrorResponse(`${certificateMessages.NOT_ELIGIBLE}. Current progress: ${percentage}% (Requires 100%)`, StatusCodes.FORBIDDEN))
    }

    next()
  } catch (error: any) {
    next(error)
  }
}

export const checkCourseExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { course_id } = req.body

    const course = await databaseService.courses.findOne({ _id: new ObjectId(course_id) })

    if (!course) {
      return next(new ErrorResponse(enrollmentMessages.COURSE_NOT_FOUND, StatusCodes.NOT_FOUND)) // or courseMessages.COURSE_NOT_FOUND
    }

    next()
  } catch (error: any) {
     next(error)
  }
}
