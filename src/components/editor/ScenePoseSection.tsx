import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles, User } from 'lucide-react';
import { POSE_MOODS, POSE_STANCES } from '../../data/poses';
import { SectionDivider } from '../ui/SectionDivider';
import { useLanguage } from '../../contexts/LanguageContext';

interface ScenePoseSectionProps {
    selectedPoseMood: string;
    setSelectedPoseMood: (val: string) => void;
    selectedPoseStance: string;
    setSelectedPoseStance: (val: string) => void;
    poseDescription: string;
    setPoseDescription: (val: string) => void;
}

export const ScenePoseSection: React.FC<ScenePoseSectionProps> = ({
    selectedPoseMood,
    setSelectedPoseMood,
    selectedPoseStance,
    setSelectedPoseStance,
    poseDescription,
    setPoseDescription
}) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-12">
            <SectionDivider label={t('editor.section_pose_title')} color="emerald" />

            {/* Pose Mood Selection */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 field-label !text-emerald-400">
                    <Sparkles size={14} />
                    {t('editor.pose_mood_label')}
                </div>
                <div className="premium-grid">
                    {POSE_MOODS.map((mood) => {
                        const Icon = mood.icon;
                        const isSelected = selectedPoseMood === mood.id;
                        return (
                            <motion.button
                                key={mood.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedPoseMood(mood.id)}
                                className={`pose-card mood-${mood.id} ${isSelected ? 'selected' : ''}`}
                            >
                                <div className="premium-icon-box !p-2">
                                    <Icon size={18} />
                                </div>
                                <div className="text-center">
                                    <div className="premium-label !text-[9px]">
                                        {t(`editor.pose_mood_presets.${mood.id}` as any)}
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Pose Stance Selection */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 field-label !text-emerald-400">
                    <User size={14} />
                    {t('editor.pose_stance_label')}
                </div>
                <div className="premium-grid">
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
                                        {t(`editor.pose_stance_presets.${stance.id}` as any)}
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Premium Pose Description */}
            <div className="space-y-4 pt-4">
                <div className="field-label !text-emerald-400">
                    <Quote size={12} className="text-emerald-400" /> {t('editor.pose_custom_label')}
                </div>
                <div className="relative group">
                    <textarea
                        placeholder={t('editor.pose_custom_placeholder')}
                        value={poseDescription}
                        onChange={(e) => setPoseDescription(e.target.value)}
                        className="premium-textarea focus:border-emerald-500/50"
                    />
                    <div className="absolute top-4 right-6 text-[10px] font-black text-white/5 group-hover:text-white/10 transition-colors uppercase tracking-[0.2em]">
                        Custom Input
                    </div>
                </div>
            </div>
        </div>
    );
};
