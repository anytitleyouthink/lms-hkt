import { z } from 'zod'

export const createQuizSchema = z.object({
  body: z.object({
    lesson_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID bài học không hợp lệ'),
    title: z.string().trim().min(5, 'Tiêu đề quiz phải từ 5 ký tự'),
    passing_score: z.number().min(1).max(100),
    questions: z.array(
      z.object({
        question_text: z.string().min(1, 'Câu hỏi không được để trống'),
        options: z.array(z.string()).min(2, 'Phải có ít nhất 2 lựa chọn'),
        correct_answer: z.number().min(0), 
        explanation: z.string().optional()
      })
    ).min(1, 'Quiz phải có ít nhất 1 câu hỏi')
  })
})

export type CreateQuizReqBody = z.infer<typeof createQuizSchema>['body']