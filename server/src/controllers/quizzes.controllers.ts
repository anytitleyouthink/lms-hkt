import { Request, Response } from 'express'
import quizzesService from '~/services/quizzes.services'
import { CreateQuizReqBody } from '~/validations/quizzes.validation'

export const createQuizController = async (
  req: Request<any, any, CreateQuizReqBody>, 
  res: Response
) => {
  const result = await quizzesService.createQuiz(req.body)
  return res.json(result)
}