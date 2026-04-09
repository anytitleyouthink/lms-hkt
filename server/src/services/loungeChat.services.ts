import databaseService from './database.services';
import Message from '~/models/schemas/Message.schema';
import { ObjectId } from 'mongodb';

class LoungeChatService {
  async getLoungeMessages(limit: number = 50) {
    const messages = await databaseService.messages.aggregate([
      { $match: { room_id: 'GLOBAL_LOUNGE' } },
      { $sort: { created_at: -1 } },
      { $limit: limit },
      { 
        $lookup: {
          from: process.env.DB_USERS_COLLECTION || 'users',
          localField: 'sender_id',
          foreignField: '_id',
          as: 'sender'
        }
      },
      { $unwind: '$sender' }, // converts sender array to object
      {
        $project: {
          _id: 1,
          room_id: 1,
          sender_id: 1,
          content: 1,
          created_at: 1,
          'sender.name': 1,
          'sender.avatar': 1,
          'sender.role': 1
        }
      }
    ]).toArray();

    // Re-sort ascending so the frontend displays older messages first
    return messages.reverse();
  }

  async saveLoungeMessage(sender_id: string, text: string) {
    const message = new Message({
      room_id: 'GLOBAL_LOUNGE',
      sender_id: new ObjectId(sender_id),
      content: text // the schema uses content instead of text
    });

    const result = await databaseService.messages.insertOne(message);
    return { ...message, _id: result.insertedId };
  }
}

export const loungeChatService = new LoungeChatService();
