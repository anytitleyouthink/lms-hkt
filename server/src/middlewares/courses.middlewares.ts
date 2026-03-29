import { validate } from "~/utils/validation"; 
import { courseIdSchema, createCourseSchema, updateCourseSchema } from '~/validations/courses.validation'

export const createCourseValidator = validate(createCourseSchema)
export const courseIdValidator = validate(courseIdSchema)
export const updateCourseValidator = validate(updateCourseSchema)