import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './contexts/LanguageContext'
import { HistoryProvider } from './contexts/HistoryContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { EditorProvider } from './contexts/EditorContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <SettingsProvider>
        <HistoryProvider>
          <EditorProvider>
            <App />
          </EditorProvider>
        </HistoryProvider>
      </SettingsProvider>
    </LanguageProvider>
  </StrictMode>,
)
