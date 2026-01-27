import React, { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Heart, Trash2, Copy, Check, ChevronLeft } from 'lucide-react';
import { type HistoryItem } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEditor } from '../../contexts/EditorContext';
import './Results.css';

interface HistoryOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    mode: 'history' | 'favorites';
    onToggleFavorite: (id: string) => void;
    onDelete: (id: string) => void;
    onCopy: (text: string, index: number) => void;
    isCopied: number | null;
    copyOptions: { costume: boolean; character: boolean; pose: boolean; framing: boolean; scene: boolean };
    setCopyOptions: React.Dispatch<React.SetStateAction<{ costume: boolean; character: boolean; pose: boolean; framing: boolean; scene: boolean }>>;
    onClearHistory?: () => void;
    onModeChange?: (mode: 'history' | 'favorites') => void;
}

const DETAIL_LABELS: Record<string, string> = {
    c01: '01: 衣装の設定 / COSTUME',
    c02: '02: 具体的な姿勢 / POSE STANCE',
    c03: '03: 表情・感情の設定 / EXPRESSION',
    c04: '04: 構図の設定 / FRAMING',
};

const DetailRow: React.FC<{ detail: { label: string; val: any; type: string }; t: any }> = memo(({ detail, t }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { val, type, label } = detail;

    let displayVal = String(val);

    if (val === 'random') {
        displayVal = 'おまかせ';
    } else if (type === 'concept' && displayVal.includes('DIVERSE_REQUEST')) {
        displayVal = 'おまかせ';
    } else if (type === 'theme') {
        displayVal = (t(`editor.themes.${displayVal}`) || displayVal);
    } else if (type === 'stance') {
        displayVal = (t(`editor.pose_stance_presets.${displayVal}`) || displayVal);
    } else if (type === 'expression') {
        displayVal = (t(`editor.expression_presets.${displayVal}`) || displayVal);
    } else if (type === 'shot_type') {
        displayVal = (t(`editor.shot_type_presets.${displayVal}`) || displayVal);
    } else if (type === 'shot_angle') {
        displayVal = (t(`editor.shot_angle_presets.${displayVal}`) || displayVal);
    }

    if (type === 'text') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '4px', gap: '4px' }}>
                <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                    <span style={{ fontSize: '8px', fontWeight: 900, color: 'rgba(255,255,255,0.2)', minWidth: '50px' }}>{label}</span>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#00f2ff', textDecoration: 'underline' }}>
                        {isExpanded ? '閉じる' : '自由入力内容を表示'}
                    </span>
                </div>
                {isExpanded && (
                    <div style={{ fontSize: '9px', color: '#fff', backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '4px', lineHeight: '1.4', wordBreak: 'break-all' }}>
                        {displayVal}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: '4px' }}>
            <span style={{ fontSize: '8px', fontWeight: 900, color: 'rgba(255,255,255,0.2)', minWidth: '50px' }}>{label}</span>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#fff', textAlign: 'right', maxWidth: '75%', wordBreak: 'break-all' }}>{displayVal}</span>
        </div>
    );
});

