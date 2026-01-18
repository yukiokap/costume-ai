import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Binary, Layers, X, Search } from 'lucide-react';
import { ACCESSORY_CATEGORIES, type AccessoryItem } from '../../constants';
import { SectionDivider } from '../ui/SectionDivider';

interface AccessorySectionProps {
    selectedAccessories: AccessoryItem[];
    activeSlotIndex: number | null;
    setActiveSlotIndex: (idx: number | null) => void;
    isVaultOpen: boolean;
    setIsVaultOpen: (open: boolean) => void;
    accessoryCategory: string;
    setAccessoryCategory: (cat: string) => void;
    accessoryKeyword: string;
    setAccessoryKeyword: (key: string) => void;
    filteredAccessories: AccessoryItem[];
    onAddAccessory: (acc: AccessoryItem) => void;
    onClearSlot: (idx: number) => void;
}

export const AccessorySection: React.FC<AccessorySectionProps> = ({
    selectedAccessories,
    activeSlotIndex,
    setActiveSlotIndex,
    isVaultOpen,
    setIsVaultOpen,
    accessoryCategory,
    setAccessoryCategory,
    accessoryKeyword,
    setAccessoryKeyword,
    filteredAccessories,
    onAddAccessory,
    onClearSlot
}) => {
    return (
        <div className="space-y-6" style={{ '--section-color': '#fbbf24' } as React.CSSProperties}>
            <SectionDivider label="02: アクセサリー・小物の追加" color="amber" />

            <section>
                <div className="flex justify-between items-baseline mb-6">
                    <div className="field-label m-0">
                        <Star size={12} /> 装飾スロット
                    </div>
                    <span className="text-[10px] font-black opacity-50 uppercase">レイヤー管理</span>
                </div>

                <div className="grid-5 mb-4">
                    {[0, 1, 2, 3, 4].map(idx => {
                        const acc = selectedAccessories[idx];
                        return (
                            <button
                                key={idx}
                                onClick={() => { setActiveSlotIndex(idx); setIsVaultOpen(true); }}
                                className={`group relative aspect-square border-2 flex flex-col items-center justify-center transition-all ${acc
                                    ? 'bg-amber-600/10 border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.1)]'
                                    : 'bg-white/5 border-dashed border-white/10 hover:border-amber-400/30'
                                    }`}
                            >
                                <div className="absolute top-1 left-1.5 text-[8px] font-black opacity-30 text-white">0{idx + 1}</div>
                                {acc ? (
                                    <>
                                        <div className="text-[9px] font-black text-amber-200 text-center px-1 leading-tight mb-1 truncate w-full">{acc.jp}</div>
                                        <div className="text-[7px] text-amber-500/60 uppercase font-bold tracking-tighter truncate w-full px-1 text-center">{acc.category}</div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onClearSlot(idx); }}
                                            className="absolute -top-2 -right-2 bg-red-900 border border-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={8} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-white/20 group-hover:text-amber-400/50 transition-colors">
                                        <Binary size={20} strokeWidth={1} />
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
                <p className="text-[9px] text-slate-500 italic text-center uppercase tracking-widest">スロットを選択してアクセサリー保管庫を開く</p>
            </section>

            <button
                onClick={() => setIsVaultOpen(!isVaultOpen)}
                className={`w-full mt-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all border border-dashed rounded flex items-center justify-center gap-2 ${isVaultOpen ? 'bg-amber-600 text-white border-amber-500 shadow-[0_0_15px_rgba(180,83,9,0.3)]' : 'text-amber-400/40 border-white/5 hover:border-amber-400/30 hover:bg-amber-400/5 hover:text-amber-400/80'}`}
            >
                <Layers size={10} /> {isVaultOpen ? 'アーカイブを閉じる' : 'アクセサリー保管庫を開く'}
            </button>

            <AnimatePresence>
                {isVaultOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-4"
                    >
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                                    Slot 0{activeSlotIndex! + 1} Access
                                </span>
                                <button onClick={() => setIsVaultOpen(false)} className="text-white/20 hover:text-white">
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-1">
                                {ACCESSORY_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setAccessoryCategory(cat.id)}
                                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all ${accessoryCategory === cat.id ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/40" size={14} />
                                <input
                                    type="text"
                                    placeholder="保管庫内を検索..."
                                    value={accessoryKeyword}
                                    onChange={(e) => setAccessoryKeyword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs focus:border-amber-400 outline-none text-white placeholder:text-white/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1 pb-2">
                                {filteredAccessories.map((acc, idx) => {
                                    const isEquippedElsewhere = selectedAccessories.some((a, sIdx) => a.jp === acc.jp && sIdx !== activeSlotIndex);
                                    const isEquippedInCurrent = selectedAccessories[activeSlotIndex!]?.jp === acc.jp;

                                    return (
                                        <button
                                            key={idx}
                                            disabled={isEquippedElsewhere}
                                            onClick={() => onAddAccessory(acc)}
                                            className={`text-left p-3 border rounded-lg transition-all ${isEquippedInCurrent
                                                ? 'bg-amber-600 border-amber-400 text-white'
                                                : isEquippedElsewhere
                                                    ? 'opacity-20 grayscale border-white/5 cursor-not-allowed'
                                                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="text-[10px] font-black uppercase mb-1 truncate">{acc.jp}</div>
                                            <div className="text-[8px] opacity-40 line-clamp-1 truncate">{acc.en}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
