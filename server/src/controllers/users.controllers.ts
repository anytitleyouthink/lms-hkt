import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ObjectId } from "mongodb";
import { StatusCodes } from "http-status-codes";

// Services & Database
import usersService from "~/services/users.services";
import databaseService from "~/services/database.services";

// Constants & Errors
import { userMessages } from "~/constants/messages";
import { UserVerifyStatus } from "~/constants/enums";
import { ErrorResponse } from "~/models/Errors";

// 1. Import các Type được tạo tự động từ Zod (Inferred Types)
import {
  RegisterReqBody,
  LoginReqBody,
  UpdateMeReqBody,
  ForgotPasswordReqBody,
  ResetPasswordReqBody,
  FollowReqBody,
  UnfollowReqParams,
  ChangePasswordReqBody
} from "~/validations/users.validation";


import {
  VerifyEmailReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  GetProfileReqParams,
  TokenPayload,
  OAuthResult
} from "~/models/requests/User.requests"; 
import { UserType } from "~/models/schemas/User.schema";

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as UserType
  const user_id = user._id as ObjectId
  

  const { access_token, refresh_token } =
    await usersService.login(user_id.toString())
  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/users'
  })

  return res.status(200).json({
    message: userMessages.LOGIN_SUCCESS,
    access_token
  })
}
export const registerController = async(req:  Request<ParamsDictionary, any,RegisterReqBody>, res: Response,next:NextFunction) => {
  try {
   const result = await usersService.register(req.body);
    const { refresh_token, access_token } = result;
     res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/users'
  })
   return res.status(201).json({ message: userMessages.RESIGISTER_SUCCESS, access_token });
  } catch (error) {
    next(error);
  }
}
export const logoutController = async (req: Request, res: Response) => {
  const decodedRefreshToken = req.decoded_refresh_token as TokenPayload;
  if (!decodedRefreshToken || !decodedRefreshToken.user_id) {
    throw new ErrorResponse(userMessages.REFRESH_TOKEN_INVALID, StatusCodes.UNAUTHORIZED);
  }
  const { user_id } = decodedRefreshToken;
  await usersService.logout(user_id);
  res.clearCookie('refresh_token', {
    path: '/users'
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

  const decoded = req.decoded_refresh_token as TokenPayload

  const result = await usersService.refreshToken(
    decoded.user_id,
    decoded.verify,
    refreshToken
  )


  res.cookie('refresh_token', result.new_refresh_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/users'
  })

  return res.status(200).json({
    message: userMessages.REFRESH_TOKEN_SUCCESS,
    access_token: result.new_access_token
  })
}

export const emailVerifyController = async(req:  Request<ParamsDictionary, any,VerifyEmailReqBody>, res: Response) => {
  const decoded = req.decoded_email_verify_token as TokenPayload;
  const user = await databaseService.users.findOne({ _id: new ObjectId( decoded.user_id) });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: userMessages.USER_NOT_FOUND,
    });
  }

  if(user.verify===1){
    return res.status(StatusCodes.OK).json({
      message: userMessages.EMAIL_ALREADY_VERIFIED,
    });
  }
    const result = await usersService.verifyEmail(decoded.user_id);
    const { access_token, refresh_token } = result;
     res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/users'
  })

  return res.status(StatusCodes.OK).json({ message: userMessages.EMAIL_VERIFY_SUCCESS, access_token });
}
export const resendVerifyEmailController = async(req: Request, res: Response) => {
  const decoded = req.decoded_access_token as TokenPayload;
  const user = await databaseService.users.findOne({ _id: new ObjectId( decoded.user_id) });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: userMessages.USER_NOT_FOUND,
    });
  }
  if(user.verify===1){
    return res.status(StatusCodes.OK).json({
      message: userMessages.EMAIL_ALREADY_VERIFIED,
    });
  }
    const result = await usersService.resendVerifyEmail(decoded.user_id, user.email);
  return res.status(StatusCodes.OK).json({ message: userMessages.RESEND_VERIFY_EMAIL_SUCCESS, result });
}
export const forgotPasswordController = async (req: Request<ParamsDictionary, any,ForgotPasswordReqBody>, res: Response) => {
  const user = req.user as UserType;
  const result = await usersService.forgotPassword({user_id: new ObjectId(user._id),verify: user.verify as UserVerifyStatus , email: user.email});
  return res.status(StatusCodes.OK).json({
    message: userMessages.FORGOT_PASSWORD_EMAIL_SENT,
  });
};
export const verifyForgotPasswordController = async (req: Request<ParamsDictionary, any, ResetPasswordReqBody>, res: Response) => {
  return res.status(StatusCodes.OK).json({
    message: userMessages.VERIFY_FORGOT_PASSWORD_SUCCESS,
  });
};
export const resetPasswordController = async ( req: Request<ParamsDictionary, any, ResetPasswordReqBody>, res: Response) => {
 const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const {password} = req.body;
  const result = await usersService.resetPassword({user_id,password});
  return res.status(StatusCodes.OK).json({
    message: userMessages.USER_UPDATED_SUCCESS,
  });
};
export const getMeController = async (req: Request, res: Response) => {
  const user = req.decoded_access_token as TokenPayload;
  const user_id = user.user_id;
  const result = await usersService.getMe(user_id);
  console.log(result)
  return res.status(StatusCodes.OK).json({ 
    message: userMessages.GET_ME_SUCCESS,
    name: result?.name,
    username: result?.username,
    email: result?.email,
    date_of_birth: result?.date_of_birth,
    
  });
};
export const updateMeController = async (req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response) => {   
  const {user_id} = req.decoded_access_token as TokenPayload;
  const result = await usersService.updateMe(user_id, req.body);
  return res.json({
    message: userMessages.USER_UPDATED_SUCCESS,
    result
  });
};
export const getProfileController = async (req: Request<GetProfileReqParams>, res: Response) => {
  const { username } = req.params;
  const result = await usersService.getProfile(username);
  return res.json({
    message: userMessages.GET_PROFILE_SUCCESS,
    result
  });
};
export const followController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload;
  const { followed_user_id } = req.body;
  if(user_id===followed_user_id)
  {
      throw new ErrorResponse('CANNOT_FOLLOW_YOURSELF', StatusCodes.BAD_REQUEST);
  }
  const result = await usersService.follow(user_id, followed_user_id);
  return res.json(result);
};
export const unfollowController = async(req: Request<UnfollowReqParams>, res: Response,next:NextFunction)=>{
  const { user_id } = req.decoded_access_token as TokenPayload;
  const {user_id:followed_user_id} = req.params;
   if(user_id=== followed_user_id)
  {
      throw new ErrorResponse('CANNOT_FOLLOW_YOURSELF', StatusCodes.BAD_REQUEST);
  }
    const result = await usersService.unfollow(user_id, followed_user_id);
  return res.json(result);

}
export  const changePasswordController= async(req: Request, res: Response,next:NextFunction)=>{
  const {user_id} = req.decoded_access_token as TokenPayload;
  const {password} = req.body;
  const result = await usersService.changePassword(user_id, password);
  return res.json(result);
}
export const oauthController = async (req: Request, res: Response) => {
  const { code } = req.query
  if (!code) {
    return res.redirect(`${process.env.clientRedirectCallback}?error=oauth_failed`)
  }

  const result = await usersService.oauth(code as string) as OAuthResult
  

  res.cookie('refresh_token', result.refresh_token, {
    httpOnly: true,
    secure: true,      
    sameSite: 'lax',
    path: '/users'
  })
  const url = `${process.env.clientRedirectCallback}?access_token=${result.access_token}&newUser=${result.newUser}&verify=${result.verify as string}`
  return res.redirect(process.env.clientRedirectCallback as string)
}




    




