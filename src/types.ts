import { type CostumeItem, type AccessoryItem } from './constants'

export interface GeneratedPrompt {
    id?: string;
    description: string;
    prompt: string;
}

export interface HistoryItem extends GeneratedPrompt {
    id: string;
    timestamp: number;
    isFavorite: boolean;
}

export interface DesignParts {
    base: string;
    accessories: string;
    background: string;
    pose: string;
    poseDescription: string;
    sexyLevel: string;
}
