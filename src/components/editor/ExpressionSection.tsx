import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Search, X } from 'lucide-react';
import { EXPRESSION_CATEGORIES, EXPRESSION_SETTINGS } from '../../constants';
import { SectionDivider } from '../ui/SectionDivider';

interface ExpressionSectionProps {
    selectedExpression: string;
    setSelectedExpression: (val: string) => void;
    expressionCategory: string;
    setExpressionCategory: (val: string) => void;
    isExpressionVaultOpen: boolean;
    setIsExpressionVaultOpen: (val: boolean) => void;
    expressionKeyword: string;
    setExpressionKeyword: (val: string) => void;
    filteredExpressions: typeof EXPRESSION_SETTINGS;
}

export const ExpressionSection: React.FC<ExpressionSectionProps> = ({
    selectedExpression,
    setSelectedExpression,
    expressionCategory,
    setExpressionCategory,
    isExpressionVaultOpen,
    setIsExpressionVaultOpen,
    expressionKeyword,
    setExpressionKeyword,
    filteredExpressions
}) => {
    const currentExpression = EXPRESSION_SETTINGS.find(e => e.id === selectedExpression);

    return (
        <div className="space-y-6" style={{ '--section-color': '#ec4899' } as React.CSSProperties}>
            <SectionDivider label="04: 表情・感情の設定" color="violet" />

            <section>
                <div className="flex justify-between items-baseline mb-6">
                    <div className="field-label m-0" style={{ color: '#ec4899' }}>
                        <Smile size={12} style={{ color: '#ec4899' }} /> 表情選択
                    </div>
                    <span className="text-[10px] font-black opacity-50 uppercase">Facial Expression</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <div className="field-label" style={{ color: '#ec4899' }}>
                            <Smile size={12} style={{ color: '#ec4899' }} /> カテゴリー
                        </div>
                        <select
                            value={expressionCategory}
                            onChange={(e) => { setExpressionCategory(e.target.value); setSelectedExpression('smile'); }}
                            className="studio-input cursor-pointer"
                            style={{
                                borderColor: 'rgba(236, 72, 153, 0.3)',
                                backgroundColor: 'rgba(236, 72, 153, 0.05)'
                            }}
                        >
                            <option value="all">-- すべて --</option>
                            {EXPRESSION_CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div className="field-label" style={{ color: '#ec4899' }}>
                            <Smile size={12} style={{ color: '#ec4899' }} /> 表情
                        </div>
                        <select
                            value={selectedExpression}
                            onChange={(e) => setSelectedExpression(e.target.value)}
                            className="studio-input cursor-pointer"
                            style={{
                                borderColor: 'rgba(236, 72, 153, 0.3)',
                                backgroundColor: 'rgba(236, 72, 153, 0.05)'
                            }}
                        >
                            <option value="">{filteredExpressions.length} 点から選択</option>
                            {filteredExpressions.map(exp => (
                                <option key={exp.id} value={exp.id}>{exp.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={() => setIsExpressionVaultOpen(!isExpressionVaultOpen)}
                    className={`w-full mt-2 mb-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all border border-dashed rounded flex items-center justify-center gap-2`}
                    style={{
                        backgroundColor: isExpressionVaultOpen ? '#ec4899' : 'transparent',
                        borderColor: isExpressionVaultOpen ? '#ec4899' : 'rgba(255,255,255,0.1)',
                        color: isExpressionVaultOpen ? '#fff' : 'rgba(236, 72, 153, 0.4)',
                        boxShadow: isExpressionVaultOpen ? '0 0 15px rgba(236,72,153,0.3)' : 'none'
                    }}
                >
                    <Smile size={10} /> {isExpressionVaultOpen ? 'アーカイブを閉じる' : '表情アーカイブを開く'}
                </button>

                <AnimatePresence>
                    {isExpressionVaultOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-6"
                        >
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#ec4899' }}>
                                        Expression Archive
                                    </span>
                                    <button onClick={() => setIsExpressionVaultOpen(false)} className="text-white/20 hover:text-white">
                                        <X size={14} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    <button
                                        onClick={() => setExpressionCategory('all')}
                                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all`}
                                        style={{
                                            backgroundColor: expressionCategory === 'all' ? '#ec4899' : 'transparent',
                                            color: expressionCategory === 'all' ? '#fff' : 'rgb(148, 163, 184)',
                                            boxShadow: expressionCategory === 'all' ? '0 0 10px rgba(236,72,153,0.3)' : 'none'
                                        }}
                                    >
                                        すべて
                                    </button>
                                    {EXPRESSION_CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setExpressionCategory(cat.id)}
                                            className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all`}
                                            style={{
                                                backgroundColor: expressionCategory === cat.id ? '#ec4899' : 'transparent',
                                                color: expressionCategory === cat.id ? '#fff' : 'rgb(148, 163, 184)',
                                                boxShadow: expressionCategory === cat.id ? '0 0 10px rgba(236,72,153,0.3)' : 'none'
                                            }}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={14} style={{ color: '#ec4899' }} />
                                    <input
                                        type="text"
                                        placeholder="表情を検索..."
                                        value={expressionKeyword}
                                        onChange={(e) => setExpressionKeyword(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs outline-none text-white placeholder:text-white/20"
                                        style={{ borderColor: 'rgba(236, 72, 153, 0.2)' }}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                                    {filteredExpressions.map(exp => (
                                        <button
                                            key={exp.id}
                                            onClick={() => {
                                                setSelectedExpression(exp.id);
                                                setIsExpressionVaultOpen(false);
                                            }}
                                            className={`text-left p-3 border rounded-lg transition-all`}
                                            style={{
                                                backgroundColor: selectedExpression === exp.id ? '#ec4899' : 'rgba(255,255,255,0.05)',
                                                borderColor: selectedExpression === exp.id ? '#ec4899' : 'rgba(255,255,255,0.05)',
                                                color: selectedExpression === exp.id ? '#fff' : 'rgb(148, 163, 184)',
                                                boxShadow: selectedExpression === exp.id ? '0 0 15px rgba(236,72,153,0.2)' : 'none'
                                            }}
                                        >
                                            <div className="text-[10px] font-black uppercase mb-1 truncate">{exp.label}</div>
                                            <div className="text-[8px] opacity-40 line-clamp-1">{exp.prompt}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {currentExpression && (
                    <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="text-[10px] font-black uppercase mb-2" style={{ color: '#ec4899' }}>
                            選択中: {currentExpression.label}
                        </div>
                        <div className="text-[9px] text-slate-400 leading-relaxed">
                            {currentExpression.prompt}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};
