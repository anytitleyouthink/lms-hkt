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

export const getQuizController = async (req: Request, res: Response) => {
  const { quiz_id } = req.params;
  
  const quiz = await quizzesService.getQuizToPlay(quiz_id);
  
  return res.status(200).json({
    message: 'Quiz fetched successfully',
    result: quiz
  });
};

export const submitQuizController = async (req: Request, res: Response) => {
  const { quiz_id } = req.params;
  const user_id = (req as any).decoded_access_token.user_id;
  const { user_answers } = req.body;

  const gradingResult = await quizzesService.submitQuizAnswers(user_id, quiz_id, user_answers);

  return res.status(200).json({
    message: 'Quiz submitted and graded successfully',
    result: gradingResult
  });
};