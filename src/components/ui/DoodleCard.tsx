import React from 'react';

interface DoodleCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    bgColor?: string;
    sticker?: boolean;
}

export function DoodleCard({ children, className = '', title, bgColor = 'bg-white', sticker = false }: DoodleCardProps) {
    return (
        <div className={`relative group ${className} ${sticker ? 'hover:scale-[1.02] transition-transform duration-200' : ''}`}>

            {/* Scribble Shadow */}
            <div className={`absolute top-2 left-1 w-full h-full bg-black/10 rounded-doodle transform translate-x-1 translate-y-1 pointer-events-none transition-all duration-300 ${sticker ? 'group-hover:translate-x-2 group-hover:translate-y-2' : ''}`}
                style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}></div>

            {/* Main Card */}
            <div className={`relative border-[3px] border-black ${bgColor} p-4 text-brand-dark 
                ${sticker ? 'ring-4 ring-white' : ''} shadow-sm`}
                style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>

                {title && (
                    <div className="mb-3 border-b-2 border-dashed border-black/20 pb-2 flex items-center gap-2">
                        {/* Random Star Decoration */}
                        <span className="text-pastel-yellow text-xl animate-pulse">★</span>
                        <h3 className="font-hand text-2xl font-bold flex-1">{title}</h3>
                    </div>
                )}

                {children}

                {/* Sticker Shine Effect */}
                {sticker && (
                    <div className="absolute top-2 right-4 w-12 h-4 bg-white/30 rounded-full transform -rotate-12 pointer-events-none" />
                )}
            </div>
        </div>
    );
}
