import React from 'react';

interface StatCardProps {
  icon?: React.ReactNode;
  value?: string | number;
  label: string;
  iconColor?: string;
  subtext?: string;
  description?: string;
  btnText?: string;
}

export default function StatCard({ icon, value, label, iconColor = '', subtext, description, btnText }: StatCardProps) {
  return (
    <div className="bg-[#f4f7fe] p-5 rounded-2xl flex flex-col gap-3 flex-1 min-w-[200px] hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full bg-white shadow-sm flex items-center justify-center ${iconColor}`}>
          {icon || <span className="text-slate-400">•</span>}
        </div>
        <div>
          <div className="text-xl font-black text-[#2b3674]">{value ?? '-'}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
        </div>
      </div>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
      {description && <p className="text-xs text-gray-500">{description}</p>}
      {btnText && <button className="mt-2 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition">{btnText}</button>}
    </div>
  );
}