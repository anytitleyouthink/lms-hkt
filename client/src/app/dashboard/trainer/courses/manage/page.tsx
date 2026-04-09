'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Users, Star, Loader2 } from "lucide-react";
import Link from 'next/link';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useState } from 'react';

export default function ManageCoursesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['myCourses'],
    queryFn: () => customFetch('/courses', { method: 'GET' }), // Lấy khóa học của user hiện tại
  });

  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; courseId: string; title: string }>({
    isOpen: false,
    courseId: '',
    title: ''
  });

  const deleteMutation = useMutation({
    mutationFn: (courseId: string) => 
      customFetch(`/courses/${courseId}/soft-delete`, { method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCourses'] });
      toast.success("Đã xóa khóa học thành công (Xóa mềm)");
      setConfirmDelete(prev => ({ ...prev, isOpen: false }));
    },
    onError: (err: any) => {
      toast.error("Lỗi xóa khóa học: " + (err.message || "Lỗi hệ thống"));
    }
  });

  const handleDelete = (courseId: string, title: string) => {
    setConfirmDelete({ isOpen: true, courseId, title });
  };

  const courses = data?.result || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Quản lý Khóa học</h1>
          <p className="text-gray-500">Xem, chỉnh sửa, quản lý cấu trúc các khóa học của bạn</p>
        </div>
        <Link href="/dashboard/trainer/courses/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Tạo Khóa học mới
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center p-8">Đang tải danh sách khóa học...</div>
      ) : courses.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg text-gray-500">Bạn chưa có khóa học nào. Hãy bắt đầu tạo mới!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <Card key={course._id} className="overflow-hidden shadow-sm flex flex-col group">
              <div className="h-40 bg-gray-200 relative overflow-hidden">
                <img 
                  src={course.thumbnail || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format"} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
                  {course.status === 1 ? (
                    <span className="text-green-600">Published</span>
                  ) : course.status === 2 ? (
                    <span className="text-slate-600">Archived</span>
                  ) : (
                    <span className="text-amber-600">Draft</span>
                  )}
                </div>
              </div>
              <CardContent className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{course.description || 'Không có mô tả'}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex space-x-3 text-xs text-gray-500 font-medium">
                    <span className="flex items-center"><Users className="w-3 h-3 mr-1"/> {course.studentCount || 0}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/trainer/courses/${course._id}/edit`}>
                      <Button variant="outline" size="sm" className="h-8">
                        <Edit className="w-4 h-4 mr-1" /> Sửa
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-100"
                      onClick={() => handleDelete(course._id, course.title)}
                      disabled={deleteMutation.isPending && deleteMutation.variables === course._id}
                    >
                      {deleteMutation.isPending && deleteMutation.variables === course._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-1" />
                      )}
                      Xóa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => deleteMutation.mutate(confirmDelete.courseId)}
        isLoading={deleteMutation.isPending}
        title="Xóa khóa học"
        description={`Bạn có chắc chắn muốn xóa khóa học "${confirmDelete.title}"? `}
      />
    </div>
  );
}
