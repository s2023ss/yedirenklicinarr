import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1 block">
                    {label}
                </label>
            )}
            <input
                className={`block w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500/50 focus:ring-0 transition-all outline-none font-bold placeholder:text-slate-300 ${error ? 'border-red-100 bg-red-50 text-red-600' : 'text-slate-700'
                    } ${className}`}
                {...props}
            />
            {error && <p className="mt-1.5 text-xs font-bold text-red-500 pl-1">{error}</p>}
        </div>
    );
};
