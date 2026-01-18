import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Star, Binary, Cpu } from 'lucide-react';
import { type GeneratedPrompt, type HistoryItem } from '../../types';

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
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
    generatedPrompts,
    isGenerating,
    synthesisLogs,
    isCopied,
    isAllCopied,
    history,
    onCopyAll,
    onCopy,
    onToggleFavorite,
    onGenerateRange
}) => {
    return (
        <div id="archive" className="space-y-12">
            {generatedPrompts.length > 0 ? (
                <div className="flex flex-col gap-8">
                    <div className="flex justify-end">
                        <button
                            onClick={onCopyAll}
                            className={`flex items-center gap-2 px-6 py-3 border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all bg-cyan-600/10 border-cyan-600/50 text-cyan-400 hover:bg-cyan-600 hover:text-black ${isAllCopied ? 'bg-cyan-400 border-cyan-400 text-black' : ''}`}
                        >
                            <Copy size={12} />
                            {isAllCopied ? '全プロンプトを捕捉完了' : 'すべてのプロンプトをコピー'}
                        </button>
                    </div>
                    <div className="lookbook-container m-0">
                        <AnimatePresence mode="popLayout">
                            {generatedPrompts.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="lookbook-card group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="archive-desc">{item.description}</div>
                                        <button
                                            onClick={() => item.id && onToggleFavorite(item.id)}
                                            className={`p-2 transition-all ${item.id && history.find(h => h.id === item.id)?.isFavorite ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]' : 'text-white/20 hover:text-white opacity-0 group-hover:opacity-100'}`}
                                        >
                                            <Star size={20} fill={item.id && history.find(h => h.id === item.id)?.isFavorite ? "currentColor" : "none"} />
                                        </button>
                                    </div>
                                    <div className="archive-prompt select-all">{item.prompt}</div>
                                    <div className="flex flex-col gap-2 mt-4">
                                        <button
                                            onClick={() => onCopy(item.prompt, index)}
                                            className={`w-full py-4 font-black uppercase tracking-[0.2em] text-[10px] border transition-all ${isCopied === index ? 'bg-cyan-600 border-cyan-600 text-black' : 'bg-black text-white hover:bg-cyan-900 border-white/10'}`}
                                        >
                                            {isCopied === index ? 'コピー完了' : 'プロンプトをコピー'}
                                        </button>
                                        <button
                                            onClick={() => onGenerateRange(item.prompt)}
                                            disabled={isGenerating}
                                            className="w-full py-3 flex items-center justify-center gap-2 font-black uppercase tracking-[0.1em] text-[9px] bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all"
                                        >
                                            <Binary size={12} />
                                            この衣装で1~10段階進化
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                isGenerating ? (
                    <div className="h-[600px] studio-panel flex flex-col items-center justify-center text-cyan-400 bg-black/40 overflow-hidden relative">
                        <div className="scanning-line" />
                        <Binary size={64} className="mb-8 pulse-glow" />
                        <div className="text-center space-y-4 font-mono">
                            <p className="font-black tracking-[0.5em] uppercase text-sm">Design Synthesis Active</p>
                            <div className="flex flex-col gap-1 items-start max-w-[300px] mx-auto opacity-60">
                                {synthesisLogs.map((log, i) => (
                                    <div key={i} className="text-[10px] animate-in fade-in slide-in-from-left-4 duration-300">
                                        {`>> ${log}`}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-[600px] border border-dashed border-cyan-400/20 flex flex-col items-center justify-center opacity-30 text-cyan-400">
                        <Cpu size={64} className="mb-6 fade-pulse" />
                        <p className="font-bold tracking-[0.5em] uppercase">生成待機中...</p>
                    </div>
                )
            )}
        </div>
    );
};
