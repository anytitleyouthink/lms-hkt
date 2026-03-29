import { Request, Response, NextFunction } from 'express'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'

export const sectionIdValidator = async (req: Request, res: Response, next: NextFunction) => {
  const section_id = req.body.section_id || req.params.section_id

  if (!section_id) {
    return next() 
  }

  try {
    const section = await databaseService.sections.findOne({
      _id: new ObjectId(section_id)
    })

    if (!section) {
      return res.status(404).json({ message: 'Không tìm thấy Chương học (Section) này!' })
    }
    next()
  } catch (error) {
    return res.status(400).json({ message: 'Định dạng ID Chương học không hợp lệ!' })
  }
}