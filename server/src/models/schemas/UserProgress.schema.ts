import { ObjectId } from 'mongodb'

interface UserProgressType {
  _id?: ObjectId
  user_id: ObjectId
  course_id: ObjectId
  lesson_id: ObjectId
  completed_at?: Date
}

export default class UserProgress {
  _id: ObjectId
  user_id: ObjectId
  course_id: ObjectId
  lesson_id: ObjectId
  completed_at: Date

  constructor(progress: UserProgressType) {
    this._id = progress._id || new ObjectId()
    this.user_id = progress.user_id
    this.course_id = progress.course_id
    this.lesson_id = progress.lesson_id
    this.completed_at = progress.completed_at || new Date()
  }
}
