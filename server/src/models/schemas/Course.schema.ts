import { ObjectId } from 'mongodb'
import { CourseStatus } from '~/constants/enums'

interface CourseType {
  _id?: ObjectId
  title: string
  description: string
  thumbnail?: string
  trainer_id: ObjectId 
  status?: CourseStatus
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}

export default class Course {
  _id: ObjectId 
  title: string
  description: string
  thumbnail: string
  trainer_id: ObjectId
  status: CourseStatus
  created_at: Date
  updated_at: Date
  deleted_at: Date | null

  constructor(course: CourseType) {
    this._id = course._id || new ObjectId()
    this.title = course.title
    this.description = course.description
    this.thumbnail = course.thumbnail || ''
    this.trainer_id = course.trainer_id
    this.status = course.status !== undefined ? course.status : CourseStatus.Draft
    this.created_at = course.created_at || new Date()
    this.updated_at = course.updated_at || new Date()
    this.deleted_at = course.deleted_at || null
  }
}