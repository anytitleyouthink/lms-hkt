'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { enrollmentService } from '@/services/enrollment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Clock, PlayCircle } from 'lucide-react';
import Link from 'next/link';

const MyCoursesPage = () => {
  const { data: enrolledData, isLoading } = useQuery({
    queryKey: ['myEnrolledCourses'],
    queryFn: enrollmentService.getMyEnrolledCourses,
  });

  const enrolledCourses = enrolledData?.result || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Khóa học của tôi</h1>
        <p className="text-slate-500 text-sm">Danh sách các khóa học bạn đã đăng ký và đang tham gia học tập.</p>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">Bạn chưa tham gia khóa học nào</h3>
          <p className="text-slate-500 mb-6">Hãy khám phá các khóa học mới nhất và đăng ký ngay hôm nay.</p>
          <Link href="/dashboard/employee">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
              Khám phá khóa học
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((item: any) => {
            const course = item.course_info;
            return (
              <Card key={item._id} className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 group rounded-3xl bg-white flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format"} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-full font-black uppercase tracking-widest">ENROLLED</span>
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed flex-1">
                    {course.description || "Bắt đầu hành trình chinh phục kiến thức mới ngay hôm nay cùng Victory TTT."}
                  </p>
                  
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 mb-6">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(item.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </div>

                  <Link href={`/dashboard/employee/courses/${course._id}`} className="block">
                    <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white rounded-2xl h-11 font-bold transition-colors group">
                      <PlayCircle className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                      Vào học ngay
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
