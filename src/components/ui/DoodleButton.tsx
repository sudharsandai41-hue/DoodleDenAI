import React from 'react';

interface DoodleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
}

export function DoodleButton({ children, className = '', variant = 'primary', isLoading, ...props }: DoodleButtonProps) {

    const baseStyles = "relative px-6 py-2 rounded-full font-hand font-bold text-lg border-2 border-black transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:animate-wobble";

    const variants = {
        primary: "bg-accent-blue text-slate-900 hover:bg-brand-blue/80",
        secondary: "bg-white text-slate-900 hover:bg-slate-50",
        danger: "bg-red-200 text-red-900 hover:bg-red-300"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {/* Button Shadow using CSS filter or pseudo element would be cleaner but this works for doodle vibe */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading && (
                    <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {children}
            </span>
        </button>
    );
}
