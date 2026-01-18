import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Layers, Image as ImageIcon, Search, X, User as UserIcon } from 'lucide-react';
import { BACKGROUND_CATEGORIES, POSE_CATEGORIES, type BACKGROUND_SETTINGS, type POSE_SETTINGS } from '../../constants';
import { SectionDivider } from '../ui/SectionDivider';

interface ScenePoseSectionProps {
    sexyLevel: number;
    setSexyLevel: (val: number) => void;
    poseDescription: string;
    setPoseDescription: (val: string) => void;
    bgCategory: string;
    setBgCategory: (val: string) => void;
    selectedBackground: string;
    setSelectedBackground: (val: string) => void;
    isBgVaultOpen: boolean;
    setIsBgVaultOpen: (val: boolean) => void;
    bgKeyword: string;
    setBgKeyword: (val: string) => void;
    filteredBackgrounds: typeof BACKGROUND_SETTINGS;
    poseCategory: string;
    setPoseCategory: (val: string) => void;
    selectedPose: string;
    setSelectedPose: (val: string) => void;
    isPoseVaultOpen: boolean;
    setIsPoseVaultOpen: (val: boolean) => void;
    poseKeyword: string;
    setPoseKeyword: (val: string) => void;
    filteredPoses: typeof POSE_SETTINGS;
}

