'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { trainerService } from '@/services/trainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, XCircle, Search, PlusCircle, Star, Users } from "lucide-react";
import Link from 'next/link';

export default function TrainerDashboard() {
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState('');

  // 1. Fetch Dashboard Summary (Assume it returns summary stats and list of trainer's courses)
  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['trainerDashboardSummary'],
    queryFn: trainerService.getDashboardSummary,
  });

  const courses = summaryData?.result?.courses || [];
  const stats = summaryData?.result?.stats || { total_courses: 0, total_all_students: 0 };

  // 2. Fetch Pending Requests for all courses (Since we need a combined list, and user asked to use course_id/requests/pending)
  // Trong thực tế React Query, ta có thể dùng useQueries. Tạm thời giả lập gọi tất cả và gộp lại.
  const { data: pendingRequestsData, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['pendingRequests', courses.map((c: any) => c._id)],
    queryFn: async () => {
      if (!courses || courses.length === 0) return [];
      const promises = courses.map((course: any) => 
        trainerService.getPendingRequestsForCourse(course._id)
          .then(res => res.result?.map((req: any) => ({ ...req, courseName: course.title })) || [])
          .catch(() => [])
      );
      const results = await Promise.all(promises);
      return results.flat(); // Gộp tất cả request vào 1 mảng
    },
    enabled: courses.length > 0, // Chỉ gọi khi đã có khóa học
  });

  // Action Mutations
  const approveMutation = useMutation({
    mutationFn: trainerService.approveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: trainerService.rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    }
  });

  // Lọc pending requests theo Search Email
  const filteredRequests = useMemo(() => {
    if (!pendingRequestsData) return [];
    if (!searchEmail) return pendingRequestsData;
    return pendingRequestsData.filter((req: any) => 
      req.employee?.email?.toLowerCase().includes(searchEmail.toLowerCase())
    );
  }, [pendingRequestsData, searchEmail]);

  if (isLoadingSummary) return <div className="p-8">Đang tải dữ liệu Dashboard...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Trainer Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Managing the future of your learning ecosystem.</p>
        </div>
        <Link href="/dashboard/trainer/courses/create">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Overview & Requests) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Student Progress Overview */}
          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Student Progress Overview</CardTitle>
              <Button variant="link" className="text-blue-600 dark:text-blue-400 p-0">View Full Report</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Students</div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-blue-900 dark:text-white">{stats.total_all_students?.toLocaleString() || 0}</span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Courses</div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-blue-900 dark:text-white">{stats.total_courses || 0}</span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          <div className="rounded-xl bg-white shadow-sm p-6">
            <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-700">Enrollment Requests</h2>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo Email..."
                  className="pl-9 bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-lg text-sm"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Người dùng</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vai trò</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Khóa học</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày gửi</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoadingRequests ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">Đang tải...</td></tr>
                  ) : filteredRequests?.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">Không có yêu cầu duyệt nào.</td></tr>
                  ) : (
                    filteredRequests.map((req: any, idx: number) => {
                      const userRole = req.user_info?.role || 'student';
                      const roleLabel = userRole === 'admin' ? 'Quản trị viên' 
                                      : userRole === 'trainer' ? 'Giảng viên'
                                      : 'Học sinh';
                      const roleColor = userRole === 'admin' ? 'bg-red-100 text-red-800' 
                                      : userRole === 'trainer' ? 'bg-purple-100 text-purple-800'
                                      : 'bg-blue-100 text-blue-800';
                      return (
                      <tr key={req._id || idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold uppercase">
                                  {req.user_info?.name?.charAt(0) || req.user_info?.email?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{req.user_info?.name || 'Unknown'}</p>
                                    <p className="text-sm text-gray-500">{req.user_info?.email}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColor}`}>
                            {roleLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-900 font-semibold">{req.course_info?.title}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                           {req.created_at ? new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-center gap-2">
                             <button
                               onClick={() => approveMutation.mutate(req._id)}
                               disabled={approveMutation.isPending}
                               className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50 transition-colors"
                               title="Approve"
                             >
                               <CheckCircle2 size={20} />
                             </button>
                             <button
                               onClick={() => rejectMutation.mutate(req._id)}
                               disabled={rejectMutation.isPending}
                               className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
                               title="Reject"
                             >
                               <XCircle size={20} />
                             </button>
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
        </div>

        {/* Right Column (Your Courses) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Courses</h2>
          
          <div className="space-y-4">
            {courses.length > 0 ? courses.map((course: any) => (
             <Link key={course._id} href={`/dashboard/trainer/courses/${course._id}/edit`} className="block">
               <Card className="overflow-hidden border-0 shadow-sm rounded-2xl group cursor-pointer hover:shadow-md transition-shadow">
               <div className="h-32 bg-gray-200 relative overflow-hidden">
                 {/* Fake image placeholder if no thumbnail */}
                 <img 
                   src={course.thumbnail || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop"} 
                   alt={course.title}
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                 <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded">
                   {course.category || 'COURSE'}
                 </div>
               </div>
               <CardContent className="p-4 bg-white dark:bg-gray-800">
                 <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-1">{course.title}</h3>
                 <div className="flex justify-between items-center text-sm text-gray-500">
                   <div className="flex items-center">
                     <Users className="w-4 h-4 mr-1" />
                     <span>{course.total_students || 0} Students</span>
                   </div>
                   <div className="flex items-center">
                     <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                     <span>{course.rating || 'N/A'}</span>
                   </div>
                 </div>
               </CardContent>
             </Card>
            </Link>
            )) : (
              <div className="text-gray-500 text-sm p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                Bạn chưa có khóa học nào được tạo.
              </div>
            )}

            <Link href="/dashboard/trainer/courses/create" className="block">
              <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800 transition-colors cursor-pointer rounded-2xl">
                <CardContent className="p-6 flex flex-col items-center justify-center text-gray-500">
                  <PlusCircle className="w-8 h-8 mb-2 text-blue-300" strokeWidth={1.5} />
                  <span className="text-sm font-medium">Add more courses</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
