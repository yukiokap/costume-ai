
export const getErrorMessage = (error: any, t: (key: string) => string): string => {
    const errorString = error?.toString() || '';
    const message = error?.message || errorString;

    if (message.includes('400') || message.includes('API key not valid')) {
        return t('errors.api_key_invalid');
    }
    if (message.includes('429') || message.includes('quota')) {
        return t('errors.quota_exceeded');
    }
    if (message.includes('SAFETY') || message.includes('blocked')) {
        return t('errors.safety_block');
    }
    if (message.includes('fetch') || message.includes('network')) {
        return t('errors.network_error');
    }

    return `${t('errors.unknown')} ${message}`;
};
