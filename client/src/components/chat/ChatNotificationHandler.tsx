'use client';

import React, { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { customFetch } from '@/lib/api';
import { MessagePayload } from '@/services/message';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquare, Bell } from 'lucide-react';

export const ChatNotificationHandler: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'trainer') return;

    // 1. Kết nối Socket
    const socket = io('http://localhost:4000', {
      auth: { token: localStorage.getItem('access_token') }
    });
    socketRef.current = socket;

    // 2. Lấy danh sách khóa học và tham gia tất cả các phòng
    const joinAllRooms = async () => {
      try {
        const res = await customFetch('/courses', { method: 'GET' });
        const courses = res.result || [];
        
        courses.forEach((course: any) => {
          socket.emit('join_course', course._id);
        });
      } catch (error) {
        console.error('Lỗi khi tham gia các phòng chat:', error);
      }
    };

    socket.on('connect', () => {
      joinAllRooms();
    });

    // 3. Lắng nghe tin nhắn mới
    socket.on('receive_message', (newMessage: MessagePayload) => {
      // Bỏ qua nếu là tin nhắn của chính mình
      if (newMessage.sender_info?._id === user._id) return;

      // Kiểm tra xem người dùng có đang ở chính phòng chat đó không
      // path: /dashboard/trainer/chat?courseId=XYZ
      const currentCourseId = searchParams.get('courseId');
      const isCurrentlyInThisChat = pathname.includes('/trainer/chat') && currentCourseId === (newMessage as any).course_id?.toString();

      if (!isCurrentlyInThisChat) {
        // Hiển thị thông báo Sonner
        toast(
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
               <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-slate-800">Tin nhắn mới từ {newMessage.sender_info?.name || 'Học viên'}</p>
               <p className="text-xs text-slate-500 line-clamp-1">{newMessage.content}</p>
               <button 
                onClick={() => {
                  router.push(`/dashboard/trainer/chat?courseId=${(newMessage as any).course_id}`);
                  toast.dismiss();
                }}
                className="mt-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
               >
                 Trả lời ngay
               </button>
            </div>
          </div>,
          {
            duration: 8000,
            icon: <Bell className="w-4 h-4 text-blue-600" />,
            className: "rounded-3xl border-none shadow-2xl bg-white/95 backdrop-blur-md p-5"
          }
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user, pathname, searchParams, router]);

  return null; // Component này không hiển thị gì cả
};
