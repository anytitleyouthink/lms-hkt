import { User, BookOpen, PawPrint, Building2, Settings } from "lucide-react";

export const Sidebar = () => {
    const menuItems = [
        { icon: <User size={18} />, label: "Profile", active: true },
        { icon: <BookOpen size={18} />, label: "Learning Path" },
        { icon: <PawPrint size={18} />, label: "My Pet" },
        { icon: <Building2 size={18} />, label: "Department" },
        { icon: <Settings size={18} />, label: "Settings" },
    ];

    return (
        <aside className="w-64 bg-slate-50 h-screen p-6 border-r border-slate-200 hidden md:block">
            <div className="flex items-center gap-3 mb-10 p-2">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                    <User />
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Welcome back</p>
                    <p className="text-xs font-black text-slate-700">Complete your profile</p>
                </div>
            </div>

            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${item.active ? 'bg-blue-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
                        {item.icon} {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
};