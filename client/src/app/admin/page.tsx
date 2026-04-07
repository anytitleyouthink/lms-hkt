"use client";

import React from "react";
import { Users, BookOpen, UserCheck, TrendingUp, AlertCircle } from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const statsData = [
    {
        label: "Tổng học sinh",
        value: "12,458",
        change: "+12.5%",
        icon: Users,
        color: "bg-blue-500",
    },
    {
        label: "Tổng khóa học",
        value: "248",
        change: "+8.2%",
        icon: BookOpen,
        color: "bg-green-500",
    },
    {
        label: "Giảng viên",
        value: "156",
        change: "+3.1%",
        icon: UserCheck,
        color: "bg-purple-500",
    },
    {
        label: "Lớp học hoạt động",
        value: "42",
        change: "+5.3%",
        icon: TrendingUp,
        color: "bg-orange-500",
    },
];

const enrollmentData = [
    { month: "T1", students: 400 },
    { month: "T2", students: 300 },
    { month: "T3", students: 500 },
    { month: "T4", students: 450 },
    { month: "T5", students: 600 },
    { month: "T6", students: 700 },
];

const courseData = [
    { name: "Đang học", value: 8500, color: "#3b82f6", id: "studying" },
    { name: "Hoàn thành", value: 3200, color: "#10b981", id: "completed" },
    { name: "Tạm dừng", value: 758, color: "#f59e0b", id: "paused" },
];

const recentActivities = [
    {
        id: 1,
        user: "Nguyễn Văn A",
        action: "đã đăng ký khóa học",
        target: "React Advanced",
        time: "5 phút trước",
    },
    {
        id: 2,
        user: "Trần Thị B",
        action: "đã hoàn thành",
        target: "Python Basics",
        time: "15 phút trước",
    },
    {
        id: 3,
        user: "GV Lê Văn C",
        action: "đã tạo khóa học mới",
        target: "Node.js Fundamentals",
        time: "1 giờ trước",
    },
    {
        id: 4,
        user: "Phạm Thị D",
        action: "đã gửi yêu cầu hỗ trợ",
        target: "Vấn đề thanh toán",
        time: "2 giờ trước",
    },
    {
        id: 5,
        user: "Hoàng Văn E",
        action: "đã đánh giá",
        target: "JavaScript Pro (5★)",
        time: "3 giờ trước",
    },
];

const topCourses = [
    { name: "React Advanced", students: 1245, rating: 4.8 },
    { name: "Python for Data Science", students: 1180, rating: 4.9 },
    { name: "UI/UX Design", students: 956, rating: 4.7 },
    { name: "Node.js Backend", students: 842, rating: 4.6 },
    { name: "Mobile App Dev", students: 723, rating: 4.8 },
];

export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">
                    Tổng quan hệ thống LMS - Cập nhật lúc 14:30, 4/4/2026
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="bg-white rounded-lg border border-gray-200 p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="text-white" size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enrollment Trend */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Xu hướng đăng ký</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={enrollmentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="students"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                name="Học sinh"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Course Status */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Trạng thái học tập</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={courseData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                    `${name || ""} ${((percent || 0) * 100).toFixed(0)}%`
                                }
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {courseData.map((entry) => (
                                    <Cell key={entry.id} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Hoạt động gần đây</h2>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                    <AlertCircle size={16} className="text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">
                                        <span className="font-semibold">{activity.user}</span>{" "}
                                        <span className="text-gray-600">{activity.action}</span>{" "}
                                        <span className="font-semibold">{activity.target}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Courses */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Khóa học phổ biến nhất
                    </h2>
                    <div className="space-y-3">
                        {topCourses.map((course, index) => (
                            <div
                                key={course.name}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-lg text-gray-400">
                                        #{index + 1}
                                    </span>
                                    <div>
                                        <p className="font-semibold">{course.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {course.students} học sinh
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-yellow-600">★ {course.rating}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}