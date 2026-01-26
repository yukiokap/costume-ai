import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Edit3, LayoutGrid, Zap, Check } from 'lucide-react';
import { SectionDivider } from '../ui/SectionDivider';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEditor } from '../../contexts/EditorContext';

export const SceneSection: React.FC = () => {
    const { t } = useLanguage();
    const {
        selectedScene, setSelectedScene,
        sceneDescription, setSceneDescription
    } = useEditor();

    const [inputMode, setInputMode] = useState<'card' | 'text'>(sceneDescription ? 'text' : 'card');
    const [draftText, setDraftText] = useState(sceneDescription || '');
    const [draftScene, setDraftScene] = useState(selectedScene);

    const handleToggleMode = () => {
        if (inputMode === 'text') {
            setDraftText(sceneDescription);
            setSceneDescription('');
            setSelectedScene(draftScene);
            setInputMode('card');
        } else {
            setDraftScene(selectedScene);
            setSelectedScene('random');
            setSceneDescription(draftText);
            setInputMode('text');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <SectionDivider label={t('editor.section_scene_title') || '05: 背景の設定'} color="cyan" />

                {/* Optimized Compact Toggle */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleMode}
                    className={`mode-toggle-compact mode-cyan ${inputMode === 'card' ? 'active-btn' : ''}`}
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
                <div className="premium-grid !flex-row !flex-nowrap !overflow-visible !justify-start pt-2">
                    {/* Auto (Random) */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedScene('random')}
                        className={`pose-card ${selectedScene === 'random' ? 'selected' : ''}`}
                    >
                        <div className="premium-icon-box !p-2 !bg-cyan-500/20">
                            <Zap size={18} className="text-cyan-400" />
                        </div>
                        <div className="text-center">
                            <div className="premium-label !text-[9px]">
                                {t('editor.themes.random')}
                            </div>
                        </div>
                    </motion.button>

                    {/* White Background */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedScene('white')}
                        className={`pose-card ${selectedScene === 'white' ? 'selected' : ''}`}
                    >
                        <div className="premium-icon-box !p-2 !bg-white/10 !text-white">
                            <Check size={18} />
                        </div>
                        <div className="text-center">
                            <div className="premium-label !text-[9px]">
                                {t('editor.background_white')}
                            </div>
                        </div>
                    </motion.button>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4 pt-4"
                >
                    <div className="field-label !text-cyan-400">
                        <Quote size={12} className="text-cyan-400" /> {t('editor.scene_custom_label')}
                    </div>
                    <div className="relative group">
                        <textarea
                            placeholder={t('editor.scene_custom_placeholder')}
                            value={sceneDescription}
                            onChange={(e) => {
                                setSceneDescription(e.target.value);
                                setDraftText(e.target.value);
                            }}
                            className="premium-textarea focus:border-cyan-500/50 min-h-[150px]"
                        />
                        <div className="absolute top-4 right-6 text-[10px] font-black text-white/5 group-hover:text-white/10 transition-colors uppercase tracking-[0.2em]">
                            Custom Scenery
                        </div>
                    </div>
                    <p className="text-xs text-cyan-500/50 italic text-right px-2">
                        * Input logic overrides all presets.
                    </p>
                </motion.div>
            )}
        </div>
    );
};
