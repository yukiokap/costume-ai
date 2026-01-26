import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Info } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEditor } from '../../contexts/EditorContext';

export const SexySlider: React.FC = () => {
    const { t } = useLanguage();
    const { sexyLevel: value, setSexyLevel: onChange, isR18Mode, setIsR18Mode: onR18Change } = useEditor();
    const [showLaser, setShowLaser] = useState(false);

    useEffect(() => {
        if (isR18Mode) {
            setShowLaser(true);
            const timer = setTimeout(() => setShowLaser(false), 2000);
            return () => clearTimeout(timer);
        } else {
            setShowLaser(false);
        }
    }, [isR18Mode]);

    return (
        <div className="sexy-slider-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
            <AnimatePresence>
                {showLaser && (
                    <motion.div
                        key="overdrive-laser"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="overdrive-laser active"
                    />
                )}
            </AnimatePresence>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        scale: isR18Mode ? [1, 1.1, 1] : [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'relative',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: isR18Mode ? 'radial-gradient(circle, var(--magenta) 0%, transparent 70%)' : 'radial-gradient(circle, var(--cyan) 0%, transparent 70%)',
                            filter: 'blur(4px)',
                            opacity: isR18Mode ? 0.8 : 0.4
                        }}
                    />
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: isR18Mode ? 'var(--magenta)' : 'var(--cyan)',
                        boxShadow: isR18Mode ? '0 0 15px var(--magenta)' : '0 0 10px var(--cyan)',
                        zIndex: 2
                    }} />
                </motion.div>

                <div
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl shrink-0 w-fit transition-all duration-500`}
                    style={{
                        position: 'relative',
                        backgroundColor: isR18Mode ? 'rgba(244, 63, 94, 0.15)' : 'rgba(0, 0, 0, 0.4)',
                        border: `1px solid ${isR18Mode ? 'rgba(244, 63, 94, 0.4)' : 'rgba(255, 255, 255, 0.05)'}`,
                        boxShadow: isR18Mode ? '0 0 20px rgba(244, 63, 94, 0.1)' : 'none'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{
                                fontSize: '13px',
                                fontWeight: 900,
                                color: isR18Mode ? '#f43f5e' : 'rgba(255,255,255,0.4)',
                                letterSpacing: '0.15em',
                                transition: 'color 0.3s'
                            }}>
                                OVERDRIVE_MODE (R18)
                            </span>
                            <span style={{
                                fontSize: '7px',
                                fontWeight: 900,
                                color: isR18Mode ? 'var(--magenta)' : 'rgba(255,255,255,0.2)',
                                letterSpacing: '0.1em',
                                animation: isR18Mode ? 'status-blink 1s infinite' : 'none',
                                marginTop: '1px'
                            }}>
                                [ STATUS: {isR18Mode ? 'UNLOCKED / DANGER' : 'LOCKED / SAFE'} ]
                            </span>
                        </div>

                        <div className="overdrive-tooltip-container">
                            <Info size={12} className={isR18Mode ? "icon-magenta" : "icon-info-dim"} />
                            <div className="overdrive-tooltip-bubble">
                                <div className="tooltip-glitch-line" />
                                {t('editor.overdrive_hint')}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onR18Change(!isR18Mode)}
                        style={{
                            width: '44px',
                            height: '22px',
                            borderRadius: '20px',
                            background: isR18Mode ? '#f43f5e' : 'rgba(255,255,255,0.1)',
                            position: 'relative',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            flexShrink: 0,
                            cursor: 'pointer'
                        }}
                    >
                        <motion.div
                            animate={{ x: isR18Mode ? 22 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: '#fff',
                                boxShadow: isR18Mode ? '0 0 15px rgba(255,255,255,0.8)' : 'none',
                                position: 'absolute',
                                top: '1px',
                                left: '1px'
                            }}
                        />
                    </button>
                </div>
            </div>

            <div className="sexy-slider-header" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                <label className="sexy-slider-label" style={{ flex: 1, fontSize: '13px' }}>
                    <Flame size={16} className="icon-orange" />
                    SEXY_LEVEL / {t('editor.sexy_level')}
                </label>

                <div className="flex items-center gap-4">
                    <div className="sexy-slider-value-group" style={{ minWidth: '280px', justifyContent: 'flex-end', marginRight: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`sexy-slider-number ${value === 10 ? 'level-11-glitch' : ''}`} style={{ textAlign: 'right', display: 'inline-block', minWidth: '150px', fontSize: value === 10 ? '2.2rem' : '1.8rem', whiteSpace: 'nowrap' }}>
                            {value === 10 ? 'CRITICAL' : value}
                        </span>
                        <span className="sexy-slider-intensity" style={{ fontSize: '11px', whiteSpace: 'nowrap', opacity: 0.6 }}>INTENSITY {value * 10}%</span>
                    </div>
                </div>
            </div>

            <div className={`sexy-slider-track-area ${value >= 9 ? 'sexy-slider-critical-bg' : ''} ${isR18Mode ? 'r18-pulse-bg' : ''}`} style={{ overflow: 'visible' }}>
                {value >= 9 && <div className="placeholder-scan-line" style={{ background: isR18Mode ? 'linear-gradient(90deg, transparent, var(--magenta), transparent)' : 'linear-gradient(90deg, transparent, #f43f5e, transparent)' }} />}
                <div className="sexy-slider-track-bg" style={{ overflow: 'visible' }}>
                    <motion.div
                        initial={false}
                        animate={{ width: `${(value - 1) / 9 * 100}%` }}
                        className="sexy-slider-track-fill"
                        style={{ backgroundColor: value >= 9 ? (isR18Mode ? 'var(--magenta)' : '#f43f5e') : undefined }}
                    />
                </div>

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

                <motion.div
                    initial={false}
                    animate={{ left: `${(value - 1) / 9 * 100}%` }}
                    className="sexy-slider-thumb"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <div className="sexy-slider-thumb-dot" />
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
        </div>
    );
};
