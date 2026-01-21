import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { EXPRESSION_ARCHETYPES } from '../../data/expressions';
import { SectionDivider } from '../ui/SectionDivider';
import { useLanguage } from '../../contexts/LanguageContext';

interface ExpressionSectionProps {
    selectedExpression: string;
    setSelectedExpression: (val: string) => void;
    expressionDescription: string;
    setExpressionDescription: (val: string) => void;
}

export const ExpressionSection: React.FC<ExpressionSectionProps> = ({
    selectedExpression,
    setSelectedExpression,
    expressionDescription,
    setExpressionDescription
}) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-8">
            <SectionDivider label={t('editor.section_expression_title')} color="orange" />

            {/* Premium Expression Archetype Selection */}
            <div className="space-y-4 pt-4">
                <div className="field-label !text-orange-400">
                    {t('editor.preset_expression_label')}
                </div>
                <div className="expression-compact-grid">
                    {EXPRESSION_ARCHETYPES.map((expr) => {
                        const Icon = expr.icon;
                        const isSelected = selectedExpression === expr.id;
                        return (
                            <motion.button
                                key={expr.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedExpression(expr.id)}
                                className={`expression-card expr-${expr.id} ${isSelected ? 'selected' : ''}`}
                            >
                                <div className="premium-icon-box !p-2">
                                    <Icon size={18} />
                                </div>
                                <div className="text-center">
                                    <div className="premium-label !text-[9px]">
                                        {t(`editor.expression_presets.${expr.id}` as any)}
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Premium Expression Description (Moved to bottom) */}
            <div className="space-y-4 pt-4">
                <div className="field-label !text-orange-400">
                    <Quote size={12} className="text-orange-400" /> {t('editor.expression_custom_label')}
                </div>
                <div className="relative group">
                    <textarea
                        placeholder={t('editor.expression_custom_placeholder')}
                        value={expressionDescription}
                        onChange={(e) => setExpressionDescription(e.target.value)}
                        className="premium-textarea focus:border-orange-500/50"
                    />
                    <div className="absolute top-4 right-6 text-[10px] font-black text-white/5 group-hover:text-white/10 transition-colors uppercase tracking-[0.2em]">
                        Custom Emotion
                    </div>
                </div>
            </div>
        </div>
    );
};
