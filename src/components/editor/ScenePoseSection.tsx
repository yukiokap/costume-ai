import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { User, ChevronLeft, ChevronRight, Edit3, LayoutGrid, Quote } from 'lucide-react';
import { POSE_STANCES } from '../../data/poses';
import { SectionDivider } from '../ui/SectionDivider';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEditor } from '../../contexts/EditorContext';

export const ScenePoseSection: React.FC = () => {
    const { t } = useLanguage();
    const {
        selectedPoseStance, setSelectedPoseStance,
        poseDescription, setPoseDescription
    } = useEditor();

    const stanceRef = useRef<HTMLDivElement>(null);
    const [poseMode, setPoseMode] = useState<'card' | 'text'>(poseDescription ? 'text' : 'card');

    const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (ref.current) {
            const amount = direction === 'left' ? -200 : 200;
            ref.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <SectionDivider label={t('editor.section_pose_title')} color="emerald" />

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPoseMode(poseMode === 'card' ? 'text' : 'card')}
                    className={`mode-toggle-compact mode-emerald ${poseMode === 'card' ? 'active-btn' : ''}`}
                >
                    <div className={`mode-toggle-icon ${poseMode === 'card' ? 'active-icon' : ''}`}>
                        {poseMode === 'card' ? <LayoutGrid size={12} /> : <Edit3 size={12} />}
                    </div>
                    <span className="mode-toggle-label">
                        {poseMode === 'card' ? t('common.mode_preset') : t('common.mode_manual')}
                    </span>
                    <div className="mode-toggle-indicator">
                        <div className={`indicator-dot ${poseMode === 'card' ? 'active' : ''}`} />
                        <div className={`indicator-dot ${poseMode === 'text' ? 'active' : ''}`} />
                    </div>
                </motion.button>
            </div>

            {poseMode === 'card' ? (
                <div className="space-y-6 pt-2">
                    <div className="flex items-center gap-2 field-label !text-emerald-400">
                        <User size={14} />
                        {t('editor.pose_stance_label')}
                    </div>
                    <div className="scroll-nav-container">
                        <button className="scroll-arrow scroll-arrow-left" onClick={() => scroll(stanceRef, 'left')}>
                            <ChevronLeft size={16} />
                        </button>
                        <div className="premium-grid" ref={stanceRef}>
                            {POSE_STANCES.map((stance) => {
                                const Icon = stance.icon;
                                const isSelected = selectedPoseStance === stance.id;
                                return (
                                    <motion.button
                                        key={stance.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedPoseStance(stance.id)}
                                        className={`pose-card stance-${stance.id} ${isSelected ? 'selected' : ''}`}
                                    >
                                        <div className="premium-icon-box !p-2">
                                            <Icon size={18} />
                                        </div>
                                        <div className="text-center">
                                            <div className="premium-label !text-[9px]">
                                                {t(`editor.pose_stance_presets.${stance.id}`)}
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                        <button className="scroll-arrow scroll-arrow-right" onClick={() => scroll(stanceRef, 'right')}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="field-label !text-emerald-400">
                        <Quote size={12} /> {t('editor.pose_custom_label')}
                    </div>
                    <textarea
                        placeholder={t('editor.pose_custom_placeholder')}
                        value={poseDescription}
                        onChange={(e) => setPoseDescription(e.target.value)}
                        className="premium-textarea focus:border-emerald-500/50 min-h-[100px]"
                    />
                </motion.div>
            )}
        </div>
    );
};
