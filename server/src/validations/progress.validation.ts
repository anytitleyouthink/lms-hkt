import { z } from 'zod';

export const completeLessonSchema = z.object({
  body: z.object({
    course_id: z.string().length(24, { message: 'course_id phải là 24 ký tự' }),
    lesson_id: z.string().length(24, { message: 'lesson_id phải là 24 ký tự' }),
  }),
});

export const getCourseProgressSchema = z.object({
  params: z.object({
    id: z.string().length(24, { message: 'id của course phải là 24 ký tự' }),
  }),
});
