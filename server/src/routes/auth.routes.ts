import { Router } from "express";
import { 
    loginController, logoutController, refreshTokenController, 
    forgotPasswordController, verifyForgotPasswordController, resetPasswordController 
} from "~/controllers/auth.controllers";
import { 
    loginValidator, forgotPasswordValidator, resetPasswordValidator,
    refreshTokenValidationMiddleware, verifyForgotPasswordTokenValidator 
} from "~/middlewares/users.middleware";
import { wrapAsync } from "~/utils/handlers";

const authRouter = Router();

// Đăng nhập & Thoát
authRouter.post("/login", loginValidator, wrapAsync(loginController));
authRouter.post("/logout", refreshTokenValidationMiddleware, wrapAsync(logoutController));
authRouter.post("/refresh-token", refreshTokenValidationMiddleware, wrapAsync(refreshTokenController));

// Quên mật khẩu
authRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController));
authRouter.post('/verify-forgot-password', verifyForgotPasswordTokenValidator, wrapAsync(verifyForgotPasswordController));
authRouter.post('/reset-password', resetPasswordValidator, verifyForgotPasswordTokenValidator, wrapAsync(resetPasswordController));

export default authRouter;