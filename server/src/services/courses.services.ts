import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Course from '~/models/schemas/Course.schema'
import { CreateCourseReqBody, UpdateCourseReqBody } from '~/validations/courses.validation'
import { CourseStatus, EnrollmentStatus, UserRole } from '~/constants/enums'
import { ErrorResponse } from '~/models/Errors'
import { courseMessages } from '~/constants/messages'
import Enrollment from '~/models/schemas/Enrollment.schema'

class CoursesService {
  async createCourse(payload: CreateCourseReqBody, trainer_id: string) {
    const newCourse = new Course({
      ...payload,
      trainer_id: new ObjectId(trainer_id)
    })

    // 2. Lưu vào Database
    const result = await databaseService.courses.insertOne(newCourse)
    const enrollement = await databaseService.enrollments.insertOne( new Enrollment({
      user_id: new ObjectId(trainer_id),
      course_id: newCourse._id,
      status: EnrollmentStatus.Approved
    }))
    return {
      newCourse
    }
  }
  async getCourses(user_id: string, role: UserRole, searchQuery?: string) {
    let matchCondition: any = {}

    if (role === UserRole.Admin) {
      // Admin: Thấy hết, tránh các khóa học bị xóa mềm
      matchCondition = { status: { $ne: CourseStatus.Deleted } } 
    } else if (role === UserRole.Trainer) {
      // Trainer: Chỉ kéo những khóa học do chính tay ông này tạo ra và chưa xóa
      matchCondition = { trainer_id: new ObjectId(user_id), status: { $ne: CourseStatus.Deleted } }
    } else if (role === UserRole.Employee) {
      // Employee: Chỉ được xem những khóa học đã được duyệt (Published)
      matchCondition = { status: CourseStatus.Published }
    }

    if (searchQuery) {
      matchCondition.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    }

    const courses = await databaseService.courses.find(matchCondition).toArray()
    return courses
  }

  async deleteCourse(course_id: string) {
    const result = await databaseService.courses.findOneAndUpdate(
      { _id: new ObjectId(course_id) },
      { 
        $set: { 
          status: CourseStatus.Deleted,
          deleted_at: new Date()
        } 
      },
      { returnDocument: 'after' }
    )
    if (!result) {
      throw new ErrorResponse(courseMessages.COURSE_NOT_FOUND, 404)
    }
    return result
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
  async updateCourse(course_id: string, payload: UpdateCourseReqBody) {
    const course = await databaseService.courses.findOneAndUpdate(
      { _id: new ObjectId(course_id) },
      {
        $set: {
          ...payload,
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' } 
    )

    if (!course) {
      throw new ErrorResponse(courseMessages.COURSE_NOT_FOUND, 404)
    }

    return course
  }
  async getCourseDetail(course_id: string) {
    try {
    // Aggregation lấy Course -> Sections -> Lessons
    const courseDetail = await databaseService.courses.aggregate([
      { 
        $match: { _id: new ObjectId(course_id) } 
      },
      {
        $lookup: {
          from: 'sections',
          localField: '_id',
          foreignField: 'course_id',
          pipeline: [
            { $sort: { order: 1 } }, 
            {
              $lookup: {
                from: 'lessons',
                localField: '_id',
                foreignField: 'section_id',
                pipeline: [
                  { $sort: { order: 1 } } 
                ],
                as: 'lessons' 
              }
            }
          ],
          as: 'sections' // Kết quả Section nhét vào field 'sections' của Course
        }
      }
    ]).toArray();
    return courseDetail;
  } catch (error) {
    throw new ErrorResponse(courseMessages.ERROR_SERVER, 500);
  }
}
}

const coursesService = new CoursesService()
export default coursesService