import { useState } from "react";
import {
    TrendingUp,
    Users,
    BookOpen,
    GraduationCap,
    Download,
    Calendar,
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const revenueData = [
    { month: "T10/2025", classes: 35, courses: 180, students: 9800 },
    { month: "T11/2025", classes: 38, courses: 200, students: 10500 },
    { month: "T12/2025", classes: 40, courses: 220, students: 11200 },
    { month: "T1/2026", classes: 39, courses: 225, students: 11600 },
    { month: "T2/2026", classes: 41, courses: 235, students: 11900 },
    { month: "T3/2026", classes: 42, courses: 248, students: 12458 },
];

const categoryData = [
    { category: "Lập trình Web", students: 4200, classes: 18 },
    { category: "Data Science", students: 2800, classes: 12 },
    { category: "Thiết kế", students: 2100, classes: 8 },
    { category: "Mobile Dev", students: 1850, classes: 6 },
    { category: "DevOps", students: 1508, classes: 4 },
];

const enrollmentTrend = [
    { week: "T1", enrollments: 280 },
    { week: "T2", enrollments: 320 },
    { week: "T3", enrollments: 290 },
    { week: "T4", enrollments: 380 },
    { week: "T5", enrollments: 420 },
    { week: "T6", enrollments: 450 },
];

export function Reports() {
    const [dateRange, setDateRange] = useState("last-6-months");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Phân tích</h1>
                    <p className="text-gray-500 mt-1">
                        Thống kê chi tiết về hoạt động của hệ thống
                    </p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="last-week">7 ngày qua</option>
                        <option value="last-month">30 ngày qua</option>
                        <option value="last-3-months">3 tháng qua</option>
                        <option value="last-6-months">6 tháng qua</option>
                        <option value="last-year">1 năm qua</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Download size={20} />
                        Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <Users size={24} />
                        <span className="text-sm bg-white/20 px-2 py-1 rounded">
                            +12.5%
                        </span>
                    </div>
                    <p className="text-sm opacity-90">Tổng học sinh</p>
                    <p className="text-3xl font-bold mt-1">12,458</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <BookOpen size={24} />
                        <span className="text-sm bg-white/20 px-2 py-1 rounded">
                            +8.2%
                        </span>
                    </div>
                    <p className="text-sm opacity-90">Tổng khóa học</p>
                    <p className="text-3xl font-bold mt-1">248</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <GraduationCap size={24} />
                        <span className="text-sm bg-white/20 px-2 py-1 rounded">
                            +5.3%
                        </span>
                    </div>
                    <p className="text-sm opacity-90">Lớp học hoạt động</p>
                    <p className="text-3xl font-bold mt-1">42</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp size={24} />
                        <span className="text-sm bg-white/20 px-2 py-1 rounded">
                            +23.4%
                        </span>
                    </div>
                    <p className="text-sm opacity-90">Tăng trưởng</p>
                    <p className="text-3xl font-bold mt-1">23.4%</p>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Xu hướng lớp học & khóa học
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={16} />
                        6 tháng qua
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={revenueData}>
                        <defs>
                            <linearGradient id="colorClasses" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="classes"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorClasses)"
                            name="Lớp học"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Category Performance & Enrollment Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Performance */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        Hiệu suất theo danh mục
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" angle={-15} textAnchor="end" height={80} />
                            <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                            <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                            <Tooltip />
                            <Legend />
                            <Bar
                                yAxisId="left"
                                dataKey="students"
                                fill="#3b82f6"
                                name="Học sinh"
                            />
                            <Bar
                                yAxisId="right"
                                dataKey="classes"
                                fill="#10b981"
                                name="Lớp học"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Enrollment Trend */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        Xu hướng đăng ký (6 tuần)
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={enrollmentTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="enrollments"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                name="Đăng ký mới"
                                dot={{ fill: "#8b5cf6", r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Statistics Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Thống kê chi tiết theo tháng
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                    Tháng
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                                    Lớp học
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                                    Khóa học
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                                    Học sinh
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                                    Tăng trưởng
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {revenueData.map((data, index) => {
                                const growth =
                                    index > 0
                                        ? (
                                            ((data.classes - revenueData[index - 1].classes) /
                                                revenueData[index - 1].classes) *
                                            100
                                        ).toFixed(1)
                                        : 0;
                                return (
                                    <tr key={data.month} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {data.month}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-green-600">
                                            {data.classes}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-900">
                                            {data.courses}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-900">
                                            {data.students.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {index > 0 && (
                                                <span
                                                    className={`font-semibold ${Number(growth) >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                        }`}
                                                >
                                                    {Number(growth) >= 0 ? "+" : ""}
                                                    {growth}%
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}