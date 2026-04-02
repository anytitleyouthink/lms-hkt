"use client";

import React from 'react';

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU (TYPES) ---
interface ChannelItemProps {
  name: string;
  activeCount: number;
  icon: string;
  selected?: boolean;
}

interface MessageProps {
  user: string;
  time: string;
  text: string;
  isMe: boolean;
  role?: string;
}

interface UserStatusProps {
  name: string;
  status: string;
  emoji: string;
  isOnline?: boolean; // Vẫn giữ boolean nhưng sẽ đổi logic render
}

// --- COMPONENTS NHỎ ---
const ChannelItem = ({ name, activeCount, icon, selected = false }: ChannelItemProps) => (
  <div className={`flex items-center p-3 mb-2 rounded-xl cursor-pointer transition-all ${selected ? 'bg-white shadow-md text-blue-900' : 'text-gray-500 hover:bg-blue-50'}`}>
    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-lg">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-bold">{name}</p>
      <p className="text-[10px] opacity-60">{activeCount} Active</p>
    </div>
  </div>
);

const Message = ({ user, time, text, isMe, role }: MessageProps) => (
  <div className={`flex mb-6 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 mx-2 flex-shrink-0" />
    <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center mb-1 gap-2">
        <span className="text-xs font-bold text-gray-700">
          {user} {role && <span className="text-orange-500 font-medium ml-1">({role})</span>}
        </span>
        <span className="text-[10px] text-gray-400">{time}</span>
      </div>
      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
        isMe 
          ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-100 shadow-lg' 
          : 'bg-[#FFF7ED] text-gray-800 rounded-tl-none border border-orange-100'
      }`}>
        {text}
      </div>
    </div>
  </div>
);

// [CẬP NHẬT] Component Scholar để hiển thị chấm xanh/đỏ và UI giống ảnh
const ActiveScholar = ({ name, status, emoji, isOnline = true }: UserStatusProps) => (
  <div className="flex items-center mb-5 group cursor-pointer">
    <div className="relative mr-4">
      {/* Avatar size được làm to hơn một chút cho giống hình */}
      <div className="w-11 h-11 rounded-full bg-slate-200 shadow-inner" />
      
      {/* Chấm trạng thái: Xanh nếu isOnline là true, Đỏ nếu isOnline là false */}
      <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-[2.5px] border-white rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
    </div>
    <div className="flex-1 flex flex-col justify-center">
      <p className="text-[13px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-0.5">{name}</p>
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] leading-none">{emoji}</span>
        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider leading-none">{status}</span>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
export default function LMSChatPage() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">
      
      {/* 1. LEFT SIDEBAR - COURSE CHANNELS */}
      <aside className="w-72 p-6 flex flex-col border-r border-slate-200 bg-[#F0F4F9]/50">
        <h2 className="text-[11px] font-black text-blue-900 uppercase tracking-[0.2em] mb-8 px-2 opacity-70">
          Course Channels
        </h2>
        
        <nav className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <ChannelItem name="General Sanctuary" activeCount={12} icon="👥" selected />
          <ChannelItem name="Neural Architecture" activeCount={8} icon="🧠" />
          <ChannelItem name="Ethical AI Foundations" activeCount={4} icon="⚖️" />
          <ChannelItem name="Quantum Logic Lab" activeCount={15} icon="⚛️" />
        </nav>

        {/* Gamification Card */}
        <div className="mt-6 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-black text-blue-900">PET CHAT ENERGY</span>
            <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">LVL 4 BOOST</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-full w-[70%] transition-all duration-500" />
          </div>
          <p className="text-[9px] text-slate-400 leading-tight">
            Contributors earn <span className="text-orange-600 font-bold">+25 XP</span> for helpful responses.
          </p>
        </div>
      </aside>

      {/* 2. CENTER - CHAT INTERFACE */}
      <main className="flex-1 flex flex-col bg-white shadow-2xl relative z-10">
        {/* Chat Messages */}
        <div className="flex-1 p-8 overflow-y-auto space-y-2">
          <Message 
            user="Julian V." 
            time="10:24 AM" 
            text="Does anyone have the specific readings for the Ethical AI module? I'm curious about the alignment case studies." 
            isMe={false} 
          />
          <Message 
            user="Me (Barnaby)" 
            time="10:26 AM" 
            text="Sure, Julian! You can find the PDF in the 'Resources' tab of the Course Lounge. Look for the 'Alignment Protocols' sub-folder." 
            isMe={true} 
          />
          <Message 
            user="Dr. Aris" 
            role="Trainer" 
            time="10:30 AM" 
            text="Barnaby is correct. I've also just uploaded a guest lecture summary on the topic. Check it out for extra Pet XP!" 
            isMe={false} 
          />
        </div>

        {/* Input Bar */}
        <div className="p-6 bg-white border-t border-slate-100">
          <div className="flex items-center bg-slate-50 rounded-2xl px-5 py-3 border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
            <button className="text-slate-400 hover:text-blue-600 text-xl font-light">+</button>
            <input 
              type="text" 
              placeholder="Type a message to the community..." 
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-sm text-slate-700 placeholder:text-slate-400" 
            />
            <div className="flex items-center gap-4">
               <button className="text-slate-400 hover:text-blue-500 transition-colors">😊</button>
               <button className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-xl text-white shadow-md shadow-blue-200 transition-all active:scale-95">
                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 transform rotate-90"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
               </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. RIGHT SIDEBAR - ACTIVE SCHOLARS */}
      <aside className="w-72 p-6 bg-white border-l border-slate-100">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 px-2 text-center">
          Active Scholars
        </h2>
        
        {/* [CẬP NHẬT] Truyền isOnline false cho một vài user */}
        <div className="px-4">
          <ActiveScholar name="Julian V." status="Happy" emoji="🦊" isOnline={true} />
          <ActiveScholar name="Elena Rose" status="Sleeping" emoji="🐱" isOnline={false} />
          <ActiveScholar name="Dr. Aris" status="Head Trainer" emoji="🐢" isOnline={true} />
          <ActiveScholar name="Marcus K." status="Idle" emoji="🦎" isOnline={false} />
        </div>
      </aside>
    </div>
  );
}