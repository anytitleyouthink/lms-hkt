import { Router } from "express";
import { getMeController, updateMeController, getProfileController, changePasswordController } from "~/controllers/users.controllers";
import { accessTokenValidationMiddleware, updateMeValidator, changePasswordValidator } from "~/middlewares/users.middleware";
import { filterMiddleware } from "~/middlewares/common.middleware";
import { UpdateMeReqBody } from "~/validations/users.validation";
import { wrapAsync } from "~/utils/handlers";

const userRouter = Router();

// Xem và cập nhật thông tin cá nhân (Cần login)
userRouter.get('/me', wrapAsync(getMeController));
userRouter.patch(
  '/me',
  updateMeValidator, 
  filterMiddleware(['name', 'date_of_birth', 'bio', 'location', 'website', 'username', 'avatar', 'cover_photo', 'phone'] as (keyof UpdateMeReqBody)[]),
  wrapAsync(updateMeController)
);
userRouter.put('/change-password', changePasswordValidator, wrapAsync(changePasswordController));
userRouter.get('/:username', wrapAsync(getProfileController));

export default userRouter;