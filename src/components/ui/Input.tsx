import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-5 py-4 bg-white border rounded-xl text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-200
          ${error 
            ? 'border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-50/50' 
            : 'border-zinc-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5'
          } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-[11px] font-medium text-rose-500 px-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};
