import { Router } from "express";
import { 
    loginController, registerController, logoutController, refreshTokenController, 
    emailVerifyController, resendVerifyEmailController, forgotPasswordController, 
    verifyForgotPasswordController, resetPasswordController, getMeController, 
    updateMeController, getProfileController, followController, unfollowController, 
    changePasswordController, oauthController 
} from "~/controllers/users.controllers";

import { 
    accessTokenValidationMiddleware, 
    refreshTokenValidationMiddleware, 
    emailVerifyValidationMiddleware,
    verifiedUserValidator,
    verifyForgotPasswordTokenValidator, // Import Middleware thủ công
    changePasswordValidator,
    loginValidator,
    registerValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    updateMeValidator,
    followUserIdValidator,
    unfollowUserIdValidator,           
} from "~/middlewares/users.middleware";

import { 
  
  resetPasswordSchema,
    UpdateMeReqBody,
    
} from "~/validations/users.validation";


import { wrapAsync } from "~/utils/handlers";
import { filterMiddleware } from "~/middlewares/common.middleware";

const userRoutes = Router();

/* Login route 
  path: /users/Login
  method: POST
  description: Login a  user
  body: {  password: string, email: string }
*/
userRoutes.post("/login", loginValidator, wrapAsync(loginController));
/* Register route 
  path: /users/register
  method: POST
  description: Register a new user
  body: { username: string, password: string, email: string , dateOfBirth: iso08601 string}
*/
userRoutes.post("/register", registerValidator, wrapAsync(registerController));

/* Logout route 
  path: /users/logout
  method: POST
  description: Logout a user
  Cookie: { refresh_token: string }
*/
userRoutes.post("/logout", refreshTokenValidationMiddleware, wrapAsync(logoutController));
/* Refresh Token route
  path: /users/refresh_token
  method: POST
  description: Refresh a token
  Cookie: { refresh_token: string }
*/
userRoutes.post("/refresh_token", refreshTokenValidationMiddleware, wrapAsync(refreshTokenController));

/* Email Verify route
  path: /users/email_verify
  method: POST
  description: Verify a email
  Cookie: { email_verify_token: string }
*/
userRoutes.post("/email_verify", emailVerifyValidationMiddleware, wrapAsync(emailVerifyController));
/* Resend Verify Email route
  path: /users/resend_verify_email
  method: POST
  description: Resend a verify email
  body: {}
*/
userRoutes.post('/resend_verify_email', accessTokenValidationMiddleware, wrapAsync(resendVerifyEmailController));

/**
 * Description. Submit email to reset password, send email to user
 * Path: /forgot-password
 * Method: POST
 * Body: {email: string}
 */
userRoutes.post('/forgot_password', forgotPasswordValidator, wrapAsync(forgotPasswordController));

// 👉 Sửa: Dùng middleware thủ công để check Token DB và gán req.decoded_...
userRoutes.post('/verify_forgot_password', verifyForgotPasswordTokenValidator, wrapAsync(verifyForgotPasswordController));

// 👉 Sửa: Kết hợp Zod (Check pass mạnh) + Middleware thủ công (Check token hợp lệ)
userRoutes.post('/reset-password', resetPasswordValidator, verifyForgotPasswordTokenValidator, wrapAsync(resetPasswordController));

// 5. User Profile
userRoutes.get('/me', accessTokenValidationMiddleware, wrapAsync(getMeController));

userRoutes.patch(
  '/me',
  accessTokenValidationMiddleware,
  verifiedUserValidator,
  updateMeValidator, 
  filterMiddleware([
    'name', 'date_of_birth', 'bio', 'location', 'website', 'username', 'avatar', 'cover_photo',
  ] as (keyof UpdateMeReqBody)[]),
  wrapAsync(updateMeController)
);

userRoutes.get('/:username', wrapAsync(getProfileController));

// 6. Follow / Unfollow
userRoutes.post(
  '/follow',
  accessTokenValidationMiddleware,
  verifiedUserValidator,
  followUserIdValidator,
  wrapAsync(followController)
);

userRoutes.delete(
  '/follow/:user_id',
  accessTokenValidationMiddleware,
  verifiedUserValidator,
  unfollowUserIdValidator, 
  wrapAsync(unfollowController)
);

// 7. Change Password
// 👉 Sửa: Dùng middleware thủ công để check old_password khớp với DB
userRoutes.put(
  '/change-password',
  accessTokenValidationMiddleware,
  verifiedUserValidator,
  changePasswordValidator, 
  wrapAsync(changePasswordController)
);

// 8. OAuth
userRoutes.get('/oauth/google', wrapAsync(oauthController));

export default userRoutes;