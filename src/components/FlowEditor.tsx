import React, { useCallback, useRef, useState } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    ReactFlowProvider,
    BackgroundVariant,
    Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { RoomNode } from './nodes/RoomNode';
import { FurnitureNode } from './nodes/FurnitureNode';
import { GeneratorNode } from './nodes/GeneratorNode';
import { ImageNode } from './nodes/ImageNode';
import { ContextMenu } from './ui/ContextMenu';
import { DoodleButton } from './ui/DoodleButton';

import { MoodBoardNode } from './nodes/MoodBoardNode';

const nodeTypes = {
    room: RoomNode,
    furniture: FurnitureNode,
    generator: GeneratorNode,
    image: ImageNode,
    moodboard: MoodBoardNode
};

const initialNodes: Node[] = [
    { id: '1', type: 'room', position: { x: 100, y: 100 }, data: { label: 'Living Room' } },
    { id: '2', type: 'generator', position: { x: 600, y: 150 }, data: { label: 'Renderer' } },
];

const initialEdges: Edge[] = [];

let id = 3;
const getId = () => `${id++}`;

export function FlowEditor() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [menu, setMenu] = useState<{ top: number; left: number } | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({
            ...params,
            animated: true,
            style: { stroke: '#72A9FF', strokeWidth: 3, strokeDasharray: '5,5' }
        }, eds)),
        [setEdges],
    );

    const onPaneContextMenu = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();

            // Calculate position relative to container
            const pane = ref.current?.getBoundingClientRect();
            if (pane) {
                setMenu({
                    top: event.clientY - pane.top,
                    left: event.clientX - pane.left,
                });
            }
        },
        [setMenu],
    );

    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);
    const onNodeContextMenu = useCallback((e: React.MouseEvent, node: Node) => {
        e.preventDefault();
        // Ideally show node specific options, for now just block default
    }, []);

    const addNode = useCallback((type: string, subType?: string) => {
        const position = {
            x: menu ? menu.left : 100,
            y: menu ? menu.top : 100
        };

        const newNode: Node = {
            id: getId(),
            type,
            position,
            data: { label: subType ? `${subType}` : type === 'moodboard' ? 'Style Ref' : 'New Node', type: subType }
        };

        setNodes((nds) => nds.concat(newNode));
        setMenu(null);
    }, [menu, setNodes]);

    return (
        <div className="w-full h-screen bg-paper font-sans" ref={ref}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onPaneClick={onPaneClick}
                onPaneContextMenu={onPaneContextMenu}
                onNodeContextMenu={onNodeContextMenu}
                fitView
            >
                <Controls className="!bg-white !border-2 !border-black !shadow-none !rounded-xl overflow-hidden" />
                <MiniMap className="!bg-white !border-2 !border-black !shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] !rounded-xl" />
                <Background variant={BackgroundVariant.Dots} gap={30} size={1} color="#A9CEFF" />

                <Panel position="top-right" className="bg-transparent p-2 flex flex-col gap-2">
                    <DoodleButton className="text-sm py-1 px-4 !bg-pastel-mint hover:!bg-emerald-200" onClick={() => console.log('Save')}>Save Sketch</DoodleButton>
                    <DoodleButton className="text-sm py-1 px-4 !bg-white hover:!bg-slate-100" onClick={() => window.location.reload()}>Start Over</DoodleButton>
                </Panel>

                <Panel position="top-left" className="bg-transparent p-4">
                    <h1 className="text-4xl font-bold font-hand text-brand-dark drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">
                        Doodle<span className="text-brand-blue">Den</span> AI
                    </h1>
                    <p className="text-sm font-hand text-slate-500 font-bold ml-1 transform -rotate-2">Dream it. Sketch it. Build it.</p>
                </Panel>

            </ReactFlow>

            {menu && (
                <ContextMenu
                    top={menu.top}
                    left={menu.left}
                    onSelect={addNode}
                    onClose={() => setMenu(null)}
                />
            )}
        </div>
    );
}

export default function FlowEditorWrapper() {
    return (
        <ReactFlowProvider>
            <FlowEditor />
        </ReactFlowProvider>
    );
}
