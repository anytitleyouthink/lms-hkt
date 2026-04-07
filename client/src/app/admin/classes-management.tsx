import { useState } from "react";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Users,
    BookOpen,
    Calendar,
    Clock,
    User,
    MoreVertical,
    CheckCircle,
    XCircle,
} from "lucide-react";

interface Class {
    id: number;
    name: string;
    course: string;
    instructor: string;
    students: number;
    capacity: number;
    startDate: string;
    endDate: string;
    schedule: string;
    status: "active" | "upcoming" | "completed";
    progress: number;
}

const classesData: Class[] = [
    {
        id: 1,
        name: "React Advanced - Lớp A1",
        course: "React Advanced",
        instructor: "Trần Thị Bình",
        students: 28,
        capacity: 30,
        startDate: "1/3/2026",
        endDate: "30/5/2026",
        schedule: "T2, T4, T6 - 19:00-21:00",
        status: "active",
        progress: 45,
    },
    {
        id: 2,
        name: "Python Data Science - Lớp B2",
        course: "Python for Data Science",
        instructor: "Vũ Thị Phương",
        students: 25,
        capacity: 30,
        startDate: "15/2/2026",
        endDate: "15/5/2026",
        schedule: "T3, T5, T7 - 18:00-20:00",
        status: "active",
        progress: 60,
    },
    {
        id: 3,
        name: "UI/UX Design - Lớp C1",
        course: "UI/UX Design",
        instructor: "Bùi Thị Hoa",
        students: 30,
        capacity: 30,
        startDate: "1/2/2026",
        endDate: "30/4/2026",
        schedule: "T2, T4 - 19:00-21:30",
        status: "active",
        progress: 75,
    },
    {
        id: 4,
        name: "Node.js Backend - Lớp D3",
        course: "Node.js Backend Development",
        instructor: "Trần Thị Bình",
        students: 22,
        capacity: 25,
        startDate: "10/4/2026",
        endDate: "10/7/2026",
        schedule: "T3, T6 - 19:00-21:30",
        status: "upcoming",
        progress: 0,
    },
    {
        id: 5,
        name: "JavaScript Fundamentals - Lớp E1",
        course: "JavaScript Fundamentals",
        instructor: "Bùi Thị Hoa",
        students: 30,
        capacity: 30,
        startDate: "1/1/2026",
        endDate: "28/2/2026",
        schedule: "T2, T4, T6 - 18:00-20:00",
        status: "completed",
        progress: 100,
    },
    {
        id: 6,
        name: "Mobile App Dev - Lớp F2",
        course: "Mobile App Development",
        instructor: "Vũ Thị Phương",
        students: 18,
        capacity: 25,
        startDate: "20/3/2026",
        endDate: "20/6/2026",
        schedule: "T3, T5 - 19:00-21:30",
        status: "active",
        progress: 35,
    },
    {
        id: 7,
        name: "React Advanced - Lớp A2",
        course: "React Advanced",
        instructor: "Trần Thị Bình",
        students: 15,
        capacity: 30,
        startDate: "15/4/2026",
        endDate: "15/7/2026",
        schedule: "T2, T4, T6 - 19:00-21:00",
        status: "upcoming",
        progress: 0,
    },
];

const statusColors = {
    active: "bg-green-100 text-green-800",
    upcoming: "bg-blue-100 text-blue-800",
    completed: "bg-gray-100 text-gray-800",
};

const statusLabels = {
    active: "Đang học",
    upcoming: "Sắp diễn ra",
    completed: "Đã hoàn thành",
};

const statusIcons = {
    active: CheckCircle,
    upcoming: Clock,
    completed: XCircle,
};

export function ClassesManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const filteredClasses = classesData.filter((cls) => {
        const matchesSearch =
            cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || cls.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: classesData.length,
        active: classesData.filter((c) => c.status === "active").length,
        upcoming: classesData.filter((c) => c.status === "upcoming").length,
        completed: classesData.filter((c) => c.status === "completed").length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý lớp học</h1>
                    <p className="text-gray-500 mt-1">
                        Tổng số {classesData.length} lớp học
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus size={20} />
                    Tạo lớp học mới
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Tổng lớp học</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats.total}
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <BookOpen className="text-purple-600" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Đang học</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats.active}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <CheckCircle className="text-green-600" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Sắp diễn ra</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats.upcoming}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Clock className="text-blue-600" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Đã hoàn thành</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats.completed}
                            </p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg">
                            <XCircle className="text-gray-600" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Tìm kiếm lớp học, khóa học, giảng viên..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang học</option>
                        <option value="upcoming">Sắp diễn ra</option>
                        <option value="completed">Đã hoàn thành</option>
                    </select>
                </div>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredClasses.map((cls) => {
                    const StatusIcon = statusIcons[cls.status];
                    return (
                        <div
                            key={cls.id}
                            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                                        {cls.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[cls.status]
                                                }`}
                                        >
                                            <StatusIcon className="inline mr-1" size={12} />
                                            {statusLabels[cls.status]}
                                        </span>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <MoreVertical size={20} className="text-gray-600" />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <BookOpen size={16} />
                                    <span>{cls.course}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User size={16} />
                                    <span>GV: {cls.instructor}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users size={16} />
                                    <span>
                                        {cls.students}/{cls.capacity} học sinh
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock size={16} />
                                    <span>{cls.schedule}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar size={16} />
                                    <span>
                                        {cls.startDate} - {cls.endDate}
                                    </span>
                                </div>
                            </div>

                            {/* Progress */}
                            {cls.status !== "upcoming" && (
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-600">Tiến độ học tập</span>
                                        <span className="font-semibold text-gray-900">
                                            {cls.progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                            style={{ width: `${cls.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t border-gray-200">
                                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                                    <Users size={16} />
                                    Xem học sinh
                                </button>
                                <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    <Edit size={16} />
                                </button>
                                <button className="flex items-center justify-center px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

