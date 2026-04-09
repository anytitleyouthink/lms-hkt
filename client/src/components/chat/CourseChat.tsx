'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  MessageCircle, X, Send, Loader2, User, 
  ChevronDown, MessageSquare, ShieldCheck, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { messageService, MessagePayload, PaginationInfo } from '@/services/message';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface CourseChatProps {
  courseId: string;
  isInline?: boolean;
}

export const CourseChat: React.FC<CourseChatProps> = ({ courseId, isInline = false }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(isInline);
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 1. Fetch tin nhắn lịch sử
  const fetchMessages = useCallback(async (page: number = 1) => {
    try {
      const res = await messageService.getMessagesByCourse(courseId, page);
      if (page === 1) {
        setMessages(res.result);
      } else {
        // Lưu lại chiều cao trước khi thêm tin nhắn mới để giữ scroll position
        const container = chatContainerRef.current;
        const previousHeight = container?.scrollHeight || 0;
        
        setMessages(prev => [...res.result, ...prev]);
        
        // Sau khi render xong (setTimeout 0), điều chỉnh scroll
        setTimeout(() => {
          if (container) {
            container.scrollTop = container.scrollHeight - previousHeight;
          }
        }, 0);
      }
      setPagination(res.pagination);
    } catch (error) {
      console.error('Lỗi khi lấy tin nhắn:', error);
    }
  }, [courseId]);

  // 2. Khởi tạo Socket
  useEffect(() => {
    if (!isOpen) return;

    // Connect to backend (thường chạy cổng 4000 theo index.ts server)
    const socket = io('http://localhost:4000', {
      auth: { token: localStorage.getItem('access_token') }
    });
    
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket');
      socket.emit('join_course', courseId);
    });

    socket.on('receive_message', (newMessage: MessagePayload) => {
      // Vì backend trả về Message object thiếu sender_info mapping đôi khi
      // Nếu là tin nhắn của chính mình, mình có thể bổ sung avatar/name
      setMessages(prev => [...prev, newMessage]);
      
      // Nếu user đang ở gần cuối, tự động scroll xuống
      const container = chatContainerRef.current;
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        if (isNearBottom) {
          setTimeout(() => {
            container.scrollTop = container.scrollHeight;
          }, 50);
        }
      }
    });

    socket.on('error', (msg: string) => {
      console.error('Socket error:', msg);
    });

    return () => {
      socket.disconnect();
    };
  }, [isOpen, courseId]);

  // 3. Tải tin nhắn lần đầu khi mở box
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsLoading(true);
      fetchMessages(1).finally(() => setIsLoading(false));
    }
  }, [isOpen, fetchMessages, messages.length]);

  // 4. Infinite Scroll Logic
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container || isFetchingMore || !pagination) return;

    // Khi cuộn lên gần top (ví dụ < 20px)
    if (container.scrollTop < 20 && pagination.page < pagination.total_pages) {
      setIsFetchingMore(true);
      fetchMessages(pagination.page + 1).finally(() => setIsFetchingMore(false));
    }
  };

  // 5. Gửi tin nhắn
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !socketRef.current) return;

    socketRef.current.emit('send_message', {
      course_id: courseId,
      content: inputValue
    });
    
    setInputValue('');
  };

  // 6. Scroll xuống cuối khi tin nhắn đầu tiên load xong
  useEffect(() => {
    if (messages.length > 0 && !pagination?.page || pagination?.page === 1) {
       if (chatContainerRef.current) {
         chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
       }
    }
  }, [messages.length, pagination?.page]);

  return (
    <>
      {/* Floating Button - Hẳn khi là inline */}
      {!isInline && (
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl z-50 transition-all duration-500 scale-110 active:scale-95 ${
            isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-300'
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 animate-pulse" />}
        </Button>
      )}

      {/* Chat Panel */}
      <div className={`${isInline ? 'relative w-full h-full' : 'fixed bottom-24 right-6 w-[400px] h-[600px] rounded-[2.5rem] shadow-2xl z-50 transition-all duration-500 ease-elastic'} bg-white border border-slate-100 flex flex-col overflow-hidden ${
        !isInline && (isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-0 translate-y-48 opacity-0 pointer-events-none')
      }`}>
        
        {/* Header - Only shown in floating mode */}
        {!isInline && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-tight">KÊNH THẢO LUẬN</h3>
                <div className="text-[10px] font-bold text-blue-100 uppercase tracking-widest flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                  Trực tuyến • {courseId.substring(0, 8)}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded-xl">
               <ChevronDown className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Message List */}
        <div 
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
        >
          {isFetchingMore && (
            <div className="flex justify-center py-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            </div>
          )}

          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-slate-400">
               <Loader2 className="w-8 h-8 animate-spin" />
               <p className="text-xs font-bold uppercase tracking-widest">Đang tải cuộc hội thoại...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50 text-center px-10">
               <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-slate-400" />
               </div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-loose">
                  Chưa có tin nhắn nào.<br/>Hãy bắt đầu cuộc thảo luận vui vẻ!
               </p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = (msg.sender_info?._id || (msg as any).sender_id?.toString()) === user?._id?.toString();
              const senderName = msg.sender_info?.name || 'Thanh viên';
              const senderAvatar = msg.sender_info?.avatar;

              return (
                <div key={msg._id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                   {!isMe && (
                     <p className="text-[10px] font-bold text-slate-400 mb-1 ml-11 uppercase flex items-center gap-1">
                        {senderName}
                        <ShieldCheck className="w-3 h-3 text-blue-400" />
                     </p>
                   )}
                   <div className={`flex items-end gap-3 max-w-[85%] ${isMe ? 'flex-row-reverse' : ''}`}>
                      {!isMe && (
                        <div className="w-8 h-8 rounded-2xl bg-slate-100 flex-shrink-0 flex items-center justify-center border border-white shadow-sm overflow-hidden">
                           {senderAvatar ? (
                             <img src={senderAvatar} className="w-full h-full object-cover" />
                           ) : (
                             <User className="w-4 h-4 text-slate-400" />
                           )}
                        </div>
                      )}
                      
                      <div className={`relative px-4 py-3 rounded-2xl text-sm shadow-sm group ${
                        isMe 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 border border-slate-50 rounded-tl-none'
                      }`}>
                         {msg.content}
                         <span className={`absolute -bottom-4 ${isMe ? 'right-0' : 'left-0'} text-[8px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                            {format(new Date(msg.created_at), 'HH:mm', { locale: vi })} • {format(new Date(msg.created_at), 'dd/MM', { locale: vi })}
                         </span>
                      </div>
                   </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input area */}
        <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100">
           <div className="relative group">
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập nội dung thảo luận..."
                className="h-14 pl-5 pr-14 rounded-[1.5rem] bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-100 transition-all font-medium text-slate-700"
              />
              <Button 
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-2 top-2 h-10 w-10 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 p-0"
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
           </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes loading-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .ease-elastic {
          transition-timing-function: cubic-bezier(0.68, -0.6, 0.32, 1.6);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
};
