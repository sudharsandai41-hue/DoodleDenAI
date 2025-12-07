import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ContextMenuProps {
    top: number;
    left: number;
    onSelect: (type: string, subType?: string) => void;
    onClose: () => void;
}

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(({ top, left, onSelect, onClose }, ref) => {
    return (
        <div
            ref={ref}
            style={{ top, left }}
            className="absolute z-50 bg-white rounded-lg shadow-xl border border-slate-200 w-48 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                Add Node
            </div>

            <div className="p-1">
                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-brand-soft hover:text-brand-blue rounded flex items-center gap-2 transition-colors"
                    onClick={() => onSelect('room')}>
                    <span>🏠</span> Room Layout
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-brand-soft hover:text-brand-blue rounded flex items-center gap-2 transition-colors"
                    onClick={() => onSelect('moodboard')}>
                    <span>🎨</span> Mood Board
                </button>

                <div className="my-1 border-t border-slate-100"></div>

                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-brand-soft hover:text-brand-blue rounded flex items-center gap-2 transition-colors"
                    onClick={() => onSelect('furniture', 'sofa')}>
                    <span>🛋️</span> Sofa
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-brand-soft hover:text-brand-blue rounded flex items-center gap-2 transition-colors"
                    onClick={() => onSelect('furniture', 'lamp')}>
                    <span>💡</span> Lamp
                </button>

                <div className="my-1 border-t border-slate-100"></div>

                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-accent-yellow/30 hover:text-orange-600 rounded flex items-center gap-2 transition-colors"
                    onClick={() => onSelect('generator')}>
                    <span>✨</span> AI Generator
                </button>

                <div className="my-1 border-t border-slate-100"></div>

                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded flex items-center gap-2 transition-colors"
                    onClick={() => onSelect('image')}>
                    <span>🖼️</span> Image Viewer
                </button>
            </div>
        </div>
    );
});

ContextMenu.displayName = 'ContextMenu';
