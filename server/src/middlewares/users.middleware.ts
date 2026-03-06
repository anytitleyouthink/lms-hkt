import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError } from "jsonwebtoken";

import { userMessages } from "~/constants/messages";
import { UserVerifyStatus } from "~/constants/enums";
import { ErrorResponse } from "~/models/Errors";
import { TokenPayload } from "~/models/requests/User.requests"; // Giữ lại type này
import databaseService from "~/services/database.services";
import { verifyToken } from "~/utils/jwt";
import { validate } from "~/utils/validation"; // Hàm validate zod wrapper của bạn
import { hashPassword } from "~/utils/crypto";
import { EntityError } from "~/models/Errors";

import { 
  loginSchema, 
  registerSchema, 
  updateMeSchema, 
  changePasswordSchema,
  followUserIdSchema,
  unfollowUserIdSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "~/validations/users.validation";
import usersService from "~/services/users.services";

// --- 1. VALIDATOR MIDDLEWARES (Dùng Zod) ---

// --- LOGIN VALIDATOR ---
export const loginValidator = [
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await databaseService.users.findOne({
      email,
      password: hashPassword(password),
    });

    if (!user) {
      return next(new EntityError({
        errors: {
          email: { msg: userMessages.EMAIL_OR_PASSWORD_INVALID }
        }
      }));
    }

    req.user = user; 
    next();
  }
];

// --- REGISTER VALIDATOR ---
export const registerValidator = [
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const isExist = await usersService.checkUserExists(email);

    if (isExist) {
      return next(new EntityError({
        errors: {
          email: { msg: userMessages.EMAIL_ALREADY_IN_USE }
        }
      }));
    }
    next();
  }
];

// --- UPDATE ME VALIDATOR ---
export const updateMeValidator = [
  validate(updateMeSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;
    if (username) {
      const user = await databaseService.users.findOne({ username });
      if (user) {
        return next(new EntityError({
          errors: {
            username: { msg: userMessages.USERNAME_EXISTED }
          }
        }));
      }
    }
    next();
  }
];

// --- CHANGE PASSWORD VALIDATOR ---
// (Đã xóa bản sao bị trùng ở cuối file)
export const changePasswordValidator = [
  validate(changePasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { old_password } = req.body;
    
    // Lưu ý: Đảm bảo middleware check accessToken của bạn gán vào decoded_authorization
    const { user_id } = (req as any).decoded_authorization as TokenPayload;

    const user = await databaseService.users.findOne({
      _id: new ObjectId(user_id),
      password: hashPassword(old_password)
    });

    if (!user) {
      // Mật khẩu cũ không khớp -> Lỗi validation form
      return next(new EntityError({
        errors: {
          old_password: { msg: userMessages.OLD_PASSWORD_NOT_MATCH }
        }
      }));
    }

    next();
  }
];

// --- FOLLOW VALIDATOR ---
export const followUserIdValidator = 
  validate(followUserIdSchema);

// --- UNFOLLOW VALIDATOR ---
export const unfollowUserIdValidator =  validate(unfollowUserIdSchema);
 
// --- FORGOT PASSWORD VALIDATOR ---
export const forgotPasswordValidator = [
  validate(forgotPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await databaseService.users.findOne({ email });

    if (!user) {
      // SỬA: Truyền tham số rời
      return next(new ErrorResponse(
        userMessages.USER_NOT_FOUND,
        StatusCodes.NOT_FOUND
      ));
    }

    req.user = user;
    next();
  }
];

