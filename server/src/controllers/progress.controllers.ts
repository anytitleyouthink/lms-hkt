import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import progressServices from '~/services/progress.services'
import { TokenPayload } from '~/models/requests/User.requests'
import { ErrorResponse } from '~/models/Errors'
import { progressMessages, userMessages } from '~/constants/messages'

export const completeLessonController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { course_id, lesson_id } = req.body
    const user = req.decoded_access_token as TokenPayload;
    const user_id = user?.user_id;

    if (!user_id) {
       return next(new ErrorResponse(userMessages.ACCESS_TOKEN_REQUIRED, StatusCodes.UNAUTHORIZED))
    }

    const result = await progressServices.completeLesson(user_id, lesson_id, course_id)

    return res.status(StatusCodes.OK).json({
      message: progressMessages.COMPLETE_SUCCESS,
      result
    })
  } catch (error: any) {
    next(new ErrorResponse(error.message || 'Failed to complete lesson', StatusCodes.BAD_REQUEST))
  }
}

export const getCourseProgressController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: course_id } = req.params
    const user = req.decoded_access_token as TokenPayload;
    const user_id = user?.user_id;

    if (!user_id) {
       return next(new ErrorResponse(userMessages.ACCESS_TOKEN_REQUIRED, StatusCodes.UNAUTHORIZED))
    }

    const result = await progressServices.getCourseProgress(user_id, course_id)

    return res.status(StatusCodes.OK).json({
      message: progressMessages.GET_SUCCESS,
      result
    })
  } catch (error: any) {
    next(new ErrorResponse(error.message || 'Failed to retrieve progress', StatusCodes.BAD_REQUEST))
  }
}
