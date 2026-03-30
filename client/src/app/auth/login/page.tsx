import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden">
      
      {/* 1. Header/Navbar thu nhỏ cho trang Login */}
      <header className="w-full p-4 flex justify-center z-10">
      </header>

      {/* 2. Form Đăng nhập chính */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-[550px] bg-[#f0f4f8] rounded-[45px] p-12 shadow-[0_15px_40px_rgba(0,0,0,0.05)] border border-white/60">
          
          {/* Tiêu đề Form */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-black text-black mb-2">Đăng nhập</h1>
            <p className="text-gray-500 font-semibold text-sm">Nhập tài khoản mà bạn được cấp</p>
          </div>

          {/* Khu vực nhập liệu */}
          <div className="space-y-10">
            {/* Trường Tài khoản */}
            <div className="flex items-center gap-6">
              <label className="w-24 text-[16px] font-black text-black text-right whitespace-nowrap">
                Tài khoản:
              </label>
              <div className="flex-1">
                <input 
                  type="text" 
                  className="w-full h-14 px-8 rounded-full bg-gradient-to-b from-[#fdfdfe] to-[#e6e9ee] border border-gray-200 text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-[#00b4db]/30 transition-all placeholder-gray-300"
                  placeholder="..."
                />
              </div>
            </div>

            {/* Trường Mật khẩu */}
            <div className="flex items-center gap-6">
              <label className="w-24 text-[16px] font-black text-black text-right whitespace-nowrap">
                Mật khẩu:
              </label>
              <div className="flex-1">
                <input 
                  type="password" 
                  className="w-full h-14 px-8 rounded-full bg-gradient-to-b from-[#fdfdfe] to-[#e6e9ee] border border-gray-200 text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-[#00b4db]/30 transition-all placeholder-gray-300"
                  placeholder="..."
                />
              </div>
            </div>

            {/* Nút Đăng nhập */}
            <div className="flex justify-center pt-4">
              <button className="px-12 py-3 rounded-full bg-gradient-to-r from-[#66ced6] to-[#46b8d2] text-white font-black text-sm shadow-[0_4px_15px_rgba(70,184,210,0.4)] hover:shadow-[0_6px_20px_rgba(70,184,210,0.6)] hover:scale-105 transition-all active:scale-95">
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer LMS PRIVATE */}
      <footer className="p-10 z-10">
        <span className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase opacity-70">
          LMS PRIVATE
        </span>
      </footer>

      {/* Background Decor (Lớp trang trí mờ phía sau nếu cần) */}
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-cyan-50 rounded-full blur-[100px] -z-0"></div>
    </div>
  );
}