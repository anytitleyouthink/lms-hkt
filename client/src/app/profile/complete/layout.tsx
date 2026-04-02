export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        // Đổi nền thành màu xanh rất nhạt để làm nổi bật các khối trắng
        <div className="min-h-screen bg-[#f8faff]">
            <main className="w-full py-8 md:py-16 px-4">
                {children}
            </main>
        </div>
    );
}