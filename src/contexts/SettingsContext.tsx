/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface CopyOptions {
    costume: boolean;
    pose: boolean;
    framing: boolean;
    scene: boolean;
}

interface SettingsContextType {
    apiKey: string;
    saveApiKey: (key: string) => void;
    copyOptions: CopyOptions;
    setCopyOptions: (options: CopyOptions) => void;
    enableLighting: boolean;
    setEnableLighting: (val: boolean) => void;
    useWhiteBackground: boolean;
    setUseWhiteBackground: (val: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
    const [copyOptions, setCopyOptionsState] = useState<CopyOptions>(() => {
        const saved = localStorage.getItem('copy_options');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse copy options", e);
            }
        }
        return { costume: true, pose: true, framing: true, scene: true };
    });

    const [enableLighting, setEnableLighting] = useState(false);
    const [useWhiteBackground, setUseWhiteBackground] = useState(true);

    const saveApiKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('gemini_api_key', key);
    };

    const setCopyOptions = (options: CopyOptions) => {
        setCopyOptionsState(options);
        localStorage.setItem('copy_options', JSON.stringify(options));
    };

    return (
        <SettingsContext.Provider value={{
            apiKey,
            saveApiKey,
            copyOptions,
            setCopyOptions,
            enableLighting,
            setEnableLighting,
            useWhiteBackground,
            setUseWhiteBackground
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
