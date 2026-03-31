"use client";

import React from 'react';
import { Plus } from "lucide-react";
// Sửa lại đường dẫn import: Thêm /ui/ và dùng tên thư mục user_management giống trong máy của bạn
import StatCard from '../../../../components/ui/StatCard';
import UserTable, { User } from '../../../../components/ui/UserTable';

// Dữ liệu nội dung (Data)
const TEXT_CONTENT = {
    header: {
        title: "Quản Lý Người Dùng",
        description: "Điều phối sự phát triển và mạng lưới cố vấn của học viện.",
        btnCreate: "Thêm thành viên"
    },
    table: {
        title: "Danh Bạ Học Viện",
        columns: ["Họ tên & Định danh", "Vai trò", "Địa chỉ Email", "Thao tác"],
        btnFilter: "Bộ lọc",
        btnExport: "Xuất dữ liệu"
    }
};

// Định nghĩa kiểu dữ liệu (Type) rõ ràng để khắc phục lỗi "Unexpected any"
type StatItem = {
    id: string;
    label: string;
    value?: string;
    subtext?: string;
    description?: string;
    btnText?: string;
    type: "numeric" | "action";
};



// Thay thế any[] bằng StatItem[]
const STATS_DATA: StatItem[] = [
    { id: "total-users", label: "TỔNG NGƯỜI DÙNG", value: "1,284", subtext: "▲ +12% tháng này", type: "numeric" },
    { id: "total-courses", label: "TỔNG KHÓA HỌC", value: "42", subtext: "8 Khóa mới ra mắt", type: "numeric" },
    { id: "bulk-action", label: "THÊM NHANH DANH SÁCH", description: "Tải lên file CSV hoặc Excel để tạo nhiều tài khoản", btnText: "Tải tệp lên", type: "action" }
];

const USER_LIST: User[] = [
    { name: "Sarah Chen", date: "Tháng 1, 2024", role: "Giảng viên", email: "sarah.c@academy.edu" },
    { name: "Marcus Aurelius", date: "Tháng 2, 2024", role: "Nhân viên", email: "marcus.a@kinship.io" },
    { name: "Elena Rodriguez", date: "Tháng 12, 2023", role: "Quản trị viên", email: "elena.r@academy.edu" },
];

export default function UserManagementPage() {
    return (
        <div className="p-8 bg-[#f8faff] min-h-screen font-sans text-[#2b3674]">
            {/* 1. Header Trang */}
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">{TEXT_CONTENT.header.title}</h1>
                    <p className="text-slate-500 font-medium mt-1">{TEXT_CONTENT.header.description}</p>
                </div>
                <button className="flex items-center justify-center bg-[#1b64a3] text-white hover:bg-[#154d7e] rounded-2xl px-6 h-12 font-bold shadow-lg shadow-blue-100 transition-all">
                    <Plus className="mr-2 h-5 w-5" /> {TEXT_CONTENT.header.btnCreate}
                </button>
            </div>

            {/* 2. Gọi Component StatCard bằng vòng lặp */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {STATS_DATA.map((stat) => (
                    <StatCard 
                        key={stat.id}
                        type={stat.type as "numeric" | "action"}
                        label={stat.label}
                        value={stat.value}
                        subtext={stat.subtext}
                        description={stat.description}
                        btnText={stat.btnText}
                    />
                ))}
            </div>

            {/* 3. Gọi Component UserTable và truyền Props */}
            <UserTable 
                title={TEXT_CONTENT.table.title}
                columns={TEXT_CONTENT.table.columns}
                users={USER_LIST}
                btnFilterText={TEXT_CONTENT.table.btnFilter}
                btnExportText={TEXT_CONTENT.table.btnExport}
            />
        </div>
    );
}