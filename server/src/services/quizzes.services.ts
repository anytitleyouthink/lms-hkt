import { CreateQuizReqBody } from '~/validations/quizzes.validation'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Quiz from '~/models/schemas/Quiz.schema'

class QuizzesService {
  async createQuiz(payload: CreateQuizReqBody) {
    const newQuiz = new Quiz({
      ...payload,
      lesson_id: new ObjectId(payload.lesson_id),
    })

    const result = await databaseService.quizzes.insertOne(newQuiz)
    
    return {
      ...newQuiz
    }
  }
}

const quizzesService = new QuizzesService()
export default quizzesService