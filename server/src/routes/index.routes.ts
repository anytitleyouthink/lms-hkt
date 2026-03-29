import { Router } from "express";
import userRoutes from "./users.routes";
import { accessTokenValidationMiddleware, checkRoleMiddleware } from "~/middlewares/users.middleware";
import { UserRole } from "~/constants/enums";
import authRouter from "./auth.routes";
import { ad } from "@faker-js/faker/dist/airline-Dz1uGqgJ";
import adminRouter from "./admin.routes";
import coursesRouter from "./courses.routes";
import sectionsRouter from "./sections.routes";
import lessonsRouter from "./lessons.routes";
import mediasRouter from "./medias.routes";
import quizzesRouter from "./quizzes.routes";

const rootRouter = Router();
rootRouter.use('/auth', authRouter)

rootRouter.use('/users',
  accessTokenValidationMiddleware,
    userRoutes)

// 3. Nhóm Admin (địa chỉ sẽ là /admin/create-by-admin)
// Gắn luôn Middleware check Admin ở đây để bảo vệ toàn bộ nhóm này
rootRouter.use('/admin', 
  // accessTokenValidationMiddleware, 
  // checkRoleMiddleware([UserRole.Admin]), 
  adminRouter)
rootRouter.use('/courses', coursesRouter)
rootRouter.use('/sections', sectionsRouter)
rootRouter.use('/lessons', lessonsRouter)
rootRouter.use('/medias',
  //  accessTokenValidationMiddleware, 
  //  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  mediasRouter)
  rootRouter.use('/quizzes',
  //  accessTokenValidationMiddleware, 
  //  checkRoleMiddleware([UserRole.Admin, UserRole.Trainer]),
  quizzesRouter
  )

export default rootRouter