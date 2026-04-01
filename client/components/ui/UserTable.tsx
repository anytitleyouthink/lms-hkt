// components/ui/user_management/UserTable.tsx
import React from 'react';

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
    btnFilterText: string;
    btnExportText: string;
}

export default function UserTable({ title, columns, users, btnFilterText, btnExportText }: UserTableProps) {
    return (
        <div className="rounded-xl bg-white shadow-sm p-4">
            {/* Header section */}
            <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-700">{title}</h2>
                <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        {btnFilterText}
                    </button>
                    <button className="px-3 py-1 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        {btnExportText}
                    </button>
                </div>
            </div>

            {/* Table section */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {columns.map((col, index) => (
                                <th key={index} className="py-4 px-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
                                    {col}
                                </th>
                            ))}
                            {/* Thêm cột trống cho nút action "..." */}
                            <th className="py-4 px-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={`${user.email}-${index}`} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                <td className="py-4 px-2">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-bold text-[#2b3674]">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.date}</p>
                                    </div>
                                </td>
                                <td className="py-4 px-2 text-sm text-gray-600 font-medium">{user.role}</td>
                                <td className="py-4 px-2 text-sm text-gray-600">{user.email}</td>
                                <td className="py-4 px-2 text-right">
                                    <button className="text-gray-400 hover:text-blue-600 px-2 text-xl font-bold">
                                        ...
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div> // <-- Thẻ này bị thiếu trong code ban đầu của bạn
    );
}