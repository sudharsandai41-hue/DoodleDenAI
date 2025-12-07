import React, { memo, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { NodeCard, NodeHeader } from '../ui/NodeCard';

export const FurnitureNode = memo(({ id, data }: { id: string, data: { label: string, type: string, image?: string } }) => {
    const { setNodes } = useReactFlow();

    const onUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const imageUrl = URL.createObjectURL(e.target.files[0]);
            // Update node data with image
            setNodes(nds => nds.map(node => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, image: imageUrl } };
                }
                return node;
            }));
        }
    }, [id, setNodes]);

    return (
        <NodeCard className="border-brand-dark/20 w-40">
            <Handle type="target" position={Position.Left} className="!bg-slate-400 !w-3 !h-3" />
            <NodeHeader icon="🪑" title={data.label || 'Furniture'} colorClass="bg-accent-yellow/20" />

            <div className="p-2 flex flex-col items-center justify-center min-h-[100px] relative group cursor-pointer">
                {/* Hidden File Input */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={onUpload}
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />

                {data.image ? (
                    <div className="relative w-full h-24">
                        <img src={data.image} alt="Furniture" className="w-full h-full object-contain rounded" />
                        <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold pointer-events-none">
                            Change
                        </div>
                    </div>
                ) : (
                    <div className="text-center group-hover:scale-110 transition-transform">
                        <div className="text-4xl">{data.type === 'sofa' ? '🛋️' : data.type === 'lamp' ? '💡' : '📦'}</div>
                        <div className="text-[10px] text-slate-400 mt-1">Click to Upload</div>
                    </div>
                )}
            </div>

            <Handle type="source" position={Position.Right} className="!bg-brand-blue !w-3 !h-3" />
        </NodeCard>
    );
});
