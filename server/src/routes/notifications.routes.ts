import { Router } from 'express';
import { getMyNotificationsController, markNotificationReadController } from '~/controllers/notifications.controllers';
import { accessTokenValidationMiddleware } from '~/middlewares/users.middleware';
import { wrapAsync } from '~/utils/handlers';

const notificationsRouter = Router();

notificationsRouter.get('/', accessTokenValidationMiddleware, wrapAsync(getMyNotificationsController));
notificationsRouter.put('/:notification_id/read', accessTokenValidationMiddleware, wrapAsync(markNotificationReadController));

export default notificationsRouter;
