import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="mb-6 flex justify-center">
                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertTriangle size={48} className="text-yellow-600" />
                    </div>
                </div>
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Không tìm thấy trang
                </h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Home size={20} />
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
}
