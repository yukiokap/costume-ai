import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Sparkles, Heart } from 'lucide-react';
import { type GeneratedPrompt, type HistoryItem } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import './Results.css';

interface ResultsSectionProps {
    generatedPrompts: GeneratedPrompt[];
    isGenerating: boolean;
    synthesisLogs: string[];
    isCopied: number | null;
    isAllCopied: boolean;
    history: HistoryItem[];
    onCopyAll: () => void;
    onCopy: (text: string, index: number) => void;
    onToggleFavorite: (id: string) => void;
    onGenerateRange: (referencePrompt: string) => void;
    onRemix: (item: HistoryItem) => void;
    copyOptions: { costume: boolean; pose: boolean; framing: boolean; scene: boolean };
    setCopyOptions: React.Dispatch<React.SetStateAction<{ costume: boolean; pose: boolean; framing: boolean; scene: boolean }>>;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
    generatedPrompts,
    isGenerating,
    onCopy,
    onCopyAll,
    isCopied,
    isAllCopied,
    history,
    onToggleFavorite,
    onRemix,
    copyOptions,
    setCopyOptions
}) => {
    const { t } = useLanguage();

    const handleSingleCopy = (item: GeneratedPrompt, index: number) => {
        const parts = [];
        if (copyOptions.costume && item.costume) parts.push(item.costume.replace(/\n/g, ' '));
        if (copyOptions.pose && item.composition) parts.push(item.composition.replace(/\n/g, ' '));
        if (copyOptions.framing && item.framing) parts.push(item.framing.replace(/\n/g, ' '));
        if (copyOptions.scene && item.scene) parts.push(item.scene.replace(/\n/g, ' '));

        const textToCopy = parts.length > 0 ? parts.join(', ') : item.prompt.replace(/\n/g, ' ');
        onCopy(textToCopy, index + 40000);
    };

    return (
        <div className="results-wrapper">
            {isGenerating && (
                <div className="loading-container">
                    <Sparkles size={48} className="animate-spin-slow" style={{ marginBottom: '1rem' }} />
                    <p style={{ fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        GENERATING NEW STYLES...
                    </p>
                </div>
            )}

            {!isGenerating && generatedPrompts.length > 0 && (
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="results-header" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        paddingBottom: '1.5rem'
                    }}>
                        <h2 className="results-title" style={{ margin: 0 }}>
                            <Sparkles size={16} /> Generated Collection
                        </h2>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginRight: '0.2rem' }}>
                                    {t('results.copy_settings_label')}
                                </span>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={copyOptions.costume}
                                        onChange={() => setCopyOptions(prev => ({ ...prev, costume: !prev.costume }))}
                                        style={{ accentColor: '#f97316', width: '14px', height: '14px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: copyOptions.costume ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{t('common.costume')}</span>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={copyOptions.pose}
                                        onChange={() => setCopyOptions(prev => ({ ...prev, pose: !prev.pose }))}
                                        style={{ accentColor: '#f97316', width: '14px', height: '14px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: copyOptions.pose ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{t('editor.pose')}</span>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={copyOptions.framing}
                                        onChange={() => setCopyOptions(prev => ({ ...prev, framing: !prev.framing }))}
                                        style={{ accentColor: '#f97316', width: '14px', height: '14px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: copyOptions.framing ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{t('editor.framing')}</span>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={copyOptions.scene}
                                        onChange={() => setCopyOptions(prev => ({ ...prev, scene: !prev.scene }))}
                                        style={{ accentColor: '#f97316', width: '14px', height: '14px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: copyOptions.scene ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>SCENE</span>
                                </label>
                            </div>

                            <button
                                onClick={onCopyAll}
                                className={`btn-copy-all ${isAllCopied ? 'copied' : ''}`}
                                style={{ minWidth: '120px', height: '40px' }}
                            >
                                {isAllCopied ? <Check size={14} /> : <Copy size={14} />}
                                {isAllCopied ? 'COPIED' : 'COPY ALL'}
                            </button>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="results-grid">
                        <AnimatePresence>
                            {generatedPrompts.map((item, index) => {
                                const historyItem = history.find(h => h.id === item.id);
                                const isFavorite = historyItem?.isFavorite || false;

                                return (
                                    <motion.div
                                        key={item.id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="result-card"
                                    >
                                        <div className="card-number">
                                            {String(index + 1).padStart(2, '0')}
                                        </div>

                                        {/* Result Card Header (Actions Row) */}
                                        <div style={{
                                            padding: '1rem 1.25rem 0',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            zIndex: 20
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (historyItem) onRemix(historyItem);
                                                    }}
                                                    style={{
                                                        background: 'rgba(234, 179, 8, 0.12)',
                                                        border: '1px solid rgba(234, 179, 8, 0.3)',
                                                        borderRadius: '10px',
                                                        padding: '0 12px',
                                                        height: '38px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px',
                                                        color: '#eab308',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        backdropFilter: 'blur(8px)',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 900,
                                                        letterSpacing: '0.05em'
                                                    }}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                                                    <span>派生を作る</span>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (item.id) onToggleFavorite(item.id);
                                                    }}
                                                    style={{
                                                        background: 'rgba(0,0,0,0.5)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: '10px',
                                                        width: '38px',
                                                        height: '38px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        color: isFavorite ? '#f43f5e' : 'rgba(255,255,255,0.2)',
                                                        transition: 'all 0.2s ease',
                                                        backdropFilter: 'blur(8px)'
                                                    }}
                                                >
                                                    <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                                                </button>
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                                                {item.sexyLevel !== undefined && (
                                                    <div style={{
                                                        backgroundColor: 'rgba(244, 63, 94, 0.12)',
                                                        border: '1px solid rgba(244, 63, 94, 0.3)',
                                                        borderRadius: '8px',
                                                        padding: '2px 8px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        minWidth: '45px'
                                                    }}>
                                                        <span style={{ fontSize: '0.45rem', color: '#f43f5e', fontWeight: 900, textTransform: 'uppercase' }}>SEXY</span>
                                                        <span style={{ fontSize: '1rem', color: '#fff', fontWeight: 900, lineHeight: 1 }}>{item.sexyLevel}</span>
                                                    </div>
                                                )}
                                                {item.accessoryLevel !== undefined && (
                                                    <div style={{
                                                        backgroundColor: 'rgba(234, 179, 8, 0.12)',
                                                        border: '1px solid rgba(234, 179, 8, 0.3)',
                                                        borderRadius: '8px',
                                                        padding: '2px 8px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        minWidth: '45px'
                                                    }}>
                                                        <span style={{ fontSize: '0.45rem', color: '#eab308', fontWeight: 900, textTransform: 'uppercase' }}>ACC</span>
                                                        <span style={{ fontSize: '1rem', color: '#fff', fontWeight: 900, lineHeight: 1 }}>{item.accessoryLevel}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="card-content">
                                            <div>
                                                <h3 className="card-desc" style={{ marginTop: '0.25rem' }}>
                                                    {item.description.replace(/^[:：\s]+/, '')}
                                                </h3>

                                                {/* Tags */}
                                                <div className="tag-container" style={{ marginBottom: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.55rem', color: 'rgba(249, 115, 22, 0.5)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '0.5rem' }}>OUTFIT</span>
                                                    {item.costume?.split(',').slice(0, 3).map((tag, i) => (
                                                        <span key={i} className="mini-tag">{tag.trim()}</span>
                                                    ))}
                                                </div>

                                                <div className="tag-container" style={{ marginBottom: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.55rem', color: 'rgba(148, 163, 184, 0.5)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '0.5rem' }}>POSE</span>
                                                    {item.composition?.split(',').slice(0, 3).map((tag, i) => (
                                                        <span key={i} className="mini-tag" style={{ color: '#94a3b8', borderColor: 'rgba(255,255,255,0.05)' }}>{tag.trim()}</span>
                                                    ))}
                                                </div>

                                                <div className="tag-container" style={{ marginBottom: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.55rem', color: 'rgba(167, 139, 250, 0.5)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '0.5rem' }}>FRAMING</span>
                                                    {item.framing?.split(',').slice(0, 3).map((tag, i) => (
                                                        <span key={i} className="mini-tag" style={{ color: '#a78bfa', borderColor: 'rgba(167, 139, 250, 0.1)' }}>{tag.trim()}</span>
                                                    ))}
                                                </div>

                                                {item.scene && (
                                                    <div className="tag-container">
                                                        <span style={{ fontSize: '0.55rem', color: 'rgba(10, 242, 255, 0.5)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '0.5rem' }}>SCENE</span>
                                                        {item.scene?.split(',').slice(0, 3).map((tag, i) => (
                                                            <span key={i} className="mini-tag" style={{ color: '#00f2ff', borderColor: 'rgba(0, 242, 255, 0.1)' }}>{tag.trim()}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Primary Copy Selected Action */}
                                            <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                                                <button
                                                    onClick={() => handleSingleCopy(item, index)}
                                                    className={`btn-action-primary ${isCopied === index + 40000 ? 'copied' : ''}`}
                                                    style={{
                                                        width: '100%',
                                                        padding: '1.2rem',
                                                        backgroundColor: isCopied === index + 40000 ? '#10b981' : 'rgba(0, 242, 255, 0.05)',
                                                        border: `1px solid ${isCopied === index + 40000 ? '#10b981' : 'rgba(0, 242, 255, 0.2)'}`,
                                                        borderRadius: '12px',
                                                        color: isCopied === index + 40000 ? '#000' : '#00f2ff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '12px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 800,
                                                        letterSpacing: '0.15em',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    {isCopied === index + 40000 ? <Check size={18} /> : <Copy size={18} />}
                                                    <span>{isCopied === index + 40000 ? 'COPIED' : 'COPY SELECTED'}</span>
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => onCopy(item.prompt.replace(/\n/g, ' '), index + 60000)}
                                            className={`btn-card-footer ${isCopied === index + 60000 ? 'copied' : ''}`}
                                        >
                                            {isCopied === index + 60000 ? <Check size={12} /> : <Copy size={12} />}
                                            {isCopied === index + 60000 ? 'COPIED ALL' : 'FULL PROMPT'}
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};
