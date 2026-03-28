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
export const courseIdSchema = z.object({
  params: z.object({
    course_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID khóa học không hợp lệ')
  })
})
export type CourseIdParams = z.infer<typeof courseIdSchema>['params']