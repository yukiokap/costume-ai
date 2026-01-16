export interface BackgroundItem {
    id: string;
    label: string;
    category: string;
    prompt: string;
}

export const BACKGROUND_CATEGORIES = [
    { id: 'basic', label: '基本・シンプル' },
    { id: 'interior', label: '室内・ライブ' },
    { id: 'nature', label: '自然・風景' },
    { id: 'urban', label: '都会・夜景' },
    { id: 'school', label: '学校・公共施設' },
    { id: 'fantasy', label: 'ファンタジー・歴史' },
    { id: 'scifi', label: 'SF・近未来' },
    { id: 'horror', label: 'ホラー・特殊' },
    { id: 'adult', label: 'プライベート・セクシー' },
];

export const ALL_BACKGROUNDS: BackgroundItem[] = [
    // --- BASIC ---
    { id: 'none', label: '指定なし', category: 'basic', prompt: '' },
    { id: 'simple_white', label: '純白の背景', category: 'basic', prompt: 'simple background, white background' },
    { id: 'simple_black', label: '暗黒の背景', category: 'basic', prompt: 'simple background, black background' },
    { id: 'simple_gray', label: 'グレーの背景', category: 'basic', prompt: 'simple background, grey background' },
    { id: 'studio_light', label: '撮影スタジオ (白羽)', category: 'basic', prompt: 'photo studio, bright soft lighting, high-end photography' },
    { id: 'studio_dark', label: '撮影スタジオ (ドラマチック)', category: 'basic', prompt: 'photo studio, low key lighting, dramatic shadows' },

    // --- INTERIOR ---
    { id: 'bedroom', label: '落ち着いた寝室', category: 'interior', prompt: 'indoor, bedroom, soft bed, morning sunlight from window' },
    { id: 'living_room', label: 'モダンなリビング', category: 'interior', prompt: 'indoor, luxury living room, sofa, house plants' },
    { id: 'kitchen', label: '家庭的なキッチン', category: 'interior', prompt: 'indoor, kitchen, marble counter, cooking tools' },
    { id: 'library', label: '古びた図書室', category: 'interior', prompt: 'indoor, library, wooden bookshelves, thousands of books, dust motes' },
    { id: 'bar', label: 'ジャズバー', category: 'interior', prompt: 'indoor, bar counter, dim amber lighting, bottles, glasses' },
    { id: 'stage_idol', label: 'ライブステージ (アイドル)', category: 'interior', prompt: 'indoor, concert stage, flashing colorful lights, spotlight, stage fog' },
    { id: 'stage_rock', label: 'ライブハウス (ロック)', category: 'interior', prompt: 'indoor, dark live house, speakers, rock stage lighting' },
    { id: 'cafe', label: 'テラスカフェ', category: 'interior', prompt: 'indoor, stylish cafe, wooden tables, coffee aroma atmosphere' },

    // --- NATURE ---
    { id: 'forest_day', label: '陽光の森', category: 'nature', prompt: 'outdoor, lush forest, sunbeams through leaves, majestic trees' },
    { id: 'forest_night', label: '月夜の森', category: 'nature', prompt: 'outdoor, dark forest, moonlight, glowing fireflies' },
    { id: 'beach_day', label: '南国のビーチ', category: 'nature', prompt: 'outdoor, tropical beach, white sand, turquoise ocean, sun' },
    { id: 'beach_sunset', label: '夕暮れの浜辺', category: 'nature', prompt: 'outdoor, beach at sunset, orange sky, calm waves' },
    { id: 'mountain_snow', label: '雪山', category: 'nature', prompt: 'outdoor, snowy mountain, blue sky, frozen peak' },
    { id: 'meadow', label: '花咲く草原', category: 'nature', prompt: 'outdoor, field of flowers, meadows, blue sky, windy' },
    { id: 'waterfall', label: '神秘的な滝', category: 'nature', prompt: 'outdoor, waterfall, mist, mossy rocks, splashing water' },
    { id: 'underwater', label: '水中 (深い海)', category: 'nature', prompt: 'underwater, deep blue sea, bubbles, sunrays piercing water' },

    // --- URBAN ---
    { id: 'city_day', label: '活気ある都会', category: 'urban', prompt: 'outdoor, modern city street, skyscrapers, pedestrians' },
    { id: 'city_night', label: '都会の夜景 (ネオン)', category: 'urban', prompt: 'outdoor, night city, neon signs, rainy street, reflections' },
    { id: 'rooftop', label: '高層ビルの屋上', category: 'urban', prompt: 'outdoor, rooftop, cityscape background, evening sky' },
    { id: 'alleyway', label: '路地裏', category: 'urban', prompt: 'outdoor, back alley, brick walls, neon signs, trash cans' },
    { id: 'train_station', label: '駅のホーム', category: 'urban', prompt: 'indoor, futuristic train station, railway, passengers' },
    { id: 'luxury_hotel', label: '高級ホテルのロビー', category: 'urban', prompt: 'indoor, luxury hotel lobby, chandelier, polished floor' },

    // --- SCHOOL ---
    { id: 'classroom', label: '午後の教室', category: 'school', prompt: 'indoor, school classroom, wooden desks, blackboard, sunset from window' },
    { id: 'corridor', label: '誰もいない廊下', category: 'school', prompt: 'indoor, school corridor, lockers, perspective view, quiet' },
    { id: 'gymnasium', label: '体育館', category: 'school', prompt: 'indoor, school gym, wooden floor, high ceiling' },
    { id: 'rooftop_school', label: '学校の屋上', category: 'school', prompt: 'outdoor, school rooftop, wire fence, wide blue sky' },
    { id: 'pool_school', label: 'プールサイド', category: 'school', prompt: 'outdoor, school pool, turquoise water, chlorine smell atmosphere' },
    { id: 'infirmary', label: '保健室', category: 'school', prompt: 'indoor, school infirmary, white curtains, clinic bed' },

    // --- FANTASY ---
    { id: 'castle_hall', label: '王城の大広間', category: 'fantasy', prompt: 'indoor, medieval castle hall, red carpet, stone pillars' },
    { id: 'castle_garden', label: '王城の庭園', category: 'fantasy', prompt: 'outdoor, majestic palace garden, fountains, blooming roses' },
    { id: 'magic_tower', label: '魔法使いの塔', category: 'fantasy', prompt: 'indoor, wizard tower, floating crystals, magical orbs' },
    { id: 'ruins', label: '古代の遺跡', category: 'fantasy', prompt: 'outdoor, overgrown ruins, stone statues, jungle' },
    { id: 'japanese_temple', label: '静寂の寺社', category: 'fantasy', prompt: 'outdoor, japanese temple, torii gate, cherry blossoms' },
    { id: 'shrine', label: '幻想的な神社', category: 'fantasy', prompt: 'outdoor, mystical japanese shrine, spirit lanterns, fog' },
    { id: 'dungeon', label: '地下ダンジョン', category: 'fantasy', prompt: 'indoor, dark dungeon, stone walls, torches, skeletons' },
    { id: 'floating_island', label: '空中浮遊島', category: 'fantasy', prompt: 'outdoor, islands floating in sky, clouds, magical atmosphere' },

    // --- SCIFI ---
    { id: 'spaceship_bridge', label: '宇宙船のブリッジ', category: 'scifi', prompt: 'indoor, spaceship cockpit, holographic screens, star view from windows' },
    { id: 'cyberspace', label: 'サイバー空間', category: 'scifi', prompt: 'digital world, floating binary data, neon grid, virtual reality' },
    { id: 'cyberpunk_city', label: 'サイバーパンク・スラム', category: 'scifi', prompt: 'outdoor, cyberpunk city, rainy, overpopulated, neon lights' },
    { id: 'hightech_lab', label: 'ハイテク研究所', category: 'scifi', prompt: 'indoor, high tech laboratory, white robots, computer servers' },
    { id: 'post_apoc_desert', label: '終末の砂漠', category: 'scifi', prompt: 'outdoor, post-apocalyptic wasteland, ruins, sandstorm' },
    { id: 'mecha_hangar', label: '巨大ロボ格納庫', category: 'scifi', prompt: 'indoor, mecha hangar, giant robots, sparks from welding' },

    // --- HORROR ---
    { id: 'abandoned_hospital', label: '廃病院', category: 'horror', prompt: 'indoor, creepy abandoned hospital, blood splatters, flickering lights' },
    { id: 'dark_church', label: '闇の教会', category: 'horror', prompt: 'indoor, dark gothic church, upside down crosses, shadows' },
    { id: 'graveyard', label: '霧の墓地', category: 'horror', prompt: 'outdoor, graveyard at night, fog, tombstones, ghost shapes' },
    { id: 'hell', label: '燃え盛る地獄', category: 'horror', prompt: 'hell landscape, fire, brimstone, scorched earth' },
    { id: 'liminal_space', label: 'リミナルスペース', category: 'horror', prompt: 'infinite yellow hallway, empty fluorescent lights, backrooms style' },

    // --- ADULT / PRIVATE ---
    { id: 'silk_bed', label: 'シルクのベッドの上', category: 'adult', prompt: 'indoor, on a bed, silk satin sheets, soft pillows, intimate lighting' },
    { id: 'love_hotel', label: 'ラブホテルの室内', category: 'adult', prompt: 'indoor, love hotel room, neon pink lights, luxury bed, mirrors on ceiling' },
    { id: 'red_light', label: '夜の歓楽街', category: 'adult', prompt: 'outdoor, red-light district at night, glowing neon red signs, seductive atmosphere' },
    { id: 'backstage', label: '劇場の楽屋', category: 'adult', prompt: 'indoor, theater dressing room, makeup mirrors with lights, costumes hanging, intimate mess' },
    { id: 'on_desk', label: '深夜のオフィス (机の上)', category: 'adult', prompt: 'indoor, empty office at night, sitting on a desk, city lights from window, dim light' },
    { id: 'shower_room', label: 'シャワールーム (湯気)', category: 'adult', prompt: 'indoor, shower room, steamed glass, water droplets, wet atmosphere' },
    { id: 'prison_cell', label: '秘密の監獄', category: 'adult', prompt: 'indoor, dungeon prison cell, iron bars, dark stone walls, chains' },
    { id: 'club_vip', label: 'ナイトクラブのVIP室', category: 'adult', prompt: 'indoor, luxury nightclub VIP room, velvet sofa, dim purple lighting, champagne' },
];
