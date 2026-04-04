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
import progressServices from "~/services/progress.services";
import databaseService from "~/services/database.services";


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
const defaultPassword = process.env.DEFAULTPassword || '12345678';
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





export const getUsersController = async (req: Request, res: Response) => {
  const { email, search } = req.query;
  const result = await usersService.getUsers((search || email) as string);
  return res.json({
    message: userMessages.GET_PROFILE_SUCCESS, // Reused message for simplicity
    result
  });
};

export const toggleUserStatusController = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const result = await usersService.toggleStatus(user_id);
  return res.json({
    message: "User status updated successfully",
    result
  });
};
// users.controllers.ts (Hoặc file controller của Dashboard)

export const getEmployeeDashboardController = async (req: Request, res: Response) => {
  const { user_id } = (req as any).decoded_access_token;

    // 1. Lấy thông tin User để hiện lên Header
    const userProfile = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      { projection: { password: 0, refresh_token: 0 ,forgot_password_token: 0} }
    );

    // 2. Tìm 3 khóa học GẦN NHẤT mà user này đã đăng ký
    const recentEnrollments = await databaseService.enrollments
      .find({ user_id: new ObjectId(user_id) })
      .sort({ created_at: -1 }) // Xếp mới nhất lên đầu
      .limit(3)
      .toArray();
    const recentCoursesWithProgress = await Promise.all(
      recentEnrollments.map(async (enrollment) => {
        const courseIdStr = enrollment.course_id.toString();

    
        const courseDetail = await databaseService.courses.findOne(
          { _id: enrollment.course_id },
          { projection: { title: 1, thumbnail: 1 } } // Chỉ lấy những gì Dashboard cần cho nhẹ
        );

        const progressData = await progressServices.getCourseProgress(user_id, courseIdStr);

        return {
          course_info: courseDetail,
          progress_detail: progressData 
        };
      })
    );

    return res.json({
      message: userMessages.GET_EMPLOYEE_DASHBOARD_SUCCESS,
      result: {
        profile: userProfile,
        recent_learning: recentCoursesWithProgress
      }
    });
};
export const getTrainerDashboardController = async (req: Request, res: Response) => {
  const { user_id } = (req as any).decoded_access_token

  
  const profile = await databaseService.users.findOne(
    { _id: new ObjectId(user_id) },
    { projection: { password: 0, refresh_token: 0, forgot_password_token: 0} }
  )

  const coursesWithStudentCount = await databaseService.courses.aggregate([
    { $match: { trainer_id: new ObjectId(user_id), status: { $ne: 'deleted' } } },
    
    {
      $lookup: {
        from: 'enrollments',
        localField: '_id',
        foreignField: 'course_id',
        as: 'students'
      }
    },

    // Thêm một trường mới là total_students bằng độ dài của mảng students vừa join
    {
      $addFields: {
        total_students: { $size: '$students' }
      }
    },

    {
      $project: {
        title: 1,
        thumbnail: 1,
        total_students: 1,
        created_at: 1,
        status: 1
      }
    },
    { $sort: { created_at: -1 } }
  ]).toArray()

  // 3. Tính toán nhanh các con số thống kê tổng quát (Số khóa, Tổng học viên)
  const stats = {
    total_courses: coursesWithStudentCount.length,
    total_all_students: coursesWithStudentCount.reduce((sum, course) => sum + course.total_students, 0)
  }

  return res.json({
    message: "Trainer dashboard data fetched successfully",
    result: {
      profile,
      stats,
      courses: coursesWithStudentCount
    }
  })
}
