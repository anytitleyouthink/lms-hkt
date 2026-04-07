"use client";

import React from 'react';
import { Plus, Users, BookOpen, Star, Check, X } from "lucide-react";
import StatCard from '../../../../components/ui/StatCard';

// Dữ liệu mẫu cho danh sách yêu cầu tham gia (Enrollment Requests)
const ENROLLMENT_REQUESTS = [
    { id: 1, name: "Sarah Jenkins", course: "Cognitive Ergonomics", date: "Oct 24, 2023", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: 2, name: "Marcus Thorne", course: "Advanced Systems Architecture", date: "Oct 23, 2023", avatar: "https://i.pravatar.cc/150?u=marcus" },
    { id: 3, name: "Elena Rodriguez", course: "Sustainable Design Ethics", date: "Oct 22, 2023", avatar: "https://i.pravatar.cc/150?u=elena" },
];

// Dữ liệu mẫu cho khóa học của Trainer (Your Courses)
const TRAINER_COURSES = [
    { id: 1, name: "Neural Network Ethics", category: "AI & ETHICS", students: 428, rating: 4.9, image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400" },
    { id: 2, name: "Systems Architecture", category: "ARCHITECTURE", students: 185, rating: 4.7, image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400" },
];

export default function TrainerDashboard() {
    return (
        <div className="flex min-h-screen bg-[#f4f7fe] font-sans text-[#2b3674]">

            {/* WRAPPER CHIA 2 CỘT */}
            <div className="flex-1 flex overflow-hidden">

                {/* CỘT TRÁI: THỐNG KÊ VÀ YÊU CẦU */}
                <main className="flex-1 px-10 py-8 overflow-y-auto space-y-8">

                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-[#1b2559]">Trainer Dashboard</h1>
                            <p className="text-slate-400 font-medium mt-1">Managing the future of your learning ecosystem.</p>
                        </div>
                        <button className="bg-[#2b64e3] hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all">
                            <Plus size={20} /> Create New Course
                        </button>
                    </div>

                    {/* Section: Student Progress Overview */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-[#1b2559]">Student Progress Overview</h3>
                            <button className="text-blue-600 font-bold text-sm">View Full Report</button>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="bg-[#f4f7fe] p-6 rounded-3xl">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Active Learners</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-[#1b2559]">1,284</span>
                                    <span className="text-green-500 text-xs font-bold">~+12%</span>
                                </div>
                            </div>
                            <div className="bg-[#f4f7fe] p-6 rounded-3xl">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg. Completion Rate</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-[#1b2559]">82%</span>
                                    <span className="text-green-500 text-xs font-bold">~+5%</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress bars cho từng mảng */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span>Advanced Neural Networks</span>
                                    <span>92% Progress</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[92%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span>Ethical AI Governance</span>
                                    <span>65% Progress</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[65%]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Enrollment Requests */}
                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-50 overflow-hidden">
                        <div className="p-8 pb-4">
                            <h3 className="text-xl font-black text-[#1b2559]">Enrollment Requests</h3>
                        </div>
                        <table className="w-full">
                            <thead className="bg-[#f4f7fe]/50 border-y border-slate-50">
                                <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-4">Employee Name</th>
                                    <th className="px-8 py-4">Course Name</th>
                                    <th className="px-4 py-4 text-center">Requested Date</th>
                                    <th className="px-8 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {ENROLLMENT_REQUESTS.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={req.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                                                <span className="font-bold text-sm text-[#1b2559]">{req.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="font-bold text-sm text-slate-500">{req.course}</span>
                                        </td>
                                        <td className="px-4 py-4 text-center text-xs font-bold text-slate-400">{req.date}</td>
                                        <td className="px-8 py-4">
                                            <div className="flex justify-center gap-3">
                                                <button className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all"><Check size={16} /></button>
                                                <button className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all"><X size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>

                {/* CỘT PHẢI: YOUR COURSES */}
                <aside className="w-[380px] p-8 space-y-6 hidden xl:block border-l border-slate-100 overflow-y-auto">
                    <h3 className="text-xl font-black text-[#1b2559]">Your Courses</h3>

                    <div className="space-y-6">
                        {TRAINER_COURSES.map((course) => (
                            <div key={course.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-50 group hover:shadow-md transition-all">
                                <div className="relative h-40">
                                    <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-black text-blue-600 uppercase">
                                        {course.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h4 className="font-black text-[#1b2559] text-lg mb-4">{course.name}</h4>
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                                        <div className="flex items-center gap-1"><Users size={14} /> {course.students} Students</div>
                                        <div className="flex items-center gap-1 text-orange-500"><Star size={14} fill="currentColor" /> {course.rating}</div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Button Add More Courses */}
                        <button className="w-full py-10 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all group">
                            <div className="p-3 bg-slate-50 group-hover:bg-blue-50 rounded-full">
                                <Plus size={24} />
                            </div>
                            <span className="font-bold text-sm">Add more courses</span>
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}