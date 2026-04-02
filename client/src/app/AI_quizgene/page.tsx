"use client";

import React, { useState } from 'react';

// --- SUB-COMPONENTS ---

const ConfigSelect = ({ label, options }: { label: string, options: string[] }) => (
  <div className="flex-1">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer">
      {options.map(opt => <option key={opt}>{opt}</option>)}
    </select>
  </div>
);

export default function AIQuizGenerator() {
  const [progress, setProgress] = useState(45);

  return (
    <div className="min-h-screen bg-[#F0F5FF] p-12 font-sans text-slate-900">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-[#1E293B] mb-2">AI Quiz Generator</h1>
        <p className="text-slate-500 max-w-xl leading-relaxed">
          Upload course materials to generate interactive assessments automatically with the power of LuminAI.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (Main Content) */}
        <div className="col-span-8 space-y-8">
          
          {/* 1. Upload Section */}
          <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="border-2 border-dashed border-slate-200 rounded-[24px] p-12 flex flex-col items-center justify-center group hover:border-blue-400 transition-colors cursor-pointer bg-slate-50/50">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-100">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Drag and drop course materials</h3>
              <p className="text-slate-400 text-sm mb-8 font-medium">Support for PDF, DOCX, and TXT files (Max 20MB)</p>
              <button className="bg-white border border-slate-200 px-8 py-3 rounded-full text-sm font-bold text-slate-700 hover:shadow-md transition-all active:scale-95">
                Browse Files
              </button>
            </div>

            {/* Analysis Progress */}
            <div className="mt-10 px-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-black text-blue-600 italic">Analyzing content...</span>
                <span className="text-sm font-black text-slate-400">{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">Parsing text</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                   <span className="text-[11px] font-bold text-slate-600 italic">Identifying concepts</span>
                </div>
                <div className="flex items-center gap-2 opacity-30">
                   <div className="w-2 h-2 bg-slate-300 rounded-full" />
                   <span className="text-[11px] font-bold text-slate-600">Drafting questions</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Configuration Section */}
          <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
               <span className="text-xl">⚙️</span>
               <h2 className="text-lg font-black text-slate-800 tracking-tight">Quiz Configuration</h2>
            </div>
            <div className="flex gap-6 mb-8">
              <ConfigSelect label="Questions" options={['10 Questions', '20 Questions', '50 Questions']} />
              <ConfigSelect label="Difficulty" options={['Medium', 'Easy', 'Hard']} />
              <ConfigSelect label="Type" options={['Multiple Choice', 'True/False', 'Mix']} />
            </div>
            
            {/* Target Competency Card */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">★</div>
                  <div>
                    <p className="text-xs font-black text-slate-800">Target Competency</p>
                    <p className="text-[10px] text-slate-500 font-medium italic">Recommended passing score for this module: <span className="font-bold text-blue-600">80%</span></p>
                  </div>
               </div>
               <button className="bg-white text-[10px] font-black px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 uppercase tracking-widest text-slate-600">
                  Standard ℹ️
               </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Preview) */}
        <div className="col-span-4 space-y-6">
          
          {/* Preview Canvas */}
          <div className="bg-[#E0E7FF] rounded-[32px] p-8 border border-blue-200/50 flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-24 h-24 bg-white/60 rounded-full mb-6 flex items-center justify-center blur-[1px]">
               <div className="w-16 h-16 bg-white rounded-full shadow-inner" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">Ready to curate?</h3>
            <p className="text-xs text-slate-500 font-medium px-6 leading-relaxed mb-10 italic">
              Your generated questions will appear here for review and editing once the analysis is complete.
            </p>
            <button 
              disabled={progress < 100}
              className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                progress < 100 
                  ? 'bg-slate-300 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95'
              }`}
            >
              ✨ Generate Quiz
            </button>
            <p className="mt-4 text-[10px] font-bold text-slate-400 italic">Available once analysis reaches 100%</p>
          </div>

          {/* Trainer Tip */}
          <div className="bg-[#F1F5F9]/80 border border-slate-200 rounded-2xl p-6">
            <div className="flex gap-4">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-xs font-black text-slate-800 mb-1 uppercase tracking-tighter">Trainer Tip</p>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">
                  For best results, upload documents with clear headings and summary sections. LuminAI excels at identifying learning outcomes from structured text.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}