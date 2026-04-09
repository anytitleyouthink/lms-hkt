import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Section from '~/models/schemas/Section.schema'
import { CreateSectionReqBody } from '~/validations/sections.validation'

class SectionsService {
  async createSection(payload: CreateSectionReqBody) {
    const { course_id, title } = payload

    // 1. Đếm xem khóa học này hiện tại đã có bao nhiêu chương rồi
    const sectionCount = await databaseService.sections.countDocuments({
      course_id: new ObjectId(course_id)
    })

    // 2. Tạo chương mới với order = số lượng hiện tại + 1
    const newSection = new Section({
      course_id: new ObjectId(course_id),
      title,
      order: sectionCount + 1
    })

    await databaseService.sections.insertOne(newSection)
    return newSection
  }

  async updateSection(section_id: string, payload: any) {
    const result = await databaseService.sections.findOneAndUpdate(
      { _id: new ObjectId(section_id) },
      { 
        $set: { 
          ...payload,
          updated_at: new Date()
        } 
      },
      { returnDocument: 'after' }
    )
    return result
  }

  // Tiện tay làm luôn hàm lấy danh sách chương của 1 khóa học
 
  
}


const sectionsService = new SectionsService()
export default sectionsService