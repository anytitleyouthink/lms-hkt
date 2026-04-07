import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  subtext?: string;
  color?: string;
}

export default function StatCard({ icon, value, label, subtext, color = "bg-blue-50" }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-5 flex-1 min-w-[200px]">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0 text-blue-600`}>
        {React.cloneElement(icon as React.ReactElement, { size: 24 } as any)}
      </div>
      <div>
        <h3 className="text-2xl font-black text-[#1b2559]">{value}</h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        {subtext && <p className="text-[10px] text-slate-400 mt-1">{subtext}</p>}
      </div>
    </div>
  );
}