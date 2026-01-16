import { useState, useEffect, useMemo } from 'react'
import { X, Search, Star, Scissors, PenTool, Hash, Copy, ExternalLink, Trash2, ChevronDown, Cpu, Zap, Binary, Activity, Layers, Image as ImageIcon, User as UserIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FASHION_CATEGORIES, COSTUME_LIST, BACKGROUND_SETTINGS, ACCESSORIES_LIST, type CostumeItem, ACCESSORY_CATEGORIES, type AccessoryItem, BACKGROUND_CATEGORIES, POSE_SETTINGS, POSE_CATEGORIES } from './constants'
import { generateCostumePrompts, generateSexyRangePrompts } from './services/gemini'

interface GeneratedPrompt {
  description: string;
  prompt: string;
}

interface HistoryItem extends GeneratedPrompt {
  id: string;
  timestamp: number;
  isFavorite: boolean;
}

function App() {
  const [apiKey, setApiKey] = useState('')
  const [designImage, setDesignImage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [selectedCostume, setSelectedCostume] = useState<CostumeItem | null>(null)
  const [selectedAccessories, setSelectedAccessories] = useState<AccessoryItem[]>([])
  const [sexyLevel, setSexyLevel] = useState(5)
  const [selectedBackground, setSelectedBackground] = useState('none')
  const [selectedPose, setSelectedPose] = useState('standing')
  const [numPrompts] = useState(5)
  const [accessoryCategory, setAccessoryCategory] = useState('all')
  const [accessoryKeyword, setAccessoryKeyword] = useState('')
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null)
  const [isVaultOpen, setIsVaultOpen] = useState(false)
  const [isBgVaultOpen, setIsBgVaultOpen] = useState(false)
  const [bgCategory, setBgCategory] = useState('all')
  const [bgKeyword, setBgKeyword] = useState('')
  const [isPoseVaultOpen, setIsPoseVaultOpen] = useState(false)
  const [poseCategory, setPoseCategory] = useState('all')
  const [poseKeyword, setPoseKeyword] = useState('')
  const [synthesisLogs, setSynthesisLogs] = useState<string[]>([])

  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState<number | null>(null)
  const [isAllCopied, setIsAllCopied] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [historyFilter, setHistoryFilter] = useState<'all' | 'favorites'>('all')
  const [historySearch, setHistorySearch] = useState('')
  const [isArchiveCompact, setIsArchiveCompact] = useState(false)

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key')
    if (savedKey) setApiKey(savedKey)

    const savedHistory = localStorage.getItem('costume_history')
    if (savedHistory) setHistory(JSON.parse(savedHistory))
  }, [])

  useEffect(() => {
    localStorage.setItem('costume_history', JSON.stringify(history))
  }, [history])

  const saveApiKey = (key: string) => {
    setApiKey(key)
    localStorage.setItem('gemini_api_key', key)
  }

  // SEMANTIC SEARCH LOGIC
  const filteredCostumes = useMemo(() => {
    let list: CostumeItem[] = []
    if (selectedCategory === 'all') {
      list = Object.values(COSTUME_LIST).flat()
    } else {
      list = COSTUME_LIST[selectedCategory] || []
    }

    if (keyword) {
      const lowKey = keyword.toLowerCase()
      list = list.filter(item =>
        item.jp.includes(keyword) ||
        item.en.toLowerCase().includes(lowKey) ||
        item.tags.some(t => t.toLowerCase().includes(lowKey))
      )
    }

    // Sort and uniq
    const unique = Array.from(new Map(list.map(item => [item.jp, item])).values())
    return unique.sort((a, b) => a.jp.localeCompare(b.jp))
  }, [selectedCategory, keyword])

  const filteredAccessories = useMemo(() => {
    let list = ACCESSORIES_LIST as AccessoryItem[];

    if (accessoryCategory !== 'all') {
      list = list.filter(a => a.category === accessoryCategory);
    }

    if (accessoryKeyword) {
      const lowKey = accessoryKeyword.toLowerCase();
      list = list.filter(a =>
        a.jp.includes(accessoryKeyword) ||
        a.en.toLowerCase().includes(lowKey) ||
        a.tags.some(t => t.toLowerCase().includes(lowKey))
      );
    }
    return list;
  }, [accessoryCategory, accessoryKeyword])

  const filteredBackgrounds = useMemo(() => {
    let list = BACKGROUND_SETTINGS
    if (bgCategory !== 'all') {
      list = list.filter(bg => bg.category === bgCategory)
    }
    if (bgKeyword) {
      const lowKey = bgKeyword.toLowerCase()
      list = list.filter(bg =>
        bg.label.includes(bgKeyword) ||
        bg.prompt.toLowerCase().includes(lowKey)
      )
    }
    return list
  }, [bgCategory, bgKeyword])

  const selectedBgLabel = useMemo(() => {
    return BACKGROUND_SETTINGS.find(b => b.id === selectedBackground)?.label || '指定なし'
  }, [selectedBackground])

  const filteredPoses = useMemo(() => {
    let list = POSE_SETTINGS
    if (poseCategory !== 'all') {
      list = list.filter(p => p.category === poseCategory)
    }
    if (poseKeyword) {
      const lowKey = poseKeyword.toLowerCase()
      list = list.filter(p =>
        p.label.includes(poseKeyword) ||
        p.prompt.toLowerCase().includes(lowKey)
      )
    }
    return list
  }, [poseCategory, poseKeyword])

  const selectedPoseLabel = useMemo(() => {
    return POSE_SETTINGS.find(p => p.id === selectedPose)?.label || '直立'
  }, [selectedPose])


  const handleAddAccessoryToSlot = (acc: AccessoryItem) => {
    if (activeSlotIndex === null) return;

    const newAccessories = [...selectedAccessories];
    // Check if already equipped elsewhere
    if (newAccessories.some((a, idx) => a.jp === acc.jp && idx !== activeSlotIndex)) {
      alert("既に別のスロットに装備されています。");
      return;
    }

    newAccessories[activeSlotIndex] = acc;
    setSelectedAccessories(newAccessories.filter(Boolean));
    setIsVaultOpen(false);
    setActiveSlotIndex(null);
  }

  const handleClearSlot = (index: number) => {
    const newAccessories = [...selectedAccessories];
    newAccessories.splice(index, 1);
    setSelectedAccessories(newAccessories);
  }

  const handleGenerate = async () => {
    const currentKey = apiKey || localStorage.getItem('gemini_api_key')
    if (!currentKey) {
      setShowSettings(true)
      return
    }

    setIsGenerating(true)
    setGeneratedPrompts([])

    // Simulate Synthesis Logs
    const logs = [
      "NEURAL_LINK: ESTABLISHED",
      "DATA_POOL: CALIBRATING...",
      "VECTORIZING: COSTUME_COMPONENTS",
      "SYNTHESIZING: STYLISTIC_WEIGHTS",
      "OUTPUT_STREAM: OPENING"
    ]
    setSynthesisLogs([])
    logs.forEach((log, i) => {
      setTimeout(() => setSynthesisLogs(prev => [...prev, log]), i * 800)
    })
    try {
      const parts = {
        base: selectedCostume ? selectedCostume.en : (keyword || 'Not specified'),
        accessories: selectedAccessories.map(a => a.en).join(', '),
        background: BACKGROUND_SETTINGS.find(b => b.id === selectedBackground)?.prompt || 'none',
        pose: POSE_SETTINGS.find(p => p.id === selectedPose)?.prompt || 'standing',
        sexyLevel: sexyLevel.toString()
      }
      const results = await generateCostumePrompts(currentKey, selectedCategory, parts, designImage, numPrompts)

      // Artificial delay to let logs finish
      await new Promise(r => setTimeout(r, 4000))

      setGeneratedPrompts(results)

      // Save to history
      const newHistoryItems: HistoryItem[] = results.map(r => ({
        ...r,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        isFavorite: false
      }))
      setHistory(prev => [...newHistoryItems, ...prev].slice(0, 100))

      setGeneratedPrompts(newHistoryItems.map(h => ({ description: h.description, prompt: h.prompt, id: h.id } as any)))

      setTimeout(() => {
        document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateRange = async (referencePrompt?: string) => {
    const currentKey = apiKey || localStorage.getItem('gemini_api_key')
    if (!currentKey) {
      setShowSettings(true)
      return
    }

    setIsGenerating(true)
    setGeneratedPrompts([])

    const logs = [
      "INITIALIZING: RANGE_SYNTHESIS_ENGINE",
      "MAPPING: SEXY_LEVEL_SPECTRUM (1-10)",
      "GENERATING: 10_STAGE_EVOLUTION",
      "COMPILING: COMPREHENSIVE_LOOKBOOK",
      "OUTPUT_STREAM: OPENING"
    ]
    setSynthesisLogs([])
    logs.forEach((log, i) => {
      setTimeout(() => setSynthesisLogs(prev => [...prev, log]), i * 800)
    })

    try {
      const parts = {
        base: selectedCostume ? selectedCostume.en : (keyword || 'Not specified'),
        accessories: selectedAccessories.map(a => a.en).join(', '),
        background: BACKGROUND_SETTINGS.find(b => b.id === selectedBackground)?.prompt || 'none',
        pose: POSE_SETTINGS.find(p => p.id === selectedPose)?.prompt || 'standing',
      }
      const results = await generateSexyRangePrompts(currentKey, selectedCategory, parts, designImage, referencePrompt)

      await new Promise(r => setTimeout(r, 4000))
      setGeneratedPrompts(results)

      const newHistoryItems: HistoryItem[] = results.map(r => ({
        ...r,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        isFavorite: false
      }))
      setHistory(prev => [...newHistoryItems, ...prev].slice(0, 100))
      setGeneratedPrompts(newHistoryItems.map(h => ({ description: h.description, prompt: h.prompt, id: h.id } as any)))

      setTimeout(() => {
        document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    } catch (error: any) {
      alert(`Error Range Transmitting: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ))
  }

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  const filteredHistory = useMemo(() => {
    let list = history
    if (historyFilter === 'favorites') {
      list = list.filter(item => item.isFavorite)
    }
    if (historySearch) {
      const lowKey = historySearch.toLowerCase()
      list = list.filter(item =>
        item.description.toLowerCase().includes(lowKey) ||
        item.prompt.toLowerCase().includes(lowKey)
      )
    }
    return list
  }, [history, historyFilter, historySearch])

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setIsCopied(index)
    setTimeout(() => setIsCopied(null), 2000)
  }

  const handleCopyAll = () => {
    if (generatedPrompts.length === 0) return
    const allText = generatedPrompts.map(p => p.prompt).join('\n\n')
    navigator.clipboard.writeText(allText)
    setIsAllCopied(true)
    setTimeout(() => setIsAllCopied(false), 2000)
  }

  return (
    <div className="app-shell min-h-screen relative">
      <div className="atelier-backdrop" />

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
            onClick={() => {
              setHistoryFilter('all');
              document.getElementById('archive-core')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-4 py-2 text-cyan-400/50 hover:text-cyan-400 transition-colors text-[10px] font-black uppercase tracking-[0.4em]"
          >
            <Activity size={16} />
            履歴
          </button>

          <button
            onClick={() => {
              setHistoryFilter('favorites');
              document.getElementById('archive-core')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-6 py-2 bg-cyan-600/10 border border-cyan-400/20 text-cyan-400 hover:bg-cyan-600 hover:text-black transition-all text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-[0_0_15px_rgba(0,242,255,0.1)]"
          >
            <Star size={16} fill="currentColor" />
            お気に入り
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-2 gap-12 relative z-10 items-start">
        {/* DASHBOARD */}
        <div className="studio-panel space-y-12">
          <section>
            <div className="field-label">
              <PenTool size={12} /> デザインコンセプト
            </div>
            <textarea
              placeholder="あなたの衣装ビジョンを記述してください..."
              value={designImage}
              onChange={(e) => setDesignImage(e.target.value)}
              className="studio-input"
            />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="field-label">
                <Scissors size={12} /> カテゴリー分類
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setSelectedCostume(null); }}
                className="studio-input cursor-pointer"
              >
                {FASHION_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
              </select>
            </div>
            <div>
              <div className="field-label">
                <Hash size={12} /> ベースモデル
              </div>
              <select
                value={selectedCostume?.jp || ''}
                onChange={(e) => {
                  const item = filteredCostumes.find(i => i.jp === e.target.value)
                  setSelectedCostume(item || null)
                }}
                className="studio-input cursor-pointer"
              >
                <option value="">{filteredCostumes.length} 点から選択</option>
                {filteredCostumes.map((item, idx) => <option key={idx} value={item.jp}>{item.jp} ({item.en})</option>)}
              </select>
            </div>
          </section>

          <section>
            <div className="field-label">
              <Search size={12} /> 検索・イメージフィルター
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="衣装名、英語名、イメージタグで検索..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="studio-input"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-cyan-400 tracking-widest opacity-50 uppercase">
                AI Semantic Engine
              </div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-baseline mb-6">
              <div className="field-label m-0">
                <Star size={12} /> 装飾スロット
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase">レイヤー管理</span>
            </div>

            <div className="grid grid-cols-5 gap-4 mb-4">
              {[0, 1, 2, 3, 4].map(idx => {
                const acc = selectedAccessories[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => { setActiveSlotIndex(idx); setIsVaultOpen(true); }}
                    className={`group relative aspect-square border-2 flex flex-col items-center justify-center transition-all ${acc
                      ? 'bg-cyan-600/10 border-cyan-400/50 shadow-[0_0_20px_rgba(0,242,255,0.1)]'
                      : 'bg-white/5 border-dashed border-white/10 hover:border-cyan-400/30'
                      }`}
                  >
                    <div className="absolute top-1 left-1.5 text-[8px] font-black opacity-30 text-white">0{idx + 1}</div>
                    {acc ? (
                      <>
                        <div className="text-[9px] font-black text-cyan-200 text-center px-1 leading-tight mb-1 truncate w-full">{acc.jp}</div>
                        <div className="text-[7px] text-cyan-500/60 uppercase font-bold tracking-tighter truncate w-full px-1 text-center">{acc.category}</div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleClearSlot(idx); }}
                          className="absolute -top-2 -right-2 bg-red-900 border border-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={8} />
                        </button>
                      </>
                    ) : (
                      <div className="text-white/20 group-hover:text-cyan-400/50 transition-colors">
                        <Binary size={20} strokeWidth={1} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            <p className="text-[9px] text-slate-500 italic text-center uppercase tracking-widest">スロットを選択してアーカイブ保管庫を開く</p>
          </section>

          {/* ACCESSORY VAULT OVERLAY */}
          <AnimatePresence>
            {isVaultOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
              >
                <div className="w-full max-w-6xl h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                    <div>
                      <span className="text-cyan-400 text-[10px] font-black tracking-[0.3em] uppercase block mb-1">Vector Storage Access / Slot 0{activeSlotIndex! + 1}</span>
                      <h2 className="title-main text-4xl md:text-5xl m-0 leading-none">ジ・アーカイブ</h2>
                    </div>
                    <button
                      onClick={() => setIsVaultOpen(false)}
                      className="text-white/20 hover:text-white transition-colors p-4"
                    >
                      <X size={32} />
                    </button>
                  </div>

                  <div className="flex gap-2 mb-6 overflow-x-auto pb-4 no-scrollbar">
                    {ACCESSORY_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setAccessoryCategory(cat.id)}
                        className={`whitespace-nowrap px-6 py-3 text-[10px] font-black border transition-all uppercase tracking-widest ${accessoryCategory === cat.id
                          ? 'bg-amber-700 text-white border-amber-500 shadow-[0_8px_20px_rgba(180,83,9,0.4)]'
                          : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'
                          }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative mb-8">
                    <input
                      type="text"
                      placeholder="アイテム名、タグ、英語名で検索..."
                      value={accessoryKeyword}
                      onChange={(e) => setAccessoryKeyword(e.target.value)}
                      className="w-full bg-transparent border-b-2 border-white/10 px-8 py-4 text-xl md:text-3xl font-light text-white outline-none focus:border-amber-700 transition-colors placeholder:opacity-10"
                    />
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-white/10" size={24} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 overflow-y-auto flex-1 pr-4 custom-scrollbar pb-12">
                    {filteredAccessories.map((acc, idx) => {
                      const isEquippedElsewhere = selectedAccessories.some((a, sIdx) => a.jp === acc.jp && sIdx !== activeSlotIndex);
                      const isEquippedInCurrent = selectedAccessories[activeSlotIndex!]?.jp === acc.jp;

                      return (
                        <button
                          key={idx}
                          disabled={isEquippedElsewhere}
                          onClick={() => handleAddAccessoryToSlot(acc)}
                          className={`relative text-left p-4 border transition-all duration-300 group flex flex-col justify-between min-h-[70px] ${isEquippedInCurrent
                            ? 'bg-amber-700 border-amber-400 text-white shadow-lg'
                            : isEquippedElsewhere
                              ? 'opacity-20 grayscale border-white/5 cursor-not-allowed'
                              : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20'
                            }`}
                        >
                          <div className={`text-[10px] font-black uppercase tracking-tight leading-tight mb-2 ${isEquippedInCurrent ? 'text-white' : 'text-amber-100/90'}`}>
                            {acc.jp}
                          </div>
                          <div className={`text-[8px] font-bold uppercase opacity-30 group-hover:opacity-100 ${isEquippedInCurrent ? 'text-amber-200' : 'text-slate-600'}`}>
                            {acc.en}
                          </div>
                          {isEquippedInCurrent && <Star size={10} className="absolute bottom-2 right-2 fill-white" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="py-6 border-t border-white/5 text-center">
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">
                      システム: パレット・ヴォルト・アクセス・モジュール / アクティブスロット: {activeSlotIndex! + 1}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="field-label m-0">セクシースライダー</div>
                <span className="text-[8px] text-cyan-400/50 uppercase font-bold">Exposure Level</span>
              </div>
              <p className="text-[9px] text-slate-500 mb-3 leading-tight">
                数値が大きくなるほど、衣装の露出度（セクシーさ）や大胆さがアップしたプロンプトを生成します。
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="range" min="1" max="10" value={sexyLevel}
                  onChange={(e) => setSexyLevel(parseInt(e.target.value))}
                  className="flex-1 accent-cyan-400"
                />
                <span className="font-mono font-bold text-xs text-cyan-400">{sexyLevel} / 10</span>
              </div>
            </div>
            <div>
              <div className="field-label">シチュエーション設定</div>
              <p className="text-[9px] text-slate-500 mb-3 leading-tight">
                衣装が一番映える背景や、ライティングの雰囲気を指定します。
              </p>
              <button
                onClick={() => setIsBgVaultOpen(true)}
                className="w-full studio-input text-left flex justify-between items-center group hover:border-cyan-400 hover:bg-cyan-400/5 mb-4"
              >
                <div className="flex items-center gap-3">
                  <ImageIcon size={14} className="text-cyan-400/60 group-hover:text-cyan-400" />
                  <span className="text-xs">{selectedBgLabel}</span>
                </div>
                <Layers size={14} className="text-cyan-400/40 group-hover:text-cyan-400 transition-transform group-hover:rotate-90" />
              </button>

              <div className="field-label">ポーズ設定</div>
              <p className="text-[9px] text-slate-500 mb-3 leading-tight">
                キャラクターのポーズや視線を指定します（エロティックな体位も含む）。
              </p>
              <button
                onClick={() => setIsPoseVaultOpen(true)}
                className="w-full studio-input text-left flex justify-between items-center group hover:border-cyan-400 hover:bg-cyan-400/5"
              >
                <div className="flex items-center gap-3">
                  <UserIcon size={14} className="text-cyan-400/60 group-hover:text-cyan-400" />
                  <span className="text-xs">{selectedPoseLabel}</span>
                </div>
                <Activity size={14} className="text-cyan-400/40 group-hover:text-cyan-400 transition-transform group-hover:scale-110" />
              </button>
            </div>
          </section>

          {/* Pose Vault Overlay */}
          <AnimatePresence>
            {isPoseVaultOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-8"
              >
                <div className="w-full max-w-6xl studio-panel border-cyan-400/30 max-h-[90vh] flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-cyan-600/20 rounded-lg text-cyan-400">
                        <UserIcon size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-white">Motion Vault</h2>
                        <p className="text-[10px] text-cyan-400/50 font-bold tracking-[0.2em]">ポーズ・体位設定モジュール</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsPoseVaultOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="md:col-span-1 space-y-2">
                      <div className="text-[10px] font-black text-cyan-400/40 uppercase mb-3">Pose Categories</div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => setPoseCategory('all')}
                          className={`text-left px-4 py-3 rounded text-[11px] font-bold transition-all ${poseCategory === 'all' ? 'bg-cyan-600 text-black' : 'text-slate-400 hover:bg-white/5'}`}
                        >
                          すべてを表示
                        </button>
                        {POSE_CATEGORIES.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setPoseCategory(cat.id)}
                            className={`text-left px-4 py-3 rounded text-[11px] font-bold transition-all ${poseCategory === cat.id ? 'bg-cyan-600 text-black shadow-[0_0_15px_rgba(0,242,255,0.3)]' : 'text-slate-400 hover:bg-white/5'}`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-3 flex flex-col gap-4">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/40" size={18} />
                        <input
                          type="text"
                          placeholder="ポーズを検索 (例: 膝立ち, 四つん這い, 騎乗位...)"
                          value={poseKeyword}
                          onChange={(e) => setPoseKeyword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-sm focus:border-cyan-400 focus:bg-cyan-400/5 outline-none transition-all text-white placeholder:text-white/20"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto custom-scrollbar pr-2 max-h-[500px]">
                        {filteredPoses.map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setSelectedPose(p.id);
                              setIsPoseVaultOpen(false);
                            }}
                            className={`text-left p-4 border transition-all duration-300 group flex flex-col justify-between min-h-[80px] ${selectedPose === p.id
                              ? 'bg-cyan-600 border-cyan-400 text-black shadow-[0_0_20px_rgba(0,242,255,0.2)]'
                              : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20'
                              }`}
                          >
                            <div className="flex justify-between items-start w-full">
                              <div className={`text-[10px] font-black uppercase tracking-tight leading-tight mb-2 ${selectedPose === p.id ? 'text-black' : 'text-cyan-400/80'}`}>
                                {p.label}
                              </div>
                              {selectedPose === p.id && <Star size={10} fill="currentColor" />}
                            </div>
                            <div className={`text-[8px] font-medium opacity-40 line-clamp-2 ${selectedPose === p.id ? 'text-black/60' : 'text-slate-500'}`}>
                              {p.prompt}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="py-6 border-t border-white/5 text-center">
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">
                      モーション・シミュレーション / トータルポーズ数: {POSE_SETTINGS.length}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Background Vault Overlay */}
          <AnimatePresence>
            {isBgVaultOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-8"
              >
                <div className="w-full max-w-6xl studio-panel border-cyan-400/30 max-h-[90vh] flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-cyan-600/20 rounded-lg text-cyan-400">
                        <Layers size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-white">Environment Vault</h2>
                        <p className="text-[10px] text-cyan-400/50 font-bold tracking-[0.2em]">シチュエーション設定モジュール</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsBgVaultOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="md:col-span-1 space-y-2">
                      <div className="text-[10px] font-black text-cyan-400/40 uppercase mb-3">Categories</div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => setBgCategory('all')}
                          className={`text-left px-4 py-3 rounded text-[11px] font-bold transition-all ${bgCategory === 'all' ? 'bg-cyan-600 text-black' : 'text-slate-400 hover:bg-white/5'}`}
                        >
                          すべてを表示
                        </button>
                        {BACKGROUND_CATEGORIES.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setBgCategory(cat.id)}
                            className={`text-left px-4 py-3 rounded text-[11px] font-bold transition-all ${bgCategory === cat.id ? 'bg-cyan-600 text-black shadow-[0_0_15px_rgba(0,242,255,0.3)]' : 'text-slate-400 hover:bg-white/5'}`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-3 flex flex-col gap-4">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/40" size={18} />
                        <input
                          type="text"
                          placeholder="背景を検索 (例: ベッド, 都会, 神秘的...)"
                          value={bgKeyword}
                          onChange={(e) => setBgKeyword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-sm focus:border-cyan-400 focus:bg-cyan-400/5 outline-none transition-all text-white placeholder:text-white/20"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto custom-scrollbar pr-2 max-h-[500px]">
                        {filteredBackgrounds.map(bg => (
                          <button
                            key={bg.id}
                            onClick={() => {
                              setSelectedBackground(bg.id);
                              setIsBgVaultOpen(false);
                            }}
                            className={`text-left p-4 border transition-all duration-300 group flex flex-col justify-between min-h-[80px] ${selectedBackground === bg.id
                              ? 'bg-cyan-600 border-cyan-400 text-black shadow-[0_0_20px_rgba(0,242,255,0.2)]'
                              : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20'
                              }`}
                          >
                            <div className="flex justify-between items-start w-full">
                              <div className={`text-[10px] font-black uppercase tracking-tight leading-tight mb-2 ${selectedBackground === bg.id ? 'text-black' : 'text-cyan-400/80'}`}>
                                {bg.label}
                              </div>
                              {selectedBackground === bg.id && <Star size={10} fill="currentColor" />}
                            </div>
                            <div className={`text-[8px] font-medium opacity-40 line-clamp-2 ${selectedBackground === bg.id ? 'text-black/60' : 'text-slate-500'}`}>
                              {bg.prompt}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="py-6 border-t border-white/5 text-center">
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">
                      環境シミュレーション・モジュール / トータル背景数: {BACKGROUND_SETTINGS.length}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="pt-8 border-t border-border flex flex-col gap-3">
            <button
              className="btn-tailor"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'アーカイブ生成中...' : 'プロンプトを生成する'}
            </button>
            <button
              className="w-full py-4 border-2 border-cyan-400/20 bg-cyan-400/5 text-cyan-400 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-cyan-400 hover:text-black transition-all flex items-center justify-center gap-4 group"
              onClick={() => handleGenerateRange()}
              disabled={isGenerating}
            >
              <Binary size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              1~10 連続生成 (セクシー可変出力)
            </button>
          </footer>
        </div>

        {/* RESULTS */}
        <div id="archive" className="space-y-12">
          {generatedPrompts.length > 0 ? (
            <div className="flex flex-col gap-8">
              <div className="flex justify-end">
                <button
                  onClick={handleCopyAll}
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
                          onClick={() => toggleFavorite((item as any).id)}
                          className={`p-2 transition-all ${history.find(h => h.id === (item as any).id)?.isFavorite ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]' : 'text-white/20 hover:text-white opacity-0 group-hover:opacity-100'}`}
                        >
                          <Star size={20} fill={history.find(h => h.id === (item as any).id)?.isFavorite ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <div className="archive-prompt select-all">{item.prompt}</div>
                      <div className="flex flex-col gap-2 mt-4">
                        <button
                          onClick={() => handleCopy(item.prompt, index)}
                          className={`w-full py-4 font-black uppercase tracking-[0.2em] text-[10px] border transition-all ${isCopied === index ? 'bg-cyan-600 border-cyan-600 text-black' : 'bg-black text-white hover:bg-cyan-900 border-white/10'}`}
                        >
                          {isCopied === index ? 'コピー完了' : 'プロンプトをコピー'}
                        </button>
                        <button
                          onClick={() => handleGenerateRange(item.prompt)}
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
      </main>

      {/* ARCHIVE CORE SECTION (REPLACES DRAWER) */}
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
                onClick={() => {
                  if (confirm("全ての履歴を抹消しますか？（お気に入りも削除されます）")) {
                    setHistory([])
                  }
                }}
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
                        onClick={() => toggleFavorite(item.id)}
                        className={`p-1.5 transition-all ${item.isFavorite ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]' : 'text-white/20 hover:text-white'}`}
                      >
                        <Star size={isArchiveCompact ? 14 : 18} fill={item.isFavorite ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
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

      {/* Settings Panel AnimatePresence already handled in the header area */}

      <footer className="mt-40 mb-20 text-center opacity-30 text-white">
        <p className="text-[10px] font-black tracking-[0.5em] uppercase">costumeAI — AI-DRIVEN COSTUME SYNTHESIS</p>
      </footer>
    </div>
  )
}

export default App
