import { Request, Response } from 'express'
import { courseMessages } from '~/constants/messages'
import coursesService from '~/services/courses.services'
import { CourseIdParams, CreateCourseReqBody } from '~/validations/courses.validation'

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
export const getCoursesController = async (req: Request, res: Response) => {
  // Lấy user_id và role từ Token đã giải mã
  const { user_id, role } = req.decoded_access_token as any

  // Gọi Service
  const result = await coursesService.getCourses(user_id, role)

  return res.json({
    message: courseMessages.GET_COURSES_SUCCESS,
    result
  })
}
export const getCourseByIdController = async (req: Request<any, any, any, CourseIdParams>, res: Response) => {

  const { course_id } = req.params

  const result = await coursesService.getCourseById(course_id)

  return res.json({
    message: courseMessages.GET_COURSE_BY_ID_SUCCESS,
    result
  })
}