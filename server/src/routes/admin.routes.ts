import { Router } from "express";
import { createUserController } from "~/controllers/users.controllers";
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

export default adminRouter;