import { Request, Response } from 'express';
import { loungeChatService } from '~/services/loungeChat.services';

export const getLoungeMessagesController = async (req: Request, res: Response) => {
  const limitStr = req.query.limit as string;
  const limit = limitStr ? parseInt(limitStr, 10) : 50;

  const messages = await loungeChatService.getLoungeMessages(limit);

  return res.status(200).json({
    message: 'Lounge messages fetched successfully',
    result: messages
  });
};
