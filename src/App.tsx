import { useState } from 'react'
import { ChevronDown, Settings2 } from 'lucide-react'
import { generateCostumePrompts, generateSexyRangePrompts } from './services/gemini'
import { type GeneratedPrompt, type HistoryItem } from './types'
import { Header } from './components/layout/Header'
import { ThemeSelector } from './components/editor/ThemeSelector'
import { ConceptInput } from './components/editor/ConceptInput'
import { SexySlider } from './components/editor/SexySlider';
import { AccessorySlider } from './components/editor/AccessorySlider';
import { ScenePoseSection } from './components/editor/ScenePoseSection'
import { ExpressionSection } from './components/editor/ExpressionSection'
import { FramingSection } from './components/editor/FramingSection';
import { ResultsSection } from './components/results/ResultsSection'
import { SectionDivider } from './components/ui/SectionDivider'
import { SettingsModal } from './components/settings/SettingsModal';
import { FooterControls } from './components/layout/FooterControls';
import { HistoryOverlay } from './components/results/HistoryOverlay';
import { motion, AnimatePresence } from 'framer-motion'

import { useLanguage } from './contexts/LanguageContext'
import { useHistory } from './contexts/HistoryContext'
import { useSettings } from './contexts/SettingsContext'

// Fallback ID generator if crypto.randomUUID is missing
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

