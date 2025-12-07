import React, { memo, useCallback, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow, useNodeId, getIncomers } from '@xyflow/react';
import { DoodleCard } from '../ui/DoodleCard';

export const RoomNode = memo(({ id, data }: { id: string, data: { label: string, image?: string, moodImages?: string[] } }) => {
    const { setNodes, getNode, getNodes, getEdges } = useReactFlow();
    const nodeId = useNodeId();
    const [moodImages, setMoodImages] = useState<string[]>([]);

    // Monitor connections to update mood board
    useEffect(() => {
        const interval = setInterval(() => {
            if (!nodeId) return;
            const node = getNode(nodeId);
            if (!node) return;

            const nodes = getNodes();
            const edges = getEdges();
            const incomers = getIncomers(node, nodes, edges);

            const images = incomers
                .filter(n => n.type === 'furniture' && n.data.image)
                .map(n => n.data.image as string);

            setMoodImages(images);

            // Update node data with moodImages for Generator access
            if (JSON.stringify(node.data.moodImages) !== JSON.stringify(images)) {
                setNodes(nds => nds.map(n => {
                    if (n.id === nodeId) {
                        return { ...n, data: { ...n.data, moodImages: images } };
                    }
                    return n;
                }));
            }

        }, 1000);

        return () => clearInterval(interval);
    }, [nodeId, getNode, getNodes, getEdges, setNodes]);


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
        <DoodleCard title="Room Focus" className="w-[300px]" bgColor="bg-pastel-blue" sticker>
            <Handle type="target" position={Position.Left} className="!bg-brand-blue !w-4 !h-4 !border-2 !border-black" />

            <div className="space-y-4">

                {/* Floor Plan / Base Image */}
                <div className="relative group border-[3px] border-dashed border-black/30 rounded-lg h-40 flex items-center justify-center bg-white overflow-hidden hover:bg-white/80 transition-colors">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onUpload}
                        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                    />

                    {data.image ? (
                        <img src={data.image} alt="Room" className="w-full h-full object-contain p-2 filter drop-shadow-sm" />
                    ) : (
                        <div className="text-center text-slate-500 p-2 transform group-hover:scale-110 transition-transform">
                            <span className="text-4xl block mb-2 font-hand">✏️</span>
                            <span className="text-lg font-hand font-bold text-brand-dark">Upload Space</span>
                        </div>
                    )}
                </div>

                {/* Mood Board Preview */}
                {moodImages.length > 0 && (
                    <div className="bg-white/50 p-2 rounded-xl border-2 border-dashed border-black/10">
                        <label className="text-sm font-bold font-hand text-brand-dark mb-2 block">Mood Board Stickers</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {moodImages.map((img, idx) => (
                                <div key={idx} className="w-12 h-12 flex-shrink-0 border-2 border-white shadow-[2px_2px_0px_rgba(0,0,0,0.1)] rounded-lg overflow-hidden bg-white transform hover:-rotate-3 transition-transform">
                                    <img src={img} alt="Item" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-2 font-hand font-bold">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 uppercase">Width (ft)</label>
                        <input type="number" defaultValue={20} className="w-full p-2 border-2 border-black/20 rounded-lg bg-white focus:border-brand-blue outline-none" />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 uppercase">Length (ft)</label>
                        <input type="number" defaultValue={15} className="w-full p-2 border-2 border-black/20 rounded-lg bg-white focus:border-brand-blue outline-none" />
                    </div>
                </div>
            </div>
            <Handle type="source" position={Position.Right} className="!bg-brand-blue !w-4 !h-4 !border-2 !border-black" />
        </DoodleCard>
    );
});
