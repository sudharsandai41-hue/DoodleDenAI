import React, { memo, useState, useEffect } from 'react';
import { Handle, Position, useReactFlow, useNodeId, getIncomers, getOutgoers } from '@xyflow/react';
import { DoodleCard } from '../ui/DoodleCard';
import { DoodleButton } from '../ui/DoodleButton';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { generateStyledImage } from '@/lib/generation-service';

const STYLES = [
    // Core Styles
    { id: 'modern', label: 'Modern', color: 'bg-blue-300' },
    { id: 'minimal', label: 'Minimal', color: 'bg-slate-300' },
    { id: 'industrial', label: 'Industrial', color: 'bg-orange-300' },
    { id: 'boho', label: 'Bohemian', color: 'bg-teal-300' },
    { id: 'scandi', label: 'Scandi', color: 'bg-sky-200' },

    // Secondary
    { id: 'cyber', label: 'Cyber', color: 'bg-purple-300' },
    { id: 'luxury', label: 'Luxury', color: 'bg-amber-200' },
    { id: 'rustic', label: 'Rustic', color: 'bg-amber-600' },
    { id: 'zen', label: 'Zen', color: 'bg-emerald-300' },
    { id: 'retro', label: 'Retro', color: 'bg-rose-300' },

    // Special Prompts
    {
        id: 'ats',
        label: 'ATS',
        color: 'bg-rose-400 border-2 border-yellow-300 shadow-sticker',
        value: "Render the empty room exactly as in the reference image with the same architecture. Place the selected furniture items into this room keeping scale, shadows, and consistent daylight. Do not limit or redesign the room structure."
    },
    {
        id: 'pwf',
        label: 'PWF',
        color: 'bg-red-400 border-2 border-white shadow-sticker',
        value: "Do NOT change any architecture, wall shape, wall color, window position, window frame, flooring, ceiling height, or lighting direction. Keep the room structure 100% identical. Now apply the interior style, colors, furniture, textures, décor, and vibe shown in the moodboard. Use the moodboard only for styling inspiration — furniture shapes, fabrics, color palette, décor types, materials, and layout style. Add furniture and décor into the room according to the moodboard vibe. Match the moodboard’s: furniture style, color scheme, materials, décor elements, lighting style, plant types, artwork style. Place all items naturally inside the room, respecting real-world proportions and layout. Keep the original room architecture untouched — only decorate and furnish it. Final output must look ultra-realistic, clean, premium, and consistent with the vibe of the moodboard."
    }
];

