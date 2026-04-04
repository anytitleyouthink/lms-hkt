import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseService from '~/services/database.services';
import Enrollment from '~/models/schemas/Enrollment.schema';
import { enrollmentMessages, messageMessages } from '~/constants/messages';
import { EnrollmentStatus } from '~/constants/enums';
import { en } from '@faker-js/faker/.';
import enrollmentService from '~/services/enrollment.services';


export const requestEnrollmentController = async (req: Request, res: Response) => {
  const { course_id } = req.body;
  const { user_id } = (req as any).decoded_access_token;

  const newEnrollment = await enrollmentService.requestEnrollment(user_id, course_id);
   
    return res.status(201).json({ message: enrollmentMessages.ENROLLMENT_REQUESTED, result: newEnrollment });
  
};


export const approveEnrollmentController = async (req: Request, res: Response) => {
  const { enrollment_id } = req.params;

  try {
    const result = await databaseService.enrollments.findOneAndUpdate(
      { _id: new ObjectId(enrollment_id) },
      { $set: { status: EnrollmentStatus.Approved } },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ message: enrollmentMessages.ENROLLMENT_NOT_FOUND });
    return res.status(200).json({ message: enrollmentMessages.ENROLLMENT_APPROVED, result });
  } catch (error) {
    return res.status(500).json({ message: enrollmentMessages.ERROR_SERVER });
  }
};
export const getPendingEnrollmentsController = async (req: Request, res: Response) => {
  const course_id = req.params.course_id;
  const email = req.query.email; 

  const pipeline: any[] = [
    { 
      $match: { 
        status: EnrollmentStatus.Pending, 
      } 
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user_info'
      }
    },
    { $unwind: '$user_info' }
  ];

  // Nếu có truyền email lên để search thì thêm bước match này vào
  if (email) {
    pipeline.push({
      $match: {
        'user_info.email': { $regex: email as string, $options: 'i' }
      }
    });
  }

  pipeline.push(
    {
      $lookup: {
        from: 'courses',
        localField: 'course_id',
        foreignField: '_id',
        as: 'course_info'
      }
    },
    { $unwind: '$course_info' },
    {
      $project: {
        status: 1,
        created_at: 1,
        'user_info.name': 1,
        'user_info.email': 1,
        'user_info.avatar': 1, // Nên lấy thêm avatar để hiện UI cho đẹp
        'course_info.title': 1,
        'user_info.role': 1

      }
    }
  );

  const pendingList = await databaseService.enrollments.aggregate(pipeline).toArray();

  return res.json({
    message: enrollmentMessages.GET_ENROLLMENT_BY_ID_SUCCESS, // Tài có thể đổi message này cho chuẩn
    result: pendingList
  });
};
  // enrollments.controllers.ts
export const getEnrollmentRequestsByCourseController = async (req: Request, res: Response) => {
  const { course_id } = req.params
  
  const result = await databaseService.enrollments.aggregate([
    { 
      $match: { 
        course_id: new ObjectId(course_id) 
      } 
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user_info'
      }
    },
    { $unwind: '$user_info' },
    {
      $project: {
        _id: 1,
        status: 1,
        created_at: 1,
        'user_info.name': 1,
        'user_info.email': 1,
        'user_info.phone': 1,
        'user_info.role': 1
      }
    }
  ]).toArray()

  return res.json({
    message: enrollmentMessages.GET_ENROLLMENT_BY_ID_SUCCESS,
    result
  })
}