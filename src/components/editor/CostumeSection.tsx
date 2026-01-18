import React from 'react';
import { PenTool, Scissors, Hash, Search } from 'lucide-react';
import { FASHION_CATEGORIES, type CostumeItem } from '../../constants';
import { SectionDivider } from '../ui/SectionDivider';

interface CostumeSectionProps {
    designImage: string;
    setDesignImage: (val: string) => void;
    selectedCategory: string;
    setSelectedCategory: (val: string) => void;
    selectedCostume: CostumeItem | null;
    setSelectedCostume: (val: CostumeItem | null) => void;
    keyword: string;
    setKeyword: (val: string) => void;
    filteredCostumes: CostumeItem[];
}

export const CostumeSection: React.FC<CostumeSectionProps> = ({
    designImage,
    setDesignImage,
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

            <section>
                <div className="field-label">
                    <PenTool size={12} /> デザインコンセプト
                </div>
                <textarea
                    placeholder="あなたの衣装ビジョンを記述してください..."
                    value={designImage}
                    onChange={(e) => setDesignImage(e.target.value)}
                    className="studio-input focus:border-cyan-400 focus:bg-cyan-400/5"
                />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    <div className="field-label !text-cyan-400">
                        <Hash size={12} className="text-cyan-400" /> 基本となる衣装（ベース）
                    </div>
                    <select
                        value={selectedCostume?.jp || ''}
                        onChange={(e) => {
                            const item = filteredCostumes.find(i => i.jp === e.target.value);
                            setSelectedCostume(item || null);
                        }}
                        className="studio-input cursor-pointer focus:border-cyan-400 focus:bg-cyan-400/5"
                    >
                        <option value="">{filteredCostumes.length} 点から選択</option>
                        {filteredCostumes.map((item, idx) => (
                            <option key={idx} value={item.jp}>{item.jp} ({item.en})</option>
                        ))}
                    </select>
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
