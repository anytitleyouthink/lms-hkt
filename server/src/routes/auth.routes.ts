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

/**
 * Description: Đăng nhập hệ thống
 * Path: /auth/login
 * Method: POST
 * Header: Không yêu cầu
 * Body: { email, password }
 * Return: { message: string, result: { access_token, refresh_token } }
 */
authRouter.post("/login", loginValidator, wrapAsync(loginController));

/**
 * Description: Đăng xuất hệ thống
 * Path: /auth/logout
 * Method: POST
 * Header: Không yêu cầu (nhưng Cookie có refresh_token)
 * Body: Không yêu cầu
 * Return: { message: string }
 */
authRouter.post("/logout", refreshTokenValidationMiddleware, wrapAsync(logoutController));
/**
 * Description: Lấy Access Token & Refresh Token mới
 * Path: /auth/refresh-token
 * Method: POST
 * Header: Không yêu cầu (nhưng Cookie có refresh_token)
 * Body: Không yêu cầu
 * Return: { message: string, result: { access_token, refresh_token } }
 */
authRouter.post("/refresh-token", refreshTokenValidationMiddleware, wrapAsync(refreshTokenController));

/**
 * Description: Gửi yêu cầu quên mật khẩu
 * Path: /auth/forgot-password
 * Method: POST
 * Header: Không yêu cầu
 * Body: { email: string }
 * Return: { message: string }
 */
authRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController));

/**
 * Description: Xác thực Token quên mật khẩu
 * Path: /auth/verify-forgot-password
 * Method: POST
 * Header: Không yêu cầu
 * Body: { forgot_password_token: string }
 * Return: { message: string }
 */
authRouter.post('/verify-forgot-password', verifyForgotPasswordTokenValidator, wrapAsync(verifyForgotPasswordController));

/**
 * Description: Đặt lại mật khẩu mới
 * Path: /auth/reset-password
 * Method: POST
 * Header: Không yêu cầu
 * Body: { forgot_password_token: string, password: string, confirm_password: string }
 * Return: { message: string }
 */
authRouter.post('/reset-password', resetPasswordValidator, verifyForgotPasswordTokenValidator, wrapAsync(resetPasswordController));

export default authRouter;