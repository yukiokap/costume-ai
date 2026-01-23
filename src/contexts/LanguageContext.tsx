/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type Language } from '../i18n/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Try to load language from localStorage or browser settings
    const [language, setLanguageState] = useState<Language>(() => {
        const savedLang = localStorage.getItem('app_language') as Language;
        if (savedLang && (savedLang === 'ja' || savedLang === 'en')) return savedLang;

        // Check browser language
        const browserLang = navigator.language.split('-')[0];
        return (browserLang === 'ja' || browserLang === 'en') ? browserLang as Language : 'ja';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('app_language', lang);
    };

    // Helper function to get nested translation value
    const t = (path: string): string => {
        const keys = path.split('.');
        let current: unknown = translations[language];

        for (const key of keys) {
            if (typeof current === 'object' && current !== null && key in current) {
                current = (current as Record<string, unknown>)[key];
            } else {
                console.warn(`Translation key not found: ${path}`);
                return path;
            }
        }

        return typeof current === 'string' ? current : path;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
