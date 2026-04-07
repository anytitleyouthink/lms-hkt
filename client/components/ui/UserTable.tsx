// components/ui/user_management/UserTable.tsx
import React from 'react';
import { MoreHorizontal, Filter, Download, Calendar, User as UserIcon, Check } from "lucide-react";

export interface User {
    name: string;
    date: string;
    role: string;
    email: string;
}

interface UserTableProps {
    title: string;
    columns: string[];
    users: User[];
}

export default function UserTable({ title, columns, users }: UserTableProps) {
    return (
        <div className="rounded-[32px] bg-white shadow-sm p-6 border border-slate-50">
            {/* Header section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-[#2b3674] tracking-tight">{title}</h2>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f4f7fe] text-sm font-bold text-[#2b3674] hover:bg-slate-100 transition-colors">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f4f7fe] text-sm font-bold text-[#2b3674] hover:bg-slate-100 transition-colors">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Table section */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {columns.map((col, index) => (
                                <th key={index} className="pb-4 px-2 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                                    {col}
                                </th>
                            ))}
                            <th className="pb-4 px-2"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user, index) => (
                            <tr key={`${user.email}-${index}`} className="group hover:bg-slate-50/50 transition-colors">
                                {/* Cột 1: Họ tên & Icon */}
                                <td className="py-5 px-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                            <UserIcon size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#2b3674]">{user.name}</p>
                                            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                                                <Calendar size={12} /> Joined {user.date}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Cột 2: Vai trò */}
                                <td className="py-5 px-2">
                                    <p className="text-sm font-bold text-[#2b3674]">{user.role}</p>
                                </td>

                                {/* Cột 3: Email */}
                                <td className="py-5 px-2">
                                    <p className="text-sm font-medium text-slate-500">{user.email}</p>
                                </td>

                                {/* Cột 4: Thao tác (Icon tích xanh và menu) */}
                                <td className="py-5 px-2 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <button className="p-1 rounded-lg text-slate-300 hover:text-[#2b3674] hover:bg-white transition-all">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}