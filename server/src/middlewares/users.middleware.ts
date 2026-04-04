import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError } from "jsonwebtoken";
import { userMessages } from "~/constants/messages";
import { ErrorResponse } from "~/models/Errors";
import { TokenPayload } from "~/models/requests/User.requests"; 
import databaseService from "~/services/database.services";
import { verifyToken } from "~/utils/jwt";
import { validate } from "~/utils/validation"; 
import { hashPassword } from "~/utils/crypto";

import { 
  loginSchema, 
  updateMeSchema, 
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  firstLoginSchema,
  createUserByAdminSchema
} from "~/validations/users.validation";
import { UserRole, UserStatus } from "~/constants/enums";
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
      return next(new ErrorResponse(userMessages.EMAIL_OR_PASSWORD_INVALID, StatusCodes.UNAUTHORIZED));
    }
    if (user.status === UserStatus.Banned) {
      return next(new ErrorResponse(userMessages.USER_BANNED, StatusCodes.FORBIDDEN));
    }
    if (user.status === UserStatus.InActive) {
      return next(new ErrorResponse("Account is inactive. Please contact support.", StatusCodes.FORBIDDEN));
    }
    
    req.user = user; 
    next();
  }
];
// 2. First Login (Ép cập nhật thông tin)
export const firstLoginValidator = validate(firstLoginSchema)
export const createUserValidator = [
  validate(createUserByAdminSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body
      const isEmailExist = await databaseService.users.findOne({ email })
      
      if (isEmailExist) {
        return next(
          new ErrorResponse(userMessages.EMAIL_ALREADY_IN_USE, StatusCodes.BAD_REQUEST)
        )
      }
      next()
    } catch (error) {
      next(error)
    }
  }
]
// --- UPDATE ME VALIDATOR ---
export const updateMeValidator = [
  validate(updateMeSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;
    if (username) {
      const user = await databaseService.users.findOne({ username });
      if (user) {
        return next(new ErrorResponse(userMessages.USERNAME_EXISTED, StatusCodes.BAD_REQUEST));
      }
    }
    next();
  }
];

// --- CHANGE PASSWORD VALIDATOR ---
export const changePasswordValidator = [
  validate(changePasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { old_password } = req.body;
    const { user_id } = (req as any).decoded_access_token as TokenPayload;
    const user = await databaseService.users.findOne({
      _id: new ObjectId(user_id),
      password: hashPassword(old_password)
    });

    if (!user) {
      return next(new ErrorResponse(userMessages.OLD_PASSWORD_NOT_MATCH, StatusCodes.BAD_REQUEST));
    }

    next();
  }
];

// --- FORGOT PASSWORD VALIDATOR ---
export const forgotPasswordValidator = [
  validate(forgotPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await databaseService.users.findOne({ email });

    if (!user) {
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
export const checkRoleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const decoded = (req as any).decoded_access_token
   // Debug log
    if (!decoded || !decoded.role) {
      return next(
        new ErrorResponse(userMessages.ROLE_NOT_FOUND, StatusCodes.UNAUTHORIZED)
      )
    }

    const { role } = decoded as { role: UserRole }
   
    if (!allowedRoles.includes(role)) {
      return next(
        new ErrorResponse(userMessages.CHECK_ROLE_PERMISSION_ERROR, StatusCodes.FORBIDDEN)
      )
    }
    next()
  }
}
