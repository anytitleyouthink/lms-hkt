import { Server, Socket } from 'socket.io';
import { loungeChatService } from '~/services/loungeChat.services';
import { UserRole } from '~/constants/enums';

export const handleLoungeChatSockets = (io: Server, socket: Socket) => {
  const LOUNGE_ROOM = 'GLOBAL_LOUNGE';
  // We extract 'user' from socket data, which should be populated by your main setupChatSocket middleware
  const user = (socket as any).data?.user;

  // 1. Join the Lounge Room
  socket.on('join_lounge', () => {
    if (!user || user.role === UserRole.Employee) {
       return socket.emit('lounge_error', { message: 'Access denied: You must be an Admin or Trainer to join this lounge.' });
    }
    
    socket.join(LOUNGE_ROOM);
    console.log(`User ${user.user_id} joined the Admin & Trainer Lounge.`);
  });

  // 2. Send Message to Lounge
  socket.on('send_lounge_message', async (data: { text: string }) => {
    try {
      // Validate permissions again to be strictly secure 
      if (!user || user.role === UserRole.Employee) {
         return socket.emit('lounge_error', { message: 'Access denied: You must be an Admin or Trainer to send messages here.' });
      }
      
      const { text } = data;

      // Persist the message via our service natively using the logged-in user id!
      const savedMessage = await loungeChatService.saveLoungeMessage(user.user_id, text);
      
      // Optionally format or lookup sender payload here if desired before emitting 
      const broadcastPayload = {
        _id: savedMessage._id,
        room_id: savedMessage.room_id,
        sender_id: savedMessage.sender_id,
        content: savedMessage.content,
        created_at: savedMessage.created_at,
        user_info: {
    _id: user.user_id,
    name: user.name || "Unknown",
    role: user.role,
    avatar: user.avatar || ""
  }
      };

      // Broadcast to everyone else in the room (or just use `io.to().emit` to send to all including sender)
      io.to(LOUNGE_ROOM).emit('receive_lounge_message', broadcastPayload);

    } catch (error) {
      console.error('Lounge emit error:', error);
      // Let the sender know something failed
      socket.emit('lounge_error', { message: 'Failed to send message to lounge' });
    }
  });

  // 3. Leave the Lounge (cleanup)
  socket.on('leave_lounge', () => {
    socket.leave(LOUNGE_ROOM);
  });
};
