import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './contexts/LanguageContext'
import { HistoryProvider } from './contexts/HistoryContext'
import { SettingsProvider } from './contexts/SettingsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <SettingsProvider>
        <HistoryProvider>
          <App />
        </HistoryProvider>
      </SettingsProvider>
    </LanguageProvider>
  </StrictMode>,
)
