import { Router } from "express";
import userRoutes from "./users.routes";
import { accessTokenValidationMiddleware, checkRoleMiddleware } from "~/middlewares/users.middleware";
import { UserRole } from "~/constants/enums";
import authRouter from "./auth.routes";
import { ad } from "@faker-js/faker/dist/airline-Dz1uGqgJ";
import adminRouter from "./admin.routes";

const rootRouter = Router();
rootRouter.use('/auth', authRouter)

// 2. Nhóm User (địa chỉ sẽ là /users/me, /users/:username...)
rootRouter.use('/users',
  accessTokenValidationMiddleware,
    userRoutes)

// 3. Nhóm Admin (địa chỉ sẽ là /admin/create-by-admin)
// Gắn luôn Middleware check Admin ở đây để bảo vệ toàn bộ nhóm này
rootRouter.use('/admin', 
  // accessTokenValidationMiddleware, 
  // checkRoleMiddleware([UserRole.Admin]), 
  adminRouter)

export default rootRouter