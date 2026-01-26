import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal,
    ExternalLink,
    Check,
    HelpCircle,
    Cpu,
    Zap,
    Layers,
    Copy,
    AlertCircle,
    ShieldAlert,
    ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'config' | 'usage';
    hasError?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    initialTab,
    hasError = false
}) => {
    const { t, language, setLanguage } = useLanguage();
    const { apiKey, saveApiKey, startTour } = useSettings();

    const [localKey, setLocalKey] = useState(apiKey);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'config' | 'usage'>(initialTab || 'config');
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize state when modal opens
    useEffect(() => {
        if (isOpen) {
            setLocalKey(apiKey);

            // Determine which tab should be active
            let targetTab: 'config' | 'usage' = 'config';
            if (hasError) {
                targetTab = 'config';
            } else if (initialTab) {
                targetTab = initialTab;
            } else if (!apiKey) {
                targetTab = 'config';
            }

            setActiveTab(targetTab);
        }
    }, [isOpen, initialTab, hasError, apiKey]);

    // Handle auto-focus separately to ensure it runs after tab switch/render
    useEffect(() => {
        if (isOpen && activeTab === 'config') {
            // Auto-focus if there's an error OR if the key is missing (onboarding flow)
            // We use a timeout to allow for the modal entry animation and tab switching to complete
            if (hasError || !apiKey) {
                const timer = setTimeout(() => {
                    inputRef.current?.focus();
                }, 400);
                return () => clearTimeout(timer);
            }
        }
    }, [isOpen, activeTab, hasError, apiKey]);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            saveApiKey(localKey);
            setIsSaving(false);
            onClose();
        }, 600);
    };

    const UsageStep = ({ icon: Icon, title, desc, step, isFirst }: { icon: any, title: string, desc: string, step: string, isFirst?: boolean }) => (
        <div
            style={{
                display: 'flex',
                gap: '16px',
                padding: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                fontSize: '48px',
                fontWeight: 900,
                color: 'rgba(255, 255, 255, 0.03)',
                pointerEvents: 'none',
                fontFamily: "'Space Grotesk', sans-serif"
            }}>
                {step}
            </div>
            <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: isFirst ? 'rgba(0, 242, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: isFirst ? 'var(--cyan)' : 'rgba(255,255,255,0.4)',
                border: isFirst ? '1px solid var(--cyan)' : '1px solid transparent'
            }}>
                <Icon size={22} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {title}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', lineHeight: '1.6' }}>{desc}</div>

                {isFirst && (
                    <button
                        onClick={() => setActiveTab('config')}
                        style={{
                            marginTop: '12px',
                            fontSize: '10px',
                            fontWeight: 900,
                            color: 'var(--cyan)',
                            background: 'rgba(0, 242, 255, 0.1)',
                            border: '1px solid var(--cyan)',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        GO TO SETTINGS <ChevronRight size={12} />
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    style={{ backgroundColor: 'rgba(5, 5, 8, 0.95)', backdropFilter: 'blur(30px)' }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="studio-panel w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
                        style={{
                            padding: '3rem',
                            border: hasError ? '2px solid #ef4444' : (!apiKey ? '1px solid #eab308' : '1px solid rgba(255, 255, 255, 0.1)'),
                            boxShadow: hasError ? '0 0 60px rgba(239, 68, 68, 0.2)' : (!apiKey ? '0 0 60px rgba(234, 179, 8, 0.15)' : '0 30px 60px rgba(0, 0, 0, 0.8)'),
                            backgroundColor: 'rgba(13, 13, 18, 0.98)'
                        }}
                    >
                        <div className="scanning-line" />

                        <AnimatePresence>
                            {hasError ? (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    style={{
                                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                        border: '1px solid #ef4444',
                                        borderRadius: '12px',
                                        padding: '16px 20px',
                                        marginBottom: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        color: '#ff4d4d',
                                        boxShadow: '0 0 20px rgba(239, 68, 68, 0.1)'
                                    }}
                                >
                                    <ShieldAlert size={28} />
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 900, marginBottom: '2px' }}>CRITICAL: API_KEY_INVALID</div>
                                        <div style={{ fontSize: '11px', opacity: 0.8 }}>{t('results.errors.api_key_invalid')}</div>
                                    </div>
                                </motion.div>
                            ) : !apiKey && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    style={{
                                        backgroundColor: 'rgba(234, 179, 8, 0.1)',
                                        border: '1px solid #eab308',
                                        borderRadius: '12px',
                                        padding: '16px 20px',
                                        marginBottom: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        color: '#eab308'
                                    }}
                                >
                                    <AlertCircle size={28} />
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 900, marginBottom: '2px' }}>SYSTEM_HALT: API_REQUIRED</div>
                                        <div style={{ fontSize: '11px', opacity: 0.8 }}>{t('settings.api_required_notice')}</div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="title-sub" style={{ fontSize: '10px' }}>
                                    <Terminal size={12} style={{ color: 'var(--cyan)' }} />
                                    SYSTEM ACCESS UNIT / CORE_v3
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '12px' }}>
                            <button
                                onClick={() => setActiveTab('config')}
                                style={{
                                    padding: '12px 24px',
                                    fontSize: '11px',
                                    fontWeight: 900,
                                    color: activeTab === 'config' ? 'var(--cyan)' : 'rgba(255, 255, 255, 0.3)',
                                    backgroundColor: activeTab === 'config' ? 'rgba(0, 242, 255, 0.08)' : 'transparent',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Cpu size={14} />
                                CONFIGURATION
                                {activeTab === 'config' && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-[-13px] left-0 right-0 h={3px} bg-cyan-400 shadow-[0_0_10px_var(--cyan)]" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('usage')}
                                style={{
                                    padding: '12px 24px',
                                    fontSize: '11px',
                                    fontWeight: 900,
                                    color: activeTab === 'usage' ? 'var(--cyan)' : 'rgba(255, 255, 255, 0.3)',
                                    backgroundColor: activeTab === 'usage' ? 'rgba(0, 242, 255, 0.08)' : 'transparent',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    position: 'relative'
                                }}
                            >
                                <HelpCircle size={14} />
                                USER_GUIDE
                                {activeTab === 'usage' && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-[-13px] left-0 right-0 h={3px} bg-cyan-400 shadow-[0_0_10px_var(--cyan)]" />
                                )}
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'config' ? (
                                <motion.div
                                    key="config"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* API HOW-TO: Integrated directly above input */}
                                    <div style={{
                                        marginBottom: '32px',
                                        padding: '20px',
                                        backgroundColor: 'rgba(0, 242, 255, 0.03)',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(0, 242, 255, 0.15)',
                                        position: 'relative'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                            <div style={{ background: 'var(--cyan)', color: '#000', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 900 }}>HOW_TO</div>
                                            <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--cyan)', letterSpacing: '0.1em' }}>{t('settings.api_step_title')}</span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {[1, 2, 3, 4].map(num => (
                                                <div key={num} style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', display: 'flex', gap: '8px', lineHeight: '1.4' }}>
                                                    <span style={{ color: 'var(--cyan)', fontWeight: 900 }}>{num}.</span>
                                                    <span>{t(`settings.usage_step_1_detail_${num}` as any).replace(/^\d\.\s/, '')}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ marginTop: '20px' }}>
                                            <a
                                                href="https://aistudio.google.com/app/apikey"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: 900,
                                                    color: '#000',
                                                    background: 'var(--cyan)',
                                                    border: 'none',
                                                    padding: '10px 20px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    textDecoration: 'none',
                                                    boxShadow: '0 0 15px rgba(0, 242, 255, 0.2)'
                                                }}
                                            >
                                                <ExternalLink size={14} /> {t('settings.get_key_button')}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Section 01: API Access */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
                                        <div style={{ borderLeft: '4px solid var(--cyan)', paddingLeft: '20px' }}>
                                            <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--cyan)', letterSpacing: '0.3em', marginBottom: '4px' }}>
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
                                                color: hasError ? '#ef4444' : 'var(--cyan)',
                                                opacity: '0.8',
                                                zIndex: 10
                                            }}>
                                                {hasError ? <ShieldAlert size={20} /> : <Terminal size={20} />}
                                            </div>
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={localKey}
                                                onChange={(e) => setLocalKey(e.target.value)}
                                                placeholder={t('settings.api_key_placeholder')}
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                                    border: hasError ? '2px solid #ef4444' : (!apiKey ? '2px solid #eab308' : '1px solid rgba(0, 242, 255, 0.3)'),
                                                    borderRadius: '16px',
                                                    padding: '20px 20px 20px 60px',
                                                    fontSize: '15px',
                                                    color: '#fff',
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                    outline: 'none',
                                                    boxShadow: hasError ? '0 0 20px rgba(239, 68, 68, 0.15)' : (!apiKey ? '0 0 20px rgba(234, 179, 8, 0.1)' : 'none'),
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
                                        <div style={{ borderLeft: '4px solid #8b5cf6', paddingLeft: '20px' }}>
                                            <div style={{ fontSize: '11px', fontWeight: '900', color: '#8b5cf6', letterSpacing: '0.3em', marginBottom: '4px' }}>
                                                02_LANGUAGE_LOCALE
                                            </div>
                                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                                                {t('settings.language_interface')}
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                            <button
                                                onClick={() => setLanguage('ja')}
                                                style={{
                                                    padding: '16px',
                                                    borderRadius: '12px',
                                                    backgroundColor: language === 'ja' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                                    border: language === 'ja' ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.1)',
                                                    color: language === 'ja' ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                                                    fontSize: '12px',
                                                    fontWeight: '900',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                日本語 (JA)
                                            </button>
                                            <button
                                                onClick={() => setLanguage('en')}
                                                style={{
                                                    padding: '16px',
                                                    borderRadius: '12px',
                                                    backgroundColor: language === 'en' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                                    border: language === 'en' ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.1)',
                                                    color: language === 'en' ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                                                    fontSize: '12px',
                                                    fontWeight: '900',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                ENGLISH (EN)
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="usage"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <HelpCircle size={20} color="var(--cyan)" />
                                            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#fff', letterSpacing: '0.05em' }}>
                                                {t('settings.usage_guide_title')}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => {
                                                onClose();
                                                setTimeout(() => startTour(), 300);
                                            }}
                                            style={{
                                                fontSize: '10px',
                                                fontWeight: 900,
                                                color: '#000',
                                                background: 'var(--cyan)',
                                                border: 'none',
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                boxShadow: '0 0 15px rgba(0, 242, 255, 0.3)'
                                            }}
                                        >
                                            <Zap size={12} fill="black" /> {t('results.start_tour')}
                                        </button>
                                    </div>

                                    <UsageStep
                                        isFirst={true}
                                        step="01"
                                        icon={Cpu}
                                        title={t('settings.usage_step_1')}
                                        desc={t('settings.usage_step_1_desc')}
                                    />
                                    <UsageStep
                                        step="02"
                                        icon={Layers}
                                        title={t('settings.usage_step_2')}
                                        desc={t('settings.usage_step_2_desc')}
                                    />
                                    <UsageStep
                                        step="03"
                                        icon={Zap}
                                        title={t('settings.usage_step_3')}
                                        desc={t('settings.usage_step_3_desc')}
                                    />
                                    <UsageStep
                                        step="04"
                                        icon={Copy}
                                        title={t('settings.usage_step_4')}
                                        desc={t('settings.usage_step_4_desc')}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="btn-tailor"
                                style={{
                                    padding: '24px',
                                    fontSize: '14px',
                                    margin: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    opacity: isSaving ? 0.7 : 1,
                                    cursor: isSaving ? 'wait' : 'pointer',
                                    background: localKey ? 'linear-gradient(135deg, var(--cyan), #006aff)' : 'rgba(255,255,255,0.05)',
                                    color: localKey ? '#000' : 'rgba(255,255,255,0.3)',
                                    border: localKey ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: localKey ? '0 10px 30px rgba(0, 242, 255, 0.3)' : 'none'
                                }}
                            >
                                <Check size={20} />
                                {isSaving ? 'CONFIG_UPDATING...' : t('common.save_close')}
                            </button>
                        </div>

                        <div className="absolute bottom-6 right-8 text-[9px] font-mono text-slate-700 uppercase tracking-tighter flex items-center gap-4">
                            <span>SysRef_active: {localKey ? 'AUTH_OK' : 'AUTH_REQD'}</span>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: localKey ? 'var(--cyan)' : '#ef4444' }} />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
