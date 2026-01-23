import { Zap, Smile, Frown, Angry, Heart, Flame, Ghost, Camera, Coffee, Star, Shield, Sparkles, type LucideIcon } from 'lucide-react';

export interface ExpressionArchetype {
    id: string;
    label: string;
    description: string;
    icon: LucideIcon;
    prompt: string;
}

export const EXPRESSION_ARCHETYPES: ExpressionArchetype[] = [
    {
        id: 'model',
        label: 'モデル表情',
        description: 'Professional Look',
        icon: Camera,
        prompt: 'professional model expression, confident gaze, elegant and composed facial expression, fashion photography style'
    },
    {
        id: 'random',
        label: 'おまかせ',
        description: 'AI recommended',
        icon: Zap,
        prompt: 'natural and creative facial expression, high randomness'
    },
    {
        id: 'happy',
        label: 'ハッピー',
        description: 'Smile & Joy',
        icon: Smile,
        prompt: 'happy expression, bright smile, joyful look'
    },
    {
        id: 'energetic',
        label: '元気',
        description: 'High energy & bright',
        icon: Sparkles,
        prompt: 'high energy mood, bright and cheerful atmosphere, lively personality'
    },
    {
        id: 'cool',
        label: 'クール',
        description: 'Serious & Calm',
        icon: Ghost,
        prompt: 'cool and serious expression, calm gaze, composed look'
    },
    {
        id: 'cute',
        label: 'キュート',
        description: 'Sweet & Playful',
        icon: Heart,
        prompt: 'cute and playful expression, sweet wink or shy smile'
    },
    {
        id: 'sexy',
        label: 'セクシー',
        description: 'Seductive & Alluring',
        icon: Flame,
        prompt: 'seductive and alluring expression, sultry gaze, provocative look'
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
    },
    {
        id: 'emotional',
        label: 'エモーショナル',
        description: 'Teary or Upset',
        icon: Frown,
        prompt: 'emotional expression, teary eyes or sad look, touching atmosphere'
    },
    {
        id: 'aggressive',
        label: 'アグレッシブ',
        description: 'Angry or Bold',
        icon: Angry,
        prompt: 'aggressive and bold expression, fierce gaze, strong presence'
    }
];

// For backward compatibility if needed, but primarily using archetypes now
export const EXPRESSION_SETTINGS = EXPRESSION_ARCHETYPES;