function App() {
  const { t } = useLanguage();
  const {
    history,
    addToHistory,
    toggleFavorite,
    removeFromHistory
  } = useHistory();
  const {
    apiKey,
    copyOptions,
    enableLighting,
    setEnableLighting,
    useWhiteBackground,
    setUseWhiteBackground
  } = useSettings();

  const [theme, setTheme] = useState('random')
  const [concept, setConcept] = useState('')
  const [sexyLevel, setSexyLevel] = useState(5)
  const [accessoryLevel, setAccessoryLevel] = useState<number>(5)
  const [selectedPose, setSelectedPose] = useState('model')
  const [poseDescription, setPoseDescription] = useState('')
  const [selectedExpression, setSelectedExpression] = useState('model')
  const [expressionDescription, setExpressionDescription] = useState('')
  const [selectedFraming, setSelectedFraming] = useState<string>('model')
  const [framingDescription, setFramingDescription] = useState<string>('')
  const [numPrompts, setNumPrompts] = useState(5)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [synthesisLogs, setSynthesisLogs] = useState<string[]>([])

  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState<number | null>(null)
  const [isAllCopied, setIsAllCopied] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showOverlay, setShowOverlay] = useState<'none' | 'history' | 'favorites'>('none')
  const [remixBase, setRemixBase] = useState<HistoryItem | null>(null)

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
      "SYNTHESIZING: STYLISTIC_WEIGHTS",
      "RANDOMIZING: OUTFIT_VARIATIONS",
      "OUTPUT_STREAM: OPENING"
    ]
    setSynthesisLogs([])
    logs.forEach((log, i) => {
      setTimeout(() => setSynthesisLogs(prev => [...prev, log]), i * 800)
    })

    try {
      const parts = {
        theme,
        concept,
        pose: selectedPose,
        expression: selectedExpression,
        framing: selectedFraming,
        poseDescription: poseDescription,
        expressionDescription: expressionDescription,
        framingDescription: framingDescription,
        sexyLevel: sexyLevel,
        accessoryLevel: accessoryLevel,
        enableLighting: enableLighting,
        useWhiteBackground: useWhiteBackground,
        remixBaseDesign: remixBase?.costume
      }
      const results = await generateCostumePrompts(apiKey, parts, numPrompts)

      const newHistoryItems: HistoryItem[] = results.map(r => ({
        ...r,
        id: generateId(),
        timestamp: Date.now(),
        isFavorite: false
      }))

      // Add each new item to history using context
      newHistoryItems.forEach(item => addToHistory(item));
      setGeneratedPrompts(newHistoryItems)

      setTimeout(() => {
        document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    } catch (error) {
      console.error(error);
      alert(`Error Transmitting: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
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

    const logs = ["INITIALIZING", "MAPPING_SPECTRUM", "GENERATING_EVOLUTION", "OUTPUT_STREAM"]
    setSynthesisLogs([])
    logs.forEach((log, i) => {
      setTimeout(() => setSynthesisLogs(prev => [...prev, log]), i * 800)
    })

    try {
      const parts = {
        theme,
        concept,
        pose: selectedPose,
        expression: selectedExpression,
        framing: selectedFraming,
        poseDescription: poseDescription,
        expressionDescription: expressionDescription,
        framingDescription: framingDescription,
        sexyLevel: sexyLevel,
        accessoryLevel: accessoryLevel,
        enableLighting: enableLighting,
        useWhiteBackground: useWhiteBackground,
        remixBaseDesign: remixBase?.costume
      }
      const results = await generateSexyRangePrompts(apiKey, 'any', parts as any, referencePrompt)

      const newHistoryItems: HistoryItem[] = results.map(r => ({
        ...r,
        id: generateId(),
        timestamp: Date.now(),
        isFavorite: false
      }))

      newHistoryItems.forEach(item => addToHistory(item));
      setGeneratedPrompts(newHistoryItems)

      setTimeout(() => {
        document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    } catch (error) {
      console.error(error);
      alert(`Error Range Transmitting: ${error instanceof Error ? error.message : 'An unknown error occurred'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRemix = (item: HistoryItem) => {
    // Restore states
    if (item.originalTheme) setTheme(item.originalTheme);
    if (item.originalConcept) setConcept(item.originalConcept);
    if (item.sexyLevel !== undefined) setSexyLevel(item.sexyLevel);
    if (item.accessoryLevel !== undefined) setAccessoryLevel(item.accessoryLevel);

    setRemixBase(item);
    setShowOverlay('none');

    // Scroll to top to show settings
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelRemix = () => {
    setRemixBase(null);
  };


  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setIsCopied(index)
    setTimeout(() => setIsCopied(null), 2000)
  }

  const handleCopyAll = () => {
    if (generatedPrompts.length === 0) return

    const allText = generatedPrompts.map(p => {
      const parts = [];
      if (copyOptions.costume && p.costume) parts.push(p.costume.replace(/\n/g, ' '));
      if (copyOptions.pose && p.composition) parts.push(p.composition.replace(/\n/g, ' '));
      if (copyOptions.framing && p.framing) parts.push(p.framing.replace(/\n/g, ' ')); // Added
      if (copyOptions.scene && p.scene) parts.push(p.scene.replace(/\n/g, ' '));

      if (parts.length === 0) return p.prompt.replace(/\n/g, ' ');
      return parts.join(', ');
    }).join('\n\n')

    navigator.clipboard.writeText(allText)
    setIsAllCopied(true)
    setTimeout(() => setIsAllCopied(false), 2000)
  }


  return (
    <div className="app-shell min-h-screen relative pb-32" style={{
      backgroundColor: remixBase ? 'rgba(40, 30, 0, 1)' : 'var(--deep-dark)',
      transition: 'background-color 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <div className="atelier-backdrop" style={{
        opacity: remixBase ? 0.3 : 1,
        transition: 'opacity 1.2s ease'
      }} />

      {/* Remix Mode Global Glow */}
      <AnimatePresence>
        {remixBase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(234, 179, 8, 0.1) 0%, transparent 80%)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
        )}
      </AnimatePresence>

      <Header
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <main className="max-w-4xl mx-auto px-6 grid grid-cols-1 gap-12 relative z-10 items-start">
        <div className="studio-panel space-y-12">
          <SectionDivider label="01: 衣装の設定" color="cyan" />

          <div className="space-y-12">
            <ThemeSelector selectedTheme={theme} onChange={setTheme} />

            <ConceptInput value={concept} onChange={setConcept} />
          </div>

          <div className="pt-4 border-t border-white/5">
            <SexySlider value={sexyLevel} onChange={setSexyLevel} />
          </div>

          <div className="pt-4 border-t border-white/5">
            <AccessorySlider value={accessoryLevel} onChange={setAccessoryLevel} />
          </div>

          <div className="border-t border-white/5 pt-8">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                width: '100%',
                padding: '10px 20px',
                backgroundColor: 'rgba(34, 211, 238, 0.03)',
                border: '1px solid rgba(34, 211, 238, 0.15)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 211, 238, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.4)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(34, 211, 238, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 211, 238, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  padding: '6px',
                  borderRadius: '10px',
                  backgroundColor: showAdvanced ? '#22d3ee' : 'rgba(34, 211, 238, 0.1)',
                  color: showAdvanced ? '#000' : '#22d3ee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  <Settings2 size={16} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    color: '#22d3ee',
                    letterSpacing: '0.15em',
                    lineHeight: '1.2'
                  }}>
                    詳細オプション
                  </span>
                  {!showAdvanced && (
                    <span style={{ fontSize: '8px', color: 'rgba(34, 211, 238, 0.4)', fontWeight: 600, marginTop: '2px' }}>
                      ポーズ・表情・フレーミング
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown
                size={18}
                style={{
                  color: '#22d3ee',
                  opacity: 0.4,
                  transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-12 mt-8"
                >
                  <ScenePoseSection
                    selectedPose={selectedPose}
                    setSelectedPose={setSelectedPose}
                    poseDescription={poseDescription}
                    setPoseDescription={setPoseDescription}
                  />

                  <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, rgba(16,185,129,0.5), rgba(249,115,22,0.5))', margin: '3rem 0', borderRadius: '2px', boxShadow: '0 0 15px rgba(249,115,22,0.3)' }} />

                  <ExpressionSection
                    selectedExpression={selectedExpression}
                    setSelectedExpression={setSelectedExpression}
                    expressionDescription={expressionDescription}
                    setExpressionDescription={setExpressionDescription}
                  />

                  <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, rgba(249,115,22,0.5), rgba(139,92,246,0.5))', margin: '3rem 0', borderRadius: '2px', boxShadow: '0 0 15px rgba(139,92,246,0.3)' }} />

                  <FramingSection
                    selectedFraming={selectedFraming}
                    setSelectedFraming={setSelectedFraming}
                    framingDescription={framingDescription}
                    setFramingDescription={setFramingDescription}
                  />

                  <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, rgba(139,92,246,0.5), rgba(34,211,238,0.5))', margin: '3rem 0', borderRadius: '2px', boxShadow: '0 0 15px rgba(34,211,238,0.3)' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <FooterControls
            enableLighting={enableLighting}
            setEnableLighting={setEnableLighting}
            useWhiteBackground={useWhiteBackground}
            setUseWhiteBackground={setUseWhiteBackground}
            isGenerating={isGenerating}
            handleGenerate={handleGenerate}
            numPrompts={numPrompts}
            setNumPrompts={setNumPrompts}
            onViewHistory={() => setShowOverlay('history')}
            onViewFavorites={() => setShowOverlay('favorites')}
          />
        </div>

        <HistoryOverlay
          isOpen={showOverlay !== 'none'}
          onClose={() => setShowOverlay('none')}
          history={history}
          mode={showOverlay === 'favorites' ? 'favorites' : 'history'}
          onToggleFavorite={toggleFavorite}
          onDelete={removeFromHistory}
          onCopy={handleCopy}
          onRemix={handleRemix}
          isCopied={isCopied}
          copyOptions={copyOptions}
          setCopyOptions={() => { }} // Placeholder or remove if using hook inside
        />

        <ResultsSection
          generatedPrompts={generatedPrompts}
          isGenerating={isGenerating}
          onCopy={handleCopy}
          onCopyAll={handleCopyAll}
          isCopied={isCopied}
          isAllCopied={isAllCopied}
          history={history}
          synthesisLogs={synthesisLogs}
          onToggleFavorite={toggleFavorite}
          onGenerateRange={handleGenerateRange}
          onRemix={handleRemix}
          copyOptions={copyOptions}
          setCopyOptions={() => { }} // Placeholder
        />

      </main >

      <AnimatePresence>
        {remixBase && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, x: '-50%' }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: '-50%',
            }}
            exit={{ opacity: 0, scale: 0.9, y: 50, x: '-50%' }}
            style={{
              position: 'fixed',
              bottom: '3rem',
              left: '50%',
              padding: '12px 24px',
              backgroundColor: 'rgba(234, 179, 8, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(234, 179, 8, 0.4)',
              borderRadius: '100px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              zIndex: 9999,
              color: '#000',
              cursor: 'default'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
              </motion.div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', opacity: 0.8, lineHeight: 1 }}>{t('common.mixing_mode')}</span>
                <span style={{ fontSize: '13px', fontWeight: 900, marginTop: '2px' }}>{remixBase.description}</span>
              </div>
            </div>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(0,0,0,0.15)' }} />
            <button
              onClick={cancelRemix}
              style={{
                fontSize: '11px',
                fontWeight: 900,
                color: '#fff',
                backgroundColor: '#000',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '50px',
                letterSpacing: '0.1em',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.backgroundColor = '#111';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#000';
              }}
            >
              {t('common.cancel')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  )
}

export default App
