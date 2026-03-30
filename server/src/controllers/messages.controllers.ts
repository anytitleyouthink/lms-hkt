import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { messageMessages } from '~/constants/messages';
import databaseService from '~/services/database.services';

export const getMessagesByCourseController = async (req: Request, res: Response) => {
  const { course_id } = req.params;
  const limit = Number(req.query.limit) || 50;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;

  try {
    const totalMessages = await databaseService.messages.countDocuments({ course_id: new ObjectId(course_id) });
    const totalPages = Math.ceil(totalMessages / limit);

    const messages = await databaseService.messages.aggregate([
      { $match: { course_id: new ObjectId(course_id) } },
      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'sender_id',
          foreignField: '_id',
          as: 'sender_info'
        }
      },
      { $unwind: '$sender_info' },
      {
        $project: {
          content: 1, created_at: 1,
          'sender_info._id': 1, 'sender_info.name': 1, 'sender_info.avatar': 1
        }
      }
    ]).toArray();

    return res.status(200).json({
      message: messageMessages.MESSAGES_FETCHED,
      result: messages.reverse(),
      pagination: { page, limit, total_pages: totalPages, total_messages: totalMessages }
    });
  } catch (error: any) {
    return res.status(500).json({ message: messageMessages.ERROR_SERVER, error: error.message });
  }
};