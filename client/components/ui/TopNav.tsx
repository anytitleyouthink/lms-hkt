import { Search, Bell, HelpCircle } from "lucide-react";

export const TopNav = () => (
    <header className="flex items-center justify-between px-10 py-6">
        <div>
            <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Academic Kinship</p>
            <h2 className="text-2xl font-black text-[#1b2559]">Employee Management</h2>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-[24px] shadow-sm border border-slate-50">
            <div className="flex items-center gap-3 px-4 py-2 bg-[#f4f7fe] rounded-[18px] w-72">
                <Search size={18} className="text-slate-400" />
                <input type="text" placeholder="Search employees..." className="bg-transparent outline-none text-xs font-bold w-full text-[#1b2559]" />
            </div>
            <div className="flex items-center gap-2 pr-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 relative transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <HelpCircle size={20} />
                </button>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ml-2 cursor-pointer hover:scale-105 transition-transform">
                    <img src="https://i.pravatar.cc/150?u=tri" alt="User avatar" />
                </div>
            </div>
        </div>
    </header>
);