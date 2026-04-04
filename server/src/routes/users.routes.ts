import { Router } from "express";
import { getMeController, updateMeController, getProfileController, changePasswordController, getEmployeeDashboardController, getTrainerDashboardController } from "~/controllers/users.controllers";
import { accessTokenValidationMiddleware, updateMeValidator, changePasswordValidator, checkRoleMiddleware } from "~/middlewares/users.middleware";
import { filterMiddleware } from "~/middlewares/common.middleware";
import { UpdateMeReqBody } from "~/validations/users.validation";
import { wrapAsync } from "~/utils/handlers";
import { UserRole } from "~/constants/enums";

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
/**
 * Lấy dữ liệu tổng hợp cho trang Dashboard của Employee
 * Path: /users/dashboard/summary
 * Method: GET
 * Headers: { Authorization: "Bearer <access_token>" }
 */
userRouter.get(
  '/dashboard/summary',
  accessTokenValidationMiddleware, 
  getEmployeeDashboardController   
);
// Path: /users/trainer/dashboard
userRouter.get(
  '/trainer/dashboard',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Trainer, UserRole.Admin]), // Chỉ Trainer và Admin mới có quyền xem dashboard này
  wrapAsync(getTrainerDashboardController) 
)
export default userRouter;