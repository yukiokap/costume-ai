import { Zap, ZoomIn, ArrowDown, ArrowRight, ArrowLeft, Maximize, Scan, Camera } from 'lucide-react';

export interface FramingArchetype {
    id: string;
    label: string;
    description: string;
    icon: any;
    prompt: string;
}

export const FRAMING_ARCHETYPES: FramingArchetype[] = [
    {
        id: 'model',
        label: 'カタログ風',
        description: 'Professional Catalog',
        icon: Camera,
        prompt: 'full body, from front, eye level'
    },
    {
        id: 'random',
        label: 'おまかせ',
        description: 'AI Decision',
        icon: Zap,
        prompt: 'best angle to showcase the outfit'
    },
    {
        id: 'full_body',
        label: '全身',
        description: 'Head to Toe',
        icon: Maximize,
        prompt: 'full body shot, showing shoes and head'
    },
    {
        id: 'knee_up',
        label: '膝上',
        description: 'Knee Up',
        icon: ArrowDown,
        prompt: 'knee up shot, balanced composition'
    },
    {
        id: 'portrait',
        label: 'アップ',
        description: 'Portrait / Bust',
        icon: ZoomIn,
        prompt: 'upper body shot, portrait, focus on face and chest'
    },
    {
        id: 'front',
        label: '正面',
        description: 'From Front',
        icon: Scan,
        prompt: 'view from front, symmetric composition'
    },
    {
        id: 'side',
        label: '横顔',
        description: 'Side View',
        icon: ArrowRight,
        prompt: 'view from side, side profile'
    },
    {
        id: 'back',
        label: '後ろ姿',
        description: 'Back View',
        icon: ArrowLeft,
        prompt: 'view from behind, back shot, showing back design'
    },
    {
        id: 'dynamic',
        label: 'ダイナミック',
        description: 'Dynamic Angle',
        icon: Zap,
        prompt: 'dynamic angle, dutch angle, from below or above, dramatic composition'
    }
];

export const FRAMING_SETTINGS = FRAMING_ARCHETYPES;
