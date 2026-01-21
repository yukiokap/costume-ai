import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { POSE_ARCHETYPES } from '../../data/poses';
import { SectionDivider } from '../ui/SectionDivider';
import { useLanguage } from '../../contexts/LanguageContext';

interface ScenePoseSectionProps {
    selectedPose: string;
    setSelectedPose: (val: string) => void;
    poseDescription: string;
    setPoseDescription: (val: string) => void;
}

export const ScenePoseSection: React.FC<ScenePoseSectionProps> = ({
    selectedPose,
    setSelectedPose,
    poseDescription,
    setPoseDescription
}) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-8">
            <SectionDivider label={t('editor.section_pose_title')} color="emerald" />

            {/* Premium Pose Archetype Selection */}
            <div className="space-y-4 pt-4">
                <div className="field-label !text-emerald-400">
                    {t('editor.preset_pose_label')}
                </div>
                <div className="premium-grid">
                    {POSE_ARCHETYPES.map((pose) => {
                        const Icon = pose.icon;
                        const isSelected = selectedPose === pose.id;
                        return (
                            <motion.button
                                key={pose.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedPose(pose.id)}
                                className={`pose-card pose-${pose.id} ${isSelected ? 'selected' : ''}`}
                            >
                                <div className="premium-icon-box !p-2">
                                    <Icon size={18} />
                                </div>
                                <div className="text-center">
                                    <div className="premium-label !text-[9px]">
                                        {t(`editor.pose_presets.${pose.id}` as any)}
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Premium Pose Description (Moved to bottom) */}
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
