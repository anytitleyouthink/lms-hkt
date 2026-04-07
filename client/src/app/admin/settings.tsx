import { useState } from "react";
import {
    User,
    Bell,
    Shield,
    Globe,
    Mail,
    Database,
    Palette,
    Save,
} from "lucide-react";

export function Settings() {
    const [activeTab, setActiveTab] = useState("general");

    const tabs = [
        { id: "general", label: "Chung", icon: Globe },
        { id: "profile", label: "Hồ sơ", icon: User },
        { id: "notifications", label: "Thông báo", icon: Bell },
        { id: "security", label: "Bảo mật", icon: Shield },
        { id: "email", label: "Email", icon: Mail },
        { id: "appearance", label: "Giao diện", icon: Palette },
        { id: "database", label: "Dữ liệu", icon: Database },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
                <p className="text-gray-500 mt-1">
                    Quản lý cấu hình và tùy chỉnh hệ thống LMS
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 h-fit">
                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 p-6">
                    {activeTab === "general" && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Cài đặt chung
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Tên hệ thống
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="LMS Admin"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mô tả
                                    </label>
                                    <textarea
                                        rows={3}
                                        defaultValue="Hệ thống quản lý học tập trực tuyến"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Múi giờ
                                    </label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>GMT+7 (Giờ Việt Nam)</option>
                                        <option>GMT+8 (Giờ Singapore)</option>
                                        <option>GMT+9 (Giờ Nhật Bản)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Ngôn ngữ
                                    </label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>Tiếng Việt</option>
                                        <option>English</option>
                                        <option>中文</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "profile" && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Thông tin cá nhân
                                </h2>
                            </div>

                            <div className="flex items-center gap-6 mb-6">
                                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                    A
                                </div>
                                <div>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2">
                                        Tải ảnh lên
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        Xóa
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Họ và tên
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Admin User"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue="admin@lms.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        defaultValue="0901234567"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Vai trò
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Quản trị viên hệ thống"
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "notifications" && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Cài đặt thông báo
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    {
                                        title: "Đăng ký mới",
                                        description: "Nhận thông báo khi có học sinh đăng ký mới",
                                    },
                                    {
                                        title: "Khóa học mới",
                                        description: "Nhận thông báo khi giảng viên tạo khóa học mới",
                                    },
                                    {
                                        title: "Yêu cầu hỗ trợ",
                                        description: "Nhận thông báo khi có ticket hỗ trợ mới",
                                    },
                                    {
                                        title: "Thanh toán",
                                        description: "Nhận thông báo về các giao dịch thanh toán",
                                    },
                                    {
                                        title: "Báo cáo hệ thống",
                                        description: "Nhận báo cáo tổng hợp hàng ngày/tuần",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-900">{item.title}</p>
                                            <p className="text-sm text-gray-500">{item.description}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Bảo mật
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mật khẩu hiện tại
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Xác thực 2 yếu tố (2FA)
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Tăng cường bảo mật tài khoản
                                            </p>
                                        </div>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                            Kích hoạt
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "email" && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Cấu hình Email
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        SMTP Host
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="smtp.gmail.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            SMTP Port
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="587"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Encryption
                                        </label>
                                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option>TLS</option>
                                            <option>SSL</option>
                                            <option>None</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="your-email@gmail.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    Gửi email thử nghiệm
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "appearance" && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Tùy chỉnh giao diện
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Chế độ hiển thị
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {["Sáng", "Tối", "Tự động"].map((mode) => (
                                            <div
                                                key={mode}
                                                className="p-4 border-2 border-blue-500 rounded-lg cursor-pointer hover:bg-blue-50"
                                            >
                                                <p className="text-center font-semibold">{mode}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Màu chủ đạo
                                    </label>
                                    <div className="flex gap-3">
                                        {[
                                            "#3b82f6",
                                            "#8b5cf6",
                                            "#10b981",
                                            "#f59e0b",
                                            "#ef4444",
                                        ].map((color) => (
                                            <div
                                                key={color}
                                                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300 hover:border-gray-900"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "database" && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Quản lý dữ liệu
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Sao lưu dữ liệu
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Sao lưu lần cuối: 4/4/2026 lúc 02:00
                                    </p>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        Sao lưu ngay
                                    </button>
                                </div>

                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Xuất dữ liệu
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Xuất toàn bộ dữ liệu sang file CSV/JSON
                                    </p>
                                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                        Xuất dữ liệu
                                    </button>
                                </div>

                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Xóa dữ liệu
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Cảnh báo: Hành động này không thể hoàn tác
                                    </p>
                                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                        Xóa dữ liệu cũ
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="pt-6 border-t border-gray-200 flex justify-end">
                        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Save size={20} />
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
