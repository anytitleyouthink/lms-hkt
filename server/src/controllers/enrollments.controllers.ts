import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseService from '~/services/database.services';
import Enrollment from '~/models/schemas/Enrollment.schema';
import Notification from '~/models/schemas/Notification.schema';
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
  const { status } = req.body || {}; // Lấy status từ body nếu có (ví dụ: Pending)

  try {
    const targetStatus = status !== undefined ? Number(status) : EnrollmentStatus.Approved;
    
    const result = await databaseService.enrollments.findOneAndUpdate(
      { _id: new ObjectId(enrollment_id) },
      { $set: { status: targetStatus } },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ message: enrollmentMessages.ENROLLMENT_NOT_FOUND });
    
    // Tạo notification cho User
    const course = await databaseService.courses.findOne({ _id: result.course_id });
    
    let notifTitle = 'Đăng ký thành công';
    let notifMessage = `Yêu cầu tham gia khóa học "${course?.title || 'Không xác định'}" của bạn đã được duyệt.`;
    
    if (targetStatus === EnrollmentStatus.Pending) {
      notifTitle = 'Thay đổi trạng thái đăng ký';
      notifMessage = `Trạng thái tham gia khóa học "${course?.title || 'Không xác định'}" của bạn đã được chuyển về "Chờ duyệt" bởi giảng viên.`;
    }

    const notificationObj = new Notification({
      user_id: result.user_id,
      title: notifTitle,
      message: notifMessage,
      link: '/dashboard/employee/courses'
    });
    
    await databaseService.notifications.insertOne(notificationObj);
    
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${result.user_id}`).emit('new_notification', notificationObj);
    }

    return res.status(200).json({ 
      message: targetStatus === EnrollmentStatus.Approved ? enrollmentMessages.ENROLLMENT_APPROVED : "Trạng thái đã được cập nhật", 
      result 
    });
  } catch (error) {
    return res.status(500).json({ message: enrollmentMessages.ERROR_SERVER });
  }
};

export const rejectEnrollmentController = async (req: Request, res: Response) => {
  const { enrollment_id } = req.params;

  try {
    const result = await databaseService.enrollments.findOneAndDelete(
      { _id: new ObjectId(enrollment_id) }
    );

    if (!result) return res.status(404).json({ message: enrollmentMessages.ENROLLMENT_NOT_FOUND });

    // Thông báo từ chối
    const course = await databaseService.courses.findOne({ _id: result.course_id });
    const notificationObj = new Notification({
      user_id: result.user_id,
      title: 'Từ chối đăng ký',
      message: `Yêu cầu tham gia khóa học "${course?.title || 'Không xác định'}" của bạn đã bị từ chối.`,
    });
    
    await databaseService.notifications.insertOne(notificationObj);

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${result.user_id}`).emit('new_notification', notificationObj);
    }

    return res.status(200).json({ message: "Enrollment rejected and deleted successfully" });
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
        course_id: new ObjectId(course_id),
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

export const getMyEnrolledCoursesController = async (req: Request, res: Response) => {
  const { user_id } = (req as any).decoded_access_token;

  const enrolledCourses = await databaseService.enrollments.aggregate([
    { 
      $match: { 
        user_id: new ObjectId(user_id),
        status: EnrollmentStatus.Approved 
      } 
    },
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
        _id: 1,
        status: 1,
        created_at: 1,
        course_id: 1,
        'course_info._id': 1,
        'course_info.title': 1,
        'course_info.thumbnail': 1,
        'course_info.description': 1,
        'course_info.trainer_id': 1
      }
    },
    { $sort: { created_at: -1 } }
  ]).toArray();

  return res.json({
    message: "Enrolled courses fetched successfully",
    result: enrolledCourses
  });
};