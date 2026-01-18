import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Layers, Star, Trash2, Activity, Copy } from 'lucide-react';
import { type HistoryItem } from '../../types';

interface ArchiveSectionProps {
    history: HistoryItem[];
    filteredHistory: HistoryItem[];
    historySearch: string;
    setHistorySearch: (val: string) => void;
    isArchiveCompact: boolean;
    setIsArchiveCompact: (val: boolean) => void;
    historyFilter: 'all' | 'favorites';
    setHistoryFilter: (val: 'all' | 'favorites') => void;
    onToggleFavorite: (id: string) => void;
    onDeleteHistoryItem: (id: string) => void;
    onClearHistory: () => void;
}

export const ArchiveSection: React.FC<ArchiveSectionProps> = ({
    history,
    filteredHistory,
    historySearch,
    setHistorySearch,
    isArchiveCompact,
    setIsArchiveCompact,
    historyFilter,
    setHistoryFilter,
    onToggleFavorite,
    onDeleteHistoryItem,
    onClearHistory
}) => {
    return (
        <section id="archive-core" className="mt-60 border-t border-white/5 pt-32 mb-40">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 gap-8">
                <div>
                    <span className="title-sub">PERSISTENT STORAGE</span>
                    <h2 className="title-main text-5xl md:text-7xl m-0 leading-none">アーカイブ・コア</h2>
                    <p className="text-[10px] text-slate-500 mt-4 font-bold tracking-[0.2em] uppercase">
                        Total Assets: {history.length} / Filtered: {filteredHistory.length}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/40" size={16} />
                        <input
                            type="text"
                            placeholder="履歴から検索..."
                            value={historySearch}
                            onChange={(e) => setHistorySearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-xs focus:border-cyan-400 focus:bg-cyan-400/5 outline-none transition-all text-white placeholder:text-white/20"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsArchiveCompact(!isArchiveCompact)}
                            className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border transition-all rounded-lg flex items-center gap-2 ${isArchiveCompact ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400' : 'text-white/20 border-white/10 hover:border-white/30'}`}
                            title="表示切り替え"
                        >
                            <Layers size={14} />
                            {isArchiveCompact ? '標準表示' : 'コンパクト'}
                        </button>
                        <button
                            onClick={() => setHistoryFilter('all')}
                            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border transition-all rounded-lg ${historyFilter === 'all' ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_20px_rgba(0,242,255,0.3)]' : 'text-white/40 border-white/10 hover:border-white/30'}`}
                        >
                            全履歴
                        </button>
                        <button
                            onClick={() => setHistoryFilter('favorites')}
                            className={`px-6 py-3 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border transition-all rounded-lg ${historyFilter === 'favorites' ? 'bg-cyan-600 text-black border-cyan-500 shadow-[0_0_20px_rgba(0,242,255,0.3)]' : 'text-white/40 border-white/10 hover:border-white/30'}`}
                        >
                            <Star size={12} fill={historyFilter === 'favorites' ? "currentColor" : "none"} />
                            お気に入り
                        </button>
                        <button
                            onClick={onClearHistory}
                            className="px-4 py-3 text-white/20 border border-white/10 hover:border-red-500/50 hover:text-red-500 transition-all rounded-lg"
                            title="履歴全削除"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <div className={isArchiveCompact ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4" : "lookbook-container"}>
                {filteredHistory.length === 0 ? (
                    <div className="col-span-full h-[400px] border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center opacity-20 text-center">
                        <Activity size={48} className="mb-4 mx-auto" />
                        <p className="text-sm uppercase tracking-[0.4em] font-black">
                            {historySearch ? '検索結果が見つかりません' : (historyFilter === 'favorites' ? 'お気に入りはまだありません' : '履歴データが見つかりません')}
                        </p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredHistory.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`lookbook-card group bg-white/[0.01] ${isArchiveCompact ? '!p-4 !m-0 overflow-hidden' : ''}`}
                            >
                                <div className={`flex justify-between items-start ${isArchiveCompact ? 'mb-2' : 'mb-6'}`}>
                                    <span className="text-[9px] font-mono text-cyan-400/20">
                                        {isArchiveCompact ? new Date(item.timestamp).toLocaleDateString() : new Date(item.timestamp).toLocaleString()}
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => onToggleFavorite(item.id)}
                                            className={`p-1.5 transition-all ${item.isFavorite ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]' : 'text-white/20 hover:text-white'}`}
                                        >
                                            <Star size={isArchiveCompact ? 14 : 18} fill={item.isFavorite ? "currentColor" : "none"} />
                                        </button>
                                        <button
                                            onClick={() => onDeleteHistoryItem(item.id)}
                                            className="p-1.5 text-white/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={isArchiveCompact ? 14 : 18} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className={`archive-desc !mb-3 ${isArchiveCompact ? 'text-xs line-clamp-1' : 'text-2xl !mb-4'}`}>{item.description}</h3>
                                {!isArchiveCompact && (
                                    <div className="archive-prompt text-[10px] mb-8 line-clamp-4 hover:line-clamp-none cursor-pointer">
                                        {item.prompt}
                                    </div>
                                )}
                                <button
                                    onClick={() => navigator.clipboard.writeText(item.prompt)}
                                    className={`w-full flex items-center justify-center gap-3 border border-white/5 bg-white/[0.03] font-black uppercase tracking-widest hover:bg-cyan-600 hover:text-black hover:border-cyan-400 transition-all rounded-lg ${isArchiveCompact ? 'py-2 text-[8px]' : 'py-4 text-[9px]'}`}
                                >
                                    <Copy size={isArchiveCompact ? 10 : 12} /> {isArchiveCompact ? 'COPY' : 'プロンプトをコピー'}
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </section>
    );
};
