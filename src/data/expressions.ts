import { Zap, Smile, Frown, Angry, Heart, Flame, Ghost, Camera } from 'lucide-react';

export interface ExpressionArchetype {
    id: string;
    label: string;
    description: string;
    icon: any;
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
