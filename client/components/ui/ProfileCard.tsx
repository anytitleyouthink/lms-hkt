
import React from 'react';
import { BookOpen, Calendar, User } from 'lucide-react';
import Link from 'next/link';
export default function ProfileCard() {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center h-full hover:shadow-md transition-shadow">
      <div className="w-24 h-24 rounded-full bg-orange-100 border-4 border-white shadow-md overflow-hidden mb-4">

      </div>

      <h3 className="text-xl font-black text-[#2b3674]">Elena Rivers</h3>
      <p className="text-xs font-bold text-blue-500 mb-4">Senior Research Analyst</p>

      <p className="text-xs text-slate-400 italic text-center mb-6 px-4">
        Passionate about AI ethics and cognitive growth. Currently mentoring 15 scholars.
      </p>

      <div className="w-full space-y-4 mb-6 mt-auto">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] uppercase tracking-wider font-bold">Courses Completed</span>
          </div>
          <span className="font-black text-[#2b3674]">12</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Calendar className="w-4 h-4 text-green-500" />
            <span className="text-[10px] uppercase tracking-wider font-bold">Years in Academy</span>
          </div>
          <span className="font-black text-green-600">3</span>
        </div>
      </div>
      <Link href="/profile" className="w-full mt-auto">
        <button className="w-full py-2.5 rounded-xl border-2 border-slate-100 text-[#2b3674] font-bold text-sm hover:bg-slate-50 flex justify-center items-center gap-2 transition-colors">
          <User className="w-4 h-4" /> View Full Profile
        </button>
      </Link>
    </div>
  );
}