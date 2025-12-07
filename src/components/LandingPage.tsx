import React from 'react';
import { DoodleButton } from './ui/DoodleButton';
import { DoodleCard } from './ui/DoodleCard';
import { motion } from 'framer-motion';

interface LandingPageProps {
    onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
    const [userId, setUserId] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleLogin = () => {
        if (userId === 'sudharsan' && password === '1234') {
            onEnter();
        } else {
            setError('Invalid Credentials Doodle!');
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center p-4">

            {/* Floating Background Icons */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top Left Lamp */}
                <div className="absolute top-20 left-20 animate-float-slow" style={{ animationDelay: '0s' }}>
                    <svg width="80" height="80" viewBox="0 0 100 100" className="text-pastel-yellow drop-shadow-sticker fill-current stroke-black stroke-[3px]">
                        <path d="M30,80 L70,80 L60,40 L40,40 Z M50,40 L50,10" fill="none" />
                        <path d="M20,40 Q50,10 80,40" fill="#FFE493" />
                        <line x1="50" y1="80" x2="50" y2="100" stroke="black" strokeWidth="3" />
                        <rect x="40" y="95" width="20" height="5" fill="black" />
                    </svg>
                </div>

                {/* Top Right Sofa */}
                <div className="absolute top-32 right-32 animate-float-slow" style={{ animationDelay: '1.5s' }}>
                    <svg width="100" height="60" viewBox="0 0 100 60" className="text-pastel-blue drop-shadow-sticker fill-current stroke-black stroke-[3px]">
                        <rect x="10" y="20" width="80" height="30" rx="5" fill="#A7CCFF" />
                        <path d="M10,20 Q10,0 25,0 L75,0 Q90,0 90,20" fill="#A7CCFF" />
                        <circle cx="25" cy="35" r="5" fill="#fff" opacity="0.5" />
                        <circle cx="75" cy="35" r="5" fill="#fff" opacity="0.5" />
                    </svg>
                </div>

                {/* Bottom Left Paint Palette */}
                <div className="absolute bottom-20 left-32 animate-float-slow" style={{ animationDelay: '2s' }}>
                    <svg width="90" height="90" viewBox="0 0 100 100" className="text-pastel-pink drop-shadow-sticker fill-current stroke-black stroke-[3px]">
                        <path d="M50,10 Q90,10 90,50 Q90,90 50,90 Q10,90 10,50 Q10,10 50,10" fill="#F7F4EB" />
                        <circle cx="30" cy="35" r="8" fill="#FF8E8E" stroke="none" />
                        <circle cx="50" cy="25" r="8" fill="#B8EED5" stroke="none" />
                        <circle cx="70" cy="35" r="8" fill="#A7CCFF" stroke="none" />
                        <circle cx="25" cy="65" r="8" fill="#FFE493" stroke="none" />
                        <path d="M70,70 Q80,80 60,60" fill="none" stroke="black" strokeWidth="3" />
                    </svg>
                </div>

                {/* Bottom Right Plant */}
                <div className="absolute bottom-40 right-20 animate-float-slow" style={{ animationDelay: '0.5s' }}>
                    <svg width="70" height="90" viewBox="0 0 100 120" className="text-pastel-mint drop-shadow-sticker fill-current stroke-black stroke-[3px]">
                        <path d="M40,100 L60,100 L65,70 L35,70 Z" fill="#FEBA8F" />
                        <path d="M50,70 Q20,20 10,50 Q40,50 50,70" fill="#B8EED5" />
                        <path d="M50,70 Q80,20 90,50 Q60,50 50,70" fill="#B8EED5" />
                        <path d="M50,70 Q50,10 50,40" fill="none" />
                    </svg>
                </div>
            </div>

            {/* Main Content Card */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="z-10"
            >
                <DoodleCard className="max-w-md transform rotate-1 bg-white p-8 text-center" title="">

                    <motion.div
                        animate={{ rotate: [0, 1, 0, -1, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <h1 className="text-5xl font-hand font-bold text-brand-dark mb-4 drop-shadow-[3px_3px_0px_rgba(0,0,0,0.1)]">
                            Doodle<span className="text-brand-blue">Den</span> AI
                        </h1>
                    </motion.div>

                    <p className="font-hand text-xl text-slate-500 mb-6 leading-relaxed">
                        Login to your creative space!
                    </p>

                    <div className="flex flex-col gap-4 max-w-xs mx-auto mb-6">
                        <input
                            type="text"
                            placeholder="Creator ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="font-hand text-lg p-3 border-[3px] border-black/10 rounded-xl focus:border-brand-blue focus:outline-none bg-slate-50"
                        />
                        <input
                            type="password"
                            placeholder="Secret Code"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            className="font-hand text-lg p-3 border-[3px] border-black/10 rounded-xl focus:border-brand-blue focus:outline-none bg-slate-50"
                        />
                    </div>

                    {error && (
                        <div className="mb-4 text-red-500 font-hand font-bold animate-bounce">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-center gap-4">
                        <DoodleButton
                            className="!px-12 !py-3 !text-2xl !bg-pastel-yellow hover:!bg-yellow-300 !border-[3px]"
                            onClick={handleLogin}
                        >
                            Enter Playroom ➜
                        </DoodleButton>
                    </div>

                    {/* Tiny decorative stars */}
                    <div className="absolute top-4 right-4 text-pastel-pink animate-pulse">★</div>
                    <div className="absolute bottom-4 left-4 text-pastel-blue animate-pulse" style={{ animationDelay: '0.5s' }}>★</div>

                </DoodleCard>
            </motion.div>

            <p className="absolute bottom-4 font-hand text-slate-400 text-sm opacity-60">
                v1.0 • Built with ✨ & ✏️
            </p>
        </div>
    );
}
