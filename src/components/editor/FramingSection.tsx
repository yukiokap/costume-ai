import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Maximize, Zap, Edit3, LayoutGrid } from 'lucide-react';
import { SHOT_TYPES, SHOT_ANGLES } from '../../data/framing';
import { SectionDivider } from '../ui/SectionDivider';
import { useLanguage } from '../../contexts/LanguageContext';

interface FramingSectionProps {
    selectedShotType: string;
    setSelectedShotType: (val: string) => void;
    selectedShotAngle: string;
    setSelectedShotAngle: (val: string) => void;
    framingDescription: string;
    setFramingDescription: (val: string) => void;
}

export const FramingSection: React.FC<FramingSectionProps> = ({
    selectedShotType,
    setSelectedShotType,
    selectedShotAngle,
    setSelectedShotAngle,
    framingDescription,
    setFramingDescription
}) => {
    const { t } = useLanguage();
    const typeRef = React.useRef<HTMLDivElement>(null);
    const angleRef = React.useRef<HTMLDivElement>(null);
    const [inputMode, setInputMode] = React.useState<'card' | 'text'>('card');
    const [draftText, setDraftText] = React.useState(framingDescription || '');

    // Draft states for framing
    const [draftShot, setDraftShot] = React.useState(selectedShotType);
    const [draftAngle, setDraftAngle] = React.useState(selectedShotAngle);

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

                {/* Enhanced Mode Toggle */}
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 relative overflow-hidden h-[34px] w-[140px]">
                    <motion.div
                        className="absolute top-1 bottom-1 rounded-lg bg-violet-500/20 border border-violet-500/30"
                        initial={false}
                        animate={{
                            left: inputMode === 'card' ? '4px' : '72px',
                            right: inputMode === 'card' ? '72px' : '4px'
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                    <button
                        onClick={() => inputMode !== 'card' && handleToggleMode()}
                        className={`flex-1 flex items-center justify-center gap-1.5 z-10 transition-colors ${inputMode === 'card' ? 'text-violet-400' : 'text-white/40 hover:text-white/60'}`}
                    >
                        <LayoutGrid size={12} />
                        <span className="text-[9px] font-black uppercase tracking-wider">Preset</span>
                    </button>
                    <button
                        onClick={() => inputMode !== 'text' && handleToggleMode()}
                        className={`flex-1 flex items-center justify-center gap-1.5 z-10 transition-colors ${inputMode === 'text' ? 'text-violet-400' : 'text-white/40 hover:text-white/60'}`}
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
                    className="space-y-6"
                >
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
                </motion.div>
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
