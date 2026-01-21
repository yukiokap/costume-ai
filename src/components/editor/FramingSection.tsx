import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { FRAMING_ARCHETYPES } from '../../data/framing';
import { SectionDivider } from '../ui/SectionDivider';
import { useLanguage } from '../../contexts/LanguageContext';

interface FramingSectionProps {
    selectedFraming: string;
    setSelectedFraming: (val: string) => void;
    framingDescription: string;
    setFramingDescription: (val: string) => void;
}

export const FramingSection: React.FC<FramingSectionProps> = ({
    selectedFraming,
    setSelectedFraming,
    framingDescription,
    setFramingDescription
}) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-8">
            <SectionDivider label={t('editor.section_framing_title')} color="violet" />

            {/* Premium Framing Archetype Selection */}
            <div className="space-y-4 pt-4">
                <div className="field-label !text-violet-400">
                    {t('editor.preset_framing_label')}
                </div>
                {/* Reusing expression-compact-grid for similar layout, or we can define framing-compact-grid in CSS if size differs.
                    For now, reusing the class or styling inline if needed.
                    Let's use a similar grid class. */}
                <div className="framing-grid">
                    {FRAMING_ARCHETYPES.map((item) => {
                        const Icon = item.icon;
                        const isSelected = selectedFraming === item.id;

                        return (
                            <motion.button
                                key={item.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedFraming(item.id)}
                                className={`framing-card framing-${item.id} ${isSelected ? 'selected' : ''}`}
                            >
                                <div className="premium-icon-box !p-2">
                                    <Icon size={18} />
                                </div>
                                <div className="text-center">
                                    <div className="premium-label !text-[9px]">
                                        {t(`editor.framing_presets.${item.id}` as any)}
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Premium Framing Description */}
            <div className="space-y-4 pt-4">
                <div className="field-label !text-violet-400">
                    <Quote size={12} className="text-violet-400" /> {t('editor.framing_custom_label')}
                </div>
                <div className="relative group">
                    <textarea
                        placeholder={t('editor.framing_custom_placeholder')}
                        value={framingDescription}
                        onChange={(e) => setFramingDescription(e.target.value)}
                        className="premium-textarea focus:border-violet-500/50"
                        style={{ minHeight: '80px' }}
                    />
                    <div className="absolute top-4 right-6 text-[10px] font-black text-white/5 group-hover:text-white/10 transition-colors uppercase tracking-[0.2em]">
                        Custom Framing
                    </div>
                </div>
            </div>
        </div>
    );
};
