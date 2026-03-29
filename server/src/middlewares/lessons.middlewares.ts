import { Request, Response, NextFunction } from 'express'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'

export const lessonIdValidator = async (req: Request, res: Response, next: NextFunction) => {
  // Khi tạo Quiz, lesson_id nằm trong req.body. Khi lấy chi tiết, nó có thể nằm trong req.params
  const lesson_id = req.body.lesson_id || req.params.lesson_id

  if (!lesson_id) {
    return next() // Nếu không có thì để Zod Validation xử lý báo lỗi sau
  }

  try {
    const lesson = await databaseService.lessons.findOne({
      _id: new ObjectId(lesson_id)
    })

    if (!lesson) {
      return res.status(404).json({ message: 'Không tìm thấy Bài học (Lesson) này!' })
    }
    next()
  } catch (error) {
    return res.status(400).json({ message: 'ID Bài học không hợp lệ!' })
  }
}