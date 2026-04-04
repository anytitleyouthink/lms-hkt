import { c } from '@faker-js/faker/dist/airline-Dz1uGqgJ'
import { Request, Response } from 'express'
import { courseMessages } from '~/constants/messages'
import coursesService from '~/services/courses.services'
import { CourseIdParams, CreateCourseReqBody, UpdateCourseReqBody } from '~/validations/courses.validation'

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
  const search = req.query.search as string | undefined

  // Gọi Service
  const result = await coursesService.getCourses(user_id, role, search)

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
export const updateCourseController = async (
  req: Request<CourseIdParams, any, UpdateCourseReqBody>,
  res: Response
) => {
  const { course_id } = req.params
  const payload = req.body

  const result = await coursesService.updateCourse(course_id, payload)

  return res.json({
    message: courseMessages.COURSE_UPDATED_SUCCESS,
    result
  })
}
export const getCourseDetailController = async (req: Request, res: Response) => {
  const { course_id } = req.body;

    const courseDetail = await coursesService.getCourseDetail(course_id);

    // Nếu mảng rỗng tức là không tìm thấy
    if (courseDetail.length === 0) {
      return res.status(404).json({ message: courseMessages.COURSE_NOT_FOUND });
    }

    return res.json({
      message: courseMessages.GET_COURSE_DETAIL_SUCCESS,
      result: courseDetail[0] // Chỉ lấy object đầu tiên vì tìm theo ID là duy nhất
    });

  
};

export const deleteCourseController = async (req: Request<CourseIdParams>, res: Response) => {
  const { course_id } = req.params
  const result = await coursesService.deleteCourse(course_id)

  return res.json({
    message: "Course soft deleted successfully",
    result
  })
}