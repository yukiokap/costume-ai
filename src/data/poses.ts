import {
    User, Zap, Coffee, Camera,
    RotateCcw,
    Wind, UserPlus, Sofa,
    type LucideIcon
} from 'lucide-react';

export interface PoseArchetype {
    id: string;
    label: string;
    description: string;
    icon: LucideIcon;
    prompt: string;
}

export const POSE_STANCES: PoseArchetype[] = [
    {
        id: 'model',
        label: 'モデル立ち',
        description: 'Fashion catalog style',
        icon: Camera,
        prompt: 'professional model pose, fashion catalog style, lookbook photography, elegant posture, balanced composition'
    },
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
        label: '座り / しゃがみ',
        description: 'Sitting or crouching',
        icon: Sofa,
        prompt: 'sitting or crouching pose, relaxed sitting posture or ground-level crouch'
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
    }
];
