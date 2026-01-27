import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Info, Heart, Eye, Sparkles, Zap, Lock, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEditor } from '../../contexts/EditorContext';

const HeartbeatWave: React.FC<{ intensity: number; isR18: boolean }> = ({ intensity, isR18 }) => {
    const color = isR18 ? '#ff00ff' : '#f43f5e';
    // Smooth transition of speed and height based on intensity
    const duration = intensity === 3 ? 0.8 : (intensity === 2 ? 1.5 : 2.5);
    const scaleY = intensity === 3 ? 1.5 : (intensity === 2 ? 1.0 : 0.5);

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            zIndex: 1,
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}>
            <motion.div
                style={{ display: 'flex', width: '200%', height: '100%', alignItems: 'center' }}
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration, repeat: Infinity, ease: "linear" }}
            >
                {[1, 2].map((i) => (
                    <svg key={i} viewBox="0 0 200 60" preserveAspectRatio="none" style={{ width: '50%', height: '100%', overflow: 'visible' }}>
                        <motion.path
                            d="M 0 30 L 40 30 L 45 25 L 50 30 L 55 30 L 60 5 L 65 55 L 70 30 L 75 30 L 80 35 L 85 30 L 125 30 L 130 25 L 135 30 L 140 30 L 145 0 L 150 60 L 155 30 L 160 30 L 165 35 L 170 30 L 200 30"
                            fill="none"
                            stroke={color}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ scaleY: 0.6 }}
                            animate={{ scaleY }}
                            style={{
                                filter: `drop-shadow(0 0 8px ${color})`,
                                transformOrigin: 'center'
                            }}
                        />
                    </svg>
                ))}
            </motion.div>
        </div>
    );
};

