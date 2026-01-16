export interface PoseItem {
    id: string;
    label: string;
    category: string;
    prompt: string;
}

export const POSE_CATEGORIES = [
    { id: 'basic', label: '基本・立ちポーズ' },
    { id: 'action', label: 'アクション・躍動感' },
    { id: 'cute', label: 'キュート・アイドル' },
    { id: 'sexy', label: 'セクシー・挑発的' },
    { id: 'kneeling', label: '膝立ち・床座り' },
    { id: 'lying', label: '寝そべり・ベッド' },
    { id: 'back_view', label: '背面・バックショット' },
    { id: 'bondage', label: '拘束・屈辱' },
    { id: 'humiliation', label: '奉仕・服従' },
    { id: 'sexual', label: '性的・体位' },
];

export const ALL_POSES: PoseItem[] = [
    // --- BASIC ---
    { id: 'standing', label: '直立', category: 'basic', prompt: 'standing, simple pose' },
    { id: 'looking_back', label: '見返り', category: 'basic', prompt: 'looking back, over shoulder' },
    { id: 'walking', label: '歩行', category: 'basic', prompt: 'walking forward' },
    { id: 'sitting_chair', label: '椅子に座る', category: 'basic', prompt: 'sitting on chair, legs crossed' },
    { id: 'leaning_wall', label: '壁にもたれかかる', category: 'basic', prompt: 'leaning against wall, street style' },
    { id: 'hand_on_hip', label: '腰に手を当てる', category: 'basic', prompt: 'hand on hip, confident stand' },
    { id: 'arms_crossed', label: '腕組み', category: 'basic', prompt: 'arms crossed, stern look' },

    // --- ACTION ---
    { id: 'running', label: '疾走', category: 'action', prompt: 'running, motion blur' },
    { id: 'jumping', label: 'ジャンプ', category: 'action', prompt: 'jumping in the air, mid-air pose' },
    { id: 'fighting', label: '戦闘態勢', category: 'action', prompt: 'fighting stance, dynamic pose' },
    { id: 'flying', label: '飛行', category: 'action', prompt: 'flying, soaring' },
    { id: 'crouching', label: 'しゃがみ込み', category: 'action', prompt: 'crouching, low profile, tactical' },
    { id: 'kicking', label: 'ハイキック', category: 'action', prompt: 'high kick, dynamic action, leg up' },
    { id: 'holding_sword', label: '抜刀', category: 'action', prompt: 'holding sword, iaido pose, cool' },

    // --- CUTE ---
    { id: 'heart_hands', label: 'ハートポーズ', category: 'cute', prompt: 'heart hands, playful expression' },
    { id: 'peace_sign', label: 'ピースサイン', category: 'cute', prompt: 'peace sign, winking' },
    { id: 'holding_hem', label: '裾を持つ', category: 'cute', prompt: 'holding hem of skirt, shy' },
    { id: 'tilting_head', label: '小首をかしげる', category: 'cute', prompt: 'tilting head, cute expression' },
    { id: 'cat_pose', label: '猫ポーズ (にゃんにゃん)', category: 'cute', prompt: 'cat pose, hand paws, cat ears mood' },
    { id: 'fingertip_to_lips', label: '指を口元に', category: 'cute', prompt: 'fingertip to lips, playful gaze' },
    { id: 'skirt_flip', label: 'スカートを広げる', category: 'cute', prompt: 'holding skirt sides, curtsy pose' },

    // --- SEXY ---
    { id: 'curvy_pose', label: 'S字立ち', category: 'sexy', prompt: 'curvy body, emphasis on hips, seductive' },
    { id: 'lifting_top', label: '服をまくり上げる', category: 'sexy', prompt: 'lifting clothes, showing midriff' },
    { id: 'legs_spread_stand', label: 'M字立ち', category: 'sexy', prompt: 'legs spread, standing, bold pose' },
    { id: 'pulling_panties', label: '下着をずらす', category: 'sexy', prompt: 'pulling down underwear, showing pubic area, suggestive' },
    { id: 'bra_pull', label: 'ブラをずらす', category: 'sexy', prompt: 'pulling bra aside, showing partial breast' },
    { id: 'clothed_masturbation', label: '着衣のまま弄る', category: 'sexy', prompt: 'hand on crotch over clothes, looking at viewer' },
    { id: 'shushing', label: '内緒のポーズ', category: 'sexy', prompt: 'finger on lips, "shhh" sign, seductive look' },

    // --- KNEELING ---
    { id: 'kneeling_front', label: '膝立ち (正面)', category: 'kneeling', prompt: 'kneeling on floor, facing viewer' },
    { id: 'kneeling_back', label: '膝立ち (後ろ向き)', category: 'kneeling', prompt: 'kneeling, from behind, show butt' },
    { id: 'all_fours', label: '四つん這い', category: 'kneeling', prompt: 'on all fours, arching back' },
    { id: 'bent_over', label: '前かがみ', category: 'kneeling', prompt: 'bent over, looking at viewer' },
    { id: 'm_shape_sitting', label: 'M字開脚 (座り)', category: 'kneeling', prompt: 'sitting, legs spread in M-shape, facing viewer' },
    { id: 'w_shape_sitting', label: '女の子座り (アヒル座り)', category: 'kneeling', prompt: 'sitting in W-shape, cute and vulnerable' },
    { id: 'kneeling_one_leg_up', label: '片膝立ち', category: 'kneeling', prompt: 'kneeling with one leg up, dynamic' },

    // --- LYING ---
    { id: 'lying_back', label: '仰向け (大の字)', category: 'lying', prompt: 'lying on back, spread eagle' },
    { id: 'lying_side', label: '横たわる (添い寝)', category: 'lying', prompt: 'lying on side, seductive gaze' },
    { id: 'lying_stomach', label: 'うつ伏せ', category: 'lying', prompt: 'lying on stomach, kicking legs' },
    { id: 'curled_up', label: '丸くなる', category: 'lying', prompt: 'curled up, fetal position' },
    { id: 'lying_v_pose', label: '仰向け開脚', category: 'lying', prompt: 'lying on back, legs up in V-shape' },
    { id: 'lying_on_stomach_back_view', label: 'うつ伏せ (尻強調)', category: 'lying', prompt: 'lying on stomach from behind, arching back, emphasis on butt' },

    // --- BACK VIEW ---
    { id: 'back_shot', label: '背面全体', category: 'back_view', prompt: 'from behind, back view' },
    { id: 'looking_over_shoulder_sexy', label: '肩越しに誘惑', category: 'back_view', prompt: 'looking over shoulder, seductive eyes, back view' },
    { id: 'showing_butt', label: 'お尻を見せる', category: 'back_view', prompt: 'showing butt, standing from behind' },
    { id: 'back_arch', label: '背中を反らす', category: 'back_view', prompt: 'arching back, back view, emphasis on spine and curves' },

    // --- BONDAGE ---
    { id: 'tied_up', label: '後ろ手に繋がれる', category: 'bondage', prompt: 'hands tied behind back, bound' },
    { id: 'suspended', label: '吊り下げ (空挺)', category: 'bondage', prompt: 'suspended in air, ropes, helpless' },
    { id: 'blindfolded', label: '目隠し', category: 'bondage', prompt: 'blindfolded, kneeling' },
    { id: 'spread_eagle_bound', label: '大の字拘束', category: 'bondage', prompt: 'spread eagle, bound to cross' },
    { id: 'shibari', label: '亀甲縛り', category: 'bondage', prompt: 'shibari, rope bondage, intricate knots' },
    { id: 'gags', label: '猿ぐつわ', category: 'bondage', prompt: 'gagged, mouth open with ball gag' },

    // --- HUMILIATION ---
    { id: 'ahegao', label: 'アヘ顔', category: 'humiliation', prompt: 'ahegao, tongue out, rolling eyes up, drooling' },
    { id: 'presenting', label: 'お尻突き出し', category: 'humiliation', prompt: 'presenting, bending over, looking back' },
    { id: 'leashed', label: '犬の首輪', category: 'humiliation', prompt: 'wearing dog collar and leash, being led' },
    { id: 'begging', label: '命乞い・おねだり', category: 'humiliation', prompt: 'begging pose, hands together, teary eyes' },
    { id: 'forced_open', label: '無理やり広げられる', category: 'humiliation', prompt: 'legs being pulled apart, helpless expression' },

    // --- SEXUAL (POSITIONS) ---
    { id: 'missionary', label: '正常位', category: 'sexual', prompt: 'missionary position, intimacy, explicit pose' },
    { id: 'cowgirl', label: '騎乗位', category: 'sexual', prompt: 'cowgirl position, sitting on top' },
    { id: 'reverse_cowgirl', label: '背面騎乗位', category: 'sexual', prompt: 'reverse cowgirl, facing away while on top' },
    { id: 'doggy_style', label: 'バック', category: 'sexual', prompt: 'doggy style position, from behind' },
    { id: 'spooning_sex', label: '側位 (後ろから)', category: 'sexual', prompt: 'spooning sex position, from behind while lying' },
    { id: 'deep_missionary', label: '屈曲位', category: 'sexual', prompt: 'deep missionary, legs on shoulders' },
    { id: 'lifting_one_leg_sex', label: '立位片足上げ', category: 'sexual', prompt: 'standing sex, one leg lifted' },

    // --- SEXUAL (ORAL & OTHERS) ---
    { id: 'fellatio', label: 'フェラチオ', category: 'sexual', prompt: 'fellatio pose, oral sex stance' },
    { id: 'irrumatio', label: 'ディープスロート', category: 'sexual', prompt: 'irrumatio, deep throat, face in crotch' },
    { id: 'cunnilingus', label: 'クンニ', category: 'sexual', prompt: 'cunnilingus pose' },
    { id: 'paizuri', label: 'パイズリ', category: 'sexual', prompt: 'paizuri pose, titjob' },
    { id: 'footjob', label: '足コキ', category: 'sexual', prompt: 'footjob, feet on crotch' },
    { id: 'handjob', label: '手コキ', category: 'sexual', prompt: 'handjob' },
    { id: 'facesitting', label: '顔面騎乗', category: 'sexual', prompt: 'facesitting, sitting on face' },
    { id: 'spitroast', label: '二本差し (3P)', category: 'sexual', prompt: 'spitroast position, double penetration' },

    // --- SEXUAL (FINISH) ---
    { id: 'jackpot', label: '中出しポーズ', category: 'sexual', prompt: 'creampie pose, messy, after sex' },
    { id: 'bukkake', label: 'ぶっかけ', category: 'sexual', prompt: 'bukkake, semen on face, messy' },
    { id: 'creampie_closeup', label: '中出し接写', category: 'sexual', prompt: 'creampie, fluids leaking, close up' },
];
