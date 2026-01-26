import { useState, useEffect, type SetStateAction, useCallback } from 'react';
import { type GeneratedPrompt, type HistoryItem, type DesignParts } from '../types';
import { generateCostumePrompts, generateSexyRangePrompts } from '../services/gemini';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';
import { useSettings } from '../contexts/SettingsContext';
import { useEditor } from '../contexts/EditorContext';
import { getAppError } from '../utils/errorHandler';
import { generateId } from '../utils/common';
import { getOptionPool, getEnhancedPosePool, getEnhancedExpressionPool } from '../utils/promptUtils';
import { STANDARD_ITEMS, COSTUME_LIST } from '../data/costumes';
import { ANIME_ITEMS } from '../data/items/anime';
import { EXPRESSION_DATA } from '../data/expressions_data';
import { POSE_STANCE_DATA, POSE_MOOD_DATA } from '../data/poses_data';
import { FRAMING_DATA } from '../data/framing_data';
import { SHOT_TYPES } from '../data/framing';

export const useAppLogic = () => {
    const { t, language: _language } = useLanguage();
    const {
        history,
        addToHistory,
        toggleFavorite,
        removeFromHistory,
        clearHistory
    } = useHistory();
    const {
        apiKey,
        copyOptions,
        setCopyOptions,
        enableLighting,
        useWhiteBackground,
    } = useSettings();

    const {
        theme,
        concept,
        sexyLevel,
        accessoryLevel,
        selectedPoseStance,
        poseDescription,
        selectedExpression,
        expressionDescription,
        selectedShotType,
        selectedShotAngle,
        framingDescription,
        selectedScene,
        sceneDescription,
        numPrompts,
        isR18Mode,
        isCharacterMode,
        characterInput,
        characterCostume,
        remixBase, setRemixBase,
        resetEditor,
        applyRemix
    } = useEditor();

    // System States
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([]);
    const [synthesisLogs, setSynthesisLogs] = useState<string[]>([]);
    const [isCopied, setIsCopied] = useState<number | null>(null);
    const [isAllCopied, setIsAllCopied] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showOverlay, setShowOverlay] = useState<'none' | 'history' | 'favorites'>('none');
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [showCompletion, setShowCompletion] = useState(false);
    const [isApiKeyError, setIsApiKeyError] = useState(false);
    const [hasGeneratedBefore, setHasGeneratedBefore] = useState(() => {
        return localStorage.getItem('has_generated_before') === 'true';
    });

    // R18 Mode CSS Class
    useEffect(() => {
        if (isR18Mode) {
            document.documentElement.classList.add('r18-mode');
        } else {
            document.documentElement.classList.remove('r18-mode');
        }
    }, [isR18Mode]);

    // First Launch Logic: Show Guide if no API key is set
    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('has_seen_welcome');
        if (!apiKey && !hasSeenWelcome) {
            setShowSettings(true);
            localStorage.setItem('has_seen_welcome', 'true');
        }
    }, [apiKey]);

    const handleSetCopyOptions = (action: SetStateAction<{
        costume: boolean;
        character: boolean;
        pose: boolean;
        framing: boolean;
        scene: boolean;
    }>) => {
        if (typeof action === 'function') {
            const next = action(copyOptions);
            setCopyOptions(next);
        } else {
            setCopyOptions(action);
        }
    };

    const getEffectiveConcept = useCallback((isRange: boolean = false) => {
        if (concept.trim()) return concept;

        let pool = STANDARD_ITEMS;
        if (isCharacterMode) {
            pool = ANIME_ITEMS;
        } else if (theme !== 'random' && COSTUME_LIST[theme]) {
            pool = COSTUME_LIST[theme];
        } else if (theme !== 'random') {
            const filtered = STANDARD_ITEMS.filter(item => item.tags.includes(theme));
            if (filtered.length > 20) {
                pool = filtered;
            }
        }

        if (isRange) {
            const randomItem = pool[Math.floor(Math.random() * pool.length)];
            return randomItem ? `${randomItem.jp} (${randomItem.en})` : '';
        } else {
            const selected = [];
            const tempPool = [...pool];
            for (let i = 0; i < numPrompts; i++) {
                if (tempPool.length === 0) break;
                const idx = Math.floor(Math.random() * tempPool.length);
                const item = tempPool[idx];
                selected.push(`${item.jp} (${item.en})`);
                tempPool.splice(idx, 1);
            }
            return `[DIVERSE_REQUEST: ${selected.join(' | ')}]`;
        }
    }, [concept, isCharacterMode, theme, numPrompts]);

    const runSynthesisLogs = useCallback(() => {
        const logs = [
            "NEURAL_LINK: ESTABLISHED",
            "DATA_POOL: CALIBRATING...",
            "SYNTHESIZING: STYLISTIC_WEIGHTS",
            "MAPPING: AESTHETIC_COORDINATES",
            "UPDATING: TEXTURE_LAYERS",
            "ANALYZING: POSING_MATRICES",
            "EXTRACTING: DESIGN_VIBES",
            "INJECTING: FASHION_DNA",
            "REFINING: ACCESSORY_NODES",
            "RANDOMIZING: OUTFIT_VARIATIONS",
            "VALIDATING: DESIGN_INTEGRITY",
            "FINALIZING: PROMPT_STRUCTURE",
            "OUTPUT_STREAM: OPENING"
        ];
        setSynthesisLogs([]);
        logs.forEach((log, i) => {
            setTimeout(() => setSynthesisLogs(prev => [...prev, log]), i * 450);
        });
    }, []);

    const handleGenerate = async () => {
        if (isGenerating && abortController) {
            abortController.abort();
            setAbortController(null);
            setIsGenerating(false);
            return;
        }

        const currentKey = apiKey || localStorage.getItem('gemini_api_key');
        if (!currentKey) {
            setIsApiKeyError(false);
            setShowSettings(true);
            return;
        }

        const controller = new AbortController();
        setAbortController(controller);
        setIsGenerating(true);
        setGeneratedPrompts([]);
        setIsApiKeyError(false);
        runSynthesisLogs();

        try {
            // --- Character Fidelity Enhancement ---
            // If the user manually types a known character name, fetch their predefined traits
            // to prevent hallucinations (like Hatsune Miku having pink hair).
            let characterFidelityDesign = '';
            if (isCharacterMode && characterInput) {
                const searchName = characterInput.toLowerCase().trim();
                const matchedCharacter = ANIME_ITEMS.find(item =>
                    item.jp.toLowerCase().includes(searchName) ||
                    item.en.toLowerCase().includes(searchName) ||
                    // Check for common variations like just "Miku" or "Hatsune"
                    (searchName.length > 3 && (
                        item.en.toLowerCase().includes(searchName) ||
                        item.jp.toLowerCase().includes(searchName)
                    ))
                );
                if (matchedCharacter) {
                    characterFidelityDesign = matchedCharacter.en;
                }
            }

            const parts: DesignParts = {
                theme: isCharacterMode ? 'anime' : theme,
                concept: isCharacterMode ? (
                    characterInput
                        ? (characterCostume ? `${characterInput} wearing ${characterCostume}` : characterInput)
                        : getEffectiveConcept(false)
                ) : getEffectiveConcept(false),
                remixBaseDesign: characterFidelityDesign || (remixBase?.costume || ''),
                poseStanceId: selectedPoseStance,
                poseStance: getEnhancedPosePool(selectedPoseStance, POSE_MOOD_DATA, POSE_STANCE_DATA, numPrompts),
                expressionId: selectedExpression,
                expression: getEnhancedExpressionPool(selectedExpression, EXPRESSION_DATA, numPrompts),
                shotType: selectedShotType === 'random' ? getOptionPool('random', { types: SHOT_TYPES.map((t: any) => t.prompt) } as any, numPrompts) : selectedShotType.replace(/_/g, ' '),
                shotAngle: getOptionPool(selectedShotAngle, FRAMING_DATA, numPrompts),
                shotTypeId: selectedShotType,
                shotAngleId: selectedShotAngle,
                poseDescription: poseDescription,
                expressionDescription: expressionDescription,
                framingDescription: framingDescription,
                sexyLevel: sexyLevel,
                accessoryLevel: accessoryLevel,
                enableLighting: enableLighting,
                useWhiteBackground: useWhiteBackground,
                selectedSceneId: selectedScene,
                sceneDescription: sceneDescription,
                isR18Mode: isR18Mode,
                isCharacterMode: isCharacterMode,
                characterName: isCharacterMode ? characterInput : undefined,
                characterCostume: isCharacterMode ? characterCostume : undefined,
                originalShotType: selectedShotType,
                originalShotAngle: selectedShotAngle,
            };
            const results = await generateCostumePrompts(apiKey, parts, numPrompts, _language, controller.signal);

            const newHistoryItems: HistoryItem[] = results.map(r => ({
                ...r,
                id: generateId(),
                timestamp: Date.now(),
                isFavorite: false
            }));

            newHistoryItems.forEach(item => addToHistory(item));
            setGeneratedPrompts(newHistoryItems);

            setTimeout(() => {
                document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' });
            }, 500);

            setShowCompletion(true);
            setTimeout(() => setShowCompletion(false), 3000);

            if (!hasGeneratedBefore) {
                setHasGeneratedBefore(true);
                localStorage.setItem('has_generated_before', 'true');
            }
        } catch (error: any) {
            const isAbort = error.name === 'AbortError' || error.message?.toLowerCase().includes('abort');
            if (isAbort) return;
            console.error(error);
            const appError = getAppError(error, t);

            // If API key is invalid, automatically open settings WITHOUT alert
            if (appError.type === 'api_key') {
                setIsApiKeyError(true);
                setShowSettings(true);
            } else {
                alert(appError.message); // Other errors still might need alert for now
            }
        } finally {
            setIsGenerating(false);
            setAbortController(null);
        }
    };

    const handleGenerateRange = async (referencePrompt?: string) => {
        if (isGenerating && abortController) {
            abortController.abort();
            setAbortController(null);
            setIsGenerating(false);
            return;
        }

        const currentKey = apiKey || localStorage.getItem('gemini_api_key');
        if (!currentKey) {
            setIsApiKeyError(false);
            setShowSettings(true);
            return;
        }

        const controller = new AbortController();
        setAbortController(controller);
        setIsGenerating(true);
        setGeneratedPrompts([]);
        setIsApiKeyError(false);
        runSynthesisLogs();

        try {
            const parts: DesignParts = {
                theme,
                concept: getEffectiveConcept(true),
                poseStanceId: selectedPoseStance,
                poseStance: getEnhancedPosePool(selectedPoseStance, POSE_MOOD_DATA, POSE_STANCE_DATA, 10),
                expressionId: selectedExpression,
                expression: getEnhancedExpressionPool(selectedExpression, EXPRESSION_DATA, 10),
                shotType: selectedShotType === 'random' ? getOptionPool('random', { types: SHOT_TYPES.map((t: any) => t.prompt) } as any, 10) : selectedShotType.replace(/_/g, ' '),
                shotAngle: getOptionPool(selectedShotAngle, FRAMING_DATA, 10),
                shotTypeId: selectedShotType,
                shotAngleId: selectedShotAngle,
                poseDescription: poseDescription,
                expressionDescription: expressionDescription,
                framingDescription: framingDescription,
                sexyLevel: sexyLevel,
                accessoryLevel: accessoryLevel,
                enableLighting: enableLighting,
                useWhiteBackground: useWhiteBackground,
                selectedSceneId: selectedScene,
                sceneDescription: sceneDescription,
                remixBaseDesign: remixBase?.costume || '',
                isR18Mode: isR18Mode,
                originalShotType: selectedShotType,
                originalShotAngle: selectedShotAngle,
            };
            const results = await generateSexyRangePrompts(apiKey, parts, referencePrompt, _language, controller.signal);

            const newHistoryItems: HistoryItem[] = results.map(r => ({
                ...r,
                id: generateId(),
                timestamp: Date.now(),
                isFavorite: false
            }));

            newHistoryItems.forEach(item => addToHistory(item));
            setGeneratedPrompts(newHistoryItems);

            setTimeout(() => {
                document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' });
            }, 500);

            setShowCompletion(true);
            setTimeout(() => setShowCompletion(false), 3000);

            if (!hasGeneratedBefore) {
                setHasGeneratedBefore(true);
                localStorage.setItem('has_generated_before', 'true');
            }
        } catch (error: any) {
            const isAbort = error.name === 'AbortError' || error.message?.toLowerCase().includes('abort');
            if (isAbort) return;
            console.error(error);
            const appError = getAppError(error, t);

            // If API key is invalid, automatically open settings WITHOUT alert
            if (appError.type === 'api_key') {
                setIsApiKeyError(true);
                setShowSettings(true);
            } else {
                alert(appError.message);
            }
        } finally {
            setIsGenerating(false);
            setAbortController(null);
        }
    };

    const handleRemix = (item: HistoryItem) => {
        applyRemix(item);
        setShowOverlay('none');
    };

    const cancelRemix = () => {
        setRemixBase(null);
    };

    const handleReset = () => {
        resetEditor();
    };

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setIsCopied(index);
        setTimeout(() => setIsCopied(null), 2000);
    };

    const handleCopyAll = () => {
        if (generatedPrompts.length === 0) return;

        const allText = generatedPrompts.map(p => {
            const parts = [];
            if (copyOptions.character && p.character) parts.push(p.character.replace(/\n/g, ' '));
            if (copyOptions.costume && p.costume) parts.push(p.costume.replace(/\n/g, ' '));
            if (copyOptions.pose && p.composition) parts.push(p.composition.replace(/\n/g, ' '));
            if (copyOptions.framing && p.framing) parts.push(p.framing.replace(/\n/g, ' '));
            if (copyOptions.scene && p.scene) parts.push(p.scene.replace(/\n/g, ' '));

            if (parts.length === 0) return p.prompt.replace(/\n/g, ' ');
            return parts.join(', ');
        }).join('\n\n');

        navigator.clipboard.writeText(allText);
        setIsAllCopied(true);
        setTimeout(() => setIsAllCopied(false), 2000);
    };

    return {
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
        hasGeneratedBefore,
        setHasGeneratedBefore,

        // Contexts & Settings
        t,
        history,
        apiKey,
        copyOptions,

        // Handlers
        handleGenerate,
        handleGenerateRange,
        handleRemix,
        cancelRemix,
        handleReset,
        handleCopy,
        handleCopyAll,
        handleSetCopyOptions,
        toggleFavorite,
        removeFromHistory,
        clearHistory
    };
};
