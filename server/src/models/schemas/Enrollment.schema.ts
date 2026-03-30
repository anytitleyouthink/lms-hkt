import { E } from '@faker-js/faker/dist/airline-Dz1uGqgJ'
import { ObjectId } from 'mongodb'
import { EnrollmentStatus } from '~/constants/enums'

export interface EnrollmentType {
  _id?: ObjectId
  user_id: ObjectId
  course_id: ObjectId
  status?: EnrollmentStatus
  created_at?: Date
}

export default class Enrollment {
  _id: ObjectId
  user_id: ObjectId
  course_id: ObjectId
  status: EnrollmentStatus
  created_at: Date

  constructor(enrollment: EnrollmentType) {
    this._id = enrollment._id || new ObjectId()
    this.user_id = enrollment.user_id
    this.course_id = enrollment.course_id
    this.status = enrollment.status || EnrollmentStatus.Pending
    this.created_at = enrollment.created_at || new Date()
  }
}