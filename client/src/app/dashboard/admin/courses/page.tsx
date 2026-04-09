'use client';

import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Star, BookOpen, ChevronRight } from "lucide-react";
import Link from 'next/link';

export default function AdminCoursesPage() {
  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['adminAllCourses'],
    queryFn: adminService.getAllCourses
  });

  const courses = coursesData?.result || [];

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto h-8 w-8 text-blue-500" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Hệ thống Khóa học</h1>
        <p className="text-gray-500">Xem và quản lý tất cả các khóa học trên nền tảng.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">Chưa có khóa học nào trong hệ thống.</p>
          </div>
        ) : (
          courses.map((course: any) => (
            <Link key={course._id} href={`/dashboard/admin/courses/${course._id}/students`} className="block group">
              <Card className="overflow-hidden border-0 shadow-sm rounded-2xl hover:shadow-md transition-all duration-300">
                <div className="h-40 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-1">{course.category || 'CHƯA PHÂN LOẠI'}</p>
                    <h3 className="font-bold text-lg line-clamp-1">{course.title}</h3>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1.5 text-slate-400" />
                      <span className="font-medium text-slate-700">{course.studentCount || 0} Học viên</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                      <span className="font-medium text-slate-700">{course.rating || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">XEM HỌC VIÊN</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
