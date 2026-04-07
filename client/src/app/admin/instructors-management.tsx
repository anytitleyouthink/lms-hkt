import { useState } from "react";
import {
    Search,
    Plus,
    Mail,
    Phone,
    BookOpen,
    Users,
    Star,
    TrendingUp,
    Award,
    Edit,
    MoreVertical,
} from "lucide-react";

interface Instructor {
    id: number;
    name: string;
    email: string;
    phone: string;
    expertise: string[];
    courses: number;
    students: number;
    rating: number;
    joinDate: string;
    status: "active" | "inactive";
    avatar: string;
}

const instructorsData: Instructor[] = [
    {
        id: 1,
        name: "Trần Thị Bình",
        email: "tranthib@lms.com",
        phone: "0912345678",
        expertise: ["React", "Node.js", "JavaScript"],
        courses: 12,
        students: 2087,
        rating: 4.8,
        joinDate: "10/12/2025",
        status: "active",
        avatar: "TTB",
    },
    {
        id: 2,
        name: "Vũ Thị Phương",
        email: "vuthip@lms.com",
        phone: "0956789012",
        expertise: ["Python", "Data Science", "Machine Learning"],
        courses: 8,
        students: 1903,
        rating: 4.9,
        joinDate: "18/01/2026",
        status: "active",
        avatar: "VTP",
    },
    {
        id: 3,
        name: "Bùi Thị Hoa",
        email: "buithih@lms.com",
        phone: "0978901234",
        expertise: ["UI/UX", "Figma", "Design Thinking"],
        courses: 15,
        students: 1610,
        rating: 4.7,
        joinDate: "08/12/2025",
        status: "active",
        avatar: "BTH",
    },
    {
        id: 4,
        name: "Lê Văn Cường",
        email: "levancuong@lms.com",
        phone: "0923456789",
        expertise: ["Java", "Spring Boot", "Microservices"],
        courses: 10,
        students: 1456,
        rating: 4.6,
        joinDate: "15/02/2026",
        status: "active",
        avatar: "LVC",
    },
    {
        id: 5,
        name: "Nguyễn Minh Tâm",
        email: "nguyenminhtam@lms.com",
        phone: "0945678901",
        expertise: ["Flutter", "Dart", "Mobile Development"],
        courses: 6,
        students: 892,
        rating: 4.5,
        joinDate: "20/03/2026",
        status: "active",
        avatar: "NMT",
    },
    {
        id: 6,
        name: "Phạm Văn Đức",
        email: "phamvanduc@lms.com",
        phone: "0967890123",
        expertise: ["DevOps", "Docker", "Kubernetes"],
        courses: 4,
        students: 567,
        rating: 4.8,
        joinDate: "05/03/2026",
        status: "inactive",
        avatar: "PVD",
    },
];

export function InstructorsManagement() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredInstructors = instructorsData.filter((instructor) =>
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Calculate totals
    const totalCourses = instructorsData.reduce((sum, i) => sum + i.courses, 0);
    const totalStudents = instructorsData.reduce((sum, i) => sum + i.students, 0);
    const avgRating = (
        instructorsData.reduce((sum, i) => sum + i.rating, 0) /
        instructorsData.length
    ).toFixed(1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Quản lý giảng viên
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Tổng số {instructorsData.length} giảng viên
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus size={20} />
                    Thêm giảng viên
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Tổng giảng viên</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {instructorsData.length}
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <Award className="text-purple-600" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Tổng khóa học</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {totalCourses}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <BookOpen className="text-blue-600" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Tổng học sinh</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {totalStudents.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Users className="text-green-600" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Đánh giá TB</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {avgRating}
                            </p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Star className="text-yellow-600" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Tìm kiếm giảng viên theo tên, email, kỹ năng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Instructors Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredInstructors.map((instructor) => (
                    <div
                        key={instructor.id}
                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                                    {instructor.avatar}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        {instructor.name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-yellow-500 mt-1">
                                        <Star size={16} fill="currentColor" />
                                        <span className="text-sm font-semibold">
                                            {instructor.rating}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-1">
                                            ({instructor.students} học sinh)
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <MoreVertical size={20} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail size={16} />
                                {instructor.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone size={16} />
                                {instructor.phone}
                            </div>
                        </div>

                        {/* Expertise */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Chuyên môn:</p>
                            <div className="flex flex-wrap gap-2">
                                {instructor.expertise.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                    {instructor.courses}
                                </p>
                                <p className="text-xs text-gray-500">Khóa học</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                    {instructor.students}
                                </p>
                                <p className="text-xs text-gray-500">Học sinh</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">
                                    {instructor.rating}★
                                </p>
                                <p className="text-xs text-gray-500">Đánh giá</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`w-2 h-2 rounded-full ${instructor.status === "active"
                                            ? "bg-green-500"
                                            : "bg-gray-400"
                                        }`}
                                ></span>
                                <span className="text-sm text-gray-600">
                                    Tham gia: {instructor.joinDate}
                                </span>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                                <Edit size={16} />
                                Chỉnh sửa
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}