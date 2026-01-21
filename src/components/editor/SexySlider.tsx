import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SexySliderProps {
    value: number;
    onChange: (value: number) => void;
}

export const SexySlider: React.FC<SexySliderProps> = ({ value, onChange }) => {
    const { t } = useLanguage();

    return (
        <div className="sexy-slider-container">
            <div className="sexy-slider-header">
                <label className="sexy-slider-label">
                    <Flame size={14} className="icon-orange" />
                    Sexy Level / {t('editor.sexy_level')}
                </label>
                <div className="sexy-slider-value-group">
                    <span className="sexy-slider-number">
                        {value === 10 ? 'MAX' : value}
                    </span>
                    <span className="sexy-slider-intensity">Intensity {value * 10}%</span>
                </div>
            </div>

            <div className="sexy-slider-track-area">
                {/* Track background */}
                <div className="sexy-slider-track-bg">
                    <motion.div
                        initial={false}
                        animate={{ width: `${(value - 1) / 9 * 100}%` }}
                        className="sexy-slider-track-fill"
                    />
                </div>

                {/* Input Slider */}
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="sexy-slider-input"
                />

                {/* Custom Thumb */}
                <motion.div
                    initial={false}
                    animate={{ left: `${(value - 1) / 9 * 100}%` }}
                    className="sexy-slider-thumb"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <div className="sexy-slider-thumb-dot" />
                </motion.div>

                {/* Steps markers */}
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
                    <span>{t('editor.sexy_hint_low' as any)}</span>
                </div>
                <div className="sexy-slider-hint">
                    <span className="hint-dot" style={{ backgroundColor: '#f43f5e' }} />
                    <span>{t('editor.sexy_hint_mid' as any)}</span>
                </div>
                <div className="sexy-slider-hint">
                    <span className="hint-dot orange" />
                    <span>{t('editor.sexy_hint_high' as any)}</span>
                </div>
            </div>
        </div>
    );
};
