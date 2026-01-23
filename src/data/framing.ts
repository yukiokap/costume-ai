import { Maximize, Scan, ZoomIn, Camera, StretchHorizontal, ArrowDown, ArrowUp, ArrowRight, ArrowLeft, Zap, Focus, type LucideIcon } from 'lucide-react';

export interface FramingItem {
    id: string;
    label: string;
    description: string;
    icon: LucideIcon;
    prompt: string;
}

export const SHOT_TYPES: FramingItem[] = [
    {
        id: 'full_body',
        label: '全身',
        description: 'Full Body',
        icon: Maximize,
        prompt: 'full body'
    },
    {
        id: 'cowboy_shot',
        label: '膝上',
        description: 'Cowboy Shot',
        icon: Camera,
        prompt: 'cowboy shot'
    },
    {
        id: 'waist_up',
        label: '腰上',
        description: 'Waist Up',
        icon: StretchHorizontal,
        prompt: 'waist up'
    },
    {
        id: 'upper_body',
        label: '胸上',
        description: 'Upper Body',
        icon: Scan,
        prompt: 'upper body'
    },
    {
        id: 'close_up',
        label: '接写',
        description: 'Close-up',
        icon: ZoomIn,
        prompt: 'close-up'
    }
];

export const SHOT_ANGLES: FramingItem[] = [
    {
        id: 'front',
        label: '正面',
        description: 'Front View',
        icon: Focus,
        prompt: 'from front'
    },
    {
        id: 'side',
        label: '横',
        description: 'Side View',
        icon: ArrowRight,
        prompt: 'from side'
    },
    {
        id: 'back',
        label: '後ろ',
        description: 'Back View',
        icon: ArrowLeft,
        prompt: 'from behind'
    },
    {
        id: 'above',
        label: '上',
        description: 'From Above',
        icon: ArrowUp,
        prompt: 'from above'
    },
    {
        id: 'below',
        label: '下',
        description: 'From Below',
        icon: ArrowDown,
        prompt: 'from below'
    },
    {
        id: 'dynamic',
        label: 'ダイナミック',
        description: 'Dynamic Angle',
        icon: Zap,
        prompt: 'dynamic angle'
    }
];

// Compatibility exports
export const FRAMING_ARCHETYPES = SHOT_TYPES;
export const FRAMING_SETTINGS = SHOT_TYPES;
