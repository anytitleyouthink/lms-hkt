import { ObjectId } from 'mongodb'

interface SectionType {
  _id?: ObjectId
  course_id: ObjectId 
  title: string
  order: number       // Thứ tự chương (1, 2, 3...)
  created_at?: Date
  updated_at?: Date
}

export default class Section {
  _id: ObjectId
  course_id: ObjectId
  title: string
  order: number
  created_at: Date
  updated_at: Date

  constructor(section: SectionType) {
    this._id = section._id || new ObjectId()
    this.course_id = section.course_id
    this.title = section.title
    this.order = section.order || 1
    this.created_at = section.created_at || new Date()
    this.updated_at = section.updated_at || new Date()
  }
}