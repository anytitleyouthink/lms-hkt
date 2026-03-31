import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Certificate from '~/models/schemas/Certificate.schema'
import { generateCertificateHTML } from '~/utils/certificateTemplate'
import { EnrollmentStatus } from '~/constants/enums'
import { ErrorResponse } from '~/models/Errors'
import { StatusCodes } from 'http-status-codes'
import { enrollmentMessages, userMessages } from '~/constants/messages'

class CertificatesService {
  async issueCertificate(user_id: string, course_id: string) {
    const userObjId = new ObjectId(user_id)
    const courseObjId = new ObjectId(course_id)

    // Verify enrollment
    const enrollment = await databaseService.enrollments.findOne({
      user_id: userObjId,
      course_id: courseObjId,
      status: EnrollmentStatus.Approved
    })

    if (!enrollment) {
      throw new ErrorResponse(enrollmentMessages.ENROLLMENT_NOT_APPROVED, StatusCodes.FORBIDDEN)
    }

    // Check if certificate already exists
    const existingCert = await databaseService.certificates.findOne({
      user_id: userObjId,
      course_id: courseObjId
    })

    if (existingCert) {
      return existingCert
    }

    // Fetch user and course details
    const [user, course] = await Promise.all([
      databaseService.users.findOne({ _id: userObjId }),
      databaseService.courses.findOne({ _id: courseObjId })
    ])

    if (!user || !course) {
      throw new ErrorResponse(userMessages.USER_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    const studentName = user.name || "Unknown"
    const courseName = course.title || "Unknown"
    const issueDate = new Date()
    const certificateId = new ObjectId()
    const cert_code = `CERT-${courseName.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${userObjId.toString().slice(-4)}`

    // Generate HTML
    const content_html = generateCertificateHTML(
      studentName,
      courseName,
      issueDate,
      certificateId.toString()
    )

    const certificate = new Certificate({
      _id: certificateId,
      user_id: userObjId,
      course_id: courseObjId,
      cert_code,
      content_html,
      issued_at: issueDate
    })

    await databaseService.certificates.insertOne(certificate)
    return certificate
  }

  async getUserCertificates(user_id: string) {
    return await databaseService.certificates
      .aggregate([
        {
          $match: { user_id: new ObjectId(user_id) }
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'course_id',
            foreignField: '_id',
            as: 'course'
          }
        },
        {
          $unwind: '$course'
        },
        {
          $project: {
            _id: 1,
            user_id: 1,
            course_id: 1,
            cert_code: 1,
            content_html: 1,
            issued_at: 1,
            course_name: '$course.title'
          }
        }
      ])
      .toArray()
  }
}

const certificatesService = new CertificatesService()
export default certificatesService
