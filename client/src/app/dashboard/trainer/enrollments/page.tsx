'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { customFetch } from '@/lib/api';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, ChevronRight, Loader2, Search } from "lucide-react";
import Link from 'next/link';

export default function TrainerEnrollmentCoursesPage() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['trainerCourses'],
    queryFn: () => customFetch('/courses', { method: 'GET' }),
  });

  const courses = data?.result || [];
  const filteredCourses = courses.filter((c: any) => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Quản lý Học viên</h1>
        <p className="text-slate-500 font-medium italic">Chọn khoá học để xem danh sách và quản lý thành viên.</p>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Tìm kiếm khoá học..." 
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all shadow-sm font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Đang tải danh sách khoá học...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-100">
          <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy khoá học nào</h3>
          <p className="text-slate-400 max-w-xs mx-auto">Bạn chưa có khoá học nào hoặc kết quả tìm kiếm không phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: any) => (
            <Link key={course._id} href={`/dashboard/trainer/courses/${course._id}/students`} className="group">
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white h-full">
                <div className="h-48 relative overflow-hidden">
                  <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">{course.category || 'Hệ thống'}</span>
                    <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">{course.title}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                       <div className="p-2 bg-blue-50 rounded-xl">
                          <Users className="w-4 h-4 text-blue-600" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Học viên</p>
                          <p className="font-bold text-slate-800">{course.studentCount || 0}</p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                     <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Quản lý học viên</span>
                     <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                     </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
