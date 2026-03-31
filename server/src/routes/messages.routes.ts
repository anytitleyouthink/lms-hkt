import { Router } from 'express';
import { getMessagesByCourseController } from '~/controllers/messages.controllers';
import { accessTokenValidationMiddleware } from '~/middlewares/users.middleware';

const messagesRoutes = Router();

/**
 * Description: Lấy lịch sử đoạn chat của khóa học
 * Path: /messages/:course_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Body: Không yêu cầu
 * Return: { message: string, result: Array<Message> }
 */
messagesRoutes.get(
  "/:course_id",
  accessTokenValidationMiddleware,
  getMessagesByCourseController
);

export default messagesRoutes;
