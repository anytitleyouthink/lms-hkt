import { Request, Response } from 'express'
import aiService from '../services/ai.services'

export const generateQuizController = async (req: Request, res: Response) => {
  try {
    const file = req.file // Đã được lưu vào uploads/temp nhờ uploadDocMiddleware
    const { lesson_id, title } = req.body

    // Bắt lỗi nếu user quên đính kèm file
    if (!file) {
      return res.status(400).json({ message: 'Vui lòng đính kèm file tài liệu (PDF)!' })
    }

    // Gọi Service và truyền file.path (đường dẫn lưu trên ổ cứng)
    const result = await aiService.generateQuizFromLocalFile(file.path, lesson_id, title)

    return res.json({
      message: 'AI đã đọc tài liệu và tạo Quiz thành công!',
      result
    })
  } catch (error: any) {
    console.error('Lỗi Controller:', error.message)
    return res.status(500).json({ message: error.message })
  }
}