import { CASUAL_ITEMS } from './items/casual';
import { UNIFORM_ITEMS } from './items/uniform';
import { FANTASY_TRADITIONAL_ITEMS } from './items/fantasy_traditional';
import { SCIFI_SUBCULTURE_GOTHIC_ITEMS } from './items/scifi_subculture_gothic';
import { SPECIAL_FETISH_ITEMS } from './items/special_fetish';
import { VARIETY_ITEMS } from './items/more_variety';
import { BULK_ITEMS } from './items/bulk_expansion';
import { MEGA_ITEMS } from './items/mega_expansion';
import { ACCESSORIES_LIST, ACCESSORY_CATEGORIES, type AccessoryItem } from './items/accessories';
import { ALL_BACKGROUNDS, BACKGROUND_CATEGORIES } from './backgrounds';
import { POSE_ARCHETYPES } from './poses';

export interface CostumeItem {
    jp: string;
    en: string;
    tags: string[];
}

export const FASHION_CATEGORIES = [
    { id: 'random', label: 'おまかせ (Random)' },
    { id: 'cool', label: 'クール (Cool)' },
    { id: 'cute', label: 'キュート (Cute)' },
    { id: 'sexy', label: 'セクシー (Sexy)' },
    { id: 'elegant', label: 'エレガント (Elegant)' },
    { id: 'natural', label: 'ナチュラル (Natural)' },
];

export { ACCESSORIES_LIST, ACCESSORY_CATEGORIES, type AccessoryItem, ALL_BACKGROUNDS as BACKGROUND_SETTINGS, BACKGROUND_CATEGORIES, POSE_ARCHETYPES as POSE_SETTINGS };

// Helper to filter items by tag or presence in specific lists
const ALL_ITEMS = [
    ...CASUAL_ITEMS,
    ...UNIFORM_ITEMS,
    ...FANTASY_TRADITIONAL_ITEMS,
    ...SCIFI_SUBCULTURE_GOTHIC_ITEMS,
    ...SPECIAL_FETISH_ITEMS,
    ...VARIETY_ITEMS,
    ...BULK_ITEMS,
    ...MEGA_ITEMS,
];

export const COSTUME_LIST: Record<string, CostumeItem[]> = {
    casual: ALL_ITEMS.filter(item => item.tags.includes('casual') || item.tags.includes('loose') || item.tags.includes('daily')),
    uniform: ALL_ITEMS.filter(item => item.tags.includes('uniform') || item.tags.includes('student') || item.tags.includes('office') || item.tags.includes('work') || item.tags.includes('medical')),
    fantasy: ALL_ITEMS.filter(item => item.tags.includes('fantasy') || item.tags.includes('magic') || item.tags.includes('warrior') || item.tags.includes('rpg') || item.tags.includes('knight')),
    traditional: ALL_ITEMS.filter(item => item.tags.includes('japanese') || item.tags.includes('traditional') || item.tags.includes('historical') && !item.tags.includes('fantasy')),
    scifi: ALL_ITEMS.filter(item => item.tags.includes('sci-fi') || item.tags.includes('cyber') || item.tags.includes('future') || item.tags.includes('mecha')),
    gothic: ALL_ITEMS.filter(item => item.tags.includes('gothic') || item.tags.includes('lolita') || item.tags.includes('vintage') && !item.tags.includes('retro')),
    formal: ALL_ITEMS.filter(item => item.tags.includes('formal') || item.tags.includes('elegant') || item.tags.includes('luxury') || item.tags.includes('party')),
    sportswear: ALL_ITEMS.filter(item => item.tags.includes('sporty') || item.tags.includes('active') || item.tags.includes('sports') || item.tags.includes('athletic')),
    swimwear: ALL_ITEMS.filter(item => item.tags.includes('beach') || item.tags.includes('swim') || item.tags.includes('water')),
    subculture: ALL_ITEMS.filter(item => item.tags.includes('subculture') || item.tags.includes('jirai-kei') || item.tags.includes('ryousangata') || item.tags.includes('kawaii') || item.tags.includes('harajuku')),
    horror: ALL_ITEMS.filter(item => item.tags.includes('horror') || item.tags.includes('scary') || item.tags.includes('creepy') || item.tags.includes('blood')),
    animal: ALL_ITEMS.filter(item => item.tags.includes('animal') || item.tags.includes('ears') || item.tags.includes('tail')),
    fantasy_jobs: ALL_ITEMS.filter(item => item.tags.includes('magic') || item.tags.includes('wizard') || item.tags.includes('summoner') || item.tags.includes('servant') && item.tags.includes('gentleman')),
    ethnic: ALL_ITEMS.filter(item => item.tags.includes('ethnic') || item.tags.includes('tribal') || item.tags.includes('world')),
    stage: ALL_ITEMS.filter(item => item.tags.includes('stage') || item.tags.includes('idol') || item.tags.includes('performance') || item.tags.includes('dance')),
    pajamas: ALL_ITEMS.filter(item => item.tags.includes('home') || item.tags.includes('nightwear') || item.tags.includes('relax')),
    fetish: ALL_ITEMS.filter(item => item.tags.includes('sexy') || item.tags.includes('fetish') || item.tags.includes('tight') || item.tags.includes('extreme') || item.tags.includes('bondage')),
    other: ALL_ITEMS.filter(item => item.tags.includes('funny') || item.tags.includes('gift') || item.tags.includes('box')),
};
