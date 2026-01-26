import { ChevronDown, Settings2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppLogic } from './hooks/useAppLogic'
import { useEditor } from './contexts/EditorContext'

// Components
import { Header } from './components/layout/Header'
import { ThemeSelector } from './components/editor/ThemeSelector'
import { ConceptInput } from './components/editor/ConceptInput'
import { CharacterSection } from './components/editor/CharacterSection'
import { SexySlider } from './components/editor/SexySlider';
import { AccessorySlider } from './components/editor/AccessorySlider';
import { ScenePoseSection } from './components/editor/ScenePoseSection'
import { ExpressionSection } from './components/editor/ExpressionSection'
import { FramingSection } from './components/editor/FramingSection';
import { SceneSection } from './components/editor/SceneSection';
import { ResultsSection } from './components/results/ResultsSection'
import { SectionDivider } from './components/ui/SectionDivider'
import { SettingsModal } from './components/settings/SettingsModal';
import { FooterControls } from './components/layout/FooterControls';
import { HistoryOverlay } from './components/results/HistoryOverlay';
import { OnboardingTour } from './components/guide/OnboardingTour';
import { useSettings } from './contexts/SettingsContext';
import { useEffect, useState } from 'react';

function App() {
  const {
    // System States
    isGenerating,
    generatedPrompts,
    synthesisLogs,
    isCopied,
    isAllCopied,
    showSettings, setShowSettings,
    showOverlay, setShowOverlay,
    showCompletion,
    isApiKeyError,

    // Context & Settings
    t,
    history,
    copyOptions,

    // Handlers
    handleGenerate,
    cancelRemix,
    handleCopy,
    handleCopyAll,
    handleSetCopyOptions,
    toggleFavorite,
    removeFromHistory
  } = useAppLogic();

  const {
    showAdvanced, setShowAdvanced,
    isCharacterMode,
    remixBase
  } = useEditor();

  const { hasSeenOnboarding, startTour } = useSettings();
  const [settingsTab, setSettingsTab] = useState<'config' | 'usage' | undefined>(undefined);

  // Reset settings tab only when explicitly closing
  const handleCloseSettings = () => {
    setShowSettings(false);
    setTimeout(() => setSettingsTab(undefined), 300); // Delay reset to prevent UI flash
  };

  useEffect(() => {
    // Auto-start tour if not seen
    if (!hasSeenOnboarding) {
      // Small delay to ensure loading
      setTimeout(() => {
        startTour();
      }, 1000);
    }
  }, [hasSeenOnboarding, startTour]);

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

      <OnboardingTour
        onFinish={() => {
          setSettingsTab('config');
          setTimeout(() => setShowSettings(true), 500);
        }}
      />

      <Header
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={handleCloseSettings}
        hasError={isApiKeyError}
        initialTab={isApiKeyError ? "config" : settingsTab}
      />

      <main className="max-w-4xl mx-auto px-6 grid grid-cols-1 gap-12 relative z-10 items-start">
        <div className="studio-panel space-y-12">
          <SectionDivider label={t('editor.section_costume_title')} color="cyan" />

          <CharacterSection />

          <AnimatePresence mode="wait">
            {!isCharacterMode && (
              <motion.div
                key="standard-mode"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                <ThemeSelector />
                <div id="tour-main-input">
                  <ConceptInput />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4 border-t border-white/5" id="tour-sliders">
            <SexySlider />
          </div>

          <div className="pt-4 border-t border-white/5">
            <AccessorySlider />
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
                    {t('editor.advanced_options')}
                  </span>
                  {!showAdvanced && (
                    <span style={{ fontSize: '8px', color: 'rgba(34, 211, 238, 0.4)', fontWeight: 600, marginTop: '2px' }}>
                      {t('editor.advanced_subtitle')}
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
                  <ScenePoseSection />
                  <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, rgba(16,185,129,0.5), rgba(249,115,22,0.5))', margin: '3rem 0', borderRadius: '2px', boxShadow: '0 0 15px rgba(249,115,22,0.3)' }} />
                  <ExpressionSection />
                  <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, rgba(249,115,22,0.5), rgba(139,92,246,0.5))', margin: '3rem 0', borderRadius: '2px', boxShadow: '0 0 15px rgba(139,92,246,0.3)' }} />
                  <FramingSection />
                  <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, rgba(139,92,246,0.5), rgba(34,211,238,0.5))', margin: '3rem 0', borderRadius: '2px', boxShadow: '0 0 15px rgba(34,211,238,0.3)' }} />
                  <SceneSection />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <FooterControls
            isGenerating={isGenerating}
            handleGenerate={handleGenerate}
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
          isCopied={isCopied}
          copyOptions={copyOptions}
          setCopyOptions={handleSetCopyOptions}
          onModeChange={(mode) => setShowOverlay(mode)}
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
          copyOptions={copyOptions}
          setCopyOptions={handleSetCopyOptions}
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
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{
              background: 'rgba(0, 242, 255, 0.15)',
              border: '2px solid #00f2ff',
              borderRadius: '20px',
              padding: '40px 80px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 50px rgba(0, 242, 255, 0.4), inset 0 0 30px rgba(0, 242, 255, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.1 }}
              >
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00f2ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 10px #00f2ff)' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
              </motion.div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#fff',
                letterSpacing: '0.2em',
                textShadow: '0 0 20px rgba(0, 242, 255, 0.6)',
                margin: 0,
                textTransform: 'uppercase'
              }}>
                COMPLETED
              </h2>
              <div style={{ width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, #00f2ff, transparent)', opacity: 0.5 }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  )
}

export default App
