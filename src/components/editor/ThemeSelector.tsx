import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Heart, Flame, Activity, Shirt, Wand2, Scissors, Music, Ghost, Gem, ChevronLeft, ChevronRight, Tv } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const ThemeSelector = React.memo<{
    selectedTheme: string;
    onChange: (theme: string) => void;
}>(({ selectedTheme, onChange }) => {
    const { t } = useLanguage();
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const amount = direction === 'left' ? -200 : 200;
            scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    const THEMES = [
        { id: 'random', label: t('editor.themes.random'), icon: Sparkles },
        { id: 'cool', label: t('editor.themes.cool'), icon: Moon },
        { id: 'cute', label: t('editor.themes.cute'), icon: Heart },
        { id: 'sexy', label: t('editor.themes.sexy'), icon: Flame },
        { id: 'elegant', label: t('editor.themes.elegant'), icon: Gem },
        { id: 'active', label: t('editor.themes.active'), icon: Activity },
        { id: 'casual', label: t('editor.themes.casual'), icon: Shirt },
        { id: 'fantasy', label: t('editor.themes.fantasy'), icon: Wand2 },
        { id: 'fetish', label: t('editor.themes.fetish'), icon: Scissors },
        { id: 'pop', label: t('editor.themes.pop'), icon: Music },
        { id: 'dark', label: t('editor.themes.dark'), icon: Ghost },
        { id: 'anime', label: t('editor.themes.anime'), icon: Tv },
    ];

    return (
        <div className="space-y-6 mb-12">
            <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-black tracking-[0.3em] text-cyan-400/80 uppercase">
                    THEME_ORIENTATION / {t('editor.theme_label')}
                </label>
            </div>

            <div className="scroll-nav-container">
                <button className="scroll-arrow scroll-arrow-left" onClick={() => scroll('left')}>
                    <ChevronLeft size={16} />
                </button>
                <div className="premium-grid" ref={scrollRef}>
                    {THEMES.map((theme) => {
                        const Icon = theme.icon;
                        const isSelected = selectedTheme === theme.id;

                        return (
                            <motion.button
                                key={theme.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onChange(theme.id)}
                                className={`theme-card theme-${theme.id} ${isSelected ? 'selected' : ''}`}
                            >
                                <div className="premium-icon-box !p-2">
                                    <Icon size={18} />
                                </div>
                                <div className="text-center">
                                    <div className="premium-label !text-[9px]">
                                        {theme.label}
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
                <button className="scroll-arrow scroll-arrow-right" onClick={() => scroll('right')}>
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
});
