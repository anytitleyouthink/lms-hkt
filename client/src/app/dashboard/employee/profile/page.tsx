"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
interface UserProfile {
  name: string;
  phone: string;
  bio: string;
}
export default function CompleteProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Sử dụng useRef để đánh dấu đã khởi tạo dữ liệu vào form hay chưa
  const hasInitialized = useRef(false);

  const { data: userProfile, isLoading: isFetching } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getMe
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: ''
  });

  // Effect để đồng bộ dữ liệu từ API vào Form
  useEffect(() => {
    if (userProfile && !hasInitialized.current) {
      const user = (userProfile as { result: UserProfile }).result || userProfile;
      
      if (user.name || user.phone || user.bio) {
        // Đưa vào timeout để tránh lỗi "cascading renders" trong React 19/Next 15
        const timer = setTimeout(() => {
          setFormData({
            name: user.name || '',
            phone: user.phone || '',
            bio: user.bio || ''
          });
          hasInitialized.current = true;
        }, 0);
        
        return () => clearTimeout(timer);
      }
    }
  }, [userProfile]);

  const updateMutation = useMutation({
    mutationFn: authService.updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      alert("Cập nhật profile thành công!");
    },
    onError: (error: { message: string }) => {
      alert("Có lỗi xảy ra: " + (error.message || "Lỗi không xác định"));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isFetching) return <div className="p-8 text-slate-400">Đang tải thông tin...</div>;

  return (
    <div className="max-w-3xl mx-auto font-sans pb-20 animate-in fade-in duration-500">
      <Link 
        href="/dashboard/employee" 
        className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-blue-600 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Về Bảng điều khiển
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Thông tin Cá nhân</h1>
        <p className="text-slate-500 font-medium">Cập nhật hồ sơ để cá nhân hóa việc học của bạn.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">Họ và Tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nhập họ và tên"
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:border-blue-100 focus:bg-white outline-none transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="VD: 0987654321"
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:border-blue-100 focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">Giới thiệu ngắn (Bio)</label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Kể một chút về mục tiêu của bạn..."
            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:border-blue-100 focus:bg-white outline-none transition-all resize-none"
          ></textarea>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-3"
          >
            {updateMutation.isPending ? "Đang lưu..." : "Lưu Thay Đổi"} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}