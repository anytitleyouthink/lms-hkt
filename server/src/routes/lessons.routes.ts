import { Router } from 'express'
import { createLessonController, getLessonsController } from '~/controllers/lessons.controllers'
import { accessTokenValidationMiddleware, checkRoleMiddleware } from '~/middlewares/users.middleware'

import { createLessonSchema } from '~/validations/lessons.validation'
import { UserRole } from '~/constants/enums'
import { wrapAsync } from '~/utils/handlers'
import { validate } from '~/utils/validation'
const lessonsRouter = Router()
lessonsRouter.post(
  '/',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  validate(createLessonSchema),
  wrapAsync(createLessonController)
)

lessonsRouter.get(
  '/section/:section_id',
  accessTokenValidationMiddleware,
  wrapAsync(getLessonsController)
)

export default lessonsRouter