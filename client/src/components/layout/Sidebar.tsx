"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, UserCircle, LogOut, Users, Award, MessageSquare } from 'lucide-react';

import { authService } from '@/services/auth';
import { useQuery } from '@tanstack/react-query';

const Sidebar = () => {
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { data: userData } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getMe,
    enabled: mounted && !!(
      typeof window !== 'undefined' && 
      localStorage.getItem('access_token') && 
      localStorage.getItem('access_token') !== 'undefined' && 
      localStorage.getItem('access_token') !== 'null'
    ),
  });

  const userRole = userData?.role || userData?.result?.role;

  const menuItems = userRole === 'admin' ? [
    { icon: LayoutDashboard, label: 'Dashboard Admin', href: '/dashboard/admin' },
    { icon: Users, label: 'Quản lý người dùng', href: '/dashboard/admin/users' },
    { icon: BookOpen, label: 'Quản lý khóa học', href: '/dashboard/admin/courses' },
  ] : userRole === 'trainer' ? [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/trainer' },
    { icon: BookOpen, label: 'Quản lý khóa học', href: '/dashboard/trainer/courses/manage' },
    { icon: Users, label: 'Quản lý học viên', href: '/dashboard/trainer/enrollments' },
    { icon: MessageSquare, label: 'Thảo luận & Chat', href: '/dashboard/trainer/chat' },
    { icon: UserCircle, label: 'Profile (Trainer)', href: '/dashboard/trainer/profile' },
  ] : [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/employee' },
    { icon: BookOpen, label: 'Khóa học của tôi', href: '/dashboard/employee/courses' },
    { icon: Award, label: 'Chứng chỉ của tôi', href: '/dashboard/employee/certificates' },
    { icon: UserCircle, label: 'Profile', href: '/dashboard/employee/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  if (!mounted) return null;

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col p-6 h-screen sticky top-0 z-20 shrink-0">
      <Link href={pathname.includes('/dashboard/admin') ? '/dashboard/admin' : pathname.includes('/dashboard/trainer') ? '/dashboard/trainer' : '/dashboard/employee'} className="mb-10 px-2 block hover:opacity-80 transition-opacity">
        <h1 className="font-black text-blue-600 text-xl tracking-tight uppercase">VICTORY TTT</h1>
        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
          Learning System
        </p>
      </Link>

      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item, idx) => {
          const Icon = item.icon; 
          // Match route or its sub-routes
          const isActive = pathname === item.href || (item.href !== '/dashboard/employee' && pathname.startsWith(`${item.href}/`));
          
          return (
            <Link
              key={idx} 
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all group ${
                isActive 
                  ? 'bg-white text-blue-600 shadow-sm border border-blue-100' 
                  : 'text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`} />
                {item.label}
              </div>
              {isActive && <div className="w-1 h-5 bg-blue-600 rounded-full" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-500 font-bold text-sm hover:text-red-500 hover:bg-red-50 rounded-2xl transition-colors w-full text-left">
          <LogOut className="w-5 h-5" /> Đăng xuất
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
