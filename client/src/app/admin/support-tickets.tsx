import { useState } from "react";
import {
    Search,
    Filter,
    AlertCircle,
    CheckCircle,
    Clock,
    MessageSquare,
    User,
    Calendar,
    Tag,
} from "lucide-react";

interface Ticket {
    id: number;
    title: string;
    description: string;
    user: string;
    userType: "student" | "instructor";
    category: string;
    priority: "low" | "medium" | "high" | "urgent";
    status: "open" | "in-progress" | "resolved" | "closed";
    createdAt: string;
    updatedAt: string;
    messages: number;
}

const ticketsData: Ticket[] = [
    {
        id: 1,
        title: "Không thể truy cập video bài giảng",
        description: "Khi tôi click vào video bài 5, trang web báo lỗi 404",
        user: "Nguyễn Văn An",
        userType: "student",
        category: "Kỹ thuật",
        priority: "high",
        status: "open",
        createdAt: "4/4/2026 10:30",
        updatedAt: "4/4/2026 10:30",
        messages: 1,
    },
    {
        id: 2,
        title: "Yêu cầu hoàn tiền khóa học",
        description: "Khóa học không đúng như mô tả, tôi muốn được hoàn lại tiền",
        user: "Trần Thị Bình",
        userType: "student",
        category: "Thanh toán",
        priority: "urgent",
        status: "in-progress",
        createdAt: "4/4/2026 09:15",
        updatedAt: "4/4/2026 11:00",
        messages: 5,
    },
    {
        id: 3,
        title: "Cần hỗ trợ upload tài liệu bài giảng",
        description: "Tôi không thể upload file PDF lớn hơn 10MB",
        user: "Lê Văn Cường",
        userType: "instructor",
        category: "Kỹ thuật",
        priority: "medium",
        status: "in-progress",
        createdAt: "4/4/2026 08:45",
        updatedAt: "4/4/2026 10:15",
        messages: 3,
    },
    {
        id: 4,
        title: "Câu hỏi về chứng chỉ hoàn thành",
        description: "Sau khi hoàn thành khóa học, tôi có nhận được chứng chỉ không?",
        user: "Phạm Thị Dung",
        userType: "student",
        category: "Tài khoản",
        priority: "low",
        status: "resolved",
        createdAt: "3/4/2026 16:20",
        updatedAt: "4/4/2026 09:30",
        messages: 4,
    },
    {
        id: 5,
        title: "Lỗi xuất báo cáo doanh thu",
        description: "Không thể xuất file Excel báo cáo doanh thu tháng 3",
        user: "Vũ Thị Phương",
        userType: "instructor",
        category: "Kỹ thuật",
        priority: "high",
        status: "open",
        createdAt: "4/4/2026 07:30",
        updatedAt: "4/4/2026 07:30",
        messages: 1,
    },
    {
        id: 6,
        title: "Đề xuất tính năng mới",
        description: "Nên thêm chức năng thi trực tuyến và chấm điểm tự động",
        user: "Bùi Thị Hoa",
        userType: "instructor",
        category: "Đề xuất",
        priority: "low",
        status: "open",
        createdAt: "3/4/2026 14:00",
        updatedAt: "3/4/2026 14:00",
        messages: 2,
    },
    {
        id: 7,
        title: "Không nhận được email xác nhận",
        description: "Đã đăng ký nhưng không thấy email xác nhận trong hộp thư",
        user: "Hoàng Văn Em",
        userType: "student",
        category: "Tài khoản",
        priority: "medium",
        status: "resolved",
        createdAt: "3/4/2026 11:45",
        updatedAt: "3/4/2026 15:20",
        messages: 3,
    },
    {
        id: 8,
        title: "Lỗi thanh toán bằng thẻ ATM",
        description: "Thanh toán không thành công, tiền đã bị trừ nhưng chưa kích hoạt khóa học",
        user: "Đặng Minh Quân",
        userType: "student",
        category: "Thanh toán",
        priority: "urgent",
        status: "in-progress",
        createdAt: "4/4/2026 13:00",
        updatedAt: "4/4/2026 13:45",
        messages: 6,
    },
];

const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
};

const priorityLabels = {
    low: "Thấp",
    medium: "Trung bình",
    high: "Cao",
    urgent: "Khẩn cấp",
};

const statusColors = {
    open: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
};

const statusLabels = {
    open: "Mới",
    "in-progress": "Đang xử lý",
    resolved: "Đã giải quyết",
    closed: "Đã đóng",
};

export function SupportTickets() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");

    const filteredTickets = ticketsData.filter((ticket) => {
        const matchesSearch =
            ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            filterStatus === "all" || ticket.status === filterStatus;
        const matchesPriority =
            filterPriority === "all" || ticket.priority === filterPriority;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const stats = {
        open: ticketsData.filter((t) => t.status === "open").length,
        inProgress: ticketsData.filter((t) => t.status === "in-progress").length,
        resolved: ticketsData.filter((t) => t.status === "resolved").length,
        urgent: ticketsData.filter((t) => t.priority === "urgent").length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Hỗ trợ & Tickets</h1>
                <p className="text-gray-500 mt-1">
                    Quản lý yêu cầu hỗ trợ từ học sinh và giảng viên
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Tickets mới</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats.open}
                            </p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <AlertCircle className="text-yellow-600" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Đang xử lý</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats.inProgress}
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
                            <p className="text-sm text-gray-500">Đã giải quyết</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats.resolved}
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
                            <p className="text-sm text-gray-500">Khẩn cấp</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats.urgent}
                            </p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg">
                            <AlertCircle className="text-red-600" size={20} />
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
                                placeholder="Tìm kiếm tickets..."
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
                        <option value="open">Mới</option>
                        <option value="in-progress">Đang xử lý</option>
                        <option value="resolved">Đã giải quyết</option>
                        <option value="closed">Đã đóng</option>
                    </select>
                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả mức độ</option>
                        <option value="urgent">Khẩn cấp</option>
                        <option value="high">Cao</option>
                        <option value="medium">Trung bình</option>
                        <option value="low">Thấp</option>
                    </select>
                </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        {ticket.title}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[ticket.priority]
                                            }`}
                                    >
                                        {priorityLabels[ticket.priority]}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[ticket.status]
                                            }`}
                                    >
                                        {statusLabels[ticket.status]}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-3">{ticket.description}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                <span>
                                    {ticket.user} (
                                    {ticket.userType === "student" ? "Học sinh" : "Giảng viên"})
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Tag size={16} />
                                <span>{ticket.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{ticket.createdAt}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageSquare size={16} />
                                <span>{ticket.messages} tin nhắn</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Cập nhật: {ticket.updatedAt}
                            </span>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
