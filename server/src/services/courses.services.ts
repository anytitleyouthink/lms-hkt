import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Course from '~/models/schemas/Course.schema'
import { CreateCourseReqBody } from '~/validations/courses.validation'
import { CourseStatus, UserRole } from '~/constants/enums'
import { ErrorResponse } from '~/models/Errors'
import { courseMessages } from '~/constants/messages'

class CoursesService {
  async createCourse(payload: CreateCourseReqBody, trainer_id: string) {
    const newCourse = new Course({
      ...payload,
      trainer_id: new ObjectId(trainer_id)
    })

    // 2. Lưu vào Database
    const result = await databaseService.courses.insertOne(newCourse)
    return {
      newCourse
    }
  }
  async getCourses(user_id: string, role: UserRole) {
    let matchCondition: any = {}

    if (role === UserRole.Admin) {
      // Admin: "Thấy hết, biết hết", không cần lọc gì cả (hoặc sau này lọc theo param tùy ý)
      matchCondition = {} 
    } else if (role === UserRole.Trainer) {
      // Trainer: Chỉ kéo những khóa học do chính tay ông này tạo ra (bao gồm cả Nháp)
      matchCondition = { trainer_id: new ObjectId(user_id) }
    } else if (role === UserRole.Employee) {
      // Employee: Chỉ được xem những khóa học đã được duyệt (Published)
      matchCondition = { status: CourseStatus.Published }
    }

    const courses = await databaseService.courses.find(matchCondition).toArray()
    return courses
  }
  async getCourseById(course_id: string) {
    const course = await databaseService.courses.findOne({
      _id: new ObjectId(course_id)
    })

    // Lỡ user truyền ID đúng format 24 ký tự nhưng không có thật trong DB
    if (!course) {
      throw new ErrorResponse(courseMessages.COURSE_NOT_FOUND, 404)
    }

    return course
  }
}

const coursesService = new CoursesService()
export default coursesService