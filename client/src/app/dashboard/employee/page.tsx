"use client"
import  { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Trophy } from 'lucide-react';
import Image from 'next/image';
export default function EmployeeDashboard() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['employeeDashboardSummary'],
    queryFn: authService.getEmployeeDashboard,
  });

  if (!mounted || isLoading) return <div className="p-8 flex justify-center text-slate-400">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-8 flex justify-center text-red-500">Lỗi tải dữ liệu</div>;

  const recentLearning = data?.result?.recent_learning || [];
  interface RecentLearningItem {
    course_info: {
      title: string;
      thumbnail: string;
    };
    progress_detail: {
      percentage: number;
    };
  }
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-800">Thông tin của bạn</h1>
        <p className="text-slate-500">Chào mừng trở lại! Tiếp tục việc học của bạn nhé.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder Stats */}
        <Card className="border-none shadow-sm h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Khóa học đang học</CardTitle>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentLearning.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Chứng chỉ</CardTitle>
            <Trophy className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.result?.total_certificates || 0}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold tracking-tight text-slate-800 mt-8 mb-4">Khóa học gần đây</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {recentLearning.map((item: RecentLearningItem, idx: number) => (
          <Card key={idx} className="border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
            {item.course_info?.thumbnail && (
             <Image 
  src={item.course_info.thumbnail} 
  alt={item.course_info.title} 
  width={400} // Thay bằng chiều rộng thực tế của ảnh hoặc tỉ lệ mong muốn
  height={160} // Tương ứng với h-40 (40 * 4px = 160px)
  className="w-full h-40 object-cover" 
/>
            )}
            <CardHeader>
              <CardTitle className="text-lg">{item.course_info?.title || "Chưa có tên"}</CardTitle>
              <CardDescription>Tiến độ học tập</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                 <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.progress_detail?.percentage || 0}%` }}></div>
               </div>
               <p className="text-xs text-slate-500 font-bold text-right">{item.progress_detail?.percentage || 0}% Hoàn thành</p>
            </CardContent>
          </Card>
        ))}
        {recentLearning.length === 0 && (
          <div className="col-span-2 p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
            Bạn chưa đăng ký khóa học nào.
          </div>
        )}
      </div>

    </div>
  );
}
