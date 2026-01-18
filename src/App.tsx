import { useState, useEffect, useMemo } from 'react'
import { Binary } from 'lucide-react'
import {
  COSTUME_LIST,
  BACKGROUND_SETTINGS,
  ACCESSORIES_LIST,
  type CostumeItem,
  type AccessoryItem,
  POSE_SETTINGS,
  EXPRESSION_SETTINGS
} from './constants'
import { generateCostumePrompts, generateSexyRangePrompts } from './services/gemini'
import { type GeneratedPrompt, type HistoryItem } from './types'

import { Header } from './components/layout/Header'
import { CostumeSection } from './components/editor/CostumeSection'
import { AccessorySection } from './components/editor/AccessorySection'
import { ScenePoseSection } from './components/editor/ScenePoseSection'
import { ExpressionSection } from './components/editor/ExpressionSection'
import { ResultsSection } from './components/results/ResultsSection'
import { ArchiveSection } from './components/archive/ArchiveSection'

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
  const [poseDescription, setPoseDescription] = useState('')
  const [selectedExpression, setSelectedExpression] = useState('smile')
  const [expressionCategory, setExpressionCategory] = useState('all')
  const [isExpressionVaultOpen, setIsExpressionVaultOpen] = useState(false)
  const [expressionKeyword, setExpressionKeyword] = useState('')
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

  const filteredExpressions = useMemo(() => {
    let list = EXPRESSION_SETTINGS
    if (expressionCategory !== 'all') {
      list = list.filter(exp => exp.category === expressionCategory)
    }
    if (expressionKeyword) {
      const lowKey = expressionKeyword.toLowerCase()
      list = list.filter(exp =>
        exp.label.includes(expressionKeyword) ||
        exp.prompt.toLowerCase().includes(lowKey)
      )
    }
    return list
  }, [expressionCategory, expressionKeyword])

  const handleAddAccessoryToSlot = (acc: AccessoryItem) => {
    if (activeSlotIndex === null) return;
    const newAccessories = [...selectedAccessories];
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
        expression: EXPRESSION_SETTINGS.find(e => e.id === selectedExpression)?.prompt || 'smile',
        poseDescription: poseDescription,
        sexyLevel: sexyLevel.toString()
      }
      const results = await generateCostumePrompts(currentKey, selectedCategory, parts, designImage, numPrompts)
      await new Promise(r => setTimeout(r, 4000))

      const newHistoryItems: HistoryItem[] = results.map(r => ({
        ...r,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        isFavorite: false
      }))
      setHistory(prev => [...newHistoryItems, ...prev].slice(0, 100))
      setGeneratedPrompts(newHistoryItems.map(h => ({ description: h.description, prompt: h.prompt, id: h.id })))

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
        poseDescription: poseDescription,
      }
      const results = await generateSexyRangePrompts(currentKey, selectedCategory, parts, designImage, referencePrompt)
      await new Promise(r => setTimeout(r, 4000))

      const newHistoryItems: HistoryItem[] = results.map(r => ({
        ...r,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        isFavorite: false
      }))
      setHistory(prev => [...newHistoryItems, ...prev].slice(0, 100))
      setGeneratedPrompts(newHistoryItems.map(h => ({ description: h.description, prompt: h.prompt, id: h.id })))

      setTimeout(() => {
        document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    } catch (error) {
      alert(`Error Range Transmitting: ${error instanceof Error ? error.message : 'An unknown error occurred'}`)
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

  const navigateHistory = (filter: 'all' | 'favorites') => {
    setHistoryFilter(filter);
    setTimeout(() => {
      document.getElementById('archive-core')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  return (
    <div className="app-shell min-h-screen relative">
      <div className="atelier-backdrop" />

      <Header
        apiKey={apiKey}
        saveApiKey={saveApiKey}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        onNavigateHistory={navigateHistory}
      />

      <main className="grid grid-cols-1 xl:grid-cols-2 gap-12 relative z-10 items-start">
        <div className="studio-panel space-y-12">
          <CostumeSection
            designImage={designImage}
            setDesignImage={setDesignImage}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedCostume={selectedCostume}
            setSelectedCostume={setSelectedCostume}
            keyword={keyword}
            setKeyword={setKeyword}
            filteredCostumes={filteredCostumes}
          />

          <AccessorySection
            selectedAccessories={selectedAccessories}
            activeSlotIndex={activeSlotIndex}
            setActiveSlotIndex={setActiveSlotIndex}
            isVaultOpen={isVaultOpen}
            setIsVaultOpen={setIsVaultOpen}
            accessoryCategory={accessoryCategory}
            setAccessoryCategory={setAccessoryCategory}
            accessoryKeyword={accessoryKeyword}
            setAccessoryKeyword={setAccessoryKeyword}
            filteredAccessories={filteredAccessories}
            onAddAccessory={handleAddAccessoryToSlot}
            onClearSlot={handleClearSlot}
          />

          <ScenePoseSection
            sexyLevel={sexyLevel}
            setSexyLevel={setSexyLevel}
            poseDescription={poseDescription}
            setPoseDescription={setPoseDescription}
            bgCategory={bgCategory}
            setBgCategory={setBgCategory}
            selectedBackground={selectedBackground}
            setSelectedBackground={setSelectedBackground}
            isBgVaultOpen={isBgVaultOpen}
            setIsBgVaultOpen={setIsBgVaultOpen}
            bgKeyword={bgKeyword}
            setBgKeyword={setBgKeyword}
            filteredBackgrounds={filteredBackgrounds}
            poseCategory={poseCategory}
            setPoseCategory={setPoseCategory}
            selectedPose={selectedPose}
            setSelectedPose={setSelectedPose}
            isPoseVaultOpen={isPoseVaultOpen}
            setIsPoseVaultOpen={setIsPoseVaultOpen}
            poseKeyword={poseKeyword}
            setPoseKeyword={setPoseKeyword}
            filteredPoses={filteredPoses}
          />

          <ExpressionSection
            selectedExpression={selectedExpression}
            setSelectedExpression={setSelectedExpression}
            expressionCategory={expressionCategory}
            setExpressionCategory={setExpressionCategory}
            isExpressionVaultOpen={isExpressionVaultOpen}
            setIsExpressionVaultOpen={setIsExpressionVaultOpen}
            expressionKeyword={expressionKeyword}
            setExpressionKeyword={setExpressionKeyword}
            filteredExpressions={filteredExpressions}
          />

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

        <ResultsSection
          generatedPrompts={generatedPrompts}
          isGenerating={isGenerating}
          synthesisLogs={synthesisLogs}
          isCopied={isCopied}
          isAllCopied={isAllCopied}
          history={history}
          onCopyAll={handleCopyAll}
          onCopy={handleCopy}
          onToggleFavorite={toggleFavorite}
          onGenerateRange={handleGenerateRange}
        />
      </main>

      <ArchiveSection
        history={history}
        filteredHistory={filteredHistory}
        historySearch={historySearch}
        setHistorySearch={setHistorySearch}
        isArchiveCompact={isArchiveCompact}
        setIsArchiveCompact={setIsArchiveCompact}
        historyFilter={historyFilter}
        setHistoryFilter={setHistoryFilter}
        onToggleFavorite={toggleFavorite}
        onDeleteHistoryItem={deleteHistoryItem}
        onClearHistory={() => {
          if (confirm("全ての履歴を抹消しますか？（お気に入りも削除されます）")) {
            setHistory([])
          }
        }}
      />

      <footer className="mt-40 mb-20 text-center opacity-30 text-white">
        <p className="text-[10px] font-black tracking-[0.5em] uppercase">costumeAI — AI-DRIVEN COSTUME SYNTHESIS</p>
      </footer>
    </div>
  )
}

export default App
