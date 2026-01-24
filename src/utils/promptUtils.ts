export const getOptionPool = (val: string, data: Record<string, string[]>) => {
    if (!val || val === 'random') return 'randomly varied';
    const list = data[val];
    if (!list || list.length === 0) return val;
    return list.join(' | ');
};

export const getEnhancedPosePool = (stanceId: string, _themeId: string, stanceData: Record<string, string[]>) => {
    let pool: string[] = [];
    if (stanceId !== 'random' && stanceData[stanceId]) {
        pool.push(...stanceData[stanceId]);
    }
    if (stanceId === 'model') {
        pool.push('professional fashion model posture, weight shift, contrapposto stance, high fashion editorial pose');
    }
    return pool.length > 0 ? pool.join(' | ') : 'varied artistic pose';
};

export const getEnhancedExpressionPool = (expressionId: string, _themeId: string, expressionData: Record<string, string[]>) => {
    let pool: string[] = [];
    if (expressionId !== 'random' && expressionData[expressionId]) {
        pool.push(...expressionData[expressionId]);
    }
    if (expressionId === 'model') {
        pool.push('professional model expression, confident gaze, elegant and composed facial expression, fashion photography style');
    }
    return pool.length > 0 ? pool.join(' | ') : 'varied natural expression';
};
