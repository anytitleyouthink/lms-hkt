import React from "react";

interface LoginInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const LoginInput = ({ label, ...props }: LoginInputProps) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-[#2b3674] uppercase tracking-[0.2em] ml-1">
            {label} <span className="text-blue-500">*</span>
        </label>
        <input
            {...props}
            className="w-full h-14 px-5 rounded-2xl bg-white border border-[#e0e5f2] text-[#2b3674] font-bold placeholder:text-[#a3aed0] focus:outline-none focus:border-[#4318ff] transition-all"
        />
    </div>
);