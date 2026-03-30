import { Router } from 'express';
import { getMessagesByCourseController } from '~/controllers/messages.controllers';
import { accessTokenValidationMiddleware } from '~/middlewares/users.middleware';

const messagesRoutes = Router();

messagesRoutes.get(
  "/:course_id",
  accessTokenValidationMiddleware,
  getMessagesByCourseController
);

export default messagesRoutes;
