import { z } from 'zod'
import { CourseStatus } from '~/constants/enums'
import { courseMessages } from '~/constants/messages'

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().trim().min(5, courseMessages.COURSE_TITLE_TOO_SHORT),
    description: z.string().trim().min(10, courseMessages.COURSE_DESCRIPTION_TOO_SHORT),
    thumbnail: z.string().url(courseMessages.COURSE_THUMBNAIL_INVALID).optional().or(z.literal('')),
    status: z.nativeEnum(CourseStatus).optional()
  })
})

export type CreateCourseReqBody = z.infer<typeof createCourseSchema>['body']