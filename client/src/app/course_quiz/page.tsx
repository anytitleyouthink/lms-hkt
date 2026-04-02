"use client";

import React, { useState } from 'react';

// --- MOCK DATA ---
const questionData = {
  course: "NEURAL ARCHITECTURE & DYNAMICS",
  question: "What is the primary goal of Evolutionary Dynamics in neural systems?",
  options: [
    { id: 'A', text: "Maximizing raw data throughput without filtering signals." },
    { id: 'B', text: "Optimizing synaptic weight distributions for adaptive survival." },
    { id: 'C', text: "Reducing the number of active neurons to conserve metabolic energy." },
    { id: 'D', text: "Replacing electrical impulses with biochemical diffusion entirely." }
  ]
};

// --- COMPONENTS ---

const OptionCard = ({ id, text, isSelected, onClick }: { id: string, text: string, isSelected: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group ${
      isSelected 
        ? 'bg-white border-[#1E6091] shadow-sm' 
        : 'bg-[#F4F7FB] border-transparent hover:border-[#E1E8F0]'
    }`}
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors ${
      isSelected 
        ? 'bg-[#1E6091] text-white' 
        : 'bg-white text-slate-500 shadow-sm'
    }`}>
      {id}
    </div>
    <span className={`text-[15px] font-semibold ${isSelected ? 'text-[#1E6091]' : 'text-slate-700'}`}>
      {text}
    </span>
  </button>
);

export default function AssessmentPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>('B');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 md:p-12 font-sans text-slate-900 flex justify-center">
      <div className="max-w-[1200px] w-full">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Current Assessment</h2>
            <h1 className="text-[#1E6091] font-bold text-lg">Question 4 of 10</h1>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Timer */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
              <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
              <span className="font-bold text-slate-800 text-sm">14:52</span>
            </div>
            
            {/* Progress */}
            <div className="w-32">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                <span>Progress</span>
                <span>40%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 w-[40%] rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: QUESTION AREA (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col">
            
            {/* Course Tag */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-slate-400 text-lg">🎓</span>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                COURSE: {questionData.course}
              </span>
            </div>

            {/* Question Title */}
            <h2 className="text-2xl md:text-3xl font-black text-[#102A43] mb-10 leading-snug">
              {questionData.question}
            </h2>

            {/* Options List */}
            <div className="space-y-4 mb-12 flex-1">
              {questionData.options.map((opt) => (
                <OptionCard 
                  key={opt.id}
                  id={opt.id}
                  text={opt.text}
                  isSelected={selectedOption === opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                />
              ))}
            </div>

            {/* Footer Navigation */}
            <div className="border-t border-slate-100 pt-6 flex items-center justify-between mt-auto">
              <button className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors px-4 py-2 rounded-lg hover:bg-slate-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Previous
              </button>
              
              <button className="flex items-center gap-2 bg-[#1E6091] hover:bg-[#164A73] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-95">
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>

          {/* RIGHT: SIDEBAR (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Related Concepts Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[#1E6091] text-lg">📖</span>
                <h3 className="font-black text-[#102A43] text-sm">Related Concepts</h3>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="bg-[#F4F7FB] p-4 rounded-xl border border-transparent hover:border-slate-200 transition-colors cursor-pointer">
                  <p className="text-[10px] font-bold text-[#1E6091] uppercase tracking-wider mb-1">Chapter 4.2</p>
                  <p className="text-sm font-bold text-slate-700">Synaptic Plasticity & Hebbian Learning</p>
                </div>
                <div className="bg-[#F4F7FB] p-4 rounded-xl border border-transparent hover:border-slate-200 transition-colors cursor-pointer">
                  <p className="text-[10px] font-bold text-[#1E6091] uppercase tracking-wider mb-1">Chapter 5.1</p>
                  <p className="text-sm font-bold text-slate-700">Stochastic Resonance in Networks</p>
                </div>
              </div>

              <button className="w-full py-3 border-2 border-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-wide">
                Review Lecture Notes
              </button>
            </div>

            {/* 2. Trainer Tip Card */}
            <div className="bg-[#F4F7FB] rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
                <div className="w-12 h-12 rounded-full bg-slate-300 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                  {/* Fake Avatar */}
                  <div className="w-full h-full bg-[#1E6091] flex items-end justify-center pt-2">
                     <div className="w-6 h-6 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned By</p>
                  <p className="font-black text-slate-800 text-sm">Dr. Julian Vane</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#1E6091]">📍</span>
                  <span className="text-[10px] font-black text-[#1E6091] uppercase tracking-widest">Trainer Tip</span>
                </div>
                <p className="text-sm text-slate-600 italic leading-relaxed font-medium">
                  Take your time with the neural dynamics section. The complexity lies in the distribution, not the volume. Remember to consider how networks adapt over long cycles.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">
                  <span>Topic Mastery</span>
                  <span>68%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1E6091] w-[68%] rounded-full"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}