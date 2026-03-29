import React from 'react';

interface StatCardProps {
  icon: React.ReactNode; // Sửa thành React.ReactNode để nhận Component đã render
  value: string | number;
  label: string;
  iconColor: string;
}

export default function StatCard({ icon, value, label, iconColor }: StatCardProps) {
  return (
    <div className="bg-[#f4f7fe] p-5 rounded-2xl flex items-center gap-4 flex-1 min-w-[200px] hover:shadow-sm transition-shadow">
      <div className={`p-3 rounded-full bg-white shadow-sm flex items-center justify-center ${iconColor}`}>
        {/* Render trực tiếp biến icon */}
        {icon}
      </div>
      <div>
        <div className="text-xl font-black text-[#2b3674]">{value}</div>
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
      </div>
    </div>
  );
}