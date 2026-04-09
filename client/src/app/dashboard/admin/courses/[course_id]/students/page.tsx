'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { adminService } from '@/services/admin';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, User, Phone, Mail, Shield, X, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminCourseStudentsPage() {
  const { course_id } = useParams();
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const { data: studentsData, isLoading } = useQuery({
    queryKey: ['courseStudents', course_id],
    queryFn: () => adminService.getCourseEnrollments(course_id as string),
    enabled: !!course_id
  });

  const students = studentsData?.result || [];

  if (isLoading) return <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto h-8 w-8 text-blue-500" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-slate-200" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Danh sách Học viên</h1>
          <p className="text-slate-500 font-medium">Toàn bộ nhân sự đã đăng ký tham gia khóa học này.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden p-6 md:p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-50 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
              <tr>
                <th className="px-6 py-4">Thành viên</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Tình trạng ĐK</th>
                <th className="px-6 py-4 text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-slate-400 font-medium italic">Chưa có ai tham gia khóa học này.</td></tr>
              ) : (
                students.map((enrollment: any) => (
                  <tr key={enrollment._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                         <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                            <AvatarImage src={enrollment.user_info?.avatar} />
                            <AvatarFallback>{enrollment.user_info?.name?.charAt(0) || 'U'}</AvatarFallback>
                         </Avatar>
                         <div>
                            <p className="font-bold text-slate-800">{enrollment.user_info?.name || 'Vô danh'}</p>
                            <p className="text-xs text-slate-400 font-medium">{enrollment.user_info?.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                         {enrollment.user_info?.role || 'STUDENT'}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${enrollment.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                          <span className="text-xs font-bold text-slate-600 uppercase">{enrollment.status}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-full hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 text-blue-600 font-bold"
                        onClick={() => setSelectedStudent(enrollment.user_info)}
                      >
                         <Info className="w-4 h-4 mr-2" /> Xem Profile
                       </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white/20 animate-in zoom-in-95 duration-300">
             <button 
               className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
               onClick={() => setSelectedStudent(null)}
             >
               <X className="w-5 h-5" />
             </button>

             {/* Modal Header/Cover */}
             <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-700" />
             
             {/* Profile Info */}
             <div className="px-8 pb-10 -mt-12 text-center">
                <Avatar className="h-24 w-24 mx-auto border-4 border-white shadow-xl mb-4">
                  <AvatarImage src={selectedStudent.avatar} />
                  <AvatarFallback className="text-2xl font-bold bg-slate-100">{selectedStudent.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedStudent.name || 'Người dùng'}</h2>
                <div className="flex items-center justify-center gap-1.5 mt-1 mb-6">
                  <Shield className="w-3 h-3 text-blue-600" />
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{selectedStudent.role || 'Employee'}</span>
                </div>

                <div className="space-y-4 text-left">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-blue-100 transition-colors">
                    <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Liên hệ</p>
                      <p className="text-sm font-bold text-slate-700">{selectedStudent.email}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-blue-100 transition-colors">
                    <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại</p>
                      <p className="text-sm font-bold text-slate-700">{selectedStudent.phone || 'Chưa cung cấp'}</p>
                    </div>
                  </div>

                  {selectedStudent.bio && (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Giới thiệu</p>
                      <p className="text-sm font-medium text-slate-600 italic leading-relaxed">"{selectedStudent.bio}"</p>
                    </div>
                  )}
                </div>

                <Button className="w-full mt-8 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl py-6" onClick={() => setSelectedStudent(null)}>
                  Đóng Profile
                </Button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
