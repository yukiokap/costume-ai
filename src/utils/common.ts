/**
 * Clean up the prompt string to ensure proper comma spacing and no illegal characters.
 */
export const sanitizePrompt = (text: string): string => {
    if (!text) return '';

    return text
        // Replace remaining camera-related slang with standard terms
        .replace(/\bwalking away from camera\b/gi, 'walking away, from behind')
        .replace(/\b(looking|turning) away from camera\b/gi, '$1 away, looking back')
        .replace(/\btowards? camera\b/gi, 'towards viewer')
        .replace(/\b(at|to) camera\b/gi, 'at viewer')
        // Remove individual forbidden words and studio equipment
        .replace(/\b(camera|dslr|lens|tripod)\b/gi, '')
        .replace(/\b(photo|photography)?\s*studio\b/gi, '')
        .replace(/\b(lighting|studio)\s*equipment\b/gi, '')
        .replace(/\b(bone|spine)\b/gi, '')
        .replace(/\brandom\b/gi, '')
        // Cleanup structure
        .split(',')
        .map(part => part.trim())
        .filter(part => part.length > 0 && part.toLowerCase() !== 'from')
        .join(', ')
        .replace(/,\s*,/g, ',')
        .trim();
};

/**
 * Fallback ID generator if crypto.randomUUID is missing
 */
export const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};
