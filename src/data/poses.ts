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
        id: 'random',
        label: 'おまかせ',
        description: 'AI recommended stance',
        icon: Zap,
        prompt: ''
    },
    {
        id: 'model',
        label: 'モデル立ち',
        description: 'Fashion catalog style',
        icon: Camera,
        prompt: 'professional model pose, fashion catalog style, lookbook photography, elegant posture, balanced composition'
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

export const POSE_STANCE_TAGS: Record<string, string[]> = {
    standing: [
        "standing straight, arms at sides",
        "standing with hands on hips, confident stance",
        "leaning against a wall, relaxed posture",
        "crossing arms while standing, serious look",
        "one hand in pocket, casual standing pose",
        "standing on tiptoes, reaching up",
        "graceful standing pose, legs crossed at ankles",
        "holding an object while standing"
    ],
    sitting: [
        "sitting on a chair, legs crossed",
        "sitting on the floor, hugging knees",
        "crouching low to the ground, looking up",
        "sitting with legs spread, tomboyish pose",
        "kneeling while sitting, Japanese seiza style",
        "sitting on a ledge, legs dangling",
        "reclining while sitting, leaning back",
        "squatting, looking intense"
    ],
    kneeling: [
        "kneeling on both knees, hands in lap",
        "kneeling on one knee, proposal pose",
        "kneeling while reaching forward",
        "crawling on all fours, provocative pose",
        "kneeling with back arched, dramatic pose",
        "kneeling on a bed, soft atmosphere",
        "kneeling in water, dramatic lighting",
        "kneeling with hands tied behind back, fetish-style"
    ],
    lying: [
        "lying on back, arms spread wide",
        "lying on stomach, propped up on elbows",
        "side-lying pose, looking at viewer",
        "curled up in fetal position",
        "lying flat, starfish pose",
        "reclining on a sofa, elegant lying pose",
        "lying in a field of flowers",
        "lying on a bed, looking relaxed"
    ],
    active: [
        "running forward, sense of motion",
        "jumping high, legs tucked",
        "mid-air kick, dynamic action pose",
        "spinning around, hair flying",
        "reaching out towards the camera",
        "stretching arms upwards",
        "striking a magical girl pose",
        "dancing, rhythmic movement"
    ],
    looking_back: [
        "looking back over shoulder, coquettish glance",
        "turned away from camera, looking back with a smile",
        "walking away while looking back",
        "stooped over, looking back through legs",
        "sitting and looking back",
        "dramatic over-the-shoulder gaze",
        "shaking hair while looking back",
        "mysterious look back from shadows"
    ],
    model: [
        "professional fashion pose, hand on chin",
        "catalog pose, showing off the outfit",
        "confident catwalk pose",
        "elegant posture, looking like a statue",
        "stylized pose, geometric shapes with body",
        "haute couture style, avant-garde pose",
        "relaxed but professional model stance",
        "high-fashion editorial pose"
    ]
};

export const POSE_MOOD_TAGS: Record<string, string[]> = {
    happy: ["relaxed body", "open posture", "lightweight movement", "graceful", "dancing-like"],
    cool: ["stiff posture", "calculated angles", "sharp movements", "minimalist", "steady"],
    cute: ["inner-thigh focus", "closed posture", "small movements", "bouncy", "clumsy-chic"],
    sexy: ["curvy emphasis", "arched back", "hand on body", "inviting", "fluid"],
    emotional: ["slumped shoulders", "huddled", "trembling", "heavy", "withdrawn"],
    aggressive: ["tensed muscles", "forward leaning", "clenched fists", "explosive", "wild"]
};
