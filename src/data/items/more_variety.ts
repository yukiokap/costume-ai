import type { CostumeItem } from '../costumes';

export const VARIETY_ITEMS: CostumeItem[] = [
    // Winter / Outdoor
    { jp: 'スキーウェア', en: 'colorful ski suit', tags: ['winter', 'active', 'outdoor'] },
    { jp: 'スノーボードウェア', en: 'loose snowboard gear', tags: ['winter', 'street', 'active'] },
    { jp: '厚手のポンチョ', en: 'heavy wool poncho', tags: ['winter', 'bohemian'] },
    { jp: 'イヤーマフと防寒着', en: 'winter gear with earmuffs', tags: ['winter', 'cute'] },
    { jp: 'ハンティングジャケット', en: 'hunting jacket', tags: ['rugged', 'outdoor'] },
    { jp: 'フィッシングベスト', en: 'fishing vest with pockets', tags: ['utility', 'outdoor'] },

    // Vintage / Retro
    { jp: '50年代風ドレス', en: '1950s rockabilly dress', tags: ['retro', 'classic', 'vintage'] },
    { jp: '60年代風ミニワンピ', en: '1960s mod mini dress', tags: ['retro', '60s', 'colorful'] },
    { jp: '70年代風ヒッピー服', en: '1970s bohemian hippie outfit', tags: ['retro', '70s', 'bohemian'] },
    { jp: '80年代風パワーショルダー', en: '1980s power shoulder suit', tags: ['retro', '80s', 'bold'] },
    { jp: '90年代風グランジ', en: '1990s grunge fashion', tags: ['retro', '90s', 'cool'] },
    { jp: 'ヴィクトリアン朝の喪服', en: 'victorian mourning dress', tags: ['historical', 'dark', 'elegant'] },

    // Stage / Idol
    { jp: 'キラキラのアイドル衣装', en: 'sparkly idol performance outfit', tags: ['idol', 'stage', 'pink'] },
    { jp: 'クールなアイドル衣装', en: 'cool idol performance outfit', tags: ['idol', 'stage', 'blue'] },
    { jp: 'ポップなアイドル衣装', en: 'pop idol performance outfit', tags: ['idol', 'stage', 'yellow'] },
    { jp: 'ダンス用スパンコール衣装', en: 'sequiner dance costume', tags: ['stage', 'performance'] },
    { jp: '昭和アイドル風ワンピ', en: '80s japanese idol dress', tags: ['retro', 'idol', 'cute'] },
    { jp: '王道アイドル(フリル盛り)', en: 'over-the-top frilled idol dress', tags: ['idol', 'frills', 'heavy'] },

    // Ethnic - Expanded
    { jp: 'モン族の服(刺繍)', en: 'embroidered hmong traditional attire', tags: ['ethnic', 'colorful'] },
    { jp: 'チベット民族衣装', en: 'tibetan traditional chuba', tags: ['ethnic', 'warm'] },
    { jp: 'マサイ族風の装束', en: 'maasai inspired tribal wear', tags: ['ethnic', 'red'] },
    { jp: 'ウクライナの刺繍服', en: 'ukrainian vyshyvanka shirt', tags: ['ethnic', 'white', 'embroidery'] },
    { jp: '北欧の民俗衣装', en: 'scandinavian folk dress', tags: ['ethnic', 'cute'] },
    { jp: 'ハワイアン・フラ衣装', en: 'hula dance grass skirt', tags: ['summer', 'beach', 'dance'] },

    // Fantasy - Extra
    { jp: 'ドッペルゲンガーの黒い影', en: 'doppelganger shadow form outfit', tags: ['dark', 'fantasy', 'scary'] },
    { jp: '森の隠者のボロ服', en: 'forest hermit tattered robes', tags: ['nature', 'mysterious'] },
    { jp: '竜の巫女の聖装', en: 'dragon priestess sacred gown', tags: ['dragon', 'holy', 'fantasy'] },
    { jp: '砂漠の盗賊(ターバン)', en: 'desert bandit with turban', tags: ['adventure', 'rugged'] },
    { jp: '氷の女王のドレス', en: 'ice queen crystal gown', tags: ['blue', 'cold', 'elegant'] },

    // Specific Career
    { jp: '宇宙飛行士(船内服)', en: 'astronaut jump suit', tags: ['space', 'future'] },
    { jp: '探検家のスーツ(サファリ)', en: 'explorer safari suit', tags: ['adventure', 'beige'] },
    { jp: '執事(テールコート)', en: 'butler formal tailcoat', tags: ['formal', 'servant'] },
    { jp: 'メイド(ロングエプロン)', en: 'traditional long apron maid', tags: ['classic', 'maid'] },
    { jp: 'ニュースキャスターの服', en: 'news anchor professional suit', tags: ['smart', 'office'] },
    { jp: 'プログラマー(パーカーとヘッドホン)', en: 'programmer with hoodie and headphones', tags: ['casual', 'modern'] },

    // Subculture - Extra
    { jp: '地雷系(くま耳付き)', en: 'jirai-kei with bear ears', tags: ['cute', 'dark-girly'] },
    { jp: '量産型(猫耳付き)', en: 'ryousangata with cat ears', tags: ['cute', 'girly'] },
    { jp: 'サイバー(蓄光素材)', en: 'cyber glow-in-the-dark outfit', tags: ['neon', 'future'] },
    { jp: 'パンク(格子柄スカート)', en: 'punk tartan skirt outfit', tags: ['rock', 'cool'] },
    { jp: '原宿パステルファッション', en: 'harajuku pastel fairy kei', tags: ['pastel', 'cute'] },

    // Random/Niche
    { jp: '全身タイツ(グリーン)', en: 'green full body morphsuit', tags: ['funny', 'tight'] },
    { jp: '全身タイツ(ゴールド)', en: 'golden full body tight suit', tags: ['shiny', 'funny'] },
    { jp: 'ヒーロー戦隊の変身スーツ', en: 'sentai team transformation suit', tags: ['hero', 'helmet'] },
    { jp: '悪の組織の戦闘員', en: 'evil organization henchman outfit', tags: ['dark', 'cool'] },
    { jp: 'ヴィラン(悪役)の豪華な服', en: 'villainous extravagant attire', tags: ['dark', 'royal', 'evil'] },

    // Final Batches to fill gaps
    { jp: 'レースのベビードール', en: 'delicate lace baby-doll', tags: ['sexy', 'inner'] },
    { jp: 'シルクのガウン', en: 'long silk bathrobe gown', tags: ['luxury', 'home'] },
    { jp: 'オーバーサイズのセーターのみ', en: 'wearing only an oversized sweater', tags: ['sexy', 'home', 'soft'] },
    { jp: 'スクールジャージ(芋ジャージ)', en: 'old style school tracksuit', tags: ['retro', 'school'] },
    { jp: '和服(モダンアレンジ)', en: 'modern mix style kimono', tags: ['japanese', 'fashion'] },
    { jp: 'チャイナワンピ(現代風)', en: 'modern chinese style dress', tags: ['chinese', 'fashion'] },
];
