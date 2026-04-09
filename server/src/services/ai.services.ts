import { GoogleGenAI } from '@google/genai' // Dùng SDK mới toanh
import { PDFParse } from 'pdf-parse' 
import fs from 'fs'
import quizzesService from './quizzes.services'
import { config } from 'dotenv'
import { ObjectId } from 'mongodb'

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

      console.log('--- PDF TEXT EXTRACTED ---');
      console.log(documentText.substring(0, 500) + '...'); // Log preview
      
      const prompt = `Bạn là chuyên gia thiết kế bài giảng. Hãy tạo 5 câu hỏi trắc nghiệm khách quan từ nội dung sau đây. 
      Nội dung: ${documentText}

      Yêu cầu:
      - Trả về DỮ LIỆU JSON NGUYÊN BẢN (không có markdown, không có chữ dẫn).
      - Định dạng: Một mảng các đối tượng câu hỏi.
      - Mỗi đối tượng gồm: question_text (chuỗi), options (mảng 4 lựa chọn), correct_answer (số nguyên 0-3), explanation (giải thích tại sao chọn đáp án đó).
      - Ví dụ: [{"question_text": "...", "options": ["A", "B", "C", "D"], "correct_answer": 0, "explanation": "..."}]`

      // 2. Gọi AI bằng phương thức mới của @google/genai
      const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",// Dùng đúng model xịn nhất bạn vừa đọc
        contents: prompt,
      })

      // Lấy kết quả text
      let aiResponse = response.text || ''

      // 3. Làm sạch chuỗi trả về (đề phòng AI tự chèn markdown ```json)
      aiResponse = aiResponse.replace(/```json|```/g, "").trim()
      
      let questions = JSON.parse(aiResponse)

      // Cực kỳ quan trọng: Gắn ID duy nhất cho từng câu hỏi 
      // để Frontend phân biệt được các câu và tránh lỗi React Key
      questions = questions.map((q: any) => ({
        ...q,
        _id: new ObjectId().toString() 
      }))

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