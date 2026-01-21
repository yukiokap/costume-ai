export interface GeneratedPrompt {
    id?: string;
    description: string;
    prompt: string;
    costume?: string;
    composition?: string;
    scene?: string;
    framing?: string;
    sexyLevel?: number;
    accessoryLevel?: number;
    originalConcept?: string;
    originalTheme?: string;
    originalPoseMood?: string;
    originalPoseStance?: string;
}

export interface HistoryItem extends GeneratedPrompt {
    id: string;
    timestamp: number;
    isFavorite: boolean;
}

export interface DesignParts {
    theme: string;
    concept: string;
    sexyLevel: number;
    accessoryLevel: number;
    pose?: string;
    poseMood?: string;
    poseStance?: string;
    poseDescription?: string;
    expression?: string;
    expressionDescription?: string;
    framing?: string;
    framingDescription?: string;
    enableLighting?: boolean;
    useWhiteBackground?: boolean;
    base?: string;
    accessories?: string;
    background?: string;
    remixBaseDesign?: string;
}
