'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { enrollmentService } from '@/services/enrollment';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, UserCheck, UserX, Loader2, 
  ArrowLeft, Search, Mail, Phone, Clock,
  ShieldCheck, ShieldAlert, XCircle, Trash2, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function TrainerStudentManagementPage() {
  const { course_id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [enrollmentToProcess, setEnrollmentToProcess] = React.useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['courseEnrollments', course_id],
    queryFn: () => enrollmentService.getCourseEnrollments(course_id as string),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: number }) => 
      enrollmentService.updateEnrollmentStatus(id, status),
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries({ queryKey: ['courseEnrollments', course_id] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Lỗi cập nhật trạng thái");
    }
  });

  const enrollments = data?.result || [];
  const filteredEnrollments = enrollments.filter((e: any) => 
    e.user_info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.user_info.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Đang đồng bộ dữ liệu học viên...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
           <Button 
            variant="ghost" 
            size="sm" 
            className="group rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all font-bold text-xs uppercase tracking-widest p-0 pr-4"
            onClick={() => router.push('/dashboard/trainer/enrollments')}
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <ArrowLeft className="w-4 h-4" />
            </div>
            Quay lại danh sách
          </Button>
          
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Quản lý Học viên</h1>
            <p className="text-slate-500 font-medium italic">"Phê duyệt quyền truy cập và giám sát nhân sự trong khóa học của bạn"</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2rem] p-6 text-white min-w-[240px] shadow-2xl shadow-blue-900/20 relative overflow-hidden">
           <div className="relative z-10 flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Tổng học viên</p>
                 <h2 className="text-3xl font-black tracking-tighter">{enrollments.length}</h2>
              </div>
              <Users className="w-10 h-10 text-white/10" />
           </div>
           <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl" />
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc email học viên..." 
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50/50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl border border-green-100">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">{enrollments.filter((e: any) => e.status === 1).length} Hoạt động</span>
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-xl border border-yellow-100">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              <span className="text-[10px] font-black text-yellow-700 uppercase tracking-widest">{enrollments.filter((e: any) => e.status === 0).length} Đang chờ</span>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden mb-20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Thành viên</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">Liên hệ</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">Vai trò</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">Tình trạng</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="w-12 h-12 text-slate-100 mb-4" />
                      <p className="text-slate-400 font-medium italic">Không tìm thấy học viên nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((enrollment: any) => {
                  const isApproved = enrollment.status === 1;
                  const isPending = enrollment.status === 0;

                  return (
                    <tr key={enrollment._id} className={cn(
                      "group transition-all duration-300",
                      !isApproved ? "bg-slate-50/50" : "hover:bg-blue-50/10"
                    )}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-black text-sm shadow-sm border border-white">
                              {enrollment.user_info.name.charAt(0).toUpperCase()}
                            </div>
                            {isApproved && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 text-sm tracking-tight truncate">{enrollment.user_info.name}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NV Tham gia</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-blue-400" />
                            {enrollment.user_info.email}
                          </div>
                          <span className="text-[9px] font-black text-slate-300 uppercase leading-none">{new Date(enrollment.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                         <span className={cn(
                           "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm",
                           enrollment.user_info.role === 'trainer' ? "bg-purple-100 text-purple-700 border-purple-100" :
                           enrollment.user_info.role === 'admin' ? "bg-red-100 text-red-700 border-red-100" :
                           "bg-blue-50 text-blue-700 border-blue-100"
                         )}>
                            {enrollment.user_info.role === 'trainer' ? 'Giảng viên' : 
                             enrollment.user_info.role === 'admin' ? 'Quản trị' : 'Nhân viên'}
                         </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {isApproved ? (
                          <div className="inline-flex items-center gap-1.5 text-green-600 font-black text-[9px] uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">
                             <CheckCircle className="w-3 h-3" /> Đã duyệt
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-yellow-600 font-black text-[9px] uppercase tracking-widest bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                             <Clock className="w-3 h-3" /> Chờ duyệt
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center justify-center gap-3">
                            {isPending && (
                              <Button 
                                size="sm" 
                                className="h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-[9px] font-black uppercase tracking-widest px-3 shadow-lg shadow-blue-100"
                                onClick={() => updateMutation.mutate({ id: enrollment._id, status: 1 })}
                                disabled={updateMutation.isPending}
                              >
                                Duyệt ngay
                              </Button>
                            )}
                            <div className="flex items-center gap-2 border-l border-slate-100 pl-3 ml-1">
                               <span className={cn(
                                 "text-[9px] font-black uppercase tracking-tight",
                                 isApproved ? "text-green-500" : "text-slate-300"
                               )}>
                                 {isApproved ? "Active" : "Closed"}
                               </span>
                               <Switch 
                                 checked={isApproved}
                                 onCheckedChange={(checked) => {
                                   const status = checked ? 1 : 0;
                                   if (!checked) {
                                      setEnrollmentToProcess({ id: enrollment._id, status });
                                      setIsConfirmModalOpen(true);
                                   } else {
                                      updateMutation.mutate({ id: enrollment._id, status });
                                   }
                                 }}
                                 disabled={updateMutation.isPending}
                                 className="scale-75 data-[state=checked]:bg-green-500"
                               />
                            </div>
                         </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] border-0 shadow-2xl">
          <DialogHeader className="items-center text-center pt-8 pb-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <UserX className="w-8 h-8 text-red-500" />
            </div>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Xác nhận gỡ học viên</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium px-4">
              Bạn có chắc chắn muốn gỡ học viên này khỏi khóa học? Học viên sẽ không thể tiếp tục truy cập vào nội dung bài học.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 p-6 pt-2">
            <Button 
              type="button" 
              variant="ghost" 
              className="flex-1 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 h-12"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button 
              type="button" 
              className="flex-1 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold h-12 shadow-lg shadow-red-100"
              onClick={() => {
                if (enrollmentToProcess) {
                  updateMutation.mutate(enrollmentToProcess);
                  setIsConfirmModalOpen(false);
                }
              }}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : "Đồng ý gỡ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
