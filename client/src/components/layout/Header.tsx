"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Bell, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { notificationService } from '@/services/notifications';
import { enrollmentService } from '@/services/enrollment';
import { courseService } from '@/services/course';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { customFetch } from '@/lib/api';
import { Loader2, PlusCircle, Check, Info } from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Đóng dropdown khi click ra ngoài
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: userProfile } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getMe,
    enabled: mounted && !!(
      typeof window !== 'undefined' && 
      localStorage.getItem('access_token') && 
      localStorage.getItem('access_token') !== 'undefined' && 
      localStorage.getItem('access_token') !== 'null'
    ),
  });

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getMyNotifications,
    enabled: !!userProfile
  });
  
  const notifications = notifData?.result || [];
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;
  
  // Real-time Search Query
  const { data: searchData, isFetching: isSearching } = useQuery({
    queryKey: ['courseSearch', searchInput],
    queryFn: () => customFetch(`/courses?search=${searchInput}`, { method: 'GET' }),
    enabled: searchInput.length >= 2,
  });

  const searchResults = searchData?.result || [];

  const enrollMutation = useMutation({
    mutationFn: enrollmentService.requestEnrollment,
    onSuccess: () => {
      toast.success("Gửi yêu cầu đăng ký thành công! Vui lòng chờ quản trị viên duyệt.");
      queryClient.invalidateQueries({ queryKey: ['me'] }); // Refresh user info if needed
    },
    onError: (err: any) => {
      toast.error("Đăng ký thất bại: " + (err.message || "Lỗi không xác định"));
    }
  });

  // Socket.io connection cho User
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      const newSocket = io('http://localhost:4000', {
        auth: { token }
      });
      
      newSocket.on('connect', () => {
        console.log('Socket Connected for notifications');
      });

      newSocket.on('new_notification', (newNotif) => {
        // Tự động load lại danh sách query
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        
        // Bạn có thể dùng react-hot-toast ở đây nếu muốn Toast góc màn hình
      });

      setSocket(newSocket);
      return () => { newSocket.disconnect(); };
    }
  }, [queryClient]);

  const readMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });
  
  const handleReadClick = (n: any) => {
    if (!n.is_read) {
      readMutation.mutate(n._id);
    }
    // Đã gỡ bỏ tính năng tự động chuyển hướng theo yêu cầu
    setShowNotifications(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchInput)}`);
    }
  };

  const userName = userProfile?.name || userProfile?.result?.name || 'User';
  const userRole = userProfile?.role || userProfile?.result?.role;
  const name = mounted ? userName : 'User';

  const isTrainer = userRole === 'trainer' || pathname?.includes('/dashboard/trainer');
  const isAdmin = userRole === 'admin' || pathname?.includes('/dashboard/admin');
  const hideSearch = isTrainer || isAdmin;

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-white/80 w-full sticky top-0 z-10 backdrop-blur-md border-b border-slate-100">
      <div>
        <h2 className="text-slate-800 font-black text-xl tracking-tight">Xin chào, {name}! 👋</h2>
      </div>

      <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-full shadow-sm border border-slate-100 relative">
        {!hideSearch && (
          <div className="relative flex items-center" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
              <button type="submit" className="absolute left-4 text-slate-400 hover:text-blue-600">
                <Search className="w-4 h-4" />
              </button>
              <input 
                type="text" 
                placeholder="Tìm kiếm khóa học..." 
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="bg-transparent border-none rounded-full py-2 pl-11 pr-4 text-sm focus:ring-0 focus:outline-none w-40 md:w-64 text-slate-800 font-medium"
              />
              {isSearching && (
                <div className="absolute right-4 text-slate-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                </div>
              )}
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && searchInput.length >= 2 && (
              <div className="absolute top-12 left-0 w-[320px] md:w-[420px] bg-white border border-slate-100 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center px-4">
                  <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Kết quả tìm kiếm</h3>
                </div>
                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {isSearching ? (
                    <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" /></div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">Không tìm thấy khóa học nào phù hợp</div>
                  ) : (
                    searchResults.map((course: any) => (
                      <div key={course._id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                        <div className="flex gap-4">
                          <img 
                            src={course.thumbnail || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=100&auto=format"} 
                            className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm border border-slate-100"
                            alt={course.title}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-800 mb-1 line-clamp-1">{course.title}</h4>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">{course.description || "Không có mô tả chi tiết cho sản phẩm."}</p>
                            <div className="flex items-center justify-between gap-2">
                              {course.is_enrolled ? (
                                <span className="flex items-center text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-tight">
                                  <Check className="w-3 h-3 mr-1" /> Đã tham gia
                                </span>
                              ) : (
                                <button 
                                  onClick={() => enrollMutation.mutate(course._id)}
                                  disabled={enrollMutation.isPending}
                                  className="flex items-center gap-1.5 text-[10px] font-black text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-full uppercase tracking-tight transition-all active:scale-95 disabled:opacity-50"
                                >
                                  {enrollMutation.isPending && enrollMutation.variables === course._id 
                                    ? <Loader2 className="w-3 h-3 animate-spin"/> 
                                    : <PlusCircle className="w-3 h-3"/>
                                  }
                                  Gửi đăng ký
                                </button>
                              )}
                              <Link 
                                href={`/dashboard/employee/courses/${course._id}`} // Adjust path as needed
                                onClick={() => setShowSearchResults(false)}
                                className="text-[10px] font-bold text-slate-400 hover:text-blue-500 flex items-center transition-colors"
                              >
                                <Info className="w-3 h-3 mr-1" /> Chi tiết
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className={`flex items-center gap-1 relative ${!hideSearch ? 'border-l border-slate-200 pl-2' : ''}`} ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-white rounded-full text-slate-400 relative transition-colors shadow-sm"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && mounted && (
              <span className="absolute top-2 right-2 flex w-2.5 h-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-12 right-0 w-80 bg-white border border-slate-100 shadow-xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Thông báo</h3>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">{unreadCount} mới</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">Chưa có thông báo nào</div>
                ) : (
                  notifications.map((n: any) => (
                    <div 
                      key={n._id} 
                      onClick={() => handleReadClick(n)}
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50  transition-colors ${!n.is_read ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!n.is_read ? 'bg-blue-500' : 'bg-transparent'}`} />
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-1">{n.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-2 block">{new Date(n.created_at).toLocaleString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link href={`/dashboard/${userRole || 'employee'}/profile`} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-blue-100 flex items-center justify-center font-bold text-blue-600 shadow-sm cursor-pointer hover:scale-105 transition-transform">
          {name.charAt(0).toUpperCase()}
        </Link>
      </div>
    </header>
  );
};
export default Header;