export const SexySlider: React.FC = () => {
    const { t } = useLanguage();
    const { sexyLevel: value, setSexyLevel: onChange, setAccessoryLevel: onAccChange, isR18Mode, setIsR18Mode: onR18Change } = useEditor();
    const [showLaser, setShowLaser] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [selectedSample, setSelectedSample] = useState<any>(null);

    useEffect(() => {
        if (isR18Mode) {
            setShowLaser(true);
            const timer = setTimeout(() => setShowLaser(false), 2000);
            return () => clearTimeout(timer);
        } else {
            setShowLaser(false);
        }
    }, [isR18Mode]);

    const normalSamples = [
        { id: 'base', label: 'NORMAL', sexy: 1, accessory: 1, img: "/samples/sexy_level_1.jpg", color: 'var(--cyan)', r18: false },
        { id: 'sexy_max', label: 'SEXY MAX', sexy: 10, accessory: 1, img: "/samples/sexy_level_10.jpg", color: '#f43f5e', r18: false },
        { id: 'deco_max', label: 'DECO MAX', sexy: 1, accessory: 10, img: "/samples/accessory_level_10_sexy_1.jpg", color: '#fbbf24', r18: false },
        { id: 'ultra_max', label: 'ULTRA MAX', sexy: 10, accessory: 10, img: "/samples/sexy_10_accessory_10.jpg", color: '#ff00ff', r18: false },
    ];

    const r18Samples = [
        { id: 'r18_start', label: 'R18 START', sexy: 1, accessory: 1, img: "/samples/sexy_1_accessory_1_r18.jpg", color: '#f43f5e', r18: true },
        { id: 'r18_sexy', label: 'R18 SEXY', sexy: 10, accessory: 1, img: "/samples/sexy_10_accessory_1_r18.jpg", color: '#f43f5e', r18: true },
        { id: 'r18_deco', label: 'R18 DECO', sexy: 1, accessory: 10, img: "/samples/sexy_1_accessory_10_r18.jpg", color: '#fbbf24', r18: true },
        { id: 'r18_ultra', label: 'R18 OVERDRIVE', sexy: 10, accessory: 10, img: "/samples/sexy_10_accessory_10_r18.jpg", color: '#ff00ff', r18: true },
    ];

    const handleApplySample = (sample: any) => {
        setSelectedSample(sample);
    };

    const confirmApplySample = () => {
        if (!selectedSample) return;
        onChange(selectedSample.sexy);
        onAccChange(selectedSample.accessory);
        if (selectedSample.r18 !== isR18Mode) {
            onR18Change(selectedSample.r18);
        }
        setSelectedSample(null);
        setShowPreview(false);
    };


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

            {/* Enlarged Modal Overlay (Full Sample Gallery) */}
            {createPortal(
                <AnimatePresence>
                    {showPreview && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                                zIndex: 10000,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px',
                                backdropFilter: 'blur(20px)'
                            }}
                            onClick={() => setShowPreview(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (selectedSample) setSelectedSample(null);
                                }}
                                style={{
                                    width: '100%',
                                    maxWidth: '1000px',
                                    maxHeight: '95vh',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    overflowY: 'auto',
                                    padding: '20px',
                                    position: 'relative',
                                    margin: 'auto'
                                }}
                            >
                                <button
                                    onClick={() => setShowPreview(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        zIndex: 10,
                                        color: '#fff',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                >
                                    <X size={24} />
                                </button>

                                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <Sparkles color="#fbbf24" size={24} />
                                        <h3 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '0.25em', color: '#fff', textTransform: 'uppercase' }}>
                                            {t('editor.visual_presets.subtitle')}
                                        </h3>
                                        <Sparkles color="#fbbf24" size={24} />
                                    </div>



                                    {/* Generation Settings (Recipe) */}
                                    <div style={{ textAlign: 'left', marginLeft: '5px', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '11px', fontWeight: 900, color: '#f0abfc', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '12px', height: '2px', backgroundColor: '#f0abfc', borderRadius: '1px' }} />
                                            {t('editor.visual_presets.recipe_title')}
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                                        gap: '8px',
                                        marginBottom: '20px',
                                        padding: '0 5px'
                                    }}>
                                        {[
                                            { label: t('editor.visual_presets.label_costume'), value: t('editor.visual_presets.val_random'), icon: '🎲' },
                                            { label: t('editor.visual_presets.label_concept'), value: t('editor.visual_presets.val_autumn'), icon: '🍂' },
                                            { label: t('editor.visual_presets.label_pose'), value: t('editor.visual_presets.val_random'), icon: '💃' },
                                            { label: t('editor.visual_presets.label_expression'), value: t('editor.visual_presets.val_random'), icon: '😊' },
                                            { label: t('editor.visual_presets.label_framing'), value: t('editor.visual_presets.val_upper_front'), icon: '📐' },
                                            { label: t('editor.visual_presets.label_scene'), value: t('editor.visual_presets.val_white_bg'), icon: '⬜' },
                                        ].map((item, idx) => (
                                            <div key={idx} style={{
                                                backgroundColor: 'rgba(255,255,255,0.03)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                padding: '8px 10px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '4px'
                                            }}>
                                                <div style={{ fontSize: '9px', fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                                                    {item.icon} {item.label}
                                                </div>
                                                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--cyan)' }}>
                                                    {item.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 1: Standard Styles */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem', paddingLeft: '5px' }}>
                                        <div style={{ width: '4px', height: '16px', backgroundColor: 'var(--cyan)', borderRadius: '2px' }} />
                                        <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--cyan)', letterSpacing: '0.2em' }}>{t('editor.visual_presets.standard_styles')}</span>
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                        gap: '0.8rem'
                                    }}>
                                        {normalSamples.map((sample) => (
                                            <motion.div
                                                key={sample.id}
                                                whileHover={{ y: -8, scale: 1.02 }}
                                                onClick={() => handleApplySample(sample)}
                                                style={{
                                                    backgroundColor: 'rgba(255,255,255,0.02)',
                                                    borderRadius: '16px',
                                                    overflow: 'hidden',
                                                    border: `2px solid ${sample.color}33`,
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
                                                    aspectRatio: '3/4.5'
                                                }}
                                            >
                                                <img src={sample.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={sample.label} />
                                                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)` }} />
                                                <div style={{ position: 'absolute', bottom: '0.8rem', width: '100%', textAlign: 'center', padding: '0 8px' }}>
                                                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#fff', backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px 0', borderRadius: '8px', border: `1px solid ${sample.color}66` }}>
                                                        SEXY: {sample.sexy} / JEWEL: {sample.accessory}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 2: Overdrive Styles (R18) */}
                                <div style={{ position: 'relative' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem', paddingLeft: '5px' }}>
                                        <div style={{ width: '4px', height: '16px', backgroundColor: '#f43f5e', borderRadius: '2px' }} />
                                        <span style={{ fontSize: '11px', fontWeight: 900, color: '#f43f5e', letterSpacing: '0.2em' }}>{t('editor.visual_presets.overdrive_styles')}</span>
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                        gap: '0.8rem',
                                        position: 'relative'
                                    }}>
                                        {r18Samples.map((sample) => (
                                            <motion.div
                                                key={sample.id}
                                                whileHover={isR18Mode ? { y: -8, scale: 1.02 } : {}}
                                                onClick={() => isR18Mode && handleApplySample(sample)}
                                                style={{
                                                    backgroundColor: 'rgba(244, 63, 94, 0.05)',
                                                    borderRadius: '16px',
                                                    overflow: 'hidden',
                                                    border: `2px solid ${isR18Mode ? 'rgba(244, 63, 94, 0.4)' : 'rgba(255,255,255,0.05)'}`,
                                                    cursor: isR18Mode ? 'pointer' : 'default',
                                                    position: 'relative',
                                                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                                                    boxShadow: isR18Mode ? '0 8px 25px rgba(244, 63, 94, 0.2)' : 'none',
                                                    aspectRatio: '3/4.5',
                                                    filter: isR18Mode ? 'none' : 'blur(4px) grayscale(0.2)'
                                                }}
                                            >
                                                <img src={sample.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={sample.label} />
                                                {isR18Mode && (
                                                    <>
                                                        <div style={{ position: 'absolute', bottom: '0.8rem', width: '100%', textAlign: 'center', padding: '0 8px' }}>
                                                            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#fff', backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px 0', borderRadius: '8px', border: `1px solid ${sample.color}66` }}>
                                                                SEXY: {sample.sexy} / JEWEL: {sample.accessory}
                                                            </div>
                                                        </div>
                                                        <div style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', backgroundColor: '#f43f5e', color: '#fff', fontSize: '0.6rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px' }}>
                                                            <Zap size={8} fill="currentColor" /> R18
                                                        </div>
                                                    </>
                                                )}
                                            </motion.div>
                                        ))}

                                        {!isR18Mode && (
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                backgroundColor: 'rgba(0,0,0,0.5)',
                                                backdropFilter: 'blur(2px)',
                                                zIndex: 5,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '16px',
                                                gap: '10px',
                                                border: '1px dashed rgba(244, 63, 94, 0.4)'
                                            }}>
                                                <Lock size={20} color="#f43f5e" />
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ color: '#f43f5e', fontSize: '12px', fontWeight: 900, letterSpacing: '0.1em' }}>{t('editor.visual_presets.locked_title')}</div>
                                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', marginTop: '2px' }}>{t('editor.visual_presets.locked_desc')}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* Selected Sample Zoom Modal */}
            {createPortal(
                <AnimatePresence>
                    {selectedSample && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                backgroundColor: 'rgba(0, 0, 0, 0.98)',
                                zIndex: 10001,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px',
                                backdropFilter: 'blur(30px)'
                            }}
                            onClick={() => setSelectedSample(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    width: '100%',
                                    maxWidth: '500px',
                                    maxHeight: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px',
                                    alignItems: 'center',
                                    margin: 'auto'
                                }}
                            >
                                <div style={{
                                    position: 'relative',
                                    width: '100%',
                                    aspectRatio: '3/4.5',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: `0 0 50px ${selectedSample.color}40`,
                                    border: `2px solid ${selectedSample.color}66`
                                }}>
                                    <img
                                        src={selectedSample.img}
                                        alt={selectedSample.label}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                                        padding: '30px 20px 20px',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ color: selectedSample.color, fontWeight: 900, fontSize: '1rem', letterSpacing: '0.05em' }}>
                                            SEXY: {selectedSample.sexy} / JEWEL: {selectedSample.accessory}
                                        </div>
                                    </div>
                                    {selectedSample.r18 && (
                                        <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: '#f43f5e', color: '#fff', fontSize: '0.8rem', fontWeight: 900, padding: '4px 10px', borderRadius: '6px' }}>
                                            <Zap size={14} fill="currentColor" /> R18
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedSample(null)}
                                        style={{
                                            padding: '16px',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: '#fff',
                                            fontWeight: 900,
                                            fontSize: '0.9rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {t('editor.visual_presets.close')}
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={confirmApplySample}
                                        style={{
                                            padding: '16px',
                                            borderRadius: '16px',
                                            border: 'none',
                                            background: selectedSample.color,
                                            color: '#000',
                                            fontWeight: 900,
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            boxShadow: `0 0 20px ${selectedSample.color}40`
                                        }}
                                    >
                                        {t('editor.visual_presets.apply_style')}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

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
                                R18_MODE
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
                        id="tour-overdrive-btn"
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

            <div className="sexy-slider-header" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <label className="sexy-slider-label" style={{ flex: '1 1 auto', fontSize: '13px', minWidth: '200px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Flame size={16} className="icon-orange" />
                    <span>{t('common.language') === 'en' ? 'SEXY_LEVEL / ' : ''}{t('editor.sexy_level')}</span>
                    <div className="overdrive-tooltip-container" style={{
                        position: 'relative',
                        '--tooltip-accent': 'var(--magenta)',
                        '--tooltip-accent-rgb': '255, 0, 255'
                    } as any}>
                        <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            border: '1px solid rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            cursor: 'help',
                            opacity: 0.6
                        }}>?</div>
                        <div className="overdrive-tooltip-bubble right-aligned" style={{
                            width: 'min(300px, 80vw)',
                            whiteSpace: 'normal',
                            bottom: 'calc(100% + 15px)',
                            right: '0',
                            left: 'auto',
                            transform: 'none',
                            pointerEvents: 'none'
                        }}>
                            <div className="tooltip-glitch-line" style={{ left: 'auto', right: '10px' }} />
                            {t('editor.sexy_tip')}
                        </div>
                    </div>
                </label>

                <div className="flex items-center gap-4" style={{ flex: '1 1 auto', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    {/* Visual Catalog Trigger Button */}
                    <motion.button
                        id="tour-sample-visuals-btn"
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderColor: 'var(--cyan)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowPreview(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 18px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '14px',
                            cursor: 'pointer',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 900,
                            letterSpacing: '0.15em',
                            transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }}
                    >
                        <Eye size={16} color="var(--cyan)" />
                        {t('editor.visual_presets.title')}
                    </motion.button>

                    <div className="sexy-slider-value-group" style={{ minWidth: 'auto', justifyContent: 'flex-end', marginRight: '0', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {value === 10 && (
                                <>
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.4, 1],
                                            opacity: [0.6, 1, 0.6],
                                            rotate: [-10, 10, -10]
                                        }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                        style={{ position: 'absolute', left: '-30px', color: '#f43f5e' }}
                                    >
                                        <Heart size={20} fill="#f43f5e" />
                                    </motion.div>
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.4, 0.8, 0.4],
                                            rotate: [20, -20, 20]
                                        }}
                                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                                        style={{ position: 'absolute', right: '-25px', top: '-15px', color: '#ff00ff' }}
                                    >
                                        <Heart size={16} fill="#ff00ff" />
                                    </motion.div>
                                    <motion.div
                                        animate={{
                                            scale: [0, 1.5, 0],
                                            opacity: [0, 1, 0]
                                        }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                        style={{ position: 'absolute', bottom: '-20px', right: '0', color: '#f43f5e', fontSize: '10px' }}
                                    >
                                        ❤️
                                    </motion.div>
                                </>
                            )}
                            <span
                                className={`sexy-slider-number ${value === 10 ? 'sexy-max-glitter' : ''}`}
                                style={{
                                    textAlign: 'right',
                                    display: 'inline-block',
                                    minWidth: '220px',
                                    fontSize: value === 10 ? '1.8rem' : '1.8rem',
                                    whiteSpace: 'nowrap',
                                    paddingRight: value === 10 ? '10px' : '0',
                                    color: value === 10 ? '#f43f5e' : '#fff',
                                    textShadow: value === 10 ? '0 0 20px rgba(244, 63, 94, 0.6)' : 'none',
                                    fontWeight: 900
                                }}
                            >
                                {value === 10 ? 'ULTRA_SEXY' : value}
                            </span>
                        </div>
                        <span className="sexy-slider-intensity" style={{ fontSize: '11px', whiteSpace: 'nowrap', opacity: 0.6 }}>{t('common.intensity')} {value * 10}%</span>
                    </div>
                </div>
            </div>

            <div className={`sexy-slider-track-area ${value >= 7 ? 'sexy-slider-critical-bg' : ''} ${isR18Mode ? 'r18-pulse-bg' : ''}`} style={{ overflow: 'visible' }}>
                {value >= 7 && (
                    <HeartbeatWave
                        intensity={value === 10 ? 3 : (value >= 9 ? 2 : 1)}
                        isR18={isR18Mode}
                    />
                )}
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
        </div >
    );
};
