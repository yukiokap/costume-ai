import React from 'react';
import { motion } from 'framer-motion';
import { Quote, User, ChevronLeft, ChevronRight, Edit3, LayoutGrid } from 'lucide-react';
import { POSE_STANCES } from '../../data/poses';
import { SectionDivider } from '../ui/SectionDivider';
import { useLanguage } from '../../contexts/LanguageContext';

interface ScenePoseSectionProps {
    selectedPoseStance: string;
    setSelectedPoseStance: (val: string) => void;
    poseDescription: string;
    setPoseDescription: (val: string) => void;
}

export const ScenePoseSection: React.FC<ScenePoseSectionProps> = ({
    selectedPoseStance,
    setSelectedPoseStance,
    poseDescription,
    setPoseDescription
}) => {
    const { t } = useLanguage();
    const stanceRef = React.useRef<HTMLDivElement>(null);
    const [inputMode, setInputMode] = React.useState<'card' | 'text'>('card');
    const [draftText, setDraftText] = React.useState(poseDescription || '');
    const [draftStance, setDraftStance] = React.useState(selectedPoseStance);

    const handleToggleMode = () => {
        if (inputMode === 'text') {
            setDraftText(poseDescription);
            setPoseDescription('');
            setSelectedPoseStance(draftStance);
            setInputMode('card');
        } else {
            setDraftStance(selectedPoseStance);
            setSelectedPoseStance('random');
            setPoseDescription(draftText);
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
                <SectionDivider label={t('editor.section_pose_title')} color="emerald" />

                {/* Enhanced Mode Toggle */}
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 relative overflow-hidden h-[34px] w-[140px]">
                    <motion.div
                        className="absolute top-1 bottom-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30"
                        initial={false}
                        animate={{
                            left: inputMode === 'card' ? '4px' : '72px',
                            right: inputMode === 'card' ? '72px' : '4px'
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                    <button
                        onClick={() => inputMode !== 'card' && handleToggleMode()}
                        className={`flex-1 flex items-center justify-center gap-1.5 z-10 transition-colors ${inputMode === 'card' ? 'text-emerald-400' : 'text-white/40 hover:text-white/60'}`}
                    >
                        <LayoutGrid size={12} />
                        <span className="text-[9px] font-black uppercase tracking-wider">Preset</span>
                    </button>
                    <button
                        onClick={() => inputMode !== 'text' && handleToggleMode()}
                        className={`flex-1 flex items-center justify-center gap-1.5 z-10 transition-colors ${inputMode === 'text' ? 'text-emerald-400' : 'text-white/40 hover:text-white/60'}`}
                    >
                        <Edit3 size={12} />
                        <span className="text-[9px] font-black uppercase tracking-wider">Manual</span>
                    </button>
                </div>
            </div>

            {inputMode === 'card' ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 pt-2"
                >
                    {/* Pose Stance Section */}
                    <div className="space-y-4">
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
                                            onClick={() => {
                                                setSelectedPoseStance(stance.id);
                                                setDraftStance(stance.id);
                                            }}
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
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                >
                    <div className="field-label !text-emerald-400">
                        <Quote size={12} className="text-emerald-400" /> {t('editor.pose_custom_label')}
                    </div>
                    <div className="relative group">
                        <textarea
                            placeholder={t('editor.pose_custom_placeholder')}
                            value={poseDescription}
                            onChange={(e) => {
                                setPoseDescription(e.target.value);
                                setDraftText(e.target.value);
                            }}
                            className="premium-textarea focus:border-emerald-500/50 min-h-[150px]"
                        />
                        <div className="absolute top-4 right-6 text-[10px] font-black text-white/5 group-hover:text-white/10 transition-colors uppercase tracking-[0.2em]">
                            Free Input Mode
                        </div>
                    </div>
                    <p className="text-xs text-emerald-500/50 italic text-right px-2">
                        * Input logic overrides all presets.
                    </p>
                </motion.div>
            )}
        </div>
    );
};
