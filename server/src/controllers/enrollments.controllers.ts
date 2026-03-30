import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseService from '~/services/database.services';
import Enrollment from '~/models/schemas/Enrollment.schema';
import { enrollmentMessages, messageMessages } from '~/constants/messages';
import { EnrollmentStatus } from '~/constants/enums';

// Nhân viên xin học (Mặc định: pending)
export const requestEnrollmentController = async (req: Request, res: Response) => {
  const { course_id } = req.body;
  const { user_id } = (req as any).decoded_access_token; 
  console.log(user_id); // Lấy ID từ Token

  try {
    const existing = await databaseService.enrollments.findOne({
      user_id: new ObjectId(user_id),
      course_id: new ObjectId(course_id)
    });

    if (existing) {
      return res.status(400).json(enrollmentMessages.ENROLLMENT_EXISTS);
    }

    const newEnrollment = new Enrollment({
      user_id: new ObjectId(user_id),
      course_id: new ObjectId(course_id)
    });

    await databaseService.enrollments.insertOne(newEnrollment);
    return res.status(201).json({ message: enrollmentMessages.ENROLLMENT_REQUESTED, result: newEnrollment });
  } catch (error) {
    return res.status(500).json({  message: enrollmentMessages.ERROR_SERVER });
  }
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
  try {
    const pendingList = await databaseService.enrollments.aggregate([
      { $match: { status: 'pending' } },
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
          'course_info.title': 1
        }
      }
    ]).toArray()

    return res.json({
      message: enrollmentMessages.GET_ENROLLMENT_BY_ID_SUCCESS,
      result: pendingList
    })
  } catch (error) {
    return res.status(500).json({ message: enrollmentMessages.ERROR_SERVER })
  }
}