import { Server, Socket } from 'socket.io';
import { ObjectId } from 'mongodb';
import { verifyToken } from '~/utils/jwt';
import databaseService from '~/services/database.services';
import Message from '~/models/schemas/Message.schema';
import { TokenPayload } from '~/models/requests/User.requests';
import { EnrollmentStatus } from '~/constants/enums';
import { enrollmentMessages, messageMessages } from '~/constants/messages';

export const setupChatSocket = (io: Server) => {
  // 1. Kiểm tra Token
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];
      if (!token) return next(new Error('Chưa cung cấp token'));
      
      const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
      const privateKey = process.env.JWT_PRIVATE_ACCESS_TOKEN as string;
      const decoded = await verifyToken(actualToken, privateKey) as TokenPayload;
      
      (socket as any).data = { user: decoded };
      next();
    } catch (err) {
      next(new Error('Token invalid '));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).data.user;

    // 2. Chui vào phòng chat
    socket.on('join_course', async (course_id: string) => {
  
      const isEnrolled = await databaseService.enrollments.findOne({
        user_id: new ObjectId(user.user_id),
        course_id: new ObjectId(course_id),
        status: EnrollmentStatus.Approved 
      });

      if (!isEnrolled) {
        return socket.emit('error', enrollmentMessages.ENROLLMENT_NOT_APPROVED);
      }

      socket.join(`course_${course_id}`);
      console.log(`User ${user.user_id} joined course ${course_id}`);
    });

    // 3. Gửi tin nhắn
    socket.on('send_message', async (data: { course_id: string; content: string }) => {
       try {
           const { course_id, content } = data;
           const newMessage = new Message({
             course_id: new ObjectId(course_id),
             sender_id: new ObjectId(user.user_id),
             content
           });

           await databaseService.messages.insertOne(newMessage);
           io.to(`course_${course_id}`).emit('receive_message', newMessage);
       } catch (error) {
           socket.emit('error', messageMessages.ERROR_WHILE_SENDING_MESSAGE);
       }
    });

    socket.on('disconnect', () => {
      console.log(`User ngắt kết nối: ${user.user_id}`);
    });
  });
};