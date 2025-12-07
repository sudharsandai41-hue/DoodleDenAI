import React, { memo, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { DoodleCard } from '../ui/DoodleCard';

export const MoodBoardNode = memo(({ id, data }: { id: string, data: { label: string, image?: string } }) => {
    const { setNodes } = useReactFlow();

    const onUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const imageUrl = URL.createObjectURL(e.target.files[0]);
            setNodes(nds => nds.map(node => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, image: imageUrl } };
                }
                return node;
            }));
        }
    }, [id, setNodes]);

    return (
        <DoodleCard className="w-80" bgColor="bg-pastel-orange" title="Mood Board" sticker>
            <Handle type="target" position={Position.Left} className="!bg-slate-400 !w-3 !h-3" />

            <div className="p-3 flex flex-col items-center justify-center min-h-[140px] relative group cursor-pointer bg-white/50 rounded-b-xl hover:bg-white/70 transition-colors">
                {/* Hidden File Input */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={onUpload}
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />

                {data.image ? (
                    <div className="relative w-full h-64">
                        <img src={data.image} alt="Mood Board" className="w-full h-full object-contain rounded border-2 border-white shadow-sm" />
                        <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold pointer-events-none rounded">
                            Change Style
                        </div>
                        <div className="absolute -top-2 -right-2 bg-yellow-300 text-black text-[10px] px-2 py-0.5 rounded-full border border-black shadow-sm font-bold rotate-12">
                            STYLE
                        </div>
                    </div>
                ) : (
                    <div className="text-center group-hover:scale-110 transition-transform p-2 border-2 border-dashed border-slate-300 rounded-lg w-full h-full flex flex-col items-center justify-center">
                        <div className="text-3xl mb-1">🖼️</div>
                        <div className="text-xs font-bold text-slate-500">Upload Style</div>
                        <div className="text-[9px] text-slate-400 mt-1 leading-tight">
                            Interior photos,<br />palettes, or vibes
                        </div>
                    </div>
                )}
            </div>

            <Handle type="source" position={Position.Right} className="!bg-brand-blue !w-3 !h-3" />
        </DoodleCard>
    );
});
