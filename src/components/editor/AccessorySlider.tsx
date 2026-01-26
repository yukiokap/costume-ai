import React from 'react';
import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEditor } from '../../contexts/EditorContext';

export const AccessorySlider: React.FC = () => {
    const { t } = useLanguage();
    const { accessoryLevel: value, setAccessoryLevel: onChange } = useEditor();

    return (
        <div className="sexy-slider-container">
            <div className="sexy-slider-header" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <label className="sexy-slider-label" style={{ color: '#f59e0b', flex: 1, fontSize: '13px' }}>
                    <Gem size={16} className="icon-orange" style={{ color: '#f59e0b' }} />
                    DECORATIVE_LEVEL / {t('editor.accessory_level')}
                </label>

                <div className="sexy-slider-value-group" style={{ minWidth: '280px', justifyContent: 'flex-end', marginRight: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="sexy-slider-number" style={{ textAlign: 'right', display: 'inline-block', minWidth: '150px', fontSize: value === 10 ? '2.2rem' : '1.8rem', whiteSpace: 'nowrap' }}>
                        {value === 10 ? 'MAX' : value}
                    </span>
                    <span className="sexy-slider-intensity" style={{ fontSize: '11px', whiteSpace: 'nowrap', opacity: 0.6 }}>INTENSITY {value * 10}%</span>
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
