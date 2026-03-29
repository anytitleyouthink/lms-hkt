"use client";

import React from 'react';
import { 
  BookOpen, Trophy, User, Calendar, Star, 
  ArrowRight, Clock, Award, Zap, TrendingUp, Plus 
} from 'lucide-react';
import CourseProgressCard from '../../components/ui/CourseProgressCard'
import ProfileCard from '../../components/ui/ProfileCard'
import RecommendedCard from '../../components/ui/RecommendedCard'
import StatCard from '../../components/ui/StatCard'


// ==========================================
// TRANG CHỦ (MAIN PAGE)
// ==========================================

export default function HomePage() {
  return (
    <div className="relative pb-20 w-full max-w-6xl mx-auto font-sans">
      
      {/* Tiêu đề */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-[#2b3674] tracking-tight">Welcome back, Tiến</h1>
      </div>

      {/* Dòng 1: Tiến độ và Hồ sơ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <CourseProgressCard 
            status="IN PROGRESS" 
            title="Advanced Systems Architecture" 
            progress={35} 
          />
          <CourseProgressCard 
            status="RECENT" 
            title="Emotional Intelligence in Leadership" 
            progress={88} 
          />
        </div>
        <div className="lg:col-span-1">
          <ProfileCard />
        </div>
      </div>

      {/* Dòng 2: Khóa học gợi ý */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl font-black text-[#2b3674]">Recommended for You</h2>
            <p className="text-sm font-medium text-slate-400 mt-1">Expand your horizon with these curated tracks.</p>
          </div>
          <button className="hidden sm:flex text-[#1b64a3] font-bold text-sm hover:underline items-center gap-1">
            View All Courses <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RecommendedCard 
            title="Zero Trust Networking for Modern Enterprises"
            category="Cyber Defense"
            rating={4.9}
            students="2.4k"
            bgColorClass="bg-[#0f172a]" 
          />
          <RecommendedCard 
            title="Strategic Conflict Resolution & Negotiation"
            category="Human Resources"
            rating={4.7}
            students="1.1k"
            bgColorClass="bg-[#1e293b]" 
          />
          <RecommendedCard 
            title="Edge Computing & Embedded Systems Mastery"
            category="Engineering"
            rating={5.0}
            students="890"
            bgColorClass="bg-[#c2410c]" 
          />
        </div>
      </div>

      {/* Dòng 3: Thống kê */}
      <div className="flex flex-wrap gap-4">
        <StatCard icon={<Clock className="w-5 h-5" />} value="42.5h" label="Time Invested" iconColor="text-blue-500" />
        <StatCard icon={<Award className="w-5 h-5" />} value="12" label="Certificates" iconColor="text-green-500" />
        <StatCard icon={<Zap className="w-5 h-5" />} value="850" label="Pet Kinship XP" iconColor="text-orange-500" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} value="Top 5%" label="Global Rank" iconColor="text-purple-500" />
      </div>

      {/* Nút cộng nổi */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#1b64a3] text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center z-50">
        <Plus className="w-6 h-6" />
      </button>
      
    </div>
  );
}