// Helper to convert blob URL to Base64
const fileToGenerativePart = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = (reader.result as string).split(',')[1];
            resolve({
                inlineData: {
                    data: base64data,
                    mimeType: blob.type || "image/png"
                }
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

// Hardcoded key moved to generation-service.ts

export const GeneratorNode = memo(({ data }: { data: { label: string } }) => {
    const { getNodes, getEdges, setNodes, getNode } = useReactFlow();
    const nodeId = useNodeId();
    const [isGenerating, setIsGenerating] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [autoPrompt, setAutoPrompt] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [lastDescription, setLastDescription] = useState<string | null>(null);
    const [showSpiral, setShowSpiral] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!nodeId) return;
            const node = getNode(nodeId);
            if (!node) return;

            const nodes = getNodes();
            const edges = getEdges();
            const incomers = getIncomers(node, nodes, edges);
            const roomNode = incomers.find(n => n.type === 'room');
            let moodBoardNode = incomers.find(n => n.type === 'moodboard');

            // Support Chaining: MoodBoard -> Room -> Generator
            if (roomNode && !moodBoardNode) {
                const roomIncomers = getIncomers(roomNode, nodes, edges);
                const indirectMood = roomIncomers.find(n => n.type === 'moodboard');
                if (indirectMood) {
                    moodBoardNode = indirectMood;
                }
            }

            if (roomNode) {
                const hasRoomImage = !!roomNode.data.image;
                const moodItemsCount = (roomNode.data.moodImages as string[] || []).length;
                const hasMoodBoard = moodBoardNode && !!moodBoardNode.data.image;

                let status = "Linked: ";
                if (hasRoomImage) status += "Space + ";
                if (hasMoodBoard) status += "MoodRef + ";
                status += `${moodItemsCount} Stickers`;

                if (status !== autoPrompt) setAutoPrompt(status);
            } else {
                setAutoPrompt(null);
            }

        }, 1000);
        return () => clearInterval(interval);
    }, [nodeId, getNode, getNodes, getEdges, autoPrompt]);

    const handleStyleClick = (style: { label: string, value?: string }) => {
        const textToAdd = style.value || style.label;
        setPrompt(prev => {
            const newText = prev ? `${prev}, ${textToAdd}` : textToAdd;
            return newText;
        });
    };

    const handleGenerate = async () => {
        if (!nodeId) return;
        setIsGenerating(true);

        // Set Loading State in Image Node
        const nodes = getNodes();
        const edges = getEdges();
        const node = getNode(nodeId);
        if (node) {
            const outgoers = getOutgoers(node, nodes, edges);
            outgoers.forEach(outNode => {
                if (outNode.type === 'image') {
                    setNodes(nds => nds.map(n => {
                        if (n.id === outNode.id) {
                            return { ...n, data: { ...n.data, image: 'loading' } };
                        }
                        return n;
                    }));
                }
            });
        }

        try {
            const node = getNode(nodeId);
            if (!node) return;

            const nodes = getNodes();
            const edges = getEdges();
            const incomers = getIncomers(node, nodes, edges);
            const outgoers = getOutgoers(node, nodes, edges);

            // 1. Collect Images
            const roomNode = incomers.find(n => n.type === 'room');
            let moodBoardNode = incomers.find(n => n.type === 'moodboard');

            // Support Chaining: MoodBoard -> Room -> Generator
            if (roomNode && !moodBoardNode) {
                const roomIncomers = getIncomers(roomNode, nodes, edges);
                const indirectMood = roomIncomers.find(n => n.type === 'moodboard');
                if (indirectMood) {
                    moodBoardNode = indirectMood;
                }
            }

            let baseRoomBase64 = '';
            let moodBoardBase64 = '';

            if (roomNode && roomNode.data.image) {
                const part = await fileToGenerativePart(roomNode.data.image as string);
                baseRoomBase64 = part.inlineData.data;
            }

            if (moodBoardNode && moodBoardNode.data.image) {
                const part = await fileToGenerativePart(moodBoardNode.data.image as string);
                moodBoardBase64 = part.inlineData.data;
            }

            if (!baseRoomBase64) {
                throw new Error("No Room Image Found");
            }

            // 2. Call Generation Service
            console.log("Calling Stabilizer Service...");
            const { image, text } = await generateStyledImage(prompt, baseRoomBase64, moodBoardBase64);

            let finalImageUrl = '';

            if (image) {
                // Perfect! We got a direct image from Gemini
                console.log("Gemini returned a direct image!");
                finalImageUrl = image; // Data URL
                setLastDescription("Image generated directly by Gemini Stabilizer ⚡");
            } else if (text) {
                // Fallback: We got text, so we MUST use Pollinations
                console.warn("Gemini returned text only. Falling back to Pollinations...");
                setLastDescription(text);
                const encodedDesc = encodeURIComponent(text.slice(0, 800));
                finalImageUrl = `https://image.pollinations.ai/prompt/${encodedDesc}?width=1024&height=768&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
            } else {
                throw new Error("No output from AI (neither Image nor Text).");
            }

            // 4. Update Image Node
            outgoers.forEach(outNode => {
                if (outNode.type === 'image') {
                    setNodes(nds => nds.map(n => {
                        if (n.id === outNode.id) {
                            return {
                                ...n,
                                data: {
                                    ...n.data,
                                    image: finalImageUrl
                                }
                            };
                        }
                        return n;
                    }));
                }
            });

        } catch (error: any) {
            console.error("Generation failed:", error);
            setErrorMessage(`Error: ${error.message || "Unknown error"}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <DoodleCard title="Magic Wand" className="w-[380px]" bgColor="bg-pastel-mint" sticker>
            <Handle type="target" position={Position.Left} className="!bg-brand-blue !w-4 !h-4 !border-2 !border-black" />

            <div className="space-y-4">

                {/* Auto-Prompt Status */}
                {autoPrompt && (
                    <div className="bg-white/80 text-brand-blue text-[10px] uppercase font-bold font-hand px-2 py-1 rounded-full border-2 border-brand-blue/30 flex items-center gap-1 justify-center shadow-sm">
                        <span>🔗</span> {autoPrompt}
                    </div>
                )}

                {/* Interactive Spiral Catalogue */}
                <div className="relative h-64 border-[3px] border-black rounded-xl bg-white overflow-hidden flex items-center justify-center group"
                    onMouseEnter={() => setShowSpiral(true)}
                    onMouseLeave={() => setShowSpiral(false)}
                >
                    <div className="absolute text-center pointer-events-none z-0">
                        <span className="text-4xl opacity-20 animate-wobble block">🌀</span>
                        <p className="text-xs text-slate-400 mt-2 font-hand font-bold">HOVER FOR MAGIC</p>
                    </div>

                    <AnimatePresence>
                        {showSpiral && STYLES.map((style, i) => {
                            const angle = 0.5 * i * 2.5;
                            const radius = 30 + (i * 8);
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * radius;

                            return (
                                <motion.button
                                    key={style.id}
                                    initial={{ scale: 0, opacity: 0, x: 0, y: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, x, y, rotate: 0 }}
                                    exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                                    transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
                                    onClick={() => handleStyleClick(style)}
                                    className={cn(
                                        "absolute w-12 h-12 rounded-full flex items-center justify-center text-[9px] font-bold text-brand-dark shadow-sticker border-2 border-black z-10 font-hand hover:scale-110 transition-transform",
                                        style.color
                                    )}
                                    title={style.label}
                                >
                                    {style.label}
                                </motion.button>
                            );
                        })}
                    </AnimatePresence>

                    {/* Center Hub */}
                    <motion.div
                        className="absolute w-16 h-16 bg-white rounded-full shadow-lg z-20 flex items-center justify-center border-[3px] border-black"
                        animate={{ scale: showSpiral ? 1 : 1.1 }}
                    >
                        <span className="text-2xl">✨</span>
                    </motion.div>
                </div>

                <div>
                    <label className="text-xs font-bold font-hand text-slate-600 uppercase">Your Imagination</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full text-sm font-hand p-3 border-[3px] border-black/10 rounded-xl bg-white h-24 resize-none focus:outline-none focus:border-brand-blue"
                        placeholder="Pick styles above or type a dream..."
                        spellCheck={false}
                        data-gramm="false"
                        data-gramm_editor="false"
                        data-enable-grammarly="false"
                    />
                </div>

                <DoodleButton
                    onClick={handleGenerate}
                    isLoading={isGenerating}
                    className="w-full !bg-pastel-yellow hover:!bg-yellow-300 !text-xl !py-3"
                >
                    {isGenerating ? 'Weaving Magic...' : 'Bring to Life! ✨'}
                </DoodleButton>

                {/* Error/Status Display */}
                {errorMessage && (
                    <div className="bg-red-100 border-2 border-red-400 p-2 rounded-lg text-red-600 font-hand font-bold text-xs mt-2 break-words text-center">
                        {errorMessage}
                    </div>
                )}

                {/* Debug: Show Generated Description */}
                {!isGenerating && !errorMessage && lastDescription && (
                    <details className="mt-2 text-left" open>
                        <summary className="text-[10px] text-slate-400 font-bold cursor-pointer hover:text-brand-blue">
                            Show AI Vision 👁️
                        </summary>
                        <div className="p-2 bg-slate-100 rounded border border-slate-200 text-[10px] text-slate-600 font-mono mt-1 max-h-32 overflow-y-auto w-full break-words whitespace-pre-wrap">
                            {lastDescription}
                        </div>
                    </details>
                )}
                {!errorMessage && (
                    <div className="text-center font-hand font-bold text-xs mt-2">
                        <span className="text-slate-400 opacity-50">v2.0 Nano Banana Pro</span>
                    </div>
                )}
            </div>
            <Handle type="source" position={Position.Right} className="!bg-pastel-pink !w-4 !h-4 !border-2 !border-black" />
        </DoodleCard>
    );
});
