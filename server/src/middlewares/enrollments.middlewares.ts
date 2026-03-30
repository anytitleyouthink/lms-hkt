import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { ObjectId } from 'mongodb'

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