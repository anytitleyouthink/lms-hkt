import { Request, Response } from 'express'
import { courseMessages } from '~/constants/messages'
import lessonsService from '~/services/lessons.services'
import { CreateLessonReqBody } from '~/validations/lessons.validation'

export const createLessonController = async (
  req: Request<any, any, CreateLessonReqBody>,
  res: Response
) => {
  const result = await lessonsService.createLesson(req.body)
  return res.json({
    message: courseMessages.LESSON_CREATED_SUCCESS,
    result
  })
}

export const getLessonsController = async (req: Request, res: Response) => {
  const { section_id } = req.params
  const result = await lessonsService.getLessonsBySectionId(section_id)
  return res.json({
    message: courseMessages.GET_LESSONS_SUCCESS,
    result
  })
}

export const updateLessonController = async (req: Request, res: Response) => {
  const { lesson_id } = req.params;
  const result = await lessonsService.updateLesson(lesson_id, req.body);
  if (!result) return res.status(404).json({ message: "Lesson not found" });
  return res.json({ message: "Lesson updated successfully", result });
};

export const deleteLessonController = async (req: Request, res: Response) => {
  const { lesson_id } = req.params;
  const result = await lessonsService.deleteLesson(lesson_id);
  if (!result) return res.status(404).json({ message: "Lesson not found" });
  return res.json({ message: "Lesson deleted successfully" });
};