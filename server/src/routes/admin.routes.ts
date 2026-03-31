import { Router } from "express";
import { createUserController, getUsersController } from "~/controllers/users.controllers";
import { createUserValidator } from "~/middlewares/users.middleware";
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
adminRouter.get('/users', wrapAsync(getUsersController));

export default adminRouter;