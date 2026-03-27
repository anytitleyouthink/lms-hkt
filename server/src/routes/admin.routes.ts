import { Router } from "express";
import { createUserController } from "~/controllers/users.controllers";
import { createUserValidator } from "~/middlewares/users.middleware";
import { wrapAsync } from "~/utils/handlers";

const adminRouter = Router();

adminRouter.post('/create-user', createUserValidator, wrapAsync(createUserController));

export default adminRouter;