import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ObjectId } from "mongodb";
import { StatusCodes } from "http-status-codes";
// Services & Database
import usersService from "~/services/users.services";
// Constants & Errors
import { userMessages } from "~/constants/messages";
import { UserRole, UserStatus } from "~/constants/enums";
import { ErrorResponse } from "~/models/Errors";
import {
  LoginReqBody,
  ForgotPasswordReqBody,
  ResetPasswordReqBody
} from "~/validations/users.validation";


import {
  LogoutReqBody,
  TokenPayload,
} from "~/models/requests/User.requests";
import { UserType } from "~/models/schemas/User.schema";
import databaseService from "~/services/database.services";



export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as UserType
  const user_id = user._id as ObjectId
  const role = user.role as UserRole
  const isFirstLogin = user.isFirstLogin as boolean


  const { access_token, refresh_token } =
    await usersService.login(user_id.toString(), isFirstLogin, role)
  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/auth'
  })

  return res.status(200).json({
    message: userMessages.LOGIN_SUCCESS,
    access_token
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const decodedRefreshToken = req.decoded_refresh_token as TokenPayload;
  if (!decodedRefreshToken || !decodedRefreshToken.user_id) {
    throw new ErrorResponse(userMessages.REFRESH_TOKEN_INVALID, StatusCodes.UNAUTHORIZED);
  }
  const { user_id } = decodedRefreshToken;
  await usersService.logout(user_id);
  res.clearCookie('refresh_token', {
    path: '/auth'
  });

  return res.status(StatusCodes.OK).json({
    message: userMessages.LOGOUT_SUCCESS
  });
};

export const refreshTokenController = async (
  req: Request,
  res: Response
) => {
  const refreshToken = req.cookies.refresh_token
  if (!refreshToken) {
    return res.status(401).json({
      message: userMessages.REFRESH_TOKEN_REQUIRED
    })
  }
console.log('Decoded refresh token:', req.decoded_refresh_token);

  const decoded = req.decoded_refresh_token as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(decoded.user_id) })
  if (!user || user.status === UserStatus.Banned) {
    return res.status(403).json({
      message: userMessages.USER_BANNED
    })
  }

  const result = await usersService.refreshToken(
    decoded.user_id,
    decoded.isFirstLogin,
    refreshToken,
    decoded.role as UserRole,
  )


  res.cookie('refresh_token', result.new_refresh_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/auth'
  })

  return res.status(200).json({
    message: userMessages.REFRESH_TOKEN_SUCCESS,
    access_token: result.new_access_token
  })
}
export const forgotPasswordController = async (req: Request<ParamsDictionary, any, ForgotPasswordReqBody>, res: Response) => {
  const user = req.user as UserType;
  const result = await usersService.forgotPassword({ user_id: new ObjectId(user._id), isFirstLogin: user.isFirstLogin as boolean, role: user.role as UserRole, email: user.email });
  return res.status(StatusCodes.OK).json({
    message: userMessages.FORGOT_PASSWORD_EMAIL_SENT,
  });
};
export const verifyForgotPasswordController = async (req: Request<ParamsDictionary, any, ResetPasswordReqBody>, res: Response) => {
  return res.status(StatusCodes.OK).json({
    message: userMessages.VERIFY_FORGOT_PASSWORD_SUCCESS,
  });
};
export const resetPasswordController = async (req: Request<ParamsDictionary, any, ResetPasswordReqBody>, res: Response) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body;
  const result = await usersService.resetPassword({ user_id, password });
  return res.status(StatusCodes.OK).json({
    message: userMessages.USER_UPDATED_SUCCESS,
  });
};