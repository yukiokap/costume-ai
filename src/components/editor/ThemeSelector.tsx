import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Heart, Flame, Sun, Gem } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const ThemeSelector = React.memo<{
    selectedTheme: string;
    onChange: (theme: string) => void;
}>(({ selectedTheme, onChange }) => {
    const { t } = useLanguage();

    const THEMES = [
        { id: 'random', label: t('editor.themes.random'), icon: Sparkles },
        { id: 'cool', label: t('editor.themes.cool'), icon: Moon },
        { id: 'cute', label: t('editor.themes.cute'), icon: Heart },
        { id: 'elegant', label: t('editor.themes.elegant'), icon: Gem },
        { id: 'sexy', label: t('editor.themes.sexy'), icon: Flame },
        { id: 'natural', label: t('editor.themes.natural'), icon: Sun },
    ];

    return (
        <div className="space-y-6 mb-12">
            <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-black tracking-[0.3em] text-cyan-400/80 uppercase">
                    THEME_ORIENTATION / {t('editor.theme_label')}
                </label>
            </div>

            <div className="premium-grid">
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
        </div>
    );
});
