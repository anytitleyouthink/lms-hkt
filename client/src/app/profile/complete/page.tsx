"use client";
import { GuardianSelector } from "@/components/ui/profile/GuardianSelector";
import { ArrowRight } from "lucide-react";

export default function CompleteProfilePage() {
    return (
        <div className="max-w-5xl mx-auto">
            {/* Phần tiêu đề căn giữa */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-[#2b3674] tracking-tight mb-3">
                    Hoàn thành thông tin của bạn
                </h1>
                <p className="text-slate-400 font-medium max-w-lg mx-auto">
                    Tell us a bit about yourself to personalize your learning journey.
                </p>
            </div>

            {/* Grid chia 2 cột: Form (Trái) và Guardian (Phải) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Cột 1: Form nhập liệu (Chiếm 7/12 cột) */}
                <div className="lg:col-span-7">
                    <form className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#2b3674] uppercase tracking-widest ml-1">Full Name</label>
                                <input type="text" defaultValue="Alex Johnson" className="w-full bg-[#f4f7fe] border-none rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#2b3674] uppercase tracking-widest ml-1">Phone Number</label>
                                <input type="text" placeholder="+1 (555) 000-0000" className="w-full bg-[#f4f7fe] border-none rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#2b3674] uppercase tracking-widest ml-1">Email Address</label>
                            <input type="email" readOnly defaultValue="alex.johnson@lumina.edu" className="w-full bg-[#f4f7fe] border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-400 outline-none cursor-not-allowed" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#2b3674] uppercase tracking-widest ml-1">About Yourself</label>
                            <textarea rows={4} placeholder="Briefly describe your goals..." className="w-full bg-[#f4f7fe] border-none rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none resize-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                        </div>

                        <button className="w-full md:w-auto bg-[#1b64a3] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#154d7e] shadow-lg shadow-blue-100 transition-all active:scale-[0.98]">
                            Save and Continue <ArrowRight size={16} />
                        </button>
                    </form>
                </div>

                {/* Cột 2: Guardian Selector (Chiếm 5/12 cột) */}
                <div className="lg:col-span-5">
                    <GuardianSelector />
                </div>

            </div>
        </div>
    );
}