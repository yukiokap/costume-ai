import React, { memo } from 'react';
import { Sparkles, Clock, Heart, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { RotaryDial } from '../ui/RotaryDial';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEditor } from '../../contexts/EditorContext';

interface FooterControlsProps {
    isGenerating: boolean;
    handleGenerate: () => void;
    onViewHistory: () => void;
    onViewFavorites: () => void;
}

export const FooterControls: React.FC<FooterControlsProps> = memo(({
    isGenerating,
    handleGenerate,
    onViewHistory,
    onViewFavorites,
}) => {
    const { t } = useLanguage();
    const { numPrompts, setNumPrompts, resetEditor } = useEditor();

    const getActiveColor = (val: number) => {
        if (val <= 3) return '#00f2ff';
        if (val <= 6) return '#8b5cf6';
        if (val <= 8) return '#f97316';
        return '#ef4444';
    };

    const activeColor = getActiveColor(numPrompts);

    return (
        <>
            <footer className="pt-12 border-t border-white/5 flex flex-col items-center gap-12 relative overflow-visible">
                {/* 中央：回転ダイヤル ＆ 生成ボタン */}
                <div className="relative flex flex-col items-center justify-center scale-90 sm:scale-100">
                    <div style={{
                        fontSize: '11px',
                        fontWeight: 900,
                        color: 'rgba(255, 255, 255, 0.4)',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        pointerEvents: 'none'
                    }}>
                        <div style={{ height: '1px', width: '30px', background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2))' }} />
                        {t('editor.batch_count')}
                        <div style={{ height: '1px', width: '30px', background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.2), transparent)' }} />
                    </div>
                    <RotaryDial
                        value={numPrompts}
                        onChange={setNumPrompts}
                        disabled={isGenerating}
                        size={320}
                    >
                        {/* ダイヤルの中央に配置される生成ボタン */}
                        <motion.button
                            id="tour-generate-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleGenerate();
                            }}
                            style={{
                                width: '140px',
                                height: '140px',
                                borderRadius: '50%',
                                background: isGenerating
                                    ? 'rgba(239, 68, 68, 0.1)'
                                    : `linear-gradient(135deg, ${activeColor}, #000)`,
                                border: isGenerating
                                    ? '2px solid #ef4444'
                                    : `2px solid ${activeColor}`,
                                boxShadow: isGenerating
                                    ? '0 0 30px rgba(239, 68, 68, 0.4), inset 0 0 10px rgba(239, 68, 68, 0.2)'
                                    : `0 0 30px ${activeColor}66, inset 0 0 20px rgba(255, 255, 255, 0.5)`,
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <span style={{
                                fontSize: '32px',
                                fontWeight: 900,
                                color: isGenerating ? '#ef4444' : (numPrompts <= 3 ? '#000' : '#fff'),
                                textShadow: isGenerating ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none',
                                lineHeight: 1
                            }}>
                                {numPrompts}
                            </span>
                            {isGenerating ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                >
                                    <span style={{ display: 'flex' }}><Sparkles size={20} color="#ef4444" /></span>
                                </motion.div>
                            ) : (
                                <Sparkles size={20} color={numPrompts <= 3 ? '#000' : '#fff'} />
                            )}
                            <span style={{
                                fontSize: '16px',
                                fontWeight: 900,
                                letterSpacing: '0.15em',
                                color: isGenerating ? '#ef4444' : (numPrompts <= 3 ? '#000' : '#ffffff'),
                                textShadow: isGenerating
                                    ? '0 0 8px rgba(239, 68, 68, 0.6)'
                                    : '0 2px 4px rgba(0, 0, 0, 0.4)',
                                textTransform: 'uppercase'
                            }}>
                                {isGenerating ? 'STOP' : 'TAP!'}
                            </span>
                        </motion.button>
                    </RotaryDial>
                </div>

                {/* 水平スライダー（ダイアルと連動） */}
                <div style={{
                    width: '100%',
                    maxWidth: '300px',
                    padding: '0 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    marginTop: '-20px',
                    zIndex: 10
                }}>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={numPrompts}
                        onChange={(e) => setNumPrompts(parseInt(e.target.value))}
                        disabled={isGenerating}
                        style={{
                            width: '100%',
                            height: '4px',
                            background: `linear-gradient(90deg, ${activeColor} ${(numPrompts - 1) * 11.11}%, rgba(255, 255, 255, 0.1) ${(numPrompts - 1) * 11.11}%)`,
                            borderRadius: '2px',
                            appearance: 'none',
                            cursor: 'pointer',
                            outline: 'none',
                            "--thumb-color": activeColor
                        } as React.CSSProperties}
                        className="cyber-slider"
                    />
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0 4px'
                    }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                            <span
                                key={n}
                                onClick={() => !isGenerating && setNumPrompts(n)}
                                style={{
                                    fontSize: '10px',
                                    fontWeight: 900,
                                    color: n === numPrompts ? getActiveColor(n) : 'rgba(255,255,255,0.2)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textShadow: n === numPrompts ? `0 0 8px ${getActiveColor(n)}` : 'none'
                                }}
                            >
                                {n}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 下部：補助ボタン */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '0.75rem', width: '100%', maxWidth: '600px', padding: '0 1rem' }}>
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={resetEditor}
                        style={{
                            padding: '1rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#94a3b8',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            letterSpacing: '0.1em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            flex: 1
                        }}
                    >
                        <RotateCcw size={14} />
                        {t('common.reset').toUpperCase()}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onViewHistory}
                        style={{
                            padding: '1rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#94a3b8',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            letterSpacing: '0.1em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            flex: 1
                        }}
                    >
                        <Clock size={14} />
                        {t('common.history').toUpperCase()}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(244, 63, 94, 0.05)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onViewFavorites}
                        style={{
                            padding: '1rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#f43f5e',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            letterSpacing: '0.1em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            flex: 1
                        }}
                    >
                        <Heart size={14} />
                        {t('common.favorites').toUpperCase()}
                    </motion.button>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .cyber-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: var(--thumb-color, #00f2ff);
                    cursor: pointer;
                    box-shadow: 0 0 10px var(--thumb-color, #00f2ff);
                    border: 2px solid #fff;
                    transition: all 0.2s;
                }

                .cyber-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 0 15px var(--thumb-color, #00f2ff);
                }

                .cyber-slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: var(--thumb-color, #00f2ff);
                    cursor: pointer;
                    box-shadow: 0 0 10px var(--thumb-color, #00f2ff);
                    border: 2px solid #fff;
                }
            `}} />
        </>
    );
});
