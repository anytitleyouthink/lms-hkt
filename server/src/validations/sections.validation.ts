import { c } from '@faker-js/faker/dist/airline-Dz1uGqgJ'
import { z } from 'zod'
import { courseMessages } from '~/constants/messages'

export const createSectionSchema = z.object({
  body: z.object({
    course_id: z.string().regex(/^[0-9a-fA-F]{24}$/, courseMessages.COURSE_ID_INVALID), // Kiểm tra định dạng ObjectId
    title: z.string().trim().min(2, courseMessages.SECTION_TITLE_TOO_SHORT)
  })
})

export type CreateSectionReqBody = z.infer<typeof createSectionSchema>['body']