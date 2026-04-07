"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    UserCheck,
    HeadphonesIcon,
    BarChart3,
    Settings,
    Search,
    Bell,
    Menu,
    X,
    LogOut,
} from "lucide-react";

const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/users", label: "Người dùng", icon: Users },
    { path: "/courses", label: "Khóa học", icon: BookOpen },
    { path: "/classes", label: "Lớp học", icon: GraduationCap },
    { path: "/instructors", label: "Giảng viên", icon: UserCheck },
    { path: "/support", label: "Hỗ trợ", icon: HeadphonesIcon },
    { path: "/reports", label: "Báo cáo", icon: BarChart3 },
    { path: "/settings", label: "Cài đặt", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? "w-64" : "w-20"
                    } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                    {sidebarOpen && (
                        <h1 className="font-bold text-xl text-blue-600">LMS Admin</h1>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.path ||
                            (item.path !== "/" && pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                href={item.path} // ✅ sửa lại
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <Icon size={20} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                            A
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1">
                                <p className="text-sm font-semibold">Admin User</p>
                                <p className="text-xs text-gray-500">admin@lms.com</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="flex-1 max-w-xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>

                    <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                        <Bell size={20} />
                    </button>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    {children} {/* ✅ thay Outlet */}
                </main>
            </div>
        </div>
    );
}