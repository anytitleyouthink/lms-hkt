import { validate } from "~/utils/validation"; 
import { courseIdSchema, createCourseSchema } from '~/validations/courses.validation'

export const createCourseValidator = validate(createCourseSchema)
export const courseIdValidator = validate(courseIdSchema)