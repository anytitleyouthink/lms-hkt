
import React from 'react';
import { BookOpen, Star } from 'lucide-react';

interface RecommendedCardProps {
  title: string;
  category: string;
  rating: number;
  students: string;
  bgColorClass: string;
}

export default function RecommendedCard({ title, category, rating, students, bgColorClass }: RecommendedCardProps) {
  return (
    <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className={`h-40 ${bgColorClass} relative flex items-center justify-center`}>
        <div className="w-16 h-16 bg-white/10 rounded-full backdrop-blur-md flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-white/50" />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span> {category}
        </span>
        <h4 className="font-bold text-[#2b3674] leading-snug mb-4 flex-1">{title}</h4>
        <div className="flex items-center gap-2 text-[10px] font-bold">
          <span className="text-yellow-500 flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> {rating.toFixed(1)}
          </span>
          <span className="text-slate-400">{students} Students</span>
        </div>
      </div>
    </div>
  );
}