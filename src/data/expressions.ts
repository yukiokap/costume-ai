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
        id: 'random',
        label: 'おまかせ',
        description: 'AI recommended',
        icon: Zap,
        prompt: 'natural and creative facial expression, high randomness'
    },
    {
        id: 'model',
        label: 'モデル表情',
        description: 'Professional Look',
        icon: Camera,
        prompt: 'professional model expression, confident gaze, elegant and composed facial expression, fashion photography style'
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

export const EXPRESSION_TAGS: Record<string, string[]> = {
    happy: [
        "beaming smile, showing teeth, joyful eyes",
        "gentle smile, closed eyes, serene expression",
        "cheerful laugh, wide open mouth",
        "winking smile, playful look",
        "contented smile, looking at viewer",
        "bright grin, sparkling eyes",
        "soft smile, slightly tilted head",
        "ecstatic expression, overwhelming joy"
    ],
    cool: [
        "sharp gaze, emotionless face, serious look",
        "cold stare, looking down at viewer",
        "composed expression, calm eyes",
        "confident smirk, one eyebrow raised",
        "indifferent look, looking away",
        "stoic expression, firm lips",
        "mysterious gaze, half-shadowed face",
        "sharp focused eyes, predatory look"
    ],
    cute: [
        "pouting expression, puffed cheeks, annoyed but cute",
        "sticking out tongue, playful wink",
        "embarrassed blush, looking down, hands on cheeks",
        "surprised look, wide eyes, small open mouth",
        "shy smile, looking up through eyelashes",
        "innocent gaze, head tilt, curious look",
        "puffed cheeks, teary eyes, adorable frustration",
        "cat-like smile, mischievous look"
    ],
    sexy: [
        "biting lip, seductive gaze, half-lidded eyes",
        "sultry look, bedroom eyes, moist lips",
        "licking lips, desire-filled gaze",
        "looking over shoulder, provocative expression",
        "heavy breathing, slightly open mouth, intense gaze",
        "alluring smirk, long eyelashes, mysterious look",
        "intense eye contact, commanding presence",
        "slight frown, moist eyes, looking at viewer with longing"
    ],
    emotional: [
        "teary eyes, overflowing tears, pained smile",
        "melancholic gaze, looking distant, sad expression",
        "crying, face buried in hands",
        "lonely look, curled up, heartbroken expression",
        "desperate look, reaching out, pleading eyes",
        "gentle sadness, single tear down cheek",
        "fragile expression, trembling lips",
        "looking up at the sky with longing eyes"
    ],
    aggressive: [
        "fierce glare, furrowed brows, intense anger",
        "shouting, mouth wide open, teeth bared",
        "clenched teeth, predatory look, ready to fight",
        "crazy smile, dilated pupils, unstable expression",
        "menacing look, looking down, dark atmosphere",
        "battle cry, determined expression, fierce eyes",
        "smirking in battle, bloodlust in eyes",
        "sharp teeth, growling, animalistic expression"
    ]
};
