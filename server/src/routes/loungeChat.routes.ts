import { Router } from 'express';
import { getLoungeMessagesController } from '~/controllers/loungeChat.controllers';
import { accessTokenValidationMiddleware, checkRoleMiddleware } from '~/middlewares/users.middleware';
import { UserRole } from '~/constants/enums';
import { wrapAsync } from '~/utils/handlers';

const loungeChatRouter = Router();

// GET /lounge/messages
loungeChatRouter.get(
  '/messages',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  wrapAsync(getLoungeMessagesController)
);

export default loungeChatRouter;
