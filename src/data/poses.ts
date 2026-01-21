import {
    User, Zap, Heart, Star, Flame, Coffee, Camera,
    Smile, Shield, ArrowDown, RotateCcw,
    Wind, UserPlus, Sofa, Ghost
} from 'lucide-react';

export interface PoseArchetype {
    id: string;
    label: string;
    description: string;
    icon: any;
    prompt: string;
}

export const POSE_MOODS: PoseArchetype[] = [
    {
        id: 'random',
        label: 'おまかせ',
        description: 'AI recommended mood',
        icon: Zap,
        prompt: ''
    },
    {
        id: 'energetic',
        label: '元気',
        description: 'High energy & bright',
        icon: Smile,
        prompt: 'high energy mood, bright and cheerful atmosphere, lively personality'
    },
    {
        id: 'cool',
        label: 'クール',
        description: 'Sharp & Stylish',
        icon: User,
        prompt: 'cool and stylish mood, sharp and confident atmosphere, aloof expression'
    },
    {
        id: 'cute',
        label: 'キュート',
        description: 'Adorable & Sweet',
        icon: Heart,
        prompt: 'cute and adorable mood, sweet and charming atmosphere, sugary personality'
    },
    {
        id: 'sexy',
        label: 'セクシー',
        description: 'Alluring & Bold',
        icon: Flame,
        prompt: 'sexy and alluring mood, bold and provocative atmosphere, seductive personality'
    },
    {
        id: 'natural',
        label: 'ナチュラル',
        description: 'Relaxed & Casual',
        icon: Coffee,
        prompt: 'natural and relaxed mood, casual everyday atmosphere, soft personality'
    },
    {
        id: 'elegant',
        label: '上品',
        description: 'Graceful & Mature',
        icon: Star,
        prompt: 'elegant and graceful mood, sophisticated and mature atmosphere, noble personality'
    },
    {
        id: 'shy',
        label: 'シャイ',
        description: 'Bashful & Sweet',
        icon: Ghost,
        prompt: 'shy and bashful mood, slightly embarrassed atmosphere, timid personality'
    },
    {
        id: 'heroic',
        label: '威厳',
        description: 'Dignified & Strong',
        icon: Shield,
        prompt: 'heroic and dignified mood, strong and powerful atmosphere, fearless personality'
    }
];

export const POSE_STANCES: PoseArchetype[] = [
    {
        id: 'random',
        label: 'おまかせ',
        description: 'AI recommended stance',
        icon: Zap,
        prompt: ''
    },
    {
        id: 'standing',
        label: '立ち',
        description: 'Basic standing pose',
        icon: User,
        prompt: 'standing pose, upright position'
    },
    {
        id: 'sitting',
        label: '座り',
        description: 'Sitting on chair or ground',
        icon: Sofa,
        prompt: 'sitting pose, relaxed sitting posture'
    },
    {
        id: 'kneeling',
        label: '膝立ち',
        description: 'Kneeling on the floor',
        icon: UserPlus,
        prompt: 'kneeling pose, on knees'
    },
    {
        id: 'lying',
        label: '寝そべり',
        description: 'Lying down flat',
        icon: Coffee,
        prompt: 'lying down pose, reclining position'
    },
    {
        id: 'active',
        label: 'アクティブ',
        description: 'Dynamic movement',
        icon: Wind,
        prompt: 'active and dynamic pose, sense of movement, action shot'
    },
    {
        id: 'looking_back',
        label: '見返り',
        description: 'Looking over shoulder',
        icon: RotateCcw,
        prompt: 'looking back over shoulder pose, turned torso'
    },
    {
        id: 'squatting',
        label: 'しゃがみ',
        description: 'Crouching or squatting',
        icon: ArrowDown,
        prompt: 'squatting pose, crouching position, low center of gravity'
    },
    {
        id: 'model',
        label: 'モデル立ち',
        description: 'Fashion catalog style',
        icon: Camera,
        prompt: 'professional model pose, fashion catalog style, lookbook photography, elegant posture, balanced composition'
    }
];

// For backward compatibility (not strictly needed but good to keep structure for a moment)
export const POSE_ARCHETYPES = POSE_STANCES;
export const POSE_SETTINGS = POSE_ARCHETYPES;
