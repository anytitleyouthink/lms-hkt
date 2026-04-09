'use client';

import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, UserCheck, ShieldCheck, ArrowRight, Activity, TrendingUp } from "lucide-react";
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => adminService.getUsers()
  });

  const { data: coursesData, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['adminAllCourses'],
    queryFn: adminService.getAllCourses
  });

  const users = usersData?.result || [];
  const courses = coursesData?.result || [];

  const stats = {
    totalUsers: users.length,
    totalCourses: courses.length,
    trainers: users.filter((u: any) => u.role === 'trainer').length,
    employees: users.filter((u: any) => u.role === 'employee' || u.role === 'student').length,
  };

  const menuCards = [
    {
      title: "Quản lý người dùng",
      description: "Tạo mới, khóa/mở khóa và phân quyền tài khoản.",
      icon: Users,
      link: "/dashboard/admin/users",
      color: "bg-blue-500",
      stats: `${stats.totalUsers} Thành viên`
    },
    {
      title: "Quản lý khóa học",
      description: "Theo dõi danh sách học viên trong từng khóa học.",
      icon: BookOpen,
      link: "/dashboard/admin/courses",
      color: "bg-purple-500",
      stats: `${stats.totalCourses} Khóa học`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Hệ thống Quản trị</h1>
          <p className="text-slate-500 font-medium italic">"Trung tâm điều phối và giám sát toàn bộ hoạt động của VICTORY TTT"</p>
        </div>
        <div className="hidden md:block">
           <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full uppercase tracking-widest border border-blue-100 shadow-sm">
             Quyền hạn: Administrator
           </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-slate-50/50 rounded-[2rem]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
              <Activity className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng người dùng</p>
            <h3 className="text-3xl font-black text-slate-800">{isLoadingUsers ? '...' : stats.totalUsers}</h3>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-slate-50/50 rounded-[2rem]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng Khóa học</p>
            <h3 className="text-3xl font-black text-slate-800">{isLoadingCourses ? '...' : stats.totalCourses}</h3>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-slate-50/50 rounded-[2rem]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                <UserCheck className="w-6 h-6" />
              </div>
              <ShieldCheck className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giảng viên</p>
            <h3 className="text-3xl font-black text-slate-800">{isLoadingUsers ? '...' : stats.trainers}</h3>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-slate-50/50 rounded-[2rem]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-100 text-cyan-600 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <Activity className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nhân sự (Employees)</p>
            <h3 className="text-3xl font-black text-slate-800">{isLoadingUsers ? '...' : stats.employees}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {menuCards.map((card, idx) => (
          <Link key={idx} href={card.link} className="group">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white h-full">
              <CardContent className="p-0 flex h-full">
                <div className={`w-3 ${card.color} transition-all duration-500 group-hover:w-6`} />
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className={`w-14 h-14 rounded-2xl ${card.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
                      <card.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">{card.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{card.description}</p>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-sm font-black text-slate-800 tracking-tight">{card.stats}</span>
                    <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                      Tiếp tục <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
             <h2 className="text-3xl font-black mb-4 tracking-tight">Hỗ trợ Phê duyệt Tài khoản</h2>
             <p className="text-slate-400 font-medium leading-relaxed">
               Với tư cách là Quản trị viên, bạn có quyền can thiệp vào tình trạng hoạt động của toàn bộ người dùng 
               và kiểm soát luồng học viên của mỗi giảng viên. Luôn đảm bảo rà soát kỹ lưỡng danh sách nhân sự mới.
             </p>
          </div>
          
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-black px-10 py-8 rounded-2xl uppercase text-xs tracking-widest transition-transform hover:-translate-y-1">
              COMING SOON<ArrowRight className="ml-2 w-5 h-5" />
            </Button>
         
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
      </div>
    </div>
  );
}
