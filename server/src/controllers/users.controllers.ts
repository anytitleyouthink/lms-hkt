import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ObjectId } from "mongodb";
import { StatusCodes } from "http-status-codes";
// Services & Database
import usersService from "~/services/users.services";
// Constants & Errors
import { userMessages } from "~/constants/messages";
import { UserRole } from "~/constants/enums";
import { ErrorResponse } from "~/models/Errors";
import {
  LoginReqBody,
  UpdateMeReqBody,
  ForgotPasswordReqBody,
  ResetPasswordReqBody,
  ChangePasswordReqBody,
  CreateUserByAdminReqBody
} from "~/validations/users.validation";


import {
  LogoutReqBody,
  GetProfileReqParams,
  TokenPayload,
} from "~/models/requests/User.requests"; 
import { UserType } from "~/models/schemas/User.schema";


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

export  const changePasswordController= async(req: Request<ParamsDictionary, any, ChangePasswordReqBody>, res: Response,next:NextFunction)=>{
  const {user_id} = req.decoded_access_token as TokenPayload;
  const {password} = req.body;
  const result = await usersService.changePassword(user_id, password);
  return res.json(result);
}
export const createUserController = async (req: Request<ParamsDictionary, any, CreateUserByAdminReqBody>, res: Response) => {
const { name, email, role, } = req.body
const defaultPassword = 'victoryTTT@123'
const result = await usersService.createUserByAdmin({ name, email, role, password: defaultPassword })
const { refresh_token, access_token } = result;
     res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/auth'
  })
return res.status(StatusCodes.CREATED).json({
    message: userMessages.USER_CREATED_SUCCESS,
    access_token
   });

}





    




