import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Edit3, LayoutGrid, Zap, Smile, Heart, Flame, Coffee, Star, Ghost, Shield, Sparkles, type LucideIcon } from 'lucide-react';
import { EXPRESSION_ARCHETYPES } from '../../data/expressions';
import { SectionDivider } from '../ui/SectionDivider';
import { useLanguage } from '../../contexts/LanguageContext';

interface ExpressionSectionProps {
    selectedPoseMood: string;
    setSelectedPoseMood: (val: string) => void;
    selectedExpression: string;
    setSelectedExpression: (val: string) => void;
    expressionDescription: string;
    setExpressionDescription: (val: string) => void;
}

const MOOD_ICONS: Record<string, LucideIcon> = {
    random: Zap,
    energetic: Sparkles,
    cool: Ghost,
    cute: Heart,
    sexy: Flame,
    natural: Coffee,
    elegant: Star,
    shy: Smile,
    heroic: Shield
};

export const ExpressionSection: React.FC<ExpressionSectionProps> = ({
    selectedPoseMood,
    setSelectedPoseMood,
    selectedExpression,
    setSelectedExpression,
    expressionDescription,
    setExpressionDescription
}) => {
    const { t } = useLanguage();
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const moodRef = React.useRef<HTMLDivElement>(null);
    const [inputMode, setInputMode] = React.useState<'card' | 'text'>('card');
    const [draftText, setDraftText] = React.useState(expressionDescription || '');
    const [draftExpr, setDraftExpr] = React.useState(selectedExpression);
    const [draftMood, setDraftMood] = React.useState(selectedPoseMood);

    const handleToggleMode = () => {
        if (inputMode === 'text') {
            setDraftText(expressionDescription);
            setExpressionDescription('');
            setSelectedExpression(draftExpr);
            setSelectedPoseMood(draftMood);
            setInputMode('card');
        } else {
            setDraftExpr(selectedExpression);
            setDraftMood(selectedPoseMood);
            setSelectedExpression('random');
            setSelectedPoseMood('random');
            setExpressionDescription(draftText);
            setInputMode('text');
        }
    };

    const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (ref.current) {
            const amount = direction === 'left' ? -200 : 200;
            ref.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    const poseMoods = ['random', 'energetic', 'cool', 'cute', 'sexy', 'natural', 'elegant', 'shy', 'heroic'];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <SectionDivider label={t('editor.section_expression_title')} color="orange" />

                {/* Enhanced Mode Toggle */}
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 relative overflow-hidden h-[34px] w-[140px]">
                    <motion.div
                        className="absolute top-1 bottom-1 rounded-lg bg-orange-500/20 border border-orange-500/30"
                        initial={false}
                        animate={{
                            left: inputMode === 'card' ? '4px' : '72px',
                            right: inputMode === 'card' ? '72px' : '4px'
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                    <button
                        onClick={() => inputMode !== 'card' && handleToggleMode()}
                        className={`flex-1 flex items-center justify-center gap-1.5 z-10 transition-colors ${inputMode === 'card' ? 'text-orange-400' : 'text-white/40 hover:text-white/60'}`}
                    >
                        <LayoutGrid size={12} />
                        <span className="text-[9px] font-black uppercase tracking-wider">Preset</span>
                    </button>
                    <button
                        onClick={() => inputMode !== 'text' && handleToggleMode()}
                        className={`flex-1 flex items-center justify-center gap-1.5 z-10 transition-colors ${inputMode === 'text' ? 'text-orange-400' : 'text-white/40 hover:text-white/60'}`}
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
                    className="space-y-10 pt-2"
                >
                    {/* Pose Mood Section (Integrated) */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 field-label !text-orange-400">
                            <Zap size={14} />
                            {t('editor.pose_mood_label')}
                        </div>
                        <div className="scroll-nav-container">
                            <button className="scroll-arrow scroll-arrow-left" onClick={() => scroll(moodRef, 'left')}>
                                <ChevronLeft size={16} />
                            </button>
                            <div className="premium-grid" ref={moodRef}>
                                {poseMoods.map((mood) => {
                                    const Icon = MOOD_ICONS[mood] || Zap;
                                    const isSelected = selectedPoseMood === mood;
                                    return (
                                        <motion.button
                                            key={mood}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSelectedPoseMood(mood);
                                                setDraftMood(mood);
                                            }}
                                            className={`pose-card mood-${mood} ${isSelected ? 'selected' : ''}`}
                                        >
                                            <div className="premium-icon-box !p-2">
                                                <Icon size={18} />
                                            </div>
                                            <div className="text-center">
                                                <div className="premium-label !text-[9px]">
                                                    {t(`editor.pose_mood_presets.${mood}`)}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                            <button className="scroll-arrow scroll-arrow-right" onClick={() => scroll(moodRef, 'right')}>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 field-label !text-orange-400">
                            <Smile size={14} />
                            {t('editor.preset_expression_label')}
                        </div>
                        <div className="scroll-nav-container">
                            <button className="scroll-arrow scroll-arrow-left" onClick={() => scroll(scrollRef, 'left')}>
                                <ChevronLeft size={16} />
                            </button>
                            <div className="expression-compact-grid" ref={scrollRef}>
                                {EXPRESSION_ARCHETYPES.map((expr) => {
                                    const Icon = expr.icon;
                                    const isSelected = selectedExpression === expr.id;
                                    return (
                                        <motion.button
                                            key={expr.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSelectedExpression(expr.id);
                                                setDraftExpr(expr.id);
                                            }}
                                            className={`expression-card expr-${expr.id} ${isSelected ? 'selected' : ''}`}
                                        >
                                            <div className="premium-icon-box !p-2">
                                                <Icon size={18} />
                                            </div>
                                            <div className="text-center">
                                                <div className="premium-label !text-[9px]">
                                                    {t(`editor.expression_presets.${expr.id}`)}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                            <button className="scroll-arrow scroll-arrow-right" onClick={() => scroll(scrollRef, 'right')}>
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
                    <div className="field-label !text-orange-400">
                        <Quote size={12} className="text-orange-400" /> {t('editor.expression_custom_label')}
                    </div>
                    <div className="relative group">
                        <textarea
                            placeholder={t('editor.expression_custom_placeholder')}
                            value={expressionDescription}
                            onChange={(e) => {
                                setExpressionDescription(e.target.value);
                                setDraftText(e.target.value);
                            }}
                            className="premium-textarea focus:border-orange-500/50 min-h-[150px]"
                        />
                        <div className="absolute top-4 right-6 text-[10px] font-black text-white/5 group-hover:text-white/10 transition-colors uppercase tracking-[0.2em]">
                            Custom Concept
                        </div>
                    </div>
                    <p className="text-xs text-orange-500/50 italic text-right px-2">
                        * Input logic overrides all presets.
                    </p>
                </motion.div>
            )}
        </div>
    );
};
