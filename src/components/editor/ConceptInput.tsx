import React from 'react';
import { Quote, Lock, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEditor } from '../../contexts/EditorContext';
import { STANDARD_ITEMS } from '../../data/costumes';

export const ConceptInput: React.FC = () => {
    const { t } = useLanguage();
    const { concept: value, setConcept: onChange, remixBase, lockCostume, setLockCostume } = useEditor();
    const disabled = !!remixBase && lockCostume;

    const handleRandomIdea = () => {
        if (disabled) return;
        const item = STANDARD_ITEMS[Math.floor(Math.random() * STANDARD_ITEMS.length)];
        if (item) {
            onChange(`${item.jp} (${item.en})`);
        }
    };

    return (
        <div className="space-y-6 mb-12">
            <div className="flex items-center justify-between px-1" id="lock-costume-target">
                <label className="text-[11px] font-black tracking-[0.3em] text-cyan-400/80 uppercase flex items-center gap-2">
                    <Quote size={12} className="text-cyan-400" /> {t('common.language') === 'en' ? 'CONCEPT_VISUALIZATION / ' : ''}{t('editor.concept_label')}
                </label>

                <div className="flex items-center gap-4">
                    {remixBase && (
                        <div
                            className="flex items-center gap-3 px-3 py-1.5 rounded-full transition-all duration-300"
                            style={{
                                backgroundColor: lockCostume ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                border: `1px solid ${lockCostume ? 'rgba(34, 211, 238, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                                boxShadow: lockCostume ? '0 0 10px rgba(34, 211, 238, 0.1)' : 'none'
                            }}
                        >
                            <div className="flex flex-col items-end">
                                <span style={{
                                    fontSize: '9px',
                                    fontWeight: 900,
                                    letterSpacing: '0.1em',
                                    color: lockCostume ? '#22d3ee' : 'rgba(255, 255, 255, 0.4)'
                                }}>
                                    {lockCostume ? t('editor.costume_locked') : t('editor.edit_enabled')}
                                </span>
                            </div>

                            <button
                                onClick={() => setLockCostume(!lockCostume)}
                                style={{
                                    width: '36px',
                                    height: '20px',
                                    borderRadius: '20px',
                                    background: lockCostume ? '#22d3ee' : 'rgba(255, 255, 255, 0.1)',
                                    position: 'relative',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s ease'
                                }}
                            >
                                <motion.div
                                    initial={false}
                                    animate={{ x: lockCostume ? 16 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        background: '#fff',
                                        position: 'absolute',
                                        top: '2px',
                                        left: '2px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {lockCostume ? (
                                        <Lock size={8} className="text-cyan-500" />
                                    ) : (
                                        <Unlock size={8} className="text-gray-400" />
                                    )}
                                </motion.div>
                            </button>
                        </div>
                    )}

                    <button
                        onClick={handleRandomIdea}
                        className="idea-dice-btn"
                        disabled={disabled}
                        style={{ opacity: disabled ? 0.3 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
                    >
                        <Quote size={10} style={{ transform: 'rotate(180deg)' }} />
                        {t('editor.random_idea')}
                    </button>
                </div>
            </div>

            <div className="concept-container">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={t('editor.concept_placeholder')}
                    className={`premium-textarea focus:border-cyan-500/50 ${lockCostume && remixBase ? 'opacity-50' : ''}`}
                    disabled={disabled}
                    style={{ cursor: disabled ? 'not-allowed' : 'text' }}
                />
                {remixBase && lockCostume && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 px-4 py-2 rounded-lg flex items-center gap-2 text-cyan-400">
                            <Lock size={14} />
                            <span className="text-[10px] font-bold tracking-widest">COSTUME LOCKED FOR REMIX</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
