import { Request, Response, NextFunction } from 'express'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { progressMessages, userMessages } from '~/constants/messages'

export const sectionIdValidator = async (req: Request, res: Response, next: NextFunction) => {
  const section_id = req.body.section_id || req.params.section_id
  const course_id = req.body.course_id || req.params.course_id

  if (!section_id) {
    return next() 
  }

  try {
    const section = await databaseService.sections.findOne({
      _id: new ObjectId(section_id)
    })
    const course = await databaseService.courses.findOne({
      _id: new ObjectId(course_id)
    })

    if (!section || !course) {
      return res.status(404).json({ message: progressMessages.SECTION_OR_COURSE_NOT_FOUND })
    }
    next()
  } catch (error) {
    return res.status(400).json({ message: progressMessages.INVALID_SECTION_ID })
  }
}