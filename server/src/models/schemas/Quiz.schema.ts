import { ObjectId } from 'mongodb'

export interface QuestionType {
  question_text: string
  options: string[]
  correct_answer: number 
  explanation?: string   
}

// Interface định nghĩa các trường của Quiz
interface QuizType {
  _id?: ObjectId
  lesson_id: ObjectId
  title: string
  passing_score: number
  questions: QuestionType[]
  created_at?: Date
  updated_at?: Date
}

// Class thực thi để tạo object an toàn trước khi lưu vào DB
export default class Quiz {
  _id?: ObjectId
  lesson_id: ObjectId
  title: string
  passing_score: number
  questions: QuestionType[]
  created_at: Date
  updated_at: Date

  constructor(quiz: QuizType) {
    this._id = quiz._id || new ObjectId()
    this.lesson_id = quiz.lesson_id
    this.title = quiz.title
    this.passing_score = quiz.passing_score
    this.questions = quiz.questions
    this.created_at = quiz.created_at || new Date()
    this.updated_at = quiz.updated_at || new Date()
  }
}