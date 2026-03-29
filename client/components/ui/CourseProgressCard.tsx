
import React from 'react';
import { BookOpen, Trophy } from 'lucide-react';

interface CourseProgressCardProps {
  status: string;
  title: string;
  progress: number;
}

export default function CourseProgressCard({ status, title, progress }: CourseProgressCardProps) {
  const isProgress = status === 'IN PROGRESS';
  
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-[280px] hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-widest ${
          isProgress ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
        }`}>
          {status}
        </span>
        {isProgress ? <BookOpen className="text-blue-400 w-5 h-5" /> : <Trophy className="text-green-500 w-5 h-5" />}
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-black text-[#2b3674] leading-tight mb-4 line-clamp-2">{title}</h3>
        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2">
          <span className="uppercase">Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${isProgress ? 'bg-[#1b64a3]' : 'bg-green-600'}`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <button className={`w-full py-3 mt-6 rounded-xl font-bold text-sm transition-all ${
        isProgress ? 'bg-[#f4f7fe] text-[#1b64a3] hover:bg-blue-50' : 'bg-green-700 text-white hover:bg-green-800'
      }`}>
        {isProgress ? 'Resume Learning' : 'Finish Course'}
      </button>
    </div>
  );
}