import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEditor } from '../../contexts/EditorContext';

export const AccessorySlider: React.FC = () => {
    const { t } = useLanguage();
    const { accessoryLevel: value, setAccessoryLevel: onChange, sexyLevel } = useEditor();
    const [showPreview, setShowPreview] = useState(false);

    return (
        <div className="sexy-slider-container">
            <div className="sexy-slider-header" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <label className="sexy-slider-label" style={{ color: '#f59e0b', flex: 1, fontSize: '13px' }}>
                    <Gem size={16} className="icon-orange" style={{ color: '#f59e0b' }} />
                    DECORATIVE_LEVEL / {t('editor.accessory_level')}
                </label>

                <div className="flex items-center gap-4">
                    {/* Unified Preview has been moved to SexySlider or shared area per user request */}

                    <div className="sexy-slider-value-group" style={{ minWidth: '280px', justifyContent: 'flex-end', marginRight: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {value === 10 && (
                                <>
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 15, -15, 0],
                                            opacity: [0.5, 1, 0.5]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        style={{ position: 'absolute', left: '-30px', color: '#fbbf24' }}
                                    >
                                        <Gem size={18} fill="#fbbf24" />
                                    </motion.div>
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            rotate: [0, -20, 20, 0],
                                            opacity: [0.4, 0.8, 0.4]
                                        }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                        style={{ position: 'absolute', right: '-25px', top: '-15px', color: '#f59e0b' }}
                                    >
                                        <Gem size={14} fill="#f59e0b" />
                                    </motion.div>
                                    <motion.div
                                        animate={{
                                            y: [0, -10, 0],
                                            opacity: [0, 1, 0]
                                        }}
                                        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                                        style={{ position: 'absolute', top: '-25px', color: '#fff', fontSize: '10px' }}
                                    >
                                        ✨
                                    </motion.div>
                                </>
                            )}
                            <span
                                className={`sexy-slider-number ${value === 10 ? 'accessory-max-glitter' : ''}`}
                                style={{
                                    textAlign: 'right',
                                    display: 'inline-block',
                                    minWidth: '220px',
                                    fontSize: value === 10 ? '1.8rem' : '1.8rem',
                                    whiteSpace: 'nowrap',
                                    paddingRight: value === 10 ? '10px' : '0',
                                    color: value === 10 ? '#fbbf24' : '#fff',
                                    textShadow: value === 10 ? '0 0 20px rgba(251, 191, 36, 0.6)' : 'none',
                                    fontWeight: 900
                                }}
                            >
                                {value === 10 ? 'ULTRA_JEWEL' : value}
                            </span>
                        </div>
                        <span className="sexy-slider-intensity" style={{ fontSize: '11px', whiteSpace: 'nowrap', opacity: 0.6 }}>INTENSITY {value * 10}%</span>
                    </div>
                </div>
            </div>

            <div className="sexy-slider-track-area">
                <div className="sexy-slider-track-bg">
                    <motion.div
                        initial={false}
                        animate={{ width: `${(value - 1) / 9 * 100}%` }}
                        className="accessory-slider-track-fill"
                    />
                </div>

                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="sexy-slider-input"
                />

                <motion.div
                    initial={false}
                    animate={{ left: `${(value - 1) / 9 * 100}%` }}
                    className="sexy-slider-thumb"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ borderColor: '#f59e0b' }}
                >
                    <div className="sexy-slider-thumb-dot" style={{ backgroundColor: '#f59e0b' }} />
                </motion.div>

                <div className="sexy-slider-steps">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
                        <div key={step} className="sexy-slider-step-item">
                            <div className={`sexy-slider-step-dot ${value >= step ? 'active' : ''}`} />
                            <span className={`sexy-slider-step-label ${value === step ? 'active' : ''}`}>
                                {step}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sexy-slider-footer">
                <div className="sexy-slider-hint">
                    <span className="hint-dot" />
                    <span>{t('editor.accessory_hint_low')}</span>
                </div>
                <div className="sexy-slider-hint">
                    <span className="hint-dot" style={{ backgroundColor: '#fbbf24' }} />
                    <span>{t('editor.accessory_hint_mid')}</span>
                </div>
                <div className="sexy-slider-hint">
                    <span className="hint-dot" style={{ backgroundColor: '#f59e0b' }} />
                    <span>{t('editor.accessory_hint_high')}</span>
                </div>
            </div>
        </div>
    );
};