export const ScenePoseSection: React.FC<ScenePoseSectionProps> = ({
    sexyLevel,
    setSexyLevel,
    poseDescription,
    setPoseDescription,
    bgCategory,
    setBgCategory,
    selectedBackground,
    setSelectedBackground,
    isBgVaultOpen,
    setIsBgVaultOpen,
    bgKeyword,
    setBgKeyword,
    filteredBackgrounds,
    poseCategory,
    setPoseCategory,
    selectedPose,
    setSelectedPose,
    isPoseVaultOpen,
    setIsPoseVaultOpen,
    poseKeyword,
    setPoseKeyword,
    filteredPoses
}) => {
    return (
        <div className="space-y-6" style={{ '--section-color': '#8b5cf6' } as React.CSSProperties}>
            <SectionDivider label="03: 背景とポーズの設定" color="violet" />

            <section className="col-span-1 md:col-span-2 bg-[#1a1b23]/50 border border-white/5 p-4 rounded-xl mb-4 relative overflow-hidden group shadow-xl">
                <div className="relative z-10">
                    <div className="flex-row justify-between items-center mb-1">
                        <div className="flex-row items-center gap-2">
                            <Activity size={12} className="text-violet-400" />
                            <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Evolution Engine</span>
                            <span className={`text-[9px] font-bold px-3 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 ml-2 ${sexyLevel > 7 ? 'text-red-400 border-red-500/30' : 'text-violet-400/70'}`}>
                                {sexyLevel <= 3 ? '控えめ' : sexyLevel <= 6 ? '魅力的' : sexyLevel <= 8 ? '艶やか' : '限界突破'}
                            </span>
                        </div>
                        <div className="flex-row items-baseline gap-2 bg-black/40 px-3 py-1 rounded-lg border border-white/5 shadow-inner">
                            <span className="text-[9px] font-black text-violet-400/40 uppercase">Intensity</span>
                            <span className="text-xl font-mono font-black text-violet-400 leading-none">{sexyLevel}</span>
                            <span className="text-[10px] text-violet-400/30 font-bold">/ 10</span>
                        </div>
                    </div>

                    <div className="relative pt-1 pb-6">
                        <input
                            type="range" min="1" max="10" value={sexyLevel}
                            onChange={(e) => setSexyLevel(parseInt(e.target.value))}
                            className="sexy-slider !my-2"
                        />
                        {/* 24px thumb width means 12px padding for perfect alignment */}
                        <div className="flex-row justify-between px-[12px] mt-[-8px]">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(step => (
                                <div key={step} className="flex-col items-center">
                                    <div className={`w-[1px] h-2 mb-1 ${step <= sexyLevel ? 'bg-violet-400 shadow-[0_0_5px_var(--violet)]' : 'bg-white/10'}`} />
                                    <span className={`text-[9px] font-mono font-black transition-all ${step === sexyLevel ? 'text-violet-400 scale-125' : 'text-white/20'}`}>
                                        {step}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid-4 mt-[-4px]">
                        <div className={`py-1.5 rounded border border-dashed transition-all ${sexyLevel <= 3 ? 'bg-violet-500/10 border-violet-500/30 shadow-lg' : 'bg-white/5 border-white/5 opacity-30 shadow-none'}`}>
                            <div className="text-[8px] font-black text-center">清楚・日常</div>
                        </div>
                        <div className={`py-1.5 rounded border border-dashed transition-all ${sexyLevel > 3 && sexyLevel <= 6 ? 'bg-violet-500/10 border-violet-500/30 shadow-lg' : 'bg-white/5 border-white/5 opacity-30 shadow-none'}`}>
                            <div className="text-[8px] font-black text-center">魅惑・華やか</div>
                        </div>
                        <div className={`py-1.5 rounded border border-dashed transition-all ${sexyLevel > 6 && sexyLevel <= 9 ? 'bg-violet-500/10 border-violet-500/30 shadow-lg' : 'bg-white/5 border-white/5 opacity-30 shadow-none'}`}>
                            <div className="text-[8px] font-black text-center">情熱・艶やか</div>
                        </div>
                        <div className={`py-1.5 rounded border border-dashed transition-all ${sexyLevel === 10 ? 'bg-red-500/10 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse' : 'bg-white/5 border-white/5 opacity-30 shadow-none'}`}>
                            <div className="text-[9px] font-black text-center text-red-500">極限・官能的</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="field-label !text-violet-400">
                                <Layers size={12} className="text-violet-400" /> 背景カテゴリー
                            </div>
                            <select
                                value={bgCategory}
                                onChange={(e) => { setBgCategory(e.target.value); setSelectedBackground('none'); }}
                                className="studio-input cursor-pointer focus:border-violet-400 focus:bg-violet-400/5"
                            >
                                <option value="all">-- すべて --</option>
                                {BACKGROUND_CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <div className="field-label !text-violet-400">
                                <ImageIcon size={12} className="text-violet-400" /> 背景・シチュエーション
                            </div>
                            <select
                                value={selectedBackground}
                                onChange={(e) => setSelectedBackground(e.target.value)}
                                className="studio-input cursor-pointer focus:border-violet-400 focus:bg-violet-400/5"
                            >
                                <option value="none">{filteredBackgrounds.length} 点から選択</option>
                                {filteredBackgrounds.map(bg => (
                                    <option key={bg.id} value={bg.id}>{bg.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsBgVaultOpen(!isBgVaultOpen)}
                        className={`w-full mt-2 mb-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all border border-dashed rounded flex items-center justify-center gap-2 ${isBgVaultOpen ? 'bg-violet-600 text-white border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'text-violet-400/40 border-white/5 hover:border-violet-400/30 hover:bg-violet-400/5 hover:text-violet-400/80'}`}
                    >
                        <Layers size={10} /> {isBgVaultOpen ? 'アーカイブを閉じる' : '背景アーカイブを開く'}
                    </button>

                    <AnimatePresence>
                        {isBgVaultOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mb-6"
                            >
                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">
                                            Background Studio Access
                                        </span>
                                        <button onClick={() => setIsBgVaultOpen(false)} className="text-white/20 hover:text-white">
                                            <X size={14} />
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        <button
                                            onClick={() => setBgCategory('all')}
                                            className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all ${bgCategory === 'all' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
                                        >
                                            すべて
                                        </button>
                                        {BACKGROUND_CATEGORIES.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setBgCategory(cat.id)}
                                                className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all ${bgCategory === cat.id ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400/40" size={14} />
                                        <input
                                            type="text"
                                            placeholder="背景を検索..."
                                            value={bgKeyword}
                                            onChange={(e) => setBgKeyword(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs focus:border-violet-400 outline-none text-white placeholder:text-white/20"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                                        {filteredBackgrounds.map(bg => (
                                            <button
                                                key={bg.id}
                                                onClick={() => {
                                                    setSelectedBackground(bg.id);
                                                    setIsBgVaultOpen(false);
                                                }}
                                                className={`text-left p-3 border rounded-lg transition-all ${selectedBackground === bg.id
                                                    ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                                                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="text-[10px] font-black uppercase mb-1 truncate">{bg.label}</div>
                                                <div className="text-[8px] opacity-40 line-clamp-1">{bg.prompt}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="field-label !text-violet-400">
                        <Activity size={12} className="text-violet-400" /> ポーズ・モーションのコンセプト
                    </div>
                    <textarea
                        placeholder="キャラクターにどんなポーズをさせたいか記述してください..."
                        value={poseDescription}
                        onChange={(e) => setPoseDescription(e.target.value)}
                        className="studio-input mb-6 h-24 focus:border-violet-400 focus:bg-violet-400/5"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="field-label !text-violet-400">
                                <UserIcon size={12} className="text-violet-400" /> カテゴリー分類
                            </div>
                            <select
                                value={poseCategory}
                                onChange={(e) => { setPoseCategory(e.target.value); setSelectedPose('standing'); }}
                                className="studio-input cursor-pointer focus:border-violet-400 focus:bg-violet-400/5"
                            >
                                <option value="all">-- すべて --</option>
                                {POSE_CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <div className="field-label !text-violet-400">
                                <Activity size={12} className="text-violet-400" /> ポーズ・モーション
                            </div>
                            <select
                                value={selectedPose}
                                onChange={(e) => setSelectedPose(e.target.value)}
                                className="studio-input cursor-pointer focus:border-violet-400 focus:bg-violet-400/5"
                            >
                                <option value="">{filteredPoses.length} 点から選択</option>
                                {filteredPoses.map(p => (
                                    <option key={p.id} value={p.id}>{p.label} ({p.id})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsPoseVaultOpen(!isPoseVaultOpen)}
                        className={`w-full mt-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all border border-dashed rounded flex items-center justify-center gap-2 ${isPoseVaultOpen ? 'bg-violet-600 text-white border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'text-violet-400/40 border-white/5 hover:border-violet-400/30 hover:bg-violet-400/5 hover:text-violet-400/80'}`}
                    >
                        <UserIcon size={12} /> {isPoseVaultOpen ? 'アーカイブを閉じる' : 'モーション・アーカイブを開く'}
                    </button>

                    <AnimatePresence>
                        {isPoseVaultOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mt-4"
                            >
                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">
                                            Motion Archive Module
                                        </span>
                                        <button onClick={() => setIsPoseVaultOpen(false)} className="text-white/20 hover:text-white">
                                            <X size={14} />
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        <button
                                            onClick={() => setPoseCategory('all')}
                                            className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all ${poseCategory === 'all' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
                                        >
                                            すべて
                                        </button>
                                        {POSE_CATEGORIES.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setPoseCategory(cat.id)}
                                                className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all ${poseCategory === cat.id ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400/40" size={14} />
                                        <input
                                            type="text"
                                            placeholder="ポーズを検索..."
                                            value={poseKeyword}
                                            onChange={(e) => setPoseKeyword(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs focus:border-violet-400 outline-none text-white placeholder:text-white/20"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1 pb-2">
                                        {filteredPoses.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => {
                                                    setSelectedPose(p.id);
                                                    setIsPoseVaultOpen(false);
                                                }}
                                                className={`text-left p-3 border rounded-lg transition-all ${selectedPose === p.id
                                                    ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                                                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="text-[10px] font-black uppercase mb-1 truncate">{p.label}</div>
                                                <div className="text-[8px] opacity-40 line-clamp-1 truncate">{p.prompt}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
};
