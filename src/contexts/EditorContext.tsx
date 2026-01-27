import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type HistoryItem } from '../types';

interface EditorContextType {
    // Basic Settings
    theme: string;
    setTheme: (theme: string) => void;
    concept: string;
    setConcept: (concept: string) => void;
    sexyLevel: number;
    setSexyLevel: (level: number) => void;
    accessoryLevel: number;
    setAccessoryLevel: (level: number) => void;
    numPrompts: number;
    setNumPrompts: (num: number) => void;
    showAdvanced: boolean;
    setShowAdvanced: (show: boolean) => void;
    isR18Mode: boolean;
    setIsR18Mode: (is: boolean) => void;
    isCharacterMode: boolean;
    setIsCharacterMode: (is: boolean) => void;
    characterInput: string;
    setCharacterInput: (input: string) => void;
    characterCostume: string;
    setCharacterCostume: (costume: string) => void;
    lockCostume: boolean;
    setLockCostume: (lock: boolean) => void;

    // Pose & Expression
    selectedPoseStance: string;
    setSelectedPoseStance: (stance: string) => void;
    poseDescription: string;
    setPoseDescription: (desc: string) => void;
    selectedExpression: string;
    setSelectedExpression: (expr: string) => void;
    expressionDescription: string;
    setExpressionDescription: (desc: string) => void;

    // Framing & Scene
    selectedShotType: string;
    setSelectedShotType: (type: string) => void;
    selectedShotAngle: string;
    setSelectedShotAngle: (angle: string) => void;
    framingDescription: string;
    setFramingDescription: (desc: string) => void;
    selectedScene: string;
    setSelectedScene: (scene: string) => void;
    sceneDescription: string;
    setSceneDescription: (desc: string) => void;

    // Control States
    remixBase: HistoryItem | null;
    setRemixBase: (item: HistoryItem | null) => void;

    // Common Actions
    resetEditor: () => void;
    applyRemix: (item: HistoryItem) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState('random');
    const [concept, setConcept] = useState('');
    const [sexyLevel, setSexyLevel] = useState(5);
    const [accessoryLevel, setAccessoryLevel] = useState<number>(1);
    const [selectedPoseStance, setSelectedPoseStance] = useState('model');
    const [poseDescription, setPoseDescription] = useState('');
    const [selectedExpression, setSelectedExpression] = useState('model');
    const [expressionDescription, setExpressionDescription] = useState('');
    const [selectedShotType, setSelectedShotType] = useState<string>('cowboy_shot');
    const [selectedShotAngle, setSelectedShotAngle] = useState<string>('front');
    const [framingDescription, setFramingDescription] = useState<string>('');
    const [selectedScene, setSelectedScene] = useState<string>('white');
    const [sceneDescription, setSceneDescription] = useState<string>('');
    const [numPrompts, setNumPrompts] = useState(5);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isR18Mode, setIsR18Mode] = useState(false);
    const [isCharacterMode, setIsCharacterMode] = useState(false);
    const [characterInput, setCharacterInput] = useState('');
    const [characterCostume, setCharacterCostume] = useState('');
    const [lockCostume, setLockCostume] = useState(false);
    const [remixBase, setRemixBase] = useState<HistoryItem | null>(null);

    const resetEditor = useCallback(() => {
        setTheme('random');
        setConcept('');
        setSexyLevel(5);
        setAccessoryLevel(1);
        setIsR18Mode(false);
        setSelectedPoseStance('model');
        setPoseDescription('');
        setSelectedExpression('model');
        setExpressionDescription('');
        setSelectedShotType('cowboy_shot');
        setSelectedShotAngle('front');
        setFramingDescription('');
        setSelectedScene('white');
        setSceneDescription('');
        setRemixBase(null);
        setLockCostume(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const applyRemix = useCallback((item: HistoryItem) => {
        if (item.originalTheme) setTheme(item.originalTheme);
        if (item.originalPoseStance) setSelectedPoseStance(item.originalPoseStance);
        if (item.originalPoseDescription) setPoseDescription(item.originalPoseDescription);
        if (item.originalExpression) setSelectedExpression(item.originalExpression);
        if (item.originalExpressionDescription) setExpressionDescription(item.originalExpressionDescription);
        if (item.originalShotType) setSelectedShotType(item.originalShotType);
        if (item.originalShotAngle) setSelectedShotAngle(item.originalShotAngle);
        if (item.originalFramingDescription) setFramingDescription(item.originalFramingDescription);
        if (item.sexyLevel !== undefined) setSexyLevel(item.sexyLevel);
        if (item.accessoryLevel !== undefined) setAccessoryLevel(item.accessoryLevel);
        if (item.originalSceneId) setSelectedScene(item.originalSceneId);
        if (item.originalSceneDescription) setSceneDescription(item.originalSceneDescription);

        if (item.isCharacterMode) {
            setIsCharacterMode(true);
            if (item.character) setCharacterInput(item.character.replace(/\n/g, ' '));
            else if (item.characterName) setCharacterInput(item.characterName);

            if (item.costume) setCharacterCostume(item.costume.replace(/\n/g, ' '));
            else if (item.characterCostume) setCharacterCostume(item.characterCostume);
        } else {
            setIsCharacterMode(false);
            if (item.costume) setConcept(item.costume.replace(/\n/g, ' '));
            else if (item.originalConcept) setConcept(item.originalConcept);
        }

        setRemixBase(item);
        setLockCostume(true);

        setTimeout(() => {
            const element = document.getElementById('lock-costume-target');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 100);
    }, []);

    return (
        <EditorContext.Provider value={{
            theme, setTheme,
            concept, setConcept,
            sexyLevel, setSexyLevel,
            accessoryLevel, setAccessoryLevel,
            numPrompts, setNumPrompts,
            showAdvanced, setShowAdvanced,
            isR18Mode, setIsR18Mode,
            isCharacterMode, setIsCharacterMode,
            characterInput, setCharacterInput,
            characterCostume, setCharacterCostume,
            lockCostume, setLockCostume,
            selectedPoseStance, setSelectedPoseStance,
            poseDescription, setPoseDescription,
            selectedExpression, setSelectedExpression,
            expressionDescription, setExpressionDescription,
            selectedShotType, setSelectedShotType,
            selectedShotAngle, setSelectedShotAngle,
            framingDescription, setFramingDescription,
            selectedScene, setSelectedScene,
            sceneDescription, setSceneDescription,
            remixBase, setRemixBase,
            resetEditor,
            applyRemix
        }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (context === undefined) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
};
