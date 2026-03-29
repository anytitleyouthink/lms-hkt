import { GoogleGenAI } from '@google/genai' // Dùng SDK mới toanh
import { PDFParse } from 'pdf-parse' 
import fs from 'fs'
import quizzesService from './quizzes.services'
import { config } from 'dotenv'

config()

// Khởi tạo client cực gọn (Nó tự động tìm process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI({})

class AiService {
  async generateQuizFromLocalFile(filePath: string, lesson_id: string, title: string) {
    try {
      // 1. Đọc file tạm từ ổ cứng
      const dataBuffer = fs.readFileSync(filePath)
      const parser = new PDFParse({ data: dataBuffer })
      const resultPdf = await parser.getText()
      const documentText = resultPdf.text

      if (!documentText || documentText.trim().length < 10) {
        throw new Error('File PDF không có nội dung chữ!')
      }
      console.log(documentText) // Debug: In ra nội dung đã đọc được từ PDF
      const prompt = `Bạn là chuyên gia thiết kế bài giảng. Tạo 5 câu hỏi trắc nghiệm JSON tiếng Việt từ nội dung này. 
      CHỈ trả về mảng JSON, KHÔNG có dấu nháy code hay chữ giải thích.
      Định dạng: [{"question_text": "...", "options": ["", "", "", ""], "correct_answer": 0, "explanation": "..."}]
      Nội dung: ${documentText}`

      // 2. Gọi AI bằng phương thức mới của @google/genai
      const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",// Dùng đúng model xịn nhất bạn vừa đọc
        contents: prompt,
      })

      // Lấy kết quả text
      let aiResponse = response.text || ''

      // 3. Làm sạch chuỗi trả về (đề phòng AI tự chèn markdown ```json)
      aiResponse = aiResponse.replace(/```json|```/g, "").trim()
      
      const questions = JSON.parse(aiResponse)

      // 4. Lưu vào Database
      const newQuiz = await quizzesService.createQuiz({
        lesson_id,
        title,
        passing_score: 80, 
        questions
      })

      // 5. Xóa file tạm 🗑️
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      return newQuiz

    } catch (error: any) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      console.error('Lỗi AiService SDK Mới:', error.message)
      throw new Error(`AI xử lý thất bại: ${error.message}`)
    }
  }
}

export default new AiService()