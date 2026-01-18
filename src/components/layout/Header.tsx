import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ChevronDown, Zap, ExternalLink, Activity, Star } from 'lucide-react';

interface HeaderProps {
    apiKey: string;
    saveApiKey: (key: string) => void;
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
    onNavigateHistory: (filter: 'all' | 'favorites') => void;
}

export const Header: React.FC<HeaderProps> = ({
    apiKey,
    saveApiKey,
    showSettings,
    setShowSettings,
    onNavigateHistory
}) => {
    return (
        <header className="flex justify-between items-baseline mb-20 relative z-[60]">
            <div className="text-white">
                <span className="title-sub">AI COSTUME GENERATOR</span>
                <h1 className="title-main">costumeAI</h1>
            </div>

            <div className="flex gap-4 items-center">
                <div className="relative">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`flex items-center gap-2 px-6 py-2 border text-[10px] font-black uppercase tracking-[0.4em] transition-all ${showSettings ? 'bg-cyan-600 border-cyan-400 text-black shadow-[0_0_20px_rgba(0,242,255,0.4)]' : 'text-cyan-400/50 border-cyan-400/20 hover:border-cyan-400/40 hover:text-cyan-400'
                            }`}
                    >
                        <Cpu size={12} />
                        設定
                        <ChevronDown size={12} className={`transition-transform ${showSettings ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {showSettings && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-4 w-[400px] studio-panel border-amber-600/50 shadow-2xl z-[70] p-6 space-y-6"
                            >
                                <div className="flex items-center gap-3 text-cyan-400 mb-2">
                                    <Zap size={18} />
                                    <span className="text-[11px] font-black uppercase tracking-widest">はじめるための準備</span>
                                </div>

                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    このアプリは、Googleの人工知能（Gemini AI）を使って衣装のアイデアを考えます。
                                    使うためには、自分専用の<strong>「カギ（APIキー）」</strong>を1つ作る必要があります。
                                </p>

                                <div className="space-y-4">
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                        <p className="text-[10px] font-bold text-white mb-2">💡 取得のステップ：</p>
                                        <ol className="text-[9px] text-slate-400 space-y-1 list-decimal list-inside">
                                            <li>下のボタンからGoogleのサイトへ行く</li>
                                            <li>「Create API key」という青いボタンを押す</li>
                                            <li>出てきた長い英数字をコピーして、ここにはる！</li>
                                        </ol>
                                    </div>

                                    <a
                                        href="https://aistudio.google.com/app/apikey"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between w-full p-3 bg-cyan-600/10 border border-cyan-400/50 hover:bg-cyan-600 hover:text-black transition-all group rounded-lg"
                                    >
                                        <span className="text-[9px] font-black uppercase tracking-widest">カギを作りに行く（無料・約3分）</span>
                                        <ExternalLink size={12} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                </div>

                                <div className="space-y-2">
                                    <div className="field-label m-0 text-[10px]">ここに貼り付けてね（APIキー）</div>
                                    <input
                                        type="password" value={apiKey} placeholder="例: AIzaSyA..."
                                        onChange={(e) => saveApiKey(e.target.value)}
                                        className="studio-input text-sm p-3 font-mono tracking-widest"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => setShowSettings(false)} className="btn-tailor py-3 text-[10px]">保存して完了！</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    onClick={() => onNavigateHistory('all')}
                    className="flex items-center gap-2 px-4 py-2 text-cyan-400/50 hover:text-cyan-400 transition-colors text-[10px] font-black uppercase tracking-[0.4em]"
                >
                    <Activity size={16} />
                    履歴
                </button>

                <button
                    onClick={() => onNavigateHistory('favorites')}
                    className="flex items-center gap-2 px-6 py-2 bg-cyan-600/10 border border-cyan-400/20 text-cyan-400 hover:bg-cyan-600 hover:text-black transition-all text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-[0_0_15px_rgba(0,242,255,0.1)]"
                >
                    <Star size={16} fill="currentColor" />
                    お気に入り
                </button>
            </div>
        </header>
    );
};
