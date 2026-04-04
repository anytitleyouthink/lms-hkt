import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import UserProgress from '~/models/schemas/UserProgress.schema'
import certificatesService from './certificates.services'

class ProgressServices {
  async completeLesson(user_id: string, lesson_id: string, course_id: string) {
    const userObjId = new ObjectId(user_id)
    const courseObjId = new ObjectId(course_id)
    const lessonObjId = new ObjectId(lesson_id)

    // 1. Lưu lại bài học đã hoàn thành bằng Upsert (Tránh trùng lặp)
    await databaseService.userProgresses.updateOne(
      {
        user_id: userObjId,
        lesson_id: lessonObjId,
        course_id: courseObjId
      },
      {
        $setOnInsert: new UserProgress({
          user_id: userObjId,
          course_id: courseObjId,
          lesson_id: lessonObjId,
          completed_at: new Date()
        })
      },
      { upsert: true }
    )

    // 2. Tính toán Percentage
    const { percentage, isEligibleForCertificate } = await this.getCourseProgress(user_id, course_id)

    // 3. Auto-Certification nếu 100%
    let certCode = null
    if (isEligibleForCertificate) {
      // Hàm issueCertificate sẽ tự handle việc tránh tạo trùng certificate trong DB
      const result = await certificatesService.issueCertificate(user_id, course_id).catch(() => null)
      if (result) {
         certCode = result.cert_code
      }
    }

    return { percentage, isEligibleForCertificate, certCode }
  }

  async getCourseProgress(user_id: string, course_id: string) {
    const userObjId = new ObjectId(user_id)
    const courseObjId = new ObjectId(course_id)

    const sections = await databaseService.sections
      .find({ course_id: courseObjId })
      .toArray()
    const sectionIds = sections.map((sec) => sec._id)

    // Đếm số lesson thuộc các section trên
    const totalLessons = await databaseService.lessons.countDocuments({
      section_id: { $in: sectionIds }
    })

    if (totalLessons === 0) {
      // Tránh chia cho 0
      return { percentage: 0, isEligibleForCertificate: false }
    }

    // B. Tổng số bài giảng user đã học xong
    const completedLessons = await databaseService.userProgresses.countDocuments({
      user_id: userObjId,
      course_id: courseObjId
    })

    let percentage = (completedLessons / totalLessons) * 100
    if (percentage > 100) percentage = 100 // Phòng ngừa bug sửa xóa

    const isEligibleForCertificate = percentage === 100

    // C. Tìm cert code nếu có
    const existingCert = await databaseService.certificates.findOne({
      user_id: userObjId,
      course_id: courseObjId
    })

    return { 
      percentage: Number(percentage.toFixed(2)), 
      isEligibleForCertificate, 
      certCode: existingCert ? existingCert.cert_code : undefined 
    }
  }
}

const progressServices = new ProgressServices()
export default progressServices
