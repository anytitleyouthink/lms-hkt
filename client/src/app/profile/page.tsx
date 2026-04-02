"use client";

import React, { useState } from 'react';
import { ArrowRight, Plus, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CompleteProfilePage() {
  const [selectedInterests, setSelectedInterests] = useState(['AI & Machine Learning']);
  const interests = ['AI & Machine Learning', 'UI/UX Design', 'Management', 'Data Visualization', 'Leadership', 'Cybersecurity'];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto font-sans pb-20">
      {/* Nút quay lại */}
      <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-[#2b3674] mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Tiêu đề trang */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#2b3674] tracking-tight mb-2">Complete Your Profile</h1>
        <p className="text-slate-400 font-medium">Tell us a bit about yourself to personalize your learning journey.</p>
      </div>

      <form className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#2b3674] uppercase tracking-[0.2em] ml-1">Full Name</label>
            <input
              type="text"
              defaultValue="Elena Rivers"
              className="w-full bg-[#f4f7fe] border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] focus:border-[#2b3674]/10 focus:bg-white outline-none transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#2b3674] uppercase tracking-[0.2em] ml-1">Phone Number</label>
            <input
              type="text"
              defaultValue="+1 (555) 000-0000"
              className="w-full bg-[#f4f7fe] border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] focus:border-[#2b3674]/10 focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-[#2b3674] uppercase tracking-[0.2em] ml-1">About Yourself</label>
          <textarea
            rows={4}
            placeholder="Briefly describe your goals..."
            className="w-full bg-[#f4f7fe] border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] focus:border-[#2b3674]/10 focus:bg-white outline-none transition-all resize-none"
          ></textarea>
        </div>

        {/* Interests Tags */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-[#2b3674] uppercase tracking-[0.2em] ml-1">Learning Interests</label>
          <div className="flex flex-wrap gap-3">
            {interests.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${isSelected
                    ? 'bg-[#2b3674] text-white shadow-md scale-105'
                    : 'bg-[#f4f7fe] text-slate-400 hover:bg-slate-200'
                    }`}
                >
                  {interest}
                </button>
              );
            })}
            <button type="button" className="px-5 py-2.5 rounded-xl text-[11px] font-black border-2 border-dashed border-slate-200 text-slate-400 hover:border-[#2b3674] hover:text-[#2b3674] transition-all flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add More
            </button>
          </div>
        </div>

        {/* Nút Submit - Dùng màu xanh nhấn của hệ thống */}
        <div className="pt-4">
          <button type="button" className="w-full md:w-auto bg-[#1b64a3] hover:bg-[#154d7e] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3">
            Save and Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}