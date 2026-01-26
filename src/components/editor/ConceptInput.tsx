import React from 'react';
import { Quote } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEditor } from '../../contexts/EditorContext';
import { STANDARD_ITEMS } from '../../data/costumes';

export const ConceptInput: React.FC = () => {
    const { t } = useLanguage();
    const { concept: value, setConcept: onChange, remixBase } = useEditor();
    const disabled = !!remixBase;

    const handleRandomIdea = () => {
        if (disabled) return;
        const item = STANDARD_ITEMS[Math.floor(Math.random() * STANDARD_ITEMS.length)];
        if (item) {
            onChange(`${item.jp} (${item.en})`);
        }
    };

    return (
        <div className="space-y-6 mb-12">
            <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-black tracking-[0.3em] text-cyan-400/80 uppercase flex items-center gap-2">
                    <Quote size={12} className="text-cyan-400" /> CONCEPT_VISUALIZATION / {t('editor.concept_label')}
                </label>
                <button
                    onClick={handleRandomIdea}
                    className="idea-dice-btn"
                    disabled={disabled}
                    style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
                >
                    <Quote size={10} style={{ transform: 'rotate(180deg)' }} />
                    RANDOM_IDEA
                </button>
            </div>

            <div className="concept-container">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={t('editor.concept_placeholder')}
                    className="premium-textarea focus:border-cyan-500/50"
                    disabled={disabled}
                    style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'text' }}
                />
            </div>
        </div>
    );
};
