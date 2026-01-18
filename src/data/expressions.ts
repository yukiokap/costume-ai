export interface ExpressionItem {
    id: string;
    label: string;
    category: string;
    prompt: string;
}

export const EXPRESSION_CATEGORIES = [
    { id: 'happy', label: '喜び・笑顔' },
    { id: 'sad', label: '悲しみ・泣き' },
    { id: 'angry', label: '怒り・不機嫌' },
    { id: 'surprised', label: '驚き・ショック' },
    { id: 'embarrassed', label: '恥ずかしい・照れ' },
    { id: 'seductive', label: '誘惑・色気' },
    { id: 'playful', label: '遊び心・いたずら' },
    { id: 'serious', label: '真剣・クール' },
    { id: 'tired', label: '疲れ・眠い' },
    { id: 'painful', label: '苦痛・快楽' },
];

export const ALL_EXPRESSIONS: ExpressionItem[] = [
    // --- HAPPY / SMILE ---
    { id: 'smile', label: '微笑み', category: 'happy', prompt: 'gentle smile, soft expression' },
    { id: 'grin', label: '満面の笑み', category: 'happy', prompt: 'wide grin, very happy, beaming' },
    { id: 'laughing', label: '大笑い', category: 'happy', prompt: 'laughing out loud, joyful' },
    { id: 'giggling', label: 'くすくす笑い', category: 'happy', prompt: 'giggling, hand over mouth, amused' },
    { id: 'smirk', label: 'ニヤリ', category: 'happy', prompt: 'smirk, confident smile, sly' },
    { id: 'closed_eyes_smile', label: '目を閉じて笑顔', category: 'happy', prompt: 'closed eyes smile, peaceful, happy' },
    { id: 'cheerful', label: '元気いっぱい', category: 'happy', prompt: 'cheerful expression, energetic, bright' },

    // --- SAD / CRYING ---
    { id: 'sad', label: '悲しい顔', category: 'sad', prompt: 'sad expression, downcast eyes' },
    { id: 'crying', label: '泣いている', category: 'sad', prompt: 'crying, tears streaming down face' },
    { id: 'sobbing', label: '号泣', category: 'sad', prompt: 'sobbing, heavy crying, emotional' },
    { id: 'teary_eyes', label: '涙目', category: 'sad', prompt: 'teary eyes, holding back tears' },
    { id: 'depressed', label: '落ち込む', category: 'sad', prompt: 'depressed look, gloomy, downcast' },
    { id: 'lonely', label: '寂しい', category: 'sad', prompt: 'lonely expression, melancholic' },
    { id: 'disappointed', label: 'がっかり', category: 'sad', prompt: 'disappointed face, let down' },

    // --- ANGRY / UPSET ---
    { id: 'angry', label: '怒り顔', category: 'angry', prompt: 'angry expression, furrowed brows' },
    { id: 'furious', label: '激怒', category: 'angry', prompt: 'furious, extremely angry, rage' },
    { id: 'annoyed', label: 'イライラ', category: 'angry', prompt: 'annoyed expression, irritated' },
    { id: 'pouting', label: 'ふくれっ面', category: 'angry', prompt: 'pouting, puffed cheeks, sulking' },
    { id: 'glaring', label: '睨む', category: 'angry', prompt: 'glaring, intense stare, hostile' },
    { id: 'scowling', label: 'しかめっ面', category: 'angry', prompt: 'scowling, frowning deeply' },
    { id: 'tsundere', label: 'ツンデレ顔', category: 'angry', prompt: 'tsundere expression, blushing while angry' },

    // --- SURPRISED / SHOCKED ---
    { id: 'surprised', label: '驚き', category: 'surprised', prompt: 'surprised expression, wide eyes, open mouth' },
    { id: 'shocked', label: 'ショック', category: 'surprised', prompt: 'shocked face, extremely surprised' },
    { id: 'amazed', label: '感嘆', category: 'surprised', prompt: 'amazed expression, awestruck' },
    { id: 'confused', label: '困惑', category: 'surprised', prompt: 'confused look, puzzled, questioning' },
    { id: 'worried', label: '心配', category: 'surprised', prompt: 'worried expression, anxious' },
    { id: 'scared', label: '怖がる', category: 'surprised', prompt: 'scared face, frightened, fearful' },
    { id: 'nervous', label: '緊張', category: 'surprised', prompt: 'nervous expression, tense, uneasy' },

    // --- EMBARRASSED / SHY ---
    { id: 'embarrassed', label: '恥ずかしい', category: 'embarrassed', prompt: 'embarrassed expression, blushing' },
    { id: 'shy', label: '恥じらい', category: 'embarrassed', prompt: 'shy look, bashful, timid' },
    { id: 'blushing', label: '赤面', category: 'embarrassed', prompt: 'blushing heavily, red cheeks' },
    { id: 'flustered', label: 'うろたえる', category: 'embarrassed', prompt: 'flustered, panicked, overwhelmed' },
    { id: 'covering_face', label: '顔を隠す', category: 'embarrassed', prompt: 'covering face with hands, hiding embarrassment' },
    { id: 'looking_away', label: '目を逸らす', category: 'embarrassed', prompt: 'looking away, averting gaze, shy' },

    // --- SEDUCTIVE / SEXY ---
    { id: 'seductive', label: '誘惑的', category: 'seductive', prompt: 'seductive expression, sultry gaze' },
    { id: 'bedroom_eyes', label: '流し目', category: 'seductive', prompt: 'bedroom eyes, half-lidded, sensual' },
    { id: 'licking_lips', label: '唇を舐める', category: 'seductive', prompt: 'licking lips, provocative' },
    { id: 'biting_lip', label: '唇を噛む', category: 'seductive', prompt: 'biting lower lip, suggestive' },
    { id: 'winking', label: 'ウィンク', category: 'seductive', prompt: 'winking, playful, flirty' },
    { id: 'inviting', label: '誘う表情', category: 'seductive', prompt: 'inviting expression, come-hither look' },
    { id: 'lustful', label: '欲情', category: 'seductive', prompt: 'lustful gaze, desire, passionate' },

    // --- PLAYFUL / MISCHIEVOUS ---
    { id: 'playful', label: '遊び心', category: 'playful', prompt: 'playful expression, fun, cheerful' },
    { id: 'mischievous', label: 'いたずらっぽい', category: 'playful', prompt: 'mischievous grin, impish, cheeky' },
    { id: 'teasing', label: 'からかう', category: 'playful', prompt: 'teasing expression, playful mockery' },
    { id: 'tongue_out', label: '舌を出す', category: 'playful', prompt: 'sticking tongue out, playful, cheeky' },
    { id: 'silly', label: 'おどけた顔', category: 'playful', prompt: 'silly face, goofy, funny' },
    { id: 'smug', label: 'ドヤ顔', category: 'playful', prompt: 'smug expression, self-satisfied, proud' },

    // --- SERIOUS / COOL ---
    { id: 'serious', label: '真剣', category: 'serious', prompt: 'serious expression, focused, determined' },
    { id: 'cool', label: 'クール', category: 'serious', prompt: 'cool expression, aloof, composed' },
    { id: 'stern', label: '厳しい', category: 'serious', prompt: 'stern look, strict, severe' },
    { id: 'confident', label: '自信満々', category: 'serious', prompt: 'confident expression, assured' },
    { id: 'expressionless', label: '無表情', category: 'serious', prompt: 'expressionless, blank face, emotionless' },
    { id: 'stoic', label: '無感情', category: 'serious', prompt: 'stoic expression, impassive' },
    { id: 'contemplative', label: '思索的', category: 'serious', prompt: 'contemplative look, thoughtful, pensive' },

    // --- TIRED / SLEEPY ---
    { id: 'tired', label: '疲れた顔', category: 'tired', prompt: 'tired expression, exhausted' },
    { id: 'sleepy', label: '眠そう', category: 'tired', prompt: 'sleepy face, drowsy, half-asleep' },
    { id: 'yawning_face', label: 'あくび顔', category: 'tired', prompt: 'yawning expression, mouth wide open' },
    { id: 'droopy_eyes', label: 'とろんとした目', category: 'tired', prompt: 'droopy eyes, half-closed, dazed' },
    { id: 'exhausted', label: 'ぐったり', category: 'tired', prompt: 'exhausted look, completely drained' },
    { id: 'lazy', label: 'だるそう', category: 'tired', prompt: 'lazy expression, unmotivated, languid' },

    // --- PAINFUL / PLEASURE ---
    { id: 'pained', label: '苦痛', category: 'painful', prompt: 'pained expression, suffering, hurt' },
    { id: 'ecstasy', label: '恍惚', category: 'painful', prompt: 'ecstatic expression, overwhelming pleasure' },
    { id: 'ahegao', label: 'アヘ顔', category: 'painful', prompt: 'ahegao, rolling eyes, tongue out, extreme pleasure' },
    { id: 'orgasm_face', label: '絶頂顔', category: 'painful', prompt: 'orgasm face, climax expression, intense' },
    { id: 'pleasure_pain', label: '快楽と苦痛', category: 'painful', prompt: 'mixed pleasure and pain, conflicted expression' },
    { id: 'drooling', label: 'よだれ', category: 'painful', prompt: 'drooling, saliva dripping, overwhelmed' },
    { id: 'tears_of_joy', label: '快楽の涙', category: 'painful', prompt: 'tears of pleasure, crying from ecstasy' },
];
