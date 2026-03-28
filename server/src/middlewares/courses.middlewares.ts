import { validate } from "~/utils/validation"; 
import { createCourseSchema } from '~/validations/courses.validation'

export const createCourseValidator = validate(createCourseSchema)