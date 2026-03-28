import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Course from '~/models/schemas/Course.schema'
import { CreateCourseReqBody } from '~/validations/courses.validation'

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
}

const coursesService = new CoursesService()
export default coursesService