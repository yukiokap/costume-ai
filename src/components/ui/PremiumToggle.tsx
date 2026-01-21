import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface PremiumToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    icon: LucideIcon;
    color?: 'amber' | 'cyan' | 'white' | 'emerald';
}

export const PremiumToggle: React.FC<PremiumToggleProps> = ({
    label,
    checked,
    onChange,
    icon: Icon,
    color = 'cyan'
}) => {
    const colors = {
        amber: { text: 'text-amber-400', bg: 'bg-amber-400', border: 'border-amber-400', shadow: 'shadow-amber-400/50', hex: '#fbbf24' },
        cyan: { text: 'text-cyan-400', bg: 'bg-cyan-400', border: 'border-cyan-400', shadow: 'shadow-cyan-400/50', hex: '#22d3ee' },
        white: { text: 'text-white', bg: 'bg-white', border: 'border-white', shadow: 'shadow-white/50', hex: '#ffffff' },
        emerald: { text: 'text-emerald-400', bg: 'bg-emerald-400', border: 'border-emerald-400', shadow: 'shadow-emerald-400/50', hex: '#34d399' }
    };

    const c = colors[color];

    return (
        <div
            onClick={() => onChange(!checked)}
            className="flex items-center gap-3 cursor-pointer group select-none"
        >
            {/* Label & Icon Group */}
            <div className={`flex items-center gap-2 transition-colors duration-300 ${checked ? c.text : 'text-white/40 group-hover:text-white/60'}`}>
                <Icon size={16} />
                <span className="text-[10px] font-black tracking-widest uppercase">
                    {label}
                </span>
            </div>

            {/* Switch Track */}
            <div className={`relative w-10 h-5 rounded-full border transition-all duration-300 ${checked ? `${c.border} bg-white/5` : 'border-white/10 bg-black/20'}`}>
                {/* Switch Thumb */}
                <motion.div
                    initial={false}
                    animate={{
                        x: checked ? 20 : 2,
                        backgroundColor: checked ? c.hex : 'rgba(255,255,255,0.3)'
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`absolute top-[1px] left-0 w-4 h-4 rounded-full ${checked ? c.text : 'text-white'}`}
                    style={{
                        boxShadow: checked ? `0 0 10px ${c.hex}` : 'none'
                    }}
                />
            </div>
        </div>
    );
};
