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
import { ANIME_ITEMS } from './items/anime';

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
    { id: 'active', label: 'アクティブ (Active)' },
    { id: 'casual', label: 'カジュアル (Casual)' },
    { id: 'fantasy', label: 'ファンタジー (Fantasy)' },
    { id: 'fetish', label: 'フェティッシュ (Fetish)' },
    { id: 'pop', label: 'ポップ (Pop)' },
    { id: 'dark', label: 'ダーク (Dark)' },
    { id: 'anime', label: 'アニメ (Anime)' },
];

export { ACCESSORIES_LIST, ACCESSORY_CATEGORIES, type AccessoryItem, ALL_BACKGROUNDS as BACKGROUND_SETTINGS, BACKGROUND_CATEGORIES, POSE_ARCHETYPES as POSE_SETTINGS };

// Helper to filter items by tag or presence in specific lists
export const ALL_ITEMS = [
    ...CASUAL_ITEMS,
    ...UNIFORM_ITEMS,
    ...FANTASY_TRADITIONAL_ITEMS,
    ...SCIFI_SUBCULTURE_GOTHIC_ITEMS,
    ...SPECIAL_FETISH_ITEMS,
    ...VARIETY_ITEMS,
    ...BULK_ITEMS,
    ...MEGA_ITEMS,
    ...ANIME_ITEMS,
];

export const COSTUME_LIST: Record<string, CostumeItem[]> = {
    cool: ALL_ITEMS.filter(item => item.tags.includes('cool') || item.tags.includes('sci-fi') || item.tags.includes('cyber') || item.tags.includes('future') || item.tags.includes('mecha')),
    cute: ALL_ITEMS.filter(item => item.tags.includes('cute') || item.tags.includes('animal') || item.tags.includes('ears') || item.tags.includes('tail') || item.tags.includes('lovely')),
    sexy: ALL_ITEMS.filter(item => item.tags.includes('sexy') || item.tags.includes('beach') || item.tags.includes('swim') || item.tags.includes('water') || item.tags.includes('lingerie')),
    elegant: ALL_ITEMS.filter(item => item.tags.includes('elegant') || item.tags.includes('formal') || item.tags.includes('luxury') || item.tags.includes('party') || item.tags.includes('bridal')),
    active: ALL_ITEMS.filter(item => item.tags.includes('active') || item.tags.includes('sporty') || item.tags.includes('sports') || item.tags.includes('athletic') || item.tags.includes('action')),
    casual: ALL_ITEMS.filter(item => item.tags.includes('casual') || item.tags.includes('daily') || item.tags.includes('home') || item.tags.includes('pajamas') || item.tags.includes('relax')),
    fantasy: ALL_ITEMS.filter(item => item.tags.includes('fantasy') || item.tags.includes('magic') || item.tags.includes('historical') || item.tags.includes('traditional') || item.tags.includes('japanese')),
    fetish: ALL_ITEMS.filter(item => item.tags.includes('fetish') || item.tags.includes('maid') || item.tags.includes('nurse') || item.tags.includes('uniform') || item.tags.includes('tight')),
    pop: ALL_ITEMS.filter(item => item.tags.includes('pop') || item.tags.includes('idol') || item.tags.includes('subculture') || item.tags.includes('vibrant') || item.tags.includes('trendy')),
    dark: ALL_ITEMS.filter(item => item.tags.includes('dark') || item.tags.includes('gothic') || item.tags.includes('horror') || item.tags.includes('blood') || item.tags.includes('scary')),
    anime: ALL_ITEMS.filter(item => item.tags.includes('anime')),
};
