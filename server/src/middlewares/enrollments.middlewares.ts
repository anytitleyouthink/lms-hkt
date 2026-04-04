import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import { EnrollmentStatus } from '~/constants/enums'

export const enrollValidator = (req: Request, res: Response, next: NextFunction) => {
  const enrollSchema = z.object({
    course_id: z.string().refine((val) => ObjectId.isValid(val), {
      message: 'ID invalid!'
    })
  })

  try {

    enrollSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Dữ liệu gửi lên không chuẩn',
        errors: error.message
      })
    }
    next(error)
  }
}
export const checkEnrollmentExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { course_id } = req.body || req.params
    const user_id = (req.decoded_access_token as any)?.user_id
    const enrollment = await databaseService.enrollments.findOne({
      user_id: new ObjectId(user_id),
      course_id: new ObjectId(course_id),
       status: EnrollmentStatus.Approved
    })

    if (enrollment) {
      next()
    } else {
      return res.status(403).json({
        message: 'You are not enrolled in this course'
      })
    }
  } catch (error) {
    next(error)
  }
}