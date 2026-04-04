import { c } from '@faker-js/faker/dist/airline-Dz1uGqgJ'
import { z } from 'zod'
import { LessonType } from '~/constants/enums'
import { courseMessages } from '~/constants/messages'

export const createLessonSchema = z.object({
  body: z.object({
    course_id: z.string().regex(/^[0-9a-fA-F]{24}$/, courseMessages.COURSE_ID_INVALID),
    section_id: z.string().regex(/^[0-9a-fA-F]{24}$/, courseMessages.SECTION_ID_INVALID),
    title: z.string().trim().min(2, courseMessages.LESSON_TITLE_TOO_SHORT),
    content: z.string().optional(),
    media_url: z.string().optional(),
    type: z.nativeEnum(LessonType).optional()
  })
})

export type CreateLessonReqBody = z.infer<typeof createLessonSchema>['body']