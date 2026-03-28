import { Request, Response } from 'express'
import { courseMessages } from '~/constants/messages'
import sectionsService from '~/services/sections.services'
import { CreateSectionReqBody } from '~/validations/sections.validation'

export const createSectionController = async (
  req: Request<any, any, CreateSectionReqBody>,
  res: Response
) => {
  const result = await sectionsService.createSection(req.body)
  return res.json({
    message: courseMessages.SECTION_CREATED_SUCCESS,
    result
  })
}

export const getSectionsController = async (req: Request, res: Response) => {
  const { course_id } = req.params
  const result = await sectionsService.getSectionsByCourseId(course_id)
  return res.json({
    message: courseMessages.GET_SECTIONS_SUCCESS,
    result
  })
}