export const HistoryOverlay: React.FC<HistoryOverlayProps> = ({
    isOpen,
    onClose,
    history,
    mode,
    onToggleFavorite,
    onDelete,
    onCopy,
    isCopied,
    copyOptions,
    setCopyOptions,
    onClearHistory,
    onModeChange
}) => {
    const { t } = useLanguage();
    const { applyRemix } = useEditor();
    const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

    const toggleDetails = (id: string) => {
        setExpandedDetails(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const title = mode === 'history' ? 'GENERATE HISTORY' : 'FAVORITE PROMPTS';
    const Icon = mode === 'history' ? Clock : Heart;

    const themeColor = mode === 'favorites' ? '#f43f5e' : '#00f2ff';

    const filteredList = mode === 'favorites'
        ? history.filter(item => item.isFavorite)
        : history.filter(item => !item.isFavorite);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSingleCopy = (item: HistoryItem, index: number) => {
        const parts = [];
        if (copyOptions.character && item.character) parts.push(item.character.replace(/\n/g, ' '));
        if (copyOptions.costume && item.costume) parts.push(item.costume.replace(/\n/g, ' '));
        if (copyOptions.pose && item.composition) parts.push(item.composition.replace(/\n/g, ' '));
        if (copyOptions.framing && item.framing) parts.push(item.framing.replace(/\n/g, ' '));
        if (copyOptions.scene && item.scene) parts.push(item.scene.replace(/\n/g, ' '));

        const textToCopy = parts.length > 0 ? parts.join(', ') : item.prompt.replace(/\n/g, ' ');
        onCopy(textToCopy, index + 40000);
    };

    const handleRemixAction = (item: HistoryItem) => {
        applyRemix(item);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%', opacity: 0.5 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-[#08080a]"
                >
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.02) 1px, transparent 0)',
                        backgroundSize: '30px 30px',
                        pointerEvents: 'none'
                    }} />

                    <header style={{
                        padding: '1.5rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        position: 'relative',
                        zIndex: 10,
                        backgroundColor: 'rgba(2, 4, 6, 0.5)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                <button
                                    onClick={onClose}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        padding: '0.75rem 1.25rem',
                                        cursor: 'pointer',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <ChevronLeft size={18} />
                                    {t('common.back')}
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                    <Icon size={28} color={themeColor} />
                                    <div>
                                        <h2 style={{
                                            color: '#fff',
                                            fontSize: '1.5rem',
                                            fontWeight: 900,
                                            letterSpacing: '0.3em',
                                            textTransform: 'uppercase',
                                            margin: 0,
                                            fontStyle: 'italic'
                                        }}>
                                            {title}
                                        </h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '4px' }}>
                                            <p style={{ margin: 0, fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: '0.2em' }}>
                                                {filteredList.length}{t('results.items_found_suffix')}
                                            </p>
                                            {mode === 'history' && (
                                                <>
                                                    <span style={{ color: 'rgba(255,255,255,0.1)' }}>•</span>
                                                    <p style={{ margin: 0, fontSize: '0.6rem', color: themeColor, fontWeight: 800, letterSpacing: '0.1em' }}>
                                                        {t('results.history_count')}: {history.filter(h => !h.isFavorite).length}/100
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {onModeChange && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => onModeChange('history')}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            backgroundColor: mode === 'history' ? 'rgba(0, 242, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                            border: mode === 'history' ? '1px solid #00f2ff' : '1px solid rgba(255, 255, 255, 0.1)',
                                            color: mode === 'history' ? '#00f2ff' : 'rgba(255, 255, 255, 0.4)',
                                            fontSize: '0.7rem',
                                            fontWeight: 900,
                                            letterSpacing: '0.05em',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <Clock size={14} />
                                        {t('common.history')}
                                    </button>
                                    <button
                                        onClick={() => onModeChange('favorites')}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            backgroundColor: mode === 'favorites' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                            border: mode === 'favorites' ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)',
                                            color: mode === 'favorites' ? '#f43f5e' : 'rgba(255, 255, 255, 0.4)',
                                            fontSize: '0.7rem',
                                            fontWeight: 900,
                                            letterSpacing: '0.05em',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <Heart size={14} />
                                        {t('common.favorites')}
                                    </button>
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.75rem',
                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                    borderRadius: '14px',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    flexWrap: 'wrap'
                                }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginRight: '0.5rem' }}>{t('results.copy_settings_label')}</span>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={copyOptions.costume}
                                            onChange={() => setCopyOptions(prev => ({ ...prev, costume: !prev.costume }))}
                                            style={{ accentColor: themeColor, width: '14px', height: '14px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: copyOptions.costume ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{t('results.tags.outfit')}</span>
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={copyOptions.character}
                                            onChange={() => setCopyOptions(prev => ({ ...prev, character: !prev.character }))}
                                            style={{ accentColor: themeColor, width: '14px', height: '14px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: copyOptions.character ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{t('results.tags.character')}</span>
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={copyOptions.pose}
                                            onChange={() => setCopyOptions(prev => ({ ...prev, pose: !prev.pose }))}
                                            style={{ accentColor: themeColor, width: '14px', height: '14px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: copyOptions.pose ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{t('results.tags.pose')}</span>
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={copyOptions.framing}
                                            onChange={() => setCopyOptions(prev => ({ ...prev, framing: !prev.framing }))}
                                            style={{ accentColor: themeColor, width: '14px', height: '14px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: copyOptions.framing ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{t('results.tags.framing')}</span>
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={copyOptions.scene}
                                            onChange={() => setCopyOptions(prev => ({ ...prev, scene: !prev.scene }))}
                                            style={{ accentColor: themeColor, width: '14px', height: '14px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: copyOptions.scene ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{t('results.tags.scene')}</span>
                                    </label>
                                </div>

                                <button
                                    onClick={onClose}
                                    style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: 'none',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    className="hover:rotate-90 hover:bg-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {mode === 'history' && history.length > 0 && onClearHistory && (
                            <div style={{ paddingLeft: '11rem' }}>
                                <button
                                    onClick={() => {
                                        if (window.confirm(t('common.confirm_clear_history') || 'Are you sure you want to clear all history?')) {
                                            onClearHistory();
                                        }
                                    }}
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: '12px',
                                        padding: '0.5rem 1rem',
                                        cursor: 'pointer',
                                        color: '#ef4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.7rem',
                                        fontWeight: 900,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="hover:bg-red-500/20"
                                >
                                    <Trash2 size={14} />
                                    {t('results.delete_all_history')}
                                </button>

                                <div style={{
                                    marginTop: '1rem',
                                    padding: '0.75rem 1rem',
                                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '8px',
                                    fontSize: '0.65rem',
                                    color: 'rgba(255, 255, 255, 0.4)',
                                    lineHeight: '1.5'
                                }}>
                                    <div style={{ marginBottom: '0.25rem' }}>
                                        💡 {t('results.history_limit_warning')}
                                    </div>
                                    <div style={{ color: themeColor, fontWeight: 600 }}>
                                        ⭐ {t('results.favorites_unlimited')}
                                    </div>
                                </div>
                            </div>
                        )}
                    </header>

                    <main style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '3rem 4rem',
                        position: 'relative',
                        zIndex: 1
                    }} className="custom-scrollbar">
                        {filteredList.length === 0 ? (
                            <div style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0.2,
                                gap: '1.5rem'
                            }}>
                                <Icon size={100} strokeWidth={1} />
                                <p style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.5em', textTransform: 'uppercase' }}>
                                    {t('results.no_records')}
                                </p>
                            </div>
                        ) : (
                            <div className="results-grid">
                                {filteredList.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className={`result-card ${item.isR18Mode ? 'r18-card-glow' : ''} ${item.isCharacterMode ? 'character-mode' : ''}`}
                                        style={{
                                            borderTop: `4px solid ${themeColor}`,
                                            borderColor: item.isFavorite && mode === 'history' ? '#f43f5e' : undefined
                                        }}
                                    >
                                        <div className="card-number">
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>

                                        <div style={{
                                            padding: '1rem 1.25rem 0',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            alignItems: 'stretch',
                                            gap: '0',
                                            zIndex: 20
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                gap: '0.5rem',
                                                alignItems: 'center',
                                                marginBottom: '0.5rem'
                                            }}>
                                                <button
                                                    onClick={() => handleRemixAction(item)}
                                                    style={{
                                                        background: 'rgba(234, 179, 8, 0.12)',
                                                        border: '1px solid rgba(234, 179, 8, 0.3)',
                                                        borderRadius: '8px',
                                                        padding: '0 12px',
                                                        height: '34px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px',
                                                        color: '#eab308',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        backdropFilter: 'blur(4px)',
                                                        fontSize: '0.65rem',
                                                        fontWeight: 900,
                                                        letterSpacing: '0.05em'
                                                    }}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                                                    <span>{t('common.remix')}</span>
                                                </button>
                                                <button
                                                    onClick={() => onToggleFavorite(item.id)}
                                                    style={{
                                                        background: 'rgba(0,0,0,0.5)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: '8px',
                                                        width: '34px',
                                                        height: '34px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: item.isFavorite ? '#f43f5e' : 'rgba(255,255,255,0.2)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        backdropFilter: 'blur(4px)'
                                                    }}
                                                >
                                                    <Heart size={16} fill={item.isFavorite ? 'currentColor' : 'none'} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(item.id)}
                                                    style={{
                                                        background: 'rgba(0,0,0,0.5)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: '8px',
                                                        width: '34px',
                                                        height: '34px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'rgba(255,255,255,0.2)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        backdropFilter: 'blur(4px)'
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                gap: '0.4rem',
                                                justifyContent: 'flex-end'
                                            }}>
                                                {item.isR18Mode && (
                                                    <div style={{
                                                        backgroundColor: 'rgba(255, 0, 255, 0.12)',
                                                        border: '1px solid rgba(255, 0, 255, 0.3)',
                                                        borderRadius: '8px',
                                                        padding: '2px 6px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        minWidth: '38px'
                                                    }}>
                                                        <span style={{ fontSize: '0.45rem', color: '#ff00ff', fontWeight: 900, textTransform: 'uppercase' }}>OVERDRIVE</span>
                                                        <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 900, lineHeight: 1 }}>R18</span>
                                                    </div>
                                                )}
                                                {item.sexyLevel !== undefined && (
                                                    <div style={{
                                                        backgroundColor: 'rgba(244, 63, 94, 0.12)',
                                                        border: '1px solid rgba(244, 63, 94, 0.3)',
                                                        borderRadius: '8px',
                                                        padding: '2px 6px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        minWidth: '38px'
                                                    }}>
                                                        <span style={{ fontSize: '0.45rem', color: '#f43f5e', fontWeight: 900, textTransform: 'uppercase' }}>SEXY</span>
                                                        <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 900, lineHeight: 1 }}>{item.sexyLevel}</span>
                                                    </div>
                                                )}
                                                {item.accessoryLevel !== undefined && (
                                                    <div style={{
                                                        backgroundColor: 'rgba(234, 179, 8, 0.12)',
                                                        border: '1px solid rgba(234, 179, 8, 0.3)',
                                                        borderRadius: '8px',
                                                        padding: '2px 6px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        minWidth: '38px'
                                                    }}>
                                                        <span style={{ fontSize: '0.45rem', color: '#eab308', fontWeight: 900, textTransform: 'uppercase' }}>JEWEL</span>
                                                        <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 900, lineHeight: 1 }}>{item.accessoryLevel}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="card-content">
                                            <h3 className="card-desc" style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                                                {item.description.replace(/^[:\s\u30fb]+/, '')}
                                            </h3>



                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                                {item.isCharacterMode && item.character && (
                                                    <div className="tag-container" style={{ margin: 0 }}>
                                                        <span style={{ fontSize: '0.45rem', fontWeight: 900, color: 'rgba(255, 0, 128, 0.5)', marginRight: '4px' }}>{t('results.tags.character')}</span>
                                                        {item.character.split(',').slice(0, 2).map((t, i) => (
                                                            <span key={i} className="mini-tag" style={{ color: '#ff0080', borderStyle: 'solid' }}>{t.trim()}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.costume && (
                                                    <div className="tag-container" style={{ margin: 0 }}>
                                                        <span style={{ fontSize: '0.45rem', fontWeight: 900, color: 'rgba(249, 115, 22, 0.5)', marginRight: '4px' }}>{t('results.tags.outfit')}</span>
                                                        {item.costume.split(',').slice(0, 2).map((t, i) => (
                                                            <span key={i} className="mini-tag">{t.trim()}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.composition && (
                                                    <div className="tag-container" style={{ margin: 0 }}>
                                                        <span style={{ fontSize: '0.45rem', fontWeight: 900, color: 'rgba(148, 163, 184, 0.5)', marginRight: '4px' }}>{t('results.tags.pose')}</span>
                                                        {item.composition.split(',').slice(0, 2).map((t, i) => (
                                                            <span key={i} className="mini-tag" style={{ color: '#94a3b8', borderStyle: 'dotted' }}>{t.trim()}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.framing && (
                                                    <div className="tag-container" style={{ margin: 0 }}>
                                                        <span style={{ fontSize: '0.45rem', fontWeight: 900, color: 'rgba(167, 139, 250, 0.5)', marginRight: '4px' }}>{t('results.tags.framing')}</span>
                                                        {item.framing.split(',').slice(0, 2).map((t, i) => (
                                                            <span key={i} className="mini-tag" style={{ color: '#a78bfa', borderStyle: 'dotted' }}>{t.trim()}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.scene && (
                                                    <div className="tag-container" style={{ margin: 0, marginBottom: '1rem' }}>
                                                        <span style={{ fontSize: '0.45rem', fontWeight: 900, color: 'rgba(0, 242, 255, 0.5)', marginRight: '4px' }}>{t('results.tags.scene')}</span>
                                                        {item.scene.split(',').slice(0, 2).map((t, i) => (
                                                            <span key={i} className="mini-tag" style={{ color: '#00f2ff', borderStyle: 'dotted' }}>{t.trim()}</span>
                                                        ))}
                                                    </div>
                                                )}

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleDetails(item.id);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                                        borderRadius: '8px',
                                                        color: 'rgba(255, 255, 255, 0.4)',
                                                        fontSize: '9px',
                                                        fontWeight: 900,
                                                        letterSpacing: '0.15em',
                                                        textTransform: 'uppercase',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px',
                                                        marginBottom: '1rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    <X size={10} style={{ transform: expandedDetails[item.id] ? 'rotate(0deg)' : 'rotate(45deg)', transition: 'transform 0.3s ease' }} />
                                                    {expandedDetails[item.id] ? '閉じる / HIDE' : '設定詳細を表示 / DETAILS'}
                                                </button>

                                                <AnimatePresence>
                                                    {expandedDetails[item.id] && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            style={{
                                                                overflow: 'hidden',
                                                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                                                borderRadius: '10px',
                                                                padding: '12px',
                                                                marginBottom: '1rem',
                                                                border: '1px solid rgba(255, 255, 255, 0.03)'
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                                {[
                                                                    {
                                                                        section: 'c01',
                                                                        items: [
                                                                            { label: 'テーマ', val: item.originalTheme, type: 'theme' },
                                                                            { label: 'コンセプト', val: item.originalConcept, type: 'concept' }
                                                                        ]
                                                                    },
                                                                    {
                                                                        section: 'c02',
                                                                        items: [
                                                                            { label: '姿勢', val: item.originalPoseStance, type: 'stance' },
                                                                            { label: '自由記述', val: item.originalPoseDescription, type: 'text' }
                                                                        ]
                                                                    },
                                                                    {
                                                                        section: 'c03',
                                                                        items: [
                                                                            { label: '感情', val: item.originalExpression, type: 'expression' },
                                                                            { label: '自由記述', val: item.originalExpressionDescription, type: 'text' }
                                                                        ]
                                                                    },
                                                                    {
                                                                        section: 'c04',
                                                                        items: [
                                                                            { label: '距離', val: item.originalShotType, type: 'shot_type' },
                                                                            { label: 'アングル', val: item.originalShotAngle, type: 'shot_angle' },
                                                                            { label: '自由記述', val: item.originalFramingDescription, type: 'text' }
                                                                        ]
                                                                    }
                                                                ].map((group, gIdx) => (
                                                                    <div key={gIdx} style={{ borderBottom: gIdx < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: gIdx < 3 ? '8px' : '0' }}>
                                                                        <div style={{ fontSize: '9px', fontWeight: 900, color: '#00f2ff', letterSpacing: '0.05em', marginBottom: '6px' }}>
                                                                            {DETAIL_LABELS[group.section]}
                                                                        </div>
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                                            {group.items.filter(i => {
                                                                                if (i.val === undefined || i.val === null || i.val === '') return false;
                                                                                if (i.type === 'text' && (i.val === 'None' || i.val === 'model')) return false;
                                                                                return true;
                                                                            }).map((detail, dIdx) => (
                                                                                <DetailRow key={dIdx} detail={detail} t={t} />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                                                <button
                                                    onClick={() => handleSingleCopy(item, idx)}
                                                    className={`btn-action-primary ${isCopied === idx + 40000 ? 'copied' : ''}`}
                                                    style={{
                                                        width: '100%',
                                                        padding: '1rem',
                                                        backgroundColor: isCopied === idx + 40000 ? '#10b981' : 'rgba(0, 242, 255, 0.05)',
                                                        border: `1px solid ${isCopied === idx + 40000 ? '#10b981' : 'rgba(0, 242, 255, 0.2)'}`,
                                                        borderRadius: '12px',
                                                        color: isCopied === idx + 40000 ? '#000' : '#00f2ff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '10px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 800,
                                                        letterSpacing: '0.1em',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    {isCopied === idx + 40000 ? <Check size={16} /> : <Copy size={16} />}
                                                    <span>{isCopied === idx + 40000 ? 'COPIED' : 'COPY SELECTED'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </main>
                </motion.div>
            )
            }
        </AnimatePresence>
    );
};
