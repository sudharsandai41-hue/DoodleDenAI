import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { NodeCard, NodeHeader } from '../ui/NodeCard';
import loadingMascot from '../../assets/loading-mascot.jpg';

export const ImageNode = memo(({ data, selected }: { data: { label: string, image?: string }, selected?: boolean }) => {
    return (
        <>
            <NodeResizer
                color="#3b82f6"
                isVisible={selected}
                minWidth={200}
                minHeight={200}
            />
            <NodeCard className="border-slate-300 shadow-md h-full w-full" selected={selected}>
                <Handle type="target" position={Position.Left} className="!bg-brand-blue !w-3 !h-3" />
                <NodeHeader icon="🖼️" title="Image Viewer" colorClass="bg-slate-100" />
                <div className="p-2 bg-slate-50 flex items-center justify-center relative overflow-hidden group h-[calc(100%-45px)] w-full flex-col">
                    {data.image === 'loading' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-white">
                            {/* Background Sketch Effect */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-400 to-transparent scale-150 animate-pulse" />

                            {/* Animated Mascot Container */}
                            <div className="relative w-32 h-32 overflow-hidden">
                                <div
                                    className="w-full h-full bg-no-repeat bg-contain animate-bounce"
                                    style={{ backgroundImage: `url(${loadingMascot})` }}
                                ></div>
                            </div>

                            <p className="font-hand font-bold text-slate-500 mt-4 animate-pulse">
                                Weaving Magic... ✏️
                            </p>

                            {/* Floating Elements */}
                            <div className="absolute top-10 right-10 text-2xl animate-spin-slow opacity-50">⚙️</div>
                            <div className="absolute bottom-10 left-10 text-xl animate-wobble opacity-50">✨</div>
                        </div>
                    ) : data.image ? (
                        <>
                            <img
                                src={data.image}
                                alt="Generated"
                                className="w-full h-full object-contain rounded-md z-10"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.querySelector('.error-fallback')?.classList.remove('hidden');
                                }}
                            />
                            <div className="error-fallback hidden text-red-400 text-xs text-center p-2 font-bold">
                                ⚠️ Image failed to load.<br />Try generating again.
                                <div className="text-[8px] mt-1 text-slate-400 max-w-[150px] truncate break-all border border-slate-200 p-1 rounded bg-slate-50">
                                    {data.image}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-slate-400">
                            <span className="text-4xl block mb-2 opacity-20">👁️</span>
                            <span className="text-xs">Connect Generator<br />to view result</span>
                        </div>
                    )}
                </div>
            </NodeCard>
        </>
    );
});
