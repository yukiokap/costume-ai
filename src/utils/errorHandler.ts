
export const getErrorMessage = (error: unknown, t: (key: string) => string): string => {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes('400') || message.includes('API key not valid')) {
        return t('results.errors.api_key_invalid');
    }
    if (message.includes('429') || message.includes('quota')) {
        return t('results.errors.quota_exceeded');
    }
    if (message.includes('SAFETY') || message.includes('blocked')) {
        return t('results.errors.safety_block');
    }
    if (message.includes('fetch') || message.includes('network')) {
        return t('results.errors.network_error');
    }

    return `${t('results.errors.unknown')} ${message}`;
};

