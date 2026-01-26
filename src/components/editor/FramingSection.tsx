import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Maximize, Zap, Edit3, LayoutGrid } from 'lucide-react';
import { SHOT_TYPES, SHOT_ANGLES } from '../../data/framing';
import { SectionDivider } from '../ui/SectionDivider';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEditor } from '../../contexts/EditorContext';

export const FramingSection: React.FC = () => {
    const { t } = useLanguage();
    const {
        selectedShotType, setSelectedShotType,
        selectedShotAngle, setSelectedShotAngle,
        framingDescription, setFramingDescription
    } = useEditor();

    const typeRef = useRef<HTMLDivElement>(null);
    const angleRef = useRef<HTMLDivElement>(null);
    const [inputMode, setInputMode] = useState<'card' | 'text'>(framingDescription ? 'text' : 'card');
    const [draftText, setDraftText] = useState(framingDescription || '');

    // Draft states for framing
    const [draftShot, setDraftShot] = useState(selectedShotType);
    const [draftAngle, setDraftAngle] = useState(selectedShotAngle);

    const handleToggleMode = () => {
        if (inputMode === 'text') {
            setDraftText(framingDescription);
            setFramingDescription('');
            setSelectedShotType(draftShot);
            setSelectedShotAngle(draftAngle);
            setInputMode('card');
        } else {
            setDraftShot(selectedShotType);
            setDraftAngle(selectedShotAngle);
            setSelectedShotType('random'); // or default
            setSelectedShotAngle('random'); // or default

            setFramingDescription(draftText);
            setInputMode('text');
        }
    };

    const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (ref.current) {
            const amount = direction === 'left' ? -200 : 200;
            ref.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <SectionDivider label={t('editor.section_framing_title')} color="violet" />

                {/* Optimized Compact Toggle */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleMode}
                    className={`mode-toggle-compact mode-violet ${inputMode === 'card' ? 'active-btn' : ''}`}
                >
                    <div className={`mode-toggle-icon ${inputMode === 'card' ? 'active-icon' : ''}`}>
                        {inputMode === 'card' ? <LayoutGrid size={12} /> : <Edit3 size={12} />}
                    </div>

                    <span className="mode-toggle-label">
                        {inputMode === 'card' ? t('common.mode_preset') : t('common.mode_manual')}
                    </span>

                    <div className="mode-toggle-indicator">
                        <div className={`indicator-dot ${inputMode === 'card' ? 'active' : ''}`} />
                        <div className={`indicator-dot ${inputMode === 'text' ? 'active' : ''}`} />
                    </div>
                </motion.button>
            </div>

            {inputMode === 'card' ? (
                <div className="space-y-6">
                    {/* Shot Type Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 field-label !text-violet-400">
                            <Maximize size={14} />
                            {t('editor.shot_type_label')}
                        </div>
                        <div className="scroll-nav-container">
                            <button className="scroll-arrow scroll-arrow-left" onClick={() => scroll(typeRef, 'left')}>
                                <ChevronLeft size={16} />
                            </button>
                            <div className="framing-grid" ref={typeRef}>
                                {SHOT_TYPES.map((item) => {
                                    const Icon = item.icon;
                                    const isSelected = selectedShotType === item.id;

                                    return (
                                        <motion.button
                                            key={item.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSelectedShotType(item.id);
                                                setDraftShot(item.id);
                                            }}
                                            className={`framing-card shot-${item.id} ${isSelected ? 'selected' : ''}`}
                                        >
                                            <div className="premium-icon-box !p-2">
                                                <Icon size={18} />
                                            </div>
                                            <div className="text-center">
                                                <div className="premium-label !text-[9px]">
                                                    {t(`editor.shot_type_presets.${item.id}`)}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                            <button className="scroll-arrow scroll-arrow-right" onClick={() => scroll(typeRef, 'right')}>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Shot Angle Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 field-label !text-violet-400">
                            <Zap size={14} />
                            {t('editor.shot_angle_label')}
                        </div>
                        <div className="scroll-nav-container">
                            <button className="scroll-arrow scroll-arrow-left" onClick={() => scroll(angleRef, 'left')}>
                                <ChevronLeft size={16} />
                            </button>
                            <div className="framing-grid" ref={angleRef}>
                                {SHOT_ANGLES.map((item) => {
                                    const Icon = item.icon;
                                    const isSelected = selectedShotAngle === item.id;

                                    return (
                                        <motion.button
                                            key={item.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSelectedShotAngle(item.id);
                                                setDraftAngle(item.id);
                                            }}
                                            className={`framing-card angle-${item.id} ${isSelected ? 'selected' : ''}`}
                                        >
                                            <div className="premium-icon-box !p-2">
                                                <Icon size={18} />
                                            </div>
                                            <div className="text-center">
                                                <div className="premium-label !text-[9px]">
                                                    {t(`editor.shot_angle_presets.${item.id}`)}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                            <button className="scroll-arrow scroll-arrow-right" onClick={() => scroll(angleRef, 'right')}>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4 pt-4"
                >
                    <div className="field-label !text-violet-400">
                        <Quote size={12} className="text-violet-400" /> {t('editor.framing_custom_label')}
                    </div>
                    <div className="relative group">
                        <textarea
                            placeholder={t('editor.framing_custom_placeholder')}
                            value={framingDescription}
                            onChange={(e) => {
                                setFramingDescription(e.target.value);
                                setDraftText(e.target.value);
                            }}
                            className="premium-textarea focus:border-violet-500/50 min-h-[150px]"
                        />
                        <div className="absolute top-4 right-6 text-[10px] font-black text-white/5 group-hover:text-white/10 transition-colors uppercase tracking-[0.2em]">
                            Custom Framing
                        </div>
                    </div>
                    <p className="text-xs text-violet-500/50 italic text-right px-2">
                        * Input logic overrides all presets.
                    </p>
                </motion.div>
            )}
        </div>
    );
};
