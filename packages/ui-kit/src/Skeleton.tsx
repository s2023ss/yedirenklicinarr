import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    width,
    height,
    variant = 'rectangular',
}) => {
    const baseStyles = 'animate-pulse bg-slate-200';
    const variantStyles = {
        rectangular: 'rounded-md',
        circular: 'rounded-full',
        text: 'rounded h-4 w-full mb-2',
    };

    const style: React.CSSProperties = {
        width: width,
        height: height,
    };

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            style={style}
        />
    );
};
