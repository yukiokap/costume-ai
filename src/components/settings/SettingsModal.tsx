import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Terminal,
    ExternalLink,
    Zap,
    Check
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useHistory } from '../../contexts/HistoryContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose
}) => {
    const { t, language, setLanguage } = useLanguage();
    const { apiKey, saveApiKey, copyOptions, setCopyOptions } = useSettings();
    const { clearHistory } = useHistory();

    const [localKey, setLocalKey] = useState(apiKey);
    const [isSaving, setIsSaving] = useState(false);
    const [wipeConfirm, setWipeConfirm] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLocalKey(apiKey);
            setWipeConfirm(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]); // Only sync when modal opens

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            saveApiKey(localKey);
            setIsSaving(false);
            onClose();
        }, 600);
    };

    const handleWipe = () => {
        if (wipeConfirm) {
            clearHistory();
            onClose();
        } else {
            setWipeConfirm(true);
            setTimeout(() => setWipeConfirm(false), 3000);
        }
    };

    const toggleCopyOption = (key: string) => {
        const k = key as keyof typeof copyOptions;
        setCopyOptions({
            ...copyOptions,
            [k]: !copyOptions[k]
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    style={{ backgroundColor: 'rgba(5, 5, 8, 0.85)', backdropFilter: 'blur(12px)' }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="studio-panel w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
                        style={{ padding: '3rem' }}
                    >
                        {/* Scanning Line Effect */}
                        <div className="scanning-line" />

                        {/* Header Area */}
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <div className="title-sub">
                                    <Terminal size={12} style={{ color: 'var(--cyan)' }} />
                                    SYSTEM ACCESS UNIT
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                    {t('common.settings').split(' ')[0]} <span style={{ color: 'var(--cyan)' }}>{t('common.settings').split(' ')[1] || ''}</span>
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={24} style={{ color: 'rgba(255,255,255,0.3)' }} />
                            </button>
                        </div>

                        {/* Language Selection */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
                            <div style={{ borderLeft: '4px solid #8b5cf6', paddingLeft: '20px' }}>
                                <div style={{ fontSize: '12px', fontWeight: '900', color: '#8b5cf6', letterSpacing: '0.3em', marginBottom: '4px' }}>
                                    00_LANGUAGE_LOCALE
                                </div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                                    {t('settings.language_interface')}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <button
                                    onClick={() => setLanguage('ja')}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '10px',
                                        backgroundColor: language === 'ja' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                        border: language === 'ja' ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
                                        color: language === 'ja' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.4)',
                                        fontSize: '11px',
                                        fontWeight: '900',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    日本語 (JA)
                                </button>
                                <button
                                    onClick={() => setLanguage('en')}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '10px',
                                        backgroundColor: language === 'en' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                        border: language === 'en' ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
                                        color: language === 'en' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.4)',
                                        fontSize: '11px',
                                        fontWeight: '900',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    ENGLISH (EN)
                                </button>
                            </div>
                        </div>

                        {/* Section 01: API Access */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
                            <div style={{ borderLeft: '4px solid var(--cyan)', paddingLeft: '20px' }}>
                                <div style={{ fontSize: '12px', fontWeight: '900', color: 'var(--cyan)', letterSpacing: '0.3em', marginBottom: '4px' }}>
                                    01_API_CONFIGURATION
                                </div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                                    {t('settings.api_key')}
                                </div>
                            </div>

                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    left: '20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--cyan)',
                                    opacity: '0.5'
                                }}>
                                    <Terminal size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={localKey}
                                    onChange={(e) => setLocalKey(e.target.value)}
                                    placeholder={t('settings.api_key_placeholder')}
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        border: '1px solid rgba(0, 242, 255, 0.2)',
                                        borderRadius: '12px',
                                        padding: '16px 16px 16px 54px',
                                        fontSize: '16px',
                                        color: '#fff',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        outline: 'none',
                                    }}
                                />
                            </div>

                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontSize: '10px',
                                    color: 'var(--cyan)',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    opacity: 0.7
                                }}
                                className="hover:opacity-100 transition-opacity"
                            >
                                <ExternalLink size={12} />
                                {t('settings.get_api_key')}
                            </a>
                        </div>

                        {/* Section 02: Default Copy Options */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
                            <div style={{ borderLeft: '4px solid #f97316', paddingLeft: '20px' }}>
                                <div style={{ fontSize: '12px', fontWeight: '900', color: '#f97316', letterSpacing: '0.3em', marginBottom: '4px' }}>
                                    02_COPY_BEHAVIOR
                                </div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                                    {t('settings.copy_options')}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {[
                                    { id: 'costume', label: t('settings.copy_costume') },
                                    { id: 'pose', label: t('settings.copy_pose') },
                                    { id: 'framing', label: t('settings.copy_framing') },
                                    { id: 'scene', label: t('settings.copy_scene') }
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => toggleCopyOption(opt.id)}
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            backgroundColor: copyOptions[opt.id as keyof typeof copyOptions] ? 'rgba(249, 115, 22, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                            border: copyOptions[opt.id as keyof typeof copyOptions] ? '1px solid #f97316' : '1px solid rgba(255, 255, 255, 0.08)',
                                            color: copyOptions[opt.id as keyof typeof copyOptions] ? '#f97316' : 'rgba(255, 255, 255, 0.4)',
                                            fontSize: '11px',
                                            fontWeight: '900',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <span className="truncate">{opt.label}</span>
                                        {copyOptions[opt.id as keyof typeof copyOptions] && <Check size={12} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Section 03: Data Maintenance */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
                            <div style={{ borderLeft: '4px solid #ef4444', paddingLeft: '20px' }}>
                                <div style={{ fontSize: '12px', fontWeight: '900', color: '#ef4444', letterSpacing: '0.3em', marginBottom: '4px' }}>
                                    03_DATA_MAINTENANCE
                                </div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                                    {t('settings.system_purge')}
                                </div>
                            </div>

                            <button
                                onClick={handleWipe}
                                style={{
                                    width: '100%',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    backgroundColor: wipeConfirm ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                                    border: wipeConfirm ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                                    color: wipeConfirm ? '#ef4444' : 'rgba(255, 255, 255, 0.4)',
                                    fontSize: '11px',
                                    fontWeight: '900',
                                    letterSpacing: '0.05em',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    textAlign: 'center',
                                    lineHeight: '1.4'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Zap size={16} />
                                    <span style={{ textTransform: 'uppercase' }}>
                                        {wipeConfirm ? 'DANGER: DATA_DELETION_REQD' : t('settings.purge_description')}
                                    </span>
                                </div>
                                {wipeConfirm && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ fontSize: '9px', fontWeight: '500', maxWidth: '80%' }}
                                    >
                                        {t('settings.purge_confirm')}
                                    </motion.div>
                                )}
                            </button>
                        </div>

                        {/* Footer Actions */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="btn-tailor"
                                style={{
                                    padding: '20px',
                                    fontSize: '13px',
                                    margin: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    opacity: isSaving ? 0.7 : 1,
                                    cursor: isSaving ? 'wait' : 'pointer',
                                    background: 'linear-gradient(135deg, var(--cyan), #006aff)'
                                }}
                            >
                                <Check size={18} />
                                {isSaving ? 'CONFIG_UPDATING...' : t('common.save_close')}
                            </button>
                        </div>

                        {/* Small decorative corner info */}
                        <div className="absolute bottom-6 right-8 text-[8px] font-mono text-slate-700 uppercase tracking-tighter flex items-center gap-4">
                            <span>SysRef_v3: {localKey ? 'AUTH_OK' : 'AUTH_REQD'}</span>
                            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: localKey ? 'var(--cyan)' : '#ef4444' }} />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
