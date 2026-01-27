import React, { useRef, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Sparkles, Heart } from 'lucide-react';
import { type GeneratedPrompt, type HistoryItem } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEditor } from '../../contexts/EditorContext';
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
    copyOptions: { costume: boolean; character: boolean; pose: boolean; framing: boolean; scene: boolean };
    setCopyOptions: React.Dispatch<React.SetStateAction<{ costume: boolean; character: boolean; pose: boolean; framing: boolean; scene: boolean }>>;
}

const DETAIL_LABELS: Record<string, string> = {
    c01: '01: 衣装の設定 / COSTUME',
    c02: '02: 具体的な姿勢 / POSE STANCE',
    c03: '03: 表情・感情の設定 / EXPRESSION',
    c04: '04: 構図の設定 / FRAMING',
    c05: '05: 背景の設定 / SCENE',
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
    } else if (type === 'scene') {
        displayVal = (t(`editor.scene_presets.${displayVal}`) || displayVal);
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

export const ResultsSection: React.FC<ResultsSectionProps> = ({
    generatedPrompts,
    isGenerating,
    onCopy,
    onCopyAll,
    isCopied,
    isAllCopied,
    history,
    synthesisLogs,
    onToggleFavorite,
    copyOptions,
    setCopyOptions
}) => {
    const { t } = useLanguage();
    const { applyRemix } = useEditor();
    const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

    const toggleDetails = (id: string) => {
        setExpandedDetails(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const logEndRef = useRef<HTMLDivElement>(null);

    const handleSingleCopy = (item: GeneratedPrompt, index: number) => {
        const parts = [];
        if (copyOptions.character && item.character) parts.push(item.character.replace(/\n/g, ' '));
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
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6rem 2rem',
                    gap: '2.5rem'
                }}>
                    <div className="animate-spin-slow">
                        <Sparkles size={60} color="#f97316" style={{ filter: 'drop-shadow(0 0 15px rgba(249, 115, 22, 0.4))' }} />
                    </div>

                    <div className="terminal-loader">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {synthesisLogs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="terminal-line"
                                >
                                    <span className="terminal-prefix">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                                    <span>{log}</span>
                                    {i === synthesisLogs.length - 1 && <span className="terminal-cursor" />}
                                </motion.div>
                            ))}
                            <div ref={logEndRef} />
                            {synthesisLogs.length === 0 && (
                                <div className="terminal-line">
                                    <span className="terminal-prefix">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                                    <span>INITIALIZING...</span>
                                    <span className="terminal-cursor" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        color: 'rgba(0, 242, 255, 0.4)',
                        letterSpacing: '0.4em',
                        textTransform: 'uppercase',
                        textAlign: 'center'
                    }}>
                        Synthesizing high-density aesthetic data
                    </div>
                </div>
            )}

            {!isGenerating && generatedPrompts.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="result-placeholder"
                >
                    <div className="placeholder-icon-circle">
                        <Sparkles size={40} color="rgba(255,255,255,0.2)" />
                        <div className="placeholder-scan-line" />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.4em', color: '#fff', textTransform: 'uppercase', marginBottom: '8px' }}>
                            COMMAND_WAITING
                        </h3>
                        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                            Configure your parameters above and initialize synthesis
                        </p>
                    </div>
                </motion.div>
            )}

            {!isGenerating && generatedPrompts.length > 0 && (
                <div className="flex flex-col gap-6">
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
                            flexWrap: 'wrap',
                            gap: '1rem',
                            marginTop: '0.5rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                flexWrap: 'wrap',
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
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: copyOptions.costume ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{t('results.tags.outfit')}</span>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={copyOptions.character}
                                        onChange={() => setCopyOptions(prev => ({ ...prev, character: !prev.character }))}
                                        style={{ accentColor: '#f97316', width: '14px', height: '14px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: copyOptions.character ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{t('results.tags.character')}</span>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={copyOptions.pose}
                                        onChange={() => setCopyOptions(prev => ({ ...prev, pose: !prev.pose }))}
                                        style={{ accentColor: '#f97316', width: '14px', height: '14px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: copyOptions.pose ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{t('results.tags.pose')}</span>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={copyOptions.framing}
                                        onChange={() => setCopyOptions(prev => ({ ...prev, framing: !prev.framing }))}
                                        style={{ accentColor: '#f97316', width: '14px', height: '14px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: copyOptions.framing ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{t('results.tags.framing')}</span>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={copyOptions.scene}
                                        onChange={() => setCopyOptions(prev => ({ ...prev, scene: !prev.scene }))}
                                        style={{ accentColor: '#f97316', width: '14px', height: '14px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: copyOptions.scene ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{t('results.tags.scene')}</span>
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
                                        className={`result-card ${item.isR18Mode ? 'r18-card-glow' : ''} ${item.isCharacterMode ? 'character-mode' : ''}`}
                                    >
                                        <div className="card-number">
                                            {String(index + 1).padStart(2, '0')}
                                        </div>

                                        <div style={{
                                            padding: '1rem 1.25rem 0.5rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexWrap: 'wrap',
                                            justifyContent: 'space-between',
                                            alignItems: 'stretch',
                                            gap: '0',
                                            zIndex: 20
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                flexWrap: 'wrap',
                                                marginBottom: '0.5rem'
                                            }}>
                                                <button
                                                    id={index === 0 ? "tour-remix-btn" : undefined}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (historyItem) applyRemix(historyItem);
                                                    }}
                                                    title="派生を作る / Remix"
                                                    style={{
                                                        background: 'rgba(234, 179, 8, 0.12)',
                                                        border: '1px solid rgba(234, 179, 8, 0.3)',
                                                        borderRadius: '10px',
                                                        padding: '0 10px',
                                                        height: '34px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '6px',
                                                        color: '#eab308',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        backdropFilter: 'blur(8px)',
                                                        fontSize: '0.65rem',
                                                        fontWeight: 900,
                                                        letterSpacing: '0.05em',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    <Sparkles size={12} />
                                                    <span>{t('common.remix')}</span>
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
                                                        width: '34px',
                                                        height: '34px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        color: isFavorite ? '#f43f5e' : 'rgba(255,255,255,0.2)',
                                                        transition: 'all 0.2s ease',
                                                        backdropFilter: 'blur(8px)'
                                                    }}
                                                >
                                                    <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                                                </button>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                gap: '0.4rem',
                                                flexWrap: 'wrap',
                                                justifyContent: 'flex-end'
                                            }}>
                                                {item.isR18Mode && (
                                                    <div style={{
                                                        backgroundColor: 'rgba(255, 0, 255, 0.1)',
                                                        border: '1px solid rgba(255, 0, 255, 0.2)',
                                                        borderRadius: '6px',
                                                        padding: '1px 6px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        minWidth: '38px',
                                                        backdropFilter: 'blur(4px)'
                                                    }}>
                                                        <span style={{ fontSize: '0.4rem', color: '#ff00ff', fontWeight: 900, opacity: 0.8 }}>R18</span>
                                                        <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 900, lineHeight: 1 }}>ON</span>
                                                    </div>
                                                )}
                                                {item.sexyLevel !== undefined && (
                                                    <div style={{
                                                        backgroundColor: 'rgba(244, 63, 94, 0.1)',
                                                        border: '1px solid rgba(244, 63, 94, 0.2)',
                                                        borderRadius: '6px',
                                                        padding: '1px 6px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        minWidth: '38px',
                                                        backdropFilter: 'blur(4px)'
                                                    }}>
                                                        <span style={{ fontSize: '0.4rem', color: '#f43f5e', fontWeight: 900, opacity: 0.8 }}>SEXY</span>
                                                        <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 900, lineHeight: 1 }}>{item.sexyLevel}</span>
                                                    </div>
                                                )}
                                                {item.accessoryLevel !== undefined && (
                                                    <div style={{
                                                        backgroundColor: 'rgba(234, 179, 8, 0.1)',
                                                        border: '1px solid rgba(234, 179, 8, 0.2)',
                                                        borderRadius: '6px',
                                                        padding: '1px 6px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        minWidth: '38px',
                                                        backdropFilter: 'blur(4px)'
                                                    }}>
                                                        <span style={{ fontSize: '0.4rem', color: '#eab308', fontWeight: 900, opacity: 0.8 }}>JEWEL</span>
                                                        <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 900, lineHeight: 1 }}>{item.accessoryLevel}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="card-content">
                                            <div>
                                                <h3 className="card-desc" style={{ marginTop: '0.25rem' }}>
                                                    {item.description.replace(/^[:\s\u30fb]+/, '')}
                                                </h3>



                                                {item.isCharacterMode && item.character && (
                                                    <div className="tag-container" style={{ marginBottom: '0.5rem' }}>
                                                        <span style={{ fontSize: '0.55rem', color: 'rgba(255, 0, 128, 0.5)', fontWeight: 900, letterSpacing: '0.05em', marginRight: '0.5rem' }}>{t('results.tags.character')}</span>
                                                        {item.character.split(',').slice(0, 3).map((tag, i) => (
                                                            <span key={i} className="mini-tag" style={{ color: '#ff0080', borderColor: 'rgba(255, 0, 128, 0.2)' }}>{tag.trim()}</span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="tag-container" style={{ marginBottom: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.55rem', color: 'rgba(249, 115, 22, 0.5)', fontWeight: 900, letterSpacing: '0.05em', marginRight: '0.5rem' }}>{t('results.tags.outfit')}</span>
                                                    {item.costume?.split(',').slice(0, 3).map((tag, i) => (
                                                        <span key={i} className="mini-tag">{tag.trim()}</span>
                                                    ))}
                                                </div>

                                                <div className="tag-container" style={{ marginBottom: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.55rem', color: 'rgba(148, 163, 184, 0.5)', fontWeight: 900, letterSpacing: '0.05em', marginRight: '0.5rem' }}>{t('results.tags.pose')}</span>
                                                    {item.composition?.split(',').slice(0, 3).map((tag, i) => (
                                                        <span key={i} className="mini-tag" style={{ color: '#94a3b8', borderColor: 'rgba(255,255,255,0.05)' }}>{tag.trim()}</span>
                                                    ))}
                                                </div>

                                                <div className="tag-container" style={{ marginBottom: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.55rem', color: 'rgba(167, 139, 250, 0.5)', fontWeight: 900, letterSpacing: '0.05em', marginRight: '0.5rem' }}>{t('results.tags.framing')}</span>
                                                    {item.framing?.split(',').slice(0, 3).map((tag, i) => (
                                                        <span key={i} className="mini-tag" style={{ color: '#a78bfa', borderColor: 'rgba(167, 139, 250, 0.1)' }}>{tag.trim()}</span>
                                                    ))}
                                                </div>

                                                {item.scene && (
                                                    <div className="tag-container" style={{ marginBottom: '1rem' }}>
                                                        <span style={{ fontSize: '0.55rem', color: 'rgba(10, 242, 255, 0.5)', fontWeight: 900, letterSpacing: '0.05em', marginRight: '0.5rem' }}>{t('results.tags.scene')}</span>
                                                        {item.scene?.split(',').slice(0, 3).map((tag, i) => (
                                                            <span key={i} className="mini-tag" style={{ color: '#00f2ff', borderColor: 'rgba(0, 242, 255, 0.1)' }}>{tag.trim()}</span>
                                                        ))}
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => toggleDetails(item.id || String(index))}
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
                                                    <Sparkles size={10} />
                                                    {expandedDetails[item.id || String(index)] ? '閉じる / HIDE' : '設定詳細を表示 / DETAILS'}
                                                </button>

                                                <AnimatePresence>
                                                    {expandedDetails[item.id || String(index)] && (
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
                                                                    },
                                                                    {
                                                                        section: 'c05',
                                                                        items: [
                                                                            { label: '背景設定', val: item.originalSceneId, type: 'scene' },
                                                                            { label: '自由記述', val: item.originalSceneDescription, type: 'text' }
                                                                        ]
                                                                    }
                                                                ].map((group, gIdx) => (
                                                                    <div key={gIdx} style={{ borderBottom: gIdx < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: gIdx < 4 ? '8px' : '0' }}>
                                                                        <div style={{ fontSize: '9px', fontWeight: 900, color: 'var(--cyan)', letterSpacing: '0.05em', marginBottom: '6px' }}>
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
