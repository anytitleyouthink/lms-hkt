import { useState } from "react";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Users,
    Clock,
    DollarSign,
    Star,
    TrendingUp,
    Filter,
} from "lucide-react";

interface Course {
    id: number;
    title: string;
    instructor: string;
    category: string;
    students: number;
    duration: string;
    price: string;
    rating: number;
    status: "active" | "draft" | "archived";
    thumbnail: string;
    lastUpdated: string;
}

const coursesData: Course[] = [
    {
        id: 1,
        title: "React Advanced - Xây dựng ứng dụng chuyên nghiệp",
        instructor: "Trần Thị Bình",
        category: "Lập trình Web",
        students: 1245,
        duration: "24 giờ",
        price: "₫1,999,000",
        rating: 4.8,
        status: "active",
        thumbnail: "React",
        lastUpdated: "2/4/2026",
    },
    {
        id: 2,
        title: "Python for Data Science - Phân tích dữ liệu",
        instructor: "Vũ Thị Phương",
        category: "Data Science",
        students: 1180,
        duration: "32 giờ",
        price: "₫2,499,000",
        rating: 4.9,
        status: "active",
        thumbnail: "Python",
        lastUpdated: "1/4/2026",
    },
    {
        id: 3,
        title: "UI/UX Design - Thiết kế giao diện chuyên nghiệp",
        instructor: "Bùi Thị Hoa",
        category: "Thiết kế",
        students: 956,
        duration: "18 giờ",
        price: "₫1,799,000",
        rating: 4.7,
        status: "active",
        thumbnail: "UI/UX",
        lastUpdated: "30/3/2026",
    },
    {
        id: 4,
        title: "Node.js Backend Development - API & Database",
        instructor: "Trần Thị Bình",
        category: "Lập trình Web",
        students: 842,
        duration: "28 giờ",
        price: "₫2,199,000",
        rating: 4.6,
        status: "active",
        thumbnail: "Node",
        lastUpdated: "28/3/2026",
    },
    {
        id: 5,
        title: "Mobile App Development với React Native",
        instructor: "Vũ Thị Phương",
        category: "Lập trình Mobile",
        students: 723,
        duration: "26 giờ",
        price: "₫2,299,000",
        rating: 4.8,
        status: "active",
        thumbnail: "Mobile",
        lastUpdated: "25/3/2026",
    },
    {
        id: 6,
        title: "JavaScript Fundamentals - Nền tảng vững chắc",
        instructor: "Bùi Thị Hoa",
        category: "Lập trình Web",
        students: 654,
        duration: "16 giờ",
        price: "₫1,499,000",
        rating: 4.5,
        status: "draft",
        thumbnail: "JS",
        lastUpdated: "20/3/2026",
    },
];

const statusColors = {
    active: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    archived: "bg-gray-100 text-gray-800",
};

const statusLabels = {
    active: "Đang hoạt động",
    draft: "Bản nháp",
    archived: "Đã lưu trữ",
};

export function CoursesManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    const filteredCourses = coursesData.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            filterCategory === "all" || course.category === filterCategory;
        const matchesStatus =
            filterStatus === "all" || course.status === filterStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Quản lý khóa học
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Tổng số {coursesData.length} khóa học
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus size={20} />
                    Tạo khóa học mới
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Tổng khóa học</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">248</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <TrendingUp className="text-blue-600" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Tổng học sinh</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">12,458</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Users className="text-green-600" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Đang hoạt động</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">235</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <Clock className="text-purple-600" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Đánh giá TB</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">4.7</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Star className="text-yellow-600" size={20} />
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
                                placeholder="Tìm kiếm khóa học, giảng viên..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả danh mục</option>
                        <option value="Lập trình Web">Lập trình Web</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Thiết kế">Thiết kế</option>
                        <option value="Lập trình Mobile">Lập trình Mobile</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="draft">Bản nháp</option>
                        <option value="archived">Đã lưu trữ</option>
                    </select>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        {/* Thumbnail */}
                        <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-3xl font-bold">
                                {course.thumbnail}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[course.status]
                                        }`}
                                >
                                    {statusLabels[course.status]}
                                </span>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-sm font-semibold">{course.rating}</span>
                                </div>
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                {course.title}
                            </h3>

                            <p className="text-sm text-gray-600 mb-3">
                                Giảng viên: {course.instructor}
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Users size={16} />
                                        {course.students} học sinh
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock size={16} />
                                        {course.duration}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-semibold text-green-600">
                                        {course.price}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                                    <Eye size={16} />
                                    Xem
                                </button>
                                <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    <Edit size={16} />
                                </button>
                                <button className="flex items-center justify-center px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}