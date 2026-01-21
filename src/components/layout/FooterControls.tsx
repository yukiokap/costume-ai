import React from 'react';
import { NeonToggle } from '../ui/NeonToggle';
import { Sparkles, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { RotaryDial } from '../ui/RotaryDial';
import { useLanguage } from '../../contexts/LanguageContext';

interface FooterControlsProps {
    enableLighting: boolean;
    setEnableLighting: (val: boolean) => void;
    useWhiteBackground: boolean;
    setUseWhiteBackground: (val: boolean) => void;
    isGenerating: boolean;
    handleGenerate: () => void;
    numPrompts: number;
    setNumPrompts: (val: number) => void;
    onViewHistory: () => void;
    onViewFavorites: () => void;
}

export const FooterControls: React.FC<FooterControlsProps> = ({
    enableLighting,
    setEnableLighting,
    useWhiteBackground,
    setUseWhiteBackground,
    isGenerating,
    handleGenerate,
    numPrompts,
    setNumPrompts,
    onViewHistory,
    onViewFavorites
}) => {
    const { t } = useLanguage();

    return (
        <>
            <footer className="pt-12 border-t border-white/5 flex flex-col items-center gap-12 relative overflow-visible">
                {/* 上部：トグルスイッチ */}
                <div className="flex flex-row justify-center gap-12 w-full px-4">
                    <NeonToggle
                        label={`${enableLighting ? 'ON' : 'OFF'}`}
                        description={t('editor.lighting_effect')}
                        checked={enableLighting}
                        onChange={setEnableLighting}
                        color="amber"
                        layout="top"
                    />

                    <NeonToggle
                        label={`${useWhiteBackground ? t('editor.background_white') : t('editor.background_free')}`}
                        description={t('editor.background_fix')}
                        checked={useWhiteBackground}
                        onChange={setUseWhiteBackground}
                        color="white"
                        layout="top"
                    />
                </div>

                {/* 中央：回転ダイヤル ＆ 生成ボタン */}
                <div className="relative flex items-center justify-center scale-90 sm:scale-100">
                    <RotaryDial
                        value={numPrompts}
                        onChange={setNumPrompts}
                        disabled={isGenerating}
                        size={320}
                    >
                        {/* ダイヤルの中央に配置される生成ボタン */}
                        <motion.button
                            whileHover={!isGenerating ? { scale: 1.05 } : {}}
                            whileTap={!isGenerating ? { scale: 0.95 } : {}}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleGenerate();
                            }}
                            disabled={isGenerating}
                            style={{
                                width: '140px',
                                height: '140px',
                                borderRadius: '50%',
                                backgroundColor: isGenerating ? 'rgba(0, 242, 255, 0.1)' : 'rgba(0, 242, 255, 0.15)',
                                border: '2px solid #00f2ff',
                                boxShadow: isGenerating
                                    ? '0 0 30px rgba(0, 242, 255, 0.4)'
                                    : '0 0 20px rgba(0, 242, 255, 0.2), inset 0 0 15px rgba(0, 242, 255, 0.1)',
                                cursor: isGenerating ? 'not-allowed' : 'pointer',
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
                                fontSize: '28px',
                                fontWeight: 900,
                                color: '#fff',
                                textShadow: '0 0 10px rgba(0, 242, 255, 0.5)',
                                lineHeight: 1
                            }}>
                                {numPrompts}
                            </span>
                            {isGenerating ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                >
                                    <Sparkles size={18} color="#00f2ff" />
                                </motion.div>
                            ) : (
                                <Sparkles size={18} color="#00f2ff" style={{ filter: 'drop-shadow(0 0 8px #00f2ff)' }} />
                            )}
                            <span style={{
                                fontSize: '11px',
                                fontWeight: 900,
                                letterSpacing: '0.1em',
                                color: '#00f2ff',
                                textShadow: '0 0 8px rgba(0, 242, 255, 0.6)',
                                textTransform: 'uppercase'
                            }}>
                                {isGenerating ? 'GEN...' : t('common.generate')}
                            </span>
                        </motion.button>
                    </RotaryDial>
                </div>

                {/* 下部：補助ボタン */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', width: '100%', maxWidth: '500px', padding: '0 1rem' }}>
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
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            letterSpacing: '0.15em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
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
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            letterSpacing: '0.15em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
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
            `}} />
        </>
    );
};
