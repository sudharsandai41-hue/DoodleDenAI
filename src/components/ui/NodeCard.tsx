import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils'; // We'll need to create utils

export function NodeCard({ children, className, selected }: { children: ReactNode, className?: string, selected?: boolean }) {
    return (
        <div className={cn(
            "bg-white rounded-xl shadow-md border-2 border-slate-200 min-w-[200px] transition-all duration-200",
            selected ? "border-brand-blue ring-2 ring-brand-blue/20" : "hover:border-slate-300",
            className
        )}>
            {children}
        </div>
    );
}

export function NodeHeader({ icon, title, colorClass }: { icon: string, title: string, colorClass: string }) {
    return (
        <div className={cn("px-4 py-2 border-b border-slate-100 flex items-center gap-2 rounded-t-xl", colorClass)}>
            <span className="text-xl">{icon}</span>
            <span className="font-bold text-slate-700 text-sm font-hand">{title}</span>
        </div>
    );
}
