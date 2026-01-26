/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type HistoryItem } from '../types';

interface HistoryContextType {
    history: HistoryItem[];
    addToHistory: (item: HistoryItem) => void;
    removeFromHistory: (id: string) => void;
    toggleFavorite: (id: string) => void;
    clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const MAX_HISTORY = 100; // 履歴の最大保持数（お気に入りは除外）

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<HistoryItem[]>(() => {
        const saved = localStorage.getItem('costume_history');
        if (saved && saved !== 'undefined') {
            try {
                const parsed = JSON.parse(saved);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                console.error("Failed to parse history", e);
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('costume_history', JSON.stringify(history));
    }, [history]);

    const addToHistory = (item: HistoryItem) => {
        setHistory(prev => {
            const newHistory = [item, ...prev];

            // お気に入りと通常の履歴を分離
            const favorites = newHistory.filter(h => h.isFavorite);
            const nonFavorites = newHistory.filter(h => !h.isFavorite);

            // 通常の履歴は最大MAX_HISTORY件まで
            const trimmedNonFavorites = nonFavorites.slice(0, MAX_HISTORY);

            // お気に入りは無制限、通常履歴は制限付き
            return [...favorites, ...trimmedNonFavorites]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        });
    };

    const removeFromHistory = (id: string) => {
        setHistory(prev => prev.filter(item => item.id !== id));
    };

    const toggleFavorite = (id: string) => {
        setHistory(prev => prev.map(item =>
            item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        ));
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <HistoryContext.Provider value={{
            history,
            addToHistory,
            removeFromHistory,
            toggleFavorite,
            clearHistory
        }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (context === undefined) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
};
