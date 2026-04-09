import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Lesson from '~/models/schemas/Lesson.schema'
import { CreateLessonReqBody } from '~/validations/lessons.validation'

class LessonsService {
  async createLesson(payload: CreateLessonReqBody) {
    const { section_id,course_id, title, content, media_url, type } = payload
    const lessonCount = await databaseService.lessons.countDocuments({
      section_id: new ObjectId(section_id)
    })
    const newLesson = new Lesson({
      course_id: new ObjectId(course_id),
      section_id: new ObjectId(section_id),
      title,
      content,
      media_url,
      type,
      order: lessonCount + 1
    })

    await databaseService.lessons.insertOne(newLesson)
    return newLesson
  }
  async getLessonsBySectionId(section_id: string) {
    return await databaseService.lessons
      .find({ section_id: new ObjectId(section_id) })
      .sort({ order: 1 })
      .toArray()
  }
  async updateLesson(lesson_id: string, payload: any) {
    const result = await databaseService.lessons.findOneAndUpdate(
      { _id: new ObjectId(lesson_id) },
      { $set: payload },
      { returnDocument: 'after' }
    )
    return result
  }

  async deleteLesson(lesson_id: string) {
    const result = await databaseService.lessons.findOneAndDelete(
      { _id: new ObjectId(lesson_id) }
    )
    return result
  }
}
const lessonsService = new LessonsService()
export default lessonsService