// --- RESET PASSWORD VALIDATOR ---
export const resetPasswordValidator = validate(resetPasswordSchema);
// --- 2.
export const accessTokenValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const value = req.headers.authorization;
    if (!value) return next(new ErrorResponse(userMessages.ACCESS_TOKEN_REQUIRED, StatusCodes.UNAUTHORIZED));
    
    const access_token = value.split(' ')[1];
    if (!access_token) return next(new ErrorResponse(userMessages.ACCESS_TOKEN_REQUIRED, StatusCodes.UNAUTHORIZED));
    try {
        const decoded_access_token = await verifyToken(access_token, process.env.JWT_PRIVATE_ACCESS_TOKEN as string);
        (req as Request).decoded_access_token = decoded_access_token;
        next();
    } catch (error) {
        next(new ErrorResponse(userMessages.ACCESS_TOKEN_EXPIRED, StatusCodes.UNAUTHORIZED));
    }
};

export const refreshTokenValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refresh_token = req.cookies.refresh_token; 
 
    
    if (!refresh_token) {
        return next(new ErrorResponse(userMessages.REFRESH_TOKEN_REQUIRED, StatusCodes.UNAUTHORIZED));
    }

    try {
        const [decoded_refresh_token, storedToken] = await Promise.all([
             verifyToken(refresh_token, process.env.JWT_PRIVATE_REFRESH_TOKEN as string),
             databaseService.refreshTokens.findOne({ token: refresh_token })
        ]);

        if (!storedToken) {
             throw new ErrorResponse(userMessages.REFRESH_TOKEN_INVALID_OR_EXPIRED, StatusCodes.UNAUTHORIZED);
        }
        
        (req as Request).decoded_refresh_token = decoded_refresh_token;
        next();
    } catch (error) {
        next(new ErrorResponse((error as JsonWebTokenError).message || userMessages.REFRESH_TOKEN_INVALID, StatusCodes.UNAUTHORIZED));
    }
};

export const emailVerifyValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { email_verify_token } = req.body;
    if (!email_verify_token) return next(new ErrorResponse(userMessages.EMAIL_VERIFY_TOKEN_REQUIRED, StatusCodes.UNAUTHORIZED));
    
    try {
        const decoded_email_verify_token = await verifyToken(email_verify_token, process.env.JWT_PRIVATE_EMAIL_VERIFY_TOKEN as string);
        (req as Request).decoded_email_verify_token = decoded_email_verify_token;
        next();
    } catch (error) {
        next(new ErrorResponse(userMessages.EMAIL_VERIFY_TOKEN_INVALID_OR_EXPIRED, StatusCodes.UNAUTHORIZED));
    }
};

export const verifyForgotPasswordTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
    const { forgot_password_token } = req.body;
    if (!forgot_password_token) return next(new ErrorResponse(userMessages.FORGOT_PASSWORD_TOKEN_IS_REQUIRED, StatusCodes.UNAUTHORIZED));

    try {
        const decoded_forgot_password_token = await verifyToken(
            forgot_password_token,
            process.env.JWT_PRIVATE_FORGOT_PASSWORD_TOKEN as string
        );

        const { user_id } = decoded_forgot_password_token;
        const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) });

        if (!user) {
            return next(new ErrorResponse(userMessages.USER_NOT_FOUND, StatusCodes.NOT_FOUND));
        }

        if (user.forgot_password_token !== forgot_password_token) {
            return next(new ErrorResponse(userMessages.INVALID_FORGOT_PASSWORD_TOKEN, StatusCodes.UNAUTHORIZED));
        }

        (req as Request).decoded_forgot_password_token = decoded_forgot_password_token;
        next();
    } catch (error) {
        next(new ErrorResponse((error as any).message, StatusCodes.UNAUTHORIZED));
    }
};

export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
    const { verify } = (req as Request).decoded_access_token as TokenPayload;
    if (verify === UserVerifyStatus.Banned) {
        return next(new ErrorResponse(userMessages.USER_BANNED, StatusCodes.FORBIDDEN));
    }
    if (verify !== UserVerifyStatus.Verified) {
        return next(new ErrorResponse(userMessages.USER_NOT_VERIFIED, StatusCodes.FORBIDDEN));
    }
    next();
};

export const isUserLoggedInValidator = (
  middleware: (req: Request, res: Response, next: NextFunction) => void
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      return middleware(req, res, next);
    }
    next();
  };
};