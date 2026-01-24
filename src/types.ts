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
    originalPoseStance?: string;
    originalExpression?: string;
    originalFraming?: string;
    originalShotType?: string;
    originalShotAngle?: string;
    originalPoseDescription?: string;
    originalExpressionDescription?: string;
    originalFramingDescription?: string;
    isR18Mode?: boolean;
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
    poseStance?: string;
    poseStanceId?: string;
    poseDescription?: string;
    expression?: string;
    expressionId?: string;
    expressionDescription?: string;
    framing?: string;
    framingId?: string;
    framingDescription?: string;
    shotType?: string;
    shotAngle?: string;
    shotTypeId?: string;
    shotAngleId?: string;
    originalShotType?: string;
    originalShotAngle?: string;
    enableLighting?: boolean;
    useWhiteBackground?: boolean;
    base?: string;
    accessories?: string;
    background?: string;
    remixBaseDesign?: string;
    isR18Mode?: boolean;
}
