"use client";

import React from 'react';
import {
    Search, Bell, Mail, HelpCircle, BookOpen,
    Send, CheckCircle, Award, Clock, Star, Plus
} from "lucide-react";

// --- Sub-components ---

const CourseProgressItem = ({ title, progress, color }: { title: string, progress: number, color: string }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[11px] font-black text-[#1b2559]">
            <span>{title}</span>
            <span>{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full`} style={{ width: `${progress}%` }} />
        </div>
    </div>
);

const QuickNote = ({ text, time, color }: { text: string, time: string, color: string }) => (
    <div className={`p-4 rounded-2xl bg-[#f4f7fe] border-l-4 ${color} space-y-1 group hover:bg-white hover:shadow-md transition-all cursor-pointer`}>
        <p className="text-[11px] font-bold text-[#1b2559] leading-relaxed italic">"{text}"</p>
        <p className="text-[10px] text-slate-400 font-medium uppercase">Added {time}</p>
    </div>
);

const RecommendCard = ({ title, category, students, rating, image, color }: any) => (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-50 group hover:shadow-xl transition-all duration-300">
        <div className="relative h-44 overflow-hidden">
            <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[9px] font-black text-blue-600 uppercase tracking-widest">
                {category}
            </div>
        </div>
        <div className="p-6">
            <h4 className="text-[#1b2559] font-black text-base leading-tight mb-4 min-h-[40px]">{title}</h4>
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                <div className="flex items-center gap-1.5"><Star size={14} className="text-orange-400" fill="currentColor" /> {rating}</div>
                <div>{students} Students</div>
            </div>
        </div>
    </div>
);

export default function StudentDashboard() {
    return (
        <div className="flex min-h-screen bg-[#f4f7fe] font-sans text-[#2b3674]">

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* 1. TOP NAVIGATION BAR */}
                <header className="flex items-center justify-between px-10 py-6 bg-transparent">
                    <h2 className="text-sm font-black text-[#1b2559] uppercase tracking-widest">Academic Kinship</h2>
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input type="text" placeholder="Search knowledge..." className="bg-white/50 backdrop-blur border-none rounded-2xl py-3 pl-12 pr-6 w-80 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all outline-none" />
                        </div>
                        <div className="flex items-center gap-4 text-slate-500">
                            <button className="relative p-2 hover:bg-white rounded-xl transition-all"><Bell size={20} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f4f7fe]"></span></button>
                            <button className="p-2 hover:bg-white rounded-xl transition-all"><Mail size={20} /></button>
                            <button className="p-2 hover:bg-white rounded-xl transition-all"><HelpCircle size={20} /></button>
                        </div>
                        <img src="https://i.pravatar.cc/150?u=tien" className="w-10 h-10 rounded-2xl border-2 border-white shadow-sm cursor-pointer" alt="Profile" />
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* LEFT COLUMN: PRIMARY INFO */}
                    <main className="flex-1 px-10 pb-10 space-y-10 overflow-y-auto custom-scrollbar">

                        {/* Welcome Section */}
                        <div>
                            <h1 className="text-4xl font-black text-[#1b2559] tracking-tight">Welcome back, Tiến</h1>
                            <p className="text-slate-400 font-bold mt-2">Your learning momentum is at an all-time high this week.</p>
                        </div>

                        {/* Top Action Cards */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 space-y-6 relative overflow-hidden group">
                                <div className="flex justify-between items-start">
                                    <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">In Progress</span>
                                    <BookOpen className="text-blue-100 group-hover:text-blue-600 transition-colors" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[#1b2559] leading-tight">Advanced Systems<br />Architecture</h3>
                                    <p className="text-xs font-bold text-slate-400 mt-2 uppercase">Module 4 of 12 <span className="mx-2">•</span> 35%</p>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600" style={{ width: '35%' }} />
                                </div>
                                <button className="w-full py-4 bg-[#f4f7fe] hover:bg-blue-600 hover:text-white text-blue-600 font-black rounded-2xl transition-all">Resume Learning</button>
                            </div>

                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 space-y-6 relative overflow-hidden group">
                                <div className="flex justify-between items-start">
                                    <span className="bg-green-50 text-green-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Recent</span>
                                    <CheckCircle className="text-green-100 group-hover:text-green-600 transition-colors" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[#1b2559] leading-tight">Emotional Intelligence<br />in Leadership</h3>
                                    <p className="text-xs font-bold text-slate-400 mt-2 uppercase">Final Assessment <span className="mx-2">•</span> 88%</p>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-600" style={{ width: '88%' }} />
                                </div>
                                <button className="w-full py-4 bg-green-800 text-white font-black rounded-2xl shadow-lg shadow-green-100 hover:bg-green-900 transition-all">Finish Course</button>
                            </div>
                        </div>

                        {/* Recommended Section */}
                        <section className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-2xl font-black text-[#1b2559]">Recommended for You</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Expand your horizon with these curated tracks.</p>
                                </div>
                                <button className="text-blue-600 font-black text-sm flex items-center gap-2 hover:gap-3 transition-all">View All Courses →</button>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <RecommendCard title="Zero Trust Networking for Modern Enterprises" category="Cyber Defense" rating="4.9" students="2.4k" image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400" />
                                <RecommendCard title="Strategic Conflict Resolution & Negotiation" category="Human Resources" rating="4.7" students="1.1k" image="https://images.unsplash.com/photo-1521791136064-7986c295944b?w=400" />
                                <RecommendCard title="Edge Computing & Embedded Systems Mastery" category="Engineering" rating="5.0" students="890" image="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400" />
                            </div>
                        </section>


                    </main>

                    {/* RIGHT COLUMN: WIDGETS */}
                    <aside className="w-[360px] px-8 pb-10 space-y-8 hidden xl:block overflow-y-auto">

                        {/* Current Courses Widget */}
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 space-y-8">
                            <div className="flex justify-between items-center">
                                <h4 className="font-black text-[#1b2559] text-base">Current Courses</h4>
                                <BookOpen size={20} className="text-blue-600" />
                            </div>
                            <div className="space-y-6">
                                <CourseProgressItem title="Neural Networks Deep Dive" progress={65} color="bg-blue-600" />
                                <CourseProgressItem title="Sustainable Energy Design" progress={28} color="bg-green-600" />
                                <CourseProgressItem title="Global Market Ethics" progress={90} color="bg-[#7b4d12]" />
                            </div>
                            <button className="w-full py-4 border border-slate-100 rounded-2xl text-xs font-black text-blue-600 hover:bg-slate-50 transition-all uppercase tracking-widest mt-4">
                                View All Learning
                            </button>
                        </div>



                        {/* Learning Progress Goal */}
                        <div className="bg-[#1b64a3] p-8 rounded-[32px] text-white space-y-4 shadow-xl shadow-blue-100">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Learning Progress</p>
                            <h4 className="text-xl font-black">75% Monthly Goal</h4>
                            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-green-400 rounded-full" style={{ width: '75%' }} />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}