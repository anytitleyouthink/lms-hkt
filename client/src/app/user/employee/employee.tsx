"use client";

import React from 'react';
import { Plus, Users, Briefcase, GraduationCap } from "lucide-react";
// Giữ nguyên cấu trúc import từ file mẫu của bạn
import StatCard from '../../../../components/ui/StatCard';
import UserTable, { User } from '../../../../components/ui/UserTable';

// 1. Dữ liệu nội dung (Data) - Chuyển sang chủ đề Nhân sự
const TEXT_CONTENT = {
    header: {
        title: "Danh Mục Nhân Viên",
        description: "Quản lý hồ sơ công việc, kỹ năng và lộ trình phát triển của đội ngũ.",
        btnCreate: "Thêm nhân viên"
    },
    table: {
        title: "Danh Sách Nhân Sự",
        columns: ["Họ tên & Vị trí", "Phòng ban", "Email công việc", "Thao tác"],
        btnFilter: "Lọc phòng ban",
        btnExport: "Xuất báo cáo"
    }
};

// 2. Định nghĩa kiểu dữ liệu (Type)
type StatItem = {
    id: string;
    label: string;
    value?: string;
    subtext?: string;
    description?: string;
    btnText?: string;
    type: "numeric" | "action";
};

// 3. Dữ liệu thống kê (Stats)
const STATS_DATA: StatItem[] = [
    {
        id: "active-employees",
        label: "NHÂN VIÊN ĐANG HOẠT ĐỘNG",
        value: "452",
        subtext: "▲ +5 nhân sự mới",
        type: "numeric"
    },
    {
        id: "dept-count",
        label: "PHÒNG BAN",
        value: "12",
        subtext: "Đang mở rộng quy mô",
        type: "numeric"
    },
    {
        id: "onboarding-action",
        label: "QUY TRÌNH ONBOARDING",
        description: "Tạo nhanh lộ trình đào tạo cho nhân viên mới tuyển dụng",
        btnText: "Bắt đầu ngay",
        type: "action"
    }
];

// 4. Danh sách nhân viên mẫu (Employee List)
// Tái sử dụng interface User để tương thích với component UserTable của bạn
const EMPLOYEE_LIST: User[] = [
    { name: "Lê Minh Tâm", date: "Trưởng phòng thiết kế", role: "Thiết kế", email: "tam.le@company.com" },
    { name: "Nguyễn Bích Phương", date: "Kỹ sư phần mềm", role: "Công nghệ", email: "phuong.nb@company.com" },
    { name: "Trần Thế Vinh", date: "Chuyên viên Marketing", role: "Truyền thông", email: "vinh.tt@company.com" },
    { name: "Phạm Hải Yến", date: "Phân tích dữ liệu", role: "Kỹ thuật", email: "yen.ph@company.com" },
];

export default function EmployeePage() {
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

            {/* 2. Các thẻ thống kê (StatCards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {STATS_DATA.map((stat) => (
                    <StatCard
                        key={stat.id}
                        type={stat.type}
                        label={stat.label}
                        value={stat.value}
                        subtext={stat.subtext}
                        description={stat.description}
                        btnText={stat.btnText}
                    />
                ))}
            </div>

            {/* 3. Bảng danh sách nhân viên (UserTable) */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100">
                <UserTable
                    title={TEXT_CONTENT.table.title}
                    columns={TEXT_CONTENT.table.columns}
                    users={EMPLOYEE_LIST}
                    btnFilterText={TEXT_CONTENT.table.btnFilter}
                    btnExportText={TEXT_CONTENT.table.btnExport}
                />
            </div>
        </div>
    );
}