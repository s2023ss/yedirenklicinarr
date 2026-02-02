import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: React.ReactNode;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, onClick, style }) => {
    return (
        <div
            className={`bg-white rounded-[2rem] border border-slate-100 shadow-premium overflow-hidden transition-all duration-300 ${className}`}
            onClick={onClick}
            style={style}
        >
            {title && (
                <div className="px-8 py-6 border-b border-slate-50">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
                </div>
            )}
            <div className="p-8">{children}</div>
        </div>
    );
};
