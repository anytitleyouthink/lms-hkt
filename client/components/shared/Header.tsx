
import Link from 'next/link';
import React from 'react';
import { Search, Bell, PawPrint} from 'lucide-react';

const Header = () => {
  return (
    <header className="flex justify-between items-center py-4 px-8 bg-transparent w-full sticky top-0 z-10 backdrop-blur-sm">
      <div>
        <h2 className="text-[#2b3674] font-black text-xl tracking-tight">Academic Kinship</h2>
      </div>

      <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm border border-white/50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm kiến thức..." 
            className="bg-[#f4f7fe] border-none rounded-full py-2 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all w-40 md:w-64 outline-none text-[#2b3674] font-medium"
          />
        </div>

        <div className="flex items-center gap-1 border-l border-slate-100 pl-2">
          <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hidden sm:block transition-colors">
            <PawPrint className="w-5 h-5" />
          </button>
        </div>

        <Link href="/profile" className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200 shadow-sm cursor-pointer hover:scale-105 transition-transform">
          
        </Link>
      </div>
    </header>
  );
};

export default Header;