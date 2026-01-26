export const getOptionPool = (val: string, data: Record<string, string[]>, count: number = 1) => {
    if (!val || val === 'random') {
        const keys = Object.keys(data);
        if (count > 1) {
            // Return multiple options for batch generation
            const pool = keys.flatMap(k => data[k]);
            return pool.sort(() => 0.5 - Math.random()).slice(0, Math.min(count, 12)).join(' | ');
        }

        // Single pick
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const pool = data[randomKey];
        if (!pool || pool.length === 0) return '';
        return pool[Math.floor(Math.random() * pool.length)];
    }
    const list = data[val];
    if (!list || list.length === 0) return val;
    return list.join(' | ');
};

export const getEnhancedPosePool = (stanceId: string, moodData: Record<string, string[]>, stanceData: Record<string, string[]>, count: number = 1) => {
    if (stanceId === 'random') {
        const allTags = [
            ...Object.values(moodData).flat(),
            ...Object.values(stanceData).flat()
        ];

        if (count > 1) {
            // Return multiple distinct high-quality poses
            return allTags.sort(() => 0.5 - Math.random()).slice(0, Math.min(count, 12)).join(' | ');
        }

        // Pick 1 specific, detailed pose
        return allTags[Math.floor(Math.random() * allTags.length)];
    }

    let pool: string[] = [];
    if (stanceData[stanceId]) {
        pool.push(...stanceData[stanceId]);
    }
    if (stanceId === 'model') {
        pool.push('professional fashion model posture, weight shift, contrapposto stance, high fashion editorial pose');
    }
    return pool.length > 0 ? pool.join(' | ') : 'varied artistic pose';
};

export const getEnhancedExpressionPool = (expressionId: string, expressionData: Record<string, string[]>, count: number = 1) => {
    if (expressionId === 'random') {
        const allTags = Object.values(expressionData).flat();

        if (count > 1) {
            return allTags.sort(() => 0.5 - Math.random()).slice(0, Math.min(count, 12)).join(' | ');
        }

        // Pick 1 specific expression
        return allTags[Math.floor(Math.random() * allTags.length)];
    }

    let pool: string[] = [];
    if (expressionData[expressionId]) {
        pool.push(...expressionData[expressionId]);
    }
    if (expressionId === 'model') {
        pool.push('professional model expression, confident gaze, elegant and composed facial expression, fashion photography style');
    }
    return pool.length > 0 ? pool.join(' | ') : 'varied natural expression';
};
