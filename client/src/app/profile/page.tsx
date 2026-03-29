"use client";

import React, { useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';

export default function CompleteProfilePage() {
  // Quản lý trạng thái các môn học được chọn
  const [selectedInterests, setSelectedInterests] = useState(['AI & Machine Learning']);

  // Danh sách các môn học gợi ý
  const interests = [
    'AI & Machine Learning', 'UI/UX Design', 'Management',
    'Data Visualization', 'Leadership', 'Cybersecurity'
  ];

  // Hàm xử lý khi click chọn môn học
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto font-sans animate-fade-in">
      
      {/* Tiêu đề trang */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-[#1e293b] tracking-tight mb-2">Complete Your Profile</h1>
        <p className="text-slate-500 font-medium">Tell us a bit about yourself to personalize your learning journey.</p>
      </div>

      {/* FORM ĐIỀN THÔNG TIN */}
      <form className="space-y-6">
        
        {/* Hàng 1: Tên và Số điện thoại */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">Full Name</label>
            <input 
              type="text" 
              defaultValue="Alex Johnson"
              className="w-full bg-[#f1f5f9] border-none rounded-xl px-4 py-3.5 text-sm font-medium text-[#1e293b] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">Phone Number</label>
            <input 
              type="text" 
              defaultValue="+1 (555) 000-0000"
              className="w-full bg-[#f1f5f9] border-none rounded-xl px-4 py-3.5 text-sm font-medium text-[#1e293b] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Hàng 2: Email */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">Email</label>
          <input 
            type="email" 
            defaultValue="alex.johnson@lumina.edu"
            className="w-full md:w-1/2 bg-[#f1f5f9] border-none rounded-xl px-4 py-3.5 text-sm font-medium text-slate-500 outline-none"
            readOnly
          />
        </div>

        {/* Hàng 3: Địa chỉ */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">Address</label>
          <input 
            type="text" 
            defaultValue="123 Education Way, Learning City, State 12345"
            className="w-full bg-[#f1f5f9] border-none rounded-xl px-4 py-3.5 text-sm font-medium text-[#1e293b] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Hàng 4: Giới thiệu bản thân */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">About Yourself</label>
          <textarea 
            placeholder="Briefly describe your goals and background..."
            rows={4}
            className="w-full bg-[#f1f5f9] border-none rounded-xl px-4 py-3.5 text-sm font-medium text-[#1e293b] focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
          ></textarea>
        </div>

        {/* Hàng 5: Sở thích học tập (Tags) */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">Learning Interests</label>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                    isSelected 
                      ? 'bg-[#0f62fe] text-white shadow-sm' 
                      : 'bg-[#e2e8f0] text-slate-500 hover:bg-slate-300'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
            <button type="button" className="px-4 py-2 rounded-full text-xs font-bold border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add More
            </button>
          </div>
        </div>

        {/* Nút Submit */}
        <div className="pt-6">
          <button type="button" className="bg-[#0f62fe] hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            Save and Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};
