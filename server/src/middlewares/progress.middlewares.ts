import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import { ErrorResponse } from '~/models/Errors'
import { progressMessages } from '~/constants/messages'

export const checkCourseAndLessonExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { course_id, lesson_id } = req.body

    const [course, lesson] = await Promise.all([
      databaseService.courses.findOne({ _id: new ObjectId(course_id) }),
      databaseService.lessons.findOne({ _id: new ObjectId(lesson_id) })
    ])

    if (!course) {
      return next(new ErrorResponse(progressMessages.COURSE_NOT_FOUND, StatusCodes.NOT_FOUND))
    }

    if (!lesson) {
      return next(new ErrorResponse(progressMessages.LESSON_NOT_FOUND, StatusCodes.NOT_FOUND))
    }

    next()
  } catch (error: any) {
     next(error)
  }
}

export const checkCourseExistParamsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const course = await databaseService.courses.findOne({ _id: new ObjectId(id) })

    if (!course) {
      return next(new ErrorResponse(progressMessages.COURSE_NOT_FOUND, StatusCodes.NOT_FOUND))
    }

    next()
  } catch (error: any) {
     next(error)
  }
}
