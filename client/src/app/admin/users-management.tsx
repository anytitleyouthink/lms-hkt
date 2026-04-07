import { useState } from "react";
import {
    Search,
    Filter,
    Download,
    Plus,
    Edit,
    Trash2,
    MoreVertical,
    Mail,
    Phone,
    CheckCircle,
    XCircle,
} from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: "student" | "instructor" | "admin";
    status: "active" | "inactive";
    courses: number;
    joinDate: string;
    avatar: string;
}

const usersData: User[] = [
    {
        id: 1,
        name: "Nguyễn Văn An",
        email: "nguyenvanan@email.com",
        phone: "0901234567",
        role: "student",
        status: "active",
        courses: 5,
        joinDate: "15/01/2026",
        avatar: "NVA",
    },
    {
        id: 2,
        name: "Trần Thị Bình",
        email: "tranthib@email.com",
        phone: "0912345678",
        role: "instructor",
        status: "active",
        courses: 12,
        joinDate: "10/12/2025",
        avatar: "TTB",
    },
    {
        id: 3,
        name: "Lê Minh Cường",
        email: "leminhc@email.com",
        phone: "0923456789",
        role: "student",
        status: "active",
        courses: 3,
        joinDate: "20/02/2026",
        avatar: "LMC",
    },
    {
        id: 4,
        name: "Phạm Thị Dung",
        email: "phamthid@email.com",
        phone: "0934567890",
        role: "admin",
        status: "active",
        courses: 0,
        joinDate: "05/11/2025",
        avatar: "PTD",
    },
    {
        id: 5,
        name: "Hoàng Văn Em",
        email: "hoangvane@email.com",
        phone: "0945678901",
        role: "student",
        status: "inactive",
        courses: 8,
        joinDate: "12/03/2026",
        avatar: "HVE",
    },
    {
        id: 6,
        name: "Vũ Thị Phương",
        email: "vuthip@email.com",
        phone: "0956789012",
        role: "instructor",
        status: "active",
        courses: 7,
        joinDate: "18/01/2026",
        avatar: "VTP",
    },
    {
        id: 7,
        name: "Đặng Minh Quân",
        email: "dangminhq@email.com",
        phone: "0967890123",
        role: "student",
        status: "active",
        courses: 2,
        joinDate: "25/03/2026",
        avatar: "DMQ",
    },
    {
        id: 8,
        name: "Bùi Thị Hoa",
        email: "buithih@email.com",
        phone: "0978901234",
        role: "instructor",
        status: "active",
        courses: 15,
        joinDate: "08/12/2025",
        avatar: "BTH",
    },
];

const roleColors = {
    student: "bg-blue-100 text-blue-800",
    instructor: "bg-purple-100 text-purple-800",
    admin: "bg-red-100 text-red-800",
};

const roleLabels = {
    student: "Học sinh",
    instructor: "Giảng viên",
    admin: "Quản trị viên",
};

export function UsersManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const filteredUsers = usersData.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        const matchesStatus =
            filterStatus === "all" || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Quản lý người dùng
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Tổng số {usersData.length} người dùng
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus size={20} />
                    Thêm người dùng
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Role Filter */}
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả vai trò</option>
                        <option value="student">Học sinh</option>
                        <option value="instructor">Giảng viên</option>
                        <option value="admin">Quản trị viên</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>

                    {/* Export Button */}
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download size={20} />
                        Xuất file
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Người dùng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Liên hệ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Vai trò
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Khóa học
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Ngày tham gia
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                {user.avatar}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {user.name}
                                                </p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail size={14} />
                                                {user.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone size={14} />
                                                {user.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColors[user.role]
                                                }`}
                                        >
                                            {roleLabels[user.role]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-900 font-semibold">
                                            {user.courses}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{user.joinDate}</td>
                                    <td className="px-6 py-4">
                                        {user.status === "active" ? (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <CheckCircle size={16} />
                                                <span className="text-sm font-semibold">
                                                    Hoạt động
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-600">
                                                <XCircle size={16} />
                                                <span className="text-sm font-semibold">
                                                    Không hoạt động
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Hiển thị {filteredUsers.length} / {usersData.length} người dùng
                    </p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Trước
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                            1
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            2
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            3
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Sau
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
