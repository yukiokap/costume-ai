export interface PoseItem {
    id: string;
    label: string;
    category: string;
    prompt: string;
}

export const POSE_CATEGORIES = [
    { id: 'basic', label: '基本・立ちポーズ' },
    { id: 'sitting', label: '座りポーズ' },
    { id: 'daily', label: '日常・リラックス' },
    { id: 'action', label: 'アクション・躍動感' },
    { id: 'acrobatic', label: 'アクロバット・柔軟' },
    { id: 'dance', label: 'ダンス・表現' },
    { id: 'sports', label: 'スポーツ・運動' },
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
    { id: 'leaning_wall', label: '壁にもたれかかる', category: 'basic', prompt: 'leaning against wall, street style' },
    { id: 'hand_on_hip', label: '腰に手を当てる', category: 'basic', prompt: 'hand on hip, confident stand' },
    { id: 'arms_crossed', label: '腕組み', category: 'basic', prompt: 'arms crossed, stern look' },
    { id: 'contrapposto', label: 'コントラポスト', category: 'basic', prompt: 'contrapposto pose, weight on one leg, elegant' },
    { id: 'arms_behind_back', label: '後ろ手', category: 'basic', prompt: 'arms behind back, standing' },
    { id: 'stretching', label: '伸び', category: 'basic', prompt: 'stretching arms up, yawning' },

    // --- SITTING ---
    { id: 'sitting_chair', label: '椅子に座る', category: 'sitting', prompt: 'sitting on chair, legs crossed' },
    { id: 'wariza', label: '割座 (わりざ)', category: 'sitting', prompt: 'wariza, sitting on knees with legs spread to sides' },
    { id: 'seiza', label: '正座', category: 'sitting', prompt: 'seiza, formal Japanese sitting' },
    { id: 'yokozuwari', label: '横座り', category: 'sitting', prompt: 'yokozuwari, sitting with legs to one side' },
    { id: 'agura', label: 'あぐら', category: 'sitting', prompt: 'sitting cross-legged, casual' },
    { id: 'sitting_floor_legs_out', label: '体育座り', category: 'sitting', prompt: 'sitting on floor, knees up, arms around legs' },
    { id: 'sitting_floor_one_knee_up', label: '片膝立て座り', category: 'sitting', prompt: 'sitting with one knee up, casual pose' },
    { id: 'sitting_on_desk', label: '机に座る', category: 'sitting', prompt: 'sitting on desk, legs dangling' },
    { id: 'sitting_backwards_chair', label: '椅子に逆向き', category: 'sitting', prompt: 'sitting backwards on chair, arms on backrest' },
    { id: 'sitting_ground_legs_spread', label: '地面座り開脚', category: 'sitting', prompt: 'sitting on ground, legs spread apart' },
    { id: 'indian_style', label: 'インディアン座り', category: 'sitting', prompt: 'sitting indian style, relaxed' },
    { id: 'w_shape_sitting', label: '女の子座り (アヒル座り)', category: 'sitting', prompt: 'sitting in W-shape, cute and vulnerable' },

    // --- DAILY / RELAXATION ---
    { id: 'chin_on_hands', label: '頬杖をつく', category: 'daily', prompt: 'chin resting on hands, elbows on table, relaxed' },
    { id: 'playing_with_hair', label: '髪をいじる', category: 'daily', prompt: 'playing with hair, twirling strand, casual' },
    { id: 'hair_flip', label: '髪をかき上げる', category: 'daily', prompt: 'flipping hair back, hand through hair, elegant' },
    { id: 'looking_at_phone', label: 'スマホを見る', category: 'daily', prompt: 'looking at smartphone, casual pose' },
    { id: 'reading_book', label: '本を読む', category: 'daily', prompt: 'reading book, holding book, focused' },
    { id: 'drinking_tea', label: 'お茶を飲む', category: 'daily', prompt: 'drinking tea, holding cup, elegant' },
    { id: 'yawning', label: 'あくび', category: 'daily', prompt: 'yawning, hand covering mouth, sleepy' },
    { id: 'fixing_clothes', label: '服を直す', category: 'daily', prompt: 'adjusting clothes, fixing outfit' },
    { id: 'tying_hair', label: '髪を結ぶ', category: 'daily', prompt: 'tying hair up, arms raised, hair tie' },
    { id: 'putting_on_shoes', label: '靴を履く', category: 'daily', prompt: 'putting on shoes, bending down' },
    { id: 'looking_in_mirror', label: '鏡を見る', category: 'daily', prompt: 'looking in mirror, checking appearance' },
    { id: 'applying_makeup', label: '化粧をする', category: 'daily', prompt: 'applying makeup, holding compact mirror' },
    { id: 'brushing_hair', label: '髪をとかす', category: 'daily', prompt: 'brushing hair, holding hairbrush' },
    { id: 'eating', label: '食べる', category: 'daily', prompt: 'eating, holding food, enjoying meal' },
    { id: 'thinking', label: '考え込む', category: 'daily', prompt: 'thinking pose, hand on chin, contemplative' },
    { id: 'sighing', label: 'ため息', category: 'daily', prompt: 'sighing, hand on forehead, tired expression' },
    { id: 'window_gazing', label: '窓の外を見る', category: 'daily', prompt: 'looking out window, wistful, contemplative' },
    { id: 'listening_music', label: '音楽を聴く', category: 'daily', prompt: 'listening to music, headphones, relaxed' },
    { id: 'taking_selfie', label: '自撮り', category: 'daily', prompt: 'taking selfie, holding phone up, posing' },
    { id: 'checking_watch', label: '時計を見る', category: 'daily', prompt: 'checking watch, looking at wrist' },
    { id: 'adjusting_glasses', label: '眼鏡を直す', category: 'daily', prompt: 'adjusting glasses, pushing up frames' },
    { id: 'wiping_sweat', label: '汗を拭く', category: 'daily', prompt: 'wiping sweat, hand on forehead, tired' },
    { id: 'fanning_self', label: '扇ぐ', category: 'daily', prompt: 'fanning self, hot, cooling down' },
    { id: 'shivering', label: '寒がる', category: 'daily', prompt: 'shivering, hugging self, cold' },
    { id: 'umbrella_holding', label: '傘をさす', category: 'daily', prompt: 'holding umbrella, standing under umbrella' },

    // --- ACTION ---
    { id: 'running', label: '疾走', category: 'action', prompt: 'running, motion blur' },
    { id: 'jumping', label: 'ジャンプ', category: 'action', prompt: 'jumping in the air, mid-air pose' },
    { id: 'fighting', label: '戦闘態勢', category: 'action', prompt: 'fighting stance, dynamic pose' },
    { id: 'flying', label: '飛行', category: 'action', prompt: 'flying, soaring' },
    { id: 'crouching', label: 'しゃがみ込み', category: 'action', prompt: 'crouching, low profile, tactical' },
    { id: 'kicking', label: 'ハイキック', category: 'action', prompt: 'high kick, dynamic action, leg up' },
    { id: 'holding_sword', label: '抜刀', category: 'action', prompt: 'holding sword, iaido pose, cool' },
    { id: 'punching', label: 'パンチ', category: 'action', prompt: 'punching forward, dynamic fist' },
    { id: 'blocking', label: 'ガード', category: 'action', prompt: 'blocking pose, defensive stance' },
    { id: 'dodging', label: '回避', category: 'action', prompt: 'dodging, leaning back, matrix style' },
    { id: 'sliding', label: 'スライディング', category: 'action', prompt: 'sliding on ground, dynamic motion' },

    // --- ACROBATIC / FLEXIBLE ---
    { id: 'y_balance', label: 'Y字バランス', category: 'acrobatic', prompt: 'Y-balance, standing on one leg, other leg raised vertically, holding ankle' },
    { id: 'i_balance', label: 'I字バランス', category: 'acrobatic', prompt: 'I-balance, standing split, leg raised straight up' },
    { id: 'splits', label: '開脚 (スプリット)', category: 'acrobatic', prompt: 'doing splits, legs 180 degrees apart' },
    { id: 'bridge', label: 'ブリッジ', category: 'acrobatic', prompt: 'bridge pose, back arched, hands and feet on ground' },
    { id: 'handstand', label: '逆立ち', category: 'acrobatic', prompt: 'handstand, upside down, legs in air' },
    { id: 'cartwheel', label: '側転', category: 'acrobatic', prompt: 'cartwheel, mid-motion, dynamic' },
    { id: 'backflip', label: 'バックフリップ', category: 'acrobatic', prompt: 'backflip, mid-air, acrobatic' },
    { id: 'scorpion_pose', label: 'スコーピオン', category: 'acrobatic', prompt: 'scorpion pose, back extremely arched, feet touching head' },
    { id: 'standing_split', label: '立位開脚', category: 'acrobatic', prompt: 'standing split, one leg raised high' },
    { id: 'contortion', label: 'コントーション', category: 'acrobatic', prompt: 'extreme contortion, flexible body bend' },
    { id: 'arabesque', label: 'アラベスク', category: 'acrobatic', prompt: 'arabesque, ballet pose, one leg extended back' },

    // --- DANCE ---
    { id: 'ballet_pose', label: 'バレエポーズ', category: 'dance', prompt: 'ballet pose, graceful, en pointe' },
    { id: 'pirouette', label: 'ピルエット', category: 'dance', prompt: 'pirouette, spinning on one foot' },
    { id: 'jazz_hands', label: 'ジャズハンド', category: 'dance', prompt: 'jazz hands, energetic pose, hands spread' },
    { id: 'hip_hop_pose', label: 'ヒップホップ', category: 'dance', prompt: 'hip hop dance pose, street style' },
    { id: 'flamenco', label: 'フラメンコ', category: 'dance', prompt: 'flamenco pose, dramatic arm position' },
    { id: 'tango_dip', label: 'タンゴディップ', category: 'dance', prompt: 'tango dip, leaning back dramatically' },
    { id: 'idol_pose', label: 'アイドルポーズ', category: 'dance', prompt: 'idol performance pose, energetic, cute' },
    { id: 'cheerleader', label: 'チアリーダー', category: 'dance', prompt: 'cheerleader pose, pom-poms, high kick' },

    // --- SPORTS ---
    { id: 'volleyball_spike', label: 'バレーボールスパイク', category: 'sports', prompt: 'volleyball spike, jumping, arm raised' },
    { id: 'tennis_serve', label: 'テニスサーブ', category: 'sports', prompt: 'tennis serve, racket raised, dynamic' },
    { id: 'basketball_shoot', label: 'バスケシュート', category: 'sports', prompt: 'basketball shooting pose, arms extended' },
    { id: 'soccer_kick', label: 'サッカーキック', category: 'sports', prompt: 'soccer kick, leg extended, ball in motion' },
    { id: 'swimming_dive', label: '飛び込み', category: 'sports', prompt: 'diving pose, streamlined, arms forward' },
    { id: 'yoga_tree', label: 'ヨガ・木のポーズ', category: 'sports', prompt: 'yoga tree pose, balanced on one leg' },
    { id: 'yoga_warrior', label: 'ヨガ・戦士のポーズ', category: 'sports', prompt: 'yoga warrior pose, arms extended' },
    { id: 'yoga_downward_dog', label: 'ヨガ・下向き犬', category: 'sports', prompt: 'downward dog yoga pose, inverted V shape' },
    { id: 'boxing_stance', label: 'ボクシング構え', category: 'sports', prompt: 'boxing stance, fists up, ready to fight' },
    { id: 'archery', label: '弓道', category: 'sports', prompt: 'archery pose, drawing bow, focused' },

    // --- CUTE ---
    { id: 'heart_hands', label: 'ハートポーズ', category: 'cute', prompt: 'heart hands, playful expression' },
    { id: 'peace_sign', label: 'ピースサイン', category: 'cute', prompt: 'peace sign, winking' },
    { id: 'holding_hem', label: '裾を持つ', category: 'cute', prompt: 'holding hem of skirt, shy' },
    { id: 'tilting_head', label: '小首をかしげる', category: 'cute', prompt: 'tilting head, cute expression' },
    { id: 'cat_pose', label: '猫ポーズ (にゃんにゃん)', category: 'cute', prompt: 'cat pose, hand paws, cat ears mood' },
    { id: 'fingertip_to_lips', label: '指を口元に', category: 'cute', prompt: 'fingertip to lips, playful gaze' },
    { id: 'skirt_flip', label: 'スカートを広げる', category: 'cute', prompt: 'holding skirt sides, curtsy pose' },
    { id: 'bunny_ears', label: 'うさ耳ポーズ', category: 'cute', prompt: 'bunny ears with hands, cute smile' },
    { id: 'blowing_kiss', label: '投げキッス', category: 'cute', prompt: 'blowing kiss, hand near lips' },
    { id: 'hugging_self', label: '自分を抱きしめる', category: 'cute', prompt: 'hugging self, shy, embarrassed' },

    // --- SEXY ---
    { id: 'curvy_pose', label: 'S字立ち', category: 'sexy', prompt: 'curvy body, emphasis on hips, seductive' },
    { id: 'lifting_top', label: '服をまくり上げる', category: 'sexy', prompt: 'lifting clothes, showing midriff' },
    { id: 'legs_spread_stand', label: 'M字立ち', category: 'sexy', prompt: 'legs spread, standing, bold pose' },
    { id: 'pulling_panties', label: '下着をずらす', category: 'sexy', prompt: 'pulling down underwear, showing pubic area, suggestive' },
    { id: 'bra_pull', label: 'ブラをずらす', category: 'sexy', prompt: 'pulling bra aside, showing partial breast' },
    { id: 'clothed_masturbation', label: '着衣のまま弄る', category: 'sexy', prompt: 'hand on crotch over clothes, looking at viewer' },
    { id: 'shushing', label: '内緒のポーズ', category: 'sexy', prompt: 'finger on lips, "shhh" sign, seductive look' },
    { id: 'breast_squeeze', label: '胸を寄せる', category: 'sexy', prompt: 'squeezing breasts together, cleavage emphasis' },
    { id: 'panty_shot', label: 'パンチラ', category: 'sexy', prompt: 'panty shot, skirt lifted slightly' },
    { id: 'wet_clothes', label: '濡れ透け', category: 'sexy', prompt: 'wet clothes, see-through, water dripping' },

    // --- KNEELING ---
    { id: 'kneeling_front', label: '膝立ち (正面)', category: 'kneeling', prompt: 'kneeling on floor, facing viewer' },
    { id: 'kneeling_back', label: '膝立ち (後ろ向き)', category: 'kneeling', prompt: 'kneeling, from behind, show butt' },
    { id: 'all_fours', label: '四つん這い', category: 'kneeling', prompt: 'on all fours, arching back' },
    { id: 'bent_over', label: '前かがみ', category: 'kneeling', prompt: 'bent over, looking at viewer' },
    { id: 'm_shape_sitting', label: 'M字開脚 (座り)', category: 'kneeling', prompt: 'sitting, legs spread in M-shape, facing viewer' },
    { id: 'kneeling_one_leg_up', label: '片膝立ち', category: 'kneeling', prompt: 'kneeling with one leg up, dynamic' },
    { id: 'squatting', label: 'しゃがみ', category: 'kneeling', prompt: 'squatting, heels on ground, knees bent' },
    { id: 'prostrating', label: '土下座', category: 'kneeling', prompt: 'prostrating, forehead on ground, submissive' },

    // --- LYING ---
    { id: 'lying_back', label: '仰向け (大の字)', category: 'lying', prompt: 'lying on back, spread eagle' },
    { id: 'lying_side', label: '横たわる (添い寝)', category: 'lying', prompt: 'lying on side, seductive gaze' },
    { id: 'lying_stomach', label: 'うつ伏せ', category: 'lying', prompt: 'lying on stomach, kicking legs' },
    { id: 'curled_up', label: '丸くなる', category: 'lying', prompt: 'curled up, fetal position' },
    { id: 'lying_v_pose', label: '仰向け開脚', category: 'lying', prompt: 'lying on back, legs up in V-shape' },
    { id: 'lying_on_stomach_back_view', label: 'うつ伏せ (尻強調)', category: 'lying', prompt: 'lying on stomach from behind, arching back, emphasis on butt' },
    { id: 'sleeping', label: '寝ている', category: 'lying', prompt: 'sleeping peacefully, lying down' },
    { id: 'pillow_hug', label: '抱き枕', category: 'lying', prompt: 'hugging pillow, lying on side' },

    // --- BACK VIEW ---
    { id: 'back_shot', label: '背面全体', category: 'back_view', prompt: 'from behind, back view' },
    { id: 'looking_over_shoulder_sexy', label: '肩越しに誘惑', category: 'back_view', prompt: 'looking over shoulder, seductive eyes, back view' },
    { id: 'showing_butt', label: 'お尻を見せる', category: 'back_view', prompt: 'showing butt, standing from behind' },
    { id: 'back_arch', label: '背中を反らす', category: 'back_view', prompt: 'arching back, back view, emphasis on spine and curves' },
    { id: 'back_stretch', label: '背伸び (後ろ姿)', category: 'back_view', prompt: 'stretching arms up, from behind' },

    // --- BONDAGE ---
    { id: 'tied_up', label: '後ろ手に繋がれる', category: 'bondage', prompt: 'hands tied behind back, bound' },
    { id: 'suspended', label: '吊り下げ (空挺)', category: 'bondage', prompt: 'suspended in air, ropes, helpless' },
    { id: 'blindfolded', label: '目隠し', category: 'bondage', prompt: 'blindfolded, kneeling' },
    { id: 'spread_eagle_bound', label: '大の字拘束', category: 'bondage', prompt: 'spread eagle, bound to cross' },
    { id: 'shibari', label: '亀甲縛り', category: 'bondage', prompt: 'shibari, rope bondage, intricate knots' },
    { id: 'gags', label: '猿ぐつわ', category: 'bondage', prompt: 'gagged, mouth open with ball gag' },
    { id: 'hogtied', label: 'ホッグタイ', category: 'bondage', prompt: 'hogtied, wrists and ankles bound together behind back' },

    // --- HUMILIATION ---
    { id: 'ahegao', label: 'アヘ顔', category: 'humiliation', prompt: 'ahegao, tongue out, rolling eyes up, drooling' },
    { id: 'presenting', label: 'お尻突き出し', category: 'humiliation', prompt: 'presenting, bending over, looking back' },
    { id: 'leashed', label: '犬の首輪', category: 'humiliation', prompt: 'wearing dog collar and leash, being led' },
    { id: 'begging', label: '命乞い・おねだり', category: 'humiliation', prompt: 'begging pose, hands together, teary eyes' },
    { id: 'forced_open', label: '無理やり広げられる', category: 'humiliation', prompt: 'legs being pulled apart, helpless expression' },
    { id: 'public_exposure', label: '公開露出', category: 'humiliation', prompt: 'public exposure, embarrassed, covering body' },

    // --- SEXUAL (POSITIONS) ---
    { id: 'missionary', label: '正常位', category: 'sexual', prompt: 'missionary position, intimacy, explicit pose' },
    { id: 'cowgirl', label: '騎乗位', category: 'sexual', prompt: 'cowgirl position, sitting on top' },
    { id: 'reverse_cowgirl', label: '背面騎乗位', category: 'sexual', prompt: 'reverse cowgirl, facing away while on top' },
    { id: 'doggy_style', label: 'バック', category: 'sexual', prompt: 'doggy style position, from behind' },
    { id: 'spooning_sex', label: '側位 (後ろから)', category: 'sexual', prompt: 'spooning sex position, from behind while lying' },
    { id: 'deep_missionary', label: '屈曲位', category: 'sexual', prompt: 'deep missionary, legs on shoulders' },
    { id: 'lifting_one_leg_sex', label: '立位片足上げ', category: 'sexual', prompt: 'standing sex, one leg lifted' },
    { id: 'piledriver', label: 'パイルドライバー', category: 'sexual', prompt: 'piledriver position, upside down, legs over head' },
    { id: 'mating_press', label: 'メイティングプレス', category: 'sexual', prompt: 'mating press, legs pinned back, intense' },

    // --- SEXUAL (ORAL & OTHERS) ---
    { id: 'fellatio', label: 'フェラチオ', category: 'sexual', prompt: 'fellatio pose, oral sex stance' },
    { id: 'irrumatio', label: 'ディープスロート', category: 'sexual', prompt: 'irrumatio, deep throat, face in crotch' },
    { id: 'cunnilingus', label: 'クンニ', category: 'sexual', prompt: 'cunnilingus pose' },
    { id: 'paizuri', label: 'パイズリ', category: 'sexual', prompt: 'paizuri pose, titjob' },
    { id: 'footjob', label: '足コキ', category: 'sexual', prompt: 'footjob, feet on crotch' },
    { id: 'handjob', label: '手コキ', category: 'sexual', prompt: 'handjob' },
    { id: 'facesitting', label: '顔面騎乗', category: 'sexual', prompt: 'facesitting, sitting on face' },
    { id: 'spitroast', label: '二本差し (3P)', category: 'sexual', prompt: 'spitroast position, double penetration' },
    { id: '69', label: '69', category: 'sexual', prompt: 'sixty-nine position, mutual oral' },

    // --- SEXUAL (FINISH) ---
    { id: 'jackpot', label: '中出しポーズ', category: 'sexual', prompt: 'creampie pose, messy, after sex' },
    { id: 'bukkake', label: 'ぶっかけ', category: 'sexual', prompt: 'bukkake, semen on face, messy' },
    { id: 'creampie_closeup', label: '中出し接写', category: 'sexual', prompt: 'creampie, fluids leaking, close up' },
    { id: 'cum_on_body', label: '体にぶっかけ', category: 'sexual', prompt: 'cum on body, messy, covered in semen' },
];
