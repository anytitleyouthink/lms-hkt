import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link"
import { cn } from "@/lib/utils"; // Hàm tiện ích của Shadcn để gộp class
import { Button } from "@/components/ui/button";

const NavbarMain = () => 
  {
  return (
    // 1. Container bọc ngoài để căn giữa toàn bộ thanh bar trên màn hình
    <div className="w-full px-4 py-8 flex justify-center sticky top-0 z-50">
      
      {/* 2. Thanh chính: Dùng Flexbox để đẩy Logo và Menu ra 2 đầu */}
      <nav className={cn(
        "relative flex w-full max-w-7xl items-center justify-between",
        "rounded-full px-8 py-3 shadow-2xl transition-all",
        "bg-gradient-to-r from-[#00c6ff] via-[#00cc99] to-[#7bed9f]" // Màu sắc từ ảnh
      )}>
        
        {/* 3. Khối Logo bên trái */}
        <Link href="/" className="flex flex-col font-black text-white drop-shadow-lg group">
          <span className="text-2xl leading-none tracking-tighter transition-transform group-hover:-translate-x-1">
            VTR
          </span>
          <span className="ml-5 text-2xl leading-none tracking-tighter opacity-90 transition-transform group-hover:translate-x-1">
            STUDY
          </span>
        </Link>

        {/* 4. Khối Menu bên phải: Thiết kế "Pill inside Pill" */}
        <div className={cn(
          "flex items-center gap-6 rounded-full px-6 py-2",
          "bg-black/10 backdrop-blur-md border border-white/10", // Hiệu ứng kính mờ
          "shadow-[inner_0px_2px_4px_rgba(0,0,0,0.1)]"
        )}>
          
          {/* Các mục menu tiêu chuẩn */}
          <a 
            href="/thong-tin" 
            className="text-[15px] font-bold text-slate-900 hover:text-black transition-colors"
          >
            Thông tin
          </a>
          
          <a 
            href="/huong-dan" 
            className="text-[15px] font-bold text-slate-900 hover:text-black transition-colors"
          >
            Hướng dẫn sử dụng
          </a>
          
          {/* Vạch kẻ dọc (Divider) */}
          <span className="h-4 w-[1px] bg-slate-900/20" aria-hidden="true" />
          
          {/* Nút Đăng nhập: Kết hợp Link và Icon Lucide */}
          <Link 
            href="/auth/login" 
            className="group flex items-center gap-1 text-[15px] font-bold text-slate-900 hover:text-black transition-all"
          >
            Đăng nhập
            <ArrowRight 
              className="h-4 w-4 transition-transform group-hover:translate-x-1.5" 
              strokeWidth={3} 
            />
          </Link>
          
        </div>
      </nav>
    </div>
  );
};

export default NavbarMain;