"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { 
  LayoutDashboard, 
  BookOpen, 
  PawPrint, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  // Lấy đường dẫn thực tế từ trình duyệt
  const pathname = usePathname();

  //Cac lua chon dieu huong sang cac page khac
  const menuItems = [
    { icon: LayoutDashboard, label: 'Bảng điều khiển', href: '/' },
    { icon: BookOpen, label: 'Khóa học của tôi', href: '/courses' },
    { icon: PawPrint, label: 'Khu bảo tồn Pet', href: '/pets' },
    { icon: Users, label: 'Quản lý người dùng', href: '/user' },
    { icon: Settings, label: 'Cài đặt', href: '/settings' },
  ];

  return (
    <aside className="w-64 bg-[#f4f7fe] border-r border-slate-100 flex flex-col p-6 h-screen sticky top-0 z-20 shrink-0">
      
      <Link href="/" className="mb-10 px-2 block hover:opacity-80 transition-opacity cursor-pointer">
        <h1 className="font-black text-[#2b3674] text-xl tracking-tight uppercase">VICTORY TTT</h1>
        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
          Phát triển & Kết nối
        </p>
      </Link>

      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item, idx) => {
          const Icon = item.icon; 
          
          // So sánh đường dẫn hiện tại với href của menu để bật sáng
          const isActive = pathname === item.href;

          return (
            <Link
              key={idx} 
              href={item.href}
              
              className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all group ${
                isActive 
                  ? 'bg-white text-[#2b3674] shadow-sm' 
                  : 'text-slate-400 hover:bg-white/50 hover:text-[#2b3674]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`} />
                {item.label}
              </div>
              
              {/* Vạch màu xanh góc phải xuất hiện khi active */}
              {isActive && <div className="w-1 h-5 bg-blue-600 rounded-full" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="flex flex-col gap-1">
          <button className="flex items-center gap-3 px-4 py-2 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors w-full text-left">
            <HelpCircle className="w-5 h-5" /> Hỗ trợ
          </button>
          <button className="flex items-center gap-3 px-4 py-2 text-slate-400 font-bold text-sm hover:text-red-500 transition-colors w-full text-left">
            <LogOut className="w-5 h-5" /> Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
