"use client";

import React, { useState } from "react";
import { LoginInput } from "@/components/ui/LoginInput";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen bg-brand-soft font-sans flex flex-col">

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-105">
          {/* Title Section */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-brand-primary tracking-tight mb-3">Đăng nhập</h1>
            <p className="text-[#a3aed0] font-bold text-sm ml-1">Nhập tài khoản và mật khẩu của bạn!</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleLogin} className="space-y-6">
            <LoginInput
              label="Tài khoản"
              placeholder="mail@simmmple.com"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <LoginInput
              label="Mật khẩu"
              placeholder="Min. 8 characters"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-[#e0e5f2] accent-[#4318ff]" />
                <label htmlFor="remember" className="text-xs font-bold text-brand-primary cursor-pointer">Ghi nhớ tôi</label>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 font-bold px-1">{(error as { message: string }).message || 'Đăng nhập thất bại'}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-[#4318ff] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-[#4318ff]/20 hover:bg-[#3311cc] disabled:bg-[#a3aed0] transition-all active:scale-[0.98]"
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-bold text-[#a3aed0]">
            Chưa có tài khoản? <a href="#" className="text-[#4318ff] hover:underline">Liên hệ quản trị viên</a>
          </p>
        </div>
      </main>

      <footer className="p-10 text-[10px] font-black text-[#a3aed0] tracking-[0.3em] uppercase">
        © 2026 ACADEMIC KINSHIP
      </footer>
    </div>
  );
}
