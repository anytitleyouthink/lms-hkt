import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseService from '~/services/database.services';

export const getMyNotificationsController = async (req: Request, res: Response) => {
  const { user_id } = (req as any).decoded_access_token;

  try {
    const notifications = await databaseService.notifications
      .find({ user_id: new ObjectId(user_id) })
      .sort({ created_at: -1 })
      .limit(20)
      .toArray();

    return res.status(200).json({
      message: 'Lấy danh sách thông báo thành công',
      result: notifications
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server khi lấy thông báo' });
  }
};

export const markNotificationReadController = async (req: Request, res: Response) => {
  const { notification_id } = req.params;

  try {
    const result = await databaseService.notifications.findOneAndUpdate(
      { _id: new ObjectId(notification_id) },
      { $set: { is_read: true } },
      { returnDocument: 'after' }
    );
    return res.status(200).json({ message: 'Đã đánh dấu đã đọc', result });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server khi đọc thông báo' });
  }
};
