import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Heart, Trash2, Copy, Check, ChevronLeft } from 'lucide-react';
import { type HistoryItem } from '../../types';
import './Results.css';

interface HistoryOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    mode: 'history' | 'favorites';
    onToggleFavorite: (id: string) => void;
    onDelete: (id: string) => void;
    onCopy: (text: string, index: number) => void;
    onRemix: (item: HistoryItem) => void;
    isCopied: number | null;
    copyOptions: { costume: boolean; pose: boolean; framing: boolean; scene: boolean };
    setCopyOptions: React.Dispatch<React.SetStateAction<{ costume: boolean; pose: boolean; framing: boolean; scene: boolean }>>;
}

export const HistoryOverlay: React.FC<HistoryOverlayProps> = ({
    isOpen,
    onClose,
    history,
    mode,
    onToggleFavorite,
    onDelete,
    onCopy,
    onRemix,
    isCopied,
    copyOptions,
    setCopyOptions
}) => {
    const title = mode === 'history' ? 'GENERATE HISTORY' : 'FAVORITE PROMPTS';
    const Icon = mode === 'history' ? Clock : Heart;

    // Theme Colors
    const themeColor = mode === 'favorites' ? '#f43f5e' : '#00f2ff';

    const filteredList = mode === 'favorites'
        ? history.filter(item => item.isFavorite)
        : history;

    // ESC key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSingleCopy = (item: HistoryItem, index: number) => {
        const parts = [];
        if (copyOptions.costume && item.costume) parts.push(item.costume.replace(/\n/g, ' '));
        if (copyOptions.pose && item.composition) parts.push(item.composition.replace(/\n/g, ' '));
        if (copyOptions.framing && item.framing) parts.push(item.framing.replace(/\n/g, ' '));
        if (copyOptions.scene && item.scene) parts.push(item.scene.replace(/\n/g, ' '));

        const textToCopy = parts.length > 0 ? parts.join(', ') : item.prompt.replace(/\n/g, ' ');
        onCopy(textToCopy, index + 40000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 10000,
                        backgroundColor: 'rgba(2, 4, 6, 0.98)',
                        backdropFilter: 'blur(40px)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    {/* Background Grid Pattern */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.02) 1px, transparent 0)',
                        backgroundSize: '30px 30px',
                        pointerEvents: 'none'
                    }} />

                    {/* Header */}
                    <header style={{
                        padding: '2rem 4rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        position: 'relative',
                        zIndex: 10,
                        backgroundColor: 'rgba(2, 4, 6, 0.5)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
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
                                戻る
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
                                    <p style={{ margin: '4px 0 0', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: '0.2em' }}>
                                        {filteredList.length} 件のアイテムが見つかりました
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Copy Options in Header */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '1.5rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '14px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginRight: '0.5rem' }}>COPY SETTINGS:</span>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={copyOptions.costume}
                                    onChange={() => setCopyOptions(prev => ({ ...prev, costume: !prev.costume }))}
                                    style={{ accentColor: themeColor, width: '14px', height: '14px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: copyOptions.costume ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>衣装</span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={copyOptions.pose}
                                    onChange={() => setCopyOptions(prev => ({ ...prev, pose: !prev.pose }))}
                                    style={{ accentColor: themeColor, width: '14px', height: '14px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: copyOptions.pose ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>ポーズ</span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={copyOptions.framing}
                                    onChange={() => setCopyOptions(prev => ({ ...prev, framing: !prev.framing }))}
                                    style={{ accentColor: themeColor, width: '14px', height: '14px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: copyOptions.framing ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>構図</span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={copyOptions.scene}
                                    onChange={() => setCopyOptions(prev => ({ ...prev, scene: !prev.scene }))}
                                    style={{ accentColor: themeColor, width: '14px', height: '14px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: copyOptions.scene ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>SCENE</span>
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
                    </header>

                    {/* Vertical Grid Content */}
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
                                    記録がありません
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
                                        className="result-card"
                                        style={{
                                            borderTop: `4px solid ${themeColor}`,
                                            borderColor: item.isFavorite && mode === 'history' ? '#f43f5e' : undefined
                                        }}
                                    >
                                        <div className="card-number">
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>

                                        {/* Card Actions Row (Non-absolute to prevent overlap) */}
                                        <div style={{
                                            padding: '1rem 1.25rem 0',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            zIndex: 20
                                        }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <button
                                                    onClick={() => onRemix(item)}
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
                                                    <span>派生を作る</span>
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

                                            <div style={{ display: 'flex', gap: '0.4rem' }}>
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
                                                        <span style={{ fontSize: '0.4rem', color: '#f43f5e', fontWeight: 900, textTransform: 'uppercase' }}>SEXY</span>
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
                                                        <span style={{ fontSize: '0.4rem', color: '#eab308', fontWeight: 900, textTransform: 'uppercase' }}>ACC</span>
                                                        <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 900, lineHeight: 1 }}>{item.accessoryLevel}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="card-content">
                                            <h3 className="card-desc" style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                                                {item.description.replace(/^[:：\s]+/, '')}
                                            </h3>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                                {item.costume && (
                                                    <div className="tag-container" style={{ margin: 0 }}>
                                                        <span style={{ fontSize: '0.45rem', fontWeight: 900, color: 'rgba(249, 115, 22, 0.5)', textTransform: 'uppercase', marginRight: '4px' }}>OUTFIT</span>
                                                        {item.costume.split(',').slice(0, 2).map((t, i) => (
                                                            <span key={i} className="mini-tag">{t.trim()}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.composition && (
                                                    <div className="tag-container" style={{ margin: 0 }}>
                                                        <span style={{ fontSize: '0.45rem', fontWeight: 900, color: 'rgba(148, 163, 184, 0.5)', textTransform: 'uppercase', marginRight: '4px' }}>POSE</span>
                                                        {item.composition.split(',').slice(0, 2).map((t, i) => (
                                                            <span key={i} className="mini-tag" style={{ color: '#94a3b8', borderStyle: 'dotted' }}>{t.trim()}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.framing && (
                                                    <div className="tag-container" style={{ margin: 0 }}>
                                                        <span style={{ fontSize: '0.45rem', fontWeight: 900, color: 'rgba(167, 139, 250, 0.5)', textTransform: 'uppercase', marginRight: '4px' }}>FRAMING</span>
                                                        {item.framing.split(',').slice(0, 2).map((t, i) => (
                                                            <span key={i} className="mini-tag" style={{ color: '#a78bfa', borderStyle: 'dotted' }}>{t.trim()}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.scene && (
                                                    <div className="tag-container" style={{ margin: 0 }}>
                                                        <span style={{ fontSize: '0.45rem', fontWeight: 900, color: 'rgba(0, 242, 255, 0.5)', textTransform: 'uppercase', marginRight: '4px' }}>SCENE</span>
                                                        {item.scene.split(',').slice(0, 2).map((t, i) => (
                                                            <span key={i} className="mini-tag" style={{ color: '#00f2ff', borderStyle: 'dotted' }}>{t.trim()}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Primary Copy Selected Action */}
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

                                        <button
                                            onClick={() => onCopy(item.prompt.replace(/\n/g, ' '), idx + 60000)}
                                            className={`btn-card-footer ${isCopied === idx + 60000 ? 'copied' : ''}`}
                                        >
                                            {isCopied === idx + 60000 ? <Check size={14} /> : <Copy size={14} />}
                                            {isCopied === idx + 60000 ? 'COPIED ALL' : 'FULL PROMPT'}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </main>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
