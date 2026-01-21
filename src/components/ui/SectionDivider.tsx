import React from 'react';

interface SectionDividerProps {
    label: string;
    color?: 'cyan' | 'amber' | 'violet' | 'orange' | 'emerald';
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ label, color = 'cyan' }) => {
    const colorMap = {
        cyan: { main: '#00f2ff', border: 'rgba(0, 242, 255, 0.2)' },
        amber: { main: '#fbbf24', border: 'rgba(251, 191, 36, 0.2)' },
        violet: { main: '#8b5cf6', border: 'rgba(139, 92, 246, 0.2)' },
        orange: { main: '#f97316', border: 'rgba(249, 115, 22, 0.2)' },
        emerald: { main: '#10b981', border: 'rgba(16, 185, 129, 0.2)' }
    };

    const current = colorMap[color];

    return (
        <div className="section-divider !border-t-0 mt-12 mb-8 flex items-center justify-center relative">
            <div
                className="absolute inset-0 w-full h-[1px] opacity-20"
                style={{ background: `linear-gradient(90deg, transparent, ${current.main}, transparent)` }}
            />
            <span
                className="section-divider-label !static !mt-0 relative z-10 font-black"
                style={{
                    color: current.main,
                    fontSize: '0.9rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textShadow: `0 0 10px ${current.border}`,
                    '--section-color': current.main,
                    '--section-border': current.border,
                    boxShadow: `0 4px 20px rgba(0, 0, 0, 0.8), 0 0 15px ${current.border}`
                } as React.CSSProperties}
            >
                <div
                    className="w-2 h-2 rounded-full mr-2 inline-block"
                    style={{ backgroundColor: current.main, boxShadow: `0 0 10px ${current.main}` }}
                />
                {label}
            </span>
        </div>
    );
};
