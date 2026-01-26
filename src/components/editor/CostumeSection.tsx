import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Hash, Search } from 'lucide-react';
import { FASHION_CATEGORIES, type CostumeItem } from '../../constants';
import { SectionDivider } from '../ui/SectionDivider';

interface CostumeSectionProps {
    selectedCategory: string;
    setSelectedCategory: (val: string) => void;
    selectedCostume: CostumeItem | null;
    setSelectedCostume: (val: CostumeItem | null) => void;
    keyword: string;
    setKeyword: (val: string) => void;
    filteredCostumes: CostumeItem[];
}

export const CostumeSection: React.FC<CostumeSectionProps> = ({
    selectedCategory,
    setSelectedCategory,
    selectedCostume,
    setSelectedCostume,
    keyword,
    setKeyword,
    filteredCostumes
}) => {
    return (
        <div className="space-y-8" style={{ '--section-color': '#00f2ff' } as React.CSSProperties}>
            <SectionDivider label="01: 衣装本体のデザイン" color="cyan" />


            <section className="space-y-6">
                <div>
                    <div className="field-label !text-cyan-400">
                        <Scissors size={12} className="text-cyan-400" /> スタイル・カテゴリー
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => { setSelectedCategory(e.target.value); setSelectedCostume(null); }}
                        className="studio-input cursor-pointer focus:border-cyan-400 focus:bg-cyan-400/5"
                    >
                        {FASHION_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                    </select>
                </div>

                <div>
                    <div className="field-label !text-cyan-400 mb-4">
                        <Hash size={12} className="text-cyan-400" /> ベース衣装を選択（{filteredCostumes.length}点）
                    </div>

                    {selectedCategory === 'anime' ? (
                        /* Anime Category: Visual Grid */
                        <div className="premium-grid !flex-wrap !overflow-visible !max-h-[400px] !overflow-y-auto custom-scrollbar" style={{ gap: '10px', padding: '10px' }}>
                            {/* 「おまかせ」ボタン */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedCostume(null)}
                                className={`theme-card !w-[calc(33.33%-7px)] !min-h-[60px] !p-2 ${selectedCostume === null ? 'selected' : ''}`}
                            >
                                <div className="premium-label !text-[10px]">おまかせ (Random)</div>
                            </motion.button>

                            {filteredCostumes.map((item, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedCostume(item)}
                                    className={`theme-card !w-[calc(33.33%-7px)] !min-h-[60px] !p-2 ${selectedCostume?.jp === item.jp ? 'selected' : ''}`}
                                >
                                    <div className="premium-label !text-[10px] !leading-tight">{item.jp}</div>
                                    <div className="premium-desc !text-[7px] !mt-1 opacity-40 line-clamp-1">{item.en}</div>
                                </motion.button>
                            ))}
                        </div>
                    ) : (
                        /* Other Categories: Simple Dropdown */
                        <select
                            value={selectedCostume?.jp || ''}
                            onChange={(e) => {
                                const item = filteredCostumes.find(i => i.jp === e.target.value);
                                setSelectedCostume(item || null);
                            }}
                            className="studio-input cursor-pointer focus:border-cyan-400 focus:bg-cyan-400/5"
                        >
                            <option value="">{filteredCostumes.length} 点から選択（おまかせ）</option>
                            {filteredCostumes.map((item, idx) => (
                                <option key={idx} value={item.jp}>{item.jp} ({item.en})</option>
                            ))}
                        </select>
                    )}
                </div>
            </section>

            <section>
                <div className="field-label !text-cyan-400">
                    <Search size={12} className="text-cyan-400" /> 検索・イメージフィルター
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="衣装名、英語名、イメージタグで検索..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="studio-input focus:border-cyan-400 focus:bg-cyan-400/5"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-cyan-400 tracking-widest opacity-50 uppercase">
                        AI Semantic Engine
                    </div>
                </div>
            </section>
        </div>
    );
};
