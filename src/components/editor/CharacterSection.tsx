import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEditor } from '../../contexts/EditorContext';

export const CharacterSection: React.FC = () => {
    const { t } = useLanguage();
    const {
        isCharacterMode, setIsCharacterMode,
        characterInput, setCharacterInput,
        characterCostume, setCharacterCostume,
        remixBase
    } = useEditor();

    return (
        <div className="space-y-12">
            {/* Character Mode Toggle - New Sliding Toggle Design */}
            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
                <div
                    onClick={() => !remixBase && setIsCharacterMode(!isCharacterMode)}
                    style={{
                        width: '100%',
                        padding: '12px 20px',
                        borderRadius: '16px',
                        background: isCharacterMode
                            ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(244, 63, 94, 0.05))'
                            : 'rgba(255, 255, 255, 0.02)',
                        border: `1px solid ${isCharacterMode ? '#f43f5e' : 'rgba(255, 255, 255, 0.1)'}`,
                        cursor: remixBase ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isCharacterMode ? '0 0 25px rgba(244, 63, 94, 0.15)' : 'none',
                        opacity: remixBase ? 0.6 : 1
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Visual Toggle Switch - Now on the left */}
                        <div style={{
                            width: '44px',
                            height: '24px',
                            borderRadius: '20px',
                            backgroundColor: isCharacterMode ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255,255,255,0.1)',
                            position: 'relative',
                            border: `1px solid ${isCharacterMode ? '#f43f5e' : 'rgba(255,255,255,0.1)'}`,
                            transition: 'all 0.3s',
                            flexShrink: 0
                        }}>
                            <motion.div
                                animate={{ x: isCharacterMode ? 22 : 2 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    backgroundColor: '#fff',
                                    position: 'absolute',
                                    top: '2px',
                                    left: '0',
                                    boxShadow: isCharacterMode ? '0 0 10px #fff' : 'none'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '28px', height: '28px', borderRadius: '8px',
                                backgroundColor: isCharacterMode ? '#f43f5e' : 'rgba(255,255,255,0.05)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '14px', transition: 'all 0.3s'
                            }}>
                                🎭
                            </div>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: 900,
                                color: isCharacterMode ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase'
                            }}>
                                {t('common.character_mode')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isCharacterMode && (
                    <motion.div
                        key="character-mode-inputs"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div style={{ padding: '0 24px 24px' }}>
                            {/* Inputs */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <label style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                        {t('editor.character_name_label')}
                                    </label>
                                    {!characterInput && !remixBase && (
                                        <span style={{ fontSize: '8px', color: '#f43f5e', fontWeight: 600, letterSpacing: '0.05em' }}>
                                            ※空欄時は登録リストからランダム選出
                                        </span>
                                    )}
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={characterInput}
                                        onChange={(e) => setCharacterInput(e.target.value)}
                                        placeholder={t('editor.character_name_placeholder')}
                                        disabled={!!remixBase}
                                        style={{
                                            width: '100%',
                                            backgroundColor: remixBase ? 'transparent' : 'rgba(255, 255, 255, 0.03)',
                                            border: `1px solid ${remixBase ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'}`,
                                            borderRadius: '8px',
                                            padding: '14px 16px',
                                            color: remixBase ? 'rgba(255,255,255,0.5)' : 'white',
                                            fontSize: '14px',
                                            outline: 'none',
                                            transition: 'all 0.3s',
                                            cursor: remixBase ? 'not-allowed' : 'text',
                                            filter: remixBase ? 'grayscale(1) opacity(0.5)' : 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <label style={{
                                        fontSize: '10px',
                                        color: (!characterInput || remixBase) ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.4)',
                                        fontWeight: 'bold',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase'
                                    }}>
                                        {t('editor.character_costume_label')}
                                    </label>
                                    {!characterInput && !remixBase ? (
                                        <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)', fontWeight: 600, letterSpacing: '0.05em' }}>
                                            ※先にキャラクター名を入力してください
                                        </span>
                                    ) : !characterCostume && !remixBase && (
                                        <span style={{ fontSize: '8px', color: '#ffb300', fontWeight: 600, letterSpacing: '0.05em' }}>
                                            ※空欄時は基本衣装(Original)を採用
                                        </span>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={characterCostume}
                                    onChange={(e) => setCharacterCostume(e.target.value)}
                                    placeholder={t('editor.character_costume_placeholder')}
                                    disabled={!characterInput || !!remixBase}
                                    style={{
                                        width: '100%',
                                        backgroundColor: (!characterInput || remixBase) ? 'transparent' : 'rgba(255, 255, 255, 0.03)',
                                        border: `1px solid ${(!characterInput || remixBase) ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'}`,
                                        borderRadius: '8px',
                                        padding: '14px 16px',
                                        color: (!characterInput || remixBase) ? 'rgba(255,255,255,0.2)' : 'white',
                                        fontSize: '14px',
                                        outline: 'none',
                                        transition: 'all 0.3s',
                                        cursor: (!characterInput || remixBase) ? 'not-allowed' : 'text',
                                        filter: (!characterInput || remixBase) ? 'grayscale(1) opacity(0.5)' : 'none'
                                    }}
                                />
                            </div>

                            {/* Help Tips */}
                            <div style={{
                                padding: '12px 16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: '10px',
                                display: 'flex',
                                gap: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}>
                                <div style={{ fontSize: '18px', opacity: 0.5 }}>💡</div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.6', margin: '0 0 4px 0' }}>
                                        <span style={{ color: '#f43f5e', fontWeight: 'bold' }}>{t('editor.character_auto_mode')}</span>: {t('editor.character_auto_description')}
                                    </p>
                                    <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.6', margin: 0 }}>
                                        <span style={{ color: '#fff', fontWeight: 'bold' }}>{t('editor.character_manual_mode')}</span>: {t('editor.character_manual_description')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
