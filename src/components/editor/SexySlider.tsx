import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Info } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SexySliderProps {
    value: number;
    onChange: (value: number) => void;
    isR18Mode: boolean;
    onR18Change: (enabled: boolean) => void;
}

export const SexySlider: React.FC<SexySliderProps> = ({ value, onChange, isR18Mode, onR18Change }) => {
    const { t } = useLanguage();

    return (
        <div className="sexy-slider-container">
            <div className="sexy-slider-header" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <label className="sexy-slider-label" style={{ flex: 1 }}>
                    <Flame size={14} className="icon-orange" />
                    Sexy Level / {t('editor.sexy_level')}
                </label>

                <div className="flex items-center gap-4">
                    <div className="sexy-slider-value-group" style={{ width: '160px', justifyContent: 'flex-end', marginRight: '1rem' }}>
                        <span className={`sexy-slider-number ${value === 10 ? 'level-11-glitch' : ''}`} style={{ textAlign: 'right', display: 'inline-block', minWidth: '80px' }}>
                            {value === 10 ? 'CRITICAL' : value}
                        </span>
                        <span className="sexy-slider-intensity">Intensity {value * 10}%</span>
                    </div>

                    {/* Overdrive Switch - Fixed to Right */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/5 rounded-lg shrink-0" style={{ position: 'relative', width: 'auto', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '8px', fontWeight: 900, color: isR18Mode ? 'var(--magenta)' : 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                                OVERDRIVE_MODE
                            </span>

                            {/* Tooltip Content */}
                            <div className="overdrive-tooltip-container">
                                <Info size={10} className="icon-info-dim" />
                                <div className="overdrive-tooltip-bubble">
                                    <div className="tooltip-glitch-line" />
                                    {t('editor.overdrive_hint')}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onR18Change(!isR18Mode)}
                            style={{
                                width: '32px',
                                height: '16px',
                                borderRadius: '20px',
                                background: isR18Mode ? 'var(--magenta)' : 'rgba(255,255,255,0.1)',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                border: '1px solid rgba(255,255,255,0.1)',
                                flexShrink: 0
                            }}
                        >
                            <motion.div
                                animate={{ x: isR18Mode ? 16 : 0 }}
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: '#fff',
                                    boxShadow: isR18Mode ? '0 0 10px var(--magenta)' : 'none',
                                    position: 'absolute',
                                    top: '1px',
                                    left: '1px'
                                }}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div className={`sexy-slider-track-area ${value >= 9 ? 'sexy-slider-critical-bg' : ''} ${isR18Mode ? 'r18-pulse-bg' : ''}`} style={{ overflow: 'visible' }}>
                {value >= 9 && <div className="placeholder-scan-line" style={{ background: isR18Mode ? 'linear-gradient(90deg, transparent, var(--magenta), transparent)' : 'linear-gradient(90deg, transparent, #f43f5e, transparent)' }} />}
                {/* Track background */}
                <div className="sexy-slider-track-bg" style={{ overflow: 'visible' }}>
                    <motion.div
                        initial={false}
                        animate={{ width: `${(value - 1) / 9 * 100}%` }}
                        className="sexy-slider-track-fill"
                        style={{ backgroundColor: value >= 9 ? (isR18Mode ? 'var(--magenta)' : '#f43f5e') : undefined }}
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
                    className={`sexy-slider-input ${isR18Mode ? 'r18-slider' : ''}`}
                    style={{
                        width: '100%',
                        left: 0,
                    }}
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
                    <span>{t('editor.sexy_hint_low')}</span>
                </div>
                <div className="sexy-slider-hint">
                    <span className="hint-dot" style={{ backgroundColor: '#f43f5e' }} />
                    <span>{t('editor.sexy_hint_mid')}</span>
                </div>
                <div className="sexy-slider-hint">
                    <span className="hint-dot orange" />
                    <span>{t('editor.sexy_hint_high')}</span>
                </div>
            </div>
        </div >
    );
};
