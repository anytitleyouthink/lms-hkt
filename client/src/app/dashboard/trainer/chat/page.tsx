'use client';

import React, { useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { customFetch } from '@/lib/api';
import { CourseChat } from '@/components/chat/CourseChat';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  MessageSquare, Users, BookOpen, Search, 
  ChevronRight, Hash, ShieldCheck, Clock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ChatPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCourseId = searchParams.get('courseId');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['myCoursesChat'],
    queryFn: () => customFetch('/courses', { method: 'GET' }),
  });

  const courses = data?.result || [];
  const filteredCourses = courses.filter((c: any) => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCourse = courses.find((c: any) => c._id === selectedCourseId);

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
      
      {/* Sidebar List Courses */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Tin nhắn
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Tìm khóa học..." 
              className="pl-10 h-10 rounded-xl bg-white border-slate-200 focus:ring-blue-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-1">
            {isLoading ? (
               <div className="p-4 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">Đang tải danh sách...</div>
            ) : filteredCourses.length === 0 ? (
               <div className="p-4 text-center text-xs text-slate-400 py-10">Không tìm thấy khóa học</div>
            ) : (
              filteredCourses.map((course: any) => {
                const isActive = course._id === selectedCourseId;
                return (
                  <button
                    key={course._id}
                    onClick={() => router.push(`/dashboard/trainer/chat?courseId=${course._id}`)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                        : 'hover:bg-white hover:shadow-sm text-slate-600'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 ${isActive ? 'border-white/30' : 'border-white shadow-sm'}`}>
                       <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200'} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                       <p className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>{course.title}</p>
                       <p className={`text-[10px] uppercase font-black tracking-widest flex items-center gap-1 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                          <Users className="w-3 h-3" /> {course.studentCount || 0} nhân viên
                       </p>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-white/50" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative bg-white">
        {selectedCourse ? (
          <>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                     <Hash className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                     <div className="flex items-center gap-2">
                        <h2 className="font-black text-slate-800 tracking-tight">{selectedCourse.title}</h2>
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                     </div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        Kênh thảo luận chung • <span className="text-green-500">Hoạt động</span>
                     </p>
                  </div>
               </div>
               
               

            </div>

            <div className="flex-1 relative">
               {/* Sẽ hiển thị CourseChat ở đây. 
                   Tuy nhiên CourseChat hiện đang là Floating component.
                   Tôi sẽ cần tạo một phiên bản Inline hoặc chỉnh sửa CourseChat.
               */}
               <div className="absolute inset-0 overflow-hidden">
                  <CourseChat courseId={selectedCourseId as string} isInline={true} />
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20 space-y-6">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center relative">
                <MessageSquare className="w-10 h-10 text-slate-200" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full border-4 border-white animate-bounce" />
             </div>
             <div>
                <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Chào mừng quay lại kênh thảo luận!</h3>
                <p className="text-slate-400 max-w-sm font-medium leading-relaxed">
                   Chọn một khóa học từ danh sách bên trái để bắt đầu hỗ trợ học viên và quản lý các cuộc thảo luận trực tiếp.
                </p>
             </div>
          </div>
        )}
      </div>

      <style jsx global>{`
         /* Chỉnh sửa CSS của CourseChat khi hiển thị trong trang này */
         .chat-page-container .fixed.bottom-24 {
            position: absolute !important;
            bottom: 0 !important;
            right: 0 !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            transform: none !important;
            opacity: 1 !important;
            pointer-events: auto !important;
         }
         /* Ẩn nút floating khi ở trang chat */
         .chat-page-container .fixed.bottom-6 {
            display: none !important;
         }
      `}</style>
    </div>
  );
};

export default function TrainerChatPage() {
  return (
    <div className="chat-page-container">
      <Suspense fallback={<div className="p-8 text-center font-bold text-slate-400 uppercase animate-pulse">Đang khởi tạo phòng chat...</div>}>
         <ChatPageContent />
      </Suspense>
    </div>
  );
}
