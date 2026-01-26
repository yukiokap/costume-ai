import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Edit3, LayoutGrid, Smile } from 'lucide-react';
import { EXPRESSION_ARCHETYPES } from '../../data/expressions';
import { SectionDivider } from '../ui/SectionDivider';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEditor } from '../../contexts/EditorContext';

export const ExpressionSection: React.FC = () => {
    const { t } = useLanguage();
    const {
        selectedExpression, setSelectedExpression,
        expressionDescription, setExpressionDescription
    } = useEditor();

    const scrollRef = useRef<HTMLDivElement>(null);
    const [inputMode, setInputMode] = useState<'card' | 'text'>(expressionDescription ? 'text' : 'card');
    const [draftText, setDraftText] = useState(expressionDescription || '');
    const [draftExpr, setDraftExpr] = useState(selectedExpression);

    const handleToggleMode = () => {
        if (inputMode === 'text') {
            setDraftText(expressionDescription);
            setExpressionDescription('');
            setSelectedExpression(draftExpr);
            setInputMode('card');
        } else {
            setDraftExpr(selectedExpression);
            setSelectedExpression('random');
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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <SectionDivider label={t('editor.section_expression_title')} color="orange" />

                {/* Optimized Compact Toggle */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleMode}
                    className={`mode-toggle-compact mode-orange ${inputMode === 'card' ? 'active-btn' : ''}`}
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
                <div className="space-y-6 pt-2">
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
                </div>
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
