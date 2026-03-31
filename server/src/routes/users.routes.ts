import { Router } from "express";
import { getMeController, updateMeController, getProfileController, changePasswordController } from "~/controllers/users.controllers";
import { accessTokenValidationMiddleware, updateMeValidator, changePasswordValidator } from "~/middlewares/users.middleware";
import { filterMiddleware } from "~/middlewares/common.middleware";
import { UpdateMeReqBody } from "~/validations/users.validation";
import { wrapAsync } from "~/utils/handlers";

const userRouter = Router();

/**
 * Description: Xem thông tin cá nhân của người dùng đang đăng nhập
 * Path: /users/me
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Body: Không yêu cầu
 * Return: { message: string, result: User }
 */
userRouter.get('/me', wrapAsync(getMeController));
/**
 * Description: Cập nhật thông tin cá nhân
 * Path: /users/me
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: { name?, date_of_birth?, bio?, location?, website?, username?, cover_photo?, phone? }
 * Return: { message: string, result: User }
 */
userRouter.patch(
  '/me',
  updateMeValidator, 
  filterMiddleware(['name', 'date_of_birth', 'bio', 'location', 'website', 'username', 'cover_photo', 'phone'] as (keyof UpdateMeReqBody)[]),
  wrapAsync(updateMeController)
);

/**
 * Description: Thay đổi mật khẩu
 * Path: /users/change-password
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: { old_password, new_password, confirm_password }
 * Return: { message: string }
 */
userRouter.put('/change-password', changePasswordValidator, wrapAsync(changePasswordController));

/**
 * Description: Lấy thông tin public profile của một user theo username
 * Path: /users/:username
 * Method: GET
 * Header: Không yêu cầu (hoặc có để biết đang follow chưa - tùy logic)
 * Body: Không yêu cầu
 * Return: { message: string, result: UserProfile }
 */
userRouter.get('/:username', wrapAsync(getProfileController));

export default userRouter;