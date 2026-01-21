import { User, Zap, Heart, Star, Flame, Coffee, Camera } from 'lucide-react';

export interface PoseArchetype {
    id: string;
    label: string;
    description: string;
    icon: any;
    prompt: string;
}

export const POSE_ARCHETYPES: PoseArchetype[] = [
    {
        id: 'model',
        label: 'モデル立ち',
        description: 'Professional Stance',
        icon: Camera,
        prompt: 'professional model pose, fashion catalog style, lookbook photography, elegant standing posture, balanced composition'
    },
    {
        id: 'random',
        label: 'おまかせ',
        description: 'AI recommended',
        icon: Zap,
        prompt: 'dynamic and creative pose, high randomness'
    },
    {
        id: 'cool',
        label: 'クール',
        description: 'Sharp & Stylish',
        icon: User,
        prompt: 'cool and stylish pose, sharp look, confident stance'
    },
    {
        id: 'cute',
        label: 'キュート',
        description: 'Adorable & Sweet',
        icon: Heart,
        prompt: 'cute and adorable pose, playful gesture, sweet expression'
    },
    {
        id: 'elegant',
        label: 'エレガント',
        description: 'Graceful & Mature',
        icon: Star,
        prompt: 'elegant and graceful pose, sophisticated stance, mature atmosphere'
    },
    {
        id: 'sexy',
        label: 'セクシー',
        description: 'Alluring & Bold',
        icon: Flame,
        prompt: 'sexy and alluring pose, confident body language, bold appearance'
    },
    {
        id: 'natural',
        label: 'ナチュラル',
        description: 'Relaxed & Casual',
        icon: Coffee,
        prompt: 'natural and relaxed pose, casual everyday stance, soft atmosphere'
    }
];

// For backward compatibility if needed, but primarily using archetypes now
export const POSE_SETTINGS = POSE_ARCHETYPES;
