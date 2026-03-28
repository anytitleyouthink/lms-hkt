import { Request, Response } from 'express'
import { courseMessages } from '~/constants/messages'
import coursesService from '~/services/courses.services'
import { CreateCourseReqBody } from '~/validations/courses.validation'

export const createCourseController = async (
  req: Request<any, any, CreateCourseReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_access_token as { user_id: string }
  const result = await coursesService.createCourse(req.body, user_id)
  return res.json({
    message: courseMessages.COURSE_CREATED_SUCCESS,
    result
  })
}