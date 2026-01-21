import { createContext, useContext, useState, type ReactNode } from 'react';
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
        let current: any = translations[language];

        for (const key of keys) {
            if (current[key] === undefined) {
                // Fallback to Japanese if key not found in current language
                // or just return the path for debugging
                console.warn(`Translation key not found: ${path}`);
                return path;
            }
            current = current[key];
        }

        return current as string;
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
