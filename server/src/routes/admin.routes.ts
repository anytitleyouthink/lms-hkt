import { Router } from "express";
import { check } from "zod";
import { UserRole } from "~/constants/enums";
import { createUserController, getUsersController, toggleUserStatusController } from "~/controllers/users.controllers";
import { accessTokenValidationMiddleware, checkRoleMiddleware, createUserValidator } from "~/middlewares/users.middleware";
import { wrapAsync } from "~/utils/handlers";

const adminRouter = Router();

/**
 * Description: Tạo mới một User (Chỉ Admin)
 * Path: /admin/create-user
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { name, email, role }
 * Return: { message: string, access_token: string }
 */
adminRouter.post('/create-user', createUserValidator, wrapAsync(createUserController));

/**
 * Description: Lấy danh sách nhân viên/người dùng
 * Path: /admin/users
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { email?: string }
 * Return: { message: string, result: User[] }
 */
adminRouter.get('/users',
   accessTokenValidationMiddleware,
    checkRoleMiddleware([UserRole.Admin]), 
    wrapAsync(getUsersController));

/**
 * Description: Khóa/Mở Khóa (Deactivate/Reactivate) một User
 * Path: /admin/users/:user_id/toggle-status
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Return: { message: string, result: User }
 */
adminRouter.patch('/users/:user_id/toggle-status',
  accessTokenValidationMiddleware,
  checkRoleMiddleware([UserRole.Admin]), // Chỉ Admin mới có quyền khóa/mở khóa người dùng
  wrapAsync(toggleUserStatusController));

export default adminRouter;