import { ObjectId } from 'mongodb'
import { LessonType } from '~/constants/enums'

interface LessonPayload {
  _id?: ObjectId
   // Để truy vấn cực nhanh toàn bộ bài giảng của 1 khóa
  section_id: ObjectId  // Thuộc chương nào
  course_id: ObjectId   // Thuộc khóa học nào (Dùng để truy vấn nhanh khi có course_id mà không cần join với Section)
  title: string
  content?: string      // Chứa nội dung text (hoặc HTML do AI sinh ra)
  media_url?: string    // Chứa link Video hoặc link File tài liệu gốc
  type?: LessonType
  order: number         // Thứ tự bài học trong chương (Tự động tăng giống Section)
  created_at?: Date
  updated_at?: Date
}

export default class Lesson {
  _id: ObjectId
  section_id: ObjectId
  title: string
  content: string
  media_url: string
course_id: ObjectId
  type: LessonType
  order: number
  created_at: Date
  updated_at: Date
  constructor(lesson: LessonPayload) {
    this._id = lesson._id || new ObjectId()
    this.course_id = lesson.course_id
    this.section_id = lesson.section_id
    this.title = lesson.title
    this.content = lesson.content || ''
    this.media_url = lesson.media_url || ''
    this.type = lesson.type !== undefined ? lesson.type : LessonType.Video
    this.order = lesson.order || 1
    this.created_at = lesson.created_at || new Date()
    this.updated_at = lesson.updated_at || new Date()
  }
}