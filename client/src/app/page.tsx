'use client'
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#f8fafc] overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-[40%] h-[50%] bg-blue-50 rounded-full blur-[100px] opacity-40"></div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-10 pb-24 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
          HỆ THỐNG ĐA DỤNG, <br />
          LMS CHO DOANH NGHIỆP
        </h1>
        
        <p className="text-sm md:text-base font-bold text-slate-600 mb-10 tracking-[0.1em] uppercase">
          Cung cấp hệ thống LMS đa dụng cho nội bộ doanh nghiệp
        </p>

        {/* Dashboard Image */}
        <div className="relative mx-auto max-w-5xl group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white rounded-[2rem] p-2 shadow-2xl border border-white/50 overflow-hidden">
            <img 
              src="/images/dashboard-preview.png" 
              alt="Dashboard"
              className="w-full h-auto rounded-[1.8rem]"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop";
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}